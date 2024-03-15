import React, { useState, useEffect } from 'react';
import {View,Text,TextInput,Image,TouchableOpacity,ScrollView,SafeAreaView,StyleSheet,Dimensions,StatusBar,} from 'react-native';
import { Colors, Fonts, Sizes } from '../../../constants/styles';
import { useDispatch, useSelector } from "react-redux";
import { getCurrentDriver, currentCMV } from "../../../config/localStorage";
import { startVehicleMeters } from "../../../redux/actions";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { JumpingTransition } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const languageModule = require('../../../global_functions/variables');

const PerfilVehiculo = ({ navigation }) => {
  const dispatch = useDispatch();

  //Declaracion de variables
  const [language, setlanguage] = useState("");
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [remolqueSeleccionado, setRemolqueSeleccionado] = useState(null);
  const [state, setState] = useState({
    numeroDelCamion: "",
    numeroDelTrailer: "",
    vinDelCamion: "",
    odometroVisual: "",
  });
  const {
      numeroDelCamion,
      vinDelCamion,
      numeroDelTrailer,
      numeroDeDocumentoDeEnvio,
      odometroVisual,
  } = state;
  const [vehiculos, setVehiculos] = useState([]);

  const [remolques, setRemolques] = useState([
    { id: 1, 
      nombre: 'Remolque 1', 
      numero: 1,
      registeredState: "CA",
      imagen: require('../../../assets/images/trailers/trailer.png') },
  ]);


  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  
  const { acumulatedVehicleKilometers } = useSelector(
    (state) => state.eldReducer
  );

  //Uso de efectos de inicio del screen

  //Aqui obtenemos el idioma seleccionado desde la primera pantalla
  useEffect(() => {
    const getPreferredLanguage = async () => {
       try {
         setlanguage(await AsyncStorage.getItem("preferredLanguage"));
         console.log(language);
       } catch (error) {
         console.log(error);
       }
    };
    getPreferredLanguage();
  }, []);

  //Aqui obtenemos la data del api 
  useEffect(() => {
    const setData = async () => {
      await currentCMV().then(async (currentCMV) => {
        if (currentCMV) {
          
          currentCMV.odometroVisual = `${Math.round(
            acumulatedVehicleKilometers * 0.621371 + currentCMV.odometroVisual
          )}`;
          return updateState(currentCMV);
        }
        return await getCurrentDriver().then((driver) => {
          updateState({
            id: driver?.cmv?.id ? driver?.cmv?.id : "",
            numeroDelCamion: driver?.cmv?.number ? driver?.cmv?.number : "",
            vinDelCamion: driver?.cmv?.vin ? driver?.cmv?.vin : "",
          });
        });
      });
    };
    setData();
  }, []);

  useEffect(() => {
    getVehicles();
  }, [vehiculos]);

  //funcines de la pantalla
  const getVehicles = async () => {
    return await AsyncStorage.getItem("currentCMV").then((currentCMV) => {
      if (currentCMV) {
         setVehiculos([JSON.parse(currentCMV)]);
      }
  })
  }

  const updateCMVProfile = async () => {
  return await AsyncStorage.setItem("currentCMV", JSON.stringify(state)).then(
    async () => {
      dispatch(startVehicleMeters());
      navigation.reset({
        index: 0,
        routes: [{ name: 'PrincipalScreen' }],
      });
    }
  );
  };

  const handleSeleccionarVehiculo = (vehiculo) => {
    setVehiculoSeleccionado(vehiculoSeleccionado?.id === vehiculos[0]?.id ? null : vehiculo);
    setRemolqueSeleccionado(null); // Cerrar la tarjeta del remolque seleccionado
  };

  const handleSeleccionarRemolque = (remolque) => {
    setRemolqueSeleccionado(remolqueSeleccionado === remolque ? null : remolque);
    setVehiculoSeleccionado(null); // Cerrar la tarjeta del vehículo seleccionado
  };

  const handleEditarV = () => {
    navigation.navigate('ElegirVehiculo');
  };

  const handleEditarR = () => { 
    navigation.navigate('ElegirRemolque');
  };
  

 //funciones de renderizado 

  const selectedVehicle = () => {
  return (
    <View style={{...styles.container, marginTop: 5}}>
      <Text style={{...styles.title, fontSize: 15}}>{languageModule.lang(language, "selectedVehicle") + ":"}</Text>

      {/* Información del vehículo seleccionado */}
      {vehiculoSeleccionado && (
        <View style={styles.infoTarjeta}>
          <Image source={require('../../../assets/images/trucks/truck3.png')} style={styles.infoTarjetaImagen} />
          <Text>{"VIN: " + vehiculoSeleccionado.vin}</Text>
          <Text>{languageModule.lang(language, "licensePlate")+ ": " + vehiculoSeleccionado.plate}</Text>
          <Text>{languageModule.lang(language, "vehicleRegistrationPlace")+ ": " + vehiculoSeleccionado.state}</Text>
          <TouchableOpacity
            style={{...styles.editButton, backgroundColor: 'transparent'}}
            onPress={() => handleEditarV()}
          >
            <MaterialIcons  name="edit" size={24} />
          </TouchableOpacity>
        </View>
      )}

      {/* Renderizar la lista de vehículos */}
      {vehiculos.length === 0 ? (
        <Text>{languageModule.lang(language, 'thereisNovehicleSelected')}</Text>
      ) : (
        vehiculos.map((vehiculo) => (
          <TouchableOpacity
            key={vehiculo.id}
            style={styles.vehiculoItem}
            onPress={() => {
              handleSeleccionarVehiculo(vehiculo);
            }}
          >
            <Text>{languageModule.lang(language, 'vehicleNumber') + ":"}</Text>
            <Text>{vehiculo.number}</Text>
            <Image source={require('../../../assets/images/trucks/truck3.png')} style={styles.vehiculoImagen} />
          </TouchableOpacity>
        ))
      )}
    </View>
  );
  };

  const selectedTrailer = () => {
  return(
    <View style={{...styles.container, marginTop: 5}}>
      <Text style={{...styles.title, fontSize: 15}}>{languageModule.lang(language, "selectedTrailer") + ":"}</Text>

      {/* Información del remolque seleccionado */}
      {remolqueSeleccionado && (
        <View style={styles.infoTarjeta}>
          <Image source={remolqueSeleccionado.imagen} style={styles.infoTarjetaImagen} />
          <Text>{ languageModule.lang(language, 'trailerNumber') + ": " + remolqueSeleccionado.numero}</Text>
          <Text>{languageModule.lang(language, "trailerRegistrationPlace")+ ": " + remolqueSeleccionado.registeredState}</Text>
          <TouchableOpacity
            style={{...styles.editButton, backgroundColor: 'transparent'}}
            onPress={() => handleEditarR()}
          >
            <MaterialIcons  name="edit" size={24} />
          </TouchableOpacity>
        </View>
      )}

      {/* Renderizar la lista de remolques */}
      {remolques.length === 0 ? (
        <Text>{languageModule.lang(language, 'thereisNotrailerSelected')}</Text>
      ) : (
        remolques.map((remolque) => (
          <TouchableOpacity
            key={remolque.id}
            style={styles.vehiculoItem}
            onPress={() => handleSeleccionarRemolque(remolque)}
          >
            <Text>{languageModule.lang(language, 'trailerNumber') + ":"}</Text>
            <Text>{remolque.numero}</Text>
            <Image source={remolque.imagen} style={styles.vehiculoImagen} />
          </TouchableOpacity>
        ))
      )}
    </View>
  );
  }

  const inputsOdometer = () => {
    return(
      <View style={styles3.container}>
      <View style={styles3.inputContainer}>
        <Text style={styles3.inputLabel}>{languageModule.lang(language, 'visualOdometer')}</Text>
        <TextInput
          style={[styles3.input, styles3.leftInput]}
          placeholderTextColor="#888"
        />
      </View>
      <View style={styles3.inputContainer}>
      <Text style={styles3.inputLabel}>{languageModule.lang(language, 'reWrite') + " " + languageModule.lang(language, 'visualOdometer')}</Text>
        <TextInput
          style={[styles3.input, styles3.rightInput]}
          placeholderTextColor="#888"
        />
      </View>
    </View>
    )
  }
 
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <Text style={styles.title}>{languageModule.lang(language, 'vehicleProfile')}</Text>
      <ScrollView >
      <View style={styles2.buttonContainer}>
        <TouchableOpacity onPress={() => {navigation.navigate('ElegirVehiculo')}} style={styles2.button}>
          <Image
            source={require('../../../assets/images/trucks/truck3.png')}
            style={styles2.buttonImage}
          />
          <Text style={styles2.buttonText}>{languageModule.lang(language, "selectVehicle")}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {navigation.navigate('ElegirRemolque')}} style={styles2.button}>
          <Image
            source={require('../../../assets/images/trailers/trailer.png')}
            style={styles2.buttonImage}
          />
          <Text style={styles2.buttonText}>{languageModule.lang(language, "selectTrailer")}</Text>
        </TouchableOpacity>
        </View>
        {selectedVehicle()}
        {selectedTrailer()}
        {inputsOdometer()}
        </ScrollView>
      <TouchableOpacity style={styles.submitButton} onPress={updateCMVProfile}>
        <Text style={styles.submitButtonText}>{languageModule.lang(language, 'save')}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: Sizes.fixPadding * 2,
    paddingTop: Sizes.fixPadding * 2,
  },
  vehiculoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#eee', // Color de fondo gris claro
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
    marginVertical: -10,
  },
  vehiculoImagen: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  infoTarjeta: {
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff', // Fondo blanco
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
  },
  infoTarjetaImagen: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#3498db', // Color azul brillante
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
  },
  editButtonText: {
    color: '#fff', // Texto blanco
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primaryColor,
    marginBottom: Sizes.fixPadding * 2,
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: Sizes.fixPadding * 2,
  },
  inputLabel: {
    fontSize: 16,
    color: '#000',
    marginBottom: Sizes.fixPadding,
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding * 1.5,
    fontSize: 16,
  },
  submitButton: {
    top: -39,
    backgroundColor: Colors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding * 1.5,
    marginTop: Sizes.fixPadding * 2,
  },
  submitButtonText: {
    color: Colors.whiteColor,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Fondo blanco
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333', // Color de texto oscuro
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#ffffff', // Verde elegante
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
    width: 140,
    height: 180,
  },
  buttonImage: {
    width: 140,
    height: 100,
    marginBottom: 5,
  },
  buttonText: {
    color: '#000000', // Texto blanco
  },
});

const styles3 = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  inputContainer: {
    flex: 1,
    marginRight: 10,
    marginLeft : 10,
  },
  inputLabel: {
    fontSize: 12,
    marginBottom: 5,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#4CAF50', // Color verde elegante
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontSize: 16,
    color: '#333', // Color de texto oscuro
  },
  leftInput: {
    marginTop: 15,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 0, // Quita la esquina derecha del borde inferior
    borderTopRightRadius: 0, // Quita la esquina derecha del borde superior
  },
  rightInput: {
    borderBottomLeftRadius: 0, // Quita la esquina izquierda del borde inferior
    borderTopLeftRadius: 0, // Quita la esquina izquierda del borde superior
  },
});

export default PerfilVehiculo;

