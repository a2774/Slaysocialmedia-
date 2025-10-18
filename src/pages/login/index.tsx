/* eslint-disable @next/next/no-css-tags */
import { saveProfileToLocalStorage } from "@/utils/cart";
import { primaryColor } from "@/utils/helpers";
import {
  getUserTokens,
  setUserTokens,
} from "@/utils/services/local-storage/Auth";
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
import { BASE_URL } from "@/axios/axiosInstance";
// import googleIcon from "/assets/images/google.svg";

export default function Login() {
  const { handleSubmit, register, watch } = useForm();
  // const [isLoading, setIsLoading] = useState(false);
  const { isLoading, activate } = useSelector((state: any) => state.user);
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const [showPassword, setShowPassword] = useState(false);
  const [isForgetPassword, setIsForgetPassword] = useState(false);
  const [isVerifyOtp, setIsVerifyOtp] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  //   const navigate = useNavigate();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    // setIsLoading(true);

    const res = await dispatch(UserLoginThunk(data));

    if (res.type === "/user/login/fulfilled") {
      router.push("/");
    }

    // router.push("/");
    // window.location.assign("/");
    // setIsLoading(false);
  };

  const login = useGoogleLogin({
    onSuccess: async (codeResponse: any) => {
      // setUser(codeResponse);

      if (codeResponse) {
        console.log("##coderes", codeResponse);

        try {
          const tokens = await axios.post(`${BASE_URL}/user/google/login`, {
            access_token: codeResponse.access_token,
          });
          console.log("#tokens", tokens);
          setUserTokens(tokens.data);
          saveProfileToLocalStorage(tokens.data);

          if (tokens.data) {
            window.location.assign("/");
            // router.push("/");
          }
        } catch (e) {
          console.log("errrr");
        }
      }
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    const token = localStorage.getItem("profile");
    if (token) {
      // router.push("/");
      window.location.assign("/");
    }
  }, [router]);

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
                <h2>Hello there</h2>
                <p>
                  Login to your account and enjoy the best experience with us !
                </p>
                <form
                  className="account-form"
                  onSubmit={handleSubmit(onSubmit)}
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
                    {/* <label>Email address</label> */}
                  </div>
                  <div className="form-floating">
                    <OutlinedInput
                      id="outlined-adornment-password"
                      type={showPassword ? "text" : "password"}
                      style={{
                        width: "100%",
                      }}
                      placeholder="Enter your password"
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            sx={{
                              color: "white",
                            }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      {...register("password")}
                      // label="Password"
                    />
                    {/* <input
                      type="password"
                      className="form-control"
                      id="floatingPassword"
                      placeholder="Password"
                      {...register("password")}
                    /> */}
                    {/* <label>Password</label> */}
                  </div>
                  <div className="form-group">
                    <div className="d-flex justify-content-between flex-wrap pt-sm-2">
                      <Link href={"/forget-password"}>Forgot Password?</Link>
                      {/* <a href="forgot-pass.html">Forgot Password?</a> */}
                    </div>
                  </div>
                  <div className="form-group">
                    <button
                      className="d-block default-btn move-top"
                      style={{
                        background: `${primaryColor}`,
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
                          " Login"
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
                {activate && (
                  <div className="input-seller-btn">
                    <p>
                      <Link
                        href="/reset-password"
                        style={{
                          color: `${primaryColor}`,
                        }}
                        // onClick={() => navigate("/seller/signup")}
                      >
                        Activate Account
                      </Link>
                    </p>
                  </div>
                )}

                <div
                  className="d-block default-btn move-top"
                  style={{
                    width: "100%",
                    marginBottom: "24px",
                    background: `${primaryColor}`,
                    cursor: "pointer",
                    marginTop: "24px",
                  }}
                  onClick={() => login()}
                >
                  <img src={"assets/images/google.svg"} alt="Google Icon" />{" "}
                  <span> Signin With Google</span>
                </div>

                {/* <span
                  className="g_id_signin sign_in_btn_wrapper"
                  data-type="standard"
                  data-shape="rectangular"
                  data-theme="outline"
                  data-text="signin_with"
                  data-size="large"
                  data-logo_alignment="left"
                  data-width="250"
                >
                  <GoogleLogin
                    onSuccess={responseMessage}
                    onError={errorMessage}
                  />
                </span> */}
                {/* 
                <div
                  className="account-bottom"
                  style={{
                    paddingTop: "24px",
                  }}
                >
                  <ul className="social-media social-color lab-ul d-flex justify-content-center">
                    <li>
                      <a href="#" className="facebook">
                        <i className="icofont-facebook"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="twitter">
                        <i className="icofont-twitter"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="linkedin">
                        <i className="icofont-linkedin"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="instagram">
                        <i className="icofont-instagram"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="pinterest">
                        <i className="icofont-pinterest"></i>
                      </a>
                    </li>
                  </ul>
                </div> */}
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
