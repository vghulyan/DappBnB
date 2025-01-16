import React, { createContext, useMemo, useState } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { darkTheme, lightTheme } from "../themes";

/*<IconButton color="inherit" onClick={colorMode.toggleColorMode}>
              {theme.palette.mode === "dark" ? (
                <Brightness7Icon />
              ) : (
                <Brightness4Icon />
              )}
            </IconButton>
            */

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const ColorModeContextProvider = ({ children }) => {
  const [mode, setMode] = useState("dark");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(
    () => (mode === "light" ? lightTheme : darkTheme),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
