import axiosInstance, { BASE_URL } from "@/axios/axiosInstance";
import {
  ForgetPasswordThunk,
  ResetPasswordThunk,
} from "@/store/reducers/userSlice";
import { getProfileFromLocalStorage } from "@/utils/cart";
import { countries, primaryColor } from "@/utils/helpers";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useWeb3ModalAccount } from "@web3modal/ethers5/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

function UpdatePassword() {
  const [profileData, setProfileData] = useState<any>({});
  const [emailRecord, setEmailRecord] = useState({
    email: getProfileFromLocalStorage()?.email,
  });
  const [otpMode, setOtpMode] = useState(false);
  const [record, setRecord] = useState({
    otp: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  const { address } = useWeb3ModalAccount();

  const handleEmailChange = (e: any) => {
    const { name, value } = e.target;
    setEmailRecord((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (e: any) => {
    console.log("eeee", e.target);
    const { name, value } = e.target;

    setRecord((prev) => ({ ...prev, [name]: value }));
  };

  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  const handleEmailSubmit = async (e: any) => {
    e.preventDefault();
    setEmailLoading(true);
    const response = await dispatch(ForgetPasswordThunk(emailRecord));

    console.log("response", response);
    if (response.type === "user/forgetPassword/fulfilled") {
      setOtpMode(true);
    }

    setEmailLoading(false);
  };

  const onResetPassword = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const response = await dispatch(
      ResetPasswordThunk({
        email: emailRecord?.email,
        password: record.password,
        confirmPassword: record.confirmPassword,
        otp: Number(record.otp),
      })
    );

    console.log("reset response", response);
    setLoading(false);
    if (response.type === "user/resetPassword/fulfilled") {
      setOtpMode(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <>
      {!otpMode && (
        <Box
          component="form"
          onSubmit={handleEmailSubmit}
          sx={{
            padding: { xs: "16px", md: "24px" },
          }}
        >
          <Typography
            variant="h5"
            // color="black"
            sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}
          >
            Edit your password
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
            }}
          >
            <TextField
              fullWidth
              margin="normal"
              label="Enter your email"
              name="email"
              value={emailRecord.email}
              style={{
                backgroundColor: "#465A7E66",
                borderRadius: "8px",
                marginRight: "20px",
              }}
              InputProps={{
                style: { color: "white" }, // Changes input text color to white
              }}
              InputLabelProps={{
                style: { color: "white" }, // Changes label text color to white
              }}
              onChange={handleEmailChange}
              // required
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "flex-end",
            }}
          >
            <button
              // variant="contained"
              // sx={{ mt: 2, width: { xs: "100%", md: "200px" } }}
              type="submit"
              style={{
                backgroundColor: `${primaryColor}`,
                borderRadius: "8px",
                fontWeight: 700,
                // padding: "12px",
                marginTop: 12,
                width: "160px",

                color: "#fff",

                height: "50px",
                cursor: !emailRecord?.email
                  ? "no-drop" // Apply not-allowed cursor when disabled
                  : "pointer",
              }}
              disabled={!emailRecord.email}
            >
              {emailLoading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    // padding: "4px",
                  }}
                >
                  <CircularProgress />
                </div>
              ) : (
                "Send Otp"
              )}
            </button>
          </Box>
        </Box>
      )}
      {otpMode && (
        <Box
          component="form"
          onSubmit={onResetPassword}
          sx={{
            padding: { xs: "16px", md: "24px" },
          }}
        >
          {/* <Typography
        variant="h5"
        // color="black"
        sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}
      >
        Change your password
      </Typography> */}

          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
            }}
          >
            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              margin="normal"
              label="Enter your password"
              name="password"
              value={record?.password}
              style={{
                backgroundColor: "#465A7E66",
                borderRadius: "8px",
                marginRight: "20px",
              }}
              InputProps={{
                endAdornment: (
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
                ),
                style: { color: "white" }, // Changes input text color to white
              }}
              InputLabelProps={{
                style: { color: "white" }, // Changes label text color to white
              }}
              onChange={handleInputChange}
              // required
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
            }}
          >
            <TextField
              fullWidth
              margin="normal"
              label="Confirm your password"
              name="confirmPassword"
              value={record?.confirmPassword}
              style={{
                backgroundColor: "#465A7E66",
                borderRadius: "8px",
                marginRight: "20px",
              }}
              InputProps={{
                style: { color: "white" }, // Changes input text color to white
              }}
              InputLabelProps={{
                style: { color: "white" }, // Changes label text color to white
              }}
              onChange={handleInputChange}
              // required
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
            }}
          >
            <TextField
              fullWidth
              margin="normal"
              label="Enter OTP"
              name="otp"
              value={record?.otp}
              style={{
                backgroundColor: "#465A7E66",
                borderRadius: "8px",
                marginRight: "20px",
              }}
              InputProps={{
                style: { color: "white" }, // Changes input text color to white
              }}
              InputLabelProps={{
                style: { color: "white" }, // Changes label text color to white
              }}
              onChange={handleInputChange}
              // required
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "flex-end",
            }}
          >
            <button
              // variant="contained"
              // sx={{ mt: 2, width: { xs: "100%", md: "200px" } }}
              type="submit"
              style={{
                backgroundColor: `${primaryColor}`,
                borderRadius: "8px",
                fontWeight: 700,
                // padding: "12px",
                marginTop: 12,
                width: "160px",

                color: "#fff",

                height: "50px",
                cursor:
                  !record.password || !record.confirmPassword || !record.otp
                    ? "no-drop" // Apply not-allowed cursor when disabled
                    : "pointer",
              }}
              disabled={
                !record.password || !record.confirmPassword || !record.otp
              }
            >
              {loading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    // padding: "4px",
                  }}
                >
                  <CircularProgress />
                </div>
              ) : (
                "Save Changes"
              )}
            </button>
          </Box>
        </Box>
      )}
    </>
  );
}

export default UpdatePassword;
