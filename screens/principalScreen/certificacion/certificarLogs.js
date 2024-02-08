import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet, Modal, Pressable, Image } from 'react-native';
const languageModule = require('../../../global_functions/variables');
import AsyncStorage from '@react-native-async-storage/async-storage'
import {certifyDriverEvents,getDriverEvents,postDriverEvent,} from "../../../data/commonQuerys";
import { getCurrentDriver } from "../../../config/localStorage";
import { setDriverStatus } from "../../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesome } from '@expo/vector-icons';
import { getCurrentUsers } from "../../../config/localStorage";
import Ionicons from 'react-native-vector-icons/Ionicons';

const CertificarRegistros = ({navigation}) => {
  const dispatch = useDispatch();

  const [language, setlanguage] = useState('');
  const [loading, setLoading] = useState(true);
  const [registros, setRegistros] = useState([]);
  const [driverEvents, setDriverEvents] = useState([]);
  const [idEvents, setIdEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRange, setSelectedRange] = useState(null);
  const [newModalVisible, setNewModalVisible] = useState(false);
  const [users, setUsers] = useState('');
  const [userON, setUserON] = useState('');
  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const today = new Date();
  const twentyFourHoursAgo = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const { driverStatus, eldData, acumulatedVehicleKilometers } = useSelector(
    (state) => state.eldReducer
  );

  //obtenemos nuestros datos de certificacion con efecto de montaje
  //obtenemos el usuario en cuestion
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

  const getData = async () => {
    await getDriverEvents('mHlqeeq5rfz3Cizlia23', "undefined", { from: formatDate(twentyFourHoursAgo), to: formatDate(today)}, userON?.data?.id, userON?.data?.carrier?.id).then(async (events) => {
      if(events.length > 0){
        setDriverEvents(events);
        const nuevosIds = events.map(evento => evento.id);
        const uniqueIds = [...new Set(nuevosIds)]; 
        setIdEvents(uniqueIds);
        return;
      }else{
        setDriverEvents(0);
        return;
      }
    });
  };
  
  const hasRun = useRef(false);

  useEffect(() => {
    if (userON?.data?.id && userON?.data?.carrier?.id && !hasRun.current) {
    getData();
    hasRun.current = true;
    setTimeout(() => {
      const registros24HoursPeriod = [
        {
          id: 1,
          fechaInicio: formatDate(twentyFourHoursAgo),
          fechaFin: formatDate(today),
          seleccionado: false,
          certified : true,
        },
      ];
      setRegistros(registros24HoursPeriod);
      setLoading(false);
    }, 2000); 
  }
  }, [userON]);

  //funciones de logica de la pantalla

  const postEvent = async (recordOrigin, status) => {
    await getCurrentDriver().then(async (currentDriver) => {
      // CHER FOR RECERTIFICATIONS "n"
      await postDriverEvent(
        {
          recordStatus: 1,
          recordOrigin: recordOrigin,
          type: 4,
          code: 1,
        },
        "",
        status,
        currentDriver,
        eldData,
        acumulatedVehicleKilometers
      );
    });
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedRange(null);
  }

  const handleCloseNewModal = () => {
    setNewModalVisible(false);
  };

  const handleCertify = () => {
    if(driverEvents === 0){
     setNewModalVisible(true);
    }else{
    if (selectedRange) {
      setModalVisible(true);
    } else {
      console.log('No se ha seleccionado ningún rango');
    }
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

  function userInfo() {
    return (
      <View style={styles.userInfoContainer}>
        <View style={styles.userAvatarContainer}>
          <Image
            source={require('../../../assets/images/certy.png')}
            style={{...styles.userAvatar, marginLeft: 10, width: 60, height: 60, borderRadius: 30,}}
          />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
          {userON?.data?.displayName ? `${userON.data.displayName}` : languageModule.lang(language, 'loading')}
          </Text>
          <Text style={styles.userRole}>
          {userON?.role ? languageModule.lang(language, userON.role) : languageModule.lang(language, 'loading')}
          </Text>
          <View style={styles.innerSeparator} />
        </View>
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
            <Text style={styles.modalText}>{languageModule.lang(language, 'termsOfCertification')}</Text>
            <View style={styles.modalButtons}>
            <Pressable
                style={[styles.modalButton, styles.buttonNotReady]}
                onPress={() => handleCloseModal()}
              >
                <Text style={styles.modalButtonText}>{languageModule.lang(language, 'NotReady')}</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.buttonAgree]}
                onPress={async () => {
                  await certifyDriverEvents(idEvents, "mHlqeeq5rfz3Cizlia23").then(() => {
                    // dispatch(setDriverStatus("ON"));
                    // postEvent(1, "ON");
                    handleCloseModal();
                    getData();
                  });
                }}
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

  function advmodal (){
    return (
      <View>
         <Modal
        animationType="slide"
        transparent={true}
        visible={newModalVisible}
        onRequestClose={() => setNewModalVisible(false)}
      >
        <View style={styles.newModalContainer}>
          <View style={styles.newModalContent}>
            <Text style={styles.newModalText}>
              {languageModule.lang(language, 'youCantCertify')}
            </Text>
            <TouchableOpacity onPress={handleCloseNewModal} style={styles.newCloseButton}>
              <Text style={styles.newButtonText}>{languageModule.lang(language, 'close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
        </View>
    )
  }

  return (
    <View style={styles.container}>
      {header()}
      {userInfo()}
      {loading ? (
        <ActivityIndicator style={styles.loadingIndicator} size="large" color="#4CAF50" />
      ) : registros.length === 0 ? (
        <Text style={styles.noRecordsText}>{languageModule.lang(language, 'thereIsNoDataAvailable')}</Text>
      ) : (
        <FlatList
          data={registros}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.registroItem,
                {
                  backgroundColor: item.seleccionado ? '#4CAF50' : driverEvents[0]?.certified?.value ? '#FFFFFF' : '#FFFFFF',
                  pointerEvents: driverEvents[0]?.certified?.value ? 'none' : 'auto',
                },
              ]}
              onPress={() => handleSelectRange(item)}
              >
              <Text style={{ color: item.seleccionado ? '#FFFFFF' : '#333333' }}>
                {`${item.fechaInicio} ${'12:00'} ${'    a    '} ${item.fechaFin} ${'12:00'}`}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {driverEvents[0]?.certified?.value && (
                      <Ionicons name={"medal-outline"} size={27} color="#48d1cc" />
              )}
              <Text style={{ color: item.seleccionado ? '#FFFFFF' : '#333333' }}>
                {driverEvents[0]?.certified?.value
                  ? `${languageModule.lang(language, 'allRecordsAreCertified')}`
                  : `${languageModule.lang(language, 'logs')}: ${driverEvents.length}`}
              </Text>
            </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
          style={styles.registroList}
        />
      )}
      {footer()}
      {modal()}
      {advmodal()}
    </View>
  );
};

const styles = StyleSheet.create({
  innerSeparator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 5,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatarContainer: {
    marginRight: 10,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 8, 
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  userRole: {
    fontSize: 12,
    color: '#777',  
  },
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
  newModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  newModalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  newModalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  newCloseButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
  },
  newButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default CertificarRegistros;
