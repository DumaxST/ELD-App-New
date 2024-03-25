import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList,Dimensions, Image, StyleSheet, ActivityIndicator, Modal, TextInput } from 'react-native';
import  { Button } from 'react-native-elements';
import { getCurrentDriver, getCurrentUsers } from "../../../config/localStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { textAlign } from '@mui/system';
const languageModule = require('../../../global_functions/variables');
const { width } = Dimensions.get("window");

const Inspecciones = ({ navigation }) => {

    //declaracion de variables
    const [language, setLanguage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([
        { id: 1, vehicleNumber: "1", inspectionType: "Pre-trip", inspector: "John Doe", inspectionDate: "2024-03-19, 4:05 PM (GMT-6:00)", status: "Completado" },
        { id: 2, vehicleNumber: "2", inspectionType: "Pre-trip", inspector: "Jane Smith", inspectionDate: "2024-03-18, 4:05 PM (GMT-6:00)", status: "Pendiente" },
        { id: 3, vehicleNumber: "3", inspectionType: "Pre-trip", inspector: "Alice Johnson", inspectionDate: "2024-03-17, 4:05 PM (GMT-6:00)", status: "Completado" },
    ]);

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

    //funciones de la pantalla

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity style={styles.itemContainer}>
                <Text style={styles.itemText}>{item.vehicleNumber}</Text>
                <Text style={styles.itemText}>{item.inspectionType}</Text>
                <Text style={styles.itemText}>{item.inspector}</Text>
                <Text style={styles.itemText}>{item.inspectionDate}</Text>
                <Text style={[styles.itemText, { color: item.status === 'Completado' ? '#4CAF50' : '#FFC107' }]}>{item.status}</Text>
                <View style={styles.actionsContainer}>
                    <TouchableOpacity onPress={() => handleDownload(item.id)}>
                        <Ionicons name="cloud-download-outline" size={24} color="#4CAF50" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item.id)}>
                        <Ionicons name="trash-outline" size={24} color="#FF5733" />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    }

    //funciones de renderizado

    const header = () => {
        return (
          <View >
            {/* Titulo */}
            <Text style={styles.title}>{languageModule.lang(language, "inspectionsReport")}</Text>
          </View>
        );
    }

    const renderColumnHeader = () => {
        return (
            <View style={styles.columnHeaderContainer}>
                <Text style={styles.columnHeader}>{languageModule.lang(language, "vehicleNumber")}</Text>
                <Text style={styles.columnHeader}>{languageModule.lang(language, "inspectionType")}</Text>
                <Text style={styles.columnHeader}>{languageModule.lang(language, "inspector")}</Text>
                <Text style={styles.columnHeader}>{languageModule.lang(language, "inspectionDate")}</Text>
                <Text style={styles.columnHeader}>{languageModule.lang(language, "status")}</Text>
                <Text style={styles.columnHeader}>{languageModule.lang(language, "actions")}</Text> 
            </View>
        );
    }

    return (
        <View style={styles.container}>
        {/* Header */}
        {header()}
        {/* Inspections */}
        {renderColumnHeader()}
        {loading ? (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
        ) : data.length === 0 ? (
          <Text style={{textAlign: 'center', marginTop: 200}} >{languageModule.lang(language, 'thereAreNoRecords')}</Text>
        ) : (     
            <View>
            <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            />
            </View>
        )}
        {/* Add button */}
        <TouchableOpacity style={styles.addButton} disabled={isLoading} onPress={() => {navigation.navigate('Regulaciones')}}>
        {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>+</Text>
          )}
        </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
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
    columnHeader: {
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    driverItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
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
    headerContainer: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    columnHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        marginTop: 50,
    },
    columnHeader: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#4CAF50',
        flex: 1,
        textAlign: 'center',
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    itemText: {
        fontSize: 12,
        flex: 1,
        textAlign: 'center',
    },
    actionsContainer: {
        justifyContent: 'space-around',
        width: 25,
    }
});

export default Inspecciones;