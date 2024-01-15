import * as Location from 'expo-location';

export const startGlobalLocationTracking = async (updateLocationCallback) => {
    
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