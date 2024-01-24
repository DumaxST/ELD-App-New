import {StyleSheet,Text,View,SafeAreaView,StatusBar,ScrollView,Image,TouchableOpacity,Dimensions,} from "react-native";
import React, { useState, useEffect } from "react";
import {hasItStoped,setCurrentDriver,setDriverStatus,setELD,setTrackingTimeStamp,startEldApp,startVehicleMeters,} from "../../../redux/actions";
import { Fonts, Colors, Sizes } from "../../../constants/styles";
import { MaterialIcons } from "@expo/vector-icons";
import { Overlay } from "react-native-elements";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from "react-redux";
import { logOutCurrentDriver } from "../../../redux/actions";
import {removeToken} from '../../../data/commonQuerys'
import { useTimer } from '../../../global_functions/timerFunctions';

const languageModule = require('../../../global_functions/variables');
const { width } = Dimensions.get("window");

const AppMenu = ({ navigation, handleLogout }) => {
  const dispatch = useDispatch();

  const [language, setlanguage] = useState("");  
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const {
    eldData,
    currentDriver,
    acumulatedVehicleKilometers,
    lastDriverStatus,
    driverStatus
  } = useSelector((state) => state.eldReducer);
  const { stopTimer } = useTimer();

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

  const logOutDriver = async () => {
    // Eliminar el token y los datos del conductor directamente
    await AsyncStorage.removeItem('token');
  
      // Despachar la acción y esperar a que se complete
      await new Promise(resolve => {   
        dispatch(logOutCurrentDriver(currentDriver, eldData, acumulatedVehicleKilometers, lastDriverStatus))
          .then(() => resolve());
      });
    
      //Aqui detenos el timer ya que no requerimos seguir posteando eventos
      stopTimer();
      handleLogout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      });
  }
  
  function header() {
    return (
      <View
        style={{
          flexDirection: "row",
          margin: Sizes.fixPadding * 2.0,
          flex: 0.05,
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: Sizes.fixPadding * 2.0,
        }}
      >
      <Ionicons name={"arrow-back-circle-outline"} onPress={() => navigation.pop()} size={27} color="white" />
        <Text style={{ ...Fonts.whiteColor22SemiBold }}>
          {languageModule.lang(language,'Menu')}
        </Text>
        <TouchableOpacity onPress={logOutDriver}>
          <MaterialIcons
            name="logout"
            size={24}
            color={Colors.redColor}
          />
        </TouchableOpacity>
      </View>
    );
  }
  

  function appOptions() {
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: Sizes.fixPadding * 2.0 }}>
          {appOptionShort({
            icon: "book-outline",
            option: languageModule.lang(language,'logBook'),
            onPress: () => {
              navigation.push("LogBook");
            },
          })}
          {appOptionShort({
            icon: "analytics-outline",
            option: languageModule.lang(language,'diagnosis'),
            onPress: () => {
              navigation.push("Diagnostico");
            },
          })}
          {appOptionShort({
            icon: "search-outline",
            option: languageModule.lang(language,'searchDevices'),
            onPress: () => {
              navigation.push("BluetoothScreen");
            },
          })}
          {appOptionShort({
            icon: "car-outline",
            option: languageModule.lang(language,'vehicleProfile'),
            onPress: () => {
              navigation.push("PerfilVehiculo");
            },
          })}
          {appOptionShort({
            icon: "pulse-outline",
            option: languageModule.lang(language,'violations'),
            onPress: () => {
              navigation.push("Violaciones");
            },
          })}
          {appOptionShort({
            icon: "person-outline",
            option: languageModule.lang(language,'driverProfile'),
            onPress: () => {
              navigation.push("PerfilConductor");
            },
          })}
          {appOptionShort({
            icon: "help-circle-outline",
            option: languageModule.lang(language,'aboutELD'),
            onPress: () => {
              navigation.push("AcercaDelELD");
            },
          })}
          {appOptionShort({
            icon: "newspaper-outline",
            option: languageModule.lang(language,'annotations'),
            onPress: () => {
              navigation.push("Anotaciones");
            },
          })}
          {appOptionShort({
            icon: "lock-closed-outline",
            option: languageModule.lang(language,'certification'),
            onPress: () => {
              navigation.push("CertificacionELD");
            },
          })}
          {appOptionShort({
            icon: "document-text-outline",
            option: languageModule.lang(language,'certifyLogs'),
            onPress: () => {
              navigation.push("CertificarLogs");
            },
          })}
          {appOptionShort({
            icon: "people-outline",
            option: languageModule.lang(language,'entryOfSecondDriver'),
             onPress: () => {
               navigation.push("IngresoSegundoChofer");
             },
          })}
          {appOptionShort({
            icon: "notifications-outline",
            option: languageModule.lang(language,'notifications'),
            onPress: () => {
              navigation.push("Notificaciones");
            },
          })}
          {appOptionShort({
            icon: "mail-outline",
            option: languageModule.lang(language,'shipments'),
            onPress: () => {
              navigation.push("Envios");
            },
          })}
        </View>
      </ScrollView>
    );
  }

  function appOptionShort({ icon, option, onPress }) {
    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: Sizes.fixPadding * 3.0,
          borderBottomWidth: 1,
          borderBottomColor: "lightgray",
        }}
        onPress={onPress}
      >
        
        <Ionicons name={icon} size={30} color="black" />
        <Text style={{ fontSize: 20}}>{"    " + option}</Text>
      </TouchableOpacity>
    );
  }

  function logoutDialog() {
    return (
      <Overlay
        isVisible={showLogoutDialog}
        onBackdropPress={() => setShowLogoutDialog(false)}
        overlayStyle={{
          width: width - 40.0,
          borderRadius: Sizes.fixPadding - 2.0,
          padding: 0.0,
        }}
      >
        <View style={{ margin: Sizes.fixPadding * 2.0 }}>
          <Text style={{ textAlign: "center", ...Fonts.blackColor18Medium }}>
            {"seguroDeseaSalir"}
          </Text>
          <TouchableOpacity
            activeOpacity={0.99}
            onPress={() => {
              setShowLogoutDialog(false);
              navigation.push("LoginScreen");
            }}
            style={{
              ...styles.logoutButtonStyle,
              ...styles.cancelAndLogoutButtonStyle,
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                marginHorizontal: Sizes.fixPadding - 5.0,
                ...Fonts.whiteColor18SemiBold,
              }}
            >
              {"cerrarSesion"}
            </Text>
          </TouchableOpacity>

          <Text
            onPress={() => setShowLogoutDialog(false)}
            style={{
              textAlign: "center",
              marginTop: Sizes.fixPadding * 2,
              ...Fonts.grayColor18SemiBold,
            }}
          >
            {"cancelar"}
          </Text>
        </View>
      </Overlay>
    );
  }

  function expemtDriver(expemtDriverComment) {
    return (
      <View>
        <TouchableOpacity activeOpacity={0.99} style={styles.alertStyle}>
          <Text
            style={{
              ...Fonts.whiteColor16Bold,
              textAlign: "center",
            }}
          >
            {tr("exemptDriver")}
          </Text>
          <Text
            style={{
              ...Fonts.whiteColor16Bold,
              textAlign: "center",
            }}
          >
            {expemtDriverComment}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primaryColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        {header()}
        <View style={styles.sheetStyle}>
          {/* {currentDriver?.exemptDriverConfiguration?.value == "E"
            ? expemtDriver(currentDriver?.exemptDriverConfiguration?.comment)
            : null} */}
          {appOptions()}
        </View>
      </View>
      {logoutDialog()}
    </SafeAreaView>
  );
};

export default AppMenu;

const styles = StyleSheet.create({
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
    alertStyle: {
      backgroundColor: Colors.redColor,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: Sizes.fixPadding,
      paddingVertical: Sizes.fixPadding + 5.0,
      marginHorizontal: Sizes.fixPadding * 2.0,
      marginTop: Sizes.fixPadding * 3.5,
      marginBottom: Sizes.fixPadding * 2.0,
    },
});
