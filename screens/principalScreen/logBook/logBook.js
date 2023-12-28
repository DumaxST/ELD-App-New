import React, { useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import GraficaSection from './GraficaSection';
import Registros from './Registros';
import UndefinedReg from './UndefinedReg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';


const { height, width } = Dimensions.get("window");
const languageModule = require('../../../global_functions/variables');

const EventosScreen = () => {
    const [language, setlanguage] = useState("");
    const [activeTab, setActiveTab] = useState('Eventos');

    //Uso de efectos de inicio del screen
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

    const changeTab = (tab) => {
      setActiveTab(tab);
    };

  return (
    <View style={[styles.container, { backgroundColor: '#fff' }]}>
      <Text style={styles.title}>{languageModule.lang(language,"logBook")}</Text>

      {/* Pestañas */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Eventos' && styles.activeTab]}
          onPress={() => changeTab('Eventos')}
        >
          <Text>{languageModule.lang(language, 'logBook')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Registros' && styles.activeTab]}
          onPress={() => changeTab('Registros')}
        >
          <Text>{languageModule.lang(language, 'logs')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'RegistrosIndefinidos' && styles.activeTab]}
          onPress={() => changeTab('RegistrosIndefinidos')}
        >
          <Text>{languageModule.lang(language, 'undefinedLogs')}</Text>
        </TouchableOpacity>
      </View>

      {/* Contenido de las pestañas */}
      {activeTab === 'Eventos' && <GraficaSection />}
      {activeTab === 'Registros' && <Registros />}
      {activeTab === 'RegistrosIndefinidos' && <UndefinedReg />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50', // Color verde para el texto
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  activeTab: {
    backgroundColor: '#ccc',
  },
  // ... (otros estilos y código)
});

export default EventosScreen;


