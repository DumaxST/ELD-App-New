import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { eld, getEventTypeCode, postDriverEvent } from "../data/commonQuerys";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
const languageModule = require('../global_functions/variables');
import { currentCMV, getCurrentDriver } from "../config/localStorage";
import { eldAccuracy, lastEldData } from "../config/localStorage";
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

const TimerContext = createContext();

const TASK_NAME = 'checkTimerExpiration';

TaskManager.defineTask(TASK_NAME, async () => {
  // Aquí puedes realizar las tareas que deseas ejecutar en segundo plano
  console.log("Tarea en segundo plano ejecutada");
});

export const TimerProvider = ({ children }) => {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [language, setlanguage] = useState('');
  const intervalIdRef = useRef(null);
  const startTimeRef = useRef(null);
  const { eldData, driverStatus, currentDriver, acumulatedVehicleKilometers, lastDriverStatus } = useSelector((state) => state.eldReducer);

  //Aqui obtenemos el idioma seleccionado desde la primera pantalla
  useEffect(() => {
      const getPreferredLanguage = async () => {
         try {
           setlanguage(await AsyncStorage.getItem("preferredLanguage"));
         } catch (error) {
           console.log(error);
         }
      };
      getPreferredLanguage();
  }, []);

  // Registra la tarea en segundo plano
  useEffect(() => {
    const registerBackgroundFetch = async () => {
      const status = await BackgroundFetch.getStatusAsync();
      if (status === BackgroundFetch.Status.Restricted || status === BackgroundFetch.Status.Denied) {
        console.warn('Background fetch is unavailable for this app.');
        return;
      }

      await BackgroundFetch.registerTaskAsync(TASK_NAME, {
        minimumInterval: 60, // Tiempo mínimo entre ejecuciones en segundos
        stopOnTerminate: false, // Permite que la tarea continúe ejecutándose después de cerrar la aplicación
        startOnBoot: true, // Permite que la tarea se inicie automáticamente al reiniciar el dispositivo
      });
    };

    registerBackgroundFetch();

    return () => {
      BackgroundFetch.unregisterTaskAsync(TASK_NAME);
    };
  }, []);

  const convertElapsedTime = (currentTimeStamp, previousTimeStamp) => {
    const secondsDiff = currentTimeStamp - previousTimeStamp;
    const minutes = Math.floor(secondsDiff / 60);
    return minutes;
  };

  const startTimer = () => {
    if (!isTimerRunning) {
      console.log("temporizador iniciado");
      setIsTimerRunning(true);
      startTimeRef.current = Math.floor(Date.now() / 1000);
      intervalIdRef.current = setInterval(() => {
        checkTimerExpiration();
      }, 60000);
    } else {
      console.warn("El temporizador ya se está ejecutando");
    }
  };
  
  const restartTimer = () => {
    console.log("temporizador reiniciado")
    startTimeRef.current = Math.floor(Date.now() / 1000);
    setIsTimerRunning(false);
    setIsTimerRunning(true);
  };

  const stopTimer = () => {
    if (isTimerRunning) {
      console.log("temporizador detenido");
      setIsTimerRunning(false);
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    } else {
      console.warn("El temporizador ya está detenido");
    }
  };

  const checkTimerExpiration = async () => {
    const actualTime = Math.floor(Date.now() / 1000);
    const minutesDiff = convertElapsedTime(actualTime, startTimeRef.current);
    console.log("Minutos transcurridos:", minutesDiff);

    if (minutesDiff >= 60) {
      await AsyncStorage.getItem("lastEvent").then(async (lastEvent) => {
        if (lastEvent) {
          const lastEventParsed = JSON.parse(lastEvent);
          await postDriverEvent(
            {
              recordStatus: 1,
              recordOrigin: 1,
              type: getEventTypeCode(lastEventParsed?.tempDriverStatus).type,
              code: getEventTypeCode(lastEventParsed?.tempDriverStatus).code,
            },
            languageModule.lang(language, "60minutesofinactivity"),
            lastEventParsed?.tempDriverStatus,
            lastEventParsed?.currentDriver,
            lastEventParsed?.eldData,
            lastEventParsed?.acumulatedVehicleKilometers,
            lastEventParsed?.lastDriverStatus,
            lastEventParsed?.location
          )
            .then(async () => {
              restartTimer();
            })
            .catch((err) => {
              console.error("Error al postear evento de inactividad:", err);
            });
        }
      });
    } 
  };

  return (
    <TimerContext.Provider value={{ startTimer, restartTimer, stopTimer }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer debe ser utilizado dentro de TimerProvider');
  }
  return context;
};
