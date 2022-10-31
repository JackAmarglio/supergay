import React from "react";
import NextLink from "next/link";
import PropTypes from "prop-types";
import {
  Box,
  Drawer,
  useMediaQuery,
  List,
  Link,
  Button,
  Typography,
  ListItem,
  Collapse,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import FeatherIcon from "feather-icons-react";
import LogoIcon from "../logo/LogoIcon";
import Menuitems from "./MenuItems";
// import Buynow from "./Buynow";
import SimpleBar from "simplebar-react";

import { useRouter } from "next/router";

const Sidebar = ({
  isMobileSidebarOpen,
  onSidebarClose,
  isSidebarOpen,
  isUrl,
}) => {
  const [open, setOpen] = React.useState(true);

  const router = useRouter();
  const pathDirect = router.pathname;
  const location = router.pathname;
  const pathWithoutLastPart = router.pathname.slice(
    0,
    router.pathname.lastIndexOf("/")
  );

  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));

  const handleClick = (index) => {
    if (open === index) {
      setOpen((prevopen) => !prevopen);
      console.log(location);
    } else {
      setOpen(index);
    }
  };

  const SidebarContent = (
    <SimpleBar style={{ height: "100%" }}>
      <Box p={2} height="100%">
        <LogoIcon />
        <Box mt={2}>
          <List>
            {Menuitems.map((item, index) => {
              // {/********SubHeader**********/}
              if (item.subheader) {
                return (
                  <li key={item.subheader}>
                    <Typography
                      variant="subtitle2"
                      fontWeight="500"
                      sx={{ my: 2, mt: 4, opacity: "0.4" }}
                    >
                      {item.subheader}
                    </Typography>
                  </li>
                );
                // {/********If Sub Menu**********/}
                /* eslint no-else-return: "off" */
              } else if (item.children) {
                return (
                  <React.Fragment key={item.title}>
                    <ListItem
                      button
                      component="li"
                      onClick={() => handleClick(index)}
                      selected={pathWithoutLastPart === item.href}
                      sx={{
                        mb: 1,
                        ...(pathWithoutLastPart === item.href && {
                          color: "white",
                          backgroundColor: (theme) =>
                            `${theme.palette.primary.main}!important`,
                        }),
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          ...(pathWithoutLastPart === item.href && {
                            color: "white",
                          }),
                        }}
                      >
                        <FeatherIcon icon={item.icon} width="20" height="20" />
                      </ListItemIcon>
                      <ListItemText>{item.title}</ListItemText>
                      {index === open || pathWithoutLastPart === item.href ? (
                        <FeatherIcon icon="chevron-down" size="16" />
                      ) : (
                        <FeatherIcon icon="chevron-right" size="16" />
                      )}
                    </ListItem>
                    <Collapse
                      in={index === open || pathWithoutLastPart === item.href}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="li" disablePadding>
                        {item.children.map((child) => {
                          return (
                            <NextLink
                              key={child.title}
                              href={child.href}
                              onClick={onSidebarClose}
                            >
                              <ListItem
                                button
                                selected={pathDirect === child.href}
                                sx={{
                                  mb: 1,
                                  ...(pathDirect === child.href && {
                                    color: "primary.main",
                                    backgroundColor: "transparent!important",
                                  }),
                                }}
                              >
                                <ListItemIcon
                                  sx={{
                                    svg: { width: "14px", marginLeft: "3px" },
                                    ...(pathDirect === child.href && {
                                      color: "primary.main",
                                    }),
                                  }}
                                >
                                  <FeatherIcon
                                    icon={child.icon}
                                    width="20"
                                    height="20"
                                  />
                                </ListItemIcon>
                                <ListItemText>{child.title}</ListItemText>
                              </ListItem>
                            </NextLink>
                          );
                        })}
                      </List>
                    </Collapse>
                  </React.Fragment>
                );
                // {/********If Sub No Menu**********/}
              } else {
                return (
                  <List component="li" disablePadding key={item.title}>
                    <NextLink href={item.href}>
                      <ListItem
                        onClick={() => handleClick(index)}
                        button
                        selected={pathDirect === item.href}
                        sx={{
                          mb: 1,
                          ...(pathDirect === item.href && {
                            color: "white",
                            backgroundColor: (theme) =>
                              `${theme.palette.primary.main}!important`,
                          }),
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            ...(pathDirect === item.href && { color: "white" }),
                          }}
                        >
                          <FeatherIcon
                            icon={item.icon}
                            width="20"
                            height="20"
                          />
                        </ListItemIcon>
                        <ListItemText onClick={onSidebarClose}>
                          {item.title}
                        </ListItemText>
                      </ListItem>
                    </NextLink>
                  </List>
                );
              }
            })}
          </List>
        </Box>

        {/* <Buynow /> */}
      </Box>
    </SimpleBar>
  );
  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open={isSidebarOpen}
        variant="persistent"
        PaperProps={{
          sx: {
            width: "265px",
            border: "0 !important",
            boxShadow: "0px 7px 30px 0px rgb(113 122 131 / 11%)",
          },
        }}
      >
        {SidebarContent}
      </Drawer>
    );
  }
  return (
    <Drawer
      anchor="left"
      open={isMobileSidebarOpen}
      onClose={onSidebarClose}
      PaperProps={{
        sx: {
          width: "265px",
          border: "0 !important",
        },
      }}
      variant="temporary"
    >
      {SidebarContent}
    </Drawer>
  );
};

Sidebar.propTypes = {
  isMobileSidebarOpen: PropTypes.bool,
  onSidebarClose: PropTypes.func,
  isSidebarOpen: PropTypes.bool,
};

export default Sidebar;
