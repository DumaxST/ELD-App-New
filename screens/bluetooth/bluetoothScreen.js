import React, { useEffect, useState } from 'react';
import { Alert,View, Text, Button, Image,FlatList, ScrollView,  TouchableOpacity, SafeAreaView, StyleSheet, Dimensions,StatusBar,MaterialIcons} from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { checkAndRequestBluetoothScanPermission } from './constructor';
import { Fonts, Colors, Sizes } from "../../constants/styles";
import { Icon } from 'react-native-elements';
import { Overlay } from "react-native-elements";
const { height, width } = Dimensions.get("window");
const languageModule = require('../../global_functions/variables');
import AsyncStorage from '@react-native-async-storage/async-storage'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Ionicons from 'react-native-vector-icons/Ionicons';


const BluetoothScreen = ({ navigation }) => {

  //Declaracion de variables
  const [language, setlanguage] = useState('');
  const manager = new BleManager();
  const [connectingBluetoothDeviceDialog, setConnectingBluetoothDeviceDialog] = useState(false);
  const [showAdvertenciaDialog, setShowAdvertenciaDialog] = useState(false);
  const [searchingDevices, setSearchingForDevices] = useState(false);
  const [devices, setDevices] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null); 

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

  //Aqui obtenemos el estado del bluetooth del dispositivo
  useEffect(() => {
    const checkBluetoothState = manager.onStateChange((state) => {  
    if (state === 'PoweredOff') {
      Alert.alert(languageModule.lang(language,"AlertSwithBluetooth1"), languageModule.lang(language, "AlertSwithBluetooth2"), [
        {
          text: languageModule.lang(language, "noAllow"),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: languageModule.lang(language, "turnOn"), onPress: () => { manager.enable(); } },
      ]);

      subscription.remove();
    }
  }, true);

  //------------------Bluetooth------------------//
  // Solicitar permiso para escanear dispositivos Bluetooth
  checkAndRequestBluetoothScanPermission((granted => {
    if (granted == true) {
      console.log("El permiso se concedió");
      checkBluetoothState();
    } else {
      console.log("El permiso no se concedió");
    }
   }))

  // Agregar un oyente para el cambio de estado del Bluetooth
  const subscription = manager.onStateChange((state) => {
    if (state === 'PoweredOn') {
      // El Bluetooth se ha encendido, puedes realizar acciones adicionales si es necesario.
    }
  }, true);

  // Eliminar el oyente al desmontar el componente
  return () => {
    subscription.remove();
  };
     

  }, []);
  
  //Funcion de escaneo de dispositivos
  const toggleScan = () => {
    if (!scanning) {
      manager.startDeviceScan(null, null, (error, device) => {
        console.log('Escaneando...');
        if (error) {
          console.error('Error scanning:', error);
          return;
        }
        if (device.name) {
          console.log('Detectado dispositivo:', device.name, device.id);
          setDevices((prevDevices) => [...prevDevices, device]);
        }

        //  device.writeCharacteristicWithResponseForService(
        //   serviceUUID,
        //   characteristicUUID,
        //   [0x01, 0x02] // Datos para escribir
        //   );

        // device.readCharacteristicForService(serviceUUID, characteristicUUID); // Leer datos


      });
      //Abrimos el dialogo de busqueda de dispositivos por 3 segundos
      setSearchingForDevices(true);
      setTimeout(() => {
        setSearchingForDevices(false);
      }, 3000);
    } else {
      manager.stopDeviceScan();
    }
    setScanning(!scanning);
  };

  //Funcion de conexion a dispositivo
  const connectToDevice = async () => {
    if (selectedDevice) {
      try {
        const device = await manager.connectToDevice(selectedDevice.id); 
        console.log('Conectado al dispositivo:', device.name || 'Unknown');
      } catch (error) {
        console.error('Error al conectar al dispositivo:', error);
      }
    }
  };

  
  //Componentes del screen
  function header() {
    return (
      <View
        style={{
          margin: Sizes.fixPadding * 2.0,
          flex: 0.05,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
         <Ionicons name={"arrow-back-circle-outline"} onPress={() => navigation.pop()} size={27} color="white" />
        <Text
          style={{
            textAlign: "right",
            marginLeft: Sizes.fixPadding * 1.0,
            ...Fonts.whiteColor22SemiBold,
          }}
        >
          {"  " + languageModule.lang(language,'devicesECM')}
        </Text>      
      </View>
      
    );
  }

  function devicesList() {
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: Sizes.fixPadding * 3.0 }}>
        {devices.map((device, index) => (
        <View key={index} style={styles.deviceItem}>
        <Text>{device.name || 'Unknown'}</Text>
        <Icon name="bluetooth" type="material" size={30} color={Colors.primaryColor} />
        <Button title="Connect" onPress={() => setSelectedDevice(device)} />
        </View>
        ))}
        </View>
      </ScrollView>
    );
  }

  function screenOptions() {
    return (
      <View
        style={{
          marginVertical: Sizes.fixPadding * 2.5,
          marginHorizontal: Sizes.fixPadding * 2.0,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.99}
          title={scanning ? 'Stop Scan' : 'Start Scan'}
          onPress={toggleScan}
          style={
            devices.length == 0
              ? {
                  ...styles.optionBtns.btnStyle,
                  ...styles.optionBtns.btnSuccess,
                }
              : {
                  ...styles.optionBtns.btnStyle,
                  ...styles.optionBtns.btnLight,
                }
          }
        >
          <Text
            numberOfLines={1}
            style={
              devices.length > 0
                ? {
                    marginHorizontal: Sizes.fixPadding - 5.0,
                    ...Fonts.blackColor18SemiBold,
                  }
                : {
                    marginHorizontal: Sizes.fixPadding - 5.0,
                    ...Fonts.whiteColor18SemiBold,
                  }
            }
          >
            {languageModule.lang(language,'searchDevices')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.99}
          onPress={() => {
            setShowAdvertenciaDialog(true);
          }}
          style={
            devices.length > 0
              ? {
                  ...styles.optionBtns.btnStyle,
                  ...styles.optionBtns.btnSuccess,
                }
              : {
                  ...styles.optionBtns.btnStyle,
                  ...styles.optionBtns.btnLight,
                }
          }
        >
          <Text
            numberOfLines={1}
            style={
              devices.length > 0
                ? {
                    marginHorizontal: Sizes.fixPadding - 5.0,
                    ...Fonts.whiteColor18SemiBold,
                  }
                : {
                    marginHorizontal: Sizes.fixPadding - 5.0,
                    ...Fonts.blackColor18SemiBold,
                  }
            }
          >
            {languageModule.lang(language,'continue')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function buscandoDispositivos() {
    return (
      <Overlay
        isVisible={searchingDevices}
        onBackdropPress={() => setSearchingForDevices(false)}
        overlayStyle={{
          width: width - 40.0,
          borderRadius: Sizes.fixPadding - 2.0,
          padding: 0.0,
        }}
      >
        <View style={{ margin: Sizes.fixPadding * 2.0 }}>
          <View style={styles.loaderGif.container}>
            <Image
              source={require("../../assets/gifs/newloading.gif")}
              style={{
                ...styles.loaderGif,
              }}
            />
            <Text
              style={{
                ...Fonts.blackColor18Medium,
                marginLeft: Sizes.fixPadding * 4,
              }}
            >
              {languageModule.lang(language,'searchingDevices')}
            </Text>
          </View>
        </View>
      </Overlay>
    );
  }

  function conectandoDispositivo() {
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
          <View style={styles.loaderGif.container}>
            <Image
              source={require("../../assets/gifs/loading.gif")}
              style={{
                ...styles.loaderGif,
              }}
            />
            <View>
              <Text
                style={{
                  ...Fonts.blackColor18Medium,
                  marginLeft: Sizes.fixPadding * 4,
                }}
              >
                {languageModule.lang(language,'connectingtodevice')}
              </Text>
              <Text
                style={{
                  ...Fonts.blackColor18Medium,
                  marginLeft: Sizes.fixPadding * 4,
                }}
              >
                {"COLOCA AQUI EL NOMBRE DEL DISPOSITIVO"}
              </Text>
            </View>
          </View>
        </View>
      </Overlay>
    );
  }

  function advertenciaDialog() {
    return (
      <Overlay
        isVisible={showAdvertenciaDialog}
        onBackdropPress={() => setShowAdvertenciaDialog(false)}
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
            {languageModule.lang(language,'warning')}
          </Text>
          <Text
            style={{
              textAlign: "center",
              marginTop: Sizes.fixPadding + 5.0,
              ...Fonts.blackColor16Medium,
            }}
          >
            {languageModule.lang(language,'youdidnotselectanydevice')}
          </Text>
          <TouchableOpacity
            activeOpacity={0.99}
            onPress={() => navigation.push("PrincipalScreen")}
            style={{
              ...styles.optionBtns.btnStyle,
              ...styles.optionBtns.btnSuccess,
            }}
          >
            <Text style={{ ...Fonts.whiteColor16Bold }}>{languageModule.lang(language,'continue')}</Text>
          </TouchableOpacity>
          <Text
            onPress={() => setShowAdvertenciaDialog(false)}
            style={{
              textAlign: "center",
              marginTop: Sizes.fixPadding * 2,
              ...Fonts.grayColor16SemiBold,
            }}
          >
            {languageModule.lang(language,'cancel')}
          </Text>
        </View>
      </Overlay>
    );
  }

  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primaryColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        {header()}
        <View style={styles.sheetStyle}>
          {devicesList()}
          {screenOptions()}
        </View>
      </View>
      {buscandoDispositivos()}
      {conectandoDispositivo()}
      {advertenciaDialog()}
    </SafeAreaView>
  );

};


export default BluetoothScreen;

const styles = StyleSheet.create({
  sheetStyle: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
    borderTopLeftRadius: Sizes.fixPadding * 3.0,
    borderTopRightRadius: Sizes.fixPadding * 3.0,
    marginTop: Sizes.fixPadding * 2.0,
  },
  loaderGif: {
    container: {
      marginHorizontal: Sizes.fixPadding * 2.0,
      marginTop: Sizes.fixPadding * 2.0,
      marginBottom: Sizes.fixPadding * 3.0,
      flexDirection: "row",
      alignItems: "center",
    },
    width: width / 10,
    height: width / 10,
    resizeMode: "contain",
  },
  optionBtns: {
    wrap: {
      marginHorizontal: Sizes.fixPadding * 2.0,
      marginTop: Sizes.fixPadding * 2.0,
      marginBottom: Sizes.fixPadding * 3.0,
      flexDirection: "row",
      alignItems: "center",
    },
    btnStyle: {
      elevation: 2.0,
      alignItems: "center",
      justifyContent: "center",
      marginTop: Sizes.fixPadding * 2.0,
      borderRadius: Sizes.fixPadding - 2.0,
      paddingVertical: Sizes.fixPadding + 2.0,
      borderWidth: 1.0,
      borderBottomWidth: 1.0,
    },
    btnSuccess: {
      backgroundColor: Colors.primaryColor,
      borderColor: Colors.primaryColor,
    },
    btnLight: {
      backgroundColor: Colors.whiteColor,
      borderColor: Colors.blackColor,
    },
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
  deviceItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  connectButton: {
    alignItems: "center",
  },
});
