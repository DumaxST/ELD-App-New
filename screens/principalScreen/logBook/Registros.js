import {StyleSheet,Text,View, ActivityIndicator,SafeAreaView,ScrollView,FlatList,Dimensions,StatusBar,Image,TouchableOpacity,} from "react-native";
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
        case "PC":
          return "PERSONAL";
        case "YM":
          return "Movimiento de patio";
        default:
          return "No identificado";
      }
    }

    //funciones de renderizado
    function Logs() {
      const convertTiempoTranscurrido = (seconds) => {
        const horas = seconds / 3600;
        const minutes = (horas - Math.floor(horas)) * 60;
        return `${Math.trunc(horas)} hrs ${Math.trunc(minutes)} min`;
      };
  
      return (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ marginTop: Sizes.fixPadding * 2.0 }}>
            {Array.isArray(driverEvents) &&
            driverEvents.map((event, i) => {
              return (
                <View
                  key={`driverEvents_${i}_${event.id}`}
                  style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}
                >
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
                          marginRight:Sizes.fixPadding ,
                          flex: 1,
                          ...Fonts.blackColor16SemiBold,
                        }}
                      >
                        {`${languageModule.lang(language, "status")} - ${languageModule.lang(language,traducirStatus(event.dutyStatus))}` }
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        flexDirection:"row",
                        alignItems: "center",
                      }}
                    >
                      <TouchableOpacity
                        activeOpacity={0.99}
                        style={{
                          flexDirection:"row",
                          alignItems: "center",
                        }}
                        onPress={() => {
                          setCurretEventDetails(event);
                          setEventDetailsDialog(true);
                        }}
                      >
                        <View
                          style={{
                            marginLeft: Sizes.fixPadding,
                            marginRight: Sizes.fixPadding,
                          }}
                        >
                          <MaterialCommunityIcons
                            name="clipboard-edit-outline"
                            size={24}
                            color={Colors.grayColor}
                          />
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        activeOpacity={0.99}
                        style={{
                          flexDirection:"row",
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={{
                            marginLeft:Sizes.fixPadding,
                            marginRight: Sizes.fixPadding,
                          }}
                        >
                          <MaterialCommunityIcons
                            name="trash-can"
                            size={24}
                            color={Colors.grayColor}
                          />
                        </View>
                      </TouchableOpacity>
                      {event.history ? (
                        event.history.filter((evnt) => {
                          return (
                            evnt.original == undefined &&
                            evnt.rejected == undefined
                          );
                        }).length > 0 ? (
                          <TouchableOpacity
                            activeOpacity={0.99}
                            onPress={() => {
                              dispatch(editDriverLogEvent(event));
                              navigation.push("HistoryLogEvent");
                            }}
                            style={styles.buttonStyle}
                          >
                            <Text
                              style={{
                                ...Fonts.whiteColor14SemiBold,
                                marginHorizontal: Sizes.fixPadding + 5.0,
                              }}
                            >
                              {`${
                                event.history.filter((evnt) => {
                                  return (
                                    evnt.original == undefined &&
                                    evnt.rejected == undefined
                                  );
                                }).length
                              } ${"porEditar"}`}
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            activeOpacity={0.99}
                            style={{
                              flexDirection:  "row",
                              alignItems: "center",
                            }}
                            onPress={() => {
                              dispatch(editDriverLogEvent(event));
                              navigation.push("HistoryLogEvent");
                            }}
                          >
                            <View
                              style={{
                                marginLeft:  Sizes.fixPadding,
                                marginRight: Sizes.fixPadding,
                              }}
                            >
                              <MaterialCommunityIcons
                                name="format-list-group"
                                size={24}
                                color={Colors.grayColor}
                              />
                            </View>
                          </TouchableOpacity>
                        )
                      ) : null}
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.99}
                    // onPress={onPress}
                    style={{
                      flexDirection:"row",
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
                        {languageModule.lang(language, "sequenceIDNumber")}
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        flexDirection:"row",
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
                        {`${event.sequenceIDNumber.decimal} - ${event.sequenceIDNumber.hexadecimal}`}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.99}
                    // onPress={onPress}
                    style={{
                      flexDirection:  "row",
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
                        {languageModule.lang(language, "startTime")}
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
                          marginRight: Sizes.fixPadding ,
                          flex: 1,
                          ...Fonts.blackColor16SemiBold,
                        }}
                      >
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
                        {languageModule.lang(language, "finishTime")}
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
                          marginRight: Sizes.fixPadding ,
                          flex: 1,
                          ...Fonts.blackColor16SemiBold,
                        }}
                      >
                        {i == 0
                          ? "Currentnt"
                          : `${driverEvents[i - 1]?.geoTimeStamp?.date.substring(
                              0,
                              2
                            )}/${driverEvents[
                              i - 1
                            ]?.geoTimeStamp?.date.substring(2, 4)}/${driverEvents[
                              i - 1
                            ]?.geoTimeStamp?.date.substring(
                              4,
                              6
                            )} - ${driverEvents[
                              i - 1
                            ]?.geoTimeStamp?.time.substring(0, 2)}:${driverEvents[
                              i - 1
                            ]?.geoTimeStamp?.time.substring(2, 4)}:${driverEvents[
                              i - 1
                            ]?.geoTimeStamp?.time.substring(4, 6)} `}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.99}
                    // onPress={onPress}
                    style={{
                      flexDirection:  "row",
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
                        {languageModule.lang(language, "elapsedTime")}
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
                          marginLeft:Sizes.fixPadding,
                          marginRight: Sizes.fixPadding ,
                          flex: 1,
                          ...Fonts.blackColor16SemiBold,
                        }}
                      >
                        {i == 0
                          ? "Currentnt"
                          : convertTiempoTranscurrido(
                              (new Date(
                                driverEvents[i - 1].geoTimeStamp.timeStamp
                              ) -
                                new Date(event.geoTimeStamp.timeStamp)) /
                                1000
                            )}
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
                        {languageModule.lang(language, "location")}
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
                        {/* IDEALMENTE DEBERÍA DE MOSTRAR LA UBICACION EN TEXTO, NO EN COORDENADAS */}
                        {`${event?.geoTimeStamp?.latitude} , ${event?.geoTimeStamp?.longitude}`}
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
                          marginLeft:  Sizes.fixPadding,
                          marginRight: Sizes.fixPadding ,
                          flex: 1,
                          ...Fonts.blackColor16SemiBold,
                        }}
                      >
                        {languageModule.lang(language, "observations")}
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
                        {"Pre - TI"}
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
                        {languageModule.lang(language, "carrier")}
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
                        {event.carrier.name}
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
                        {languageModule.lang(language, "certified")}
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
                    </View>
                  </TouchableOpacity>
  
                  {false ? (
                    <View style={{ marginVertical: Sizes.fixPadding * 2.0 }} />
                  ) : (
                    <View
                      style={{
                        marginVertical: Sizes.fixPadding * 2.0,
                        backgroundColor: Colors.lightGrayColor,
                        height: 1.0,
                      }}
                    />
                  )}
                </View>
              );
            })}
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
    </View>
  );
};

const styles = StyleSheet.create({
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
