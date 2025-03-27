import axios from "axios";
import configureStore from "../store/configureStore";
import { tokenActions } from "../store/constants/token";
import { refreshToken } from "../utils/refreshToken";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

const instance = axios.create({
  baseURL: API_BASE_URL,
});

// response parse
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.log("API error response", error.response?.data);
      const { status, message } = error.response?.data;
      if (status === 401 && message === "Token expired") {
        refreshToken();
        configureStore().store.dispatch({
          type: tokenActions.TOKENS_EXPIRED,
        });
      }
      return error.response?.data;
    } else {
      return Promise.reject(error);
    }
  }
);

export default instance;
