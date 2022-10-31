import React from "react";
import { useRouter } from 'next/router';
import FeatherIcon from "feather-icons-react";
import {
  Box,
  Menu,
  Typography,
  MenuItem,
  Button,
  Divider,
} from "@mui/material";
import { useMoralis } from "react-moralis";

const ProfileDD = () => {
  const [anchorEl4, setAnchorEl4] = React.useState(null);
  const router = useRouter();
  const { user, logout } = useMoralis();
  const ethAddy = user && user.get("ethAddress");
  const profilePicture=`https://web3-images-api.kibalabs.com/v1/accounts/${ethAddy}/image`;
  const handleClick4 = (event) => {
    setAnchorEl4(event.currentTarget);
  };

  const handleClose4 = () => {
    setAnchorEl4(null);
  };
  const handleOpensea = () => {
    window.open(`https://opensea.io/${ethAddy}`, "_blank") //to open new page
  }
  const handleTrades = () => {
    router.push('/mytrades');
  }
  const handleLogout = () => {
    logout();
    window.location.href = "/connect";
  }
  return (
    <>
      <Button
        aria-label="menu"
        color="inherit"
        aria-controls="profile-menu"
        aria-haspopup="true"
        onClick={handleClick4}
      >
        <Box display="flex" alignItems="center">
          <img
            src={profilePicture}
            alt={ethAddy}
            width="30"
            height="30"
            className="roundedCircle"
          />
          <Box
            sx={{
              display: {
                xs: "none",
                sm: "flex",
              },
              alignItems: "center",
            }}
          >
            <Typography
              color="textSecondary"
              variant="h5"
              fontWeight="400"
              sx={{ ml: 1 }}
            >
              Hi,
            </Typography>
            <Typography
              variant="h5"
              fontWeight="700"
              sx={{
                ml: 1,
              }}
            >
              {ethAddy && ethAddy.substr(0, 4)}...
            </Typography>
            <FeatherIcon icon="chevron-down" width="20" height="20" />
          </Box>
        </Box>
      </Button>
      <Menu
        id="profile-menu"
        anchorEl={anchorEl4}
        keepMounted
        open={Boolean(anchorEl4)}
        onClose={handleClose4}
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
        <Box>
          <Box
            sx={{
              mb: 1,
            }}
          >
            <Box display="flex" alignItems="center">
              <Typography variant="h4" fontWeight="500">
                User Profile
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              pb: 3,
              mt: 3,
            }}
          >
            <Box display="flex" alignItems="center">
              <img
                width="90"
                height="90"
                src={profilePicture}
                alt={ethAddy}
                className="roundedCircle"
              />
              <Box
                sx={{
                  ml: 2,
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    lineHeight: "1.235",
                  }}
                >
                  {ethAddy && ethAddy.substr(0, 8)}...
                </Typography>
                <Typography color="textSecondary" variant="h6" fontWeight="400">
                  Ethereum Network
                </Typography>
              </Box>
            </Box>
          </Box>
          <Divider
            style={{
              marginTop: 0,
              marginBottom: 0,
            }}
          />

          <Box>
            <MenuItem
              sx={{
                pt: 3,
                pb: 3,
              }}
              onClick={handleOpensea}
            >
              <Box display="flex" alignItems="center">
                <Button
                  sx={{
                    backgroundColor: (theme) => theme.palette.primary.light,
                    color: (theme) => theme.palette.primary.main,
                    boxShadow: "none",
                    minWidth: "50px",
                    width: "45px",
                    height: "40px",
                    borderRadius: "10px",
                  }}
                >
                  <FeatherIcon icon="user" width="18" height="18" />
                </Button>
                <Box
                  sx={{
                    ml: 2,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      lineHeight: "1.235",
                    }}
                  >
                    My Profile
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="h6"
                    fontWeight="400"
                  >
                    Your tokens, NFTs and ENS names
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
            <MenuItem
              sx={{
                pt: 3,
                pb: 3,
              }}
              onClick={handleTrades}
            >
              <Box display="flex" alignItems="center">
                <Button
                  sx={{
                    backgroundColor: (theme) => theme.palette.success.light,
                    color: (theme) => theme.palette.success.main,
                    boxShadow: "none",
                    minWidth: "50px",
                    width: "45px",
                    height: "40px",
                    borderRadius: "10px",
                  }}
                >
                  <FeatherIcon icon="repeat" width="18" height="18" />
                </Button>
                <Box
                  sx={{
                    ml: 2,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      lineHeight: "1.235",
                    }}
                  >
                    My Trades
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="h6"
                    fontWeight="400"
                  >
                    Your initiated trades and exchanges
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
          </Box>
          <Button
            sx={{
              mt: 2,
              display: "block",
              width: "100%",
            }}
            variant="contained"
            color="primary"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Menu>
    </>
  );
};

export default ProfileDD;
