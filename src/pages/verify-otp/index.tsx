/* eslint-disable @next/next/no-css-tags */
import { primaryColor } from "@/utils/helpers";
import { CircularProgress } from "@mui/material";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { UserVerifyOtpThunk } from "../../store/reducers/userSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";

import AuthLayout from "@/components/layout/AuthLayout";
import Link from "next/link";
import Layout from "@/components/layout";

export default function VerifyOtp() {
  const { handleSubmit, register, watch } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  //   const navigate = useNavigate();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    setIsLoading(true);

    const res = await dispatch(UserVerifyOtpThunk(data));
    if (res.type === "/user/verify/fulfilled") {
      router.push("/login");
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

  const buttonStyle = {
    background: primaryColor,
    ...(watch("otp") ? {} : { cursor: "not-allowed" }),
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
                <p>
                  Verify your account and enjoy the best experience with us !
                </p>
                <form
                  className="account-form"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="form-floating mb-3">
                    <input
                      type="otp"
                      className="form-control"
                      id="floatingInput"
                      placeholder="Otp"
                      {...register("otp")}
                    />
                    <label>Verify Otp</label>
                  </div>

                  <div className="form-group">
                    <button
                      className="d-block default-btn move-top"
                      style={buttonStyle}
                      disabled={watch("otp") ? false : true}
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
                          "Verify Otp"
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
                    >
                      Login
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
