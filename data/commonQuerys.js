import { geoTimeStamp } from "../components/eldFunctions";
import { currentCMV, getCurrentDriver } from "../config/localStorage";
import { getAxios, postAxios, putAxios } from "./axiosConfig";


//*-----------------START-loginScreen----------------------------------*//

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

export const authToken = async (userName, carrierID, token, language) => {
  return await postAxios("/api/auth/authToken", {
    userName: userName,
    carrierID: carrierID,
    token: token,
    language: language,
  }).then((res) =>{
    return res
  }).catch((err) => {
    console.error("authToken", err);
  });
}

export const removeToken = async (token) => {
  return await postAxios("/api/auth/deleteToken", {
    token: token
  }).then((res) =>{
    return res
  }).catch((err) => {
    console.error("removeToken", err);
  });
}

export const getCarriersOptions = async () => {
  return await getAxios("/api/app/carriers").then((res) =>{
    return res
  }).catch((err) => {
    console.error("authDriver", err);
  });
}

export const getTheUserIsAdmin = async (carrierID, userName) => {
  return await getAxios("/api/auth/isAdmin", {
    carrierID: carrierID,
    userName: userName
  }).then((res) =>{
    return res
  }).catch((err) => {
    console.error("isAdminAPI Fallo", err);
  });
}

//*-----------------FINISH-loginScreen----------------------------------*//

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
export const getDriverEvents = async (eldID, certified, timeFrame, driverID, carrierID) => {
      return await getAxios("/api/carrier/driver/events", {
        userID: "WhnYqXKAhEeCFDmLWlg5M3MYc1R2",
        carrierID: carrierID,
        driverID: driverID, 
        eldID: eldID, //Cambiar cuando API este actualizada
        certified: certified,  //agregar un tipo de dato desde API
        timeFrame: JSON.stringify(timeFrame) //Agregar un dropdown para seleccionar el timeFrame,
      });
};

//*-----------------START-CertifyLogs----------------------------------*//
export const certifyDriverEvents = async (eventsArray, eldID, driverID, carrierID) => {
    return await putAxios("/api/carrier/driver/events/certify", {
      carrierID: carrierID,
      driverID: driverID,
      eldID: eldID,
      eventsIDs: eventsArray,
    });
};

export const pendingCertifyDriverEvents = async (eldID, driverID, carrierID) => {
  const today = new Date();
  const twentyFourHoursAgo = new Date(today.getTime() - 48 * 60 * 60 * 1000);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }; 
  const events = await getDriverEvents(eldID, "undefined", { from: "", to: formatDate(twentyFourHoursAgo)}, driverID, carrierID);
  if(events.length > 0){
    const uncertifiedEvents = events.some(event => event?.certified?.value === false);
    if(uncertifiedEvents){
      return true
    }else{
      return false
    }
  }
}


//*-----------------FINISH-CertifyLogs----------------------------------*//

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
  lastDriverStatus,
  address
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
      address: address ? address : "",
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
      return await postAxios("/api/driverEvent", {
        userID: "WhnYqXKAhEeCFDmLWlg5M3MYc1R2",
        carrierID: currentChofer?.carrier?.id
          ? currentChofer?.carrier?.id
          : "lqdU1ErwDswdjSTiVEWp",         
        driverID: currentChofer?.id
          ? currentChofer.id
          : "Jg6XvXYVCvPCrdIZMOQeZ8WeH3d2",
        eldID: "mHlqeeq5rfz3Cizlia23",       //Aqui el ELD es importante obtenerlo de algún lado 
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
  put: async (editedEvent, currentChofer, justUpdate) => {
    await putAxios(`/api/driverEvent`, {
      carrierID: currentChofer?.carrier?.id
        ? currentChofer?.carrier?.id
        : "lqdU1ErwDswdjSTiVEWp",
      driverID: currentChofer?.id
        ? currentChofer.id
        : "Jg6XvXYVCvPCrdIZMOQeZ8WeH3d2",
      eldID: "mHlqeeq5rfz3Cizlia23",
      event: editedEvent,
      justUpdate: justUpdate,
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