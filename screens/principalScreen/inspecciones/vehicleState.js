import React, { useState, useEffect } from 'react';
import {View,Text,TextInput,Image,TouchableOpacity,ScrollView,SafeAreaView,StyleSheet,Dimensions,StatusBar,} from 'react-native';
import { Colors, Fonts, Sizes } from '../../../constants/styles';
import { useDispatch, useSelector } from "react-redux";
import SelectDropdown from 'react-native-select-dropdown';
import { getCurrentDriver, currentCMV } from "../../../config/localStorage";
import { startVehicleMeters } from "../../../redux/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width } = Dimensions.get('window');
import { Button, Checkbox } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
const languageModule = require('../../../global_functions/variables');
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

const VehicleState = ({ navigation }) => {

    //Declaracion de variables
    const [language, setlanguage] = useState("");
    const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
    const [vehiculos, setVehiculos] = useState([
        { id: 1, 
          nombre: 'Vehículo 1',
          numero: 29, 
          VIN: "1293FKA102183",
          licensePlate: "123-ABC",
          registeredState: "TX",
          imagen: require('../../../assets/images/trucks/truck3.png') },
      ]);

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

    //funciones de la pantalla


    //funciones de renderizado
    const header = () => {
         return(
             <View>
             <Text style={styles.title}>{languageModule.lang(language, 'vehicleState')}</Text>
             </View>
         );
    }

    const vehicleImage = () => {
        return (
          <View style={{...styles.card, marginBottom: 370, marginTop: 10}}>
            <Image
              source={require('../../../assets/images/trucks/inspection_trucks.png')}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        );
    }

    const typesOfDefects = () => {
        return (
            <View style={{...styles.card, marginTop: -355, height: 90}}>
              <View style={styles.checkboxContainer}>
                <Checkbox.Android color="#4CAF50" status="checked" />
                <Text style={styles.checkboxText}>{languageModule.lang(language, 'repairMade')}</Text>
                <Checkbox.Android color="yellow" status="checked" />
                <Text style={styles.checkboxText}>{languageModule.lang(language, 'repairNotneeded')}</Text>
              </View>
              <View style={styles.checkboxContainer}>
                <Checkbox.Android color="#cc0b0a" status="checked" />
                <Text style={styles.checkboxText}>{languageModule.lang(language, 'repairNeeded')}</Text>
                <Checkbox.Android/>
                <Text style={styles.checkboxText}>{languageModule.lang(language, 'notSelected')}</Text>
              </View>
            </View>
        );
    };

    const listTypesOfDefects = () => {
        return (
            <View style={{...styles.container, marginTop: 10}}>
                  <ScrollView style={styles.scrollView}>               
                    <Text style={{...styles.title, fontSize:15}}>C-TPAT 17:</Text>
                    <View style={styles.checkboxContainer}>
                      <Checkbox.Android color="red" status="unchecked" />
                      <Text style={{...styles.checkboxText}}>{languageModule.lang(language, 'airTanks')}</Text>
                      <Checkbox.Android color="blue" status="unchecked" />
                      <Text style={styles.checkboxText}>{languageModule.lang(language, 'bumper')}</Text>
                    </View>
                    <View style={styles.checkboxContainer}>
                      <Checkbox.Android color="green" status="unchecked" />
                      <Text style={styles.checkboxText}>{languageModule.lang(language, 'cab')}</Text>
                      <Checkbox.Android color="orange" status="unchecked" />
                      <Text style={styles.checkboxText}>{languageModule.lang(language, 'driverShafts')}</Text>
                    </View>
                    <View style={styles.checkboxContainer}>
                      <Checkbox.Android color="red" status="unchecked" />
                      <Text style={{...styles.checkboxText}}>{languageModule.lang(language, 'engine')}</Text>
                      <Checkbox.Android color="blue" status="unchecked" />
                      <Text style={styles.checkboxText}>{languageModule.lang(language, 'exhaust')}</Text>
                    </View>
                    <View style={styles.checkboxContainer}>
                      <Checkbox.Android color="green" status="unchecked" />
                      <Text style={styles.checkboxText}>{languageModule.lang(language, 'floor')}</Text>
                      <Checkbox.Android color="orange" status="unchecked" />
                      <Text style={styles.checkboxText}>{languageModule.lang(language, 'fuelTanks')}</Text>
                    </View>
                    <Text style={{...styles.title, fontSize:15}}>{languageModule.lang(language, 'other')}s:</Text>
                    <View style={styles.checkboxContainer}>
                        <Checkbox.Android color="red" status="unchecked" />
                        <Text style={{...styles.checkboxText}}>{languageModule.lang(language, 'airCompressor')}</Text>
                        <Checkbox.Android color="blue" status="unchecked" />
                        <Text style={styles.checkboxText}>{languageModule.lang(language, 'airLines')}</Text>
                    </View>
                    <View style={styles.checkboxContainer}>
                        <Checkbox.Android color="red" status="unchecked" />
                        <Text style={{...styles.checkboxText}}>{languageModule.lang(language, 'battery')}</Text>
                        <Checkbox.Android color="blue" status="unchecked" />
                        <Text style={styles.checkboxText}>{languageModule.lang(language, 'beltAndHoses')}</Text>
                    </View>
                    <View style={styles.checkboxContainer}>
                        <Checkbox.Android color="red" status="unchecked" />
                        <Text style={{...styles.checkboxText}}>{languageModule.lang(language, 'brakeAccessories')}</Text>
                        <Checkbox.Android color="blue" status="unchecked" />
                        <Text style={styles.checkboxText}>{languageModule.lang(language, 'body')}</Text>
                    </View>
                    <View style={styles.checkboxContainer}>
                        <Checkbox.Android color="red" status="unchecked" />
                        <Text style={{...styles.checkboxText}}>{languageModule.lang(language, 'brakesParking')}</Text>
                        <Checkbox.Android color="blue" status="unchecked" />
                        <Text style={styles.checkboxText}>{languageModule.lang(language, 'brakesService')}</Text>
                    </View>
                    <View style={styles.checkboxContainer}>
                        <Checkbox.Android color="red" status="unchecked" />
                        <Text style={{...styles.checkboxText}}>Clutch</Text>
                        <Checkbox.Android color="blue" status="unchecked" />
                        <Text style={styles.checkboxText}>{languageModule.lang(language, 'couplingDevices')}</Text>
                    </View>
                    <View style={styles.checkboxContainer}>
                        <Checkbox.Android color="red" status="unchecked" />
                        <Text style={{...styles.checkboxText}}>{languageModule.lang(language, 'defrosterHeater')}</Text>
                        <Checkbox.Android color="blue" status="unchecked" />
                        <Text style={styles.checkboxText}>{languageModule.lang(language, 'driveLine')}</Text>
                    </View>
                    <View style={styles.checkboxContainer}>
                        <Checkbox.Android color="red" status="unchecked" />
                        <Text style={{...styles.checkboxText}}>{languageModule.lang(language, 'fifthWheel')}</Text>
                        <Checkbox.Android color="blue" status="unchecked" />
                        <Text style={styles.checkboxText}>{languageModule.lang(language, 'fluidLevels')}</Text>
                    </View>
                    <View style={styles.checkboxContainer}>
                        <Checkbox.Android color="red" status="unchecked" />
                        <Text style={{...styles.checkboxText}}>{languageModule.lang(language, 'frameAndAssembly')}</Text>
                        <Checkbox.Android color="blue" status="unchecked" />
                        <Text style={styles.checkboxText}>{languageModule.lang(language, 'frontAxle')}</Text>
                    </View>
                    <View style={styles.checkboxContainer}>
                        <Checkbox.Android color="red" status="unchecked" />
                        <Text style={{...styles.checkboxText}}>{languageModule.lang(language, 'horn')}</Text>
                        <Checkbox.Android color="blue" status="unchecked" />
                        <Text style={styles.checkboxText}>{languageModule.lang(language, 'lights')}</Text>
                    </View>
                    <View style={styles.checkboxContainer}>
                        <Checkbox.Android color="red" status="unchecked" />
                        <Text style={{...styles.checkboxText}}>{languageModule.lang(language, 'mirrors')}</Text>
                        <Checkbox.Android color="blue" status="unchecked" />
                        <Text style={styles.checkboxText}>{languageModule.lang(language, 'muffler')}</Text>
                    </View>
                    <View style={styles.checkboxContainer}>
                        <Checkbox.Android color="red" status="unchecked" />
                        <Text style={{...styles.checkboxText}}>{languageModule.lang(language, 'oilPressure')}</Text>
                        <Checkbox.Android color="blue" status="unchecked" />
                        <Text style={styles.checkboxText}>{languageModule.lang(language, 'radiator')}</Text>
                    </View>
                    <View style={styles.checkboxContainer}>
                        <Checkbox.Android color="red" status="unchecked" />
                        <Text style={{...styles.checkboxText}}>{languageModule.lang(language, 'rearEnd')}</Text>
                        <Checkbox.Android color="blue" status="unchecked" />
                        <Text style={styles.checkboxText}>{languageModule.lang(language, 'Reflectors')}</Text>
                    </View>
                    <View style={styles.checkboxContainer}>
                        <Checkbox.Android color="red" status="unchecked" />
                        <Text style={{...styles.checkboxText}}>{languageModule.lang(language, 'safetyEquipment')}</Text>
                        <Checkbox.Android color="blue" status="unchecked" />
                        <Text style={styles.checkboxText}>{languageModule.lang(language, 'stearing')}</Text>
                    </View>
                    <View style={styles.checkboxContainer}>
                        <Checkbox.Android color="red" status="unchecked" />
                        <Text style={{...styles.checkboxText}}>{languageModule.lang(language, 'starter')}</Text>
                        <Checkbox.Android color="blue" status="unchecked" />
                        <Text style={styles.checkboxText}>{languageModule.lang(language, 'suspentionSystem')}</Text>
                    </View>
                    <View style={styles.checkboxContainer}>
                        <Checkbox.Android color="red" status="unchecked" />
                        <Text style={{...styles.checkboxText}}>{languageModule.lang(language, 'tireChains')}</Text>
                        <Checkbox.Android color="blue" status="unchecked" />
                        <Text style={styles.checkboxText}>{languageModule.lang(language, 'transmission')}</Text>
                    </View>
                    <View style={styles.checkboxContainer}>
                        <Checkbox.Android color="red" status="unchecked" />
                        <Text style={{...styles.checkboxText}}>{languageModule.lang(language, 'tripRecorder')}</Text>
                        <Checkbox.Android color="blue" status="unchecked" />
                        <Text style={styles.checkboxText}>{languageModule.lang(language, 'wheelsAndRims')}</Text>
                    </View>
                    <View style={styles.checkboxContainer}>
                        <Checkbox.Android color="red" status="unchecked" />
                        <Text style={{...styles.checkboxText}}>{languageModule.lang(language, 'windshieldWipers')}</Text>
                        <Checkbox.Android color="blue" status="unchecked" />
                        <Text style={styles.checkboxText}>{languageModule.lang(language, 'windows')}</Text>
                    </View>
                    <View style={styles.checkboxContainer}>
                        <Checkbox.Android color="red" status="unchecked" />
                        <Text style={{...styles.checkboxText}}>{languageModule.lang(language, 'otherDefects')}</Text>
                    </View>
                  </ScrollView>
            </View>
        );
    }

    const footer = () => {
        return(
            <View>
            {/* Botones */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20}}>
              <Button icon={() => <Icon name="keyboard-arrow-left" size={20} />} mode="outlined" style={{ borderColor: '#333', width: '45%' }} onPress={() => {navigation.navigate('Regulaciones')}}>{languageModule.lang(language, 'goBack')}</Button>
              <Button icon={() => <Icon name="keyboard-arrow-right" size={20} />} mode="contained" style={{ backgroundColor: '#0f9d58', width: '45%' }} onPress={() => {navigation.navigate('VehicleState')}}>{languageModule.lang(language, 'continue')}</Button>
            </View>
            </View>
        );
    }

    //pantalla a retornar
    return(
        <View style={styles.container}>
            {header()}          
            <Text style={{ fontSize: 12, marginBottom: 7, fontWeight: 'bold' }}>{languageModule.lang(language, 'inspectorAdvice')}: </Text>
            {vehicleImage()}
            {typesOfDefects()}
            {listTypesOfDefects()}
            {footer()}
        </View>
    )

}

