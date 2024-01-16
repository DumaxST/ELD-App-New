import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
import { eldAccuracy, lastEldData } from "../config/localStorage";

export const geoTimeStamp = (eldData) => {
  function utcParser(date, hours) {
    date.setHours(date.getHours() + hours);
    return date;
  }

  const date = utcParser(new Date(), 6);

  const month = `${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  const day = `${date.getDate().toString().padStart(2, '0')}`;
  const year = date.getFullYear().toString().slice(-2);

  const hour = `${date.getHours().toString().padStart(2, '0')}`;
  const minutes = `${date.getMinutes().toString().padStart(2, '0')}`;
  const seconds = `${date.getSeconds().toString().padStart(2, '0')}`;

  const latitude = eldData?.coords?.latitude?.toFixed(2) || '';
  const longitude = eldData?.coords?.longitude?.toFixed(2) || '';

  return {
    date: `${month}${day}${year}`,
    time: `${hour}${minutes}${seconds}`,
    latitude,
    longitude,
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

export const isStillDriving = async (currentLocation) => {
  try {
    const eld = await eldAccuracy();
    const lastData = await lastEldData();

    if (!lastData?.coords) {
      await AsyncStorage.setItem("lastEldData", JSON.stringify(currentLocation));
      return false;
    }

    const distance = drivedDistance(lastData?.coords, currentLocation?.coords);

    console.log("distance", distance);
    console.log("accuracy", eld.accuracy);

    return distance > eld.accuracy ? distance : 0;
  } catch (error) {
    console.error("Error in isStillDriving:", error);
    return 0;
  }
};

