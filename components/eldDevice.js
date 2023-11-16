import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { setELD } from "../redux/actions";
import { useDispatch } from "react-redux";
{
  /*
eldDevice = {
  location:{
    coords:{
      latitude:123456789,
      longitude:987654321
    }
  }
}
*/
}


const eldDevice = {
  location: async () => {
    const foregroundPermission =
      await Location.requestForegroundPermissionsAsync();
    // let locationSubscrition = null;

    if (!foregroundPermission.granted) {
      console.log("Please grant location permissions");
      return;
    }

    return Location.watchPositionAsync(
      {
        // Tracking options
        accuracy: Location.Accuracy.High,
        distanceInterval: 10,
      },
      (location) => {
        /* Location object example:
          {
            coords: {
              accuracy: 20.100000381469727,
              altitude: 61.80000305175781,
              altitudeAccuracy: 1.3333333730697632,
              heading: 288.87445068359375,
              latitude: 36.7384213,
              longitude: 3.3463877,
              speed: 0.051263172179460526,
            },
            mocked: false,
            timestamp: 1640286855545,
          };
        */
        // Do something with location...
        // dispatch(setELD(location));
        return;
      }
    );

  },
};

export default eldDevice;
