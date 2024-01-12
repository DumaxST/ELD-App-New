import Geolocation from '@react-native-community/geolocation';
//descomentar cuando se haga el compilado nativo

// Variable para almacenar el ID del watch
let watchId = null;

export const startLocationTracking = (onLocationUpdate) => {
  watchId = Geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      onLocationUpdate({ latitude, longitude, timestamp: position.timestamp });
    },
    (error) => console.log(error),
    { enableHighAccuracy: true, distanceFilter: 5 }
  );
};

export const stopLocationTracking = () => {
  // Verifica si hay un ID de watch y lo detiene
  if (watchId !== null) {
    Geolocation.clearWatch(watchId);
    watchId = null;
  }
};
