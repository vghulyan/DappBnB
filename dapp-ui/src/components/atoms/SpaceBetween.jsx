import { Box } from "@mui/material";
import React from "react";

const SpaceBetween = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      {children}
    </Box>
  );
};

export default SpaceBetween;
