import React, { useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import { Link } from "react-router-dom";
import {
  Box,
  IconButton,
  MenuItem,
  Typography,
  Divider,
  Menu,
  useTheme,
} from "@mui/material";

import CustomButton from "../atoms/StyledButton";
import { SlicedData } from "../../utils/utils";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 260,
    color:
      theme.palette.mode === "light"
        ? theme.palette.text.secondary
        : theme.palette.text.primary,
    backgroundColor:
      theme.palette.mode === "light"
        ? theme.palette.background.default
        : theme.palette.background.appBar,
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

function AccountMenu({ address, balance, disconnect }) {
  //   const { account, disconnect } = useStateContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();

  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDisconnect = () => {
    disconnect();
    handleMenuClose();
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          margin: 0,
        }}
      >
        <IconButton
          color="inherit"
          aria-controls={open ? "demo-customized-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          variant="contained"
          onClick={handleMenuOpen}
          sx={{ padding: 0, marginBottom: "2px" }}
        >
          <img
            src="/assets/avatar.png"
            alt="nft-logo"
            style={{ maxHeight: "30px", objectFit: "cover" }}
          />
        </IconButton>
        <Typography variant="caption" component="div" sx={{ lineHeight: 1 }}>
          {SlicedData(address)}
        </Typography>
      </Box>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="h6" component="div">
            {SlicedData(address, 16, true)}
          </Typography>
          <Link to="/change-display-name">
            <Typography
              variant="body1"
              component="div"
              sx={{ color: theme?.palette?.primary?.main }}
            >
              Set Display Name
            </Typography>
          </Link>
        </Box>

        {/* BALANCE */}
        <MenuItem sx={{ mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <img
              src="/assets/portfolio.jpg"
              alt="balance-icon"
              style={{
                maxHeight: "50px",
                objectFit: "cover",
                borderRadius: "100%",
              }}
            />
            <Box>
              <Typography variant="h6" component="div">
                Balance
              </Typography>
              <Typography variant="body2" component="span">
                {balance?.formatted ?? 0} ETH
              </Typography>
            </Box>
          </Box>
        </MenuItem>

        {/* PROFILE */}
        <MenuItem sx={{ mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <img
              src="/assets/profile.jpg"
              alt="profile-icon"
              style={{
                maxHeight: "50px",
                objectFit: "cover",
                borderRadius: "100%",
              }}
            />
            <Box>
              <Typography variant="h6" component="div">
                Profile
              </Typography>
              <Typography variant="body2" component="span">
                Active
              </Typography>
            </Box>
          </Box>
        </MenuItem>

        {/* MY PROPERTIES */}
        <MenuItem component={Link} to="/my-properties" sx={{ mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <img
              src="/assets/my_properties.jpg"
              alt="my-properties-icon"
              style={{
                maxHeight: "50px",
                objectFit: "cover",
                borderRadius: "100%",
              }}
            />
            <Box>
              <Typography variant="h6" component="span">
                My Properties
              </Typography>
            </Box>
          </Box>
        </MenuItem>

        {/* <Link to="/create-property"> */}
        {/* CREATE */}
        <MenuItem component={Link} to="/create-property" sx={{ mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <img
              src="/assets/create.jpg"
              alt="create-icon"
              style={{
                maxHeight: "50px",
                objectFit: "cover",
                borderRadius: "100%",
              }}
            />
            <Box>
              <Typography variant="h6" component="div">
                Create
              </Typography>
              <Typography variant="body2" component="span">
                Property
              </Typography>
            </Box>
          </Box>
        </MenuItem>

        {/* TRANSACTION HISTORY */}
        <MenuItem component={Link} to="/transaction-history" sx={{ mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <img
              src="/assets/create.jpg"
              alt="transaction-history"
              style={{
                maxHeight: "50px",
                objectFit: "cover",
                borderRadius: "100%",
              }}
            />
            <Box>
              <Typography variant="h6" component="div">
                Transaction History
              </Typography>
            </Box>
          </Box>
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />

        {/* =========== CUSTOM BUTTON =========== */}
        <MenuItem sx={{ mb: 1 }}>
          <CustomButton
            className="live-expo"
            direction="right"
            onClick={handleDisconnect}
          >
            Disconnect
          </CustomButton>
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />

        {/* PROFILE */}
        <MenuItem sx={{ mb: 1 }}>
          <Typography variant="body1" component="div">
            My Profile
          </Typography>
        </MenuItem>
        <MenuItem sx={{ mb: 1 }}>
          <Typography variant="body1" component="div">
            Edit Profile
          </Typography>
        </MenuItem>
      </StyledMenu>
    </Box>
  );
}

export default AccountMenu;
