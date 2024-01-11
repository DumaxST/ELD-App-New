import React, { useState, useEffect } from 'react';
import { Alert,View,ActivityIndicator, Text, Button, Image,FlatList, ScrollView,  TouchableOpacity, SafeAreaView, StyleSheet, Dimensions,StatusBar,MaterialIcons} from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import { checkAndRequestBluetoothScanPermission } from './constructor';
import { Fonts, Colors, Sizes } from "../../constants/styles";
import { Icon } from 'react-native-elements';
import { Overlay } from "react-native-elements";
const languageModule = require('../../global_functions/variables');
import AsyncStorage from '@react-native-async-storage/async-storage'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Ionicons from 'react-native-vector-icons/Ionicons';
const { height, width } = Dimensions.get("window");

const BluetoothScreen = ({navigation}) => {

  //Declaracion de variables
  const [language, setlanguage] = useState('');
  // const manager = new BleManager();
  const [connectingBluetoothDeviceDialog, setConnectingBluetoothDeviceDialog] = useState(false);
  const [showAdvertenciaDialog, setShowAdvertenciaDialog] = useState(false);
  const [searchingDevices, setSearchingForDevices] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null); 
  const [scanning, setScanning] = useState(false);
  const [showButtons, setShowButtons] = useState(true);

  // const devices = [
  //   { id: 1, name: 'Dispositivo 1', connected: false },
  //   { id: 2, name: 'Dispositivo 2', connected: true },
  //   { id: 3, name: 'Dispositivo 3', connected: false },
  //   // Agrega más dispositivos aquí con la propiedad 'connected'
  // ];

  //Uso de efectos de inicio del screen
  useEffect(() => {
    const requestPermissions = async () => {
      let granted = await checkAndRequestBluetoothScanPermission();
      while (!granted) {
        granted = await checkAndRequestBluetoothScanPermission();
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
  
  //Aqui obtenemos el estado del bluetooth del dispositivo
  useEffect(() => {
    const checkBluetoothState = (language) => {
    const checkBTState = manager.onStateChange((state) => {  
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
      checkBTState();
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
     
    };
  
    const fetchLanguage = async () => {
      try {
        const preferredLanguage = await AsyncStorage.getItem("preferredLanguage");
        if (preferredLanguage) {
          checkBluetoothState(preferredLanguage);
        } 
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchLanguage();
  }, []);
  
  //Aqui obtenemos el idioma seleccionado desde la primera pantalla
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

  //funciones de manejo de eventos
  const handleScan = () => {
    setScanning(true);
    setShowButtons(false);

    // Simulación de escaneo
    setTimeout(() => {
      setScanning(false);
      setShowButtons(true);
    }, 3000); // Tiempo simulado de escaneo
  };

  const handleContinue = () => {
    setShowAdvertenciaDialog(true);
  };

  const pushToDiagnostico = () => {
    navigation.push("Diagnostico");
    setShowAdvertenciaDialog(false);
  };

  const handleBluetooth1Press = () => {
    // Navegar a la pantalla deseada al presionar Bluetooth 1
    navigation.navigate('Bluetooth1');
  };

  const handleBluetooth2Press = () => {
    // Navegar a la pantalla deseada al presionar Bluetooth 2
    navigation.navigate('PantallaBluetooth2');
  };

  //funciones de renderizado
  const renderDeviceItem = ({ item }) => {
    return (
      <View style={styles.deviceItem}>
        <Text style={styles.deviceText}>{item.name}</Text>
        <TouchableOpacity
          style={[
            styles.connectButton,
            { backgroundColor: item.connected ? '#4CAF50' : '#cccccc' },
          ]}
        >
          <Text style={styles.buttonText}>
            {item.connected ? 'Conectado' : 'Conectar'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

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
            onPress={() => pushToDiagnostico()}
            style={{
              ...styles2.optionBtns.btnStyle,
              ...styles2.optionBtns.btnSuccess,
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
    <View style={styles.container}>
      <Text style={styles.title}>{languageModule.lang(language, 'devicesECM')}</Text>
      <TouchableOpacity style={styles.bluetoothButton} onPress={handleBluetooth1Press}>
           <Text style={styles.buttonText}>Bluetooth 1</Text>
         </TouchableOpacity>
         <TouchableOpacity style={styles.bluetoothButton} onPress={handleBluetooth2Press}>
           <Text style={styles.buttonText}>Bluetooth 2</Text>
         </TouchableOpacity>
      {!scanning && (
        <FlatList
          data={devices}
          renderItem={renderDeviceItem}
          keyExtractor={item => item.id.toString()}
          style={styles.deviceList}
          ListEmptyComponent={() => (
            <Text style={styles.noDevicesText}>{languageModule.lang(language, 'thereIsnoDevicesAvailable')}</Text>
          )}
        />
      )}
      {scanning ? (
        <ActivityIndicator style={styles.loadingIndicator} size="large" color="#4CAF50" />
      ) : (
        showButtons && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
              <Text style={styles.buttonText}>{languageModule.lang(language, 'searchDevices').replace('dispositivos', '')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
              <Text style={styles.buttonText}>{languageModule.lang(language, 'continue')}</Text>
            </TouchableOpacity>
          </View>
        )
      )}
      {advertenciaDialog()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    top: -15,
    fontSize: 23,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
  },
  deviceList: {
    flex: 1,
    marginBottom: 20,
  },
  deviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 10,
  },
  deviceText: {
    fontSize: 16,
    color: '#333333',
  },
  bluetoothButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  connectButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  buttonContainer: {
    top: -50,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scanButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  continueButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  noDevicesText: {
    textAlign: 'center',
    fontSize: 16,
    fontStyle: 'italic',
    color: '#333333',
    marginTop: 40,
  },
});

const styles2 = StyleSheet.create({
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

export default BluetoothScreen;



