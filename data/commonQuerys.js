import { geoTimeStamp } from "../components/eldFunctions";
import { currentCMV, getCurrentDriver } from "../config/localStorage";
import { getAxios, postAxios, putAxios } from "./axiosConfig";

//*-----------------BEFORE AUTHENTICATION---------------------------------*//
export const authCarrierDriver = async (userName, userPsw) => {
  return await getAxios("/api/carrier/driver/auth", {
    userName: userName,
    userPsw: userPsw,
  }).catch((err) => {
    console.error("authCarrierDriver", err);
  });
};
//*-----------------NEW AUTHENTICATION----------------------------------*//

export const authDriver = async (userName, carrierID, language, password) => {
  return await postAxios("/api/auth/login", {
    userName: userName,
    carrierID: carrierID,
    language: language,
    password: password,
  }).then((res) =>{
    return res
  }).catch((err) => {
    console.error("authDriver", err);
  });
}

export const getCarriersOptions = async () => {
  return await getAxios("/api/app/carriers").then((res) =>{
    return res
  }).catch((err) => {
    console.error("authDriver", err);
  });
}

export const eld = {
  getAccuracy: async (carrierID, cmvID) => {
    return await getAxios(`/api/carrier/eld/accuracy`, {
      carrierID: carrierID,
      cmvID: cmvID
    }).then((res) =>{
      return res
    }).catch((err) => {
      console.error("Accuracyerr", err);
    });
  }
};

// DRIVER EVENTS ===============================================================
export const getDriverEvents = async (certified, undefined) => {
  return await getCurrentDriver()
    .then(async (currentDriver) => {
      return await getAxios("/api/carrier/driver/events", {
        carrierID: currentDriver.carrier.id,
        driverID: undefined ? "Jg6XvXYVCvPCrdIZMOQeZ8WeH3d2" : currentDriver.id, // PLACE UNDEFINED DRIVER ID
        eldID: "bWuPuaLFPVQxdWH9eGdX",
        certified: certified,
      });
    })
    .catch((err) => console.error(err));
};

export const certifyDriverEvents = async (eventsArray) => {
  return await getCurrentDriver().then(async (currentDriver) => {
    return await putAxios("/api/carrier/driver/events/certify", {
      carrierID: currentDriver.carrier.id,
      driverID: currentDriver.id,
      eldID: "bWuPuaLFPVQxdWH9eGdX",
      eventsIDs: eventsArray,
    });
  });
};

export const getEventTypeCode = (tempDriverStatus) => {
  switch (tempDriverStatus) {
    default:
    case "OFF-DUTY":
      return { type: 1, code: 1 };
    case "SB":
      return { type: 1, code: 2 };
    case "D":
      return { type: 1, code: 3 };
    case "ON":
      return { type: 1, code: 4 };
    case "PC":
      return { type: 3, code: 1 };
    case "YM":
      return { type: 3, code: 2 };
  }
};

