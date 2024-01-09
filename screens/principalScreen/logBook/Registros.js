import {TextInput,StyleSheet,Modal,Text,View, ActivityIndicator,SafeAreaView,ScrollView,FlatList,Dimensions,StatusBar,Image,TouchableOpacity,} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Fonts, Colors, Sizes } from "../../../constants/styles";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Overlay } from "react-native-elements";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getDriverEvents } from "../../../data/commonQuerys";
import { editDriverLogEvent } from "../../../redux/actions";
import { useDispatch } from "react-redux";


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
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
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
      const getData = async () => {
        await getDriverEvents().then(async (events) => {
          await getDriverEvents(undefined, true).then((undefinedEvents) => {
            setDriverEvents(events);
            setUnidentifiedEvents(undefinedEvents);
            setIsLoading(false);
            return;
          });
        });
      };
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
          return "Movimiento de patio";
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
              }}
            >
              {/* Detalles del evento */}
              <Text>{languageModule.lang(language, "status")}{": "}{languageModule.lang(language,traducirStatus(event.dutyStatus))}</Text>
              <Text>{languageModule.lang(language, "sequenceIDNumber")}{": "}{`${event.sequenceIDNumber.decimal} - ${event.sequenceIDNumber.hexadecimal}`}</Text>
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
              <Text>{languageModule.lang(language, "location")}{": "}{event?.geoTimeStamp?.latitude}{" "}{event?.geoTimeStamp?.longitude}</Text>
              <Text>{languageModule.lang(language, "observations")}{": "}{"Pre - TI"}</Text>
              <Text>{languageModule.lang(language, "carrier")}{": "}{event.carrier.name}</Text>
              <Text>
              {languageModule.lang(language, "certified")}{": "}
              {`${
                          event?.certified?.value
                            ? `${new Date(
                                event.certified.timeStamp
                              ).getDate()} / ${new Date(
                                event.certified.timeStamp
                              ).getMonth()} / ${new Date(
                                event.certified.timeStamp
                              ).getYear()} - ${new Date(
                                event.certified.timeStamp
                              ).getHours()}:${new Date(
                                event.certified.timeStamp
                              ).getMinutes()}`
                            : "No"
                        } `}
              </Text>

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

  function eventDetailsDialogFn() {
      return (
        <Overlay
          isVisible={eventDetailsDialog}
          onBackdropPress={() => setEventDetailsDialog(false)}
          overlayStyle={{
            width: width - 40.0,
            borderRadius: Sizes.fixPadding - 2.0,
            padding: 0.0,
          }}
        >
          <View
            style={{
              marginVertical: Sizes.fixPadding * 2.5,
              marginHorizontal: Sizes.fixPadding * 2.0,
            }}
          >
            <Text style={{ textAlign: "center", ...Fonts.blackColor18Bold }}>
              {"eventDetails"}
            </Text>
  
            <TouchableOpacity
              activeOpacity={0.99}
              // onPress={onPress}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: Sizes.fixPadding,
                    marginRight: Sizes.fixPadding,
                    flex: 1,
                    ...Fonts.blackColor16SemiBold,
                  }}
                >
                  {"eventSequenceIdNumber"}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: Sizes.fixPadding,
                    marginRight: Sizes.fixPadding,
                    flex: 1,
                    ...Fonts.blackColor16SemiBold,
                  }}
                >
                  {`${currentEventDetails?.sequenceIDNumber?.decimal} - ${currentEventDetails?.sequenceIDNumber?.hexadecimal}`}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.99}
              // onPress={onPress}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: Sizes.fixPadding,
                    marginRight: Sizes.fixPadding,
                    flex: 1,
                    ...Fonts.blackColor16SemiBold,
                  }}
                >
                  {"recordStatus"}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: Sizes.fixPadding,
                    marginRight: Sizes.fixPadding,
                    flex: 1,
                    ...Fonts.blackColor16SemiBold,
                  }}
                >
                  {currentEventDetails?.recordStatus}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.99}
              // onPress={onPress}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: Sizes.fixPadding,
                    marginRight: Sizes.fixPadding,
                    flex: 1,
                    ...Fonts.blackColor16SemiBold,
                  }}
                >
                  {"recordOrigin"}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: Sizes.fixPadding,
                    marginRight: Sizes.fixPadding,
                    flex: 1,
                    ...Fonts.blackColor16SemiBold,
                  }}
                >
                  {currentEventDetails?.recordOrigin}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.99}
              // onPress={onPress}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: Sizes.fixPadding,
                    marginRight: Sizes.fixPadding,
                    flex: 1,
                    ...Fonts.blackColor16SemiBold,
                  }}
                >
                  {"type"}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: Sizes.fixPadding,
                    marginRight: Sizes.fixPadding,
                    flex: 1,
                    ...Fonts.blackColor16SemiBold,
                  }}
                >
                  {currentEventDetails?.type}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.99}
              // onPress={onPress}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: Sizes.fixPadding,
                    marginRight: Sizes.fixPadding,
                    flex: 1,
                    ...Fonts.blackColor16SemiBold,
                  }}
                >
                  {"code"}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: Sizes.fixPadding,
                    marginRight: Sizes.fixPadding,
                    flex: 1,
                    ...Fonts.blackColor16SemiBold,
                  }}
                >
                  {currentEventDetails?.code}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.99}
              // onPress={onPress}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: Sizes.fixPadding,
                    marginRight: Sizes.fixPadding,
                    flex: 1,
                    ...Fonts.blackColor16SemiBold,
                  }}
                >
                  {`${"date"} & ${"time"}`}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: Sizes.fixPadding,
                    marginRight: Sizes.fixPadding,
                    flex: 1,
                    ...Fonts.blackColor16SemiBold,
                  }}
                >
                  {currentEventDetails?.geoTimeStamp?.timeStamp}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.99}
              // onPress={onPress}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: Sizes.fixPadding,
                    marginRight: Sizes.fixPadding,
                    flex: 1,
                    ...Fonts.blackColor16SemiBold,
                  }}
                >
                  {"accumulatedVehicleMiles"}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: Sizes.fixPadding,
                    marginRight: Sizes.fixPadding,
                    flex: 1,
                    ...Fonts.blackColor16SemiBold,
                  }}
                >
                  {currentEventDetails?.acumulatedVehicleMiles}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.99}
              // onPress={onPress}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: Sizes.fixPadding,
                    marginRight: Sizes.fixPadding,
                    flex: 1,
                    ...Fonts.blackColor16SemiBold,
                  }}
                >
                  {"elapsedEngineHours"}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: Sizes.fixPadding,
                    marginRight: Sizes.fixPadding,
                    flex: 1,
                    ...Fonts.blackColor16SemiBold,
                  }}
                >
                  {currentEventDetails?.elapsedEngineHours}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.99}
              // onPress={onPress}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: Sizes.fixPadding,
                    marginRight: Sizes.fixPadding,
                    flex: 1,
                    ...Fonts.blackColor16SemiBold,
                  }}
                >
                  {`${"latitude"} & ${"longitude"}`}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: Sizes.fixPadding,
                    marginRight: Sizes.fixPadding,
                    flex: 1,
                    ...Fonts.blackColor16SemiBold,
                  }}
                >
                  {`${currentEventDetails?.geoTimeStamp?.latitude} , ${currentEventDetails?.geoTimeStamp?.longitude}`}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.99}
              // onPress={onPress}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection:  "row",
                  alignItems: "center",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: Sizes.fixPadding,
                    marginRight: Sizes.fixPadding,
                    flex: 1,
                    ...Fonts.blackColor16SemiBold,
                  }}
                >
                  {"distanceSinceLastValidCoordinates"}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: Sizes.fixPadding,
                    marginRight: Sizes.fixPadding,
                    flex: 1,
                    ...Fonts.blackColor16SemiBold,
                  }}
                >
                  {currentEventDetails?.distanceSinceLastValidCoordinates}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.99}
              // onPress={onPress}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: Sizes.fixPadding,
                    marginRight: Sizes.fixPadding,
                    flex: 1,
                    ...Fonts.blackColor16SemiBold,
                  }}
                >
                  {"malfunctionIndicatorStatus"}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: Sizes.fixPadding,
                    marginRight: Sizes.fixPadding,
                    flex: 1,
                    ...Fonts.blackColor16SemiBold,
                  }}
                >
                  {currentEventDetails?.malfunctionIndicatorStatusforELD}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.99}
              // onPress={onPress}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: Sizes.fixPadding,
                    marginRight: Sizes.fixPadding,
                    flex: 1,
                    ...Fonts.blackColor16SemiBold,
                  }}
                >
                  {"dataDiagnosticEventIndicatorStatus"}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: Sizes.fixPadding,
                    marginRight: Sizes.fixPadding,
                    flex: 1,
                    ...Fonts.blackColor16SemiBold,
                  }}
                >
                  {
                    currentEventDetails?.dataDiagnosticEventIndicatorStatusforDriver
                  }
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.99}
              // onPress={onPress}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: Sizes.fixPadding,
                    marginRight: Sizes.fixPadding,
                    flex: 1,
                    ...Fonts.blackColor16SemiBold,
                  }}
                >
                  {"commentOrAnnotation"}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: Sizes.fixPadding,
                    marginRight: Sizes.fixPadding,
                    flex: 1,
                    ...Fonts.blackColor16SemiBold,
                  }}
                >
                  {currentEventDetails?.commentOrAnnotation}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.99}
              // onPress={onPress}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: Sizes.fixPadding,
                    marginRight: Sizes.fixPadding,
                    flex: 1,
                    ...Fonts.blackColor16SemiBold,
                  }}
                >
                  {"driversLocationDescription"}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: Sizes.fixPadding,
                    marginRight: Sizes.fixPadding,
                    flex: 1,
                    ...Fonts.blackColor16SemiBold,
                  }}
                >
                  {currentEventDetails?.locationDescription}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.99}
              // onPress={onPress}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: Sizes.fixPadding,
                    marginRight: Sizes.fixPadding,
                    flex: 1,
                    ...Fonts.blackColor16SemiBold,
                  }}
                >
                  {"dataCheckValue"}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: Sizes.fixPadding,
                    marginRight: Sizes.fixPadding,
                    flex: 1,
                    ...Fonts.blackColor16SemiBold,
                  }}
                >
                  {currentEventDetails?.eventDataCheckValue}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.99}
              // onPress={onPress}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: Sizes.fixPadding,
                    marginRight: Sizes.fixPadding,
                    flex: 1,
                    ...Fonts.blackColor16SemiBold,
                  }}
                >
                  {"cmvNum"}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: Sizes.fixPadding,
                    marginRight: Sizes.fixPadding,
                    flex: 1,
                    ...Fonts.blackColor16SemiBold,
                  }}
                >
                  {currentEventDetails?.cmv?.number}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.99}
              // onPress={onPress}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: Sizes.fixPadding,
                    marginRight: Sizes.fixPadding,
                    flex: 1,
                    ...Fonts.blackColor16SemiBold,
                  }}
                >
                  {"cmvVIN"}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: Sizes.fixPadding,
                    marginRight: Sizes.fixPadding,
                    flex: 1,
                    ...Fonts.blackColor16SemiBold,
                  }}
                >
                  {currentEventDetails?.cmv?.vin}
                </Text>
              </View>
            </TouchableOpacity>
            <Text
              onPress={() => setEventDetailsDialog(false)}
              style={{ textAlign: "center", ...Fonts.grayColor16SemiBold }}
            >
              {"cerrar"}
            </Text>
          </View>
        </Overlay>
      );
  }

  function editEvent() {
      return (
        <View>
          <Modal visible={modalVisible} animationType="slide">
          <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{languageModule.lang(language,traducirStatus(selectedEvent?.dutyStatus))}</Text>
          <Text style={{textAlign: "left"}}>{languageModule.lang(language, "sequenceIDNumber")}</Text>
          <TextInput
            style={styles.input}
            value={`${selectedEvent?.sequenceIDNumber?.decimal} - ${selectedEvent?.sequenceIDNumber?.hexadecimal}`}
            // onChangeText={(text) => {
            //   setSelectedEvent({ ...selectedEvent, id: text });
            // }}
            placeholder={`${selectedEvent?.sequenceIDNumber?.decimal} - ${selectedEvent?.sequenceIDNumber?.hexadecimal}`}
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
          {/*-----------------------*/}
          <Text style={{textAlign: "left"}}>{languageModule.lang(language, 'shippingDocumentNumber')}</Text>
          <TextInput
            style={styles.input}
            value={numeroDeDocumentoDeEnvio}
            onChangeText={(text) => updateState({ numeroDeDocumentoDeEnvio: text })}
          />
          {/*-----------------------*/}
          <Text style={{textAlign: "left"}}>{languageModule.lang(language, "recordStatus")}</Text>
          <TextInput
            style={styles.input}
            value={`${selectedEvent?.recordStatus}`}
            placeholder={`${selectedEvent?.recordStatus}`}
          />
          {/*-----------------------*/}
          <Text style={{textAlign: "left"}}>{languageModule.lang(language, "recordOrigin")}</Text>
          <TextInput
            style={styles.input}
            value={`${selectedEvent?.recordOrigin}`}
            placeholder={`${selectedEvent?.recordOrigin}`}
          />
          {/*-----------------------*/}
          <Text style={{textAlign: "left"}}>{languageModule.lang(language, "type")}</Text>
          <TextInput
            style={styles.input}
            value={`${selectedEvent?.type}`}
            placeholder={`${selectedEvent?.type}`}
          />
          {/*-----------------------*/}
          <Text style={{textAlign: "left"}}>{languageModule.lang(language, "code")}</Text>
          <TextInput
            style={styles.input}
            value={`${selectedEvent?.code}`}
            placeholder={`${selectedEvent?.code}`}
          />
          {/*-----------------------*/}
          <Text style={{textAlign: "left"}}>{languageModule.lang(language, "startTime")}</Text>
          <TextInput
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
          <Text style={{textAlign: "left"}}>{languageModule.lang(language, "accumulatedVehicleMiles")}</Text>
          <TextInput
            style={styles.input}
            value={`${selectedEvent?.acumulatedVehicleMiles}`}
            placeholder={`${selectedEvent?.acumulatedVehicleMiles}`}
          />
          {/*-----------------------*/}
          <Text style={{textAlign: "left"}}>{languageModule.lang(language, "elapsedEngineHours")}</Text>
          <TextInput
            style={styles.input}
            value={`${selectedEvent?.elapsedEngineHours}`}
            placeholder={`${selectedEvent?.elapsedEngineHours}`}
          />
          {/*-----------------------*/}   
          <Text style={{textAlign: "left"}}>{languageModule.lang(language, "latitude")}{" & "}{languageModule.lang(language, "longitude")}</Text>
          <TextInput
            style={styles.input}
            value={`${selectedEvent?.geoTimeStamp?.latitude} , ${selectedEvent?.geoTimeStamp?.longitude}`}
            placeholder={`${selectedEvent?.geoTimeStamp?.latitude} , ${selectedEvent?.geoTimeStamp?.longitude}`}
          />
          {/*-----------------------*/}   
          <Text style={{textAlign: "left"}}>{languageModule.lang(language, "distanceSinceLastValidCoordinates")}</Text>
          <TextInput
            style={styles.input}
            value={`${selectedEvent?.distanceSinceLastValidCoordinates}`}
            placeholder={`${selectedEvent?.distanceSinceLastValidCoordinates}`}
          />
          {/*-----------------------*/}     
          <Text style={{textAlign: "left"}}>{languageModule.lang(language, "malfunctionIndicatorStatus")}</Text>
          <TextInput
            style={styles.input}
            value={`${selectedEvent?.malfunctionIndicatorStatusforELD}`}
            placeholder={`${selectedEvent?.malfunctionIndicatorStatusforELD}`}
          />
          {/*-----------------------*/}
          <Text style={{textAlign: "left"}}>{languageModule.lang(language, "dataDiagnosticEventIndicatorStatus")}</Text>
          <TextInput
            style={styles.input}
            value={`${selectedEvent?.dataDiagnosticEventIndicatorStatusforDriver}`}
            placeholder={`${selectedEvent?.dataDiagnosticEventIndicatorStatusforDriver}`}
          />
          {/*-----------------------*/}
          <Text style={{textAlign: "left"}}>{languageModule.lang(language, "commentOrAnnotation")}</Text>
          <TextInput
            style={styles.input}
            value={`${selectedEvent?.commentOrAnnotation}`}
            placeholder={`${selectedEvent?.commentOrAnnotation}`}
          />
          {/*-----------------------*/}
          <Text style={{textAlign: "left"}}>{languageModule.lang(language, "driversLocationDescription")}</Text>
          <TextInput
            style={styles.input}
            value={`${selectedEvent?.locationDescription}`}
            placeholder={`${selectedEvent?.locationDescription}`}
          />
          {/*-----------------------*/}
          <Text style={{textAlign: "left"}}>{languageModule.lang(language, "dataCheckValue")}</Text>
          <TextInput
            style={styles.input}
            value={`${selectedEvent?.eventDataCheckValue}`}
            placeholder={`${selectedEvent?.eventDataCheckValue}`}
          />
          {/*-----------------------*/}
        </View>    
        </ScrollView>  
          {/* Botones */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
              <Text style={styles.buttonText}>{languageModule.lang(language, 'cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={closeModal}>
              <Text style={styles.buttonText}>{languageModule.lang(language, 'save')}</Text>
            </TouchableOpacity>
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
        <Text>No hay registros disponibles</Text>
      ) : (
        <Logs />
      )}
      {eventDetailsDialogFn()}
      {editEvent()}
    </View>
  );
};

const styles = StyleSheet.create({
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
