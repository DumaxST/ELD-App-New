import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList,Dimensions, Image, StyleSheet, ActivityIndicator, Modal, TextInput } from 'react-native';
import  { Button } from 'react-native-elements';
import { authDriver, eld, getCarriersOptions, getTheUserIsAdmin, authToken} from "../../../data/commonQuerys";
import { getCurrentDriver, getCurrentUsers } from "../../../config/localStorage";
const { width } = Dimensions.get("window");
import { app, auth } from '../../../config/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
const languageModule = require('../../../global_functions/variables');
import {removeToken} from '../../../data/commonQuerys'
import AsyncStorage from "@react-native-async-storage/async-storage";

const SwitchAccountScreen = ({ navigation }) => {

  const [secondDriver, setSecondDriver] = useState('');
  const [language, setLanguage] = useState('');
  const [isSecondDriverDefined, setIsSecondDriverDefined] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [driver, setDriver] = useState({});
  const [errorMessages, setErrorMessages] = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState('');

  const sourceDriverImage = require('../../../assets/images/user/userDriver.jpg');
  const sourceCopilotImage = require('../../../assets/images/user/coDriver.jpg');

    //Uso de efectos de inicio del screen
  //Aqui obtenemos el idioma seleccionado desde la primera pantalla
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
        let usersUpsated = await getCurrentUsers();
        usersUpsated[0].Image = sourceDriverImage;
        usersUpsated[1].Image = sourceCopilotImage;
        setUsers(usersUpsated);
        setLoading(false);
        if(usersUpsated[1].data){
          setIsSecondDriverDefined(true);
        }
      } catch (error) {
        console.log(error);
      }
    };
    setTimeout(() => { 
    getUsers();
    }, 1000);
  }, [users]);

  const handleLogoutSecondDriver = async () => {
    const firstUser = users.find(user => user.id === '1');
    const secondUser = users.find(user => user.id === '2');
    await removeToken(secondUser.token).then( async (res) => {
      if(res?.data?.message == "Token eliminado exitosamente."){       
        firstUser.isActive = true;
        secondUser.isActive = false;
        delete secondUser.data;
        secondUser.token = '';
        await AsyncStorage.setItem("users", JSON.stringify(users));
        await AsyncStorage.setItem("secondToken", '');
        setIsSecondDriverDefined(false);
        setSelectedDriverId(''); 
        setLoading(true);
      }
    });
  };

  const handleLogin = async () => {
    const firstUser = users.find(user => user.id === '1');
    const secondUser = users.find(user => user.id === '2');
    const carrierID = firstUser.data.carrier.id
    if (carrierID) {
    try {
      return await authDriver(username, carrierID, language, password).then(
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
            //cambiamos el orden de los factores para manejar errores de formulario
            //Antes de realizar el request de isAdmin
            //Aqui verificamos que el usuario nosea un admin
            return await getTheUserIsAdmin(carrierID, username).then(async (isAdmin) => {
            if(isAdmin){
              errorMessages.push([languageModule.lang(language, 'isNotAllowedanAdmin')]);
              openErrorModal();  //Aqui mostramos el alerta de errores
              return;
              }else{
                  //Aqui autenticamos desde la funcion de firebase Auth y una vez logrado pasamos a la pantalla
              try{
              const userCredential = await signInWithEmailAndPassword(auth, res.data[0].email, password);
              const user = userCredential.user;
              if(user){              
                try{ 
                  //Reparando error de merge con un comnetario
                  //Aqui generamos un token en la base de datos para el usuario logueado
                  authToken(username, carrierID, user.uid, language).then(async (response) => {
                    if(response?.errors?.length > 0){
                      errorMessages.push([response.errors[0].msg]);
                      openErrorModal(); 
                    }
                    else{
                      if(firstUser.isActive == true){
                        firstUser.isActive = false;
                        secondUser.isActive = true;
                        secondUser.data = res.data[0];
                        secondUser.token = user.uid;
                        secondUser.status = "ON"
                        await AsyncStorage.setItem("users", JSON.stringify(users));
                        await AsyncStorage.setItem("secondToken", user.uid);                        
                        setShowLoginModal(false);
                        setLoading(true);
                      }
                    }
                  })                            
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
            })
          }
        }
      );
    } catch (error) {
      console.error('Error al iniciar sesión:', error.message);
    } 
    }
  };

  const handleDriverPress = async (driverId) => {
    setSelectedDriverId(driverId);
    const notSelectedDriver = users.find((user) => user.id !== driverId);
    notSelectedDriver.isActive = false;
    const selectedDriver = users.find((user) => user.id === driverId);
    selectedDriver.isActive = true;
    await AsyncStorage.setItem("users", JSON.stringify(users));
    navigation.navigate('PrincipalScreen');
  };

  const openErrorModal = () => {
    setShowErrorModal(true); // Muestra el modal
  };

  const closeErrorModal = () => {
    setShowErrorModal(false); // Cierra el modal
    setErrorMessages([]); // Limpia los mensajes de error
  };

  //funciones de renderizado 
  const usuariosList = () => {
    return (
      <FlatList
      data={users}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            styles.driverItem,
            selectedDriverId === item.id && styles.selectedDriverItem,
          ]}
          disabled={!isSecondDriverDefined}
          onPress={() => handleDriverPress(item.id)}
        >
          <Image source={item.Image} style={styles.driverImage} />
          <View style={styles.driverInfo}>
          <Text style={styles.driverName}>{item?.data?.displayName || languageModule.lang(language, "login")}</Text>
            <Text style={styles.driverRole}>{languageModule.lang(language, item.role)}</Text>
          </View>
          {item.role === 'userCoDriver' && isSecondDriverDefined && (
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogoutSecondDriver}
            >
              <Text style={styles.logoutButtonText}>{languageModule.lang(language, 'logout')}</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      )}
    />
    )
  }

  const logoIcon = () => {
    return (
      <View style={styles.mainLogo.container}>
        <Image
          source={require("../../../assets/images/icons/logo_dumax.png")}
          style={{
            ...styles.mainLogo.logo,
          }}
        />
      </View>
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

  return (
    <View style={styles.container}>
      {/* Título */}
      <Text style={styles.title}>{languageModule.lang(language, 'AccountManagement')}</Text>
      {/* Lista de Conductores */}
      {loading ? (
        <ActivityIndicator style={styles.loadingIndicator} size="large" color="#4CAF50" />
      ) : (
        usuariosList()
      )}
      {showErrorModal && (
        <FloatingMessageError
          message={errorMessages}
          onClose={closeErrorModal} // Función para cerrar el modal
        />
      )}
      {/* Botón para agregar nuevo conductor */}
      {!isSecondDriverDefined && (
        <TouchableOpacity style={styles.addButton} onPress={() => setShowLoginModal(true)} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>+</Text>
          )}
        </TouchableOpacity>
      )}
      {/* Modal de inicio de sesión */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={showLoginModal}
        onRequestClose={() => setShowLoginModal(false)}
      >
      <TouchableOpacity onPress={() => setShowLoginModal(false)} style={styles.closeButton}>
              <Ionicons name="close-circle-outline" size={24} color="black" />
            </TouchableOpacity>
      <View style={styles.modalContainer}>
          {/* Logo */}
          {logoIcon()}
          <TextInput
            placeholder={languageModule.lang(language,'userHOS')}
            style={styles.input}
            onChangeText={(text) => setUsername(text)}
          />
          <TextInput
            placeholder={languageModule.lang(language,'password')}
            secureTextEntry
            style={styles.input}
            onChangeText={(text) => setPassword(text)}
          />
          <Button
          title={languageModule.lang(language,'login')}
          onPress={handleLogin}
          buttonStyle={styles.loginButton}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingIndicator: {
    marginTop: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  errorMessage: {
    color: 'white',
    marginTop: 8,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    color: '#4CAF50',
    marginTop: 10,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'left',  // Alineado a la izquierda
  },
  driverItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  selectedDriverItem: {
    backgroundColor: '#4CAF50', // Color de fondo cuando está seleccionado
    borderColor: '#4CAF50',
  },
  driverImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  driverRole: {
    fontSize: 16,
    color: '#777',
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    position: 'absolute',
    bottom: 20,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  logoutButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#fff',
  },
  mainLogo: {
    container: {
      justifyContent: "center",
      alignItems: "center",
      top: -10,
    },
    logo: {
      width: width / 2,
      height: width / 2,
      resizeMode: "contain",
    },
  },
  loginButton: {
    backgroundColor: '#4CAF50', // Cambia el color del botón a un verde elegante
    borderRadius: 5,
    paddingHorizontal: 30,
    marginBottom: 10,
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

export default SwitchAccountScreen;
