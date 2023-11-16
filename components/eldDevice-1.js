import { useEffect, useState } from "react";
import * as Location from "expo-location";
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
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Please grant location permissions");
      return;
    }
    let currentLocation = await Location.getCurrentPositionAsync({});
    return currentLocation;
  },
};

export default eldDevice;
