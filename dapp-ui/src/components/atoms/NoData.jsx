import React from "react";
import { Typography, Box } from "@mui/material";

const NoData = ({ message }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "10vh",
    }}
  >
    <Typography variant="h5">{message}</Typography>
  </Box>
);

export default NoData;
