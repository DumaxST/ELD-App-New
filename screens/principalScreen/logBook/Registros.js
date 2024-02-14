import {Alert,TextInput,StyleSheet,Modal,Text,View, ActivityIndicator,SafeAreaView,ScrollView,FlatList,Dimensions,StatusBar,Image,TouchableOpacity,} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Fonts, Colors, Sizes } from "../../../constants/styles";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Overlay } from "react-native-elements";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getDriverEvents, DriverEvent } from "../../../data/commonQuerys";
import { getCurrentDriver } from "../../../config/localStorage";
import { getDriverEvents, DriverEvent } from "../../../data/commonQuerys";
import { getCurrentDriver } from "../../../config/localStorage";
import { editDriverLogEvent } from "../../../redux/actions";
import { useDispatch } from "react-redux";
import { getCurrentUsers } from "../../../config/localStorage";


const { height, width } = Dimensions.get("window");
const languageModule = require('../../../global_functions/variables');

const ListSection = () => {
  const dispatch = useDispatch();
  const [language, setlanguage] = useState(""); 
  const [isLoading, setIsLoading] = useState(true);
  const [eventDetailsDialog, setEventDetailsDialog] = useState(false);
  const [currentEventDetails, setCurretEventDetails] = useState({});
  const [driverEvents, setDriverEvents] = useState([]);
  const [unidentifiedEvents, setUnidentifiedEvents] = useState([]);
  const [users, setUsers] = useState('');
  const [userON, setUserON] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedButton, setSelectedButton] = useState(null);
  const [selectedButton, setSelectedButton] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); 
  const day = String(today.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  const [state, setState] = useState({
    numeroDelCamion: "",
    numeroDelTrailer: "",
    vinDelCamion: "",
    odometroVisual: "",
  });
  const {
      numeroDelCamion,
      vinDelCamion,
      numeroDelTrailer,
      numeroDeDocumentoDeEnvio,
      odometroVisual,
  } = state;
  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  //Uso de efectos de inicio del screen
  //obtenemos el usuario principal (Solo para acciones, el mando sigue siendo de el currentDriver)
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
         } catch (error) {
           console.log(error);
         }
      };
      getPreferredLanguage();
  }, []);

  const getData = async () => {
    try {
      const events = await getDriverEvents('mHlqeeq5rfz3Cizlia23', "undefined", { from: "", to: formattedDate }, userON?.data?.id, userON?.data?.carrier?.id );
      setDriverEvents(events);
      setIsLoading(false);
    } catch (error) {
      console.error('Error al obtener eventos:', error);
      setIsLoading(false);
    }
  };
  
  const hasRun = useRef(false);

  useEffect(() => {
    if (userON?.data?.id && userON?.data?.carrier?.id && !hasRun.current) {
      getData();
      hasRun.current = true;
    }
  }, [userON]);

  //funciones de logica de screen
  //editamos con la funcion de put driver 
  const handleSave = async () => {  
      if (!selectedEvent?.commentOrAnnotation) {
        Alert.alert(
          "Error",
          languageModule.lang(language, 'addCommentToContinue'),
          [
            { text: "OK" }
          ]
        );
        return;
      }
      setCommentModalVisible(false);
      setModalVisible(false);
      setIsLoading(true); 
      DriverEvent.makeHistory(userON?.data?.carrier?.id, userON?.data?.id, "mHlqeeq5rfz3Cizlia23", selectedEvent).then((res) => {
        DriverEvent.put(selectedEvent, userON?.data, true).then((res) => {       
        setIsLoading(true);  
        getData()
        }).catch((err) => {  
          console.log(err)
        })
      }).catch((err) => {
        console.log(err)
      })
  };
  
  const handleButtonClick = (dutyStatus) => {
      setSelectedButton(dutyStatus);
      setSelectedEvent((prevEvent) => ({
        ...prevEvent,
        dutyStatus: dutyStatus,
      }));
  };
  
  function traducirStatus(status){
      switch (status) {
        case "ON":
          return "onDuty";
        case "OFF-DUTY":
          return "offDuty";
        case "D":
          return "driving";
        case "SB":
          return "Sleeper";
        case "PS":
          return "passenger";
        case "PC":
          return "PERSONAL";
        case "YM":
          return "YARD";
        default:
          return "No identificado";
      }
  }

  const openModal = (event) => {
      setSelectedEvent(event);
      setModalVisible(true);
  };

  const closeModal = () => {
      setSelectedEvent(null);
      setModalVisible(false);
  };

  //funciones de renderizado
  function userInfo() {
    return (
      <View style={styles.userInfoContainer}>
        <View style={styles.userAvatarContainer}>
          <Image
            source={require('../../../assets/images/bitacora.png')}
            style={styles.userAvatar}
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

  function Logs() {
      const convertElapsedTime = (currentTimeStamp, previousTimeStamp) => {
        const secondsDiff = previousTimeStamp - currentTimeStamp;
        const millisecondsDiff = secondsDiff * 1000;
        const dateDiff = new Date(millisecondsDiff);
        
        const hours = dateDiff.getUTCHours();
        const minutes = dateDiff.getUTCMinutes();
        return `${hours} hrs ${minutes} min`;
      };      

      function utcParser(date, hours) {
        date.setHours(date.getHours() + hours);
        return date;
      }

      function convertirTimestampAFechaYHora(timestamp) {
        const date = new Date(timestamp * 1000); 
        const dia = date.getDate();
        const mes = date.getMonth() + 1; 
        const año = date.getFullYear();
        const horas = date.getHours();
        const minutos = date.getMinutes();
        const diaFormatado = dia < 10 ? `0${dia}` : dia;
        const mesFormatado = mes < 10 ? `0${mes}` : mes;
        const horasFormatadas = horas < 10 ? `0${horas}` : horas;
        const minutosFormatados = minutos < 10 ? `0${minutos}` : minutos;
      
        const fechaHoraFormateada = `${diaFormatado}/${mesFormatado}/${año} - ${horasFormatadas}:${minutosFormatados}`;
      
        return fechaHoraFormateada;
      }

      const date = utcParser(new Date(), 6);
      const month = `${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      const day = `${date.getDate().toString().padStart(2, '0')}`;
      const year = date.getFullYear().toString().slice(-2);
    
      const hour = `${date.getHours().toString().padStart(2, '0')}`;
      const minutes = `${date.getMinutes().toString().padStart(2, '0')}`;
      const seconds = `${date.getSeconds().toString().padStart(2, '0')}`;

      const currentSeconds = Math.floor(Date.now() / 1000);
      const tiempoEventoUTC6 = driverEvents[0].geoTimeStamp.timeStamp._seconds;
      const tiempoTranscurrido = currentSeconds - tiempoEventoUTC6;
      const horas = Math.floor(tiempoTranscurrido / 3600);
      const minutos = Math.floor((tiempoTranscurrido % 3600) / 60);

      return (
        <ScrollView>
      <View style={{ marginTop: 20 }}>
        {Array.isArray(driverEvents) &&
          driverEvents.map((event, i) => (
            <View
              key={`driverEvent_${event.id}`}
              style={{
                marginHorizontal: 20,
                padding: 15,
                backgroundColor: event.recordOrigin === 4 && event.recordStatus === 1 ? '#bfcde6' : '#E6F4EA', // Color azul si recordOrigin es 4 y recordStatus es 1, de lo contrario color verde
                borderRadius: 10,
                marginBottom: 20,
              }}
            >
              {/* Detalles del evento */}
              <Text>{languageModule.lang(language, "status")}{": "}{languageModule.lang(language,traducirStatus(event.dutyStatus))}</Text>
              <Text>{languageModule.lang(language, "sequenceIDNumber")}{": "}{`${event.sequenceIDNumber.decimal} - ${event.sequenceIDNumber.hexadecimal}`}</Text>
              <Text>{languageModule.lang(language, "recordOrigin")}{": "}{`${event?.recordOrigin}`}</Text>
              <Text>{languageModule.lang(language, "recordStatus")}{": "}{event?.recordStatus}</Text>
              <Text>{languageModule.lang(language, "startTime")}{": "}
                    {`${event?.geoTimeStamp?.date.substring(
                          0,
                          2
                        )}/${event?.geoTimeStamp?.date.substring(
                          2,
                          4
                        )}/${event?.geoTimeStamp?.date.substring(
                          4,
                          6
                        )} - ${event?.geoTimeStamp?.time.substring(
                          0,
                          2
                        )}:${event?.geoTimeStamp?.time.substring(
                          2,
                          4
                        )}:${event?.geoTimeStamp?.time.substring(4, 6)} `}
              </Text>
              <Text>{languageModule.lang(language, "finishTime")}{": "}                        
              {i === 0
              ? `${month}/${day}/${year} - ${hour}:${minutes}:${seconds}`
              : `${driverEvents[i - 1]?.geoTimeStamp?.date.substring(0, 2)}/${driverEvents[i - 1]?.geoTimeStamp?.date.substring(2, 4)}/${driverEvents[i - 1]?.geoTimeStamp?.date.substring(4, 6)} - ${driverEvents[i - 1]?.geoTimeStamp?.time.substring(0, 2)}:${driverEvents[i - 1]?.geoTimeStamp?.time.substring(2, 4)}:${driverEvents[i - 1]?.geoTimeStamp?.time.substring(4, 6)} `}
              </Text>
              <Text>{languageModule.lang(language, "elapsedTime")}{": "}                        
                          {i == 0
                          ? `${horas} hrs ${minutos} min`
                          : convertElapsedTime(event.geoTimeStamp.timeStamp._seconds,
                           driverEvents[i - 1].geoTimeStamp.timeStamp._seconds
                          )}
              </Text>
              <Text>
              {languageModule.lang(language, 'closestLocation')}{": "}
              {event?.address?.reachOf
                ? event.address.reachOf.distance + " " + languageModule.lang(language, 'kmAwayFrom') + " " + event.address.reachOf.city + ", " + event.address.reachOf.state
                : languageModule.lang(language, 'notAvailable')}
              </Text>
              {/* <Text>{languageModule.lang(language, "observations")}{": "}{"Pre - TI"}</Text>
              <Text>{languageModule.lang(language, "carrier")}{": "}{event.carrier.name}</Text> */}
              <Text>
              {languageModule.lang(language, "certified")}{": "}
              {event?.certified?.value
                ? convertirTimestampAFechaYHora(event.certified.timeStamp._seconds)
                : "No"}
              </Text>
              {event.recordOrigin === 4 && event.recordStatus === 1 && (
            <Text style={{ color: 'white' }}>
              {languageModule.lang(language, 'assumedRecord')}
            </Text>
            )}
              {/* Opciones de edición/visualización/eliminación */}
              <View style={{ position: 'absolute', top: 10, right: 10 }}>
                <TouchableOpacity
                  onPress={() => openModal(event)}
                >
                  <MaterialIcons name="edit" size={24} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ marginTop: 10 }}
                  onPress={() => {
                    // Acción para eliminar el evento
                    console.log('Eliminar evento:', event.id);
                  }}
                >
                  <MaterialIcons name="delete" size={24} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
      </View>
    </ScrollView>
      );
  }

  //Edicion con datos mas establecidos
  function editEvent() {
      return (
        <View>
          <Modal visible={modalVisible} animationType="slide">
          <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.modalContainer}>
          <Text style={{...styles.modalTitle, marginTop: -10}}>{languageModule.lang(language,'eventDetails')}</Text>
          <Text style={{textAlign: "left"}}>{languageModule.lang(language, 'status')}</Text>
          {/* Botones de arriba 4 */}
          <View style={{ ...styles.buttonContainer, marginVertical: -20 }}>
            <TouchableOpacity
              style={{
                ...styles.button,
                width: '30%',
                borderRadius: 10,
                borderColor: 'black',
                borderWidth: 1,
                backgroundColor: selectedEvent?.dutyStatus === 'OFF-DUTY' ? '#4CAF50' : 'transparent',
              }}
              onPress={() => handleButtonClick("OFF-DUTY")}
            >
              <Text style={styles.buttonTextOptions}>{languageModule.lang(language, traducirStatus("OFF-DUTY"))}</Text>
            </TouchableOpacity>   
            <TouchableOpacity
              style={{
                ...styles.button,
                width: '20%',
                borderRadius: 10,
                borderColor: 'black',
                borderWidth: 1,
                backgroundColor:  selectedEvent?.dutyStatus  === 'ON' ? '#4CAF50' : 'transparent',
              }}
              onPress={() => handleButtonClick("ON")}
            >
              <Text style={styles.buttonTextOptions}>{languageModule.lang(language, traducirStatus("ON"))}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                ...styles.button,
                width: '23%',
                borderRadius: 10,
                borderColor: 'black',
                borderWidth: 1,
                backgroundColor:  selectedEvent?.dutyStatus  === 'D' ? '#4CAF50' : 'transparent',
              }}
              onPress={() => handleButtonClick("D")}
            >
              <Text style={styles.buttonTextOptions}>{languageModule.lang(language, traducirStatus("D"))}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                ...styles.button,
                width: '20%',
                borderRadius: 10,
                borderColor: 'black',
                borderWidth: 1,
                backgroundColor:  selectedEvent?.dutyStatus  === 'SB' ? '#4CAF50' : 'transparent',
              }}
              onPress={() => handleButtonClick("SB")}
            >
              <Text style={styles.buttonTextOptions}>{languageModule.lang(language, traducirStatus("SB"))}</Text>
            </TouchableOpacity>
          </View>
          {/* Botones de abajo 3 */}
          <View style={{ ...styles.buttonContainer, marginVertical: 5 }}>
          <TouchableOpacity
              style={{
                ...styles.button,
                width: '20%',
                borderRadius: 10,
                borderColor: 'black',
                borderWidth: 1,
                backgroundColor:  selectedEvent?.dutyStatus === 'PS' ? '#4CAF50' : 'transparent',
              }}
              onPress={() => handleButtonClick("PS")}
            >
              <Text style={styles.buttonTextOptions}>{languageModule.lang(language, traducirStatus("PS"))}</Text>
          </TouchableOpacity>
          <TouchableOpacity
              style={{
                ...styles.button,
                width: '20%',
                borderRadius: 10,
                borderColor: 'black',
                borderWidth: 1,
                backgroundColor:  selectedEvent?.dutyStatus === 'PC' ? '#4CAF50' : 'transparent',
              }}
              onPress={() => handleButtonClick("PC")}
            >
              <Text style={styles.buttonTextOptions}>{languageModule.lang(language, traducirStatus("PC"))}</Text>
          </TouchableOpacity>
          <TouchableOpacity
              style={{
                ...styles.button,
                width: '20%',
                borderRadius: 10,
                borderColor: 'black',
                borderWidth: 1,
                backgroundColor:  selectedEvent?.dutyStatus === 'YM' ? '#4CAF50' : 'transparent',
              }}
              onPress={() => handleButtonClick("YM")}
            >
              <Text style={styles.buttonTextOptions}>{languageModule.lang(language, traducirStatus("YM"))}</Text>
          </TouchableOpacity>
          </View>
          {/* Resto de los TextInput */}
          {/*-----------NO editable aun------------*/}  
          <Text style={{textAlign: "left"}}>{languageModule.lang(language, "startTime")}</Text>
          <TextInput
            editable={false}
            style={styles.input}
            value={`${selectedEvent?.geoTimeStamp?.date.substring(
              0,
              2
            )}/${selectedEvent?.geoTimeStamp?.date.substring(
              2,
              4
            )}/${selectedEvent?.geoTimeStamp?.date.substring(
              4,
              6
            )} - ${selectedEvent?.geoTimeStamp?.time.substring(
              0,
              2
            )}:${selectedEvent?.geoTimeStamp?.time.substring(
              2,
              4
            )}:${selectedEvent?.geoTimeStamp?.time.substring(4, 6)} `}
            placeholder={`${selectedEvent?.geoTimeStamp?.date.substring(
              0,
              2
            )}/${selectedEvent?.geoTimeStamp?.date.substring(
              2,
              4
            )}/${selectedEvent?.geoTimeStamp?.date.substring(
              4,
              6
            )} - ${selectedEvent?.geoTimeStamp?.time.substring(
              0,
              2
            )}:${selectedEvent?.geoTimeStamp?.time.substring(
              2,
              4
            )}:${selectedEvent?.geoTimeStamp?.time.substring(4, 6)} `}
          />
          {/*-----------------------*/}
          <Text style={{textAlign: "left"}}>{languageModule.lang(language, "truckVIN")}</Text>
          <TextInput
            style={styles.input}
            value={`${selectedEvent?.cmv?.vin}`}
            placeholder={`${selectedEvent?.cmv?.vin}`}
            onChangeText={(text) => {
              setSelectedEvent((prevEvent) => ({
                ...prevEvent,
                cmv: { ...prevEvent.cmv, vin: text },
              }));
            }}
          />
          {/*-----------------------*/}
          <Text style={{textAlign: "left"}}>{languageModule.lang(language, "truckNumber")}</Text>
          <TextInput
            style={styles.input}
            value={`${selectedEvent?.cmv?.number}`}
            placeholder={`${selectedEvent?.cmv?.number}`}
            onChangeText={(text) => {
              setSelectedEvent((prevEvent) => ({
                ...prevEvent,
                cmv: { ...prevEvent.cmv, number: text },
              }));
            }}
          />
          {/*-----------------------*/}
          <Text style={{textAlign: "left"}}>{languageModule.lang(language, "powerUnitNumber")}</Text>
          <TextInput
            style={styles.input}
            value={`${selectedEvent?.cmv?.powerUnitNumber}`}
            placeholder={`${selectedEvent?.cmv?.powerUnitNumber}`}
            onChangeText={(text) => {
              setSelectedEvent((prevEvent) => ({
                ...prevEvent,
                cmv: { ...prevEvent.cmv, powerUnitNumber: text },
              }));
            }}
          />
          {/*-----------No editable aun------------*/}
          <Text style={{textAlign: "left"}}>{languageModule.lang(language, 'shippingDocumentNumber')}</Text>
          <TextInput
            editable={false}
            style={styles.input}
            value={numeroDeDocumentoDeEnvio}
            onChangeText={(text) => updateState({ numeroDeDocumentoDeEnvio: text })}
          />
          <Text style={{textAlign: "left"}}>{languageModule.lang(language, "accumulatedVehicleMiles")}</Text>
          <TextInput
            style={styles.input}
            value={`${selectedEvent?.acumulatedVehicleMiles}`}
            placeholder={`${selectedEvent?.acumulatedVehicleMiles}`}
            onChangeText={(text) => {
              setSelectedEvent((prevEvent) => ({
                ...prevEvent, acumulatedVehicleMiles: text,
              }));
            }}
          />
          {/*-----------------------*/}
          <Text style={{textAlign: "left"}}>{languageModule.lang(language, "elapsedEngineHours")}</Text>
          <TextInput
            style={styles.input}
            value={`${selectedEvent?.elapsedEngineHours}`}
            placeholder={`${selectedEvent?.elapsedEngineHours}`}
            onChangeText={(text) => {
              setSelectedEvent((prevEvent) => ({
                ...prevEvent, elapsedEngineHours: text,
              }));
            }}
          />
          {/*-----------No terminado no editable------------*/}   
          <Text style={{textAlign: "left"}}>{languageModule.lang(language, "location")}</Text>
          <TextInput  
            editable={true}
            style={styles.input}
            value={`${selectedEvent?.address?.address}`}
            placeholder={`${selectedEvent?.address?.address}`}
          />
          <Text style={{textAlign: "left"}}>{languageModule.lang(language, 'closestLocation')}</Text>
          <TextInput
            editable={true}
            style={styles.input}
            value={selectedEvent?.address?.reachOf?.distance || ''}
            placeholder={selectedEvent?.address?.reachOf?.distance || ''}
            onChangeText={(distance) => {
              setSelectedEvent((prevEvent) => ({
                ...prevEvent,
                address: {
                  ...prevEvent.address,
                  reachOf: {
                    ...prevEvent.address.reachOf,
                    distance,
                  },
                },
              }));
            }}
          />
          
          <TextInput
            editable={true}
            style={styles.input}
            value={selectedEvent?.address?.reachOf?.city || ''}
            placeholder={selectedEvent?.address?.reachOf?.city || ''}
            onChangeText={(city) => {
              setSelectedEvent((prevEvent) => ({
                ...prevEvent,
                address: {
                  ...prevEvent.address,
                  reachOf: {
                    ...prevEvent.address.reachOf,
                    city,
                  },
                },
              }));
            }}
          />
          
          <TextInput
            editable={true}
            style={styles.input}
            value={selectedEvent?.address?.reachOf?.state || ''}
            placeholder={selectedEvent?.address?.reachOf?.state || ''}
            onChangeText={(state) => {
              setSelectedEvent((prevEvent) => ({
                ...prevEvent,
                address: {
                  ...prevEvent.address,
                  reachOf: {
                    ...prevEvent.address.reachOf,
                    state,
                  },
                },
              }));
            }}
          />
        </View>    
        </ScrollView>  
          {/* Botones */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
              <Text style={styles.buttonText}>{languageModule.lang(language, 'cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={() =>{setCommentModalVisible(true)}}>
              <Text style={styles.buttonText}>{languageModule.lang(language, 'save')}</Text>
            </TouchableOpacity>
          </View>
      </Modal>
        </View>
      );
  }

  function addComment() {
    return (
      <View>
      <Modal visible={commentModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={{...styles.modalTitle, marginTop: -10}}>{languageModule.lang(language,'addCommentToContinue')}</Text>
          <Text style={{textAlign: "left"}}>{languageModule.lang(language, "commentOrAnnotation")}</Text>
          <TextInput
            style={{
              ...styles.input,
              borderColor: selectedEvent?.commentOrAnnotation ? 'green' : '#cc0b0a',
              height: 300,
              textAlignVertical: 'top',
            }}
            value={`${selectedEvent?.commentOrAnnotation}`}
            placeholder={`${selectedEvent?.commentOrAnnotation}`}
            onChangeText={(text) => {
              setSelectedEvent((prevEvent) => ({
                ...prevEvent, commentOrAnnotation: text,
              }));
            }}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={() =>{setCommentModalVisible(false)}}>
              <Text style={styles.buttonText}>{languageModule.lang(language, 'cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>{languageModule.lang(language, 'save')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
    )
  }

  return (
    <View style={styles.sectionContainer}>
      {userInfo()}
      {isLoading ? (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : driverEvents.length === 0 ? (
        <Text>{languageModule.lang(language, 'thereAreNoRecords')}</Text>
      ) : (
        <Logs />
      )}
      {editEvent()}
      {addComment()}
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff', // Color verde del diseño
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    width: '100%',
    height: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 45,
    top: -25,
  },
  saveButton: {
    borderWidth: 1,
    borderColor: '#888',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#888',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextOptions: {
    color: 'black',
    fontSize: 10,
    fontWeight: 'bold',
  },
  sectionContainer: {
    flex: 1,
    marginBottom: 20,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default ListSection;
