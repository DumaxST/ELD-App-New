import {StyleSheet,Text,View,SafeAreaView,ScrollView,FlatList,Dimensions,StatusBar,Image,TouchableOpacity,} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Fonts, Colors, Sizes } from "../../../constants/styles";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Overlay } from "react-native-elements";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';


const { height, width } = Dimensions.get("window");
const languageModule = require('../../../global_functions/variables');

const LogBook = ({ navigation }) => {
  
    const [language, setlanguage] = useState(""); 
    const [isLoading, setIsLoading] = useState(false);
    const [eventDetailsDialog, setEventDetailsDialog] = useState(false);
    const [currentEventDetails, setCurretEventDetails] = useState({});
    const [driverEvents, setDriverEvents] = useState([]);
    const [unidentifiedEvents, setUnidentifiedEvents] = useState([]);

     
    const [state, setState] = useState({
      selectedTabIndex: 0,
      selectedCaloriesChartIndex: 1,
      selectedSleepChartIndex: 2,
      selecteddietChartIndex: 1,
      selectedWaterChartIndex: 2,
      userDrunk: 2000,
    });
  
    const {
      selectedTabIndex,
      selectedCaloriesChartIndex,
      selectedSleepChartIndex,
      selecteddietChartIndex,
      selectedWaterChartIndex,
      userDrunk,
    } = state;
  
    const updateState = (data) => setState((state) => ({ ...state, ...data }));
  
    const listRef = useRef();
  
    const scrollToIndex = ({ index }) => {
      listRef.current.scrollToIndex({ index: index });
      updateState({ selectedTabIndex: index });
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
  
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primaryColor }}>
        <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
        <View style={{ flex: 1 }}>
          {header()}
          <View style={styles.sheetStyle}>
            {isLoading ? null : tabs()}
            {isLoading ? loader() : tabDetail()}
          </View>
        </View>
        {eventDetailsDialogFn()}
      </SafeAreaView>
    );
  
    function header() {
      return (
        <View
        style={{
          flexDirection: "row",
          margin: Sizes.fixPadding * 2.0,
          flex: 0.05,
          // justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: Sizes.fixPadding * 2.0,
        }}
        >
        <Ionicons name={"arrow-back-circle-outline"} onPress={() => navigation.pop()} size={27} color="white" />
          <Text style={{ ...Fonts.whiteColor22SemiBold }}>
            {"      " + languageModule.lang(language,"logBook")}
          </Text>
        </View>
      );
    }
  
    function tabDetail() {
      function onScrollEnd(e) {
        let contentOffset = e.nativeEvent.contentOffset;
        let viewSize = e.nativeEvent.layoutMeasurement;
        let pageNum = Math.floor(contentOffset.x / viewSize.width);
        updateState({ selectedTabIndex: pageNum });
      }
  
      const renderItem = ({ item }) => {
        return (
          <View style={{ width: width, flex: 1 }}>
            {item == 0
              ? LogBookGraph()
              : item == 1
              ? Logs()
              : item == 2
              ? UnidentifiedLogs()
              : LogBookGraph()}
          </View>
        );
      };
      return (
        <FlatList
          data={[0, 1, 2, 3]}
          ref={listRef}
          initialScrollIndex={selectedTabIndex}
          keyExtractor={(item) => `${item}`}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={32}
          pagingEnabled
          onMomentumScrollEnd={onScrollEnd}
          scrollEnabled={false}
        />
      );
    }
  
    function LogBookGraph() {
      return (
        <View style={styles.mainLogo.container}>
          <Image
            source={require("../../../assets/images/logBookChart.jpg")}
            style={{
              ...styles.mainLogo.logo,
            }}
          />
        </View>
      );
    }
  
    function Logs() {
      const convertTiempoTranscurrido = (seconds) => {
        const horas = seconds / 3600;
        const minutes = (horas - Math.floor(horas)) * 60;
        return `${Math.trunc(horas)} hrs ${Math.trunc(minutes)} min`;
      };
  
      return (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ marginTop: Sizes.fixPadding * 2.0 }}>
            {driverEvents.map((event, i) => {
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
                        {"${estatus} - ${event.dutyStatus}"}
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
                        {"idDeSecuencia"}
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
                        {"tiempoDeInicio"}
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
                        {"tiempoDeTerminacion"}
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
                        {"tiempoTranscurrido"}
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
                        {"localizacion"}
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
                        {"observaciones"}
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
                        {"carrier"}
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
                        {"certificado"}
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
  
    function UnidentifiedLogs() {
      const convertTiempoTranscurrido = (seconds) => {
        const horas = seconds / 3600;
        const minutes = (horas - Math.floor(horas)) * 60;
        return `${Math.trunc(horas)} hrs ${Math.trunc(minutes)} min`;
      };
  
      return (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ marginTop: Sizes.fixPadding * 2.0 }}>
            {unidentifiedEvents.map((event, i) => {
              return (
                <View
                  key={`unidentifiedEvents_${i}_${event.id}`}
                  style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}
                >
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
                        {`${"estatus"} - ${event.dutyStatus}`}
                      </Text>
                    </View>
                    <View>
                      <TouchableOpacity
                        activeOpacity={0.99}
                        onPress={() => {
                          dispatch(editDriverLogEvent(event));
                          navigation.push("EditLogEvent");
                        }}
                        style={styles.buttonStyle}
                      >
                        <Text
                          style={{
                            ...Fonts.whiteColor16Bold,
                            marginHorizontal: Sizes.fixPadding + 5.0,
                          }}
                        >
                          {"reclamar"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {/* <View
                      style={{
                        flex: 1,
                        flexDirection: isRtl ? "row-reverse" : "row",
                        alignItems: "center",
                      }}
                    >
                      <TouchableOpacity
                        activeOpacity={0.99}
                        style={{
                          flexDirection: isRtl ? "row-reverse" : "row",
                          alignItems: "center",
                        }}
                        onPress={() => {
                          setCurretEventDetails(event);
                          setEventDetailsDialog(true);
                        }}
                      >
                        <View
                          style={{
                            marginLeft: isRtl ? 0.0 : Sizes.fixPadding,
                            marginRight: isRtl ? Sizes.fixPadding : 0.0,
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
                          flexDirection: isRtl ? "row-reverse" : "row",
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={{
                            marginLeft: isRtl ? 0.0 : Sizes.fixPadding,
                            marginRight: isRtl ? Sizes.fixPadding : 0.0,
                          }}
                        >
                          <MaterialCommunityIcons
                            name="trash-can"
                            size={24}
                            color={Colors.grayColor}
                          />
                        </View>
                      </TouchableOpacity>
                    </View> */}
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
                        {"idDeSecuencia"}
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
                        {`${event.sequenceIDNumber.decimal} - ${event.sequenceIDNumber.hexadecimal}`}
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
                          marginRight: Sizes.fixPadding,
                          flex: 1,
                          ...Fonts.blackColor16SemiBold,
                        }}
                      >
                        {"tiempoDeInicio"}
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
                        {"tiempoDeTerminacion"}
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
                        {"tiempoTranscurrido"}
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
                        {"localizacion"}
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
                          marginLeft:  Sizes.fixPadding,
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
                          marginLeft: Sizes.fixPadding,
                          marginRight: Sizes.fixPadding,
                          flex: 1,
                          ...Fonts.blackColor16SemiBold,
                        }}
                      >
                        {"observaciones"}
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
                        {"carrier"}
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
                          marginLeft:  Sizes.fixPadding,
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
                        {"certificado"}
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
  
    function tabs() {
      return (
        <View
          style={{
            marginBottom: Sizes.fixPadding,
            marginTop: Sizes.fixPadding * 2.0,
            flexDirection: "row",
          }}
        >
          {tabShort({ tabTitle: languageModule.lang(language, 'logBook'), index: 0 })}
          {tabShort({ tabTitle: languageModule.lang(language, 'logs') , index: 1 })}
          {tabShort({ tabTitle: languageModule.lang(language, 'undefinedLogs'), index: 2 })}
        </View>
      );
    }
  
    function tabShort({ tabTitle, index }) {
      return (
        <TouchableOpacity
          activeOpacity={0.99}
          onPress={() => {
            scrollToIndex({ index: index });
          }}
          style={{ flex: 1, alignItems: "center" }}
        >
          <Text
            numberOfLines={1}
            style={{
              marginBottom: Sizes.fixPadding,
              ...(selectedTabIndex == index
                ? { ...Fonts.primaryColor16SemiBold }
                : { ...Fonts.grayColor16SemiBold }),
            }}
          >
            {tabTitle}
          </Text>
          <View
            style={{
              width: "100%",
              backgroundColor:
                selectedTabIndex == index
                  ? Colors.primaryColor
                  : Colors.lightGrayColor,
              height: 2.0,
            }}
          />
        </TouchableOpacity>
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
                    marginRight:Sizes.fixPadding,
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
                    marginRight:Sizes.fixPadding,
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
                    marginRight:Sizes.fixPadding,
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
                    marginRight:Sizes.fixPadding,
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
                  {"distanceSinceLastValidCoordinates"}
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
  
    function loader() {
      return (
        <View style={{ margin: Sizes.fixPadding * 2.0 }}>
          <View style={styles.loaderGif.container}>
            <Image
              source={require("../../../assets/gifs/newloading.gif")}
              style={{
                ...styles.loaderGif,
              }}
            />
            <View>
              <Text
                style={{
                  ...Fonts.blackColor18Medium,
                  marginLeft: Sizes.fixPadding * 4,
                }}
              >
                {languageModule.lang(language, "searchingLogs")}
              </Text>
            </View>
          </View>
        </View>
      );
    }
};

export default LogBook;

const styles = StyleSheet.create({
    loaderGif: {
      container: {
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginTop: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding * 3.0,
        flexDirection: "row",
        alignItems: "center",
      },
      width: width / 10,
      height: width / 10,
      resizeMode: "contain",
    },
    mainLogo: {
      container: {
        justifyContent: "center",
        alignItems: "center",
      },
      logo: {
        width: width,
        height: height,
        resizeMode: "contain",
      },
    },
    logoutIconWrapStyle: {
      width: 28.0,
      height: 28.0,
      borderRadius: 14.0,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Colors.whiteColor,
      position: "absolute",
      right: 20.0,
      top: 20.0,
    },
    sheetStyle: {
      flex: 1,
      backgroundColor: Colors.whiteColor,
      borderTopLeftRadius: Sizes.fixPadding * 3.0,
      borderTopRightRadius: Sizes.fixPadding * 3.0,
      marginTop: Sizes.fixPadding * 2.0,
    },
    buttonStyle: {
      backgroundColor: Colors.redColor,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: Sizes.fixPadding,
      // paddingVertical: Sizes.fixPadding + 5.0,
      marginHorizontal: Sizes.fixPadding * 1.0,
    },
    cancelAndLogoutButtonStyle: {
      elevation: 2.0,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: Sizes.fixPadding - 2.0,
      paddingVertical: Sizes.fixPadding + 2.0,
      flex: 1,
      borderWidth: 1.0,
      borderBottomWidth: 0.0,
    },
    cancelButtonStyle: {
      backgroundColor: Colors.whiteColor,
      marginRight: Sizes.fixPadding,
      borderColor: Colors.lightGrayColor,
    },
    logoutButtonStyle: {
      backgroundColor: Colors.primaryColor,
      marginLeft: Sizes.fixPadding,
      borderColor: Colors.primaryColor,
    },
    cancelAndLogoutButtonWrapStyle: {
      marginHorizontal: Sizes.fixPadding * 2.0,
      marginTop: Sizes.fixPadding * 2.0,
      flexDirection: "row",
      alignItems: "center",
    },
    caloriesInfoWrapStyle: {
      borderRadius: Sizes.fixPadding - 2.0,
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: Sizes.fixPadding + 5.0,
      marginHorizontal: Sizes.fixPadding,
      elevation: 1.5,
    },
    workoutAndDurationInfoWrapStyle: {
      paddingVertical: Sizes.fixPadding * 2.0,
      flex: 1,
      backgroundColor: Colors.whiteColor,
      elevation: 1.5,
      borderRadius: Sizes.fixPadding - 5.0,
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: Sizes.fixPadding,
      borderColor: Colors.lightGrayColor,
      borderWidth: 1.0,
      borderBottomWidth: 0.0,
    },
    chartYAxisLabelStyle: {
      position: "absolute",
      alignSelf: "flex-start",
      width: "30%",
      left: -30.0,
      transform: [{ rotate: "-90deg" }],
      marginBottom: Sizes.fixPadding * 2.0,
      textAlign: "center",
      ...Fonts.grayColor14Medium,
    },
    chartInfoWrapStyle: {
      elevation: 1.0,
      backgroundColor: Colors.whiteColor,
      borderColor: Colors.lightGrayColor,
      borderWidth: 1.0,
      borderBottomWidth: 0.0,
      alignItems: "center",
      justifyContent: "center",
      marginTop: Sizes.fixPadding,
      borderRadius: Sizes.fixPadding - 5.0,
    },
    chartDataCategoryWrapStyle: {
      flex: 1,
      borderRadius: Sizes.fixPadding - 2.0,
      paddingVertical: Sizes.fixPadding - 3.0,
      alignItems: "center",
      justifyContent: "center",
    },
    woakupAndSleepDrunkAndTargetInfoWrapStyle: {
      justifyContent: "space-between",
      borderRadius: Sizes.fixPadding - 2.0,
      backgroundColor: Colors.whiteColor,
      elevation: 2.0,
      marginHorizontal: Sizes.fixPadding * 2.0,
      marginTop: Sizes.fixPadding,
      marginBottom: Sizes.fixPadding * 2.0,
      borderColor: Colors.lightGrayColor,
      borderWidth: 1.0,
      borderBottomWidth: 0.0,
      borderLeftWidth: 0.0,
    },
    infoHookStyle: {
      borderBottomLeftRadius: Sizes.fixPadding - 2.0,
      borderTopLeftRadius: Sizes.fixPadding - 2.0,
      width: 8.0,
      backgroundColor: Colors.primaryColor,
    },
    woakupAndSleepDrunkAndTargetDetailWrapStyle: {
      marginVertical: Sizes.fixPadding * 2.0,
      justifyContent: "space-between",
      flex: 1,
    },
    nutritionAndSleepingInfoBoxStyle: {
      flex: 1,
      marginHorizontal: Sizes.fixPadding,
      backgroundColor: Colors.whiteColor,
      elevation: 2.0,
      borderRadius: Sizes.fixPadding - 2.0,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: Sizes.fixPadding * 2.0,
      borderColor: Colors.lightGrayColor,
      borderWidth: 1.0,
      borderBottomWidth: 0.0,
      paddingVertical: Sizes.fixPadding * 2.0,
    },
    addAndRemoveButtonWrapStyle: {
      width: 21.0,
      height: 21.0,
      borderRadius: Sizes.fixPadding - 5.0,
      alignItems: "center",
      justifyContent: "center",
    },
    addDrinkButtonStyle: {
      backgroundColor: Colors.primaryColor,
      borderRadius: Sizes.fixPadding - 2.0,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: Sizes.fixPadding - 3.0,
      width: "70%",
    },
    glassImageStyle: {
      marginHorizontal: Sizes.fixPadding + 5.0,
      width: 45.0,
      height: 45.0,
      resizeMode: "contain",
    },
    waterChartYLabelStyle: {
      position: "absolute",
      alignSelf: "flex-start",
      left: -80.0,
      width: "60%",
      transform: [{ rotate: "-90deg" }],
    },
});
  