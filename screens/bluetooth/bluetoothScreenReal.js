import React, {useState, useEffect} from 'react';
import {Alert,ActivityIndicator,SafeAreaView,Dimensions,StyleSheet,View,Text,StatusBar,TouchableOpacity,NativeModules,NativeEventEmitter,Platform,PermissionsAndroid,FlatList,TouchableHighlight,Pressable} from 'react-native';
import { checkAndRequestBluetoothScanPermission } from './constructor';
import { Fonts, Colors, Sizes } from "../../constants/styles";
import { Overlay } from "react-native-elements";
import AsyncStorage from '@react-native-async-storage/async-storage'
import BleManager, {BleDisconnectPeripheralEvent,BleManagerDidUpdateValueForCharacteristicEvent,BleScanCallbackType,BleScanMatchMode,BleScanMode,Peripheral} from 'react-native-ble-manager';
const BleManagerModule = NativeModules.BleManager;
const languageModule = require('../../global_functions/variables');
const { height, width } = Dimensions.get("window");
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
if (typeof Peripheral === 'object') {
    Peripheral.connected = false;
    Peripheral.connecting = false;
}
const SECONDS_TO_SCAN_FOR = 3;
const SERVICE_UUIDS = [];
const ALLOW_DUPLICATES = true;

const BluetoothScreen = ({navigation}) => {
  //Declaracion de variables
  const [isScanning, setIsScanning] = useState(false);
  const [peripherals, setPeripherals] = useState(new Map());
  const [language, setlanguage] = useState('');
  const [showButtons, setShowButtons] = useState(true);
  const [showAdvertenciaDialog, setShowAdvertenciaDialog] = useState(false);
  
  //uso de efectos de la pantalla
  //Iniciamos el BLEManager
  useEffect(() => {
    try {
          BleManager.start({showAlert: false})
            .then(() => console.debug('BleManager started.'))
            .catch(error =>
              console.error('BeManager could not be started.', error),
            );
    } catch (error) {
          console.error('unexpected error starting BleManager.', error);
          return;
    }
      
    const listeners = [
          bleManagerEmitter.addListener(
            'BleManagerDiscoverPeripheral',
            handleDiscoverPeripheral,
          ),
          bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan),
          bleManagerEmitter.addListener(
            'BleManagerDisconnectPeripheral',
            handleDisconnectedPeripheral,
          ),
          bleManagerEmitter.addListener(
            'BleManagerDidUpdateValueForCharacteristic',
            handleUpdateValueForCharacteristic,
          ),
          bleManagerEmitter.addListener(
            'BleManagerConnectPeripheral',
            handleConnectPeripheral,
          ),
    ];
    
    handleAndroidPermissions();
      
    return () => {
          console.debug('[app] main component unmounting. Removing listeners...');
          for (const listener of listeners) {
            listener.remove();
          }
    };
    
  }, []);

  //Si no hay permisos solicitamos los permisos
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

  //Si el bluetooth esta apagado lo encendemos
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
  
  //funciones de la pantalla
  const startScan = () => {
   if (!isScanning) {
      // reset found peripherals before scan
      setPeripherals(new Map());
  
      try {
        console.debug('[startScan] starting scan...');
        setIsScanning(true);
        BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES, {
          matchMode: BleScanMatchMode.Sticky,
          scanMode: BleScanMode.LowLatency,
          callbackType: BleScanCallbackType.AllMatches,
          // Agregar la propiedad 'name' en las opciones
          numberOfMatches: 3, // Número de dispositivos a encontrar
          reportDelay: 0, // Retraso antes de recibir los resultados
          name: true, // Habilitar la obtención de nombres de dispositivos
        })
          .then(() => {
            console.debug('[startScan] scan promise returned successfully.');
          })
          .catch((err) => {
            console.error('[startScan] ble scan returned in error', err);
          });
      } catch (error) {
        console.error('[startScan] ble scan error thrown', error);
      }
      
   }
  };
  
  const handleStopScan = () => {
    setIsScanning(false);
    console.debug('[handleStopScan] scan is stopped.');
  };

  const handleDisconnectedPeripheral = (event) => {
    console.debug(
      `[handleDisconnectedPeripheral][${event.peripheral}] disconnected.`
    );
    setPeripherals(map => {
      let p = map.get(event.peripheral);
      if (p) {
        p.connected = false;
        return new Map(map.set(event.peripheral, p));
      }
      return map;
    });
  };

  const handleConnectPeripheral = (event) => {
    console.log(`[handleConnectPeripheral][${event.peripheral}] connected.`);
  };

  const handleUpdateValueForCharacteristic = (data) => {
    console.debug(
      `[handleUpdateValueForCharacteristic] received data from '${data.peripheral}' with characteristic='${data.characteristic}' and value='${data.value}'`,
    );
  };

  const handleDiscoverPeripheral = (peripheral) => {
    console.debug('[handleDiscoverPeripheral] new BLE peripheral=', peripheral);
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }
    setPeripherals(map => {
      return new Map(map.set(peripheral.id, peripheral));
    });
  };

  const togglePeripheralConnection = async (peripheral) => {
    if (peripheral && peripheral.connected) {
      try {
        await BleManager.disconnect(peripheral.id);
      } catch (error) {
        console.error(
          `[togglePeripheralConnection][${peripheral.id}] error when trying to disconnect device.`,
          error,
        );
      }
    } else {
      await connectPeripheral(peripheral);
    }
  };

  const retrieveConnected = async () => {
    try {
      const connectedPeripherals = await BleManager.getConnectedPeripherals();
      if (connectedPeripherals.length === 0) {
        console.warn('[retrieveConnected] No connected peripherals found.');
        return;
      }
  
      console.debug(
        '[retrieveConnected] connectedPeripherals',
        connectedPeripherals,
      );
  
      for (var i = 0; i < connectedPeripherals.length; i++) {
        var peripheral = connectedPeripherals[i];
        setPeripherals(map => {
          let p = map.get(peripheral.id);
          if (p) {
            p.connected = true;
            return new Map(map.set(p.id, p));
          }
          return map;
        });
      }
    } catch (error) {
      console.error(
        '[retrieveConnected] unable to retrieve connected peripherals.',
        error,
      );
    }
  };

  const connectPeripheral = async (peripheral) => {
    try {
      if (peripheral) {
        setPeripherals(map => {
          let p = map.get(peripheral.id);
          if (p) {
            p.connecting = true;
            return new Map(map.set(p.id, p));
          }
          return map;
        });
  
        await BleManager.connect(peripheral.id);
        console.debug(`[connectPeripheral][${peripheral.id}] connected.`);
  
        setPeripherals(map => {
          let p = map.get(peripheral.id);
          if (p) {
            p.connecting = false;
            p.connected = true;
            return new Map(map.set(p.id, p));
          }
          return map;
        });
  
        await sleep(900);
  
        const peripheralData = await BleManager.retrieveServices(peripheral.id);
        console.debug(
          `[connectPeripheral][${peripheral.id}] retrieved peripheral services`,
          peripheralData,
        );
  
        const rssi = await BleManager.readRSSI(peripheral.id);
        console.debug(
          `[connectPeripheral][${peripheral.id}] retrieved current RSSI value: ${rssi}.`,
        );
  
        if (peripheralData.characteristics) {
          for (let characteristic of peripheralData.characteristics) {
            if (characteristic.descriptors) {
              for (let descriptor of characteristic.descriptors) {
                try {
                  let data = await BleManager.readDescriptor(
                    peripheral.id,
                    characteristic.service,
                    characteristic.characteristic,
                    descriptor.uuid,
                  );
                  console.debug(
                    `[connectPeripheral][${peripheral.id}] ${characteristic.service} ${characteristic.characteristic} ${descriptor.uuid} descriptor read as:`,
                    data,
                  );
                  // Configurar notificaciones
                  BleManager.startNotification(peripheral.id, characteristic.service, characteristic.characteristic)
                  .then(() => {
                    console.log('Notificaciones configuradas correctamente');
                  })
                  .catch((error) => {
                    console.error('Error al configurar notificaciones:', error);
                  });
                  


                  // Manejar eventos de notificación
                  const handleNotification = (data) => {
                  //console.log('Datos de notificación:', data.value);
                  const utf8String = String.fromCharCode.apply(null, data.value);
                  console.log('Datos en UTF-8:', utf8String);
                  // Realizar el procesamiento necesario, como la conversión de datos a UTF-8
                  };
                  
                  // Suscribirse a eventos de notificación
                  BleManager.addListener('BleManagerDidUpdateValueForCharacteristic', handleNotification);
                } catch (error) {
                  console.error(
                    `[connectPeripheral][${peripheral.id}] failed to retrieve descriptor ${descriptor} for characteristic ${characteristic}:`,
                    error,
                  );
                }
              }
            }
          }
        }
  
        setPeripherals(map => {
          let p = map.get(peripheral.id);
          if (p) {
            p.rssi = rssi;
            return new Map(map.set(p.id, p));
          }
          return map;
        });
      }
    } catch (error) {
      console.error(
        `[connectPeripheral][${peripheral.id}] connectPeripheral error`,
        error,
      );
    }
  };

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const handleAndroidPermissions = () => {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]).then(result => {
        if (result) {
          console.debug(
            '[handleAndroidPermissions] User accepts runtime permissions android 12+',
          );
        } else {
          console.error(
            '[handleAndroidPermissions] User refuses runtime permissions android 12+',
          );
        }
      });
    } else if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(checkResult => {
        if (checkResult) {
          console.debug(
            '[handleAndroidPermissions] runtime permission Android <12 already OK',
          );
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then(requestResult => {
            if (requestResult) {
              console.debug(
                '[handleAndroidPermissions] User accepts runtime permission android <12',
              );
            } else {
              console.error(
                '[handleAndroidPermissions] User refuses runtime permission android <12',
              );
            }
          });
        }
      });
    }
  };

  const handleContinue = () => {
    setShowAdvertenciaDialog(true);
  };

  const pushToDiagnostico = () => {
    navigation.navigate("Diagnostico");
    setShowAdvertenciaDialog(false);
  };

  //funciones de renderizado
  function renderItem({item}) {
    return (
        <View style={styles.deviceItem}>
          <Text style={styles.deviceText}>{item.name}</Text>
          <TouchableOpacity
            style={[
              styles.connectButton,
              { backgroundColor: item.connected ? '#4CAF50' : '#cccccc' },
            ]}
            onPress={() => togglePeripheralConnection(item)}
            disabled={item.connecting || item.advertising.isConnetable === false}
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
          {!isScanning && (
            <FlatList
              data={Array.from(peripherals.values())}
              contentContainerStyle={{rowGap: 12}}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              style={styles.deviceList}
              ListEmptyComponent={() => (
                <Text style={styles.noDevicesText}>{languageModule.lang(language, 'thereIsnoDevicesAvailable')}</Text>
              )}
            />
          )}
          {isScanning ? (
            <ActivityIndicator style={styles.loadingIndicator} size="large" color="#4CAF50" />
          ) : (
            showButtons && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.scanButton} onPress={startScan}>
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

}

  
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
