import { useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { BleManager, Device } from "react-native-ble-plx";
// import { PERMISSIONS, requestMultiple } from "react-native-permissions";
// import DeviceInfo from "react-native-device-info";

type PermissionsCallback = (result: boolean) => void;

const bleManager = new BleManager();

interface BluetoothLowEnergyApi {
  requestPermissions(callback: PermissionsCallback): Promise<void>;
  // scanForPeripherals(): void;
  // allDevices: Device[];
}

export default function useBLE(): BluetoothLowEnergyApi {
  const [allDevices, setAllDevices] = useState<Device[]>([]);

  const requestPermissions = async (callback: PermissionsCallback) => {
    if (Platform.OS == "android") {
      // const apiLevel = await DeviceInfo.getApiLevel();
      // if (apiLevel < 31) {
      const grantedStatus = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location & Bluetooth Permission",
          message:
            "DUMAX ELD Needs access to the device location & bluetooth permisions",
          buttonPositive: "Ok",
          buttonNegative: "Cancel",
        }
      );
      callback(grantedStatus === PermissionsAndroid.RESULTS.GRANTED);
      // }
      // else {
      //   const result = await requestMultiple([
      //     PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      //     PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
      //     PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      //   ]);
      //   const isGranted =
      //     result["android.permission.BLUETOOTH_CONNECT"] ===
      //       PermissionsAndroid.RESULTS.GRANTED &&
      //     result["android.permission.BLUETOOTH_SCAN"] ===
      //       PermissionsAndroid.RESULTS.GRANTED &&
      //     result["android.permission.ACCESS_FINE_LOCATION"] ===
      //       PermissionsAndroid.RESULTS.GRANTED;

      //   callback(isGranted);
      // }
    } else {
      callback(true);
    }
  };

  // const isDuplicateDevice = (devices: Device[], nextDevice: Device) =>
  // devices.findIndex((device) => nextDevice.id == device.id) > -1;

  // const scanForPeripherals = () => {
  //   bleManager.startDeviceScan(null, null, (error, device) => {
  //     if (error) {
  //       console.log(error);
  //     }

  //     if (device && device.name?.includes("Corsense")) {
  //       setAllDevices((prevState) => {
  //         if (!isDuplicateDevice(prevState, device)) {
  //           return [...prevState, device];
  //         }
  //         return prevState;
  //       });
  //     }
  //   });
  // };

  return {
    requestPermissions,
    // scanForPeripherals,
    // allDevices,
  };
}
