import axios from "axios";

 export const axiosURL = "https://06ea-2806-10ae-17-c065-f4b6-77fd-6e18-f228.ngrok-free.app/dumax-eld/us-central1/userApp";
// export const axiosURL ="https://us-central1-dumax-eld.cloudfunctions.net/userApp";
// export const axiosURL = "http://localhost:5000/dumax-eld/us-central1/userApp";
// export const axiosURL = "http://192.168.100.4:5001/dumax-eld/us-central1/userApp";

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
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
      return errorCode, errorMessage;
    });
};