export const postDriverEvent = async (
  eldCodes,
  currentAnnotation,
  driverStatus,
  currentChofer,
  eldData,
  acumulatedVehicleKilometers,
  lastDriverStatus
) => {
  return await currentCMV().then(async (cmv) => {
    const eventData = {
      recordStatus: eldCodes.recordStatus, // 1) Active, 2) Inactive - Changed, 3) Inactive - Changed Requested, 4) Inactive - Changed Rejected
      recordOrigin: currentChofer?.carrier?.id ? eldCodes.recordOrigin : 4, // 1) Automatically recorded by ELD, 2) Edited or entered by the Driver, 3) Edit requested by an Authenticated User other than the Driver, 4) Assumed from Unidentified Driver Profile
      type: eldCodes.type,
      code: eldCodes.code,
      geoTimeStamp: geoTimeStamp(eldData),
      acumulatedVehicleMiles: Math.round(
        acumulatedVehicleKilometers * 0.621371
      ),
      elapsedEngineHours: "58.5",
      distanceSinceLastValidCoordinates: 6,
      malfunctionIndicatorStatusforELD: 1,
      dataDiagnosticEventIndicatorStatusforDriver: 1,
      locationDescription: "ABC12345def",
      commentOrAnnotation: currentAnnotation ? currentAnnotation : "",
      dutyStatus: driverStatus,
      cmv: {
        id: cmv ? cmv?.id : currentChofer?.cmv?.id,
        vin: cmv ? cmv?.vinDelCamion : currentChofer?.cmv?.vin,
        number: cmv ? cmv?.numeroDelCamion : currentChofer?.cmv?.number, // TO BE DEPRESIATED
        powerUnitNumber: cmv
          ? cmv?.numeroDelCamion
          : currentChofer?.cmv?.number,
        trailerNumber: cmv?.trailerNumber,
        shippingDocumentNumber: cmv?.numeroDeDocumentoDeEnvio,
      },
      carrier: currentChofer?.carrier,
    };

    if (
      (eventData.dutyStatus != lastDriverStatus &&
        currentChofer?.exemptDriverConfiguration?.value === "0") ||
      currentChofer?.exemptDriverConfiguration?.value === 0
    ) {
      // console.log({
      //   carrierID: currentChofer?.carrier?.id
      //     ? currentChofer?.carrier?.id
      //     : "lqdU1ErwDswdjSTiVEWp",
      //   driverID: currentChofer?.id
      //     ? currentChofer.id
      //     : "Jg6XvXYVCvPCrdIZMOQeZ8WeH3d2",
      //   eldID: "bWuPuaLFPVQxdWH9eGdX",
      //   event: eventData,
      // });
      console.log("chofer", currentChofer.id)
      return await postAxios("/api/driverEvent", {
        carrierID: currentChofer?.carrier?.id
          ? currentChofer?.carrier?.id
          : "lqdU1ErwDswdjSTiVEWp",
        driverID: currentChofer?.id
          ? currentChofer.id
          : "Jg6XvXYVCvPCrdIZMOQeZ8WeH3d2",
        eldID: "bWuPuaLFPVQxdWH9eGdX",
        event: eventData,
      })
        .then(() => {
          return eventData;
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      console.log("exempt driver configuration");
    }
    return;
  });
};

export const DriverEvent = {
  put: async (editedEvent, currentChofer) => {
    await putAxios(`/api/driverEvent`, {
      carrierID: currentChofer?.carrier?.id
        ? currentChofer?.carrier?.id
        : "lqdU1ErwDswdjSTiVEWp",
      driverID: currentChofer?.id
        ? currentChofer.id
        : "Jg6XvXYVCvPCrdIZMOQeZ8WeH3d2",
      eldID: "bWuPuaLFPVQxdWH9eGdX",
      event: editedEvent,
    });
  },
  history: {
    reject: async (driverID, originalEvent, eventHistoryID, rejected) => {
      return await putAxios(`/api/admin/driverEvent/reject`, {
        driverID: driverID,
        originalEvent: originalEvent,
        eventHistoryID: eventHistoryID,
        rejected: rejected,
      });
    },
    reverOrginal: async (driverID, originalEventID, originalEventOBJ) => {
      return await putAxios(`/api/admin/driverEvent/revertOrgiginal`, {
        driverID: driverID,
        originalEventID: originalEventID,
        originalEventOBJ: originalEventOBJ,
      });
    },
  },
};

export const FMCSA = {
  getELDDataFile: async (
    currentDriver,
    coDriverID,
    eldData,
    cmv,
    outputFileComment,
    emailRecipient
  ) => {
    // console.log({
    //   carrierID: currentDriver?.carrier?.id
    //     ? currentDriver?.carrier?.id
    //     : "lqdU1ErwDswdjSTiVEWp",
    //   driverID: currentDriver?.id,
    //   coDriverID: coDriverID ? coDriverID : undefined,
    //   eldID: eldData.id,
    //   shippingDocumentNumber: cmv?.numeroDeDocumentoDeEnvio,
    //   outputFileComment: outputFileComment,
    // });
    return await getAxios("/api/eldDataFile", {
      carrierID: currentDriver?.carrier?.id
        ? currentDriver?.carrier?.id
        : "lqdU1ErwDswdjSTiVEWp",
      driverID: currentDriver?.id,
      eldID: eldData.id,
      coDriverID: coDriverID ? coDriverID : undefined,
      shippingDocumentNumber: cmv?.numeroDeDocumentoDeEnvio,
      cmvID: cmv.id, // "lLL5cQmQdlU8SLV5imVc",
      outputFileComment: outputFileComment,
      currentGeoTimeStamp: JSON.stringify(geoTimeStamp(eldData)),
      emailRecipient: emailRecipient,
    });
  },
};
