import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { eld, getEventTypeCode, postDriverEvent } from "../data/commonQuerys";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
const languageModule = require('../global_functions/variables');
import { currentCMV, getCurrentDriver } from "../config/localStorage";
import { eldAccuracy, lastEldData } from "../config/localStorage";

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {

  const [language, setLanguage] = useState('');
  const intervalIdRef = useRef(null);
  const startTimeRef = useRef(null);
  const {eldData,driverStatus,currentDriver,acumulatedVehicleKilometers,lastDriverStatus} = useSelector((state) => state.eldReducer);
  
  useEffect(() => {
    const getPreferredLanguage = async () => {
      try {
        setLanguage(await AsyncStorage.getItem("preferredLanguage"));
      } catch (error) {
        console.error("Error al obtener el idioma:", error);
      }
    };
    getPreferredLanguage();
  }, [language]);

  const convertElapsedTime = (currentTimeStamp, previousTimeStamp) => {
    const secondsDiff = currentTimeStamp - previousTimeStamp;
    const minutes = Math.floor(secondsDiff / 60);
    return minutes;
  };

  function convertirTimestampAFechaYHora(timestamp) {
    try {
      const date = new Date(timestamp * 1000);
      const dia = date.getDate();
      const mes = date.getMonth() + 1;
      const año = date.getFullYear();
      const horas = date.getHours();
      const minutos = date.getMinutes();
      const diaFormatado = dia.toString().padStart(2, '0');
      const mesFormatado = mes.toString().padStart(2, '0');
      const horasFormatadas = horas.toString().padStart(2, '0');
      const minutosFormatados = minutos.toString().padStart(2, '0');

      const fechaHoraFormateada = `${diaFormatado}/${mesFormatado}/${año} - ${horasFormatadas}:${minutosFormatados}`;

      return fechaHoraFormateada;
    } catch (error) {
      console.error("Error al convertir timestamp a fecha y hora:", error);
      return "Error al convertir timestamp";
    }
  }

  const startTimer = () => {
    if (intervalIdRef.current === null) {
      //Iniciamos el temporizador
      startTimeRef.current = Math.floor(Date.now() / 1000);
      intervalIdRef.current = setTimeout(() => {
        checkTimerExpiration();
      }, 60000); // 60000 milisegundos = 1 minuto
    } else {
      console.warn("El temporizador ya se ejectua");
    }
  };

  const restartTimer = () => {
    //Aqui reiniciamos el temporizador
    if (intervalIdRef.current !== null) {
      clearTimeout(intervalIdRef.current);
      intervalIdRef.current = null;
      startTimer();
    } else {
      console.warn("No hay temporizador para reiniciar.");
    }
  };

  const checkTimerExpiration = async () => {
    //Aqui checamos el tiempo transcurrido y comparamos con el tiempo de inicio y de ahi posteamos el evento
    const actualTime = Math.floor(Date.now() / 1000);
    const minutesDiff = convertElapsedTime(actualTime, startTimeRef.current);
    console.log("Actual:", convertirTimestampAFechaYHora(actualTime), "Inicio:", convertirTimestampAFechaYHora(startTimeRef.current), "Diferencia:", minutesDiff);
    if (minutesDiff === 59) {
      return await getCurrentDriver()
      .then(async (currentDriver) => {
        await postDriverEvent(
            {
            recordStatus: 1,
            recordOrigin: 1,
            type: getEventTypeCode(driverStatus).type,
            code: getEventTypeCode(driverStatus).code,
            },
            languageModule.lang(language, "60minutesofinactivity"),
            driverStatus,
            currentDriver,
            eldDatas,
            acumulatedVehicleKilometers,
            lastDriverStatus
          ).then(async () => { 
                 
          restartTimer();
          })
          .catch((err) => {
            console.error("Error al postear evento de inactividad:", err);
          });
        }
      )     
    }
  };

  const stopTimer = () => {
    console.log('Deteniendo el temporizador...', intervalIdRef.current);
    if (intervalIdRef.current !== null) {
      clearTimeout(intervalIdRef.current);
      intervalIdRef.current = null;
    } else {
      console.warn("No hay temporizador para detener.");
    }
  };

  const statusActual = () => {
    console.log('Estado actual:', {
      startTime: startTimeRef.current,
      intervalId: intervalIdRef.current,
    });
  };

  return (
    <TimerContext.Provider value={{ startTimer, restartTimer, stopTimer, checkTimerExpiration, statusActual}}>
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
