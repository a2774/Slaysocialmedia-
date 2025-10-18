import axiosInstance, { BASE_URL } from "@/axios/axiosInstance";
import { countries, primaryColor } from "@/utils/helpers";
import {
  Box,
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useWeb3ModalAccount } from "@web3modal/ethers5/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function BillingInfo() {
  const [profileData, setProfileData] = useState<any>({});
  const [profileRecord, setprofileRecord] = useState({
    name: "",
    street: "",
    postalCode: "",
    country: "",
    city: "",
  });

  const [loading, setLoading] = useState(false);

  const { address } = useWeb3ModalAccount();

  const handleInputChange = (e: any) => {
    console.log("eeee", e.target);
    const { name, value } = e.target;

    setprofileRecord((prev) => ({ ...prev, [name]: value }));
  };

  const getProfile = async () => {
    // setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/freename/getRegistrant`
      );

      setProfileData(response.data.result);

      console.log("first", response.data.result);
      setprofileRecord({
        name: response.data.result?.name || "",
        street: response.data.result?.registrantStreet || "",
        postalCode: response.data.result?.postalCode || "",
        country: response.data.result?.country || "",
        city: response.data.result?.city || "",
      });
      //   setDomainsList(response.data.domains);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const errorMessage =
          e.response?.data?.message || "An unknown error occurred";

        toast.error(`${errorMessage}`, {
          position: "top-right",
          style: {
            top: "120px", // Adjusts the position slightly above the bottom
          },
        });
        if (e.response?.data?.cause === "registrantProfile") {
          // setCreateProfile(true);
        }
      } else {
        toast.error("An unexpected error occurred", {
          position: "top-right",
          style: {
            top: "120px", // Adjusts the position slightly above the bottom
          },
        });
      }
    }
    // setIsLoading(false);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    console.log("eee", e);
    try {
      const response = await axiosInstance.patch(
        `${BASE_URL}/freename/updateRegistrant`,
        {
          ...profileRecord,
          // walletAddress: address ? address : "",
        }
      );
      toast.success(`Saved details`, {
        position: "top-right",
        style: {
          top: "120px", // Adjusts the position slightly above the bottom
        },
      });
      getProfile();

      //   setCompletePayment(true);
      //   setDomainsList(response.data.domains);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const errorMessage =
          e.response?.data?.message || "An unknown error occurred";
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
    }
    setLoading(false);
  };

  useEffect(() => {
    getProfile();
  }, []);
  console.log(
    "profileData",

    profileRecord.street,
    profileData.registrantStreet
  );
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        padding: { xs: "16px", md: "24px" },
      }}
    >
      <Typography
        variant="h5"
        // color="black"
        sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}
      >
        Set your billing info
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
          label="Enter Name"
          name="name"
          value={profileRecord?.name}
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

        <TextField
          fullWidth
          margin="normal"
          label="Enter Street"
          name="street"
          //   value={dnsRecord.companyName}
          value={profileRecord?.street}
          onChange={handleInputChange}
          // required
          style={{
            backgroundColor: "#465A7E66",
            color: "white !important",
            // border: "none",
            borderRadius: "8px",
          }}
          InputProps={{
            style: { color: "white" }, // Changes input text color to white
          }}
          InputLabelProps={{
            style: { color: "white" }, // Changes label text color to white
          }}
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
          label="Postal Code"
          name="postalCode"
          value={profileRecord?.postalCode}
          //   value={dnsRecord.companyAddress}
          onChange={handleInputChange}
          // required
          style={{
            backgroundColor: "#465A7E66",
            color: "white !important",
            // border: "none",
            borderRadius: "8px",
            marginRight: "20px",
          }}
          InputProps={{
            style: { color: "white" }, // Changes input text color to white
          }}
          InputLabelProps={{
            style: { color: "white" }, // Changes label text color to white
          }}
        />

        <TextField
          fullWidth
          select
          margin="normal"
          label="Country"
          name="country"
          //   value={dnsRecord.companyCountry}
          value={profileRecord?.country}
          onChange={handleInputChange}
          // required
          style={{
            backgroundColor: "#465A7E66",
            color: "white !important",
            // border: "none",
            borderRadius: "8px",
          }}
          InputProps={{
            style: { color: "white" }, // Changes input text color to white
          }}
          InputLabelProps={{
            style: { color: "white" }, // Changes label text color to white
          }}
        >
          {countries.map((country, index) => (
            <MenuItem key={index} value={country.value}>
              {country.label}
            </MenuItem>
          ))}
        </TextField>
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
          label="Enter your city"
          name="city"
          //   value={dnsRecord.companyCity}
          onChange={handleInputChange}
          value={profileRecord?.city}
          // required
          style={{
            backgroundColor: "#465A7E66",
            color: "white !important",
            // border: "none",
            borderRadius: "8px",
            marginRight: "20px",
          }}
          InputProps={{
            style: { color: "white" }, // Changes input text color to white
          }}
          InputLabelProps={{
            style: { color: "white" }, // Changes label text color to white
          }}
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
            marginTop: 2,
            width: "160px",

            color: "#fff",

            height: "50px",
            cursor:
              !profileRecord.name ||
              !profileRecord.country ||
              !profileRecord.city ||
              !profileRecord.postalCode ||
              !profileRecord.street ||
              (profileRecord.name === profileData.name &&
                profileRecord.postalCode === profileData.postalCode &&
                profileRecord.country === profileData.country &&
                profileRecord.city === profileData.city &&
                profileRecord.street === profileData.registrantStreet)
                ? "no-drop" // Apply not-allowed cursor when disabled
                : "pointer",
          }}
          disabled={
            !profileRecord.name ||
            !profileRecord.country ||
            !profileRecord.city ||
            !profileRecord.postalCode ||
            !profileRecord.street ||
            (profileRecord.name === profileData.name &&
              profileRecord.postalCode === profileData.postalCode &&
              profileRecord.country === profileData.country &&
              profileRecord.city === profileData.city &&
              profileRecord.street === profileData.registrantStreet)
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
            "Add"
          )}
        </button>
      </Box>
    </Box>
  );
}

export default BillingInfo;
