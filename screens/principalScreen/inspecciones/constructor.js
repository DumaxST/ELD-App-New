import { PermissionsAndroid } from 'react-native';

async function checkAndRequestCameraPermission() {
  try {
    // Verifica si ya se concedió el permiso de cámara
    const cameraGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CAMERA
    );

    // Verifica si ya se concedió el permiso de grabación de audio (si es necesario)
    const recordAudioGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
    );

    if (cameraGranted && recordAudioGranted) {
      // Los permisos ya se concedieron
      return true;
    } else {
      // Los permisos no se concedieron, solicítalos
      const permissionsToRequest = [];

      if (!cameraGranted) {
        permissionsToRequest.push(PermissionsAndroid.PERMISSIONS.CAMERA);
      }

      if (!recordAudioGranted) {
        permissionsToRequest.push(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
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

export { checkAndRequestCameraPermission };
