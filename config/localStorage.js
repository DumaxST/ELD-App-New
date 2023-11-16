import AsyncStorage from "@react-native-async-storage/async-storage";
export const getCurrentDriver = async () => {
  return await AsyncStorage.getItem("currentDriver").then((currentDriver) => {
    return JSON.parse(currentDriver);
  });
};

export const eldAccuracy = async () => {
  return await AsyncStorage.getItem("eldAccuracy").then((eldAccuracy) => {
    return JSON.parse(eldAccuracy);
  });
};

export const currentCMV = async () => {
  return await AsyncStorage.getItem("currentCMV").then((currentCMV) => {
    return JSON.parse(currentCMV);
  });
};

export const currentELD = async () => {
  return await AsyncStorage.getItem("currentELD").then((currentELD) => {
    return JSON.parse(currentELD);
  });
};

export const lastEldData = async () => {
  return AsyncStorage.getItem("lastEldData").then((lastEldData) => {
    return JSON.parse(lastEldData);
  });
};

export const undefinedDriverID = "Jg6XvXYVCvPCrdIZMOQeZ8WeH3d2";
// async () => {
//   return "Jg6XvXYVCvPCrdIZMOQeZ8WeH3d2";
// };
