import {hasItStoped,setCurrentDriver,setDriverStatus,setELD,setTrackingTimeStamp,startEldApp,startVehicleMeters,} from "../../redux/actions";
import React, { useState, useCallback, useEffect } from "react";
import { Alert,StyleSheet, View,ScrollView, Modal, Image, Dimensions, BackHandler, TouchableOpacity } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "@react-navigation/native";
import { authDriver, eld, getCarriersOptions} from "../../data/commonQuerys";
import { getCurrentDriver } from "../../config/localStorage";
import { useSelector, useDispatch } from "react-redux";
import * as Location from "expo-location";
import { Audio } from "expo-av";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { isStillDriving } from "../../components/eldFunctions";
import { app, auth } from '../../config/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth';
import CountryFlag from "react-native-country-flag";
import { checkAndRequestBluetoothScanPermission } from '../bluetooth/constructor';

const languageModule = require('../../global_functions/variables');
const { width } = Dimensions.get("window");

const LoginScreen = ({navigation}) => {

  const dispatch = useDispatch();

  //Declaraciones de variables
  const [carriers, setCarriers] = useState([]);
  const [selectedCarrier, setSelectedCarrier] = useState(null);
  const [showMotionAlert, setShowMotionAlert] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [usuario, setusuario] = useState({});
  const [password,setpassword] = useState('');
  const [sound, setSound] = useState();
  const [driver, setDriver] = useState({});
  const [language, setLanguage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [languageOptions, setLanguageOptions] = useState([]);
  const {eldData,driverStatus,currentDriver,acumulatedVehicleKilometers,lastDriverStatus} = useSelector((state) => state.eldReducer);
  const [eldAccuracy, setEldAccuracy] = useState(0.02);
  const [currentCords, setCurrentCords] = useState({});
  const [driverDistance, setDrivedDistance] = useState(0);
  const [backClickCount, setBackClickCount] = useState(0);

  console.log("status: ", driverStatus);
  
  //Obtenemos los permisos de ubicacion con efectos
  useEffect(() => {
    const requestPermissions = async () => {
      let granted = await checkAndRequestBluetoothScanPermission();
      while (!granted) {
        granted = await checkAndRequestBluetoothScanPermission();
      }

      if (granted) {
        console.log('Los permisos se concedieron');
        // Realizar acciones cuando se concedan los permisos
      } else {
        console.log('Los permisos no se concedieron');
        // Manejar el caso en el que los permisos no se concedan
      }
    };

    requestPermissions();
  }, []);
  //Obtenemos la ubicacion con efectos
  useEffect(() => {
    const startLocationTracking = async () => {
      const foregroundPermission = await Location.requestForegroundPermissionsAsync();

      if (!foregroundPermission.granted) {
        console.log("Please grant location permissions");
        return;
      }

      const locationOptions = {
        accuracy: Location.Accuracy.High,
        distanceInterval: 5,
      };

      const updateLocation = async () => {
        const currentLocation = await Location.getCurrentPositionAsync(locationOptions);
        setCurrentCords({ ...currentLocation.coords, timestamp: currentLocation.timestamp });
      };

      // Actualizar la ubicación inicial
      updateLocation();

      // Establecer un intervalo para actualizar continuamente la ubicación
      const locationInterval = setInterval(updateLocation, 5000); // Actualizar cada 5 segundos (ajústalo según tu necesidad)

      return () => clearInterval(locationInterval); // Limpiar el intervalo al desmontar el componente
    };

    startLocationTracking();
  }, []);

  // Obtener la lista de carriers cuando el componente se monta
  useEffect(() => {
    const fetchCarriers = async () => {
      try {
        const carriersList = await getCarriersOptions();
        setCarriers(carriersList.map(carrier => ({
          label: carrier.name,
          value: carrier.id,
        })))
      } catch (error) {
        console.error('Error fetching carriers:', error);
      }
    };

    fetchCarriers();
  }, []);


  //usamos el efecto focus para usar la funcion backaction
  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", backAction);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, [backAction])
  );

  //obtenemes el estado del conductor para mandar el sonido en caso de que sea D
  useEffect(() => {
    if (driverStatus == "D" && currentDriver == null) {
      playSound();
    }
  }, [driverStatus]);
  
  //Usamos el efecto para obtener datos del eld currancy
  useEffect(() => {
    async function getData() {
      try {
        dispatch(startEldApp());
  
        await getCurrentDriver().then(async (currentDriver) => {
        if (currentDriver) {    
        return await eld.getAccuracy(currentDriver.carrierID,currentDriver.cmv.id).then(async (accuracy) => {
            setEldAccuracy(accuracy);
            return await AsyncStorage.setItem(
              "eldAccuracy",
              JSON.stringify({ accuracy: accuracy })
              ).then(async () => {
                    return await startLocationTraking().then(async () => {

                });
              })
           });
        }});
      } catch (error) {
        console.log("Error al obtener datos del ELD:", error);
      }
    }
    getData();
  }, []);

  //Usamos el efecto para obtener datos del ELD 
  useEffect(() => {
    if (eldData) {
      dispatch(
        setDriverStatus(
          eldData,
          currentDriver,
          driverStatus,
          acumulatedVehicleKilometers,
          lastDriverStatus,
          1
        )
      );
      setTimeout(() => {
        dispatch(
          hasItStoped(
            eldData,
            currentDriver,
            driverStatus,
            acumulatedVehicleKilometers,
            lastDriverStatus
          )
        );
      }, 3000);
    }
  }, [eldData]);

  // Obtenermos nuestro current language desde el AsyncStorage
  useEffect(() => {
    const getPreferredLanguage = async () => {
        const language = await AsyncStorage.getItem('preferredLanguage');
        setSelectedLanguage(language || '');
    };
    getPreferredLanguage();
    
    // Opciones de idioma disponibles
    const options = [
      { label: 'English', value: 'Eng', flag: 'US' },
      { label: 'Español', value: 'Esp', flag: 'MX' },
    ];
    setLanguageOptions(options);
  }, []);

  
  //Funciones a usar
  const startLocationTraking = async () => {
    const foregroundPermission =
      await Location.requestForegroundPermissionsAsync();

    if (!foregroundPermission.granted) {
      console.log("Please grant location permissions");
      return;
    }

    return Location.watchPositionAsync(
      {
        // Tracking options
        accuracy: Location.Accuracy.High,
        // timeInterval: 3000,
        distanceInterval: 5,
      },
      async (location) => {
        /* Location object example:
        {
          coords: {
            accuracy: 20.100000381469727,
            altitude: 61.80000305175781,
            altitudeAccuracy: 1.3333333730697632,
            heading: 288.87445068359375,
            latitude: 36.7384213,
            longitude: 3.3463877,
            speed: 0.051263172179460526,
          },
          mocked: false,
          timestamp: 1640286855545,
        };
      */
        setDrivedDistance(await isStillDriving(location));
        setCurrentCords({ ...location?.coords, timestamp: location.timestamp });
        dispatch(setTrackingTimeStamp(location.timestamp));
        return dispatch(setELD({ ...location, id: "bWuPuaLFPVQxdWH9eGdX" }));
      }
    );
  };

  const backAction = () => {
    backClickCount == 1 ? BackHandler.exitApp() : _spring();
    return true;
  };

  function _spring() {
    setBackClickCount(1);
    setTimeout(() => {
      setBackClickCount(0);
    }, 1000);
  }

  async function playSound() {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/audio/alert.mp3")
      );
  
      if (sound) {
        setSound(sound);
        await sound.playAsync();
      } else {
        console.log("El objeto de sonido es nulo");
      }
    } catch (error) {
      console.log("Error al cargar o reproducir el sonido:", error);
      // Maneja el error de carga o reproducción de audio aquí
    }  
  }

  const handleLanguageChange = async (value) => {
    try {
      if(value == null || value == undefined || value == ''|| value == 'null' || value == 'undefined'){
        return;
      }
      await AsyncStorage.setItem('preferredLanguage', value);
      setSelectedLanguage(value); 
      setLanguage(value);
    } catch (error) {
      console.log(error);
    }
  };

  const authUser = async () => {
    //Vamos a obtenerlo desde la base pero lo ocuparemos local por ahora por ser elcarrier de prueba
    const carrierID = selectedCarrier;
    if (!carrierID) {
      errorMessages.push([languageModule.lang(language, 'SelectaCarrier')]);
      openErrorModal();
      return;
    }
    try {
      return await authDriver(usuario, carrierID, language, password).then(
        async (res) => {
          //Aqui obtenemos las validaciones desde el API y las mandamos a traducir desde nuestro lenguaje APP
          if(res.errors?.length > 0){
            for (let i = 0; i < res.errors.length; i++) {
              if(res.errors[i].param.includes('userName')){
                errorMessages.push([languageModule.lang(language, 'userHOS').replace("UsuarioHOS", "El usuario HOS") + " " + res.errors[i].msg.toLowerCase().replace('vacío', 'vacia')]);
              }
              if(res.errors[i].param.includes('password')){
                errorMessages.push([languageModule.lang(language, 'password').replace("Contraseña", "La contraseña") + " " + res.errors[i].msg.toLowerCase().replace('vacío', 'vacia')]);
              }
              if(res.errors[i].param.includes('IsuserOnDB?')){
                errorMessages.push([res.errors[i].msg]);
              }
            }
            openErrorModal();  //Aqui mostramos el alerta de errores
            return;
          }else{
            //Aqui autenticamos desde la funcion de firebase Auth y una vez logrado pasamos a la pantalla
             try{
              const userCredential = await signInWithEmailAndPassword(auth, res.data[0].email, password);
              const user = userCredential.user;
              if(user){              
                try{ 
                dispatch(
                  setCurrentDriver(
                    res.data[0],
                    eldData,
                    acumulatedVehicleKilometers,
                    lastDriverStatus
                  )
                );  
              navigation.push("BluetoothScreen")                                
              }catch(error){
                console.log("Error al pasar al driver:" + error)
              }
              }else {
              setDriver(undefined);
              }    
             }catch(error){
                console.log("Error en la autenticacion de firebase auth:" + error)
                errorMessages.push([languageModule.lang(language, 'incorrectUserOrPassword')]);
                openErrorModal(); 
             }
          }
        }
      );
    } catch (error) {
      console.error('Error al iniciar sesión:', error.message);
    }  
  };
  
  const openErrorModal = () => {
    setShowErrorModal(true); // Muestra el modal
  };

  const closeErrorModal = () => {
    setShowErrorModal(false); // Cierra el modal
    setErrorMessages([]); // Limpia los mensajes de error
  };


  //Complementos de la pantalla
  const logoIcon = () => {
    return (
      <View style={styles.mainLogo.container}>
        <Image
          source={require("../../assets/images/icons/logo_dumax.png")}
          style={{
            ...styles.mainLogo.logo,
          }}
        />
      </View>
    );
  }

  const footer = () => {
    return (
      <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: Sizes.fixPadding,
          }}
        >
          <Text>{`${languageModule.lang(language,'latitude')}: ${
            currentCords?.latitude
              ? currentCords?.latitude.toFixed(3)
              : languageModule.lang(language,'loading')
          } , ${languageModule.lang(language,'longitude')} ${
            currentCords?.longitude
              ? currentCords?.longitude.toFixed(3)
              : languageModule.lang(language,'loading')
          } `}</Text>
            {currentCords.timestamp ? (
            <Text>
              {`${languageModule.lang(language,'Updatedon')}: ${new Date(
                currentCords.timestamp
              ).toDateString()} ${new Date(
                currentCords.timestamp
              ).toLocaleTimeString()}`}
            </Text>
          ) : null}        
          <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: Sizes.fixPadding,
            height: 50,
            width: 200,
          }}
        >
          <Text>{"Version 1.0"}</Text> 
          </View>
          <View style={{ marginTop: Sizes.fixPadding, alignItems: 'center', width: 200 }}>
        <RNPickerSelect
          value={selectedCarrier}
          onValueChange={(value) => setSelectedCarrier(value)}
          items={carriers}
          placeholder={{ label: languageModule.lang(language, 'SelectaCarrier'), value: null }}
          style={{
            inputIOS: {
              alignItems: 'center',
              justifyContent: 'center',
              height: 50,
              width: 200,
            },
          }}
        />
      </View>
      <View style={{ marginTop: Sizes.fixPadding, alignItems: 'center', width: 200 }}>
        <RNPickerSelect
          value={selectedLanguage}
          onValueChange={(value) => handleLanguageChange(value)}
          items={languageOptions}
          placeholder={{ label: '', value: '', flag: '' }}
          style={{
            inputIOS: {
              alignItems: 'center',
              justifyContent: 'center',
              height: 50,
              width: 200,
            },
          }}
        />
      </View>
        </View>
        
    )
  }

  function FloatingMessage({ message }) {
    return (
      <TouchableOpacity activeOpacity={0.99} style={styles2.alertStyle}>      
        <Ionicons name={"alert-circle-outline"} size={27} color="white" />
        <Text style={styles2.alertText}>{message}</Text>
      </TouchableOpacity>
    );
  }
  
  function FloatingMessageError({ message, onClose }) {
    return (
      <Modal visible={true} transparent animationType="fade">
        <View style={stylesAlert.modalBackground}>
          <View style={stylesAlert.modalContainer}>
            <TouchableOpacity onPress={onClose} style={stylesAlert.closeButton}>
              <Ionicons name="close-circle-outline" size={24} color="white" />
            </TouchableOpacity>
            {message.map((message, index) => (
          <Text key={index} style={stylesAlert.errorMessage}>{message}</Text>
           ))}
          </View>
        </View>
      </Modal>
    );
  }

  //Pantalla a retornar
  return (
    <View style={styles.container}>
      {logoIcon()}
      <View style={styles.form}>
        <Input
          placeholder= {languageModule.lang(language,'userHOS')}
          onChangeText={(text) => setusuario(text)}
          value={usuario}
          autoCapitalize="none"
          inputStyle={styles.input}
          inputContainerStyle={styles.inputContainer}
        />
        <Input
          placeholder={languageModule.lang(language,'password')}
          onChangeText={(text) => setpassword(text)}
          value={password}
          secureTextEntry
          autoCapitalize="none"
          inputStyle={styles.input}
          inputContainerStyle={styles.inputContainer}
        />
    </View>
      <Button
        title={languageModule.lang(language,'login')}
        onPress={authUser}
        buttonStyle={styles.loginButton}
      />
      {showErrorModal && (
        <FloatingMessageError
          message={errorMessages}
          onClose={closeErrorModal} // Función para cerrar el modal
        />
      )}
      {driverStatus === 'D' ? (
        <View style={styles2.overlay}>
          <FloatingMessage
            message={languageModule.lang(language,'PleasesigninbeforeanymovementintheCMV')}
          />
        </View>): null}
      {footer()}
    </View>
  );
};

