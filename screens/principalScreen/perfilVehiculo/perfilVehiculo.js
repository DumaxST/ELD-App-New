import React, { useState, useEffect } from 'react';
import {View,Text,TextInput,TouchableOpacity,SafeAreaView,StyleSheet,Dimensions,StatusBar,} from 'react-native';
import { Colors, Fonts, Sizes } from '../../../constants/styles';
import { useDispatch, useSelector } from "react-redux";
import { getCurrentDriver, currentCMV } from "../../../config/localStorage";
import { startVehicleMeters } from "../../../redux/actions";

const { width } = Dimensions.get('window');
const languageModule = require('../../../global_functions/variables');

const PerfilVehiculo = ({ navigation }) => {
    
  //Declaracion de variables
  const [language, setlanguage] = useState("");
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
  
  const { acumulatedVehicleKilometers } = useSelector(
    (state) => state.eldReducer
  );


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

  //Aqui obtenemos la data del api 
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

  //funcines de la pantalla
  const updateCMVProfile = async () => {
  return await AsyncStorage.setItem("currentCMV", JSON.stringify(state)).then(
    async () => {
      dispatch(startVehicleMeters());
      navigation.push("NavigationsTab");
    }
  );
  };

 //funciones de renderizado 

  const truckNumberInput = () => {
    return(
    <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>{languageModule.lang(language, 'truckNumber')}</Text>
          <TextInput
            style={styles.input}
            value={numeroDelCamion}
             onChangeText={(text) => updateState({ numeroDelCamion: text })}
          />
        </View>)
  }

  const truckVINInput = () => {
    return(
    <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>{languageModule.lang(language, 'truckVIN')}</Text>
          <TextInput
            style={styles.input}
            value={vinDelCamion}
             onChangeText={(text) => updateState({ vinDelCamion: text })}
          />
        </View>)
  }

  const truckTrailerInput = () => {
    return(
    <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>{languageModule.lang(language, 'trailerNumber')}</Text>
          <TextInput
            style={styles.input}
            value={numeroDelTrailer}
             onChangeText={(text) => updateState({ numeroDelTrailer: text })}
          />
        </View>)
  }

  const truckShippingDocumentInput = () => {
    return(
    <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>{languageModule.lang(language, 'shippingDocumentNumber')}</Text>
          <TextInput
            style={styles.input}
            value={numeroDeDocumentoDeEnvio}
             onChangeText={(text) => updateState({ numeroDeDocumentoDeEnvio: text })}
          />
        </View>)
  }

  const odometroVisualInput = () => {
    return(
    <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>{languageModule.lang(language, 'visualOdometer')}</Text>
          <TextInput
            style={styles.input}
            value={odometroVisual}
             onChangeText={(text) => updateState({ odometroVisual: text })}
          />
        </View>)
  }
 

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <Text style={styles.title}>{languageModule.lang(language, 'vehicleProfile')}</Text>
      <View style={styles.formContainer}>
       {truckNumberInput()}
        {truckVINInput()}
        {truckTrailerInput()}
        {truckShippingDocumentInput()}
        {odometroVisualInput()}
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={updateCMVProfile}>
        <Text style={styles.submitButtonText}>{languageModule.lang(language, 'submit')}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: Sizes.fixPadding * 2,
    paddingTop: Sizes.fixPadding * 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primaryColor,
    marginBottom: Sizes.fixPadding * 2,
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: Sizes.fixPadding * 2,
  },
  inputLabel: {
    fontSize: 16,
    color: Colors.primaryColor,
    marginBottom: Sizes.fixPadding,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding * 1.5,
    fontSize: 16,
  },
  submitButton: {
    top: -39,
    backgroundColor: Colors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding * 1.5,
    marginTop: Sizes.fixPadding * 2,
  },
  submitButtonText: {
    color: Colors.whiteColor,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PerfilVehiculo;

