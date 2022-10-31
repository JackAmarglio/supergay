import React from "react";
import { useEffect } from 'react';
import NextLink from 'next/link';
import FeatherIcon from "feather-icons-react";
import Image from "next/image";
import {
  Box,
  MenuItem,
  Typography,
  Avatar,
  Divider,
  IconButton,
  Menu,
  Chip,
  Button,
  Link,
  Badge,
} from "@mui/material";
import { useMoralis } from 'react-moralis';
import api from 'services/api';
import { toast } from 'react-toastify';

const NotificationDropdown = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [data, setData] = React.useState([]);
  const { user, isAuthenticated, isAuthenticating, isInitialized } = useMoralis();
  const userAddy = user && user.get('ethAddress');
  const fetchData = async () => {
    try {
        const { data: lr } = await api.get('/trade/notifications', {
            params: {
                to: userAddy
            }
        });
        if(!lr.success)
            throw new Error(lr.message);
        setData(lr.trades);
    } catch (err) {
        toast.error(err.message);
    }
}
useEffect( () => {
    if(isInitialized && !isAuthenticating && isAuthenticated)
    fetchData();
},  
// eslint-disable-next-line react-hooks/exhaustive-deps
[isAuthenticated, isAuthenticating]);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <IconButton
        size="large"
        aria-label="menu"
        color="inherit"
        aria-controls="notification-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <Badge variant="dot" color="secondary">
          <FeatherIcon icon="bell" width="20" height="20" />
        </Badge>
      </IconButton>
      <Menu
        id="notification-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "385px",
            right: 0,
            top: "70px !important",
          },
          "& .MuiList-padding": {
            p: "30px",
          },
        }}
      >
        <Box
          sx={{
            mb: 1,
          }}
        >
          <Box display="flex" alignItems="center">
            <Typography variant="h4" fontWeight="500">
              Notifications
            </Typography>
            <Box
              sx={{
                ml: 2,
              }}
            >
              <Chip
                size="small"
                label={data.length}
                sx={{
                  borderRadius: "6px",
                  pl: "5px",
                  pr: "5px",
                  backgroundColor: (theme) => theme.palette.warning.main,
                  color: "#fff",
                }}
              />
            </Box>
          </Box>
        </Box>
        <Box>
          {data.map((notification, index) => (
            <Box key={index}>
              <MenuItem
                sx={{
                  pt: 2,
                  pb: 2,
                  borderRadius: "0px",
                }}
              >
                <Box display="flex" alignItems="center">
                  <Image
                    src={`https://web3-images-api.kibalabs.com/v1/accounts/${notification.from}/image`}
                    alt={`https://web3-images-api.kibalabs.com/v1/accounts/${notification.from}/image`}
                    width="45px"
                    height="45px" className="roundedCircle"
                  />
                  <Box
                    sx={{
                      ml: 2,
                    }}
                  >
                    <Typography
                      variant="h5"
                      noWrap
                      sx={{
                        width: "240px",
                      }}
                    >
                      Trade request incoming
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="h6"
                      noWrap
                      fontWeight="400"
                      sx={{
                        width: "240px",
                      }}
                    >
                      {notification.from} requested a new trade
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
              <Divider
                style={{
                  marginTop: 0,
                  marginBottom: 0,
                }}
              />
            </Box>
          ))}
        </Box>
        <NextLink
          href="/mytrades"
          passHref
        >
          <Button
            sx={{
              mt: 2,
              display: "block",
              width: "100%",
            }}
            variant="contained"
            color="primary"
            onClick={handleClose}
          >
            
            <Typography>
              See all notifications
            </Typography>
          </Button>
        </NextLink>
      </Menu>
    </>
  );
};
export default NotificationDropdown;
