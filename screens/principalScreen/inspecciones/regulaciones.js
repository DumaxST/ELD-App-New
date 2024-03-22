import React, { useState, useEffect } from 'react';
import {View,Text,TextInput,TouchableOpacity,ScrollView,SafeAreaView,StyleSheet,Dimensions,StatusBar,} from 'react-native';
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

const Regulaciones = ({ navigation }) => {

    //Declaracion de variables
    const [language, setlanguage] = useState("");
    const [inspectors, setInspectors] = useState([
        { label: 'Chayanne Ramirez', value: 'Chayanne Ramirez', },
        { label: 'Ricardo Arjona', value: 'Ricardo Arjona', },
    ]);
    const [formTypes, setFormTypes] = useState([
        { label: 'Formulario 1', value: 'Formulario 1', },
        { label: 'Formulario 2', value: 'Formulario 2', },
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
            <Text style={styles.title}>{languageModule.lang(language, 'selectRegulationofVehicleInspection')}</Text>
            </View>
        );
    }

    const bodyScreen = () => {
       return (
        <ScrollView style={{ flex: 1, backgroundColor: '#fff', padding: 20 }}>
        {/* selecciones */}
        {/* Selección de inspector */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}> 
        <Text style={{ fontSize: 12, marginBottom: 7, fontWeight: 'bold' }}>{languageModule.lang(language, 'selectAinspector')} :</Text>
        <SelectDropdown
         buttonTextStyle={{fontSize: 14}}
         buttonStyle={{
         marginBottom: 10,
         marginRight: 15,
         width: '45%',
         height: 35,
         backgroundColor: '#FFF',
         borderRadius: 8,
         borderWidth: 1,
         borderColor: '#ddd'}}
         defaultButtonText={languageModule.lang(language,'selectAinspector')}
         data={inspectors}
         onSelect={(selectedItem, index) => {
           console.log(selectedItem, index);
           // Puedes realizar acciones adicionales al seleccionar un elemento si es necesario
        //    setSelectedCarrier(selectedItem.value); // Asegúrate de tener esta función para actualizar el estado
         }}
         buttonTextAfterSelection={(selectedItem, index) => {
           return selectedItem.label;
         }}
         rowTextForSelection={(item, index) => {
           return item.label;
         }}
         />
        </View>

        
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}> 
         {/* Selección de tipo de formulario */}
         <Text style={{ fontSize: 12, marginBottom: 7, fontWeight: 'bold' }}>{languageModule.lang(language, 'selectAformType')} :</Text>
        <SelectDropdown
         buttonTextStyle={{fontSize: 14}}
         buttonStyle={{
         marginBottom: 10,
         marginRight: 15,
         width: '25%',
         height: 35,
         backgroundColor: '#FFF',
         borderRadius: 8,
         borderWidth: 1,
         borderColor: '#ddd'}}
         defaultButtonText={languageModule.lang(language,'selectAformType')}
         data={formTypes}
         onSelect={(selectedItem, index) => {
           console.log(selectedItem, index);
           // Puedes realizar acciones adicionales al seleccionar un elemento si es necesario
        //    setSelectedCarrier(selectedItem.value); // Asegúrate de tener esta función para actualizar el estado
         }}
         buttonTextAfterSelection={(selectedItem, index) => {
           return selectedItem.label;
         }}
         rowTextForSelection={(item, index) => {
           return item.label;
         }}
         />
        </View>
  
        {/* Lista con textfield y checkboxes */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, marginBottom: 10, fontWeight: 'bold' }}>{languageModule.lang(language, 'selectTemplateForm')}:</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Checkbox.Android />
            <Text>USA</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Checkbox.Android />
            <Text>CANADA-Vehiculo pesado</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Checkbox.Android />
            <Text>CANADA-sin CTPAT</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Checkbox.Android />
            <Text>CANADA-Bus</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Checkbox.Android />
            <Text>CANADA-Motor Coach</Text>
          </View>
        </View>
      </ScrollView>
       )
    }

    const footer = () => {
        return(
            <View>
            {/* Botones */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30}}>
              <Button icon={() => <Icon name="keyboard-arrow-left" size={20} />} mode="outlined" style={{ borderColor: '#333', width: '45%' }} onPress={() => {navigation.navigate('Inspecciones')}}>{languageModule.lang(language, 'goBack')}</Button>
              <Button icon={() => <Icon name="keyboard-arrow-right" size={20} />} mode="contained" style={{ backgroundColor: '#0f9d58', width: '45%' }} onPress={() => {navigation.navigate('VehicleState')}}>{languageModule.lang(language, 'continue')}</Button>
            </View>
            </View>
        );
    }

    //pantalla a retornar
    return(
        <View style={styles.container}>
            {header()}
            {bodyScreen()}
            {footer()}
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingTop: 55,
      paddingHorizontal: 20,
    },
    title: {
      top: -15,
      fontSize: 23,
      fontWeight: 'bold',
      color: '#4CAF50',
      marginBottom: 20,
    },
})

export default Regulaciones;