import React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

const StyledButton = styled(Button)(({ direction }) => {
  return {
    display: "inline-block",
    fontWeight: 500,
    textAlign: "center",
    fontSize: 16,
    border: "2px solid var(--color-primary)", // Added border
    color: "var(--color-white)",
    padding: "10px 16px",
    borderRadius: "10px",
    transition: "var(--transition)",
    letterSpacing: "0.5px",
    width: "auto",
    boxShadow: "none",
    outline: "none",
    position: "relative",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "var(--color-hover)",
    },
    "&.live-expo::before, &.live-expo::after": {
      width: "16px",
      height: "16px",
      position: "absolute",
      [direction === "right" ? "right" : "left"]: "-10px",
      top: "50%",
      content: '""',
      transform: "translateY(-50%)",
      borderRadius: "100%",
      opacity: 1,
    },
    "&.live-expo::before": {
      background: "var(--color-primary)",
      animation: "customLiveAnimation 1s infinite",
    },
    "&.live-expo::after": {
      border: "4px solid var(--color-primary)",
      animation: "customLiveAnimation 1.2s infinite",
    },
  };
});

const CustomButton = ({ children, direction = "right", ...props }) => {
  return (
    <StyledButton direction={direction} {...props}>
      {children}
    </StyledButton>
  );
};

export default CustomButton;
