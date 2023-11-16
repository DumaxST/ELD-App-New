import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
import { eldAccuracy, lastEldData } from "../config/localStorage";

export const geoTimeStamp = (eldData) => {
  function utcParser(date, hours) {
    date.setHours(date.getHours() + hours);
    return date;
  }
  const date = utcParser(new Date(), 6);

  const month =
    date.getMonth() + 1 <= 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const day = date.getDate() <= 9 ? `0${date.getDate()}` : date.getDate();
  const year = date.getFullYear().toString().substr(-2);

  const hour = date.getHours() <= 9 ? `0${date.getHours()}` : date.getHours();
  const minutes =
    date.getMinutes() <= 9 ? `0${date.getMinutes()}` : date.getMinutes();
  const seconds =
    date.getSeconds() <= 9 ? `0${date.getSeconds()}` : date.getSeconds();

  return {
    date: `${month}${day}${year}`,
    time: `${hour}${minutes}${seconds}`,
    latitude: `${eldData?.coords?.latitude.toFixed(2)}`,
    longitude: `${eldData?.coords?.longitude.toFixed(2)}`,
  };
};

export const drivedDistance = (prevCoords, currentCoords) => {
  if (!prevCoords || !currentCoords) {
    return undefined;
  }
  // Convert degrees to radians
  const deg2rad = (deg) => deg * (Math.PI / 180);
  // Calculate the distance using the Haversine formula
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(currentCoords.latitude - prevCoords.latitude);
  const dLon = deg2rad(currentCoords.longitude - prevCoords.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(prevCoords.latitude)) *
      Math.cos(deg2rad(currentCoords.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const isStillDriving = async (currentLocation, accuracy) => {
  return await eldAccuracy().then(async (eld) => {
    return await lastEldData().then(async (lastData) => {
      if (!lastData?.coords) {
        return await AsyncStorage.setItem(
          "lastEldData",
          JSON.stringify(currentLocation)
        ).then(() => {
          return false;
        });
      }
      const distance = drivedDistance(
        lastData?.coords,
        currentLocation?.coords
      );
      if (distance > eld.accuracy) {
        return distance;
      } else {
        return 0;
      }
    });
  });
};
