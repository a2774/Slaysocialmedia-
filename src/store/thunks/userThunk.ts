import { toast } from "react-toastify";
import axios from "axios";
// import axiosInstance from "../../axios/AxiosInstance";
// import { clearUserTokens } from "../../utils/services/local-storage/Auth";
import { setUserTokens } from "@/utils/services/local-storage/Auth";
import { saveProfileToLocalStorage } from "@/utils/cart";
import { useRouter } from "next/router";
import { PRODUCTION_API_URL, STAGING_API_URL } from "@/utils/helpers";

const baseUrl = PRODUCTION_API_URL;
// `https://api.singhcoin.io`;
// `https://staging-api.singhcoin.io`;
// `https://api.singhcoin.io`;
// `http://35.179.2.23:3001`;
// const router = useRouter();

export const UserLogin = async (data: any) => {
  try {
    const response = await axios.post(`${baseUrl}/user/login`, {
      email: data.email,
      password: data.password,
    });

    setUserTokens(response.data);
    saveProfileToLocalStorage(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // if(error.response?.data?.activate)
      // {

      // }

      const errorMessage = error.response?.data?.activate
        ? error.response?.data?.activate
        : error.response?.data?.error || "An unknown error occurred";
      toast.error(`${errorMessage}`, {
        position: "top-right",
        style: {
          top: "120px", // Adjusts the position slightly above the bottom
        },
      });
    } else {
      toast.error("An unexpected error occurred", {
        position: "top-right",
        style: {
          top: "120px", // Adjusts the position slightly above the bottom
        },
      });
    }
    throw error;
  }
};

export const UserSignup = async (data: any) => {
  try {
    const response = await axios.post(`${baseUrl}/user/sign-up`, data);

    localStorage.setItem("email", JSON.stringify({ email: data?.email }));

    return response; // Handle the API response here
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.error || "An unknown error occurred";
      toast.error(`${errorMessage}`, {
        position: "top-right",
        style: {
          top: "120px", // Adjusts the position slightly above the bottom
        },
      });
    } else {
      toast.error("An unexpected error occurred", {
        position: "top-right",
        style: {
          top: "120px", // Adjusts the position slightly above the bottom
        },
      });
    }
    throw error;
  }
};

export const UserVerifyOtp = async (data: any) => {
  const emailData = localStorage.getItem("email");
  const localStorageUserData = emailData ? JSON.parse(emailData) : {};
  try {
    const response = await axios.post(`${baseUrl}/user/validate-otp`, {
      email: localStorageUserData.email,
      otp: Number(data.otp),
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.error || "An unknown error occurred";
      toast.error(`${errorMessage}`, {
        position: "top-right",
        style: {
          top: "120px", // Adjusts the position slightly above the bottom
        },
      });
    } else {
      toast.error("An unexpected error occurred", {
        position: "top-right",
        style: {
          top: "120px", // Adjusts the position slightly above the bottom
        },
      });
    }
    throw error;
  }
};

export const ForgetPassword = async (data: any) => {
  try {
    const response = await axios.get(
      `${baseUrl}/user/forget-password/${data.email}`
    );

    toast.success(`${response.data.message}`, {
      position: "top-right",
      style: {
        top: "120px",
        // zIndex: 99999,
      },
    });
    return response.data;
  } catch (error) {
    console.log("errpr", error);
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.error || "An unknown error occurred";
      toast.error(`${errorMessage}`, {
        position: "top-right",
        style: {
          top: "120px",
          // zIndex: 99999,
        },
      });
    } else {
      toast.error("An unexpected error occurred", {
        position: "top-right",
        style: {
          top: "120px",
          // zIndex: 99999,
        },
      });
    }
    throw error;
  }
};

export const ResetPassword = async (data: any) => {
  try {
    const response = await axios.post(
      `${baseUrl}/user/reset-password-otp`,
      data
    );

    toast.success(`${response.data.message}`, {
      position: "top-right",
      style: {
        top: "120px",
        // zIndex: 99999,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.error || "An unknown error occurred";
      toast.error(`${errorMessage}`, {
        position: "top-right",
        style: {
          top: "120px", // Adjusts the position slightly above the bottom
        },
      });
    } else {
      toast.error("An unexpected error occurred", {
        position: "top-right",
        style: {
          top: "120px", // Adjusts the position slightly above the bottom
        },
      });
    }
    throw error;
  }
};
