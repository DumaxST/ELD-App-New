import axios from "axios";
import { Alert } from "react-native";

export const axiosURL = process.env.ELD_API;

export const showAlert = (title, message, onOkPress) => {
  Alert.alert(
    title,
    message,
    [
      { text: "Enviar", onPress: onOkPress },
    ],
    { cancelable: false }
  );
};

export const getAxios = async (ref, params) => {
  // axios.defaults.timeout = 30000;
  // axios.defaults.timeoutErrorMessage = "timeout";
  return await axios
    .get(
      `${axiosURL}${ref}`,
      {
        params: params,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Accept: "Application/json",
        },
      }
    )
    .then((res) => {
      // console.log(res);
      return res.data;
    })
    .catch((error) => {
      switch (error.response.status) {
        case 404:
              //si es 404 es un error de conexion o problema con la API
              //le asignaremos un codigo 75
              let codeError = 75;
              showAlert(
                `Error ${error.response.status}`,
                "Por favor presione enviar para notificar a soporte o intente más tarde",
                () => {
                  //Aqui realizaremos una llamada a la api para notificar a admin o a soporte
                  console.log("Enviado...")
                }
              );
              break;
        case 500:
              //si es 500 hay un problema con la red del usuario
              //le asignaremos un codigo 80
              codeError = 80;
              showAlert(
                `Error ${error.response.status}`,
                "El dispositivo no se encuentra conectado a internet, por favor verifique su conexión e intente más tarde",
                () => {
                  //Aqui solo advertiremos pero no haremos nada ya que la app funcionaria tambien offline
                  console.log("OK")
                }
              );
              break;
        case 422:
              //si es 422, hay un error en la validacion de los datos
              //le asignaremos un codigo 66
              codeError = 66;
              showAlert(
                `Error ${error.response.status}`,
                "Por favor presione enviar para notificar a soporte o intente más tarde",
                () => {
                  //Aqui realizaremos una llamada a la api para notificar a admin o a soporte
                  console.log("Enviado...")
                }
              );
              break;
        default:

      }
      const errorCode = error.code;
      const errorMessage = error.message;
      console.warn(JSON.stringify(error));
      console.error(errorCode, errorMessage);
      return errorCode, errorMessage;
    });
};

export const postAxios = async (ref, params) => {
  return await axios
    .post(`${axiosURL}${ref}`, params, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    })
    .catch((error) => {
      switch (error.response.status) {
        case 404:
              //si es 404 es un error de conexion o problema con la API
              //le asignaremos un codigo 75
              let codeError = 75;
              showAlert(
                `Error ${error.response.status}`,
                "Por favor presione enviar para notificar a soporte o intente más tarde",
                () => {
                  //Aqui realizaremos una llamada a la api para notificar a admin o a soporte
                  console.log("Enviado...")
                }
              );
              break;
        case 500:
              //si es 500 hay un problema con la red del usuario
              //le asignaremos un codigo 80
              codeError = 80;
              showAlert(
                `Error ${error.response.status}`,
                "El dispositivo no se encuentra conectado a internet, por favor verifique su conexión e intente más tarde",
                () => {
                  //Aqui solo advertiremos pero no haremos nada ya que la app funcionaria tambien offline
                  console.log("OK")
                }
              );
              break;
        case 422:
          //En post manejo errores con el 422 asi que lo dejaremos pasar y no advertiremos al usuario
          console.log("Manejo de errores en post")
          break
        default:
      }
      const errorCode = error?.code;
      const errorMessage = error?.message;
      console.log("PostError",errorCode, errorMessage);
      return errorCode, errorMessage, error?.response?.data;
    });
};

export const putAxios = async (ref, params) => {
  return await axios
    .put(`${axiosURL}${ref}`, params, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    })
    .catch((error) => {
      switch (error.response.status) {
        case 404:
              //si es 404 es un error de conexion o problema con la API
              //le asignaremos un codigo 75
              let codeError = 75;
              showAlert(
                `Error ${error.response.status}`,
                "Por favor presione enviar para notificar a soporte o intente más tarde",
                () => {
                  //Aqui realizaremos una llamada a la api para notificar a admin o a soporte
                  console.log("Enviado...")
                }
              );
              break;
        case 500:
              //si es 500 hay un problema con la red del usuario
              //le asignaremos un codigo 80
              codeError = 80;
              showAlert(
                `Error ${error.response.status}`,
                "El dispositivo no se encuentra conectado a internet, por favor verifique su conexión e intente más tarde",
                () => {
                  //Aqui solo advertiremos pero no haremos nada ya que la app funcionaria tambien offline
                  console.log("OK")
                }
              );
              break;
        case 422:
              //En post manejo errores con el 422 asi que lo dejaremos pasar y no advertiremos al usuario
              console.log("Manejo de errores en post")
              break
        default:

      }
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
      return errorCode, errorMessage;
    });
};

export const deleteAxios = async (ref, params) => {
  return await axios
    .delete(
      `${axiosURL}${ref}`,
      {
        params: params,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    )
    .catch((error) => {
      switch (error.response.status) {
        case 404:
              //si es 404 es un error de conexion o problema con la API
              //le asignaremos un codigo 75
              let codeError = 75;
              showAlert(
                `Error ${error.response.status}`,
                "Por favor presione enviar para notificar a soporte o intente más tarde",
                () => {
                  //Aqui realizaremos una llamada a la api para notificar a admin o a soporte
                  console.log("Enviado...")
                }
              );
              break;
        case 500:
              //si es 500 hay un problema con la red del usuario
              //le asignaremos un codigo 80
              codeError = 80;
              showAlert(
                `Error ${error.response.status}`,
                "El dispositivo no se encuentra conectado a internet, por favor verifique su conexión e intente más tarde",
                () => {
                  //Aqui solo advertiremos pero no haremos nada ya que la app funcionaria tambien offline
                  console.log("OK")
                }
              );
              break;
        case 422:
              //si es 422, hay un error en la validacion de los datos
              //le asignaremos un codigo 66
              codeError = 66;
              showAlert(
                `Error ${error.response.status}`,
                "Por favor presione enviar para notificar a soporte o intente más tarde",
                () => {
                  //Aqui realizaremos una llamada a la api para notificar a admin o a soporte
                  console.log("Enviado...")
                }
              );
              break;
        default:

      }
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
      return errorCode, errorMessage;
    });
};
