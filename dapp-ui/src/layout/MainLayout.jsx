import { Outlet } from "react-router-dom";
import { Container } from "@mui/material";

const MainLayout = () => {
  return (
    <>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "85vh",

          pt: 8,
        }}
      >
        <Outlet />
      </Container>
    </>
  );
};

export default MainLayout;
