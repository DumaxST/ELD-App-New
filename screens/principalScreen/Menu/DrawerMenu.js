import React, { useState, useCallback, useEffect } from "react";
import { View, Text,Modal, TouchableOpacity, StyleSheet, Image } from 'react-native';
import {removeToken} from '../../../data/commonQuerys'
import { useDispatch, useSelector } from "react-redux";
import { useTimer } from '../../../global_functions/timerFunctions';
import { getCurrentDriver, getCurrentUsers } from "../../../config/localStorage";
import { logOutCurrentDriver } from "../../../redux/actions";
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
  const [language, setLanguage] = useState('');
  const [errorMessages, setErrorMessages] = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [userON, setUserON] = useState('');
  const [userImage, setUserImage] = useState();

  
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
          dispatch(logOutCurrentDriver(currentDriver, eldData, acumulatedVehicleKilometers, lastDriverStatus))
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
        <Ionicons name="newspaper" size={18} color="#4CAF50" style={styles.icon} />
        <Text style={styles.menuItemText}>{languageModule.lang(language, 'annotations')}</Text>
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
          onPress={logOutDriver}
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
    </View>
  );
};

const styles = StyleSheet.create({
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
