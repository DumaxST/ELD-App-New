import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ADD_VEHICLE_KILOMETERS,
  LOGOUT_CURRENT_DRIVER,
  SET_CURRENT_DRIVER,
  SET_DRIVER_STATUS,
  SET_ELD,
  SET_ELD_ACCURACY,
  START_ELD_APP,
  STAR_VEHICLE_KILOMETERS,
  TRACKING_TIMESTAMP,
} from "./actions";

const initialState = {
  eldData: {},
  acumulatedVehicleKilometers: 0,
  driverStatus: "OFF-DUTY",
  currentDriver: null,
  lastDriverStatus: "",
  trackingTimestamp: "",
  eldAccuracy: 0.001,
};

function eldReducer(state = initialState, action) {
  switch (action.type) {
    case START_ELD_APP:
      return {
        ...state,
        currentDriver: null,
        driverStatus: "OFF-DUTY",
        acumulatedVehicleKilometers: 0,
        eldData: {},
        eldAccuracy: 0.001,
      };
    case SET_CURRENT_DRIVER:
      return { ...state, currentDriver: action.value, driverStatus: "ON" };
    case TRACKING_TIMESTAMP:
      return { ...state, trackingTimestamp: action.value };
    case SET_ELD_ACCURACY:
      return { ...state, eldAccuracy: action.value };
    case LOGOUT_CURRENT_DRIVER:
      return {
        ...state,
        currentDriver: action.value,
        driverStatus: "OFF-DUTY",
        acumulatedVehicleKilometers: 0,
        eldData: {},
      };

    case SET_DRIVER_STATUS:
      return {
        ...state,
        driverStatus: action.value,
        lastDriverStatus: action.lastDriverStatus,
      };
    case SET_ELD:
      return {
        ...state,
        eldData: action.value,
        acumulatedVehicleKilometers:
          state.acumulatedVehicleKilometers + action.distance,
      };

    case STAR_VEHICLE_KILOMETERS:
      return {
        ...state,
        acumulatedVehicleKilometers: 0,
      };
    // case ADD_VEHICLE_KILOMETERS:
    //   return {
    //     ...state,
    //     acumulatedVehicleKilometers:
    //       state.acumulatedVehicleKilometers + action.value,
    //   };
    default:
      return state;
  }
}

export default eldReducer;
