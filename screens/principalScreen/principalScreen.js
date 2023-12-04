  import {SafeAreaView,ScrollView,StyleSheet,Text,TouchableOpacity,View,StatusBar,Image,Dimensions,} from "react-native";
  import React, { useEffect, useState } from "react";
  import { Colors, Fonts, Sizes } from "../../constants/styles";
  import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
  import { Input, Overlay } from "react-native-elements";
  import * as Progress from "react-native-progress";
  import { TextInput } from "react-native-paper";
  import AsyncStorage from '@react-native-async-storage/async-storage';


  const languageModule = require('../../global_functions/variables');
  const { width } = Dimensions.get("window");
  
  const PrincipalScreen = ({ navigation, route, screenProps }) => {
    const [language, setlanguage] = useState("");
    const currentDriver = useState("ON")
    const driverStatus = useState("ON")

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
  
  
    function header() {
      return (
        <View
          style={{
            ...styles.headerWrapStyle,
            flexDirection: "row",
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image
              source={require("../../assets/images/icons/appIcon-white.png")}
              style={{ width: 45.0, height: 45.0, borderRadius: 22.5 }}
            />
            <View style={{ flex: 1, marginHorizontal: Sizes.fixPadding + 5.0 }}>
              <Text style={{ ...Fonts.whiteColor18SemiBold }}>
                {languageModule.lang(language, 'hoursofservice')}
              </Text>
            </View>
          </View>
  
          <TouchableOpacity
            activeOpacity={0.99}
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
            // onPress={() => navigation.push("AppMenu")}
          >
            <View
              style={{
                marginLeft: Sizes.fixPadding,
                marginRight:Sizes.fixPadding,
              }}
            >
              <MaterialCommunityIcons
                name="bluetooth"
                size={36}
                color={Colors.redColor}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.99}
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                marginLeft:  Sizes.fixPadding,
                marginRight: Sizes.fixPadding,
              }}
            >
              <MaterialCommunityIcons
                name="truck"
                size={36}
                color={Colors.redColor}
              />
            </View>
          </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.99}
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => navigation.push("AppMenu")}
            >
              <View
                style={{
                  marginLeft: Sizes.fixPadding,
                  marginRight: Sizes.fixPadding,
                }}
              >
                <MaterialCommunityIcons
                  name="menu"
                  size={36}
                  color={Colors.whiteColor}
                />
              </View>
            </TouchableOpacity>
        </View>
      );
    }
  
    function userData() {
      return (
        <View
          style={{
            marginHorizontal: Sizes.fixPadding * 2.0,
            marginTop: Sizes.fixPadding * 1.0,
            flexDirection: "row",
          }}
        >
          <View
            style={{
              ...styles.sessionStartTimeWrapStyle,
              borderColor: styles.sessionStartTimeWrapStyle.borderColor.success,
              alignSelf: "flex-start",
            }}
          >
            <Text style={{ ...Fonts.blackColor16Regular }}>
              {languageModule.lang(language, 'driverName')}
              {":"}
            </Text>
          </View>
          <View
            style={{
              ...styles.sessionStartTimeWrapStyle,
              borderColor: styles.sessionStartTimeWrapStyle.borderColor.error,
              margin: Sizes.fixPadding,
              alignSelf: "flex-start",
            }}
          >
            <Text style={{ ...Fonts.blackColor16BoldError }}>
              {languageModule.lang(language, 'driverStatus')}
              {":"}
            </Text>
          </View>
          <View
            style={{
              ...styles.sessionStartTimeWrapStyle,
              borderColor: styles.sessionStartTimeWrapStyle.borderColor.error,
              margin: Sizes.fixPadding,
              alignSelf:  "flex-start",
            }}
          >
            <Text style={{ ...Fonts.blackColor16BoldError }}>{"M"}</Text>
          </View>
          <View
            style={{
              margin: Sizes.fixPadding,
              marginLeft: Sizes.fixPadding * 4.0,
              alignSelf: "flex-start",
            }}
          >
            <MaterialCommunityIcons
              name="clipboard"
              size={20}
              color={Colors.blackColor}
            />
          </View>
        </View>
      );
    }
  
    function geoLocation() {
      return (
        <View
          style={{
            marginHorizontal: Sizes.fixPadding * 2.0,
            marginBottom: Sizes.fixPadding * 1,
            flexDirection: "row",
          }}
        >
          <View
            style={{
              ...styles.sessionStartTimeWrapStyle,
              alignSelf:"flex-start",
            }}
          >
            <Text style={{ ...Fonts.blackColor16Regular }}>
              {languageModule.lang(language, 'latitude')}
              {":"}
            </Text>
          </View>
          <View
            style={{
              ...styles.sessionStartTimeWrapStyle,
              alignSelf: "flex-start",
            }}
          >
            <Text style={{ ...Fonts.blackColor16Regular }}>
              {languageModule.lang(language, 'longitude')}
              {":"}
            </Text>
          </View>
        </View>
      );
    }
  
    function driverOptions() {
      return (
        <View
          style={{
            borderTopColor: "black",
            borderTopWidth: StyleSheet.hairlineWidth,
          }}
        >
          <View
            style={{
              ...styles.continueBtn.wrap,
              marginTop: Sizes.fixPadding * 2.0,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.99}
              style={
                driverStatus == "ON"
                  ? {
                      ...styles.continueBtn.btnStyleBig,
                      ...styles.continueBtn.btnSelected,
                      ...styles.continueBtn.touchableOpacity,
                    }
                  : {
                      ...styles.continueBtn.btnStyleBig,
                      ...styles.continueBtn.btnActive,
                      ...styles.continueBtn.touchableOpacity,
                    }
              }
              onPress={() => changeDriverStatus("ON")}
            >
              <Text
                numberOfLines={1}
                style={{
                  marginHorizontal: Sizes.fixPadding - 5.0,
                  ...Fonts.whiteColor28SemiBold,
                }}
              >
                {languageModule.lang(language, 'onDuty')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.99}
              style={
                driverStatus == "D"
                  ? {
                      ...styles.continueBtn.btnStyleBig,
                      ...styles.continueBtn.btnSelected,
                      ...styles.continueBtn.touchableOpacity,
                    }
                  : {
                      ...styles.continueBtn.btnStyleBig,
                      ...styles.continueBtn.btnActive,
                      ...styles.continueBtn.touchableOpacity,
                    }
              }
              onPress={() => changeDriverStatus("D")}
            >
              <Text
                numberOfLines={1}
                style={{
                  marginHorizontal: Sizes.fixPadding - 5.0,
                  ...Fonts.whiteColor28SemiBold,
                }}
              >
                {languageModule.lang(language, 'driving')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.continueBtn.wrap}>
            <TouchableOpacity
              activeOpacity={0.99}
              style={
                driverStatus == "SB"
                  ? {
                      ...styles.continueBtn.btnStyleBig,
                      ...styles.continueBtn.btnSelected,
                      ...styles.continueBtn.touchableOpacity,
                    }
                  : {
                      ...styles.continueBtn.btnStyleBig,
                      ...styles.continueBtn.btnActive,
                      ...styles.continueBtn.touchableOpacity,
                    }
              }
              onPress={() => changeDriverStatus("SB")}
            >
              <Text
                numberOfLines={1}
                style={{
                  marginHorizontal: Sizes.fixPadding - 5.0,
                  ...Fonts.whiteColor28SemiBold,
                }}
              >
                {languageModule.lang(language, 'Sleeper')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.99}
              style={
                driverStatus == "PS"
                  ? {
                      ...styles.continueBtn.btnStyleBig,
                      ...styles.continueBtn.btnSelected,
                      ...styles.continueBtn.touchableOpacity,
                    }
                  : {
                      ...styles.continueBtn.btnStyleBig,
                      ...styles.continueBtn.btnActive,
                      ...styles.continueBtn.touchableOpacity,
                    }
              }
              onPress={() => changeDriverStatus("PS")}
            >
              <Text
                numberOfLines={1}
                style={{
                  marginHorizontal: Sizes.fixPadding - 5.0,
                  ...Fonts.whiteColor28SemiBold,
                }}
              >
                {languageModule.lang(language, 'passenger')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.continueBtn.wrap}>
            <TouchableOpacity
              activeOpacity={0.99}
              style={
                currentDriver?.yard == false
                  ? {
                      ...styles.continueBtn.btnStyle,
                      ...styles.continueBtn.btnDeactivated,
                      ...styles.continueBtn.touchableOpacity,
                    }
                  : driverStatus == "YM"
                  ? {
                      ...styles.continueBtn.btnStyle,
                      ...styles.continueBtn.btnSelected,
                      ...styles.continueBtn.touchableOpacity,
                    }
                  : {
                      ...styles.continueBtn.btnStyle,
                      ...styles.continueBtn.btnActive,
                      ...styles.continueBtn.touchableOpacity,
                    }
              }
              onPress={() =>
                currentDriver?.yard == true ? changeDriverStatus("YM") : null
              }
            >
              <Text
                numberOfLines={1}
                style={{
                  marginHorizontal: Sizes.fixPadding - 5.0,
                  ...Fonts.whiteColor18SemiBold,
                }}
              >
                {"YARD"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.99}
              style={
                currentDriver?.personalUse == false
                  ? {
                      ...styles.continueBtn.btnStyle,
                      ...styles.continueBtn.btnDeactivated,
                      ...styles.continueBtn.touchableOpacity,
                    }
                  : driverStatus == "PC"
                  ? {
                      ...styles.continueBtn.btnStyle,
                      ...styles.continueBtn.btnSelected,
                      ...styles.continueBtn.touchableOpacity,
                    }
                  : {
                      ...styles.continueBtn.btnStyle,
                      ...styles.continueBtn.btnActive,
                      ...styles.continueBtn.touchableOpacity,
                    }
              }
              onPress={() =>
                currentDriver?.personalUse == true
                  ? changeDriverStatus("PC")
                  : null
              }
            >
              <Text
                numberOfLines={1}
                style={{
                  marginHorizontal: Sizes.fixPadding - 5.0,
                  ...Fonts.whiteColor18SemiBold,
                }}
              >
                {"PERSONAL"}
              </Text>
            </TouchableOpacity>
          </View>
  
          <View style={styles.continueBtn.wrap}>
            <TouchableOpacity
              activeOpacity={0.99}
              style={
                driverStatus == "OFF-DUTY"
                  ? {
                      ...styles.continueBtn.btnStyleRound,
                      ...styles.continueBtn.btnSelected,
                      ...styles.continueBtn.touchableOpacityRound,
                    }
                  : {
                      ...styles.continueBtn.btnStyleRound,
                      ...styles.continueBtn.btnActive,
                      ...styles.continueBtn.touchableOpacityRound
                    }
              }
            >
              <Text
                numberOfLines={1}
                style={{
                  marginHorizontal: Sizes.fixPadding + 150,
                  ...Fonts.whiteColor22SemiBold,
                }}
                onPress={() => changeDriverStatus("OFF-DUTY")}
              >
                {languageModule.lang(language, 'offDuty')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  
    function posibleViolacion() {
      return (
        <TouchableOpacity
          activeOpacity={0.99}
          style={{
            alignItems: "center",
            marginTop: Sizes.fixPadding * 2.0,
            borderTopColor: "black",
            borderTopWidth: StyleSheet.hairlineWidth,
            borderBottomColor: "black",
            borderBottomWidth: StyleSheet.hairlineWidth,
            flexDirection: "row",
          }}
        >
          <View
            style={{
              margin: Sizes.fixPadding * 2.0,
            }}
          >
            <Text style={{ ...Fonts.blackColor16SemiBold }}>
              {languageModule.lang(language, 'posibleViolation')}
            </Text>
            <Text style={{ ...Fonts.blackColor14Regular }}>
              {"14 horas on-duty"}
            </Text>
          </View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginLeft: Sizes.fixPadding * 5.0,
            }}
          >
            <Text style={{ ...Fonts.blackColor18Bold }}>{"01:37"}</Text>
          </View>
        </TouchableOpacity>
      );
    }
  
    function manejandoInfo() {
      return (
        <View>
          <Text
            style={{
              marginHorizontal: Sizes.fixPadding * 2.0,
              marginTop: Sizes.fixPadding * 2.0,
              ...Fonts.blackColor16SemiBold,
            }}
          >
            {languageModule.lang(language, 'driving')}
          </Text>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: Sizes.fixPadding * 2.0,
            }}
          >
            <Progress.Circle
              progress={0.65}
              size={width / 2.8}
              unfilledColor={Colors.lightGrayColor}
              borderWidth={0.0}
              color={Colors.primaryColor}
              thickness={8}
            />
            <Text
              style={{
                width: 80.0,
                height: 45.0,
                position: "absolute",
                textAlign: "center",
                ...Fonts.blackColor36SemiBold,
              }}
            >
              {"11 H"}
            </Text>
          </View>
          <Text
            style={{
              textAlign: "center",
              marginTop: Sizes.fixPadding,
              marginBottom: Sizes.fixPadding * 2.0,
              ...Fonts.primaryColor24SemiBold,
            }}
          >
            {"03:43"}
          </Text>
          <View
            style={{
              borderBottomColor: "black",
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
        </View>
      );
    }
  
    function onTurnoInfo() {
      return (
        <View>
          <Text
            style={{
              marginHorizontal: Sizes.fixPadding * 2.0,
              marginTop: Sizes.fixPadding * 2.0,
              ...Fonts.blackColor16SemiBold,
            }}
          >
            {languageModule.lang(language, 'onDuty')}
          </Text>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: Sizes.fixPadding * 2.0,
            }}
          >
            <Progress.Circle
              progress={0.65}
              size={width / 2.8}
              unfilledColor={Colors.lightGrayColor}
              borderWidth={0.0}
              color={Colors.primaryColor}
              thickness={8}
            />
            <Text
              style={{
                width: 80.0,
                height: 45.0,
                position: "absolute",
                textAlign: "center",
                ...Fonts.blackColor36SemiBold,
              }}
            >
              {"11 H"}
            </Text>
          </View>
          <Text
            style={{
              textAlign: "center",
              marginTop: Sizes.fixPadding,
              marginBottom: Sizes.fixPadding * 2.0,
              ...Fonts.primaryColor24SemiBold,
            }}
          >
            {"03:43"}
          </Text>
          <View
            style={{
              borderBottomColor: "black",
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
        </View>
      );
    }
  
    function onCicloInfo() {
      return (
        <View>
          <Text
            style={{
              marginHorizontal: Sizes.fixPadding * 2.0,
              marginTop: Sizes.fixPadding * 2.0,
              ...Fonts.blackColor16SemiBold,
            }}
          >
            {languageModule.lang(language, 'Sleeper')}
          </Text>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: Sizes.fixPadding * 2.0,
            }}
          >
            <Progress.Circle
              progress={0.65}
              size={width / 2.8}
              unfilledColor={Colors.lightGrayColor}
              borderWidth={0.0}
              color={Colors.primaryColor}
              thickness={8}
            />
            <Text
              style={{
                width: 80.0,
                height: 45.0,
                position: "absolute",
                textAlign: "center",
                ...Fonts.blackColor36SemiBold,
              }}
            >
              {"11 H"}
            </Text>
          </View>
          <Text
            style={{
              textAlign: "center",
              marginTop: Sizes.fixPadding,
              marginBottom: Sizes.fixPadding * 2.0,
              ...Fonts.primaryColor24SemiBold,
            }}
          >
            {"03:43"}
          </Text>
        </View>
      );
    }
  
    function statusDialog() {
      return (
        <Overlay
          isVisible={false}
        //   onBackdropPress={() => setShowStatusDialog(false)}
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
              {"estas seguro que quieres cambiar tu estado a"}
            </Text>
            <Text
              style={{
                textAlign: "center",
                marginTop: Sizes.fixPadding + 5.0,
                ...Fonts.blackColor16Medium,
              }}
            >
              {"tempDriverStatus"}
            </Text>
            <TouchableOpacity
              activeOpacity={0.99}
            //   onPress={async () => {
            //     dispatch(
            //       setDriverStatus(
            //         eldData,
            //         currentDriver,
            //         tempDriverStatus,
            //         acumulatedVehicleKilometers,
            //         driverStatus,
            //         2
            //       )
            //     );
            //     setShowStatusDialog(false);
            //   }}
              style={styles.buttonStyle}
            >
              <Text style={{ ...Fonts.whiteColor16Bold }}>{"aceptar"}</Text>
            </TouchableOpacity>
            <Text
            //   onPress={() => setShowStatusDialog(false)}
              style={{ textAlign: "center", ...Fonts.grayColor16SemiBold }}
            >
              {"cancelar"}
            </Text>
          </View>
        </Overlay>
      );
    }
  
    function anotationDialog() {
      return (
        <Overlay
          isVisible={false}
        //   onBackdropPress={() => setAnnotationDialog(false)}
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
              {"comentario"}
            </Text>
            <Text
              style={{
                textAlign: "center",
                marginTop: Sizes.fixPadding + 5.0,
                ...Fonts.blackColor16Medium,
              }}
            >
              {"escríbe un comentario para este cambio de estado"}
            </Text>
            <TextInput
            //   value={currentAnnotation}
            //   onChangeText={(text) => setCurrentAnnotarion(text)}
              style={styles.textFieldStyle}
              activeUnderlineColor={Colors.primaryColor}
              underlineColor={Colors.grayColor}
            />
            <TouchableOpacity
              activeOpacity={0.99}
            //   onPress={async () => {
            //     dispatch(
            //       setDriverStatus(
            //         eldData,
            //         currentDriver,
            //         tempDriverStatus,
            //         acumulatedVehicleKilometers,
            //         driverStatus,
            //         2,
            //         currentAnnotation
            //       )
            //     );
            //     setAnnotationDialog(false);
            //   }}
            //   style={styles.buttonStyle}
            >
              <Text style={{ ...Fonts.whiteColor16Bold }}>{"Aceptar"}</Text>
            </TouchableOpacity>
            <Text
            //   onPress={() => setAnnotationDialog(false)}
              style={{ textAlign: "center", ...Fonts.grayColor16SemiBold }}
            >
              {"cancelar"}
            </Text>
          </View>
        </Overlay>
      );
    }
  
    function observacionesDialog() {
      const observaciones = [
        "Pre-TI",
        "Post-TI",
        "Loading",
        "Unloading",
        "Hooking",
        "Dropping",
        "Repairing",
        "DOT Inspection",
        "Other",
      ];
  
      const Checkbox = ({ label }) => {
        return (
          <TouchableOpacity
            activeOpacity={0.99}
            style={{
              flexDirection: isRtl ? "row-reverse" : "row",
            }}
            onPress={() => {
              seleccionarObservacion(label);
            }}
          >
            <View
              style={{
                ...styles.radioButtonStyle,
                borderColor: Colors.grayColor,
              }}
            >
              <MaterialCommunityIcons
                name="check"
                size={16}
                color={
                  selectedObservaciones.indexOf(label) > -1
                    ? Colors.blackColor
                    : Colors.whiteColor
                }
              />
            </View>
            <Text
              style={{
                marginLeft: isRtl ? 0.0 : Sizes.fixPadding,
                marginRight: isRtl ? Sizes.fixPadding : 0.0,
                ...Fonts.blackColor16Medium,
              }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      };
  
      function observacionOption({ option, last }) {
        return (
          <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
            <TouchableOpacity
              activeOpacity={0.99}
              style={{
                flexDirection: isRtl ? "row-reverse" : "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: isRtl ? "row-reverse" : "row",
                  alignItems: "center",
                }}
              >
                <Checkbox label={option} />
              </View>
            </TouchableOpacity>
  
            {last ? (
              <View>
                <View
                  style={{
                    marginVertical: Sizes.fixPadding * 2.0,
                    backgroundColor: Colors.lightGrayColor,
                    height: 1.0,
                  }}
                />
                <View>
                  <Text style={{ ...Fonts.grayColor14Regular }}>
                    {"otro"}
                  </Text>
                  <TextInput
                    // value={numeroDelCamion}
                    // onChangeText={(text) => updateState({ numeroDelCamion: text })}
                    style={styles.textFieldStyle}
                    activeUnderlineColor={Colors.primaryColor}
                  />
                </View>
              </View>
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
      return (
        <Overlay
          isVisible={false}
        //   onBackdropPress={() => setShowObservacionesDialog(false)}
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
            <Text
              style={{
                textAlign: "center",
                marginBottom: Sizes.fixPadding * 2,
                ...Fonts.blackColor18Bold,
              }}
            >
              {"observaciones"}
            </Text>
            <ScrollView showsVerticalScrollIndicator={false} height={400}>
              {/* {observaciones.map((observacion, i) => {
                return observacionOption({
                  option: observacion,
                  last: i + 1 == observaciones.length ? true : false,
                });
              })} */}
            </ScrollView>
            <TouchableOpacity
              activeOpacity={0.99}
            //   onPress={() => {
            //     navigation.push("Inspeccion");
            //     setShowObservacionesDialog(false);
            //   }}
              style={styles.buttonStyle}
            >
              <Text style={{ ...Fonts.whiteColor16Bold }}>{"aceptar"}</Text>
            </TouchableOpacity>
            <Text
            //   onPress={() => setShowObservacionesDialog(false)}
              style={{ textAlign: "center", ...Fonts.grayColor16SemiBold }}
            >
              {"cancelar"}
            </Text>
          </View>
        </Overlay>
      );
    }
  
    function stopDialog() {
      return (
        <Overlay
          isVisible={false}
        //   onBackdropPress={() => setShowStopDialog(false)}
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
              {"Advertencia"}
            </Text>
            <Text
              style={{
                textAlign: "center",
                marginTop: Sizes.fixPadding + 5.0,
                ...Fonts.blackColor16Medium,
              }}
            >
              {"se ha detectado que el vehículo se encuentra detenido"}
            </Text>
            {/* <Text
              style={{
                textAlign: "center",
                marginTop: Sizes.fixPadding + 5.0,
                ...Fonts.blackColor16Medium,
              }}
            >
              {driverStatus}
            </Text> */}
            <TouchableOpacity
              activeOpacity={0.99}
            //   onPress={async () => {
            //     setShowStopDialog(false);
            //     await changeDriverStatus("ON", false);
            //   }}
              style={styles.buttonStyle}
            >
              <Text style={{ ...Fonts.whiteColor16Bold }}>
                {"cambiar a on-duty"}
              </Text>
            </TouchableOpacity>
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
              {"Exempt Driver"}
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
        <ScrollView
          backgroundColor={Colors.whiteColor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 2.0 }}
        >
          {userData()}
          {geoLocation()}
          <View
            style={{
              marginLeft: Sizes.fixPadding * 2.5,
              marginBottom: Sizes.fixPadding,
              alignSelf: "flex-start",
            }}
          >
            <Text style={{ ...Fonts.blackColor16Regular }}>
              {languageModule.lang(language, 'Selectanupdate')}
              {":"}
            </Text>
          </View>
          {/* {"E"} */}
          {driverOptions()}
          {posibleViolacion()}
          {manejandoInfo()}
          {onTurnoInfo()}
          {onCicloInfo()}
        </ScrollView>
        {statusDialog()}
        {observacionesDialog()}
        {anotationDialog()}
        {stopDialog()}
      </View>
    </SafeAreaView>
    );

  };

    
  
  export default PrincipalScreen;
  
  const styles = StyleSheet.create({
    radioButtonStyle: {
      width: 18.0,
      height: 18.0,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1.0,
    },
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    checkboxContainer: {
      flexDirection: "row",
      marginBottom: 20,
    },
    checkbox: {
      alignSelf: "center",
    },
    label: {
      margin: 8,
    },
    textFieldStyle: {
      ...Fonts.blackColor14Medium,
      paddingHorizontal: Sizes.fixPadding,
    },
    continueBtn: {
      wrap: {
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginTop: Sizes.fixPadding,
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
      },
      btnStyle: {
        marginLeft: Sizes.fixPadding,
      },
      btnStyleBig: {
        marginLeft: Sizes.fixPadding,
        height: Sizes.fixPadding * 10,
      },
      touchableOpacityRound: {
        alignItems: "center",
        justifyContent: "center",
      },
      btnStyleRound: {
        position: "absolute",
        top: Sizes.fixPadding - 220,
        right: Sizes.fixPadding * 10,
        padding: Sizes.fixPadding + 5.0,
        borderRadius: 100,
        borderWidth: 8.0,
      },
      btnActive: {
        backgroundColor: Colors.primaryColor,
        borderColor: Colors.whiteColor,
      },
      btnDeactivated: {
        backgroundColor: Colors.grayColor,
        borderColor: Colors.whiteColor,
      },
      btnSelected: {
        borderColor: Colors.whiteColor,
        backgroundColor: Colors.yellowColor,
      },
    },
    headerWrapStyle: {
      marginVertical: Sizes.fixPadding + 5.0,
      marginHorizontal: Sizes.fixPadding * 2.0,
      alignItems: "center",
      justifyContent: "space-between",
    },
    newNotificationBellStyle: {
      position: "absolute",
      width: 8.0,
      height: 8.0,
      borderRadius: 4.0,
      backgroundColor: Colors.redColor,
      right: 2.5,
      top: 5.0,
      borderColor: Colors.whiteColor,
      borderWidth: 1.0,
    },
    joinNowButtonStyle: {
      backgroundColor: Colors.blackColor,
      borderRadius: Sizes.fixPadding,
      paddingVertical: Sizes.fixPadding - 5.0,
      paddingHorizontal: Sizes.fixPadding + 2.0,
      marginTop: Sizes.fixPadding * 2.0,
      marginBottom: Sizes.fixPadding - 5.0,
    },
    todayInfoWrapStyle: {
      backgroundColor: Colors.whiteColor,
      elevation: 2.0,
      alignItems: "center",
      borderRadius: Sizes.fixPadding - 7.0,
    },
    sessionStartTimeWrapStyle: {
      marginTop: Sizes.fixPadding - 7.0,
      borderColor: { success: Colors.primaryColor, error: Colors.redColor },
      borderWidth: 1.0,
      borderRadius: Sizes.fixPadding,
      paddingHorizontal: Sizes.fixPadding + 5.0,
      paddingVertical: Sizes.fixPadding - 8.0,
    },
    mealsCategoryWrapStyle: {
      alignItems: "center",
      backgroundColor: Colors.whiteColor,
      elevation: 2.0,
      position: "absolute",
      bottom: -30.0,
      paddingHorizontal: Sizes.fixPadding * 2.0,
      paddingVertical: Sizes.fixPadding + 5.0,
      borderRadius: Sizes.fixPadding - 2.0,
    },
    foodImageStyle: {
      width: width / 1.5,
      height: width / 2.5,
      resizeMode: "stretch",
      borderRadius: Sizes.fixPadding - 2.0,
    },
    trainerInfoWrapStyle: {
      marginRight: Sizes.fixPadding * 2.0,
      width: width / 2.5,
      elevation: 2.0,
      borderRadius: Sizes.fixPadding - 2.0,
      backgroundColor: Colors.whiteColor,
    },
    currencyWrapStyle: {
      margin: Sizes.fixPadding - 3.0,
      alignSelf: "flex-end",
      backgroundColor: Colors.primaryColor,
      width: 18.0,
      height: 18.0,
      borderRadius: 9.0,
      alignItems: "center",
      justifyContent: "center",
    },
    trainerDetailWrapStyle: {
      paddingVertical: Sizes.fixPadding - 5.0,
      paddingHorizontal: Sizes.fixPadding,
      justifyContent: "space-between",
    },
    workoutThumbImageStyle: {
      width: width / 1.7,
      height: width / 2.8,
      alignItems: "center",
      justifyContent: "center",
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
  