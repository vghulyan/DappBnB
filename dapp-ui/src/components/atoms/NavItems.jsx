import React from "react";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";

const NavItems = ({ navItems, sx, ...props }) => {
  return (
    <List
      sx={{ display: "flex", flexDirection: "row", gap: 5, ...sx }}
      {...props}
    >
      {navItems.map((item) => (
        <ListItem key={item.text} disablePadding sx={{ width: "auto" }}>
          <ListItemButton
            component={Link}
            to={item.path}
            sx={{ textAlign: "center" }}
          >
            <ListItemText primary={item.text} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default NavItems;
