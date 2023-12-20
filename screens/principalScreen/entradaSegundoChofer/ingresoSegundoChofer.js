  import {  StyleSheet,  Text,  View,  SafeAreaView,  StatusBar,  ScrollView,  Image,  TouchableOpacity,  Dimensions,} from "react-native";
  import React, { useState, useEffect } from "react";
  import { Fonts, Colors, Sizes } from "../../../constants/styles";
  import { Overlay } from "react-native-elements";
  import { useTranslation } from "react-i18next";
  import { TextInput } from "react-native-paper";
  import Ionicons from 'react-native-vector-icons/Ionicons';
  import AsyncStorage from "@react-native-async-storage/async-storage";
  
  const { width } = Dimensions.get("window");
  const languageModule = require('../../../global_functions/variables');
  
  const IngresoSegundoChofer = ({ navigation }) => {

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
  
    const [connectingBluetoothDeviceDialog, setConnectingBluetoothDeviceDialog] =
      useState(false);
  
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primaryColor }}>
        <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
        <View style={{ flex: 1 }}>
          {header()}
          <View style={styles.sheetStyle}>
            {usuarioHOS()}
            {contraseña()}
            {btnsOptions()}
          </View>
        </View>
        {ConnectingBluetoothDeviceDialog()}
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
          {"    " + languageModule.lang(language,'entryOfSecondDriver')}
        </Text>
      </View>
      );
    }
  
    function ConnectingBluetoothDeviceDialog() {
      return (
        <Overlay
          isVisible={connectingBluetoothDeviceDialog}
          onBackdropPress={() => setConnectingBluetoothDeviceDialog(false)}
          overlayStyle={{
            width: width - 40.0,
            borderRadius: Sizes.fixPadding - 2.0,
            padding: 0.0,
          }}
        >
          <View style={{ margin: Sizes.fixPadding * 2.0 }}>
            <Text style={{ textAlign: "center", ...Fonts.blackColor18Medium }}>
              {"conectandoDispositivo"}
            </Text>
            <View style={styles.continueBtn.wrap}>
              <TouchableOpacity
                activeOpacity={0.99}
                onPress={() => {
                  navigation.push("Signin");
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
                  {"continuar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Overlay>
      );
    }
  
    const [state, setState] = useState({
      selectedPaymentIndex: 2,
      cardHolderName: "Jemin patel",
      cardNumber: "1234 5678 9810 1123",
      expireDate: "02/05/2022",
      cvv: "3**",
    });
  
    const { selectedPaymentIndex, cardHolderName, cardNumber, expireDate, cvv } =
      state;
  
    function usuarioHOS() {
      return (
        <View style={{ margin: Sizes.fixPadding * 2.0 }}>
          <Text style={{ ...Fonts.grayColor14Regular }}>{languageModule.lang(language,'userHOS')}</Text>
          <TextInput
            value={cardHolderName}
            onChangeText={(text) => updateState({ cardHolderName: text })}
            style={styles.textFieldStyle}
            activeUnderlineColor={Colors.primaryColor}
            underlineColor={Colors.grayColor}
          />
        </View>
      );
    }
  
    function contraseña() {
      return (
        <View style={{ margin: Sizes.fixPadding * 2.0 }}>
          <Text style={{ ...Fonts.grayColor14Regular }}>{languageModule.lang(language, 'password')}</Text>
          <TextInput
            value={cardHolderName}
            onChangeText={(text) => updateState({ cardHolderName: text })}
            style={styles.textFieldStyle}
            activeUnderlineColor={Colors.primaryColor}
            underlineColor={Colors.grayColor}
          />
        </View>
      );
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
            onPress={() => {
              navigation.push("NavigationsTab");
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                marginHorizontal: Sizes.fixPadding - 5.0,
                ...Fonts.whiteColor18SemiBold,
              }}
            >
              {languageModule.lang(language,'login')}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  };
  
  export default IngresoSegundoChofer;
  
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
  