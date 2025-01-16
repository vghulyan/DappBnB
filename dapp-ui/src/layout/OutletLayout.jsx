import React from "react";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";

const OutletLayout = () => {
  return (
    <Box
      sx={{
        mt: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Outlet />
    </Box>
  );
};

export default OutletLayout;
