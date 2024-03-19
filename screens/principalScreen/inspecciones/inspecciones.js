import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList,Dimensions, Image, StyleSheet, ActivityIndicator, Modal, TextInput } from 'react-native';
import  { Button } from 'react-native-elements';
import { getCurrentDriver, getCurrentUsers } from "../../../config/localStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from 'react-native-vector-icons/Ionicons';
const languageModule = require('../../../global_functions/variables');
const { width } = Dimensions.get("window");

const Inspecciones = ({ navigation }) => {

    //declaracion de variables
    const [language, setLanguage] = useState('');

    //uso de efectos

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

    //funciones de renderizado

    const header = () => {
        return (
          <View >
            {/* Titulo */}
            <Text style={styles.title}>{languageModule.lang(language, "inspectionsReport")}</Text>
          </View>
        );
    }

    return (
        <View style={styles.container}>
        {/* Header */}
        {header()}
        </View>
    )

}

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

export default Inspecciones;