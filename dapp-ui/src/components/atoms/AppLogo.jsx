import { Typography } from "@mui/material";
import React from "react";

export default function AppLogo({ sx, ...props }) {
  return (
    <Typography
      variant="h6"
      noWrap
      component="a"
      href="/"
      sx={{
        color: "inherit",
        textDecoration: "none",
        display: "block",
        ...sx,
      }}
      {...props}
    >
      Dapp Prop
    </Typography>
  );
}
