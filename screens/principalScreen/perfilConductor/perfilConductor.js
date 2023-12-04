  import {StyleSheet,Text,View,SafeAreaView,StatusBar,ScrollView,Image,TouchableOpacity,Dimensions,} from "react-native";
  import React, { useEffect, useState } from "react";
  import { Fonts, Colors, Sizes } from "../../../constants/styles";
  import { TextInput } from "react-native-paper";
  import { MaterialIcons } from "@expo/vector-icons";
  import Ionicons from 'react-native-vector-icons/Ionicons';
  import AsyncStorage from "@react-native-async-storage/async-storage";
  
  const { width } = Dimensions.get("window");
  const languageModule = require('../../../global_functions/variables');
  
  const PerfilDelChofer = ({ navigation }) => {

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
  
    const [currentChofer, setCurrentChofer] = useState({});
    useEffect(async () => {
      await getCurrentDriver().then((driver) => {
        setCurrentChofer(driver);
      });
    }, []);
  
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primaryColor }}>
        <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
        <View style={{ flex: 1 }}>
          {header()}
          <View style={styles.sheetStyle}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ marginTop: Sizes.fixPadding * 2.0 }}>
                {nameInput()}
                {idInput()}
                {nombreDeLaEmpresa()}
                {usoHorarioEmpresaInput()}
                {estadoDeEmisionDeLaLicenciaInput()}
                {numeroDeLaLicenciaInput()}
                {modoDeOperacionInput()}
              </View>
            </ScrollView>
            {btnsOptions()}
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
          {"    " + languageModule.lang(language,'driverProfile')}
        </Text>
      </View>
      );
    }
  
    function nameInput() {
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
            {languageModule.lang(language,'Name')}
          </Text>
          <TextInput
            // value={currentChofer?.firstName}
            // onChangeText={(text) =>
            //   setCurrentChofer({ ...currentChofer, firstName: text })
            // }
            style={styles.textFieldStyle}
            selectionColor={Colors.primaryColor}
          />
        </View>
      );
    }
  
    function idInput() {
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
            {"Id"}
          </Text>
          <TextInput
            // value={currentChofer?.id}
            disabled={true}
            style={styles.textFieldStyle}
            selectionColor={Colors.primaryColor}
          />
        </View>
      );
    }
  
    // TDB
    function nombreDeLaEmpresa() {
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
            {languageModule.lang(language,'companyName')}
          </Text>
          <TextInput
            // value={currentChofer.firstName}
            // onChangeText={(text) =>
            //   setCurrentChofer({ ...currentChofer, firstName: text })
            // }
            style={styles.textFieldStyle}
            selectionColor={Colors.primaryColor}
          />
        </View>
      );
    }
  
    // TDB
    function usoHorarioEmpresaInput() {
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
            {languageModule.lang(language,'companySchedule')}
          </Text>
          <TextInput
            value={""}
            // onChangeText={(text) => updateState({ email: text })}
            style={styles.textFieldStyle}
            selectionColor={Colors.primaryColor}
          />
        </View>
      );
    }
  
    function estadoDeEmisionDeLaLicenciaInput() {
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
            {languageModule.lang(language,'LicenseIssuanceStatus')}
          </Text>
          <TextInput
            value={currentChofer?.driverLicense?.issuingState}
            onChangeText={(text) =>
              setCurrentChofer({
                ...currentChofer,
                driverLicense: {
                  ...currentChofer.driverLicense,
                  issuingState: text,
                },
              })
            }
            style={styles.textFieldStyle}
            selectionColor={Colors.primaryColor}
          />
        </View>
      );
    }
  
    function numeroDeLaLicenciaInput() {
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
            {languageModule.lang(language,'licenseNumber')}
          </Text>
          <TextInput
            // value={currentChofer?.driverLicense?.licenseID}
            // onChangeText={(text) =>
            //   setCurrentChofer({
            //     ...currentChofer,
            //     driverLicense: {
            //       ...currentChofer.driverLicense,
            //       licenseID: text,
            //     },
            //   })
            // }
            style={styles.textFieldStyle}
            selectionColor={Colors.primaryColor}
          />
        </View>
      );
    }
  
    // TBD
    function modoDeOperacionInput() {
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
            {languageModule.lang(language,'operationMode')}
          </Text>
          <TextInput
            value={""}
            // onChangeText={(text) => updateState({ fitnessGoal: text })}
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
              navigation.push("AppMenu");
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                marginHorizontal: Sizes.fixPadding - 5.0,
                ...Fonts.whiteColor18SemiBold,
              }}
            >
              {languageModule.lang(language,'save')}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  };
  
  export default PerfilDelChofer;
  
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
  