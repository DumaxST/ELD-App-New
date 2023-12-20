import {  StyleSheet,  Text,  View,  SafeAreaView,  StatusBar,  ScrollView,  Image,  TouchableOpacity,  Dimensions,} from "react-native";
import React, { useState, useEffect } from "react";
import { Fonts, Colors, Sizes } from "../../../constants/styles";
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
const languageModule = require('../../../global_functions/variables');

const Envios = ({ navigation }) => {

  const [showNuevoEnvioDialog, setShowNuevoEnvioDialog] = useState(false);
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
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primaryColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        {header()}
        <View style={styles.sheetStyle}>
          {appOptions()}
          {nuevoEnvioBtn()}
        </View>
      </View>
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
          {"    " + languageModule.lang(language,'shipments')}
        </Text>
      </View>
    );
  }

  function appOptions() {
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: Sizes.fixPadding * 2.0 }}>
          {appOptionShort({
            icon: require("../../../assets/images/settingIcons/language.png"),
            option: "horasDeServicio",
            onPress: () => {
              navigation.push("HorasDeServicio");
            },
          })}
          {appOptionShort({
            icon: require("../../../assets/images/settingIcons/language.png"),
            option: "horasDeServicio",
            onPress: () => {
              navigation.push("HorasDeServicio");
            },
          })}
          {appOptionShort({
            icon: require("../../../assets/images/settingIcons/language.png"),
            option: "horasDeServicio",
            onPress: () => {
              navigation.push("HorasDeServicio");
            },
          })}
        </View>
      </ScrollView>
    );
  }

  function appOptionShort({ option, onPress, icon }) {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <TouchableOpacity
          activeOpacity={0.99}
          onPress={onPress}
          style={{
            flexDirection:"row",
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
                marginRight:  Sizes.fixPadding,
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
                marginLeft:  Sizes.fixPadding,
                marginRight: Sizes.fixPadding,
                flex: 1,
                ...Fonts.blackColor16SemiBold,
              }}
            >
              {"2022-09-10 17:00 PM"}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.99}
          onPress={onPress}
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
              {"2022-09-13 12:00 AM"}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.99}
          onPress={onPress}
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
              {"proveedor"}
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
              {"DHL"}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.99}
          onPress={onPress}
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
              {"numero"}
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
              {"NLDOG95652-O"}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.99}
          onPress={onPress}
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
              {"mercancia"}
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
              {"Mercancia Ejemplo"}
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
  }

  function nuevoEnvioBtn() {
    return (
      <View style={styles.continueBtn.wrap}>
        <TouchableOpacity
          activeOpacity={0.99}
          style={{
            ...styles.continueBtn.btnStyle,
            ...styles.continueBtn.touchableOpacity,
          }}
          onPress={() => navigation.push("NuevoEnvio")}
        >
          <Text
            numberOfLines={1}
            style={{
              marginHorizontal: Sizes.fixPadding - 5.0,
              ...Fonts.grayColor18SemiBold,
            }}
          >
            {"nuevoEnvio"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
};

export default Envios;

const styles = StyleSheet.create({
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
});
