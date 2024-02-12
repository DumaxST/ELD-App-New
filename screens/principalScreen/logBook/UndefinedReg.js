import {Alert,TextInput,StyleSheet,Modal,Text,View, ActivityIndicator,SafeAreaView,ScrollView,FlatList,Dimensions,StatusBar,Image,TouchableOpacity,} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Fonts, Colors, Sizes } from "../../../constants/styles";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Overlay } from "react-native-elements";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getDriverEvents, DriverEvent } from "../../../data/commonQuerys";
import { getCurrentDriver } from "../../../config/localStorage";
import { editDriverLogEvent } from "../../../redux/actions";
import { geoTimeStamp } from "../../../components/eldFunctions";
import { useSelector, useDispatch } from "react-redux";


const { height, width } = Dimensions.get("window");
const languageModule = require('../../../global_functions/variables');

const ListSection = () => {
  const dispatch = useDispatch();
  const {eldData,driverStatus,currentDriver,acumulatedVehicleKilometers,lastDriverStatus} = useSelector((state) => state.eldReducer);
  const [language, setlanguage] = useState(""); 
  const [isLoading, setIsLoading] = useState(true);
  const [eventDetailsDialog, setEventDetailsDialog] = useState(false);
  const [currentEventDetails, setCurretEventDetails] = useState({});
  const [driverEvents, setDriverEvents] = useState([]);
  const [unidentifiedEvents, setUnidentifiedEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [secondModalVisible, setSecondModalVisible] = useState(false);
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
  
    //editamos con la funcion de put driver 
  const handleSave = async () => {  
      if (!selectedEvent?.cmv?.vin || !selectedEvent?.cmv?.number || !selectedEvent?.cmv?.powerUnitNumber || !selectedEvent?.address?.address || !selectedEvent?.address?.reachOf || !selectedEvent?.commentOrAnnotation) {
        setSecondModalVisible(true);
        return;
      }
      setModalVisible(false);
      setIsLoading(true);     
      return await getCurrentDriver()
      .then(async (currentDriver) => {    
        DriverEvent.put(selectedEvent, currentDriver, false).then((res) => {       
        setIsLoading(true);  
        getData()
        }).catch((err) => {  
          console.log(err)
        })
      })
  };
  
  const handleSaveRestInfo = () => {
    setSecondModalVisible(false);
  };

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); 
  const day = String(today.getDate()).padStart(2, '0');
  
  const formattedDate = `${year}-${month}-${day}`;
  
  const getData = async () => {
    await getDriverEvents('mHlqeeq5rfz3Cizlia23', "undefined", { from: "", to: formattedDate}, true).then(async (events) => {
        setDriverEvents(events);
        setIsLoading(false);
        return;
    });
  };
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
  
  useEffect(() => {
    //vamos a obtener la fecha actual, pero existe un dropdown en el demo referencia, checar con Isaias
    // en otro issue
    getData();
  }, []);

  //funciones de logica de screen
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
              backgroundColor: '#E6F4EA', // Color verde del diseño
              borderRadius: 10,
              marginBottom: 20,
              pointerEvents: event.recordStatus === 2 && event.recordOrigin === 2 ? 'none' : 'auto' //Aqui vamos a deshabilitar mis registros asumidos
            }}
          >
            {/* Detalles del evento */}
            {event.recordStatus === 2 && event.recordOrigin === 2 && (
             <Text style={{
               position: 'absolute', 
               top: 90, 
               left: 0, 
               right: -40, 
               bottom: 0, 
               justifyContent: 'center', 
               alignItems: 'center', 
               color: '#000000', 
               fontSize: 25,
               textAlign: 'center',
               transform: [{ rotate: '-25deg' }]
             }}>
                {languageModule.lang(language, "assumedRecord")}
             </Text>
            )}
            <View style={{ 
              opacity: event.recordStatus === 2 && event.recordOrigin === 2 ? 0.5 : 1 }}>
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
            {/* Opciones de edición/visualización/eliminación */}
            <View style={{ position: 'absolute', top: 10, right: 10 }}>
              <TouchableOpacity
                onPress={() => openModal(event)}
              >
                <MaterialIcons name="supervised-user-circle" size={24} />
              </TouchableOpacity>
              {/* <TouchableOpacity
                style={{ marginTop: 10 }}
                onPress={() => {
                  // Acción para eliminar el evento
                  console.log('Eliminar evento:', event.id);
                }}
              >
                <MaterialIcons name="delete" size={24} />
              </TouchableOpacity> */}
            </View>
            </View>
          </View>
        ))}
    </View>
  </ScrollView>
    );
  }

  //Edicion con datos mas establecidos
  function ConfirmEventModal() {
    return (
      <View>
        <Modal visible={modalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <Text style={{...styles.modalTitle, marginTop: -10}}>{`${languageModule.lang(language, "areYouSureYouWantTo")} ${languageModule.lang(language, "assumeRecord")}?`}</Text>
            
            {/* Aquí agregamos los detalles estables (no editables del evento) */}
            <Text>{languageModule.lang(language, "status")}{": "}{languageModule.lang(language,traducirStatus(selectedEvent?.dutyStatus))}</Text>
            <Text>{languageModule.lang(language, "sequenceIDNumber")}{": "}{`${selectedEvent?.sequenceIDNumber?.decimal} - ${selectedEvent?.sequenceIDNumber?.hexadecimal}`}</Text>
            <Text>{languageModule.lang(language, "recordOrigin")}{": "}{`${selectedEvent?.recordOrigin}`}</Text>
            <Text>{languageModule.lang(language, "recordStatus")}{": "}{selectedEvent?.recordStatus}</Text>
            <Text>{languageModule.lang(language, "startTime")}{": "}
                  {`${selectedEvent?.geoTimeStamp?.date.substring(
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
            </Text>

            {/* Botones */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                <Text style={styles.buttonText}>{languageModule.lang(language, 'cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.buttonText}>{languageModule.lang(language, 'confirm')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  function RestInformation() {
    return (
      <View>
        <Modal visible={secondModalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{languageModule.lang(language, 'addTheRestOfTheInformation')}</Text>
            <ScrollView>
            <Text style={{textAlign: "left"}}>{languageModule.lang(language, "truckVIN")}</Text>
            <TextInput
              style={{
                ...styles.input,
                borderColor: selectedEvent?.cmv?.vin ? 'green' : '#cc0b0a',
              }}
              value={selectedEvent?.cmv?.vin || ''}
              placeholder={selectedEvent?.cmv?.vin || ''}
              onChangeText={(text) => {
                setSelectedEvent((prevEvent) => ({
                  ...prevEvent,
                  cmv: { ...prevEvent.cmv, vin: text },
                }));
              }}
            />
            <Text style={{textAlign: "left"}}>{languageModule.lang(language, "truckNumber")}</Text>
            <TextInput
              style={{
                ...styles.input,
                borderColor: selectedEvent?.cmv?.number ? 'green' : '#cc0b0a',
              }}
              value={selectedEvent?.cmv?.number || ''}
              placeholder={selectedEvent?.cmv?.number || ''}
              onChangeText={(text) => {
                setSelectedEvent((prevEvent) => ({
                  ...prevEvent,
                  cmv: { ...prevEvent.cmv, number: text },
                }));
              }}
            />
            <Text style={{textAlign: "left"}}>{languageModule.lang(language, "powerUnitNumber")}</Text>
            <TextInput
              style={{
                ...styles.input,
                borderColor: selectedEvent?.cmv?.powerUnitNumber ? 'green' : '#cc0b0a',
              }}
              value={selectedEvent?.cmv?.powerUnitNumber || ''}
              placeholder={selectedEvent?.cmv?.powerUnitNumber || ''}
              onChangeText={(text) => {
                setSelectedEvent((prevEvent) => ({
                  ...prevEvent,
                  cmv: { ...prevEvent.cmv, powerUnitNumber: text },
                }));
              }}
            />
            <Text style={{textAlign: "left"}}>{languageModule.lang(language, "location")}</Text>
            <TextInput  
              editable={true}
              style={{
                ...styles.input,
                borderColor: selectedEvent?.address?.address ? 'green' : '#cc0b0a',
              }}
              value={selectedEvent?.address?.address || ''}
              placeholder={selectedEvent?.address?.address || languageModule.lang(language, 'address')}
              onChangeText={(address) => {
                setSelectedEvent((prevEvent) => ({
                  ...prevEvent,
                  address: {
                    ...prevEvent.address,
                    address,
                  },
                }));
              }}
            />
            <Text style={{textAlign: "left"}}>{languageModule.lang(language, 'closestLocation')}</Text>
            <TextInput
             keyboardType="numeric"
             editable={true}
             style={{
               ...styles.input,
               borderColor: selectedEvent?.address?.reachOf?.distance ? 'green' : '#cc0b0a',
             }}
             value={selectedEvent?.address?.reachOf?.distance || ''}
             placeholder={selectedEvent?.address?.reachOf?.distance || languageModule.lang(language, 'distanceOnKM')}
             onChangeText={(distance) => {
               // Filtrar solo caracteres numéricos utilizando expresiones regulares
               const numericDistance = distance.replace(/[^0-9]/g, '');
           
               setSelectedEvent((prevEvent) => ({
                 ...prevEvent,
                 address: {
                   ...prevEvent.address,
                   reachOf: {
                     ...(prevEvent.address?.reachOf || {}),
                     distance: numericDistance,
                   },
                 },
               }));
             }}
            />
            <TextInput
              editable={true}
              style={{
                ...styles.input,
                borderColor: selectedEvent?.address?.reachOf?.city ? 'green' : '#cc0b0a',
              }}
              value={selectedEvent?.address?.reachOf?.city || ''}
              placeholder={selectedEvent?.address?.reachOf?.city || languageModule.lang(language, 'city')}
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
             maxLength={3}
             style={{
               ...styles.input,
               borderColor: selectedEvent?.address?.reachOf?.state ? 'green' : '#cc0b0a',
             }}
             value={selectedEvent?.address?.reachOf?.state || ''}
             placeholder={selectedEvent?.address?.reachOf?.state || languageModule.lang(language, 'state') + ` (${languageModule.lang(language, 'example')} "TX")`}
             onChangeText={(state) => {
               if (state.length <= 3) {
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
               }
             }}
            />
           <Text style={{textAlign: "left"}}>{languageModule.lang(language, "commentOrAnnotation")}</Text>
             <TextInput
               style={{
                ...styles.input,
                borderColor: selectedEvent?.commentOrAnnotation ? 'green' : '#cc0b0a',
              }}
               value={selectedEvent?.commentOrAnnotation || ''}
               placeholder={selectedEvent?.commentOrAnnotation || ''}
               onChangeText={(text) => {
                 setSelectedEvent((prevEvent) => ({
                   ...prevEvent, commentOrAnnotation: text,
                 }));
               }}
             />
            </ScrollView>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setSecondModalVisible(false)}>
                <Text style={styles.buttonText}>{languageModule.lang(language, 'cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveRestInfo}>
                <Text style={styles.buttonText}>{languageModule.lang(language, 'confirm')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <View style={styles.sectionContainer}>
      {isLoading ? (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : driverEvents.length === 0 ? (
        <Text>{languageModule.lang(language, 'thereAreNoRecords')}</Text>
      ) : (
        <Logs />
      )}
      {ConfirmEventModal()}
      {RestInformation()}
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
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
