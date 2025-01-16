import React, { useContext } from "react";
import { ConnectKitButton } from "connectkit";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layout/MainLayout";

import Header from "./components/Header";
import PublicPage from "./pages/PublicPage";
import CreateProperty from "./pages/CreateProperty";
const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<PublicPage />} />
          <Route path="/create-property" element={<CreateProperty />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
