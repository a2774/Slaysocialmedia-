/* eslint-disable @next/next/no-css-tags */
import { primaryColor } from "@/utils/helpers";
import { CircularProgress } from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { UserSignupThunk } from "../../store/reducers/userSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import AuthLayout from "@/components/layout/AuthLayout";
import Layout from "@/components/layout";
import Link from "next/link";

export default function Signup() {
  const { handleSubmit, register, watch } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  //   const navigate = useNavigate();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    setIsLoading(true);

    const res = await dispatch(UserSignupThunk(data));

    if (res.type === "/user/signup/fulfilled") {
      router.push("/verify-otp");
    }

    setIsLoading(false);
  };

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
                  Register your account and enjoy the best experience with us !
                </p>
                <form
                  className="account-form"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="form-floating mb-3">
                    <input
                      type="username"
                      className="form-control"
                      id="floatingInput"
                      placeholder="username"
                      {...register("username")}
                    />
                    <label>Username</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      className="form-control"
                      id="floatingInput"
                      placeholder="name@example.com"
                      {...register("email")}
                    />
                    <label>Email address</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="password"
                      className="form-control"
                      id="floatingPassword"
                      placeholder="Password"
                      {...register("password")}
                    />
                    <label>Password</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="confirmPassword"
                      className="form-control"
                      id="floatingPassword"
                      placeholder="Confirm password"
                      {...register("confirmPassword")}
                    />
                    <label>Re-enter Password</label>
                  </div>
                  {/* <div className="form-group">
                    <div className="d-flex justify-content-between flex-wrap pt-sm-2">
                      <div className="checkgroup">
                        <input type="checkbox" name="remember" id="remember" />
                        <label>Remember Me</label>
                      </div>

                    </div>
                  </div> */}
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
                          " Signup"
                        )}
                      </span>
                    </button>
                  </div>
                </form>
                <div className="input-seller-btn">
                  <p>
                    Already have an account?{"  "}
                    <Link
                      href="/login"
                      style={{
                        color: `${primaryColor}`,
                      }}
                      // onClick={() => navigate("/seller/signup")}
                    >
                      Login
                    </Link>
                  </p>
                </div>
                {/* <button
                  className="account-form d-block default-btn  "
                  style={{
                    width: "100%",
                    marginBottom: "24px",
                  }}
                  onClick={() => login()}
                >
                  <img src={"assets/images/google.svg"} alt="Google Icon" />{" "}
                  <span> Signin With Google</span>
                </button> */}
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
