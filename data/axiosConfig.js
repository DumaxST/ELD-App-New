import axios from "axios";

export const axiosURL = process.env.ELD_API;

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
