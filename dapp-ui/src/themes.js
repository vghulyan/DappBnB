import { createTheme } from "@mui/material/styles";

export const buttonStyles = {
  textTransform: "none",
};
export const MAIN_BACKGROUND_COLOR = "#272728"; //"#13131d";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#ffffff",
      appBar: "#f5f5f5",
    },
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#303f9f",
    },
    tertiary: { main: "#2600c3" },
    text: {
      primary: "#000000", // Default text color for light mode
      secondary: "#555555", // Secondary text color for light mode
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: MAIN_BACKGROUND_COLOR,
      appBar: "#000005",
    },
    primary: {
      main: "#bb86fc", // Light purple
    },
    secondary: {
      main: "#3700b3", // Dark purple
    },
    tertiary: { main: "#3008f3" },
    text: {
      primary: "#ffffff", // Default text color for dark mode
      secondary: "#aaaaaa", // Secondary text color for dark mode
    },
  },
});

export { lightTheme, darkTheme };