const styles = StyleSheet.create({
      checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      },
      checkboxText: {
        fontSize: 12,
        marginLeft: -5,
      },
    card: {
        borderRadius: 10,
        height: 150,
        backgroundColor: '#ffffff',
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, // Solo para Android
      },
      image: {
        width: '100%',
        height: 150, // Ajusta el tamaño de la imagen según tus necesidades
        borderRadius: 10,
      },
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingTop: 30,
      paddingHorizontal: 20,
    },
    title: {
      top: -15,
      fontSize: 23,
      fontWeight: 'bold',
      color: '#4CAF50',
      marginBottom: 20,
    },
    vehiculoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: '#eee', // Color de fondo gris claro
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 5,
        marginVertical: -10,
      },
      vehiculoImagen: {
        width: 50,
        height: 50,
        borderRadius: 25,
      },
      infoTarjeta: {
        marginTop: 20,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#fff', // Fondo blanco
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 5,
        alignItems: 'center',
      },
      infoTarjetaImagen: {
        width: 100,
        height: 100,
        marginBottom: 10,
      },
      editButton: {
        backgroundColor: '#3498db', // Color azul brillante
        padding: 5,
        borderRadius: 5,
        marginTop: 10,
      },
      editButtonText: {
        color: '#fff', // Texto blanco
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
        color: '#000',
        marginBottom: Sizes.fixPadding,
      },
      input: {
        borderWidth: 1,
        borderColor: '#000',
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
})


export default VehicleState;