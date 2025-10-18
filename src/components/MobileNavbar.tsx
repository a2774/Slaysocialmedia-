import React, { useEffect, useState } from 'react';
import { Box, Button, Drawer, IconButton, List, ListItem, ListItemText, Popover } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { primaryColor, trimAddress } from '@/utils/helpers';
import { getProfileFromLocalStorage } from '@/utils/cart';
import { useDisconnect, useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers5/react';
import HowToBuyModal from './HowToBuyModal';
import { useRouter } from 'next/router';

const MobileNavbar = ({ isProfile, setFunction, onLogout, handleModalOpen }: any) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [anchorElConnectWallet, setAnchorElConnectWallet] = useState<HTMLButtonElement | null>(null);
  const { address, isConnected } = useWeb3ModalAccount();
  const { open: openWallet, close } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const openConnectWallet = Boolean(anchorElConnectWallet);
  const idConnectWallet = openConnectWallet ? 'simple-popover' : undefined;

  const onDisconnectClickHandler = async () => {
    // await dispatch(onDisconnect());

    setAnchorElConnectWallet(null);
    disconnect();
  };

  const onConnectWallet = async () => {
    if (!address) {
      toggleSidebar();
      openWallet();

      if (address) {
      }
    }
  };

  const handleClickConnectWallet = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElConnectWallet(event.currentTarget);
  };

  const handleCloseConnectWallet = () => {
    setAnchorElConnectWallet(null);
  };

  const onHomeClick = () => {
    router.push('/');
    toggleSidebar();
  };
  const onLogoClick = () => {
    setFunction(false);
    setSidebarOpen(false);
    router.push('/');
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div>
      {/* Hamburger Icon */}
      <IconButton
        edge='start'
        color='inherit'
        aria-label='menu'
        onClick={toggleSidebar}
        sx={{ display: { xs: 'block', lg: 'none' } }} // Visible on xs (mobile) and hidden on md and up
      >
        <MenuIcon />
      </IconButton>

      {/* Sidebar Drawer */}
      <Drawer
        anchor='left'
        open={sidebarOpen}
        onClose={toggleSidebar}
        sx={{ display: { xs: 'block', lg: 'none' } }} // Visible on xs (mobile) and hidden on md and up
      >
        <Box
          sx={{
            width: 200,
            background: 'black',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px',
          }}>
          <ListItem
            // className="header__logo"
            style={{
              cursor: 'pointer',

              // sx={{ display: { xs: "block", md: "none" } }}
            }}
            // sx={{ display: { xs: "none", md: "block" } }}
            onClick={onLogoClick}>
            <img src='/assets/images/Singhlogo.png' alt='logo' />
          </ListItem>
          <ul className='header__nav mb-0 mt-4'>
            <li className='header__nav-item'>
              <a className='header__nav-link' onClick={onHomeClick} role='button' target='_blank'>
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
                Social Media App
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
                  {trimAddress(address)}
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
                <Box sx={{ padding: 1, cursor: 'pointer', color: 'white' }} onClick={onDisconnectClickHandler}>
                  Disconnect
                </Box>
              </Box>
            </Popover>
          </ul>

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
              onClick={onLogout}>
              Logout
            </Button>
          )}
        </Box>
      </Drawer>
    </div>
  );
};

export default MobileNavbar;
