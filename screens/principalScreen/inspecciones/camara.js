import React, { useState, useEffect, useRef } from 'react';
import { Alert,View,ActivityIndicator, Text, Image,FlatList, ScrollView,  TouchableOpacity, SafeAreaView, StyleSheet, Dimensions,StatusBar,MaterialIcons} from 'react-native';
import {CameraProps,CameraRuntimeError,PhotoFile,useCameraDevice,useCameraFormat,useFrameProcessor,VideoFile,} from 'react-native-vision-camera'
import { Camera } from 'react-native-vision-camera'
import { useAppState } from '@react-native-community/hooks'
import { useIsFocused } from '@react-navigation/native';
import { checkAndRequestCameraPermission } from './constructor';
import { Button, Checkbox } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
const languageModule = require('../../../global_functions/variables');
import AsyncStorage from "@react-native-async-storage/async-storage";

const Camara = (props) => {

  //Declaración de variables
  const { navigation } = props;
  const device = useCameraDevice('back')
  const [language, setlanguage] = useState('');
  const isFocused = useIsFocused()
  const appState = useAppState()
  const isActive = isFocused && appState === "active"
  const [isCapturing, setIsCapturing] = useState(false);
  const camera = useRef(null);

  //uso de efectos de la pantalla

  //pedimos permisos de camara
  useEffect(() => {
    const requestPermissions = async () => {
      let granted = await checkAndRequestCameraPermission();
      while (!granted) {
        granted = await checkAndRequestCameraPermission();
      }

      if (granted) {
        console.log('Los permisos se concedieron');
        // Realizar acciones cuando se concedan los permisos
      } else {
        console.log('Los permisos no se concedieron');
        // Manejar el caso en el que los permisos no se concedan
      }
    };

    requestPermissions();
  }, []);

  //obtenemos el idioma seleccionado
  useEffect(() => {
    const getPreferredLanguage = async () => {
      try {
        setlanguage(await AsyncStorage.getItem("preferredLanguage"));
        console.log("Idioma seleccionado: " + language);
      } catch (error) {
        console.log(error);
      }
    };
    getPreferredLanguage();
  }, []);

  //funciones de la pantalla

  const toggleCapture = async () => {
    if (!isCapturing) {
      setIsCapturing(true);
      try {

      const file = await camera.current.takePhoto()
      const result = await fetch(`file://${file.path}`)
      const data = await result.blob();
      console.log(data);
      navigation.navigate('Observaciones');
      } catch (error) {
        console.error('Error capturing photo:', error);
      } finally {
        setIsCapturing(false);
      }
    }
  };

  //funciones de renderizado

  const header = () => {
    return (
      <View>
        <Text style={styles.title}>{languageModule.lang(language, 'takeAphotoOfYourEvidence')}</Text>
      </View>
    );
  };

  const body = () => {
    return (
        <Camera
        ref={camera}
        {...props} isActive={isActive}
        style={{...StyleSheet.absoluteFill, width: 370, height: 480, marginTop: 160}}
        device={device}
        photo={true}
        />
    );
  }

  const footer = () => {
    return (
            <View>
            <TouchableOpacity style={styles.button} onPress={toggleCapture}>
            </TouchableOpacity>
            {/* Botones */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 100}}>
              <Button icon={() => <Icon name="keyboard-arrow-left" size={20} />} mode="outlined" style={{ borderColor: '#333', width: '45%' }} onPress={() => {navigation.navigate('Observaciones')}}>{languageModule.lang(language, 'goBack')}</Button>
              <Button icon={() => <Icon name="keyboard-arrow-right" size={20} />} mode="contained" style={{ backgroundColor: '#0f9d58', width: '45%' }} >{languageModule.lang(language, 'skip')}</Button>
            </View>
            </View>
    );
  };

  if (device == null) return <NoCameraDeviceError />
  return (
    <View style={styles.container}>
      {header()}
      {body()}
      {footer()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  title: {
    top: -15,
    fontSize: 23,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginLeft: 125,
    marginTop: 400,
  },
})

export default Camara;
