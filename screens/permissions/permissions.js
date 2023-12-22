import { PermissionsAndroid } from 'react-native';

async function checkAndRequestBluetoothScanPermission() {
  try {
    // Verifica si ya se concedió el permiso de Bluetooth Scan
    const bluetoothScanGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN
    );

    // Verifica si ya se concedió el permiso de acceso a la ubicación
    const locationPermissionGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (bluetoothScanGranted && locationPermissionGranted) {
      // Los permisos ya se concedieron
      return true;
    } else {
      // Los permisos no se concedieron, solicítalos
      const permissionsToRequest = [];

      if (!bluetoothScanGranted) {
        permissionsToRequest.push(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN);
        permissionsToRequest.push(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
      }

      if (!locationPermissionGranted) {
        permissionsToRequest.push(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      }

      const granted = await PermissionsAndroid.requestMultiple(permissionsToRequest);

      if (
        Object.values(granted).every((result) => result === PermissionsAndroid.RESULTS.GRANTED)
      ) {
        console.log('Permisos concedidos:', granted);
        return true;
      } else {
        // Al menos un permiso no se concedió
        console.log('Permisos no concedidos:', granted);
        return false;
      }
    }
  } catch (error) {
    console.warn(error);
    return false;
  }
}



export { checkAndRequestBluetoothScanPermission };

  