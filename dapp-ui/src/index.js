import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Web3Provider } from "./context/Web3Provider";
import Toast from "./components/helper/Toast";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Web3Provider>
      <App />
      <Toast />
    </Web3Provider>
  </React.StrictMode>
);
