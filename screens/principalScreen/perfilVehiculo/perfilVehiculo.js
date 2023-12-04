import {StyleSheet,Text,View,SafeAreaView,StatusBar,ScrollView,TouchableOpacity,Dimensions,} from "react-native";
import React, { useEffect, useState } from "react";
import { Fonts, Colors, Sizes } from "../../../constants/styles";
import { TextInput } from "react-native-paper";
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
const languageModule = require('../../../global_functions/variables');

const PerfilDelVehiculo = ({ navigation }) => {

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

//   const { acumulatedVehicleKilometers } = useSelector(
//     (state) => state.eldReducer
//   );
  
  const [state, setState] = useState({
    numeroDelCamion: "",
    numeroDelTrailer: "",
    vinDelCamion: "",
    odometroVisual: "",
  });
  const {
    numeroDelCamion,
    vinDelCamion,
    numeroDelTrailer,
    numeroDeDocumentoDeEnvio,
    odometroVisual,
  } = state;
  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  useEffect(() => {
    const setData = async () => {
      await currentCMV().then(async (currentCMV) => {
        if (currentCMV) {
          currentCMV.odometroVisual = `${Math.round(
            acumulatedVehicleKilometers * 0.621371 + currentCMV.odometroVisual
          )}`;
          return updateState(currentCMV);
        }
        return await getCurrentDriver().then((driver) => {
          updateState({
            id: driver?.cmv?.id ? driver?.cmv?.id : "",
            numeroDelCamion: driver?.cmv?.number ? driver?.cmv?.number : "",
            vinDelCamion: driver?.cmv?.vin ? driver?.cmv?.vin : "",
          });
        });
      });
    };
    setData();
  }, []);

  const updateCMVProfile = async () => {
    return await AsyncStorage.setItem("currentCMV", JSON.stringify(state)).then(
      async () => {
        dispatch(startVehicleMeters());
        navigation.push("NavigationsTab");
      }
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primaryColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        {header()}
        <View style={styles.sheetStyle}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ marginTop: Sizes.fixPadding * 2.0 }}>
              {numeroDelCamionInput()}
              {vinDelCamionInput()}
              {numeroDelTrailerInput()}
              {shippingDocumentNumber()}
              {odometroVisualInput()}
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
          {"    " + languageModule.lang(language,'vehicleProfile')}
        </Text>
      </View>
    );
  }

  function numeroDelCamionInput() {
    return (
      <View style={{ margin: Sizes.fixPadding * 2.0 }}>
        <Text style={{ ...Fonts.grayColor14Regular }}>
          {languageModule.lang(language,'truckNumber')}
        </Text>
        <TextInput
          value={"121231"}
        //   onChangeText={(text) => updateState({ numeroDelCamion: text })}
          style={styles.textFieldStyle}
          activeUnderlineColor={Colors.primaryColor}
          underlineColor={Colors.grayColor}
        />
      </View>
    );
  }

  function vinDelCamionInput() {
    return (
      <View style={{ margin: Sizes.fixPadding * 2.0 }}>
        <Text style={{ ...Fonts.grayColor14Regular }}>
          {languageModule.lang(language,'truckVIN')}
        </Text>
        <TextInput
          value={"KMA91202"}
        //   onChangeText={(text) => updateState({ vinDelCamion: text })}
          style={styles.textFieldStyle}
          activeUnderlineColor={Colors.primaryColor}
          underlineColor={Colors.grayColor}
        />
      </View>
    );
  }

  function numeroDelTrailerInput() {
    return (
      <View style={{ margin: Sizes.fixPadding * 2.0 }}>
        <Text style={{ ...Fonts.grayColor14Regular }}>
          {languageModule.lang(language,'trailerNumber')}
        </Text>
        <TextInput
          value={"742"}
        //   onChangeText={(text) => updateState({ numeroDelTrailer: text })}
          style={styles.textFieldStyle}
          activeUnderlineColor={Colors.primaryColor}
          underlineColor={Colors.grayColor}
        />
      </View>
    );
  }

  function shippingDocumentNumber() {
    return (
      <View style={{ margin: Sizes.fixPadding * 2.0 }}>
        <Text style={{ ...Fonts.grayColor14Regular }}>
          {languageModule.lang(language,'shippingDocumentNumber')}
        </Text>
        <TextInput
          value={"21212123"}
        //   onChangeText={(text) =>
        //     updateState({ numeroDeDocumentoDeEnvio: text })
        //   }
          style={styles.textFieldStyle}
          activeUnderlineColor={Colors.primaryColor}
          underlineColor={Colors.grayColor}
        />
      </View>
    );
  }

  function odometroVisualInput() {
    return (
      <View style={{ margin: Sizes.fixPadding * 2.0 }}>
        {/* {acumulatedVehicleKilometers * 0.621371 > 0 ? ( */}
          <Text style={{ ...Fonts.grayColor14Regular }}>
            {languageModule.lang(language,'accumulatedMiles')}
            {/* {`${tr("millasAcomumuladas")} ${(
              acumulatedVehicleKilometers * 0.621371
            ).toFixed(2)}`} */}
          </Text>
        {/* ) : null} */}

        <Text style={{ ...Fonts.grayColor14Regular }}>
          {languageModule.lang(language,'visualOdometer')}
        </Text>
        <TextInput
          value={""}
        //   onChangeText={(text) => updateState({ odometroVisual: text })}
          style={styles.textFieldStyle}
          activeUnderlineColor={Colors.primaryColor}
          underlineColor={Colors.grayColor}
          keyboardType="numeric"
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
        //   onPress={async () => {
        //     await updateCMVProfile();
        //   }}
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

export default PerfilDelVehiculo;

const styles = StyleSheet.create({
  textFieldWrapStyle: {
    borderColor: Colors.grayColor,
    borderWidth: 1.0,
    borderRadius: Sizes.fixPadding - 2.0,
    padding: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding * 2.0,
  },
  textFieldStyle: {
    ...Fonts.blackColor14Medium,
    elevation: 1.3,
    borderRadius: Sizes.fixPadding - 2.0,
    paddingVertical: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding,
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
