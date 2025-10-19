import { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, TextField, CircularProgress, MenuItem } from '@mui/material';
import { useRouter } from 'next/router';
import Layout from '@/components/layout';
import axiosInstance, { BASE_URL } from '@/axios/axiosInstance';
import { countries, countryCodes, primaryColor, removePlusSign } from '@/utils/helpers';
import { toast } from 'react-toastify';
import axios from 'axios';
import { DatePicker } from '@mui/lab';
import BillingInfo from '@/components/billing-info';
import UpdateWalletAddress from '@/components/update-wallet-address';
import UpdatePassword from '@/components/update-password';

const BillingPage = () => {
  const router = useRouter();
  const { domain: domainName, uuid } = router.query;
  const [selectedOption, setSelectedOption] = useState('option1');
  const [profileRecord, setprofileRecord] = useState({
    fullName: '',
    companyName: '',
    companyAddress: '',
    companyCity: '',
    companyCountry: '',
    companyZipCode: '',
    companyVatCode: '',
    companyEmail: '',
    // mobileNumber: "",
    countryCode: '+91',
    mobNum: '',
    dateOfBirth: '',
  });
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>({});
  const [createProfile, setCreateProfile] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState('');

  const options = [
    { id: 'option1', name: 'Edit your personal info' },
    { id: 'option2', name: 'Billing info' },
    { id: 'option3', name: 'Wallets' },
    { id: 'option4', name: 'Change Password' },
  ];

  const handleInputChange = (e: any) => {
    console.log('eeee', e.target);
    const { name, value } = e.target;

    setprofileRecord((prev) => ({ ...prev, [name]: value }));
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e: any) => {
    {
      setLoading(true);
      e.preventDefault();

      console.log('event.data', removePlusSign(profileRecord.countryCode));

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
        console.log('response', response);
        if (response?.data?.message) {
          toast.success(
            `${response?.data?.message}`,

            {
              position: 'top-right',
              style: {
                top: '120px',
              },
            }
          );
          getProfile();
          const newRecord = response?.data?.data;
          // setRecordList((prevList: any) => [...newRecord, ...prevList]);
        }
      } catch (error) {
        console.error(' failed:', error);
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.message || 'An unknown error occurred';
          toast.error(`${errorMessage}`, {
            position: 'top-right',
            style: {
              top: '120px',
            },
          });
        } else {
          toast.error('An unexpected error occurred', {
            position: 'top-right',
            style: {
              top: '120px',
            },
          });
        }
      }
      setLoading(false);
      console.log('DNS Record Submitted:', profileRecord);
    }
  };

  const handleDateChange = (event: any) => {
    setDateOfBirth(event.target.value);
  };

  const getProfile = async () => {
    // setIsLoading(true);
    try {
      const response = await axiosInstance.get(`${BASE_URL}/user/get-details/`);

      setProfileData(response.data);
      const dateObj = formatDate(response.data.data?.dateOfBirth);
      setprofileRecord({
        fullName: response.data.data?.fullName || '',
        companyName: response.data.data?.companyName || '',
        companyAddress: response.data.data?.companyAddress || '',
        companyCity: response.data.data?.companyCity || '',
        companyCountry: response.data.data?.companyCountry || '',
        companyZipCode: response.data.data?.companyZipCode || '',
        companyVatCode: response.data.data?.companyVatCode || '',
        companyEmail: response.data.data?.companyEmail || '',
        countryCode: response.data.data?.mobileNumber?.countryCode != undefined ? `+${response.data.data?.mobileNumber?.countryCode}` : '+91',
        mobNum: response.data.data?.mobileNumber?.mobNum != undefined ? `${response.data.data?.mobileNumber?.mobNum}` : '',
        dateOfBirth: dateObj || '',

        // name: response.data.result?.name || "",
        // street: response.data.result?.registrantStreet || "",
        // postalCode: response.data.result?.postalCode || "",
        // country: response.data.result?.country || "",
        // city: response.data.result?.city || "",
      });
      //   setDomainsList(response.data.domains);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const errorMessage = e.response?.data?.message || 'An unknown error occurred';

        toast.error(`${errorMessage}`, {
          position: 'top-right',
          style: {
            top: '120px',
          },
        });
        if (e.response?.data?.cause === 'registrantProfile') {
          // setCreateProfile(true);
        }
      } else {
        toast.error('An unexpected error occurred', {
          position: 'top-right',
          style: {
            top: '120px', // Adjusts the position slightly above the bottom
          },
        });
      }
    }
    // setIsLoading(false);
  };
  const [fetched, setFetched] = useState(false);
  useEffect(() => {
    if (!fetched) {
      getProfile();
      setFetched(true);
    }
  }, [fetched]);

  useEffect(() => {
    const token = localStorage.getItem('profile');
    if (!token) {
      // router.push("/");
      window.location.assign('/login');
    }
    console.log('tokent', token);
  }, [router]);

  console.log('#profile', profileRecord);

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
                onClick={() => setSelectedOption(option.id)}
                sx={{
                  backgroundColor: selectedOption === option.id ? '#6E7B99' : '465A7E66',
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
          {selectedOption === 'option1' && (
            <Box
              component='form'
              onSubmit={handleSubmit}
              sx={{
                padding: { xs: '16px', md: '24px' },
              }}>
              <Typography variant='h5' sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
                Edit your informations
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: {
                    xs: 'column',
                    sm: 'row',
                  },
                }}>
                <TextField
                  fullWidth
                  margin='normal'
                  label='Full name'
                  name='fullName'
                  value={profileRecord.fullName}
                  style={{
                    backgroundColor: '#465A7E66',
                    borderRadius: '8px',
                    marginRight: '20px',
                  }}
                  InputProps={{
                    style: { color: 'white' },
                  }}
                  InputLabelProps={{
                    style: { color: 'white' },
                  }}
                  onChange={handleInputChange}
                />

                <TextField
                  fullWidth
                  margin='normal'
                  label='Company Name'
                  name='companyName'
                  value={profileRecord.companyName}
                  onChange={handleInputChange}
                  style={{
                    backgroundColor: '#465A7E66',
                    color: 'white !important',

                    borderRadius: '8px',
                  }}
                  InputProps={{
                    style: { color: 'white' },
                  }}
                  InputLabelProps={{
                    style: { color: 'white' },
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: {
                    xs: 'column',
                    sm: 'row',
                  },
                }}>
                <TextField
                  fullWidth
                  margin='normal'
                  label='Company Address '
                  name='companyAddress'
                  value={profileRecord.companyAddress}
                  onChange={handleInputChange}
                  style={{
                    backgroundColor: '#465A7E66',
                    color: 'white !important',

                    borderRadius: '8px',
                    marginRight: '20px',
                  }}
                  InputProps={{
                    style: { color: 'white' },
                  }}
                  InputLabelProps={{
                    style: { color: 'white' },
                  }}
                />

                <TextField
                  fullWidth
                  select
                  margin='normal'
                  label='Company Country'
                  name='companyCountry'
                  value={profileRecord.companyCountry}
                  onChange={handleInputChange}
                  style={{
                    backgroundColor: '#465A7E66',
                    color: 'white !important',

                    borderRadius: '8px',
                  }}
                  InputProps={{
                    style: { color: 'white' },
                  }}
                  InputLabelProps={{
                    style: { color: 'white' },
                  }}>
                  {countries.map((country, index) => (
                    <MenuItem key={index} value={country.value}>
                      {country.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: {
                    xs: 'column',
                    sm: 'row',
                  },
                }}>
                <TextField
                  fullWidth
                  margin='normal'
                  label='Company City'
                  name='companyCity'
                  value={profileRecord.companyCity}
                  onChange={handleInputChange}
                  // required
                  style={{
                    backgroundColor: '#465A7E66',
                    color: 'white !important',

                    borderRadius: '8px',
                    marginRight: '20px',
                  }}
                  InputProps={{
                    style: { color: 'white' },
                  }}
                  InputLabelProps={{
                    style: { color: 'white' },
                  }}
                />
                <TextField
                  fullWidth
                  margin='normal'
                  label='Company ZipCode'
                  name='companyZipCode'
                  value={profileRecord.companyZipCode}
                  onChange={handleInputChange}
                  style={{
                    backgroundColor: '#465A7E66',
                    color: 'white !important',

                    borderRadius: '8px',
                  }}
                  InputProps={{
                    style: { color: 'white' },
                  }}
                  InputLabelProps={{
                    style: { color: 'white' },
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: {
                    xs: 'column',
                    sm: 'row',
                  },
                }}>
                <TextField
                  fullWidth
                  margin='normal'
                  label='Company VatCode'
                  name='companyVatCode'
                  value={profileRecord.companyVatCode}
                  onChange={handleInputChange}
                  style={{
                    backgroundColor: '#465A7E66',
                    color: 'white !important',

                    borderRadius: '8px',
                    marginRight: '20px',
                  }}
                  InputProps={{
                    style: { color: 'white' },
                  }}
                  InputLabelProps={{
                    style: { color: 'white' },
                  }}
                />

                <TextField
                  fullWidth
                  margin='normal'
                  label='Company Email'
                  name='companyEmail'
                  value={profileRecord.companyEmail}
                  onChange={handleInputChange}
                  style={{
                    backgroundColor: '#465A7E66',
                    color: 'white !important',

                    borderRadius: '8px',
                  }}
                  InputProps={{
                    style: { color: 'white' },
                  }}
                  InputLabelProps={{
                    style: { color: 'white' },
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: {
                    xs: 'column',
                    sm: 'row',
                  },
                }}>
                <Box
                  sx={{
                    display: 'flex',
                    width: '100%',
                    marginRight: '20px',
                  }}>
                  <TextField
                    select
                    margin='normal'
                    name='countryCode'
                    value={profileRecord?.countryCode}
                    onChange={handleInputChange}
                    style={{
                      backgroundColor: '#465A7E66',
                      color: 'white !important',

                      borderRadius: '8px',
                      borderTopRightRadius: '0',
                      borderBottomRightRadius: '0',
                      width: '30%',
                    }}
                    InputProps={{
                      style: { color: 'white' },
                    }}
                    InputLabelProps={{
                      style: { color: 'white' },
                    }}
                    SelectProps={{
                      sx: {
                        '& .MuiSelect-icon': {
                          color: 'white',
                        },
                      },
                    }}>
                    {countryCodes.map((country) => (
                      <MenuItem key={country.code} value={country.code}>
                        {country.code}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    margin='normal'
                    label='Mobile Number'
                    name='mobNum'
                    value={profileRecord?.mobNum}
                    onChange={handleInputChange}
                    style={{
                      backgroundColor: '#465A7E66',
                      color: 'white !important',

                      borderRadius: '8px',

                      width: '70%',
                      borderTopLeftRadius: '0',
                      borderBottomLeftRadius: '0',
                    }}
                    InputProps={{
                      style: { color: 'white' },
                    }}
                    InputLabelProps={{
                      style: { color: 'white' },
                    }}
                  />
                </Box>

                <TextField
                  type='date'
                  fullWidth
                  margin='normal'
                  label='DOB'
                  name='dateOfBirth'
                  value={profileRecord.dateOfBirth}
                  onChange={handleInputChange}
                  placeholder='Date of Birth'
                  style={{
                    backgroundColor: '#465A7E66',
                    color: 'white',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                  InputProps={{
                    style: { color: 'white' },
                  }}
                  InputLabelProps={{
                    shrink: true,
                    style: { color: 'white' },
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'flex-end',
                }}>
                <button
                  type='submit'
                  style={{
                    backgroundColor: `${primaryColor}`,
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
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                      }}>
                      <CircularProgress />
                    </div>
                  ) : (
                    'Edit'
                  )}
                </button>
              </Box>
            </Box>
          )}

          {selectedOption === 'option2' && <BillingInfo />}
          {selectedOption === 'option3' && <UpdateWalletAddress />}
          {selectedOption === 'option4' && <UpdatePassword />}
        </Box>
      </Box>
    </Layout>
  );
};

export default BillingPage;
