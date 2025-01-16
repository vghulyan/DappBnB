import React from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/system";

const GradientBoxContainer = styled(Box)(({ theme, background }) => ({
  padding: "2px",
  borderRadius: "12px",
  background: background,
  maxWidth: "320px",
}));

const GradientBox = (props) => {
  return <GradientBoxContainer {...props} />;
};

export default GradientBox;
