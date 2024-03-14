import React, { useState, useEffect } from 'react';
import {View,Modal,Button,Text,TextInput,Image,TouchableOpacity,ActivityIndicator,ScrollView,SafeAreaView,StyleSheet,Dimensions,StatusBar,} from 'react-native';
import { Colors, Fonts, Sizes } from '../../../constants/styles';
import SelectDropdown from 'react-native-select-dropdown';
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUsers } from "../../../config/localStorage";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getCurrentDriver, currentCMV } from "../../../config/localStorage";
import { postCMV, getCMVs} from "../../../data/commonQuerys";
import { startVehicleMeters } from "../../../redux/actions";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get('window');
const languageModule = require('../../../global_functions/variables');

const elegirRemolque = ({ navigation }) => {
  //declaracion de variables
  const [language, setlanguage] = useState('');
  const [users, setUsers] = useState('');
  const [userON, setUserON] = useState('');
  const [company, setcompany] = useState('');
  const [base, setbase] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessages, setErrorMessages] = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [newTrailerModal, setNewTrailerModal] = useState(false);
  const [Trailers, setTrailers] = useState([]);
  const [trailerSeleccionado, setTrailerSeleccionado] = useState(null);
  const [miTrailer, setmiTrailer] = useState('');
  const [buscarTrailer ,setBuscarTrailer] = useState('');

  //efectos de la pantalla
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

  //funciones de renderizado
  const header = () => {
      return (
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={styles.title}>{languageModule.lang(language, 'chooseTrailer')}</Text>
      </View>
      );
  }  

  return(  
    <SafeAreaView style={styles.container}>
    <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
    {header()}
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
    buttonContainer: {
        top: -50,
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      scanButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 16,
        alignItems: 'center',
        borderRadius: 8,
        flex: 1,
        marginRight: 10,
      },
      continueButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 16,
        alignItems: 'center',
        borderRadius: 8,
        flex: 1,
        marginLeft: 10,
      },
      buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
      },
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
    centeredButtonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      centeredButton: {
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 5,
      },
      buttonText: {
        color: 'white',
        textAlign: 'center',
      },
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


export default elegirRemolque;