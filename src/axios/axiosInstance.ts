import { getProfileFromLocalStorage } from "@/utils/cart";
import { PRODUCTION_API_URL, STAGING_API_URL } from "@/utils/helpers";
import {
  getUserTokens,
  UnAuthLogoutUser,
  updateUserAccessToken,
} from "@/utils/services/local-storage/Auth";
import axios from "axios";
// import { toast } from "react-toastify";
// import { toast } from "react-hot-toast";
// import {
//   UnAuthLogoutUser,
//   getUserTokens,
//   updateUserAccessToken,
// } from "../utils/services/local-storage/Auth";
// import { UnAuthLogoutUser, getUserTokens, updateUserAccessToken } from "../utils/services/Auth";

export const BASE_URL = PRODUCTION_API_URL;
// `https://api.singhcoin.io`;
// `https://staging-api.singhcoin.io`;
// `https://api.singhcoin.io`;
// `https://api.singhcoin.io`;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const axiosTokenInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = getProfileFromLocalStorage()?.Token;
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImVtYWlsIjoiZGVmaWV4cGVydHNAZ21haWwuY29tIn0sImlhdCI6MTcyMjg4NzI1M30.NFLpMw7nVyy4gh4fy5j3Lh6AeZ5bvjSBkbSv4v-yrBM";

    //   config.url && config.url.includes("/") ? await getUserTokens() : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401) {
      // toast.error("You are not authorized to access this page");
      // throw Error(401);
      // console.log('UnAuth to access the page',error.response)
    }
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const userType = originalRequest.url.includes("/user") ? "user" : "";

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      //   try {
      //     const newAccessToken = await refreshAccessToken(
      //       originalRequest.url.includes("/user") ? "user" : ""
      //     );
      //     originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      //     return axiosInstance(originalRequest);
      //   } catch (refreshError) {
      //     console.log("Refresh Error:", refreshError);
      //     if (userType === "user") {
      //       //   toast.error("Session Expired! Please Login Again");
      //       UnAuthLogoutUser();
      //     }

      //     console.log(refreshError);
      //     throw refreshError;
      //   }
    }
    return Promise.reject(error);
  }
);

// const refreshAccessToken = async (userType: any) => {
//   try {
//     const token = getUserTokens();
//     console.log("RefreshAccess Token", token);
//     const response = await axiosTokenInstance.post(
//       "/user/seller/v1/refresh_token/",
//       {
//         refresh_token: token?.refresh,
//       }
//     );
//     console.log("RefreshAccess Token API Response", response);

//     const { access_token } = response.data;
//     updateUserAccessToken(access_token);
//     return access_token;
//   } catch (error) {
//     console.log("Error refreshing access token:", error);
//     throw error;
//   }
// };
export default axiosInstance;
