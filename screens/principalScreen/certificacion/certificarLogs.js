import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet, Modal, Pressable } from 'react-native';
const languageModule = require('../../../global_functions/variables');
import AsyncStorage from '@react-native-async-storage/async-storage'


const CertificarRegistros = ({navigation}) => {

  const [language, setlanguage] = useState('');
  const [loading, setLoading] = useState(true);
  const [registros, setRegistros] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRange, setSelectedRange] = useState(null);
  const today = new Date();
  const twentyFourHoursAgo = new Date(today.getTime() - 24 * 60 * 60 * 1000);


  //Aqui obtenemos el idioma seleccionado desde la primera pantalla
  useEffect(() => {
      const getPreferredLanguage = async () => {
        try {
          setlanguage(await AsyncStorage.getItem("preferredLanguage"));
          console.log("Idioma seleccionado: " + language);
        } catch (error) {
          console.log(error);
        }
      };
      getPreferredLanguage();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      const registrosSimulados = [
        {
          id: 1,
          fechaInicio: formatDate(twentyFourHoursAgo),
          fechaFin: formatDate(today),
          seleccionado: false,
        },
      ];
      setRegistros(registrosSimulados);
      setLoading(false);
    }, 2000); 
  }, []);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleCertify = () => {
    if (selectedRange) {
      setModalVisible(true);
    } else {
      console.log('No se ha seleccionado ningún rango');
    }
  };

  const handleSelectRange = (item) => {
    const updatedRegistros = registros.map((registro) => {
      if (registro.id === item.id) {
        return { ...registro, seleccionado: !registro.seleccionado };
      } else {
        return registro;
      }
    });
    setSelectedRange(item);
    setRegistros(updatedRegistros);
  };

  //funciones de renderizado

  function header() {
    return (
      <View>
        <Text style={styles.title}>{languageModule.lang(language, 'certifyLogs')}</Text>
      </View>
    );
  }

  function footer() {
       return(
        <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.pop()}>
          <Text style={styles.buttonText}>{languageModule.lang(language, 'cancel')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleCertify()}>
          <Text style={styles.buttonText}>{languageModule.lang(language, 'certify')}</Text>
        </TouchableOpacity>
      </View>
       )
  }

  function modal() {
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
            <Text style={styles.modalText}>{`Rango seleccionado: ${selectedRange?.fechaInicio} a ${selectedRange?.fechaFin}`}</Text>
            <View style={styles.modalButtons}>
            <Pressable
                style={[styles.modalButton, styles.buttonNotReady]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.modalButtonText}>{languageModule.lang(language, 'NotReady')}</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.buttonAgree]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.modalButtonText}>{languageModule.lang(language, 'Agree')}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      </View>
    )
  }  

  return (
    <View style={styles.container}>
      {header()}
      {loading ? (
        <ActivityIndicator style={styles.loadingIndicator} size="large" color="#4CAF50" />
      ) : registros.length === 0 ? (
        <Text style={styles.noRecordsText}>No hay registros disponibles</Text>
      ) : (
        <FlatList
          data={registros}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.registroItem,
                { backgroundColor: item.seleccionado ? '#4CAF50' : '#FFFFFF' },
              ]}
              onPress={() => handleSelectRange(item)} // Modificado para manejar la selección
            >
              <Text style={{ color: item.seleccionado ? '#FFFFFF' : '#333333' }}>
                {`${item.fechaInicio} a ${item.fechaFin}`}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
          style={styles.registroList}
        />
      )}
      {footer()}
      {modal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4CAF50',
  },
  loadingIndicator: {
    marginTop: 20,
  },
  noRecordsText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#333333',
    marginTop: 40,
  },
  registroItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#000000',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  registroList: {
    marginTop: 40, 
  },
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
});

export default CertificarRegistros;
