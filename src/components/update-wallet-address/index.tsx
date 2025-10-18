import axiosInstance, { BASE_URL } from '@/axios/axiosInstance';
import { countries, primaryColor } from '@/utils/helpers';
import { Box, CircularProgress, MenuItem, TextField, Typography } from '@mui/material';
import { useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers5/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function UpdateWalletAddress() {
  const [profileData, setProfileData] = useState<any>({});
  const [profileRecord, setprofileRecord] = useState({
    walletAddress: '',
  });

  const [loading, setLoading] = useState(false);

  const { address, isConnected } = useWeb3ModalAccount();
  const { open: openWallet, close } = useWeb3Modal();

  const handleInputChange = (e: any) => {
    console.log('eeee', e.target);
    const { name, value } = e.target;

    setprofileRecord((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    openWallet();
    e.preventDefault();
    setLoading(true);
    // updateAddressFunction(address)
    // console.log("eee", e);
    // try {
    //   const response = await axiosInstance.post(
    //     `${BASE_URL}/freename/createRegistrant`,
    //     {
    //       ...profileRecord,
    //       walletAddress: address ? address : "",
    //     }
    //   );
    //   toast.success(`Saved details`, {
    //     position: "top-right",
    //     style: {
    //       top: "150px", // Adjusts the position slightly above the bottom
    //     },
    //   });
    //   getProfile();

    //   //   setCompletePayment(true);
    //   //   setDomainsList(response.data.domains);
    // } catch (e) {
    //   if (axios.isAxiosError(e)) {
    //     const errorMessage =
    //       e.response?.data?.message || "An unknown error occurred";
    //     toast.error(`${errorMessage}`, { position: "top-center" });
    //   } else {
    //     toast.error("An unexpected error occurred", {
    //       position: "top-center",
    //     });
    //   }
    // }
    setLoading(false);
  };

  const updateAddressFunction = async (address: string) => {
    try {
      const response = await axiosInstance.post(`${BASE_URL}/user/update-walletAddress`, {
        walletAddress: address,
      });
      toast.success(`Added Wallet Address`, {
        position: 'top-right',
        style: {
          top: '120px', // Adjusts the position slightly above the bottom
        },
      });

      //   setCompletePayment(true);
      //   setDomainsList(response.data.domains);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const errorMessage = e.response?.data?.message || 'An unknown error occurred';
        toast.error(`${errorMessage}`, {
          position: 'top-right',
          style: {
            top: '120px', // Adjusts the position slightly above the bottom
          },
        });
      } else {
        toast.error('An unexpected error occurred', {
          position: 'top-right',
          style: {
            top: '120px', // Adjusts the position slightly above the bottom
          },
        });
      }
    }
  };

  useEffect(() => {
    if (address) {
      localStorage.setItem('currentWallet', address);
    }
    if (address && address !== localStorage.getItem('currentWallet')) updateAddressFunction(address);
    setprofileRecord((prev: any) => ({ ...prev, walletAddress: address }));
  }, [address]);

  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
      sx={{
        padding: { xs: '16px', md: '24px' },
      }}>
      <Typography
        variant='h5'
        // color="black"
        sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
        Add your wallet address
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: {
            xs: 'column',
            sm: 'row',
          },
        }}>
        {isConnected && (
          <TextField
            fullWidth
            margin='normal'
            label='Wallet Address'
            name='name'
            value={isConnected && address ? address : ''}
            style={{
              backgroundColor: '#465A7E66',
              borderRadius: '8px',
              marginRight: '20px',
              color: 'white',
            }}
            InputProps={{
              style: { color: 'white' },
              readOnly: true, // Changes input text color to white
            }}
            InputLabelProps={{
              style: { color: 'white' }, // Changes label text color to white
            }}
            //   disabled
            //   onChange={handleInputChange}
            // required
          />
        )}
      </Box>

      <Box
        sx={{
          display: 'flex',
          width: '100%',
          paddingTop: '40px',
          justifyContent: 'center',
        }}>
        <button
          // variant="contained"
          // sx={{ mt: 2, width: { xs: "100%", md: "200px" } }}
          type='submit'
          style={{
            backgroundColor: `${primaryColor}`,
            borderRadius: '8px',
            fontWeight: 700,
            // padding: "12px",
            marginTop: 2,
            width: '160px',

            color: '#fff',

            height: '50px',
            // cursor:
            //   !profileRecord.name ||
            //   !profileRecord.country ||
            //   !profileRecord.city ||
            //   !profileRecord.postalCode ||
            //   !profileRecord.street ||
            //   (profileRecord.name === profileData.name &&
            //     profileRecord.postalCode === profileData.postalCode &&
            //     profileRecord.country === profileData.country &&
            //     profileRecord.city === profileData.city &&
            //     profileRecord.street === profileData.street)
            //     ? "no-drop" // Apply not-allowed cursor when disabled
            //     : "pointer",
          }}
          //   disabled={
          //     !profileRecord.name ||
          //     !profileRecord.country ||
          //     !profileRecord.city ||
          //     !profileRecord.postalCode ||
          //     !profileRecord.street ||
          //     (profileRecord.name === profileData.name &&
          //       profileRecord.postalCode === profileData.postalCode &&
          //       profileRecord.country === profileData.country &&
          //       profileRecord.city === profileData.city &&
          //       profileRecord.street === profileData.street)
          //   }
        >
          {loading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                // padding: "4px",
              }}>
              <CircularProgress />
            </div>
          ) : (
            'Add'
          )}
        </button>
      </Box>
    </Box>
  );
}

export default UpdateWalletAddress;
