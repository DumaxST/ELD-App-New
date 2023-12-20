  import {  StyleSheet,  Text,  View,  SafeAreaView,  ScrollView,  FlatList,  Dimensions,  StatusBar,  Image,  TouchableOpacity,} from "react-native";
  import React, { useEffect, useRef, useState } from "react";
  import { Fonts, Colors, Sizes } from "../../../constants/styles";
  import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
  import { Overlay } from "react-native-elements";
  import {
    certifyDriverEvents,
    getDriverEvents,
    postDriverEvent,
  } from "../../../data/commonQuerys";
  import { getCurrentDriver } from "../../../config/localStorage";
  import { setDriverStatus } from "../../../redux/actions";
  import { useDispatch, useSelector } from "react-redux";
  import Ionicons from 'react-native-vector-icons/Ionicons';
  import AsyncStorage from "@react-native-async-storage/async-storage";

  const { width, height } = Dimensions.get("window");
  const languageModule = require('../../../global_functions/variables');
  
  const CertificarLogs = ({ navigation }) => {

    const [language, setlanguage] = useState("");  

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
  
    const [isLoading, setIsLoading] = useState(true);
    const [showAdvertenciaDialog, setShowAdvertenciaDialog] = useState(false);
    const [driverEvents, setDriverEvents] = useState([]);
    useEffect(() => {
      getData();
    }, []);
  
    const getData = async () => {
      setIsLoading(true);
      await getDriverEvents(false).then(async (events) => {
        setDriverEvents(events);
        setIsLoading(false);
        return;
      });
    };
  
    const [logsParaCertificar, setLogsParaCertificar] = useState([]);
    const selectLogParaCertificar = (logID) => {
      if (logsParaCertificar.indexOf(logID) > -1) {
        setLogsParaCertificar(logsParaCertificar.filter((item) => item != logID));
      } else {
        setLogsParaCertificar((logsIDs) => [...logsIDs, logID]);
      }
    };
    const { driverStatus, eldData, acumulatedVehicleKilometers } = useSelector(
      (state) => state.eldReducer
    );
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
  
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primaryColor }}>
        <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
        <View style={{ flex: 1 }}>
          {header()}
          <View style={styles.sheetStyle}>
            {isLoading ? loader() : tabDetail()}
            {isLoading ? null : btnsOptions()}
          </View>
        </View>
        {advertenciaDialog()}
      </SafeAreaView>
    );
  
    function header() {
      return (
        <View
        style={{
          flexDirection: "row",
          margin: Sizes.fixPadding * 2.0,
          flex: 0.05,
        //   justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: Sizes.fixPadding * 2.0,
        }}
      >
      <Ionicons name={"arrow-back-circle-outline"} onPress={() => navigation.pop()} size={27} color="white" />
        <Text style={{ ...Fonts.whiteColor22SemiBold }}>
          {"    " + languageModule.lang(language,'certifyLogs')}
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
        return <View style={{ width: width, flex: 1 }}>{Logs()}</View>;
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
  
    function Logs() {
      const convertTiempoTranscurrido = (seconds) => {
        const horas = seconds / 3600;
        const minutes = (horas - Math.floor(horas)) * 60;
        return `${Math.trunc(horas)} hrs ${Math.trunc(minutes)} min`;
      };
  
      const Checkbox = ({ logID }) => {
        return (
          <TouchableOpacity
            activeOpacity={0.99}
            style={{
              flexDirection: "row",
            }}
            onPress={() => {
              selectLogParaCertificar(logID);
            }}
          >
            <View
              style={{
                ...styles.radioButtonStyle,
                borderColor: Colors.blackColor,
                borderWidth: 1,
              }}
            >
              <MaterialCommunityIcons
                name="check"
                size={24}
                color={
                  logsParaCertificar.indexOf(logID) > -1
                    ? Colors.blackColor
                    : Colors.whiteColor
                }
              />
            </View>
            <Text
              style={{
                marginLeft: Sizes.fixPadding,
                marginRight:Sizes.fixPadding,
                ...Fonts.blackColor16Medium,
              }}
            >
              {"certificar"}
            </Text>
          </TouchableOpacity>
        );
      };
  
        return (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ marginTop: Sizes.fixPadding * 2.0 }}>
            
          </View>
        </ScrollView>
      );


      //real implementation
    //   return (
    //     <ScrollView showsVerticalScrollIndicator={false}>
    //       <View style={{ marginTop: Sizes.fixPadding * 2.0 }}>
    //         {driverEvents.map((event, i) => {
    //           return (
    //             <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
    //               <TouchableOpacity
    //                 activeOpacity={0.99}
    //                 // onPress={onPress}
    //                 style={{
    //                   flexDirection: isRtl ? "row-reverse" : "row",
    //                   alignItems: "center",
    //                   justifyContent: "space-between",
    //                 }}
    //               >
    //                 <View
    //                   style={{
    //                     flex: 1,
    //                     flexDirection: isRtl ? "row-reverse" : "row",
    //                     alignItems: "center",
    //                   }}
    //                 >
    //                   <Text
    //                     numberOfLines={1}
    //                     style={{
    //                       marginLeft: isRtl ? 0.0 : Sizes.fixPadding,
    //                       marginRight: isRtl ? Sizes.fixPadding : 0.0,
    //                       flex: 1,
    //                       ...Fonts.blackColor16SemiBold,
    //                     }}
    //                   >
    //                     {`${tr("estatus")} ${event.dutyStatus}`}
    //                   </Text>
    //                 </View>
    //                 <View
    //                   style={{
    //                     flex: 1,
    //                     flexDirection: isRtl ? "row-reverse" : "row",
    //                     alignItems: "center",
    //                   }}
    //                 >
    //                   <TouchableOpacity
    //                     activeOpacity={0.99}
    //                     style={{
    //                       flexDirection: isRtl ? "row-reverse" : "row",
    //                       alignItems: "center",
    //                       justifyContent: "space-between",
    //                     }}
    //                   >
    //                     <View
    //                       style={{
    //                         flex: 1,
    //                         flexDirection: isRtl ? "row-reverse" : "row",
    //                         alignItems: "center",
    //                       }}
    //                     >
    //                       <Checkbox logID={event.id} />
    //                     </View>
    //                   </TouchableOpacity>
    //                 </View>
    //               </TouchableOpacity>
    //               <TouchableOpacity
    //                 activeOpacity={0.99}
    //                 // onPress={onPress}
    //                 style={{
    //                   flexDirection: isRtl ? "row-reverse" : "row",
    //                   alignItems: "center",
    //                   justifyContent: "space-between",
    //                 }}
    //               >
    //                 <View
    //                   style={{
    //                     flex: 1,
    //                     flexDirection: isRtl ? "row-reverse" : "row",
    //                     alignItems: "center",
    //                   }}
    //                 >
    //                   <Text
    //                     numberOfLines={1}
    //                     style={{
    //                       marginLeft: isRtl ? 0.0 : Sizes.fixPadding,
    //                       marginRight: isRtl ? Sizes.fixPadding : 0.0,
    //                       flex: 1,
    //                       ...Fonts.blackColor16SemiBold,
    //                     }}
    //                   >
    //                     {tr("idDeSecuencia")}
    //                   </Text>
    //                 </View>
    //                 <View
    //                   style={{
    //                     flex: 1,
    //                     flexDirection: isRtl ? "row-reverse" : "row",
    //                     alignItems: "center",
    //                   }}
    //                 >
    //                   <Text
    //                     numberOfLines={1}
    //                     style={{
    //                       marginLeft: isRtl ? 0.0 : Sizes.fixPadding,
    //                       marginRight: isRtl ? Sizes.fixPadding : 0.0,
    //                       flex: 1,
    //                       ...Fonts.blackColor16SemiBold,
    //                     }}
    //                   >
    //                     {`${event.sequenceIDNumber.decimal} - ${event.sequenceIDNumber.hexadecimal}`}
    //                   </Text>
    //                 </View>
    //               </TouchableOpacity>
    //               <TouchableOpacity
    //                 activeOpacity={0.99}
    //                 // onPress={onPress}
    //                 style={{
    //                   flexDirection: isRtl ? "row-reverse" : "row",
    //                   alignItems: "center",
    //                   justifyContent: "space-between",
    //                 }}
    //               >
    //                 <View
    //                   style={{
    //                     flex: 1,
    //                     flexDirection: isRtl ? "row-reverse" : "row",
    //                     alignItems: "center",
    //                   }}
    //                 >
    //                   <Text
    //                     numberOfLines={1}
    //                     style={{
    //                       marginLeft: isRtl ? 0.0 : Sizes.fixPadding,
    //                       marginRight: isRtl ? Sizes.fixPadding : 0.0,
    //                       flex: 1,
    //                       ...Fonts.blackColor16SemiBold,
    //                     }}
    //                   >
    //                     {tr("tiempoDeInicio")}
    //                   </Text>
    //                 </View>
    //                 <View
    //                   style={{
    //                     flex: 1,
    //                     flexDirection: isRtl ? "row-reverse" : "row",
    //                     alignItems: "center",
    //                   }}
    //                 >
    //                   <Text
    //                     numberOfLines={1}
    //                     style={{
    //                       marginLeft: isRtl ? 0.0 : Sizes.fixPadding,
    //                       marginRight: isRtl ? Sizes.fixPadding : 0.0,
    //                       flex: 1,
    //                       ...Fonts.blackColor16SemiBold,
    //                     }}
    //                   >
    //                     {`${event?.geoTimeStamp?.date.substring(
    //                       0,
    //                       2
    //                     )}/${event?.geoTimeStamp?.date.substring(
    //                       2,
    //                       4
    //                     )}/${event?.geoTimeStamp?.date.substring(
    //                       4,
    //                       6
    //                     )} - ${event?.geoTimeStamp?.time.substring(
    //                       0,
    //                       2
    //                     )}:${event?.geoTimeStamp?.time.substring(
    //                       2,
    //                       4
    //                     )}:${event?.geoTimeStamp?.time.substring(4, 6)} `}
    //                   </Text>
    //                 </View>
    //               </TouchableOpacity>
    //               <TouchableOpacity
    //                 activeOpacity={0.99}
    //                 // onPress={onPress}
    //                 style={{
    //                   flexDirection: isRtl ? "row-reverse" : "row",
    //                   alignItems: "center",
    //                   justifyContent: "space-between",
    //                 }}
    //               >
    //                 <View
    //                   style={{
    //                     flex: 1,
    //                     flexDirection: isRtl ? "row-reverse" : "row",
    //                     alignItems: "center",
    //                   }}
    //                 >
    //                   <Text
    //                     numberOfLines={1}
    //                     style={{
    //                       marginLeft: isRtl ? 0.0 : Sizes.fixPadding,
    //                       marginRight: isRtl ? Sizes.fixPadding : 0.0,
    //                       flex: 1,
    //                       ...Fonts.blackColor16SemiBold,
    //                     }}
    //                   >
    //                     {tr("tiempoDeTerminacion")}
    //                   </Text>
    //                 </View>
    //                 <View
    //                   style={{
    //                     flex: 1,
    //                     flexDirection: isRtl ? "row-reverse" : "row",
    //                     alignItems: "center",
    //                   }}
    //                 >
    //                   <Text
    //                     numberOfLines={1}
    //                     style={{
    //                       marginLeft: isRtl ? 0.0 : Sizes.fixPadding,
    //                       marginRight: isRtl ? Sizes.fixPadding : 0.0,
    //                       flex: 1,
    //                       ...Fonts.blackColor16SemiBold,
    //                     }}
    //                   >
    //                     {i == 0
    //                       ? "Currentnt"
    //                       : `${driverEvents[i - 1]?.geoTimeStamp?.date.substring(
    //                           0,
    //                           2
    //                         )}/${driverEvents[
    //                           i - 1
    //                         ]?.geoTimeStamp?.date.substring(2, 4)}/${driverEvents[
    //                           i - 1
    //                         ]?.geoTimeStamp?.date.substring(
    //                           4,
    //                           6
    //                         )} - ${driverEvents[
    //                           i - 1
    //                         ]?.geoTimeStamp?.time.substring(0, 2)}:${driverEvents[
    //                           i - 1
    //                         ]?.geoTimeStamp?.time.substring(2, 4)}:${driverEvents[
    //                           i - 1
    //                         ]?.geoTimeStamp?.time.substring(4, 6)} `}
    //                   </Text>
    //                 </View>
    //               </TouchableOpacity>
    //               <TouchableOpacity
    //                 activeOpacity={0.99}
    //                 // onPress={onPress}
    //                 style={{
    //                   flexDirection: isRtl ? "row-reverse" : "row",
    //                   alignItems: "center",
    //                   justifyContent: "space-between",
    //                 }}
    //               >
    //                 <View
    //                   style={{
    //                     flex: 1,
    //                     flexDirection: isRtl ? "row-reverse" : "row",
    //                     alignItems: "center",
    //                   }}
    //                 >
    //                   <Text
    //                     numberOfLines={1}
    //                     style={{
    //                       marginLeft: isRtl ? 0.0 : Sizes.fixPadding,
    //                       marginRight: isRtl ? Sizes.fixPadding : 0.0,
    //                       flex: 1,
    //                       ...Fonts.blackColor16SemiBold,
    //                     }}
    //                   >
    //                     {tr("tiempoTranscurrido")}
    //                   </Text>
    //                 </View>
    //                 <View
    //                   style={{
    //                     flex: 1,
    //                     flexDirection: isRtl ? "row-reverse" : "row",
    //                     alignItems: "center",
    //                   }}
    //                 >
    //                   <Text
    //                     numberOfLines={1}
    //                     style={{
    //                       marginLeft: isRtl ? 0.0 : Sizes.fixPadding,
    //                       marginRight: isRtl ? Sizes.fixPadding : 0.0,
    //                       flex: 1,
    //                       ...Fonts.blackColor16SemiBold,
    //                     }}
    //                   >
    //                     {i == 0
    //                       ? "Currentnt"
    //                       : convertTiempoTranscurrido(
    //                           (new Date(
    //                             driverEvents[i - 1].geoTimeStamp.timeStamp
    //                           ) -
    //                             new Date(event.geoTimeStamp.timeStamp)) /
    //                             1000
    //                         )}
    //                   </Text>
    //                 </View>
    //               </TouchableOpacity>
    //               <TouchableOpacity
    //                 activeOpacity={0.99}
    //                 // onPress={onPress}
    //                 style={{
    //                   flexDirection: isRtl ? "row-reverse" : "row",
    //                   alignItems: "center",
    //                   justifyContent: "space-between",
    //                 }}
    //               >
    //                 <View
    //                   style={{
    //                     flex: 1,
    //                     flexDirection: isRtl ? "row-reverse" : "row",
    //                     alignItems: "center",
    //                   }}
    //                 >
    //                   <Text
    //                     numberOfLines={1}
    //                     style={{
    //                       marginLeft: isRtl ? 0.0 : Sizes.fixPadding,
    //                       marginRight: isRtl ? Sizes.fixPadding : 0.0,
    //                       flex: 1,
    //                       ...Fonts.blackColor16SemiBold,
    //                     }}
    //                   >
    //                     {tr("localizacion")}
    //                   </Text>
    //                 </View>
    //                 <View
    //                   style={{
    //                     flex: 1,
    //                     flexDirection: isRtl ? "row-reverse" : "row",
    //                     alignItems: "center",
    //                   }}
    //                 >
    //                   <Text
    //                     numberOfLines={1}
    //                     style={{
    //                       marginLeft: isRtl ? 0.0 : Sizes.fixPadding,
    //                       marginRight: isRtl ? Sizes.fixPadding : 0.0,
    //                       flex: 1,
    //                       ...Fonts.blackColor16SemiBold,
    //                     }}
    //                   >
    //                     {/* IDEALMENTE DEBERÍA DE MOSTRAR LA UBICACION EN TEXTO, NO EN COORDENADAS */}
    //                     {`${event?.geoTimeStamp?.latitude} , ${event?.geoTimeStamp?.longitude}`}
    //                   </Text>
    //                 </View>
    //               </TouchableOpacity>
    //               <TouchableOpacity
    //                 activeOpacity={0.99}
    //                 // onPress={onPress}
    //                 style={{
    //                   flexDirection: isRtl ? "row-reverse" : "row",
    //                   alignItems: "center",
    //                   justifyContent: "space-between",
    //                 }}
    //               >
    //                 <View
    //                   style={{
    //                     flex: 1,
    //                     flexDirection: isRtl ? "row-reverse" : "row",
    //                     alignItems: "center",
    //                   }}
    //                 >
    //                   <Text
    //                     numberOfLines={1}
    //                     style={{
    //                       marginLeft: isRtl ? 0.0 : Sizes.fixPadding,
    //                       marginRight: isRtl ? Sizes.fixPadding : 0.0,
    //                       flex: 1,
    //                       ...Fonts.blackColor16SemiBold,
    //                     }}
    //                   >
    //                     {tr("observaciones")}
    //                   </Text>
    //                 </View>
    //                 <View
    //                   style={{
    //                     flex: 1,
    //                     flexDirection: isRtl ? "row-reverse" : "row",
    //                     alignItems: "center",
    //                   }}
    //                 >
    //                   <Text
    //                     numberOfLines={1}
    //                     style={{
    //                       marginLeft: isRtl ? 0.0 : Sizes.fixPadding,
    //                       marginRight: isRtl ? Sizes.fixPadding : 0.0,
    //                       flex: 1,
    //                       ...Fonts.blackColor16SemiBold,
    //                     }}
    //                   >
    //                     {"Pre - TI"}
    //                   </Text>
    //                 </View>
    //               </TouchableOpacity>
    //               <TouchableOpacity
    //                 activeOpacity={0.99}
    //                 // onPress={onPress}
    //                 style={{
    //                   flexDirection: isRtl ? "row-reverse" : "row",
    //                   alignItems: "center",
    //                   justifyContent: "space-between",
    //                 }}
    //               >
    //                 <View
    //                   style={{
    //                     flex: 1,
    //                     flexDirection: isRtl ? "row-reverse" : "row",
    //                     alignItems: "center",
    //                   }}
    //                 >
    //                   <Text
    //                     numberOfLines={1}
    //                     style={{
    //                       marginLeft: isRtl ? 0.0 : Sizes.fixPadding,
    //                       marginRight: isRtl ? Sizes.fixPadding : 0.0,
    //                       flex: 1,
    //                       ...Fonts.blackColor16SemiBold,
    //                     }}
    //                   >
    //                     {tr("carrier")}
    //                   </Text>
    //                 </View>
    //                 <View
    //                   style={{
    //                     flex: 1,
    //                     flexDirection: isRtl ? "row-reverse" : "row",
    //                     alignItems: "center",
    //                   }}
    //                 >
    //                   <Text
    //                     numberOfLines={1}
    //                     style={{
    //                       marginLeft: isRtl ? 0.0 : Sizes.fixPadding,
    //                       marginRight: isRtl ? Sizes.fixPadding : 0.0,
    //                       flex: 1,
    //                       ...Fonts.blackColor16SemiBold,
    //                     }}
    //                   >
    //                     {event?.carrier?.name}
    //                   </Text>
    //                 </View>
    //               </TouchableOpacity>
    //               {false ? (
    //                 <View style={{ marginVertical: Sizes.fixPadding * 2.0 }} />
    //               ) : (
    //                 <View
    //                   style={{
    //                     marginVertical: Sizes.fixPadding * 2.0,
    //                     backgroundColor: Colors.lightGrayColor,
    //                     height: 1.0,
    //                   }}
    //                 />
    //               )}
    //             </View>
    //           );
    //         })}
    //       </View>
    //     </ScrollView>
    //   );
    }
  
    function btnsOptions() {
      return (
        <View style={styles.continueBtn.wrap}>
          <TouchableOpacity
            activeOpacity={0.99}
            style={{
              ...styles.continueBtn.btnStyle,
              ...styles.continueBtn.touchableOpacity,
            }}
            onPress={() => navigation.push("AppMenu")}
          >
            <Text
              numberOfLines={1}
              style={{
                marginHorizontal: Sizes.fixPadding - 5.0,
                ...Fonts.grayColor18SemiBold,
              }}
            >
              {languageModule.lang(language,'cancel')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.99}
            onPress={() => {
              setShowAdvertenciaDialog(true);
            }}
            style={{
              ...styles.continueBtn.btnStyle,
              ...styles.continueBtn.touchableOpacity,
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                marginHorizontal: Sizes.fixPadding - 5.0,
                ...Fonts.whiteColor18SemiBold,
              }}
            >
              {languageModule.lang(language,'certify')}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    function advertenciaDialog() {
      return (
        <Overlay
          isVisible={showAdvertenciaDialog}
          onBackdropPress={() => setShowAdvertenciaDialog(false)}
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
              {"advertencia"}
            </Text>
            <Text
              style={{
                textAlign: "center",
                marginTop: Sizes.fixPadding + 5.0,
                ...Fonts.blackColor16Medium,
              }}
            >
              {`${"advertenciaText"}`}
            </Text>
            <TouchableOpacity
              activeOpacity={0.99}
              onPress={async () => {
                await certifyDriverEvents(logsParaCertificar).then(() => {
                  dispatch(setDriverStatus("ON"));
                  postEvent(1, "ON");
                  setShowAdvertenciaDialog(false);
                  navigation.push("AppMenu");
                });
              }}
              style={styles.buttonStyle}
            >
              <Text style={{ ...Fonts.whiteColor16Bold }}>{"deAcuerdo"}</Text>
            </TouchableOpacity>
            <Text
              onPress={() => setShowAdvertenciaDialog(false)}
              style={{ textAlign: "center", ...Fonts.grayColor16SemiBold }}
            >
              {"noEstoyListo"}
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
                {"buscandoLogsParaCertificar"}
              </Text>
            </View>
          </View>
        </View>
      );
    }
  };
  
  export default CertificarLogs;
  
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
    continueBtn: {
      wrap: {
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginTop: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding * 3.0,
        flexDirection: "row",
        alignItems: "center",
      },
      touchableOpacity: {
        elevation: 2.0,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: Sizes.fixPadding - 2.0,
        paddingVertical: Sizes.fixPadding + 2.0,
        flex: 1,
        borderWidth: 1.0,
        borderBottomWidth: 0.0,
      },
      btnStyle: {
        backgroundColor: Colors.primaryColor,
        marginLeft: Sizes.fixPadding,
        borderColor: Colors.primaryColor,
      },
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
    buttonStyle: {
      backgroundColor: Colors.primaryColor,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: Sizes.fixPadding,
      paddingVertical: Sizes.fixPadding + 5.0,
      marginTop: Sizes.fixPadding * 2.0,
      marginBottom: Sizes.fixPadding,
    },
  });
  