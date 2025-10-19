import axiosInstance, { BASE_URL } from '@/axios/axiosInstance';
import { countries, primaryColor } from '@/utils/helpers';
import { Box, CircularProgress, MenuItem, TextField, Typography } from '@mui/material';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function BillingInfo() {
  const [profileData, setProfileData] = useState<any>({});
  const [profileRecord, setProfileRecord] = useState({
    name: '',
    street: '',
    postalCode: '',
    country: '',
    city: '',
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const { address } = useWeb3ModalAccount();

  // ✅ Regex + length rules
  const validationRules = {
    name: /^[A-Za-z\s]{1,50}$/,
    street: /^[A-Za-z0-9\s.,'-]{1,100}$/,
    postalCode: /^[A-Za-z0-9\s-]{4,10}$/,
    city: /^[A-Za-z\s'-]{1,50}$/,
  };

  // ✅ Max length limits for each field
  const maxLengths: Record<string, number> = {
    name: 50,
    street: 100,
    postalCode: 10,
    city: 50,
  };

  const validateField = (name: string, value: string) => {
    if (!value.trim()) return 'This field is required';
    const rule = validationRules[name as keyof typeof validationRules];
    if (rule && !rule.test(value)) {
      switch (name) {
        case 'name':
          return 'Only letters and spaces (max 50 chars)';
        case 'street':
          return 'Invalid street address';
        case 'postalCode':
          return 'Invalid postal code (4–10 chars)';
        case 'city':
          return 'Only letters and spaces allowed';
        default:
          return 'Invalid input';
      }
    }
    return '';
  };

  // ✅ Prevent input overflow + live validation
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    const max = maxLengths[name];

    if (max && value.length > max) return; // stop typing beyond limit

    setProfileRecord((prev) => ({ ...prev, [name]: value }));

    const errorMsg = validateField(name, value);
    setErrors((prev: any) => ({ ...prev, [name]: errorMsg }));
  };

  const getProfile = async () => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/freename/getRegistrant`);
      setProfileData(response.data.result);

      setProfileRecord({
        name: response.data.result?.name || '',
        street: response.data.result?.registrantStreet || '',
        postalCode: response.data.result?.postalCode || '',
        country: response.data.result?.country || '',
        city: response.data.result?.city || '',
      });
    } catch (e) {
      const errorMessage = axios.isAxiosError(e) ? e.response?.data?.message || 'An unknown error occurred' : 'An unexpected error occurred';

      toast.error(errorMessage, {
        position: 'top-right',
        style: { top: '120px' },
      });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const newErrors: any = {};
    Object.keys(profileRecord).forEach((key) => {
      const err = validateField(key, (profileRecord as any)[key]);
      if (err) newErrors[key] = err;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fill all details.', {
        position: 'top-right',
        style: { top: '120px' },
      });
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.patch(`${BASE_URL}/freename/updateRegistrant`, { ...profileRecord });

      toast.success(`Saved details`, {
        position: 'top-right',
        style: { top: '120px' },
      });

      setErrors({}); // clear error messages
    } catch (e) {
      const errorMessage = axios.isAxiosError(e) ? e.response?.data?.message || 'An unknown error occurred' : 'An unexpected error occurred';

      toast.error(errorMessage, {
        position: 'top-right',
        style: { top: '120px' },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <Box component='form' onSubmit={handleSubmit} sx={{ padding: { xs: '16px', md: '24px' } }}>
      <Typography variant='h5' sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
        Set your billing info
      </Typography>

      {/* Name + Street */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
        <TextField
          fullWidth
          margin='normal'
          label='Enter Name'
          name='name'
          value={profileRecord.name}
          onChange={handleInputChange}
          error={!!errors.name}
          helperText={errors.name || `${profileRecord.name.length}/${maxLengths.name}`}
          inputProps={{ maxLength: maxLengths.name }}
          style={{ backgroundColor: '#465A7E66', borderRadius: '8px', marginRight: '20px' }}
          InputProps={{ style: { color: 'white' } }}
          InputLabelProps={{ style: { color: 'white' } }}
        />

        <TextField
          fullWidth
          margin='normal'
          label='Enter Street'
          name='street'
          value={profileRecord.street}
          onChange={handleInputChange}
          error={!!errors.street}
          helperText={errors.street || `${profileRecord.street.length}/${maxLengths.street}`}
          inputProps={{ maxLength: maxLengths.street }}
          style={{ backgroundColor: '#465A7E66', borderRadius: '8px' }}
          InputProps={{ style: { color: 'white' } }}
          InputLabelProps={{ style: { color: 'white' } }}
        />
      </Box>

      {/* Postal Code + Country */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
        <TextField
          fullWidth
          margin='normal'
          label='Postal Code'
          name='postalCode'
          value={profileRecord.postalCode}
          onChange={handleInputChange}
          error={!!errors.postalCode}
          helperText={errors.postalCode || `${profileRecord.postalCode.length}/${maxLengths.postalCode}`}
          inputProps={{ maxLength: maxLengths.postalCode }}
          style={{ backgroundColor: '#465A7E66', borderRadius: '8px', marginRight: '20px' }}
          InputProps={{ style: { color: 'white' } }}
          InputLabelProps={{ style: { color: 'white' } }}
        />

        <TextField
          fullWidth
          select
          margin='normal'
          label='Country'
          name='country'
          value={profileRecord.country}
          onChange={handleInputChange}
          error={!!errors.country}
          helperText={errors.country}
          style={{ backgroundColor: '#465A7E66', borderRadius: '8px' }}
          InputProps={{ style: { color: 'white' } }}
          InputLabelProps={{ style: { color: 'white' } }}>
          {countries.map((country, index) => (
            <MenuItem key={index} value={country.value}>
              {country.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* City */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
        <TextField
          fullWidth
          margin='normal'
          label='Enter your city'
          name='city'
          value={profileRecord.city}
          onChange={handleInputChange}
          error={!!errors.city}
          helperText={errors.city || `${profileRecord.city.length}/${maxLengths.city}`}
          inputProps={{ maxLength: maxLengths.city }}
          style={{ backgroundColor: '#465A7E66', borderRadius: '8px', marginRight: '20px' }}
          InputProps={{ style: { color: 'white' } }}
          InputLabelProps={{ style: { color: 'white' } }}
        />
      </Box>

      {/* Submit Button */}
      <Box sx={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
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
            cursor: loading ? 'no-drop' : 'pointer',
          }}
          disabled={loading}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress size={24} />
            </div>
          ) : (
            'Add'
          )}
        </button>
      </Box>
    </Box>
  );
}

export default BillingInfo;
