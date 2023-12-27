import React, { useEffect, useState } from "react";
import { Fonts, Colors, Sizes } from "../../../constants/styles";
import {View,Text,TouchableOpacity,FlatList,ActivityIndicator,StyleSheet,Dimensions} from 'react-native';
import { Overlay } from "react-native-elements";
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width } = Dimensions.get("window");
const languageModule = require('../../../global_functions/variables');

const Diagnostico = ({navigation}) => {
  
  const [tests, setTests] = useState([
    { id: 1, name: languageModule.lang(language, 'locationAvailability'), status: 'Pending' },
    { id: 2, name: languageModule.lang(language, 'storageSpace'), status: 'Pending' },
    { id: 3, name: languageModule.lang(language, 'batteryLevel'), status: 'Pending' },
    { id: 4, name: languageModule.lang(language, 'bluetoothConnectibility'), status: 'Pending' },
    { id: 5, name: languageModule.lang(language, 'engineData'), status: 'Pending' },
  ]);
  const [datosFirmes, setDatosFirmes] = useState([
    { id: 6, name: 'RPM', status: '775' },
    { id: 7, name: languageModule.lang(language, 'odometer'), status: '626599 Millas' },
    { id: 8, name: languageModule.lang(language, 'speed'), status: '1 mph' },
    { id: 9, name: languageModule.lang(language, 'engineHours'), status: '18387 Hrs' },
    { id: 10, name: 'Firmware', status: 'Android GPS device /UNIX BASED' },
  ]);
  const [loading, setLoading] = useState(false);
  const [language, setlanguage] = useState("");

  //   //Uso de efectos de inicio del screen
  //Aqui obtenemos el idioma seleccionado desde la primera pantalla
  useEffect(() => {
    const getPreferredLanguage = async () => {
       try {
         setlanguage(await AsyncStorage.getItem("preferredLanguage"));
       } catch (error) {
         console.log(error);
       }
    };
    getPreferredLanguage();
  }, []);

  const runTests = async () => {
    setLoading(true);
    // Simular el proceso de prueba (podría ser una operación asíncrona)
    setTimeout(() => {
      const updatedTests = tests.map(test => ({
        ...test,
        status: 'Completed', // Cambiar el estado de prueba simulada
      }));
      setTests(updatedTests);
      setLoading(false);
    }, 3000); // Simulación de tiempo de prueba
  };

  const renderItem = ({ item }) => {
    let statusColor = '#000'; // Color por defecto del estado
    let statusText = item.status;

    if (item.status === 'Completed') {
      statusColor = '#4CAF50'; // Cambia a verde si la prueba pasó
    } else if (item.status === 'Failed') {
      statusColor = '#FF0000'; // Cambia a rojo si la prueba falló
    } else if (item.status === 'Testing') {
      statusText = 'Testing...'; // Cambia el texto durante la prueba
    }

    return (
      <View style={styles.testItem}>
        <Text>{item.name}</Text>
        <Text style={{ color: statusColor }}>{statusText}</Text>
        {item.status === 'Testing' && (
          <ActivityIndicator size="small" color="#4CAF50" />
        )}
      </View>
    );
  };

  const renderDatosFirmes = ({ item }) => {
    let statusText = item.status;

    return (
      <View style={styles.testItem}>
        <Text>{item.name}</Text>
        <Text>{statusText}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{languageModule.lang(language, 'diagnosis')}</Text>
      <FlatList
        data={tests}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        style={styles.testList}
      />
      <FlatList
        data={datosFirmes}
        renderItem={renderDatosFirmes}
        keyExtractor={item => item.id.toString()}
        style={styles.testList}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.testButton} onPress={runTests}>
            <Text style={styles.buttonText}>{languageModule.lang(language, 'test')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.continueButton} onPress={() => {navigation.push("PerfilVehiculo")}}>
            <Text style={styles.buttonText}>{languageModule.lang(language, 'continue')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
  },
  testList: {
    flex: 1,
    marginBottom: 20,
  },
  testItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  testButton: {
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
});

export default Diagnostico;

