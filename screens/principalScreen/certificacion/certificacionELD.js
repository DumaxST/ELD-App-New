  import {  StyleSheet,  Text,  View,  SafeAreaView,  StatusBar,  ScrollView,  Image,  TouchableOpacity,  Dimensions,} from "react-native";
  import React, { useState, useEffect } from "react";
  import { Fonts, Colors, Sizes } from "../../../constants/styles";
  import Ionicons from 'react-native-vector-icons/Ionicons';
  import AsyncStorage from "@react-native-async-storage/async-storage";
  
  const { width } = Dimensions.get("window");
  const languageModule = require('../../../global_functions/variables');

  const CertificacionELD = ({ navigation }) => {

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
            {logoIcon()}
            {devicesList()}
          </View>
        </View>
      </SafeAreaView>
    );
  
    function logoIcon() {
      return (
        <View style={styles.mainLogo.container}>
          <Image
            source={require("../../../assets/images/icons/appIcon.png")}
            style={{
              ...styles.mainLogo.logo,
            }}
          />
        </View>
      );
    }

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
          {"    " + languageModule.lang(language,'certification')}
        </Text>
      </View>
      );
    }
    
    function devicesList() {
      return (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <Text
              style={{
                textAlign: "center",
                ...Fonts.blackColor22SemiBold,
              }}
            >
              {languageModule.lang(language,'FMCSAregistrationInformation')}
            </Text>
          </View>
          <View style={{ marginTop: Sizes.fixPadding * 3.0 }}>
            {profileOptionShort({
              icon: require("../../../assets/images/icons/bluetooth-success.png"),
              option: [languageModule.lang(language,'device'), "at.eDash"],
            })}
            {profileOptionShort({
              icon: require("../../../assets/images/icons/bluetooth-success.png"),
              option: [languageModule.lang(language,'modalIdentifier'), "Apollo"],
            })}
            {profileOptionShort({
              icon: require("../../../assets/images/icons/bluetooth-success.png"),
              option: [languageModule.lang(language,'registrationID'), "000B"],
            })}
          </View>
          <View>
            <Text
              style={{
                textAlign: "center",
                ...Fonts.blackColor22SemiBold,
              }}
            >
              {languageModule.lang(language,'registeredWithFMCSA')}
            </Text>
            <Text
              style={{
                textAlign: "center",
                marginTop: Sizes.fixPadding,
                ...Fonts.blackColor18SemiBold,
              }}
            >
              {"HOS - 49 CFR Part 395"}
            </Text>
            <Text
              style={{
                textAlign: "center",
                marginTop: Sizes.fixPadding,
                ...Fonts.blackColor12SemiBold,
              }}
            >
              {`${"exclusions"}: ${"passenger"}, ${
                "carryingVehicles"}, Alaska, Hawaii`}
            </Text>
          </View>
        </ScrollView>
      );
    }
  
    function profileOptionShort({ option, onPress, icon }) {
      return (
        <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
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
                {option[0]}
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
                {option[1]}
              </Text>
            </View>
          </TouchableOpacity>
          {icon == require("../../../assets/images/settingIcons/language.png") ? (
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
  
  export default CertificacionELD;
  
  const styles = StyleSheet.create({
    mainLogo: {
      container: {
        justifyContent: "center",
        alignItems: "center",
      },
      logo: {
        width: width / 2,
        height: width / 2,
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
  });
  