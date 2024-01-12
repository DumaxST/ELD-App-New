import * as Location from "expo-location";

let watchId = null;

export const startLocationTrackingFromExpo = (onLocationUpdate) => {
    watchId = Location.watchPositionAsync({
        // Tracking options
        accuracy: Location.Accuracy.High,
        // timeInterval: 3000,
        distanceInterval: 5,
      },
      async (location) => {
        onLocationUpdate(location);
      }
    );
};
