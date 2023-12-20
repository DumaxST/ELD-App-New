  import {  StyleSheet,  Text,  View,  SafeAreaView,  StatusBar,  ScrollView,  Image,  TouchableOpacity,  Dimensions,} from "react-native";
  import React, { useState, useEffect } from "react";
  import { Fonts, Colors, Sizes } from "../../../constants/styles";
  import { Overlay } from "react-native-elements";
  import { useTranslation } from "react-i18next";
  import { TextInput } from "react-native-paper";
  
  const { width } = Dimensions.get("window");
  
  const NuevoEnvio = ({ navigation }) => {
  
    const [connectingBluetoothDeviceDialog, setConnectingBluetoothDeviceDialog] =
      useState(false);
  
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primaryColor }}>
        <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
        <View style={{ flex: 1 }}>
          {header()}
          <View style={styles.sheetStyle}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ marginTop: Sizes.fixPadding * 2.0 }}>
                {tiempoDeInicio()}
                {tiempoDeTerminacion()}
                {proveedor()}
                {numero()}
                {mercancia()}
              </View>
            </ScrollView>
            {btnsOptions()}
          </View>
        </View>
      </SafeAreaView>
    );
  
    const { name, phoneNo, email, fitnessGoal, showBottomSheet } = state;
  
    function header() {
      return (
        <View style={{ padding: Sizes.fixPadding * 5.0 }}>
          <Text style={{ textAlign: "center", ...Fonts.whiteColor22SemiBold }}>
            {tr("nuevoEnvio")}
          </Text>
        </View>
      );
    }
  
    function tiempoDeInicio() {
      return (
        <View
          style={{
            marginHorizontal: Sizes.fixPadding * 2.0,
            marginBottom: Sizes.fixPadding * 2.0,
            marginTop: Sizes.fixPadding * 2.0,
          }}
        >
          <Text
            style={{
              marginBottom: Sizes.fixPadding - 5.0,
              ...Fonts.grayColor16Regular,
            }}
          >
            {tr("tiempoDeInicio")}
          </Text>
          <TextInput
            value={name}
            onChangeText={(text) => updateState({ name: text })}
            style={styles.textFieldStyle}
            selectionColor={Colors.primaryColor}
          />
        </View>
      );
    }
  
    function tiempoDeTerminacion() {
      return (
        <View
          style={{
            marginHorizontal: Sizes.fixPadding * 2.0,
            marginBottom: Sizes.fixPadding * 2.0,
          }}
        >
          <Text
            style={{
              marginBottom: Sizes.fixPadding - 5.0,
              ...Fonts.grayColor16Regular,
            }}
          >
            {tr("tiempoDeTerminacion")}
          </Text>
          <TextInput
            value={email}
            onChangeText={(text) => updateState({ email: text })}
            style={styles.textFieldStyle}
            selectionColor={Colors.primaryColor}
          />
        </View>
      );
    }
  
    function proveedor() {
      return (
        <View
          style={{
            marginHorizontal: Sizes.fixPadding * 2.0,
            marginBottom: Sizes.fixPadding * 2.0,
            marginTop: Sizes.fixPadding * 2.0,
          }}
        >
          <Text
            style={{
              marginBottom: Sizes.fixPadding - 5.0,
              ...Fonts.grayColor16Regular,
            }}
          >
            {tr("proveedor")}
          </Text>
          <TextInput
            value={name}
            onChangeText={(text) => updateState({ name: text })}
            style={styles.textFieldStyle}
            selectionColor={Colors.primaryColor}
          />
        </View>
      );
    }
  
    function numero() {
      return (
        <View
          style={{
            marginHorizontal: Sizes.fixPadding * 2.0,
            marginBottom: Sizes.fixPadding * 2.0,
          }}
        >
          <Text
            style={{
              marginBottom: Sizes.fixPadding - 5.0,
              ...Fonts.grayColor16Regular,
            }}
          >
            {tr("numero")}
          </Text>
          <TextInput
            value={email}
            onChangeText={(text) => updateState({ email: text })}
            style={styles.textFieldStyle}
            selectionColor={Colors.primaryColor}
          />
        </View>
      );
    }
  
    function mercancia() {
      return (
        <View
          style={{
            marginHorizontal: Sizes.fixPadding * 2.0,
            marginBottom: Sizes.fixPadding * 2.0,
          }}
        >
          <Text
            style={{
              marginBottom: Sizes.fixPadding - 5.0,
              ...Fonts.grayColor16Regular,
            }}
          >
            {tr("mercancia")}
          </Text>
          <TextInput
            value={phoneNo}
            onChangeText={(text) => updateState({ phoneNo: text })}
            style={styles.textFieldStyle}
            selectionColor={Colors.primaryColor}
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
              navigation.push("Envios");
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                marginHorizontal: Sizes.fixPadding - 5.0,
                ...Fonts.whiteColor18SemiBold,
              }}
            >
              {tr("crearEnvio")}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  };
  
  export default NuevoEnvio;
  
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
  