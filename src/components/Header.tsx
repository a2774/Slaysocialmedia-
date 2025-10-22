import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Popover,
  Typography,
  Alert,
  InputAdornment,
  TextField,
  Stack,
  CircularProgress,
  Checkbox,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCallback, useEffect, useState } from 'react';

import axiosInstance, { BASE_URL } from '@/axios/axiosInstance';
import {
  clearTokens,
  getCartFromLocalStorage,
  getCouponFromLocalStorage,
  getDiscountFromLocalStorage,
  getProfileFromLocalStorage,
  getSelectedRoyaltiesFromLocalStorage,
  saveCouponToLocalStorage,
} from '@/utils/cart';
import { calculateOriginalPrice, LOCAL_FRONTEND_URL, primaryColor, PRODUCTION_FRONTEND_URL, trimAddress, useBoolean } from '@/utils/helpers';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers5/react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import CheckoutForm from './Card/CheckoutForm';
import PaymentNewCardDialog from './PaymentCard';
import { useDisconnect } from '@web3modal/ethers5/react';
import { grey } from '@/theme/pallete';
import MobileNavbar from './MobileNavbar';
import { on } from 'events';
import HowToBuyModal from './HowToBuyModal';
import { onGlobalRemoveFromCart } from '@/store/reducers/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowDownward, ArrowDropDown } from '@mui/icons-material';
import React from 'react';

const stripePromise = loadStripe('pk_test_51Pj099RvejnIGWAlDDbZ9C4RLfQrEibdyUwwC2tdPVJqjenQKuSjIBOzkBbXYH8IjPPYxUk4Ek6qlfw90BhmC2Iv00R3hNAHOS');

export const calculateTotal = () => {
  const { totalPrice, totalCount } = getCartFromLocalStorage().reduce(
    (accumulator: any, item: any) => {
      const price = calculateOriginalPrice(item.price?.valueFormatted);

      return {
        totalPrice: accumulator.totalPrice + Number(price),
        // totalCount: accumulator.totalCount + 1
      };
    },
    { totalPrice: 0, totalCount: 0 }
  );

  return totalPrice;
};

