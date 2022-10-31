import React from "react";
import { useRouter } from 'next/router';
import FeatherIcon from "feather-icons-react";
import { AppBar, Box, IconButton, Toolbar, Badge } from "@mui/material";
import PropTypes from "prop-types";
// Dropdown Component
import ProfileDD from "./ProfileDD";
import NotificationDropdown from "./NotificationDropdown";
import { useMoralis } from 'react-moralis';

const Header = ({
  sx,
  customClass,
  toggleSidebar,
  toggleMobileSidebar,
  position,
}) => {
  const { isAuthenticated, isAuthenticating } = useMoralis();
  const isLogged = isAuthenticated && !isAuthenticating;
  const router = useRouter();

  return (
    <AppBar sx={sx} position={position} elevation={0} className={customClass}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleSidebar}
          size="large"
          sx={{
            display: {
              lg: "flex",
              xs: "none",
            },
          }}
        >
          <FeatherIcon icon="menu" />
        </IconButton>

        <IconButton
          size="large"
          color="inherit"
          aria-label="menu"
          onClick={toggleMobileSidebar}
          sx={{
            display: {
              lg: "none",
              xs: "flex",
            },
          }}
        >
          <FeatherIcon icon="menu" width="20" height="20" />
        </IconButton>

        <Box flexGrow={1} />
        
        {
          isLogged ? (
            <>
              <NotificationDropdown />
              <Box
                sx={{
                  width: "1px",
                  backgroundColor: "rgba(0,0,0,0.1)",
                  height: "25px",
                  ml: 1,
                  mr: 1,
                }}
              />
              <ProfileDD />
            </>
          ) : (
            <>
              <IconButton
                size="large"
                color="inherit"
                onClick={() => router.push('/connect')}
              >
                <FeatherIcon icon="log-in" width="20" height="20" />
              </IconButton>
            </>
          )
        }

      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
  customClass: PropTypes.string,
  position: PropTypes.string,
  toggleSidebar: PropTypes.func,
  toggleMobileSidebar: PropTypes.func,
};

export default Header;
