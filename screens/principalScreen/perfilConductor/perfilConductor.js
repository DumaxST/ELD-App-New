import React, { useState, useEffect } from 'react';
import {View,Text,TextInput,TouchableOpacity,ScrollView,SafeAreaView,StyleSheet,Dimensions,StatusBar,} from 'react-native';
import { Colors, Fonts, Sizes } from '../../../constants/styles';
import { useDispatch, useSelector } from "react-redux";
import { getCurrentDriver, currentCMV } from "../../../config/localStorage";
import { startVehicleMeters } from "../../../redux/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get('window');
const languageModule = require('../../../global_functions/variables');

const PerfilDelChofer = ({ navigation }) => {
  const dispatch = useDispatch();
  //Declaracion de variables
  const [language, setlanguage] = useState("");
  const [currentChofer, setCurrentChofer] = useState({});

  //Uso de efectos de inicio del screen
  //Aqui obtenemos el idioma seleccionado desde la primera pantalla
  useEffect(() => {
    const getPreferredLanguage = async () => {
       try {
         setlanguage(await AsyncStorage.getItem("preferredLanguage"));
         console.log(language);
       } catch (error) {
         console.log(error);
       }
    };
    getPreferredLanguage();
  }, []);

  useEffect(async () => {
    await getCurrentDriver().then((driver) => {
      setCurrentChofer(driver);
    });
  }, []);


  //funcines de la pantalla
  const updateProfile = async () => {
//   return await AsyncStorage.setItem("currentCMV", JSON.stringify(state)).then(
//     async () => {
//       dispatch(startVehicleMeters());
//       navigation.push("PrincipalScreen");
//     }
//   );
  };

 //funciones de renderizado 

  const nameInput = () => {
    return(
    <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>{languageModule.lang(language, 'Name')}</Text>
          <TextInput
            style={styles.input}
            value={currentChofer?.firstName}
            onChangeText={(text) =>
                setCurrentChofer({ ...currentChofer, firstName: text })
            }
          />
        </View>)
  }

  const idInput = () => {
    return(
    <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>{"Id"}</Text>
          <TextInput
            style={styles.input}
            value={currentChofer?.id}
            onChangeText={(text) =>
              setCurrentChofer({ ...currentChofer, id: text })
          }
          />
        </View>)
  }

  const empresaInput = () => {
    return(
    <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>{languageModule.lang(language,'companyName')}</Text>
          <TextInput
            style={styles.input}
            value={currentChofer?.carrier?.name}
            onChangeText={(text) =>
              setCurrentChofer({ ...currentChofer?.carrier, name: text })
            }
          />
        </View>)
  }

  const usoHorarioEmpresaInput= () => {
    return(
    <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>{languageModule.lang(language,'companySchedule')}</Text>
          <TextInput
            style={styles.input}
            value={currentChofer?.email}
            onChangeText={(text) =>
                setCurrentChofer({ ...currentChofer, email: text })
              }
          />
        </View>)
  }

  const estadoDeEmisionDeLaLicenciaInput = () => {
    return(
    <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>{languageModule.lang(language,'LicenseIssuanceStatus')}</Text>
          <TextInput
            style={styles.input}
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
          />
        </View>)
  }
 
  const numeroDeLaLicenciaInput = () => {
    return(
    <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>{languageModule.lang(language,'licenseNumber')}</Text>
          <TextInput
            style={styles.input}
            value={currentChofer?.driverLicense?.licenseID}
            onChangeText={(text) =>
            setCurrentChofer({
              ...currentChofer,
                ...currentChofer.driverLicense,
                licenseID: text,
            })
          }
          />
        </View>)
  }

  const modoDeOperacionInput = () => {
    return(
    <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>{languageModule.lang(language,'operationMode')}</Text>
          <TextInput
            style={styles.input}
            value={"fitnessGoal"}
          onChangeText={(text) => updateState({ fitnessGoal: text })}
          />
        </View>)
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <Text style={styles.title}>{languageModule.lang(language,'driverProfile')}</Text>
      <View style={styles.formContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
                {nameInput()}
                {idInput()}
                {empresaInput()}
                {usoHorarioEmpresaInput()}
                {estadoDeEmisionDeLaLicenciaInput()}
                {numeroDeLaLicenciaInput()}
                {modoDeOperacionInput()}
        </ScrollView>
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={updateProfile}>
        <Text style={styles.submitButtonText}>{languageModule.lang(language, 'save')}</Text>
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

export default PerfilDelChofer;

