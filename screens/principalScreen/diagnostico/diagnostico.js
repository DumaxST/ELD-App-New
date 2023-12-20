import {StyleSheet,Text,View,SafeAreaView,StatusBar,ScrollView,Image,TouchableOpacity,Dimensions,} from "react-native";
import React, { useEffect, useState } from "react";
import { Fonts, Colors, Sizes } from "../../../constants/styles";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Overlay } from "react-native-elements";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from "react-i18next";
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get("window");
const languageModule = require('../../../global_functions/variables');

const Diagnostico = ({ navigation }) => {

  const [language, setlanguage] = useState("");  
  const [diagnostico, setDiagnostico] = useState([]);

  
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


  const diagnosticoResults = [
    {
      option: languageModule.lang(language, 'locationAvailability'),
      responce: { label: "Pasó", color: "success" },
    },
    {
      option: languageModule.lang(language, 'storageSpace'),
      responce: { label: "Pasó", color: "success" },
    },
    {
      option: languageModule.lang(language, 'batteryLevel'),
      responce: { label: "Pasó", color: "success" },
    },
    {
      option: languageModule.lang(language, 'bluetoothConnectibility'),
      responce: { label: "Falla", color: "danger" },
    },
    {
      option: languageModule.lang(language, 'engineData'),
      responce: { label: "Falla", color: "danger" },
    },
    {
      option: "RPM",
      responce: { label: "03:37:08 PM (CDT) - 775", color: "danger" },
    },
    {
      option: languageModule.lang(language, 'odometer'),
      responce: {
        label: "03:37:08 PM (CDT) - 626599 Millas",
        color: "success",
      },
    },
    {
      option: languageModule.lang(language, 'speed'),
      responce: { label: "03:37:08 PM (CDT) - 1 mph", color: "danger" },
    },
    {
      option: languageModule.lang(language, 'engineHours'),
      responce: {
        label: "03:37:08 PM (CDT) - 18387 Hrs",
        color: "success",
      },
    },
    {
      option: "Firmware",
      responce: { label: "No Disponible", color: "black" },
    },
  ];
  const [diagnosticandoDispositivo, setDiagnosticandoDispositivo] =
    useState(true);

  
  
  useEffect(() => {
    dispositivoDiagnosticado();
  }, []);

  const dispositivoDiagnosticado = async () => {
    setDiagnosticandoDispositivo(true);
    setDiagnostico([]);
    setTimeout(async function () {
      setDiagnostico(diagnosticoResults);
      setDiagnosticandoDispositivo(false);
    }, 5000);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primaryColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        {header()}
        <View style={styles.sheetStyle}>
          {diagnosticoList()}
          {screenOptions()}
        </View>
      </View>
      {diagnosticandoUnidadDispositivos()}
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
        }}>
        <Ionicons name={"arrow-back-circle-outline"} onPress={() => navigation.pop()} size={27} color="white" />
        <Text style={{ ...Fonts.whiteColor22SemiBold }} >
          {"     " + languageModule.lang(language, 'diagnosis')}
        </Text>
      </View>
    );
  }

  function diagnosticandoUnidadDispositivos() {
    return (
      <Overlay
        isVisible={diagnosticandoDispositivo}
        onBackdropPress={() => setDiagnosticandoDispositivo(false)}
        overlayStyle={{
          width: width - 40.0,
          borderRadius: Sizes.fixPadding - 2.0,
          padding: 0.0,
        }}
      >
        <View style={{ margin: Sizes.fixPadding * 2.0 }}>
          <View style={styles.loaderGif.container}>
            <Image
              source={require("../../../assets/gifs/newloading.gif")}
              style={{
                ...styles.loaderGif,
              }}
            />
            <Text
              style={{
                ...Fonts.blackColor18Medium,
                marginLeft: Sizes.fixPadding * 4,
              }}
            >
              {languageModule.lang(language, 'diagnosingUnit')}
            </Text>
          </View>
        </View>
      </Overlay>
    );
  }

  function diagnosticoList() {
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: Sizes.fixPadding * 3.0 }}>
          {diagnostico.map((diagnostico, i) => {
            return diagnosticoOptionShort(diagnostico, i);
          })}
        </View>
      </ScrollView>
    );
  }

  function diagnosticoOptionShort({ option, responce, last }, i) {
    return (
      <View
        key={`diagnosticoOptionShort_${i}`}
        style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}
      >
        <TouchableOpacity
          activeOpacity={0.99}
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
              numberOfLines={2}
              style={{
                marginLeft: Sizes.fixPadding,
                marginRight: Sizes.fixPadding,
                flex: 1,
                ...Fonts.blackColor16SemiBold,
              }}
            >
              {option}
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
              numberOfLines={2}
              style={{
                textAlign: "right",
                marginLeft: Sizes.fixPadding,
                marginRight:Sizes.fixPadding,
                flex: 1,
                ...Fonts[`${responce.color}Color16SemiBold`],
              }}
            >
              {responce.label}
            </Text>
          </View>
        </TouchableOpacity>
        {true ? (
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
  }

  function screenOptions() {
    return (
      <View
        style={{
          marginVertical: Sizes.fixPadding * 2.5,
          marginHorizontal: Sizes.fixPadding * 2.0,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.99}
          onPress={() => {
            dispositivoDiagnosticado();
          }}
          style={
            diagnostico.length == 0
              ? {
                  ...styles.optionBtns.btnStyle,
                  ...styles.optionBtns.btnSuccess,
                }
              : {
                  ...styles.optionBtns.btnStyle,
                  ...styles.optionBtns.btnLight,
                }
          }
        >
          <Text
            numberOfLines={1}
            style={
              diagnostico.length > 0
                ? {
                    marginHorizontal: Sizes.fixPadding - 5.0,
                    ...Fonts.blackColor18SemiBold,
                  }
                : {
                    marginHorizontal: Sizes.fixPadding - 5.0,
                    ...Fonts.whiteColor18SemiBold,
                  }
            }
          >
            {languageModule.lang(language, 'test')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.99}
          onPress={() => {
            navigation.push("PerfilVehiculo");
          }}
          style={
            diagnostico.length > 0
              ? {
                  ...styles.optionBtns.btnStyle,
                  ...styles.optionBtns.btnSuccess,
                }
              : {
                  ...styles.optionBtns.btnStyle,
                  ...styles.optionBtns.btnLight,
                }
          }
        >
          <Text
            numberOfLines={1}
            style={
              diagnostico.length > 0
                ? {
                    marginHorizontal: Sizes.fixPadding - 5.0,
                    ...Fonts.whiteColor18SemiBold,
                  }
                : {
                    marginHorizontal: Sizes.fixPadding - 5.0,
                    ...Fonts.blackColor18SemiBold,
                  }
            }
          >
            {languageModule.lang(language, 'continue')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
};

export default Diagnostico;

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
  optionBtns: {
    wrap: {
      marginHorizontal: Sizes.fixPadding * 2.0,
      marginTop: Sizes.fixPadding * 2.0,
      marginBottom: Sizes.fixPadding * 3.0,
      flexDirection: "row",
      alignItems: "center",
    },
    btnStyle: {
      elevation: 2.0,
      alignItems: "center",
      justifyContent: "center",
      marginTop: Sizes.fixPadding * 2.0,
      borderRadius: Sizes.fixPadding - 2.0,
      paddingVertical: Sizes.fixPadding + 2.0,
      borderWidth: 1.0,
      borderBottomWidth: 1.0,
    },
    btnSuccess: {
      backgroundColor: Colors.primaryColor,
      borderColor: Colors.primaryColor,
    },
    btnLight: {
      backgroundColor: Colors.whiteColor,
      borderColor: Colors.blackColor,
    },
  },
});