const stylesAlert = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#cc0b0a',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  errorMessage: {
    color: 'white',
    marginTop: 8,
  },
});

const styles2 = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: -600,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999, // Asegura que esté por encima de otros elementos
  },
  alertStyle: {
    alignItems: 'center',
    backgroundColor: '#cc0b0a', // Color de fondo rojo (puedes ajustar el estilo)
    padding: 30,
    borderRadius: 5,
  },
  alertText: {
    color: '#fff', // Color del texto (blanco en este caso)
    textAlign: 'center',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    textDecorationLine: 'underline',
  },
});

const styles = StyleSheet.create({
  alertStyle: {
    backgroundColor: Colors.redColor,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding + 5.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginTop: Sizes.fixPadding * 3.5,
    marginBottom: Sizes.fixPadding * 2.0,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },
  languagePicker: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 15,
    height: 40,
  },
    mainLogo: {
    container: {
      justifyContent: "center",
      alignItems: "center",
    },
    logo: {
      width: width / 2,
      height: width / 2,
      resizeMode: "contain",
    },
  },
  logo: {
    height: 100, // Altura fija o la que mejor se adapte
    marginBottom: 50,
  },
  form: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  inputContainer: {
    borderBottomWidth: 0, // Elimina la línea debajo del campo
  },
  loginButton: {
    backgroundColor: '#4CAF50', // Cambia el color del botón a un verde elegante
    borderRadius: 5,
    paddingHorizontal: 30,
    marginBottom: 10,
  },
  forgotPassword: {
    color: '#000',
    textDecorationLine: 'underline',
  },
  languagePicker: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
  }
});

const pickerSelectStyles = StyleSheet.create({
  pickerIOS: {
    fontSize: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#f0f0f0',
  },
  pickerAndroid: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#fff', // Cambia el color de fondo para Android aquí
  },
});

export default LoginScreen;








