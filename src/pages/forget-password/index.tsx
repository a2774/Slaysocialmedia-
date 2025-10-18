/* eslint-disable @next/next/no-css-tags */
import { saveProfileToLocalStorage } from "@/utils/cart";
import { primaryColor } from "@/utils/helpers";
import { setUserTokens } from "@/utils/services/local-storage/Auth";
import {
  CircularProgress,
  IconButton,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import {
  useGoogleLogin,
  GoogleLogin,
  CredentialResponse,
} from "@react-oauth/google";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  ForgetPasswordThunk,
  ResetPasswordThunk,
  UserLoginThunk,
} from "../../store/reducers/userSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { Token, Visibility, VisibilityOff } from "@mui/icons-material";
import AuthLayout from "@/components/layout/AuthLayout";
import Link from "next/link";
import Layout from "@/components/layout";
// import googleIcon from "/assets/images/google.svg";

export default function Login() {
  const { handleSubmit, register, watch } = useForm();

  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const [showPassword, setShowPassword] = useState(false);
  const [isForgetPassword, setIsForgetPassword] = useState(false);
  const [isVerifyOtp, setIsVerifyOtp] = useState(false);
  const { isLoading } = useSelector((state: any) => state.user);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  //   const navigate = useNavigate();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("profile");
    if (token) {
      // router.push("/");
      window.location.assign("/");
    }
  }, [router]);

  const emailValue = watch("email");
  const isButtonDisabled = !emailValue;

  const onSendOtp = async (formData: any) => {
    if (isButtonDisabled) {
      return;
    }

    const response = await dispatch(ForgetPasswordThunk(formData));

    if (response.type === "user/forgetPassword/fulfilled") {
      router.push("/reset-password");
    }

    // setIsForgetPassword(false);
    // setIsVerifyOtp(true);
  };

  return (
    <Layout>
      <div className="login-section padding-top padding-bottom">
        <div className=" container">
          <div className="row g-5 align-items-center flex-md-row-reverse">
            <div className="col-lg-5">
              <div
                className="account-wrapper"
                style={{
                  marginTop: "100px",
                }}
              >
                <form
                  className="account-form"
                  onSubmit={handleSubmit(onSendOtp)}
                >
                  <div className="form-floating mb-3">
                    <OutlinedInput
                      type="email"
                      // className="form-control"
                      style={{
                        width: "100%",
                      }}
                      id="floatingInput"
                      placeholder="Enter your email"
                      {...register("email")}
                      // label="Email address"
                    />
                  </div>

                  <div className="form-group">
                    <button
                      className="d-block default-btn move-top"
                      style={{
                        background: `${primaryColor}`,
                        cursor: isButtonDisabled ? "no-drop" : "pointer",
                      }}
                    >
                      <span>
                        {isLoading ? (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: "4px",
                            }}
                          >
                            <CircularProgress />
                          </div>
                        ) : (
                          "Send Otp"
                        )}
                      </span>
                    </button>
                  </div>
                </form>
                <div className="input-seller-btn">
                  <p>
                    Don’t have an account yet?{"  "}
                    <Link
                      href="/signup"
                      style={{
                        color: `${primaryColor}`,
                      }}
                      // onClick={() => navigate("/seller/signup")}
                    >
                      Register
                    </Link>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="account-img">
                <img src="assets/images/account/01.png" alt="shape-image" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