const Header = ({ setFunction, isSearchComponent, cart, isCart = true }: any) => {
  const { open: openWalletConnect } = useWeb3Modal();
  const [open, setOpen] = useState(false);
  const [isProfile, setIsProfile] = useState(false);
  const { address, isConnected } = useWeb3ModalAccount();
  const [addCard, setAddCard] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [createPaymentIntentId, setCreatePaymentIntentId] = useState();
  const [isDialog, setDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [anchorElConnectWallet, setAnchorElConnectWallet] = useState<HTMLButtonElement | null>(null);
  const { disconnect } = useDisconnect();
  const [addressValue, setAddressValue] = useState<any>(address);
  const { open: openWallet, close } = useWeb3Modal();
  const [isClient, setIsClient] = useState(false);
  const [updatedCartItems, setUpdatedCartItems] = useState(getCartFromLocalStorage());
  const [isReferralCodeValid, setReferralCodeValid] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const [selectedRoyalties, setSelectedRoyalties] = useState<boolean[]>([]);
  const [selectAllRoyalties, setSelectAllRoyalties] = useState<boolean>(false);
  const [totalRoyalties, setTotalRoyalties] = useState(0);
  const [localStorageSelectedRoyalties, setLocalStorageSelectedRoyalties] = useState<any>([]);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const router = useRouter();

  // const onDisconnectClickHandler = async () => {
  //   // await dispatch(onDisconnect());
  //   setAddressValue('');
  //   setAnchorElConnectWallet(null);
  //   disconnect();
  // };

  const onDisconnectClickHandler = async () => {
    try {
      await axiosInstance.post('/user/update-walletAddress', { walletAddress: '0x0' });
      console.log('Wallet address removed successfully from database');

      disconnect();

      setAddressValue('');
      setAnchorElConnectWallet(null);

      toast.info('Wallet disconnected successfully', {
        position: 'top-right',
        style: { top: '120px' },
      });
    } catch (err) {
      console.error('Error removing wallet address:', err);
      toast.error('Failed to remove wallet address. Try again.');
    }
  };

  const onConnectWallet = async () => {
    if (!isConnected) {
      openWallet();
    }
  };

  useEffect(() => {
    if (address) {
      console.log('Connected wallet address:', address);
      setAddressValue(address);
      console.log('Connected wallet address:', address);

      axiosInstance
        .post('/user/update-walletAddress', { walletAddress: address })
        .then(() => console.log('Wallet address updated successfully'))
        .catch((err) => console.error('Error updating wallet address:', err));
    }
  }, [address]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleDrawer = (open: boolean) => () => {
    console.log('first');
    setOpen(open);
  };

  const cartItems = getCartFromLocalStorage();

  useEffect(() => {
    // Initialize royalties selection state based on cart items

    setSelectedRoyalties(new Array(cartItems.length).fill(false));
  }, []);

  useEffect(() => {
    const token = getProfileFromLocalStorage()?.Token;
    if (token) {
      setIsProfile(true);
    }
  }, []);

  const dispatch = useDispatch();
  const { cart: globalCart } = useSelector((state: any) => state.user);

  useEffect(() => {}, [globalCart]);

  const handleDeleteDomain = async (itemToDelete: any) => {
    await dispatch(onGlobalRemoveFromCart(itemToDelete));

    const cartItems = getCartFromLocalStorage();

    const updatedCartItems = cartItems.filter((item: any) => item.name !== itemToDelete.name);
    const itemIndex = cartItems.findIndex((cartItem: any) => cartItem.name === itemToDelete.name);
    if (itemToDelete?.type === 'TLD' && selectedRoyalties[itemIndex]) {
      // If item had royalties, decrease the total royalties by $5
      setTotalRoyalties((prevRoyalties) => prevRoyalties - 5);
    }

    // Update the royalties state by removing the corresponding selection
    const updatedRoyalties = [...selectedRoyalties];
    updatedRoyalties.splice(itemIndex, 1);
    setSelectedRoyalties(updatedRoyalties);

    const updatedIds = getSelectedRoyaltiesFromLocalStorage().filter((id: any) => id != itemToDelete?.name);
    console.log('#updatedIds', updatedIds);
    localStorage.setItem('selectedRoyalties', JSON.stringify(updatedIds));

    // setLocalStorageSelectedRoyalties(up)
    localStorage.setItem('cart', JSON.stringify(updatedCartItems));

    setUpdatedCartItems(updatedCartItems);
  };
  //console.log("selectedRoyalties", selectedRoyalties);

  const domainNames = updatedCartItems.map((item: any) => item.name);

  const onCheckout = async () => {
    const token = localStorage.getItem('profile');
    if (!token) {
      // router.push("/login");
      window.location.assign('/login');
    } else {
      router.push('/checkout');

      //  window.location.assign("/register-profile");

      // onPayment();
    }
  };

  const newCard = useBoolean();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const isCheckoutEnabled = cartItems.length > 0;
  const handleCheckout = isCheckoutEnabled ? onCheckout : undefined;

  const getPaymentMethods = useCallback(async () => {
    const response = await axiosInstance.get(`${BASE_URL}/freename/retrieveUserPaymentMethods`);

    setPaymentMethods(response.data.data);
  }, []);

  const handleSelectAllRoyalties = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setSelectAllRoyalties(isChecked);
    setSelectedRoyalties(new Array(getCartFromLocalStorage().length).fill(isChecked));
  };

  // const handleSelectRoyalty = (index: number) => {
  //   const updatedRoyalties = [...selectedRoyalties];
  //   updatedRoyalties[index] = !updatedRoyalties[index];
  //   setSelectedRoyalties(updatedRoyalties);

  //   // If any of the individual royalties are unselected, uncheck the "Select All" checkbox
  //   if (updatedRoyalties.includes(false)) {
  //     setSelectAllRoyalties(false);
  //   } else {
  //     setSelectAllRoyalties(true);
  //   }
  // };

  const handleSelectRoyalty = (index: number, item: any) => {
    const updatedRoyalties = [...selectedRoyalties];
    updatedRoyalties[index] = !updatedRoyalties[index];
    setSelectedRoyalties(updatedRoyalties);

    // const updated = [...localStorageSelectedRoyalties, item?.name];

    // setLocalStorageSelectedRoyalties(updated);

    const isSelected = !!updatedRoyalties[index];

    // Create a new array without mutating the original
    console.log('isse', isSelected);
    const updated = isSelected ? [...localStorageSelectedRoyalties, item?.name] : getSelectedRoyaltiesFromLocalStorage().filter((i: any) => i !== item?.name); // Remove the item if it's selected

    setLocalStorageSelectedRoyalties(updated);
    ``;
    localStorage.setItem('selectedRoyalties', JSON.stringify(updated));
    console.log('#updatedRoyalties', updatedRoyalties[index]);
    if (updatedRoyalties[index]) {
      setTotalRoyalties((prevRoyalties) => prevRoyalties + 5);
    } else {
      setTotalRoyalties((prevRoyalties) => prevRoyalties - 5);
    }
  };

  const list = () => {
    //console.log("add", totalRoyalties);
    return (
      <Box
        sx={{
          maxWidth: 350,
          width: '100%',
          background: 'black',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
        role='presentation'>
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
          }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 2,
            }}>
            <h2>My Cart</h2>
            <Button onClick={toggleDrawer(false)}>
              <IoCloseCircleOutline
                style={{
                  width: '36px',
                  height: '36px',
                }}
              />
            </Button>
          </Box>

          {/* {  <Box display="flex" alignItems="center" padding={2}>
          <Checkbox
            checked={selectAllRoyalties}
            onChange={handleSelectAllRoyalties}
            sx={{ color: "white" }}
          />
          <Typography sx={{ color: "white" }}>Add Royalties All</Typography>
        </Box>} */}

          <Divider />
          <List>
            {getCartFromLocalStorage().length > 0 ? (
              getCartFromLocalStorage().map((item: any, index: number) => (
                <div className='col-12' key={index}>
                  <div className='activity-item'>
                    <div className='lab-inner d-flex flex-wrap align-items-center p-3 p-md-4'>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          width: '100%',
                          border: '1px solid white',
                          borderRadius: '8px',
                          padding: '12px',
                          wordBreak: 'break-word',
                        }}>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            color: '#00edc5',
                          }}>
                          <h4 style={{ marginBottom: '7px' }}>{trimAddress(item?.name)}</h4>
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
                          {item?.type === 'TLD' && (
                            <Box display='flex' alignItems='center'>
                              <Checkbox checked={selectedRoyalties[index]} onChange={() => handleSelectRoyalty(index, item)} sx={{ color: 'white' }} />

                              <Box display={'flex'} flexDirection={'column'}>
                                <h4>Add Royalties</h4>
                                <span>$ 5.00</span>
                                <span>(One time payment)</span>
                              </Box>
                            </Box>
                          )}

                          {/* <Checkbox
                          checked={selectedRoyalties[index]}
                          onChange={() => handleSelectRoyalty(index)}
                          sx={{ color: "white" }}
                        /> */}
                        </div>

                        <IconButton aria-label='delete' sx={{ color: 'white' }} onClick={() => handleDeleteDomain(item)}>
                          <DeleteIcon />
                        </IconButton>

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
              ))
            ) : (
              <ListItem>
                <ListItemText sx={{ color: 'white' }} primary='Cart is empty' />
              </ListItem>
            )}
          </List>
        </Box>
        <Box
          display='flex'
          flexDirection={'column'}
          // justifyContent="space-between"
          // alignItems="center"
          width='100%'
          paddingY={4}
          padding={2}
          paddingRight={4}>
          <Box
            color={grey[500]}
            sx={{
              fontSize: '16px',
              fontWeight: 600,
              paddingBottom: 2,
              display: 'flex',
            }}>
            Have any coupon?
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
                    color: '#d9d9d9',
                  },
                  '&:hover fieldset': {
                    borderColor: '#d9d9d9',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#d9d9d9',
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
                        color: `${grey[500]}`,
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

        <Stack direction='row' justifyContent='space-between' paddingX={2}>
          <Typography variant='body2' sx={{ color: '#fff' }}>
            Discount
          </Typography>
          <Typography variant='subtitle2'>
            $ {''}
            {getDiscountFromLocalStorage() === 0
              ? (0).toFixed(2)
              : (calculateTotal() + totalRoyalties - (calculateTotal() + totalRoyalties) - ((calculateTotal() + totalRoyalties) * getDiscountFromLocalStorage()) / 100).toFixed(2)}
          </Typography>
        </Stack>

        <Divider sx={{ mt: 3, mb: 2, color: '#fff' }} />

        <Stack direction='row' justifyContent='space-between' paddingX={2}>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#fff' }}>{cartItems.length} Items</Typography>
          {getDiscountFromLocalStorage() > 0 ? (
            <Stack direction='row' justifyContent='space-between'>
              {(calculateTotal() + totalRoyalties).toFixed(2) !=
                (calculateTotal() + totalRoyalties - ((calculateTotal() + totalRoyalties) * getDiscountFromLocalStorage()) / 100).toFixed(2) && (
                <Typography
                  color={grey[500]}
                  sx={{
                    fontSize: '20px',
                    fontWeight: 700,
                    textDecoration: 'line-through',
                    mr: '1rem',
                    color: '#fff',
                  }}>
                  $ {(calculateTotal() + totalRoyalties).toFixed(2)}
                </Typography>
              )}
              <Typography sx={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>
                ${' '}
                {
                  // (((calculateTotal() * (100 - discountPerc)) / 100) * 102.5) /
                  //   100
                  (calculateTotal() + totalRoyalties - ((calculateTotal() + totalRoyalties) * getDiscountFromLocalStorage()) / 100).toFixed(2)
                }
              </Typography>
            </Stack>
          ) : (
            <Typography sx={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>$ {(calculateTotal() + totalRoyalties).toFixed(2)}</Typography>
          )}
        </Stack>

        <Box
          sx={{
            paddingX: 2,
            // borderTop: "1px solid #ccc",
            color: '#fff',
            position: 'relative',
            bottom: 0,
          }}>
          {/* <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>Gateway fee</div>

          <div>
            + ${" "}
            {
              ((calculateTotal() * 2.5) / 100).toFixed(2)

              // calculateTotal() -
              //   ((calculateTotal() * (100 - discountPerc)) / 100).toFixed(2)
            }
          </div>
        </div> */}
          {/* <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>Total</div>

          <div>
            ${" "}
            {((calculateTotal() * (100 - discountPerc)) / 100 / 100).toFixed(2)}

          </div>
        </div> */}

          <div className='load-btn ' onClick={handleCheckout}>
            <a
              // className="default-btn move-bottom"
              className={`default-btn move-bottom ${!isCheckoutEnabled ? 'disabled' : ''}`}
              style={{
                // cursor: "pointer",
                cursor: isCheckoutEnabled ? 'pointer' : 'not-allowed',
                background: `${primaryColor}`,
              }}>
              <span>
                {paymentLoading ? (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      padding: '4px',
                      // width: "26px",
                      // height: "26px",
                    }}>
                    <CircularProgress />
                  </div>
                ) : (
                  'Checkout'
                )}
              </span>
            </a>
          </div>
          <Elements stripe={stripePromise}>
            <PaymentNewCardDialog open={addCard} onClose={() => setAddCard(false)} getPaymentMethods={getPaymentMethods} />
          </Elements>
        </Box>
        <Box>
          {clientSecret && stripePromise && isDialog && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              {/* <CustomTransitionDialog
                    dialog={dialog}
                    title="  Complete Your Payment"
                    children={
                      <CheckoutForm
                        ticketTypeData={ticketTypePayload}
                        eventId={id}
                        createPaymentIntentId={createPaymentIntentId}
                        email={email}
                      />
                    }
                  /> */}
              <Dialog open={isDialog} onClose={() => setDialog(false)} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
                <DialogTitle id='alert-dialog-title'>{"Use Google's location service?"}</DialogTitle>
                <DialogContent>
                  <CheckoutForm createPaymentIntentId={createPaymentIntentId} email={'hhdhjdjs@gmail.com'} />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setDialog(false)}>Close</Button>
                </DialogActions>
              </Dialog>{' '}
            </Elements>
          )}
        </Box>
      </Box>
    );
  };

  const onLogout = () => {
    clearTokens();
    // window.location.reload();
    router.push('/login');
    // window.location.assign("/login");
    // window.location.reload();
  };

  const onLogoClick = () => {
    setFunction(false);
    router.push('/');
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClickConnectWallet = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElConnectWallet(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open1 = Boolean(anchorEl);
  const id = open1 ? 'simple-popover' : undefined;

  const openConnectWallet = Boolean(anchorElConnectWallet);
  const idConnectWallet = openConnectWallet ? 'simple-popover' : undefined;

  const handleCloseConnectWallet = () => {
    setAnchorElConnectWallet(null);
  };
  const [discountPerc, setDiscountPerc] = useState(0);
  const [finalamount, setFinalamount] = useState(0);
  const [amount, setAmount] = useState(0);

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
          setFinalamount(calculateTotal() + totalRoyalties - (calculateTotal() + totalRoyalties) * (discountPerc / 100));
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
    [amount, discountPerc, id, promoCodeInput]
  );

  // useEffect(() => {
  //   console.log("promocode", promoCodeInput);
  //   if (promoCodeInput === "") {
  //     localStorage.removeItem("discountPercentage");
  //     localStorage.removeItem("referralCoupon");
  //   }
  // }, []);

  const onClickDomainList = async () => {
    router.push('/domain');
    // window.location.assign("/domain");
  };

  const onClickTldList = async () => {
    router.push('/tld');
  };

  const onClickPurchases = async () => {
    router.push('/purchases');
    // window.location.assign("/purchases");
  };

  const onClickProfile = () => {
    router.push('/profile');
  };

  const onClickIncomes = () => {
    router.push('/incomes');
  };

  if (!isClient) {
    return null;
  }

  // console.log("#location", router.pathname);
  return (
    <>
      <header
        className='header home-4'
        // style={{
        //   height: "128px",
        // }}
        style={{
          // height: window.innerWidth <= 768 ? "150px" : "128px",
          position: 'fixed', // Add this
          top: 0, // Position it at the top
          left: 0, // Align it with the left edge
          right: 0, // Align it with the right edge
          zIndex: 1000,
          backgroundColor: '#2F2C2A',
          // Ensure it appears above other elements
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}>
        <Alert
          variant='filled'
          severity='info'
          style={{
            fontSize: '20px',
            backgroundColor: '#5138ee',
            fontWeight: 700,
          }}>
          ❗❗ *Limited Offer* ❗❗ Get 50% Discount on all Domains 💥
        </Alert>

        <div
          className='container-fluid'
          style={{
            backgroundColor: '#2F2C2A',
          }}>
          <div className='header__content'>
            <Box
              // className="header__logo"
              style={{
                cursor: 'pointer',

                // sx={{ display: { xs: "block", md: "none" } }}
              }}
              sx={{ display: { xs: 'none', lg: 'block' } }}
              onClick={onLogoClick}>
              <img src='/assets/images/Singhlogo.png' alt='logo' />
            </Box>

            <MobileNavbar
              isProfile={isProfile}
              onLogout={onLogout}
              setFunction={setFunction}
              // openModal={isModalOpen}
              // handleClose={handleModalClose}
              handleModalOpen={handleModalOpen}
            />
            <div className='header__menu '>
              <ul className='header__nav mb-0'>
                <li className='header__nav-item'>
                  <a className='header__nav-link' onClick={() => router.push('/')} role='button' target='_blank'>
                    Home
                  </a>
                </li>
                {/* <li className="header__nav-item">
                <a
                  className="header__nav-link"
                  href="https://singhcoin.io/"
                  role="button"
                  target="_blank"
                >
                  About
                </a>
              </li> */}
                {/* <li className="header__nav-item">
                <a
                  className="header__nav-link"
                  href="https://app.singhcoin.io/"
                  role="button"
                  target="_blank"
                >
                  App
                </a>
              </li> */}
                <li className='header__nav-item'>
                  <a
                    className='header__nav-link'
                    // href="https://app.singhcoin.io/"
                    role='button'
                    target='_blank'
                    onClick={handleModalOpen}>
                    How to buy
                  </a>
                </li>
                <li className='header__nav-item'>
                  <a
                    className='header__nav-link'
                    // href="https://app.singhcoin.io/"
                    role='button'
                    target='_blank'
                    onClick={() => router.push('/faqs')}>
                    FAQS
                  </a>
                </li>

                {isClient && isConnected && address ? (
                  <li className='header__nav-item'>
                    <button
                      // variant="contained"
                      style={{
                        border: '1px solid white',
                        padding: '12px',
                        borderRadius: '12px',
                        backgroundColor: 'transparent',
                        color: 'white',
                      }}
                      onClick={handleClickConnectWallet}>
                      {trimAddress(address, 10)}
                    </button>
                  </li>
                ) : (
                  <li className='header__nav-item'>
                    {getProfileFromLocalStorage()?.Token && (
                      <button
                        // variant="contained"
                        // data-blast="bgColor"
                        // style={{
                        //   backgroundColor: `${primaryColor}`,
                        //   color: "black",
                        //   fontWeight: 700,
                        // }}
                        style={{
                          border: '1px solid white',
                          padding: '12px',
                          borderRadius: '12px',
                          backgroundColor: 'transparent',
                          color: 'white',
                        }}
                        onClick={onConnectWallet}>
                        Connect Wallet
                      </button>
                    )}
                  </li>
                )}

                <Popover
                  id={idConnectWallet}
                  open={openConnectWallet}
                  anchorEl={anchorElConnectWallet}
                  onClose={handleCloseConnectWallet}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  sx={{
                    '& .MuiModal-root-MuiPopover-root': {
                      position: 'absolute',
                    },
                    '& .MuiPopover-paper': {
                      backgroundColor: '#2F2C2A', // Set background color here
                      borderRadius: '8px',
                    },
                  }}>
                  <Box sx={{ padding: 2 }}>
                    <Box sx={{ padding: 1, cursor: 'pointer', color: '#fff' }} onClick={onDisconnectClickHandler}>
                      Disconnect
                    </Box>
                  </Box>
                </Popover>
              </ul>
            </div>

            <HowToBuyModal open={isModalOpen} handleClose={handleModalClose} />
            <div className='header__actions'>
              <div
                className='header__action'
                style={{
                  width: 'auto',
                }}>
                <div className='dropdown'>
                  {/* profile */}
                  {isProfile ? (
                    <Button onClick={handleClick}>
                      <a
                        className='dropdown-toggle'
                        // href="#"
                        role='button'
                        data-bs-toggle='dropdown'
                        aria-expanded='false'
                        data-bs-offset='-100,10'>
                        <span data-blast='bgColor'>
                          <i className='icofont-user' />
                        </span>
                        <span className='d-none d-md-inline'>{getProfileFromLocalStorage()?.username}</span>
                      </a>
                      <ArrowDropDown
                        style={{
                          color: 'white',
                        }}
                      />
                    </Button>
                  ) : (
                    router.pathname !== '/login' &&
                    router.pathname !== '/signup' &&
                    router.pathname !== '/verify-otp' && (
                      <Button
                        variant='contained'
                        type='submit'
                        data-blast='bgColor'
                        style={{
                          backgroundColor: `${primaryColor}`,
                          color: 'black',
                          fontWeight: 700,
                        }}
                        onClick={() => router.push('/login')}>
                        Login
                      </Button>
                    )
                  )}

                  <Popover
                    id={id}
                    open={open1}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    sx={{
                      '& .MuiModal-root-MuiPopover-root': {
                        position: 'absolute',
                      },
                      '& .MuiPopover-paper': {
                        backgroundColor: '#2F2C2A', // Set background color here
                        borderRadius: '8px',
                      },
                    }}>
                    <Box sx={{ padding: 2 }}>
                      <Box
                        sx={{
                          padding: 1,
                          cursor: 'pointer',
                          color: '#fff',
                        }}
                        onClick={onClickDomainList}>
                        Domain List
                      </Box>
                      <Box
                        sx={{
                          padding: 1,
                          cursor: 'pointer',
                          color: '#fff',
                        }}
                        onClick={onClickTldList}>
                        TLD List
                      </Box>

                      <Box
                        sx={{
                          padding: 1,
                          cursor: 'pointer',
                          color: '#fff',
                        }}
                        onClick={onClickProfile}>
                        Profile
                      </Box>
                      <Box
                        sx={{
                          padding: 1,
                          cursor: 'pointer',
                          color: '#fff',
                        }}
                        onClick={onClickIncomes}>
                        Incomes
                      </Box>

                      <Box
                        sx={{
                          padding: 1,
                          cursor: 'pointer',
                          color: '#fff',
                        }}
                        onClick={onClickPurchases}>
                        Purchases
                      </Box>
                    </Box>
                  </Popover>
                </div>
              </div>
              <Box
                sx={{
                  padding: '12px',
                  display: { xs: 'none', md: 'block' },
                }}>
                {isProfile && (
                  <Button
                    variant='contained'
                    type='submit'
                    data-blast='bgColor'
                    style={{
                      backgroundColor: `${primaryColor}`,
                      color: 'black',
                      fontWeight: 700,
                    }}
                    sx={{ display: { xs: 'none', md: 'block' } }}
                    onClick={onLogout}>
                    Logout
                  </Button>
                )}
              </Box>
            </div>
            {isCart && (
              <div
                style={{
                  display: 'flex',
                  position: 'relative',
                  cursor: 'pointer',
                }}
                onClick={toggleDrawer(true)}>
                <ShoppingCartIcon
                  style={{
                    width: '32px',
                    height: '32px',
                  }}
                />
                {getCartFromLocalStorage().length > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '-10px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '24px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      // color: "red",
                      backgroundColor: 'red',
                    }}>
                    {getCartFromLocalStorage().length > 9 ? '9+' : getCartFromLocalStorage().length}
                  </div>
                )}
              </div>
            )}
            <Drawer anchor='right' open={open} onClose={toggleDrawer(false)}>
              {list()}
            </Drawer>
          </div>
        </div>
        {/* Floating Cart Button */}
      </header>

      {isSearchComponent && (
        <Button
          variant='contained'
          // endIcon={
          //   <ShoppingCartIcon
          //     style={{
          //       width: "32px",
          //       height: "32px",
          //     }}
          //   />
          // }
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: primaryColor,
            color: 'white',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            zIndex: 999,
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            justifyContent: 'center', // Center content horizontally
            alignItems: 'center',
          }}
          onClick={toggleDrawer(true)}>
          <ShoppingCartIcon
            style={{
              width: '32px',
              height: '32px',
            }}
          />
          {getCartFromLocalStorage().length > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-10px',
                width: '24px',
                height: '24px',
                borderRadius: '24px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                // color: "red",
                backgroundColor: 'red',
              }}>
              {getCartFromLocalStorage().length > 9 ? '9+' : getCartFromLocalStorage().length}
            </div>
          )}
        </Button>
      )}
    </>
  );
};

export default Header;
