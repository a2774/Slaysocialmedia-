import axiosInstance, { BASE_URL } from '@/axios/axiosInstance';
import CheckoutForm from '@/components/Card/CheckoutForm';
import { calculateTotal } from '@/components/Header';
import Layout from '@/components/layout';
import PaymentNewCardDialog from '@/components/PaymentCard';
import { grey } from '@/theme/pallete';
import {
  getCartFromLocalStorage,
  getCouponFromLocalStorage,
  getDiscountFromLocalStorage,
  getProfileFromLocalStorage,
  getSelectedRoyaltiesFromLocalStorage,
  saveCouponToLocalStorage,
} from '@/utils/cart';
import { calculateOriginalPrice, countries, LOCAL_FRONTEND_URL, primaryColor, PRODUCTION_FRONTEND_URL, STRIPE_API_KEY, trimAddress } from '@/utils/helpers';
import { AddCircleRounded, RemoveCircleRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  List,
  debounce,
} from '@mui/material';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers5/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const stripePromise = loadStripe(STRIPE_API_KEY);

const Profile = () => {
  const { handleSubmit, register, reset } = useForm({
    // defaultValues: initialValues,
  });

  const [clientSecret, setClientSecret] = useState('');
  const { open: openWalletConnect } = useWeb3Modal();
  const { address, isConnected } = useWeb3ModalAccount();
  const [createPaymentIntentId, setCreatePaymentIntentId] = useState();
  const [amount, setAmount] = useState(0);
  const [isDialog, setDialog] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [addCard, setAddCard] = useState(false);
  const [profileData, setProfileData] = useState<any>({});
  const [createProfile, setCreateProfile] = useState(false);
  const [completePayment, setCompletePayment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('paypal');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [showCartItems, setShowCartItems] = useState(false);

  const handlePaymentMethodChange = (event: any) => {
    setSelectedPaymentMethod(event.target.value);
  };

  const onSubmit = async (data: any) => {
    try {
      const response = await axiosInstance.post(`${BASE_URL}/freename/createRegistrant`, {
        ...data,
        walletAddress: address ? address : '',
      });

      setCompletePayment(true);
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

  const cartItems = getCartFromLocalStorage();

  // const domainNames = cartItems.map((item: any) => item.name);

  const [errorCause, setErrorCause] = useState<string | null>(null);

  const onPayment = async () => {
    setPaymentLoading(true);
    setErrorCause(null); // reset any previous error

    const cart = getCartFromLocalStorage();
    const domains = cart.map((item: any) => item.name);
    const royalties = getSelectedRoyaltiesFromLocalStorage().map((name: string) => ({
      name,
      isRoyaltiesEnable: true,
    }));

    try {
      const response = await axiosInstance.post(`${BASE_URL}/freename/buyZones`, {
        zones: domains,
        royalties: royalties,
        referralCoupon: getDiscountFromLocalStorage() === 0 ? '' : getCouponFromLocalStorage(),
        discountPercentage: getDiscountFromLocalStorage() === '' ? 0 : getDiscountFromLocalStorage(),
        return_url: `${LOCAL_FRONTEND_URL}/domain`,
        cancel_url: `${LOCAL_FRONTEND_URL}/domain`,
      });

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error: any) {
      console.error('Payment failed:', error?.response?.data);
      const cause = error?.response?.data?.cause;
      console.log('### API error cause:', cause);

      setErrorCause(cause || null);

      const errorMsg = error?.response?.data?.message || error?.message || 'Something went wrong, please try again!';

      toast.error(errorMsg, {
        position: 'top-right',
        autoClose: 4000,
        hideProgressBar: false,
        theme: 'colored',
        style: { marginTop: '100px' },
      });

      // Auto-hide error buttons after 5 seconds
      setTimeout(() => {
        setErrorCause(null);
      }, 5000);
    } finally {
      setPaymentLoading(false);
    }
  };

  const [discountPerc, setDiscountPerc] = useState(0);
  const [finalamount, setFinalamount] = useState(0);
  const [isReferralCodeValid, setReferralCodeValid] = useState(false);

  const validatePromoCode = useCallback(
    async (code?: string) => {
      try {
        if (getDiscountFromLocalStorage() > 0) {
          setFinalamount(Math.round((amount * (100 - discountPerc)) / 100));
        } else {
          const referralResponse = await axios.get(
            `${BASE_URL}/freename/promoters/check-referral/${code ?? promoCodeInput}`
            // endpoints.promoters.validateReferralCode(code ?? promoCodeInput, id)
          );
          setReferralCodeValid(true);

          // setDiscountPerc(10);
          console.log('##referralResponse', referralResponse);
          const discountAmount = referralResponse?.data?.promoter?.discountPercentage ? referralResponse?.data?.promoter?.discountPercentage : 0;
          console.log('discountAmount', discountAmount);
          setDiscountPerc(discountAmount);

          localStorage.setItem('discountPercentage', JSON.stringify(discountAmount));
          setFinalamount(
            calculateTotal() + getSelectedRoyaltiesFromLocalStorage().length * 5 - (calculateTotal() + getSelectedRoyaltiesFromLocalStorage().length * 5) * (discountPerc / 100)
          );
          if (referralResponse?.data?.valid)
            toast.success('Referral code Added', {
              position: 'top-right',
              style: {
                top: '120px', // Adjusts the position slightly above the bottom
              },
            });
          else {
            localStorage.removeItem('referralCoupon');
            toast.error(`${referralResponse?.data?.message}`, {
              position: 'top-right',
              style: {
                top: '120px', // Adjusts the position slightly above the bottom
              },
            });
          }
        }
      } catch (error) {
        toast.error('Invalid Referral code', {
          position: 'top-right',
          style: {
            top: '120px', // Adjusts the position slightly above the bottom
          },
        });
        setReferralCodeValid(false);
      }
    },
    [amount, discountPerc, promoCodeInput]
  );

  const getPaymentMethods = useCallback(async () => {
    // API call to get payment methods

    const response = await axiosInstance.get(`${BASE_URL}/freename/retrieveUserPaymentMethods`);

    setPaymentMethods(response.data.data);
  }, []);

  // useEffect(() => {
  //   const token = localStorage.getItem("profile");
  //   if (token) {
  //     getPaymentMethods();
  //   }
  // }, [getPaymentMethods]);
  const { cart } = useSelector((state: any) => state.user);

  const getProfile = async () => {
    debugger;
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`${BASE_URL}/user/get-details/`);

      setProfileData(response.data.data);
      //   setDomainsList(response.data.domains);
    } catch (e) {
      debugger;
      if (axios.isAxiosError(e)) {
        const errorMessage = e.response?.data?.message || 'An unknown error occurred';

        toast.error(`${errorMessage}`, {
          position: 'top-right',
          style: {
            top: '120px', // Adjusts the position slightly above the bottom
          },
        });
        if (e.response?.data?.cause === 'registrantProfile') {
          setCreateProfile(true);
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
    setIsLoading(false);
  };
  useEffect(() => {
    getProfile();
  }, []);

  console.log('#profileData', profileData);
  const router = useRouter();

  useEffect(() => {
    const cartDataLength = cart.length;
    console.log('check', getCartFromLocalStorage(), cartDataLength);
    if (cartDataLength === 0) {
      router.push('/');
    }
  }, [cart]);
  console.log('#cart', cart);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <Layout isCart={false}>
      <section>
        {isLoading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              paddingTop: '186px',
            }}>
            <CircularProgress />
          </div>
        ) : (
          <div className='container form-wrapper pb-100'>
            <div className='checkout-container'>
              <div className='left-section'>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}>
                  <div
                    // key={"nextForm"}
                    //  onSubmit={handleSubmit(onSubmit)}
                    // style={{
                    //   width: "100%",
                    // }}
                    className='checkout-styling'
                    // sx={{
                    //   width: {
                    //     xs: "100%", // 100% width on extra-small screens (mobile)
                    //     sm: "50%",  // 50% width on small screens and above (tablet and web)
                    //   },
                    // }}
                  >
                    <div
                      // className="forms-section"
                      style={{
                        flexDirection: 'column',
                        marginRight: '24px',
                      }}>
                      <div className='form-heading'>
                        <h3
                          style={{
                            color: 'white',
                          }}>
                          Cart Checkout
                        </h3>
                      </div>
                      <div className='form-heading'>
                        <h4
                          style={{
                            color: 'white',
                          }}>
                          1. Billing Info
                        </h4>
                      </div>

                      <div
                        // className=" col-md-5 col-12"
                        style={{
                          marginTop: '24px',
                        }}>
                        <label htmlFor='first_name'>{profileData?.fullName ? 'Full Name' : 'Username'}</label>
                        <input
                          type='text'
                          className='form-control'
                          style={{
                            backgroundColor: '#465A7E66',
                            color: 'white',
                            border: 'none',
                          }}
                          // placeholder="Enter Name"
                          value={profileData?.fullName ? profileData?.fullName : getProfileFromLocalStorage()?.username}
                          // {...(profileData?.name
                          //   ? { value: profileData?.name }
                          //   : { defaultValue: profileData?.name })}
                          disabled
                          // disabled={
                          //   profileData?.name || completePayment ? true : false
                          // }
                          {...register('username')}
                        />
                      </div>
                      {/* {!profileData.name && (
                      <div
                        className="
                  
                    "
                        style={{
                          marginTop: "24px",
                        }}
                      >
                        <label htmlFor="last_name">Street</label>
                        <input
                          type="text"
                          className="form-control"
                          style={{
                            backgroundColor: "#465A7E66",
                            color: "white",
                            border: "none",
                          }}
                          placeholder="Enter Street"
                          defaultValue={profileData?.street}
                          disabled={
                            profileData?.street || completePayment
                              ? true
                              : false
                          }
                          {...register("street")}
                        />
                      </div>
                    )} */}

                      {/* <div
                      // className=" col-md-5 col-12"
                      style={{
                        marginTop: "24px",
                      }}
                    >
                      <label htmlFor="email">Postal Code</label>
                      <input
                        type="text"
                        //   value={getUserDataLocalStorage().email}

                        className="form-control"
                        style={{
                          backgroundColor: "#465A7E66",
                          color: "white",
                          border: "none",
                        }}
                        placeholder="Enter Your Postal Code"
                        {...(profileData?.postalCode
                          ? { value: profileData?.postalCode }
                          : { defaultValue: profileData?.postalCode })}
                        // defaultValue={profileData?.postalCode}
                        disabled={
                          profileData?.postalCode || completePayment
                            ? true
                            : false
                        }
                        {...register("postalCode")}
                      />
                    </div> */}

                      {/* <div
                        // className=" col-md-5 col-12"
                        style={{
                          marginTop: "24px",
                        }}
                      >
                        <label htmlFor="nationality">Country</label>
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          // defaultValue={profileData?.country}
                          {...(profileData?.country
                            ? { value: profileData?.country }
                            : { defaultValue: profileData?.country })}
                          disabled={
                            profileData?.country || completePayment
                              ? true
                              : false
                          }
                          style={{
                            backgroundColor: "#465A7E66",
                            color: "white",
                          }}
                          {...register("country")}
                        >
                          <option value="">Select Country</option>
                          {countries.map((country, index) => {
                            return (
                              <option key={index} value={country.value}>
                                {country.label}
                              </option>
                            );
                          })}
                        </select>
                      </div> */}
                      <div
                        // className=" col-md-5 col-12"
                        style={{
                          marginTop: '24px',
                        }}>
                        <label htmlFor='city'>{profileData?.companyCountry ? 'Country' : 'Email ID'}</label>
                        <input
                          type='text'
                          className='form-control'
                          style={{
                            backgroundColor: '#465A7E66',
                            color: 'white',
                            border: 'none',
                          }}
                          value={profileData?.companyCountry ? profileData?.companyCountry : getProfileFromLocalStorage()?.email}
                          disabled
                          // placeholder="Enter your city"
                          // defaultValue={profileData?.city}
                          // {...(profileData?.city
                          //   ? { value: profileData?.city }
                          //   : { defaultValue: profileData?.city })}
                          // disabled={
                          //   profileData?.city || completePayment ? true : false
                          // }
                          // {...register("city")}
                        />
                      </div>
                      {/* {!profileData?.name && !completePayment && (
                    <div className="form-input-group">
                      <button
                        className="gradient-btn"
                        style={{
                          borderColor: "white",
                          ...(!profileData?.name
                            ? { cursor: "not-allowed" }
                            : {}),
                        }}
                        disabled={!profileData?.name ? true : false}
                      >
                        Add Billing Details
                      </button>
                    </div>
                  )} */}

                      <Box sx={{ paddingTop: 4 }}>
                        <div
                          className='payment-methods'
                          style={{
                            padding: 0,
                          }}>
                          {/* <h3>Select Payment Method</h3> */}

                          <h4
                            style={{
                              color: 'white',
                            }}>
                            2. Payment method
                          </h4>

                          <div
                            // className=" col-md-5 col-12"
                            style={{
                              backgroundColor: 'rgba(243, 167, 53)',
                              // `${primaryColor}`,
                              // "#465A7E66",
                              color: 'white',

                              borderRadius: '8px',
                              marginTop: '24px',
                              padding: '6px 12px',
                            }}>
                            <label
                              style={{
                                cursor: 'no-drop',
                                fontWeight: 700,
                              }}>
                              <input
                                type='radio'
                                value='paypal'
                                checked={selectedPaymentMethod === 'paypal'}
                                onChange={handlePaymentMethodChange}
                                // disabled
                                style={{
                                  padding: '12px',
                                  accentColor: 'white',
                                }}
                              />
                              PayPal
                            </label>
                          </div>

                          {/* <div
                      // className=" col-md-5 col-12"
                      style={{
                        backgroundColor: "#465A7E66",
                        color: "white",

                        borderRadius: "8px",
                        marginTop: "24px",
                        padding: "6px 12px",
                      }}
                    >
                      <label
                        style={{
                          cursor: "no-drop",
                        }}
                      >
                        <input
                          type="radio"
                          value="cryptomus"
                          checked={selectedPaymentMethod === "cryptomus"}
                          onChange={handlePaymentMethodChange}
                          disabled
                        />
                        Cryptomus
                      </label>
                    </div>
                    <div
                      // className=" col-md-5 col-12"
                      style={{
                        backgroundColor: "#465A7E66",
                        color: "white",

                        borderRadius: "8px",
                        marginTop: "24px",
                        padding: "6px 12px",
                      }}
                    >
                      <label> 
                        <input
                          type="radio"
                          value="adyen"
                          checked={selectedPaymentMethod === "adyen"}
                          onChange={handlePaymentMethodChange}
                          disabled
                        />
                        Credit/Debit (Adyen)
                      </label>
                    </div>
                    <div
                      // className=" col-md-5 col-12"
                      style={{
                        backgroundColor: "#465A7E66",
                        color: "white",

                        borderRadius: "8px",
                        marginTop: "24px",
                        padding: "6px 12px",
                      }}
                    >
                      <label
                        style={{
                          cursor: "no-drop",
                        }}
                      >
                        <input
                          type="radio"
                          value="crypto"
                          checked={selectedPaymentMethod === "crypto"}
                          onChange={handlePaymentMethodChange}
                          disabled
                        />
                        Crypto
                      </label>
                    </div> */}
                        </div>
                        {/* Complete Payment Button */}
                        <Button
                          variant='contained'
                          type='submit'
                          data-blast='bgColor'
                          style={{
                            backgroundColor: `${primaryColor}`,
                            color: 'black',
                            fontWeight: 700,
                            width: '200px',
                            height: '50px',
                          }}
                          onClick={onPayment}>
                          {paymentLoading ? (
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                              <CircularProgress />
                            </div>
                          ) : (
                            'Complete Payment'
                          )}
                        </Button>

                        {/* Conditionally show error-related buttons BELOW Complete Payment */}
                        {!paymentLoading && errorCause === 'billingInfo' && (
                          <Button
                            variant='contained'
                            sx={{
                              backgroundColor: 'orange',
                              color: 'white',
                              fontWeight: 700,
                              width: '200px',
                              height: '50px',
                              marginTop: '10px',
                            }}
                            onClick={() => router.push('/billing-info')}>
                            Fix Billing Info
                          </Button>
                        )}

                        {!paymentLoading && errorCause?.toLowerCase().includes('wallet') && (
                          <Button
                            variant='contained'
                            sx={{
                              backgroundColor: 'purple',
                              color: 'white',
                              fontWeight: 700,
                              width: '200px',
                              height: '50px',
                              marginTop: '10px',
                            }}
                            onClick={() => router.push('/update-wallet-address')}>
                            Fix Wallet Info
                          </Button>
                        )}
                      </Box>
                    </div>
                  </div>

                  <form
                    key={'nextForm'}
                    style={{
                      backgroundColor: `${primaryColor}`,
                      padding: '20px',
                      marginTop: '50px',
                      borderRadius: '8px',
                      height: showCartItems ? '460px' : '300px',
                      // maxHeight: "460px",
                    }}
                    className='web-view'
                    //  onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className=''>
                      <h3
                        style={{
                          color: 'white',
                          // padding: "24px",
                        }}>
                        Your purchase summary
                        <hr
                          style={{
                            height: '2px',
                          }}></hr>
                      </h3>

                      <Stack
                        direction='row'
                        justifyContent='space-between'
                        style={
                          {
                            // padding: "24px",
                          }
                        }>
                        <Typography
                          color={grey[500]}
                          sx={{
                            fontSize: '20px',
                            fontWeight: 700,
                            // textDecoration: "line-through",
                            mr: '1rem',
                            color: '#fff',
                          }}>
                          Total Domains & TLDS
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '20px',
                            fontWeight: 700,
                            color: '#fff',
                            cursor: 'pointer',
                          }}
                          onClick={() => setShowCartItems(!showCartItems)}>
                          {showCartItems ? <RemoveCircleRounded /> : <AddCircleRounded />}
                        </Typography>
                      </Stack>

                      {showCartItems && (
                        <List
                          sx={{
                            maxHeight: '150px', // Fixed height
                            overflowY: 'auto', // Scrollable content if overflow
                            backgroundColor: '#222', // Optional: background color for visibility
                            padding: '10px', // Optional: padding for the list
                            marginTop: '10px',
                            borderRadius: '8px',
                            // Optional: margin between list and title
                          }}>
                          {getCartFromLocalStorage().length > 0 &&
                            getCartFromLocalStorage().map((item: any, index: number) => (
                              <div className='col-12' key={index}>
                                <div className='activity-item'>
                                  <div
                                    className='lab-inner d-flex flex-wrap align-items-center'
                                    style={{
                                      borderRadius: '8px',
                                    }}>
                                    <div
                                      style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                      }}>
                                      <div
                                        style={{
                                          display: 'flex',
                                          flexDirection: 'column',
                                          color: '#00edc5',
                                        }}>
                                        <h4>{trimAddress(item?.name)}</h4>
                                        <p>
                                          ${calculateOriginalPrice(item.price?.valueFormatted)}
                                          {/* {item.price?.valueFormatted} */}
                                          {/* {  parseFloat((zoneDetails.amount / 2).toFixed(2))} */}
                                          <span
                                            style={{
                                              paddingLeft: '12px',
                                              fontWeight: 500,
                                              textDecoration: 'line-through',
                                              color: 'grey',
                                            }}>
                                            ${item.price?.valueFormatted}
                                          </span>
                                        </p>
                                      </div>

                                      {/* <IconButton
                        aria-label="delete"
                        sx={{ color: "white" }}
                        onClick={() => handleDeleteDomain(item)}
                      >
                        <DeleteIcon />
                      </IconButton> */}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </List>
                      )}

                      <Box
                        display='flex'
                        flexDirection={'column'}
                        // justifyContent="space-between"
                        // alignItems="center"
                        width='100%'
                        paddingY={1}
                        // padding={2}
                        // paddingRight={4}
                      >
                        <Box
                          color='white'
                          sx={{
                            fontSize: '24px',
                            fontWeight: 600,
                            paddingBottom: 2,
                            display: 'flex',
                          }}>
                          Coupon Code
                        </Box>
                        <Box
                          display='flex'
                          flexDirection='column'
                          // justifyContent="end"
                          // alignItems="end"
                        >
                          <TextField
                            name='ReferralCode'
                            value={promoCodeInput || getCouponFromLocalStorage()}
                            size='small'
                            sx={{
                              width: '100%',
                              paddingRight: '0px',
                              fontSize: 1,
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: '#d9d9d9',
                                },
                                '& input': {
                                  fontSize: '0.8rem',
                                  pr: '0px',
                                  color: 'white',
                                },
                                '&:hover fieldset': {
                                  borderColor: 'white',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: 'white',
                                },
                              },
                            }}
                            onChange={(e) => {
                              setPromoCodeInput(e.target.value);

                              localStorage.setItem('discountPercentage', JSON.stringify(0));
                              saveCouponToLocalStorage(e.target.value);
                              setReferralCodeValid(false);
                            }}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment sx={{ pr: '0px' }} position='end'>
                                  <IconButton
                                    size='small'
                                    {...(isReferralCodeValid ? { color: 'info' } : {})}
                                    sx={{
                                      fontSize: 15,
                                      p: 0,
                                      fontFamily: 'Public Sans',
                                      color: `white`,
                                    }}
                                    onClick={() => validatePromoCode()}>
                                    {getDiscountFromLocalStorage() > 0 ? 'ADDED' : 'APPLY'}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Box>
                      </Box>

                      <Stack
                        direction='row'
                        justifyContent='space-between'
                        // paddingX={2}
                      >
                        <Typography variant='body2' sx={{ color: '#fff' }}>
                          Discount
                        </Typography>
                        <Typography variant='subtitle2'>
                          $k {''}
                          {getDiscountFromLocalStorage() === 0
                            ? (0).toFixed(2)
                            : (
                                calculateTotal() +
                                getSelectedRoyaltiesFromLocalStorage().length * 5 -
                                (calculateTotal() + getSelectedRoyaltiesFromLocalStorage().length * 5) -
                                ((calculateTotal() + getSelectedRoyaltiesFromLocalStorage().length * 5) * getDiscountFromLocalStorage()) / 100
                              ).toFixed(2)}
                        </Typography>
                      </Stack>

                      <Stack
                        direction='row'
                        justifyContent='space-between'
                        style={{
                          paddingTop: '8px',
                          // padding: "24px",
                        }}>
                        <Typography
                          color={grey[500]}
                          sx={{
                            fontSize: '20px',
                            fontWeight: 700,
                            // textDecoration: "line-through",
                            mr: '1rem',
                            color: '#fff',
                          }}>
                          Total Amount
                        </Typography>

                        {getDiscountFromLocalStorage() > 0 ? (
                          <Typography
                            sx={{
                              fontSize: '20px',
                              fontWeight: 700,
                              color: '#fff',
                            }}>
                            ${' '}
                            {
                              // (((calculateTotal() * (100 - discountPerc)) / 100) * 102.5) /
                              //   100
                              (
                                calculateTotal() +
                                getSelectedRoyaltiesFromLocalStorage().length * 5 -
                                ((calculateTotal() + getSelectedRoyaltiesFromLocalStorage().length * 5) * getDiscountFromLocalStorage()) / 100
                              ).toFixed(2)
                            }
                          </Typography>
                        ) : (
                          <Typography
                            sx={{
                              fontSize: '20px',
                              fontWeight: 700,
                              color: '#fff',
                            }}>
                            $ {(calculateTotal() + getSelectedRoyaltiesFromLocalStorage().length * 5).toFixed(2)}
                          </Typography>
                        )}
                      </Stack>
                    </div>
                  </form>
                </div>

                <div className='purchase-summary'>
                  <form
                    key={'nextForm'}
                    style={{
                      backgroundColor: `${primaryColor}`,
                      padding: '20px',
                      marginTop: '50px',
                      borderRadius: '8px',
                    }}
                    className='mobile-view'
                    // onSubmit={handleSubmit(onSubmit)}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                      }}
                      // className="forms-section"
                    >
                      <div
                        className=''
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          width: '100%',
                          marginRight: '24px',
                        }}>
                        <h3
                          style={{
                            color: 'white',
                            // padding: "24px",
                          }}>
                          Your purchase summary
                          <hr
                            style={{
                              height: '2px',
                            }}></hr>
                        </h3>

                        <Stack
                          direction='row'
                          justifyContent='space-between'
                          style={
                            {
                              // padding: "24px",
                            }
                          }>
                          <Typography
                            color={grey[500]}
                            sx={{
                              fontSize: '20px',
                              fontWeight: 700,
                              // textDecoration: "line-through",
                              mr: '1rem',
                              color: '#fff',
                            }}>
                            Total Domains & TLDS
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: '20px',
                              fontWeight: 700,
                              color: '#fff',
                              cursor: 'pointer',
                            }}
                            onClick={() => setShowCartItems(!showCartItems)}>
                            {showCartItems ? <RemoveCircleRounded /> : <AddCircleRounded />}
                          </Typography>
                        </Stack>

                        {showCartItems && (
                          <List
                            sx={{
                              maxHeight: '150px', // Fixed height
                              overflowY: 'auto', // Scrollable content if overflow
                              backgroundColor: '#222', // Optional: background color for visibility
                              padding: '10px', // Optional: padding for the list
                              marginTop: '10px',
                              borderRadius: '8px', // Optional: margin between list and title
                            }}>
                            {getCartFromLocalStorage().length > 0 &&
                              getCartFromLocalStorage().map((item: any, index: number) => (
                                <div className='col-12' key={index}>
                                  <div className='activity-item'>
                                    <div
                                      className='lab-inner d-flex flex-wrap align-items-center'
                                      style={{
                                        borderRadius: '8px',
                                      }}>
                                      <div
                                        style={{
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          width: '100%',
                                        }}>
                                        <div
                                          style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            color: '#00edc5',
                                            width: '100%',
                                          }}>
                                          <div
                                            style={{
                                              display: 'flex',
                                              justifyContent: 'space-between',
                                              width: '100%',
                                            }}>
                                            <h4>{trimAddress(item?.name)}</h4>
                                            <span>{getSelectedRoyaltiesFromLocalStorage().filter((i: any) => i === item?.name) == item?.name && 'Added Royalty of $ 5.00 '}</span>
                                          </div>

                                          <p>
                                            $
                                            {calculateOriginalPrice(
                                              item.price?.valueFormatted,

                                              // +
                                              getSelectedRoyaltiesFromLocalStorage().filter((i: any) => i === item?.name) == item?.name ? true : false
                                            )}
                                            {/* {item.price?.valueFormatted} */}
                                            {/* {  parseFloat((zoneDetails.amount / 2).toFixed(2))} */}
                                            <span
                                              style={{
                                                paddingLeft: '12px',
                                                fontWeight: 500,
                                                textDecoration: 'line-through',
                                                color: 'grey',
                                              }}>
                                              $
                                              {(
                                                parseFloat((item.price?.valueFormatted).replace(/,/g, '')) +
                                                (getSelectedRoyaltiesFromLocalStorage().filter((i: any) => i === item?.name) == item?.name ? 5 : 0)
                                              ).toFixed(2)}
                                            </span>
                                          </p>
                                        </div>

                                        {/* <IconButton
                        aria-label="delete"
                        sx={{ color: "white" }}
                        onClick={() => handleDeleteDomain(item)}
                      >
                        <DeleteIcon />
                      </IconButton> */}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </List>
                        )}

                        <Box
                          display='flex'
                          flexDirection={'column'}
                          // justifyContent="space-between"
                          // alignItems="center"
                          width='100%'
                          paddingY={1}
                          // padding={2}
                          // paddingRight={4}
                        >
                          <Box
                            color='white'
                            sx={{
                              fontSize: '24px',
                              fontWeight: 600,
                              paddingBottom: 2,
                              display: 'flex',
                            }}>
                            Coupon Code
                          </Box>
                          <Box
                            display='flex'
                            flexDirection='column'
                            // justifyContent="end"
                            // alignItems="end"
                          >
                            <TextField
                              name='ReferralCode'
                              value={promoCodeInput || getCouponFromLocalStorage()}
                              size='small'
                              sx={{
                                width: '100%',
                                paddingRight: '0px',
                                fontSize: 1,
                                '& .MuiOutlinedInput-root': {
                                  '& fieldset': {
                                    borderColor: '#d9d9d9',
                                  },
                                  '& input': {
                                    fontSize: '0.8rem',
                                    pr: '0px',
                                    color: 'white',
                                  },
                                  '&:hover fieldset': {
                                    borderColor: 'white',
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: 'white',
                                  },
                                },
                              }}
                              onChange={(e) => {
                                setPromoCodeInput(e.target.value);

                                localStorage.setItem('discountPercentage', JSON.stringify(0));
                                saveCouponToLocalStorage(e.target.value);
                                setReferralCodeValid(false);
                              }}
                              InputLabelProps={{ shrink: true }}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment sx={{ pr: '0px' }} position='end'>
                                    <IconButton
                                      size='small'
                                      {...(isReferralCodeValid ? { color: 'info' } : {})}
                                      sx={{
                                        fontSize: 15,
                                        p: 0,
                                        fontFamily: 'Public Sans',
                                        color: `white`,
                                      }}
                                      onClick={() => validatePromoCode()}>
                                      {getDiscountFromLocalStorage() > 0 ? 'ADDED' : 'APPLY'}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Box>
                        </Box>

                        <Stack
                          direction='row'
                          justifyContent='space-between'
                          // paddingX={2}
                        >
                          <Typography variant='body2' sx={{ color: '#fff' }}>
                            Discount
                          </Typography>
                          <Typography variant='subtitle2'>
                            $ {''}
                            {getDiscountFromLocalStorage() === 0
                              ? (0).toFixed(2)
                              : (
                                  calculateTotal() +
                                  getSelectedRoyaltiesFromLocalStorage().length * 5 -
                                  (calculateTotal() + getSelectedRoyaltiesFromLocalStorage().length * 5) -
                                  ((calculateTotal() + getSelectedRoyaltiesFromLocalStorage().length * 5) * getDiscountFromLocalStorage()) / 100
                                ).toFixed(2)}
                          </Typography>
                        </Stack>

                        <Stack
                          direction='row'
                          justifyContent='space-between'
                          style={{
                            paddingTop: '8px',
                            // padding: "24px",
                          }}>
                          <Typography
                            color={grey[500]}
                            sx={{
                              fontSize: '20px',
                              fontWeight: 700,
                              // textDecoration: "line-through",
                              mr: '1rem',
                              color: '#fff',
                            }}>
                            Total Amount
                          </Typography>

                          {getDiscountFromLocalStorage() > 0 ? (
                            <Typography
                              sx={{
                                fontSize: '20px',
                                fontWeight: 700,
                                color: '#fff',
                              }}>
                              ${' '}
                              {
                                // (((calculateTotal() * (100 - discountPerc)) / 100) * 102.5) /
                                //   100
                                (
                                  calculateTotal() +
                                  getSelectedRoyaltiesFromLocalStorage().length * 5 -
                                  ((calculateTotal() + getSelectedRoyaltiesFromLocalStorage().length * 5) * getDiscountFromLocalStorage()) / 100
                                ).toFixed(2)
                              }
                            </Typography>
                          ) : (
                            <Typography
                              sx={{
                                fontSize: '20px',
                                fontWeight: 700,
                                color: '#fff',
                              }}>
                              $ {(calculateTotal() + getSelectedRoyaltiesFromLocalStorage().length * 5).toFixed(2)}
                            </Typography>
                          )}
                        </Stack>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* {clientSecret && stripePromise && isDialog && (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <Dialog
                  open={isDialog}
                  onClose={() => setDialog(false)}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    {"Use Google's location service?"}
                  </DialogTitle>
                  <DialogContent>
                    <CheckoutForm
                      createPaymentIntentId={createPaymentIntentId}
                      email={profileData?.email}
                      onClose={() => setDialog(false)}
                      amount={amount}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setDialog(false)}>Close</Button>
                  </DialogActions>
                </Dialog>{" "}
              </Elements>
            )} */}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Profile;
