import { isImmutable } from "immutable";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

import globalConfig from "./global";
// import configApi from '../config/api';
import axios from "axios";
import { MainUrl } from "../utils/MainUrl";
import { Alert } from "react-native/types";
// import configureStore from "../../src/config-store";

const axiosAPI = axios.create({
  baseURL: MainUrl,
  headers: {
    "Content-Type": "application/json",
  },
});
/**
 * Get method
 * @param url
 * @returns {Promise<R>}
 */
const get = async (url, options = {}) => {
  // console.log("🚀 ~ file: fetch.js ~ line 14 ~ get ~ GETurl", url);
  const token = await AsyncStorage.getItem("@token");
  // console.log("Fetch_url_getapi", url,  token);
  return new Promise((resolve, reject) => {
    axiosAPI
      .get(`${MainUrl + url}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((result) => {
        console.log("GET_result", result);
        if (result.status == 200) {
          resolve(result);
        } else {
          reject("Network error, Please try again later.");
        }
      })
      .catch((err) => {
        console.log(
          "🚀 ~ file: Sidebar.js ~ line 391 ~ axios.get ~ result",
          err
        );
      });
  });
};

/**
 * Post method
 * @param url
 * @param data
 * @param method
 * @param token
 * @returns {Promise<R>}
 */
// const sinUpVerifyOtp = useSelector(state => state?.auth.get('signUpVerifyOtp'));
// var token = sinUpVerifyOtp?.token;

// const data = useSelector((state) => state?.auth);
// const token = data.get("signUpVerifyOtpSuccss").token;

const post = async (url, data) => {
  let token = await AsyncStorage.getItem("@userDetails");
  if (token) {
    token = JSON.parse(token);
  }
  // alert(JSON.stringify(token?.token));
  return new Promise((resolve, reject) => {
    axiosAPI
      .post(`${MainUrl + url}`, data, {
        headers: { Authorization: `Bearer ${token?.token}` },
      })
      .then((result) => {
        console.log("result", result?.data);
        if (result.status == 200) {
          resolve(result);
        } else {
          reject("Network error, Please try again later.");
        }
      })
      .catch((err) => {
        if (err?.response) {
          reject(err?.response?.data?.message);
        } else {
          reject("Network error, Please try again later.");
        }
      });
  });
};

// post_Without_Token:

const post_Without_Token = (url, data) => {
  // console.log("url, data", url, data)
  return new Promise((resolve, reject) => {
    axiosAPI
      .post_Without_Token(`${MainUrl + url}`, data)
      .then((result) => {
        console.log("result_Without_Token", result);
        if (result.status == 200) {
          resolve(result);
        } else {
          reject("Network error, Please try again later.");
        }
      })
      .catch((err) => {
        if (err?.response) {
          reject(err?.response?.data?.message);
        } else {
          reject("Network error, Please try again later.");
        }
      });
  });
};

export default {
  get,
  post: (url, data, token) => post(url, data, token),
  put: (url, data) => post(url, data, "PUT"),
  post_Without_Token: (url, data) => post_Without_Token(url, data),
};
