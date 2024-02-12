import AsyncStorage from "@react-native-async-storage/async-storage";
import { isStillDriving } from "../components/eldFunctions";
import { getEventTypeCode, postDriverEvent } from "../data/commonQuerys";

export const START_ELD_APP = "START_ELD_APP";
export const startEldApp = (eldData) => (dispatch) => {
  dispatch({
    type: START_ELD_APP,
  });
};

export const SET_ELD_ACCURACY = "SET_ELD_ACCURACY";
export const setEldAccuracy = (accuracy) => (dispatch) => {
  dispatch({
    type: SET_ELD_ACCURACY,
    value: accuracy,
  });
};

export const TRACKING_TIMESTAMP = "TRACKING_TIMESTAMP";
export const setTrackingTimeStamp = (timestamp) => (dispatch) => {
  dispatch({
    type: TRACKING_TIMESTAMP,
    value: timestamp,
  });
};

export const EDIT_DRIVER_LOG_EVENT = "EDIT_DRIVER_LOG_EVENT";
export const editDriverLogEvent = (logEvent) => (dispatch) => {
  dispatch({
    type: EDIT_DRIVER_LOG_EVENT,
    value: logEvent,
  });
};

export const SET_ELD = "SET_ELD";
export const setELD = (eldData) => {
  return async (dispatch) => {
    await isStillDriving(eldData).then((distance) => {
      return dispatch({
        type: SET_ELD,
        value: eldData,
        distance: distance,
      });
    });
  };
};

export const SET_DRIVER_STATUS = "SET_DRIVER_STATUS";
export const setDriverStatus = (
  eldData,
  currentDriver,
  driverStatus,
  acumulatedVehicleKilometers,
  lastDriverStatus,
  recordOrigin,
  currentAnnotation,
  address
) => {
  return async (dispatch) => {
    let isDriving = await isStillDriving(eldData);
    if (isDriving > 0) {
          if (driverStatus == "OFF-DUTY" || driverStatus == "ON" || driverStatus !== "D") {
            return await postDriverEvent(
              {
                recordStatus: 1,
                recordOrigin: recordOrigin,
                type: 1,
                code: 3,
              },
              currentAnnotation,
              "D",
              currentDriver,
              eldData,
              acumulatedVehicleKilometers,
              lastDriverStatus,
              address
            ).then(() => {
              return dispatch({
                type: SET_DRIVER_STATUS,
                value: "D",
                lastDriverStatus: driverStatus,
              });
            });
          } else {
            return;
          }
    }else if (currentDriver.id != "Jg6XvXYVCvPCrdIZMOQeZ8WeH3d2"){
    return await postDriverEvent(
      {
        recordStatus: 1,
        recordOrigin: recordOrigin,
        type: getEventTypeCode(driverStatus).type,
        code: getEventTypeCode(driverStatus).code,
      },
      currentAnnotation,
      driverStatus,
      currentDriver,
      eldData,
      acumulatedVehicleKilometers,
      lastDriverStatus,
      address
    ).then(() => {
      return dispatch({
        type: SET_DRIVER_STATUS,
        value: driverStatus,
        lastDriverStatus: lastDriverStatus,
      });
    });
    } 
  };
};

