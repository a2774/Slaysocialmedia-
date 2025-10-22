import { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, TextField, CircularProgress, MenuItem } from '@mui/material';
import { useRouter } from 'next/router';
import Layout from '@/components/layout';
import axiosInstance, { BASE_URL } from '@/axios/axiosInstance';
import { countries, countryCodes, primaryColor, removePlusSign } from '@/utils/helpers';
import { toast } from 'react-toastify';
import axios from 'axios';
import BillingInfo from '@/components/billing-info';
import UpdateWalletAddress from '@/components/update-wallet-address';
import UpdatePassword from '@/components/update-password';

const BillingPage = () => {
  const router = useRouter();
  const { pathname } = router;
  const [profileRecord, setProfileRecord] = useState({
    fullName: '',
    companyName: '',
    companyAddress: '',
    companyCity: '',
    companyCountry: '',
    companyZipCode: '',
    companyVatCode: '',
    companyEmail: '',
    countryCode: '+91',
    mobNum: '',
    dateOfBirth: '',
  });
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>({});
  const [fetched, setFetched] = useState(false);

  const options = [
    { id: 'option1', name: 'Edit your personal info', route: '/profile' },
    { id: 'option2', name: 'Billing info', route: '/profile/billing-info' },
    { id: 'option3', name: 'Wallets', route: '/profile' },
    { id: 'option4', name: 'Change Password', route: '/profile' },
  ];

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setProfileRecord((prev) => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e: any) => {
    setLoading(true);
    e.preventDefault();

    try {
      const response = await axiosInstance.patch(`${BASE_URL}/user/update-user`, {
        fullName: profileRecord.fullName,
        companyName: profileRecord.companyName,
        companyAddress: profileRecord.companyAddress,
        companyCity: profileRecord.companyCity,
        companyCountry: profileRecord.companyCountry,
        companyZipCode: profileRecord.companyZipCode,
        companyVatCode: profileRecord.companyVatCode,
        companyEmail: profileRecord.companyEmail,
        mobileNumber: {
          countryCode: Number(removePlusSign(profileRecord.countryCode)),
          mobNum: Number(profileRecord.mobNum),
        },
        dateOfBirth: profileRecord.dateOfBirth,
      });

      if (response?.data?.message) {
        toast.success(response?.data?.message, {
          position: 'top-right',
          style: { top: '120px' },
        });
        getProfile();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'An unknown error occurred';
        toast.error(errorMessage, {
          position: 'top-right',
          style: { top: '120px' },
        });
      } else {
        toast.error('An unexpected error occurred', {
          position: 'top-right',
          style: { top: '120px' },
        });
      }
    }
    setLoading(false);
  };

  const getProfile = async () => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/user/get-details/`);
      setProfileData(response.data);
      const dateObj = response.data.data?.dateOfBirth ? formatDate(response.data.data.dateOfBirth) : '';
      setProfileRecord({
        fullName: response.data.data?.fullName || '',
        companyName: response.data.data?.companyName || '',
        companyAddress: response.data.data?.companyAddress || '',
        companyCity: response.data.data?.companyCity || '',
        companyCountry: response.data.data?.companyCountry || '',
        companyZipCode: response.data.data?.companyZipCode || '',
        companyVatCode: response.data.data?.companyVatCode || '',
        companyEmail: response.data.data?.companyEmail || '',
        countryCode: response.data.data?.mobileNumber?.countryCode ? `+${response.data.data.mobileNumber.countryCode}` : '+91',
        mobNum: response.data.data?.mobileNumber?.mobNum || '',
        dateOfBirth: dateObj,
      });
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const errorMessage = e.response?.data?.message || 'An unknown error occurred';
        toast.error(errorMessage, {
          position: 'top-right',
          style: { top: '120px' },
        });
      } else {
        toast.error('An unexpected error occurred', {
          position: 'top-right',
          style: { top: '120px' },
        });
      }
    }
  };

  useEffect(() => {
    if (!fetched) {
      getProfile();
      setFetched(true);
    }
  }, [fetched]);

  useEffect(() => {
    const token = localStorage.getItem('profile');
    if (!token) {
      window.location.assign('/login');
    }
  }, [router]);

  const handleOptionClick = (route: string, optionId: string) => {
    router.push({
      pathname: route,
      query: { ...router.query, section: optionId },
    });
  };

  const selectedOption = router.query.section || 'option1';

  return (
    <Layout isFooter={false}>
      <Box display='flex' flexDirection={{ xs: 'column', md: 'row' }} height={{ xs: 'auto', md: '100vh' }} paddingTop={{ xs: '150px', md: '150px' }} paddingLeft={{ md: '32px' }}>
        <Box
          sx={{
            width: { xs: '100%', md: '250px' },
            padding: 2,
            overflowY: 'auto',
            borderRadius: '8px',
            border: '1px solid #fff',
          }}>
          <List>
            {options.map((option) => (
              <ListItem
                key={option.id}
                button
                onClick={() => handleOptionClick(option.route, option.id)}
                sx={{
                  backgroundColor: selectedOption === option.id ? '#6E7B99' : '#465A7E66',
                  marginBottom: 1,
                  color: '#fff',
                  borderRadius: '8px',
                  '&:hover': {
                    backgroundColor: '#6E7B99',
                  },
                }}>
                {option.name}
              </ListItem>
            ))}
          </List>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            marginX: { xs: 0, md: 3 },
            paddingX: { xs: 2, md: 0 },
            paddingBottom: { xs: 4, md: 0 },
            border: '1px solid #fff',
            borderRadius: '8px',
          }}>
          {selectedOption === 'option1' && pathname === '/profile' && (
            <Box component='form' onSubmit={handleSubmit} sx={{ padding: { xs: '16px', md: '24px' } }}>
              <Typography variant='h5' sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
                Edit your informations
              </Typography>
              {/* Form fields remain unchanged */}
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
                <TextField
                  fullWidth
                  margin='normal'
                  label='Full name'
                  name='fullName'
                  value={profileRecord.fullName}
                  style={{ backgroundColor: '#465A7E66', borderRadius: '8px', marginRight: '20px' }}
                  InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: 'white' } }}
                  onChange={handleInputChange}
                />
                <TextField
                  fullWidth
                  margin='normal'
                  label='Company Name'
                  name='companyName'
                  value={profileRecord.companyName}
                  onChange={handleInputChange}
                  style={{ backgroundColor: '#465A7E66', borderRadius: '8px' }}
                  InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: 'white' } }}
                />
              </Box>
              {/* ... Other form fields ... */}
              <Box sx={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
                <button
                  type='submit'
                  style={{
                    backgroundColor: primaryColor,
                    borderRadius: '8px',
                    fontWeight: 700,
                    marginTop: 2,
                    width: '160px',
                    color: '#fff',
                    height: '50px',
                    cursor:
                      !profileRecord.fullName ||
                      !profileRecord.companyAddress ||
                      !profileRecord.companyCity ||
                      !profileRecord.companyCountry ||
                      !profileRecord.companyEmail ||
                      !profileRecord.companyName ||
                      !profileRecord.companyVatCode ||
                      !profileRecord.companyZipCode ||
                      !profileRecord.countryCode ||
                      !profileRecord.dateOfBirth ||
                      !profileRecord.mobNum ||
                      (profileRecord.fullName === profileData?.data?.fullName &&
                        profileRecord.companyAddress === profileData?.data?.companyAddress &&
                        profileRecord.companyCity === profileData?.data?.companyCity &&
                        profileRecord.companyCountry === profileData?.data?.companyCountry &&
                        profileRecord.companyEmail === profileData?.data?.companyEmail &&
                        profileRecord.companyName === profileData?.data?.companyName &&
                        profileRecord.companyVatCode === profileData?.data?.companyVatCode &&
                        profileRecord.companyZipCode === profileData?.data?.companyZipCode &&
                        profileRecord.countryCode === `+${profileData?.data?.mobileNumber?.countryCode}` &&
                        new Date(profileRecord.dateOfBirth).toISOString() === profileData?.data?.dateOfBirth &&
                        Number(profileRecord.mobNum) === profileData?.data?.mobileNumber?.mobNum)
                        ? 'no-drop'
                        : 'pointer',
                  }}
                  disabled={
                    !profileRecord.fullName ||
                    !profileRecord.companyAddress ||
                    !profileRecord.companyCity ||
                    !profileRecord.companyCountry ||
                    !profileRecord.companyEmail ||
                    !profileRecord.companyName ||
                    !profileRecord.companyVatCode ||
                    !profileRecord.companyZipCode ||
                    !profileRecord.countryCode ||
                    !profileRecord.dateOfBirth ||
                    !profileRecord.mobNum ||
                    (profileRecord.fullName === profileData?.data?.fullName &&
                      profileRecord.companyAddress === profileData?.data?.companyAddress &&
                      profileRecord.companyCity === profileData?.data?.companyCity &&
                      profileRecord.companyCountry === profileData?.data?.companyCountry &&
                      profileRecord.companyEmail === profileData?.data?.companyEmail &&
                      profileRecord.companyName === profileData?.data?.companyName &&
                      profileRecord.companyVatCode === profileData?.data?.companyVatCode &&
                      profileRecord.companyZipCode === profileData?.data?.companyZipCode &&
                      profileRecord.countryCode === `+${profileData?.data?.mobileNumber?.countryCode}` &&
                      new Date(profileRecord.dateOfBirth).toISOString() === profileData?.data?.dateOfBirth &&
                      Number(profileRecord.mobNum) === profileData?.data?.mobileNumber?.mobNum)
                  }>
                  {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <CircularProgress />
                    </div>
                  ) : (
                    'Edit'
                  )}
                </button>
              </Box>
            </Box>
          )}
          {selectedOption === 'option2' && pathname === '/profile/billing-info' && <BillingInfo />}
          {selectedOption === 'option3' && pathname === '/profile' && <UpdateWalletAddress />}
          {selectedOption === 'option4' && pathname === '/profile' && <UpdatePassword />}
        </Box>
      </Box>
    </Layout>
  );
};

export default BillingPage;
