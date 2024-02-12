import * as Location from 'expo-location';

export const startGlobalLocationTracking = async (updateLocationCallback) => {

  const foregroundPermission =
  await Location.requestForegroundPermissionsAsync();
  // let locationSubscrition = null;
  
  if (!foregroundPermission.granted) {
    console.log("Please grant location permissions");
    return;
  }
    
  const locationOptions = {
    accuracy: Location.Accuracy.High,
    distanceInterval: 5,
  };

  const updateLocation = async () => {
    const currentLocation = await Location.getCurrentPositionAsync(locationOptions);
    updateLocationCallback(currentLocation);
  };

  // Actualizar la ubicación inicial
  updateLocation();

  const stopLocationTracking = () => {
    clearInterval(locationInterval);
  };

  return stopLocationTracking;
};