export const hasItStoped = (
  eldData,
  currentDriver,
  driverStatus,
  acumulatedVehicleKilometers,
  lastDriverStatus
) => {
  return async (dispatch) => {
    if (!(await isStillDriving(eldData))) {
      if (currentDriver == null && driverStatus != "OFF-DUTY") {
        return await postDriverEvent(
          {
            recordStatus: 1,
            recordOrigin: 1,
            type: 1,
            code: 1,
          },
          "",
          "OFF-DUTY",
          currentDriver,
          eldData,
          acumulatedVehicleKilometers,
          lastDriverStatus
        ).then(() => {
          return dispatch({
            type: SET_DRIVER_STATUS,
            value: "OFF-DUTY",
            lastDriverStatus: driverStatus,
          });
        });
      } else if (currentDriver && driverStatus == "D") {
        return dispatch({
          type: SET_DRIVER_STATUS,
          value: "ON",
          lastDriverStatus: driverStatus,
        });
        // return await postDriverEvent(
        //   1,
        //   "",
        //   "ON",
        //   currentDriver,
        //   eldData,
        //   acumulatedVehicleKilometers
        // ).then(() => {});
      }
      // if (driverStatus != "OFF-DUTY") {
      // } else if (
      //   driverStatus != "OFF-DUTY" ||
      //   driverStatus != "ON" ||
      //   driverStatus != "SB" ||
      //   driverStatus != "PC"
      // ) {
      //   console.log("IS STOPPED");
      //   if (currentDriver) {
      //     console.log("POST EVENT:", "ON");
      //     return dispatch({
      //       type: SET_DRIVER_STATUS,
      //       value: "ON",
      //       lastDriverStatus: driverStatus,
      //     });
      //   } else {
      //     console.log("POST EVENT:", "OFF-DUTY");
      //     return dispatch({
      //       type: SET_DRIVER_STATUS,
      //       value: "OFF-DUTY",
      //       lastDriverStatus: driverStatus,
      //     });
      //   }
      // }
    } else {
      return;
    }
    // await setTimeout(async () => {
    // }, 3000).then((driverStatus) => {
    //   console.log("has it stoped", driverStatus);
    //   if (driverStatus) {
    //     return dispatch({
    //       type: SET_DRIVER_STATUS,
    //       value: driverStatus,
    //     });
    //   } else {
    //     return;
    //   }
    // });
  };
};

// export const ADD_VEHICLE_KILOMETERS = "ADD_VEHICLE_KILOMETERS";
// export const addVehicleKilometers = (km) => (dispatch) => {
//   dispatch({
//     type: ADD_VEHICLE_KILOMETERS,
//     value: km,
//   });
// };

export const STAR_VEHICLE_KILOMETERS = "STAR_VEHICLE_KILOMETERS";
export const startVehicleMeters = () => (dispatch) => {
  dispatch({
    type: STAR_VEHICLE_KILOMETERS,
  });
};

export const SET_CURRENT_DRIVER = "SET_CURRENT_DRIVER";
export const setCurrentDriver = (
  driverData,
  eldData,
  acumulatedVehicleKilometers,
  lastDriverStatus,
  address
) => {
  return async (dispatch) => {
    return await AsyncStorage.setItem(
      "currentDriver",
      JSON.stringify(driverData)
    ).then(async () => {
      // return dispatch({
      //   type: SET_CURRENT_DRIVER,
      //   value: driverData,
      // });
      let lastEvent = {
        recordStatus: 1,
        recordOrigin: 2,
        type: getEventTypeCode('ON').type,
        code: getEventTypeCode('ON').code,
        currentAnnotation: '',
        tempDriverStatus: 'ON',
        currentDriver: driverData,
        eldData: eldData,
        acumulatedVehicleKilometers: acumulatedVehicleKilometers,
        lastDriverStatus: lastDriverStatus,
        location: address
      }
      await AsyncStorage.setItem("lastEvent", JSON.stringify(lastEvent) )
      return await postDriverEvent(
        {
          recordStatus: 1,
          recordOrigin: 1,
          type: 5,
          code: 1,
        },
        "",
        "ON",
        driverData,
        eldData,
        acumulatedVehicleKilometers,
        lastDriverStatus,
        address
      ).then(() => {
        return dispatch({
          type: SET_CURRENT_DRIVER,
          value: driverData,
        });
      });
    });
  };
};

export const LOGOUT_CURRENT_DRIVER = "LOGOUT_CURRENT_DRIVER";
export const logOutCurrentDriver = (
  currentDriver,
  eldData,
  acumulatedVehicleKilometers,
  lastDriverStatus,
  address
) => {
  return async (dispatch) => {
    // Se corrigió el doble "await"
    await postDriverEvent(
      {
        recordStatus: 1,
        recordOrigin: 1,
        type: 5,
        code: 2,
      },
      "",
      "OFF-DUTY",
      currentDriver,
      eldData,
      acumulatedVehicleKilometers,
      lastDriverStatus,
      address
    ).then(async () => {   
      await AsyncStorage.removeItem("currentDriver");
      await AsyncStorage.removeItem("currentCMV");
      await AsyncStorage.removeItem("currentELD");
      await AsyncStorage.removeItem("eldAccuracy");

      // Se utiliza directamente "dispatch" para enviar la acción
      dispatch({
        type: LOGOUT_CURRENT_DRIVER,
        value: currentDriver,
      });
    });
  };
};

