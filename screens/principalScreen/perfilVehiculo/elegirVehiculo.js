import React, { useState, useEffect } from 'react';
import {View,Modal,Button,Text,TextInput,Image,TouchableOpacity,ScrollView,SafeAreaView,StyleSheet,Dimensions,StatusBar,} from 'react-native';
import { Colors, Fonts, Sizes } from '../../../constants/styles';
import SelectDropdown from 'react-native-select-dropdown';
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUsers } from "../../../config/localStorage";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getCurrentDriver, currentCMV } from "../../../config/localStorage";
import { postCMV } from "../../../data/commonQuerys";
import { startVehicleMeters } from "../../../redux/actions";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get('window');
const languageModule = require('../../../global_functions/variables');

const elegirVehiculo = ({ navigation }) => {  

  //declaracion de variables
  const [language, setlanguage] = useState('');
  const [users, setUsers] = useState('');
  const [userON, setUserON] = useState('');
  const [errorMessages, setErrorMessages] = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [newVehicleModal, setNewVehicleModal] = useState(false);
  
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

  useEffect(() => {
    const getUsers = async () => {
      try {
        let users = await getCurrentUsers();
        const userActive = users.find(user => user.isActive === true);
        setUserON(userActive);
        setUsers(users);
      } catch (error) {
        console.log(error);
      }
    };
      getUsers();
  }, []);

  //funciones de la pantalla
  const openErrorModal = () => {
    setShowErrorModal(true); // Muestra el modal
  };

  const closeErrorModal = () => {
    setShowErrorModal(false); // Cierra el modal
    setErrorMessages([]); // Limpia los mensajes de error
  };

  //funciones de renderizado
  const header = () => {
        return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={styles.title}>{languageModule.lang(language, 'chooseVehicle')}</Text>
            <TouchableOpacity onPress={() => setNewVehicleModal(true)}>   
                    <MaterialCommunityIcons name="plus" size={30} color={Colors.primaryColor} />
            </TouchableOpacity>
        </View>
        );
  }  

  const nuevoVehiculoModal = () => {

    //Declaracion de variables del modal
    const [vehicleNumber, setVehicleNumber] = useState(''); 
    const [VIN, setVIN] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [fuelTypes, setFuelTypes] = useState( [
        {  value: 'Diesel' },
        {  value: 'Gasoline'},
        {  value: 'Natural Gas'},
        {  value: 'Propane'}
      ]); 
    const [fuelType, setFuelType] = useState('');
    const [vehicleRegistrationPlace, setVehicleRegistrationPlace] = useState('');

    const postAddingCMV = async () => {
        const cmvData = {
            "company": userON?.company,
            "description": "Vehicle created from mobile app",
            "plate": licensePlate,
            "trailerNumber": vehicleNumber,
            "powerUnitNumber": "123456", // harckodeado no se usa
            "vin": VIN,
            "gasType": {
                "value": fuelType,
                "option": fuelType
            },
            "type": {
                "value": "Truck",
                "option": "Truck"
            },
            "base": userON?.base,
            "state": vehicleRegistrationPlace,
        };
        if(cmvData.plate === '' || cmvData.trailerNumber === '' || cmvData.vin === '' || cmvData.gasType.value === '' || cmvData.state === '') {
            setErrorMessages([languageModule.lang(language, 'allFieldsRequired')]);
            openErrorModal();
            return;
        }
        
        return await postCMV(userON?.data?.id, userON?.data?.carrier?.id,cmvData).then(
            async (res) => {
                if (res.status === 200) {
                    setNewVehicleModal(false);
                } else {
                    const data = await res.json();
                    setErrorMessages([data.message]);
                    openErrorModal();
                }
        });
    }

    return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={newVehicleModal}
          onRequestClose={() => {
              setNewVehicleModal(false);
          }}
        >
          <View style={styles1.modalBackground}>
            <View style={styles1.modalContainer}>
              <Text style={styles1.modalTitle}>{languageModule.lang(language, 'addVehicle')}</Text>
              <TextInput
               style={styles1.input}
               placeholder={languageModule.lang(language, 'vehicleNumber')}
               onChangeText={text => setVehicleNumber(text)}
               keyboardType="numeric"
              />
              <TextInput
                style={styles1.input}
                placeholder="VIN"
                onChangeText={text => setVIN(text)}
              />
              <TextInput
                style={styles1.input}
                placeholder={languageModule.lang(language, 'licensePlate')}
                onChangeText={text => setLicensePlate(text)}
              />
              <TextInput
               style={styles1.input}
               placeholder={languageModule.lang(language, 'vehicleRegistrationPlace')}
               onChangeText={text => {
                const newText = text.replace(/[0-9a-z]/g, '');

                setVehicleRegistrationPlace(newText);
              }}
              value={vehicleRegistrationPlace}
               maxLength={3}
              />
              <SelectDropdown
              buttonTextStyle={{fontSize: 14}}
              buttonStyle={{width: '93%',
              height: 35,
              backgroundColor: '#FFF',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#ddd'}}
              defaultButtonText={languageModule.lang(language,'fuelType')}
              data={fuelTypes}
              onSelect={(selectedItem, index) => {
                console.log(selectedItem, index);
                setFuelType(selectedItem.value);
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem.value;
              }}
              rowTextForSelection={(item, index) => {
              return item.value;
              }}
              />
              <TouchableOpacity style={styles1.addButton} onPress={postAddingCMV}>
                <Text style={styles1.buttonText}>{languageModule.lang(language, 'addVehicle')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles1.cancelButton} onPress={() => {setNewVehicleModal(false)}}>
                <Text style={styles1.buttonText}>{languageModule.lang(language, 'cancel')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
        <SafeAreaView style={styles.container}>
        <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
        {header()}
        {nuevoVehiculoModal()}
        {showErrorModal && (
        <FloatingMessageError
          message={errorMessages}
          onClose={closeErrorModal} // Función para cerrar el modal
        />
      )}
        </SafeAreaView>
  )
}

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

const styles1 = StyleSheet.create({
    modalBackground: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 20,
      width: '80%',
      maxWidth: 400,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#333',
    },
    input: {
      borderWidth: 1,
      borderColor: '#4CAF50',
      borderRadius: 5,
      paddingVertical: 10,
      paddingHorizontal: 15,
      marginBottom: 15,
      fontSize: 16,
      color: '#333',
    },
    addButton: {
      marginTop: 20,
      backgroundColor: '#4CAF50',
      borderRadius: 5,
      paddingVertical: 12,
      alignItems: 'center',
      marginBottom: 10,
    },
    cancelButton: {
      backgroundColor: '#ccc',
      borderRadius: 5,
      paddingVertical: 12,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
});

export default elegirVehiculo;