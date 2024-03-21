import React, { useState, useCallback, useEffect, useRef } from "react";
import { View, Text,Modal, TouchableOpacity, StyleSheet, Image, Pressable } from 'react-native';
import {eld, removeToken, pendingCertifyDriverEvents} from '../../../data/commonQuerys'
import { useDispatch, useSelector } from "react-redux";
import { useTimer } from '../../../global_functions/timerFunctions';
import { getCurrentDriver, getCurrentUsers } from "../../../config/localStorage";
import { logOutCurrentDriver } from "../../../redux/actions";
import {setKey,setDefaults,setLanguage,setRegion,fromAddress,fromLatLng,fromPlaceId,setLocationType,geocode,RequestType,} from "react-geocode";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const languageModule = require('../../../global_functions/variables');

const DrawerMenu = ({ navigation, handleLogout }) => {
  
  const dispatch = useDispatch();
  const { stopTimer } = useTimer();
  const {
        eldData,
        currentDriver,
        acumulatedVehicleKilometers,
        lastDriverStatus,
        driverStatus
  } = useSelector((state) => state.eldReducer);
  const [location, setlocation] = useState({});
  const [language, setLanguage] = useState('');
  const [errorMessages, setErrorMessages] = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [userON, setUserON] = useState('');
  const [userImage, setUserImage] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [pendingEventsToCertify, setPendingEventsToCertify] = useState(false);

  
  const sourceDriverImage = require('../../../assets/images/user/userDriver.jpg');
  const sourceCopilotImage = require('../../../assets/images/user/coDriver.jpg');

  useEffect(() => {
    const getPreferredLanguage = async () => {
       try {
         setLanguage(await AsyncStorage.getItem("preferredLanguage"));
       } catch (error) {
         console.log(error);
       }
    };
    getPreferredLanguage();
  }, []);

    //CertifyLogs
  //Obtenemos los eventos pendientes de certificar y advertimos al usuario
  const hasRun = useRef(false);
  const getUncertifiedEvents = async () => {
    await pendingCertifyDriverEvents('mHlqeeq5rfz3Cizlia23', userON?.data?.id, userON?.data?.carrier?.id).then((response) => {
      if(response){
        setPendingEventsToCertify(response)
      }
    })
  }

  useEffect(() => { 
    if (userON?.data?.id && userON?.data?.carrier?.id && !hasRun.current) {
    getUncertifiedEvents()
    hasRun.current = true;
    }
  }, [userON]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        let users = await getCurrentUsers();
        const userActive = users.find(user => user.isActive === true);
        if(userActive.role === 'userDriver'){
          setUserImage(sourceDriverImage);
        }else if(userActive.role === 'userCoDriver'){
          setUserImage(sourceCopilotImage);
        }
        setUserON(userActive);
      } catch (error) {
        console.log(error);
      }
    };
    setTimeout(() => { 
      getUsers();
    }, 1000);
  }, [userON]);

  const getLocation = async (latitude, longitude) => { 

    setDefaults({
      key: "AIzaSyD7ybUYP7u9Bd-PBFJ1UHDtblyK1Y-ieEk", 
      language: language.toLocaleLowerCase().replace("eng", "en").replace("esp", "es"),
      region: language.toLocaleLowerCase().replace("eng", "en").replace("esp", "es"),
    });

    try {
    const { results } = await fromLatLng(latitude, longitude);

    if (results && results.length > 0) {
      const address = results[0].formatted_address;
      const { city, state, country } = results[0].address_components.reduce(
        (acc, component) => {
          if (component.types.includes("locality"))
            acc.city = component.long_name;
          else if (component.types.includes("administrative_area_level_1"))
            acc.state = component.long_name;
          else if (component.types.includes("country"))
            acc.country = component.long_name;
          return acc;
        },
        {}
      );

      const geonamesBaseUrl = "http://api.geonames.org/findNearbyJSON";
      const geonamesUsername = "danielwguzman";
      const geonamesUrl = `${geonamesBaseUrl}?lat=${latitude}&lng=${longitude}&username=${geonamesUsername}`;

      const geonamesResponse = await fetch(geonamesUrl);
      const geonamesData = await geonamesResponse.json();

      if (geonamesData && geonamesData.geonames && geonamesData.geonames.length > 0) {
        const nearestCity = geonamesData.geonames[0];
        const locationString = `${nearestCity.distance} ${languageModule.lang(language, 'kmAwayFrom')} ${nearestCity.name}, ${nearestCity.adminCodes1.ISO3166_2}`;
        const distance = nearestCity.distance;
        const distanceString = distance.toString();
        const slicedDistance = distanceString.slice(0, distanceString.indexOf('.') + 3);
        setlocation({
          "address": address,
          "city": city,
          "state": state,
          "country": country,
          "reachOf": {
            "city": nearestCity.name,
            "state": nearestCity.adminCodes1.ISO3166_2,
            "country": nearestCity.countryName,
            "distance": slicedDistance,
          }
        });
      } else {
        setlocation({
          "address": address,
          "city": city,
          "state": state,
          "country": country,
        });
      }
      
    } else {
      console.error("No se encontraron resultados de react-geocode.");
    }
    } catch (error) {
      console.error('Error en la geocodificación inversa:', error.message);
    }
  };
  
  useEffect(() => {
    if(eldData?.coords?.latitude && eldData?.coords?.longitude){
      getLocation(eldData?.coords?.latitude, eldData?.coords?.longitude);  
    }
  }, [eldData]);

  const logOutDriver = async () => {
    const secondToken = await AsyncStorage.getItem('secondToken');
    if(!secondToken){
      // Eliminar el token y los datos del conductor directamente
      const token = await AsyncStorage.getItem('token');
      await removeToken(token).then( async (res) => {
        if(res?.data?.message == "Token eliminado exitosamente."){
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('users');
        // Despachar la acción y esperar a que se complete
        await new Promise(resolve => {   
          dispatch(logOutCurrentDriver(currentDriver, eldData, acumulatedVehicleKilometers, lastDriverStatus, location))
            .then(() => resolve());
        });
      
        //Aqui detenos el timer ya que no requerimos seguir posteando eventos
        stopTimer();
        handleLogout();
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoginScreen' }],
        });
        }
      });
    }else{
      errorMessages.push([languageModule.lang(language, 'noLogoutAvailable')])
      openErrorModal();
    }
  };

  const openErrorModal = () => {
    setShowErrorModal(true); // Muestra el modal
  };

  const closeErrorModal = () => {
    setShowErrorModal(false); // Cierra el modal
    setErrorMessages([]); // Limpia los mensajes de error
  };

  const checkpendingEvents = async () => {
    if(pendingEventsToCertify){
      setModalVisible(true);
    }else{
      logOutDriver();
    }
  }

  //funciones de renderizado

  function header() {
    return (
      <View>   
      <Ionicons name="notifications" size={18} color="#000" style={{alignSelf: 'flex-end'}} />
      <Text style={styles.menuTitle}>Menú</Text>
      </View>
    )
  }

  function options() {
       return (
        <View>
        <TouchableOpacity
         style={{...styles.menuItem, flexDirection: 'row', alignItems: 'center'}}
        onPress={() => navigation.toggleDrawer()}
        >
        <Icon name="home" size={18} color="#4CAF50" style={styles.icon} />
        <Text style={styles.menuItemText}>{languageModule.lang(language, 'home')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
         style={{...styles.menuItem, flexDirection: 'row', alignItems: 'center'}}
        onPress={() => navigation.navigate('LogBook')}
        >
        <Icon name="book" size={18} color="#4CAF50" style={styles.icon} />
        <Text style={styles.menuItemText}>{languageModule.lang(language, 'logBook')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
         style={{...styles.menuItem, flexDirection: 'row', alignItems: 'center'}}
        onPress={() => navigation.navigate('Diagnostico')}
        >
        <Icon name="google-analytics" size={18} color="#4CAF50" style={styles.icon} />
        <Text style={styles.menuItemText}>{languageModule.lang(language, 'diagnosis')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
         style={{...styles.menuItem, flexDirection: 'row', alignItems: 'center'}}
        onPress={() => navigation.navigate('BluetoothScreen')}
        >
        <Icon name="bluetooth" size={18} color="#4CAF50" style={styles.icon} />
        <Text style={styles.menuItemText}>{languageModule.lang(language, 'searchDevices')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
         style={{...styles.menuItem, flexDirection: 'row', alignItems: 'center'}}
        onPress={() => navigation.navigate('PerfilVehiculo')}
        >
        <Icon name="truck" size={18} color="#4CAF50" style={styles.icon} />
        <Text style={styles.menuItemText}>{languageModule.lang(language, 'vehicleProfile')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
         style={{...styles.menuItem, flexDirection: 'row', alignItems: 'center'}}
         onPress={() => navigation.navigate('Violaciones')}
        >
        <Ionicons name="warning" size={18} color="#4CAF50" style={styles.icon} />
        <Text style={styles.menuItemText}>{languageModule.lang(language, 'violations')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
         style={{...styles.menuItem, flexDirection: 'row', alignItems: 'center'}}
        onPress={() => navigation.navigate('PerfilConductor')}
        >
        <Ionicons name="person" size={18} color="#4CAF50" style={styles.icon} />
        <Text style={styles.menuItemText}>{languageModule.lang(language, 'driverProfile')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
         style={{...styles.menuItem, flexDirection: 'row', alignItems: 'center'}}
        onPress={() => navigation.navigate('AcercaDelELD')}
        >
        <Ionicons name="help-circle" size={18} color="#4CAF50" style={styles.icon} />
        <Text style={styles.menuItemText}>{languageModule.lang(language, 'aboutELD')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
         style={{...styles.menuItem, flexDirection: 'row', alignItems: 'center'}}
         onPress={() => navigation.navigate('Anotaciones')}
        >
        <Ionicons name="pencil" size={18} color="#4CAF50" style={styles.icon} />
        <Text style={styles.menuItemText}>{languageModule.lang(language, 'annotations')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
         style={{...styles.menuItem, flexDirection: 'row', alignItems: 'center'}}
         onPress={() => navigation.navigate('Inspecciones')}
        >
        <Ionicons name="newspaper" size={18} color="#4CAF50" style={styles.icon} />
        <Text style={styles.menuItemText}>{languageModule.lang(language, 'inspectionsReport')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
         style={{...styles.menuItem, flexDirection: 'row', alignItems: 'center'}}
        onPress={() => navigation.navigate('CertificacionELD')}
        >
        <Ionicons name="lock-closed" size={18} color="#4CAF50" style={styles.icon} />
        <Text style={styles.menuItemText}>{languageModule.lang(language, 'certification')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
         style={{...styles.menuItem, flexDirection: 'row', alignItems: 'center'}}
        onPress={() => navigation.navigate('CertificarLogs')}
        >
        <Ionicons name="medal" size={18} color="#4CAF50" style={styles.icon} />
        <Text style={styles.menuItemText}>{languageModule.lang(language, 'certifyLogs')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
         style={{...styles.menuItem, flexDirection: 'row', alignItems: 'center'}}
        onPress={() => navigation.navigate('Envios')}
        >
        <Ionicons name="mail" size={18} color="#4CAF50" style={styles.icon} />
        <Text style={styles.menuItemText}>{languageModule.lang(language, 'shipments')}</Text>
        </TouchableOpacity>
        </View>
       )
  }

  function userSection() {
    return (
      <View style={styles.userSection}>
        <Image
         source={userImage}
         style={styles.userAvatar}
        />
        <View>
          <Text style={styles.username}>{userON?.data?.displayName}</Text>
          <Text style={styles.userRole}>{languageModule.lang(language, userON?.role)}</Text>
          <Text style={styles.userRole}>{`ID: ${userON?.data?.driverLicense?.licenseID}`}</Text>
        </View>
      </View>
    )
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

  function advCertifyDialog() {  
    return (
      <View>
         <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{languageModule.lang(language, 'pendingEventsToCertify')}</Text>
            <View style={styles.modalButtons}>
            <Pressable
                style={[styles.modalButton, styles.buttonNotReady]}
                onPress={logOutDriver}
              >
                <Text style={styles.modalButtonText}>{languageModule.lang(language, 'skip')}</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.buttonAgree]}
                onPress={() => {
                  setModalVisible(false)
                  navigation.navigate('CertificarLogs');
                }}
              >
                <Text style={styles.modalButtonText}>{languageModule.lang(language, 'certify')}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      </View>
    )
  }

  return (
    <View style={styles.menuContainer}>
      {/* Título del menú */}
      {header()}
      {/* Línea separadora */}
      <View style={styles.separator} />
      {/* Sección del Conductor */}
      {userSection()}
      <TouchableOpacity
        style={{...styles.menuItem, flexDirection: 'row', alignItems: 'center'}}
        onPress={() => navigation.navigate('IngresoSegundoChofer')} 
      >
        <Icon name="account-switch" size={18} color="#000" style={styles.icon} />
        <Text style={{...styles.menuItemText, fontSize: 13, color: '#000'}}>{languageModule.lang(language, 'switchAccount')}</Text>
      </TouchableOpacity>
      {/* Línea separadora */}
      <View style={styles.separator} />
      {/* Opciones del menú */}
      {options()}
      {/* Línea separadora */}
      <View style={styles.separator} />
      <TouchableOpacity
          style={{...styles.menuItem, flexDirection: 'row', alignItems: 'center'}}
          onPress={checkpendingEvents}
        >
          <Icon name="logout" size={18} color="#4CAF50" style={styles.icon} />
          <Text style={styles.menuItemText}>{languageModule.lang(language, 'logout')}</Text>
        </TouchableOpacity>
        <Text style={{...styles.userRole, marginTop: 20}}>Version 1.0</Text>
        {showErrorModal && (
        <FloatingMessageError
          message={errorMessages}
          onClose={closeErrorModal} // Función para cerrar el modal
        />
      )}
      {advCertifyDialog()}
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 2,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonAgree: {
    backgroundColor: '#4CAF50',
  },
  buttonNotReady: {
    backgroundColor: '#CC0B0A',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  menuContainer: {
    marginTop: 5,
    flex: 1,
    backgroundColor: '#fff',  
    padding: 20,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',  
    color: '#000',  
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',  
    marginVertical: 10,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 16,
    color: '#000',  
  },
  userRole: {
    fontSize: 12,
    color: '#777',  
  },
  menuItem: {
    marginBottom: 10,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  icon: {
    marginRight: 9,
  },
});

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

export default DrawerMenu;
