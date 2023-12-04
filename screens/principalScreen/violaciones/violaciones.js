import {StyleSheet,Text,View,SafeAreaView,StatusBar,ScrollView,Image,TouchableOpacity,Dimensions,} from "react-native";
import React, { useState, useEffect } from "react";
import { Fonts, Colors, Sizes } from "../../../constants/styles";
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
const languageModule = require('../../../global_functions/variables');

const Violaciones = ({ navigation }) => {

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
        <View style={styles.sheetStyle}>{appOptions()}</View>
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
          {"    " + languageModule.lang(language,'violations')}
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
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
          <View style={{ ...styles.notificationWrapStyle }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ ...Fonts.blackColor16Medium }}>
                  {"Titulo Violación"}
                </Text>
                <Text style={{ ...Fonts.blackColor14Regular }}>
                  {"Lorem Impsum dolors dios "}
                </Text>
              </View>
              <Text style={{ ...Fonts.primaryColor16Medium }}>
                {"09:00 PM"}
              </Text>
            </View>
          </View>
        </View>
        {option == "envios" ? (
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
};

export default Violaciones;

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
});
