import React, { useState, useEffect } from 'react';
import {View,Text,TextInput,Image,TouchableOpacity,ScrollView,SafeAreaView,StyleSheet,Dimensions,StatusBar,} from 'react-native';
import { Colors, Fonts, Sizes } from '../../../constants/styles';
import { useDispatch, useSelector } from "react-redux";
import { getCurrentDriver, currentCMV } from "../../../config/localStorage";
import { startVehicleMeters } from "../../../redux/actions";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get('window');
const languageModule = require('../../../global_functions/variables');

const elegirVehiculo = ({ navigation }) => {  


  //declaracion de variables
  const [language, setlanguage] = useState('');
  
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

  //funciones de renderizado
   const header = () => {
        return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
             <Text style={styles.title}>{languageModule.lang(language, 'chooseVehicle')}</Text>
        </View>
        );
   }

   return (
        <SafeAreaView style={styles.container}>
        <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
        {header()}
        </SafeAreaView>
   )
}

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

export default elegirVehiculo;