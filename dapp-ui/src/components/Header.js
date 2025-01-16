import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import {
  AppBar,
  Box,
  Container,
  Divider,
  Drawer,
  Toolbar,
  IconButton,
  useTheme,
  Badge,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  // Mail as MailIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";

import AppLogo from "./atoms/AppLogo";
import NavItems from "./atoms/NavItems";

import { useStateContext } from "../context/StateContextProvider";
import AccountMenu from "./organisms/AccountMenu";

import { Search, SearchIconWrapper, StyledInputBase } from "./molecules/Search";

import CustomButton from "./atoms/StyledButton";
import { DEFAULT_IMAGE_URL } from "../context/contracts";
import { ConnectKitButton } from "connectkit";

const drawerWidth = 240;

export const navItemsData = [{ text: "Home", path: "/" }];

export default function Header({ window, ...props }) {
  const {
    isAdmin,
    useAccount,
    useConnect,
    chainId,
    balance,
    useDisconnect,
    transactionHash,
    notificationCount,
    markNotificationsAsRead,
  } = useStateContext();
  const { connectors, connectAsync } = useConnect();
  const { disconnect } = useDisconnect();

  const metaMaskConnector = connectors.find(
    (connector) => connector.type === "injected"
  );

  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { address, isConnected: wagmiIsConnected } = useAccount();

  const [navItems, setNavItems] = useState(navItemsData);

  const { notify, useWatchContractEventFunction } = useStateContext();

  useEffect(() => {
    if (isAdmin && !navItems.some((item) => item.text === "Admin")) {
      setNavItems((prevItems) => [
        ...prevItems,
        { text: "Admin", path: "/admin" },
      ]);
    } else if (!isAdmin && navItems.some((item) => item.text === "Admin")) {
      setNavItems((prevItems) =>
        prevItems.filter((item) => item.text !== "Admin")
      );
    }
  }, [isAdmin]);

  // Handle removing the "Admin" item on disconnect
  useEffect(() => {
    if (!wagmiIsConnected) {
      setNavItems((prevItems) =>
        prevItems.filter((item) => item.text !== "Admin")
      );
    }
  }, [wagmiIsConnected]);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  // const handleConnect = async () => {
  //   console.log("connect wallet....");
  //   const connectW = await connectWallet();
  //   console.log("connect wallet: ", connectW);
  // };
  const handleConnect = async () => {
    if (!metaMaskConnector) {
      console.error("MetaMask connector not found");
      return;
    }

    try {
      const { accounts: connectedAccounts } = await connectAsync({
        connector: metaMaskConnector,
        chainId,
      });

      if (connectedAccounts?.[0]) {
        notify("Successfully connected!", "success");
      } else {
        notify("Failed to connect", "error");
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      notify("Failed to connect", "error");
    }
  };

  const handleMarkNotifiedHandler = () => {
    console.log("Transaction Hash:", transactionHash);
    markNotificationsAsRead();
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <AppLogo sx={{ my: 2 }} />
      <Divider />
      <NavItems navItems={navItems} />
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;
  console.log("app bar: ", theme.palette.background.appBar);
  return (
    <>
      <AppBar
        position="sticky"
        sx={{ backgroundColor: theme.palette.background.appBar }}
      >
        <Toolbar>
          <Container
            maxWidth="lg"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Box
              sx={{
                maxHeight: "35px",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <AppLogo />
              <Link to="/">
                <img
                  src={`${DEFAULT_IMAGE_URL}`}
                  alt="nft-logo"
                  style={{
                    maxHeight: "35px",
                    objectFit: "cover",
                    borderRadius: "5%",
                  }}
                />
              </Link>
            </Box>

            <NavItems
              navItems={navItems}
              sx={{
                display: { xs: "none", sm: "flex" },
                flexDirection: "row",
              }}
            />

            <Box
              sx={{
                maxHeight: "35px",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Search sx={{ borderRadius: "5%" }}>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ "aria-label": "search" }}
                />
              </Search>

              <Badge
                badgeContent={notificationCount}
                color="primary"
                onClick={handleMarkNotifiedHandler}
              >
                <NotificationsIcon color="action" />
              </Badge>
              <Box>
                {address ? (
                  <AccountMenu
                    address={address}
                    balance={balance}
                    disconnect={disconnect}
                  />
                ) : (
                  <ConnectKitButton />
                )}
              </Box>
            </Box>
          </Container>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </>
  );
}
