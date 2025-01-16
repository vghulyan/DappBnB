import React from "react";

import { toast, Toaster } from "react-hot-toast";

export const useToast = () => {
  const notify = (message, type = "success") => {
    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      case "loading":
        toast.loading(message);
        break;
      case "custom":
        toast(message);
        break;
      default:
        toast(message);
    }
  };

  return { notify };
};

const Toast = () => {
  return (
    <Toaster
      position="bottom-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Define default options
        className: "",
        duration: 10000,
        style: {
          //   background: "#363636",
          color: "#fff",
          borderRadius: "10px",
          background: "#333",
        },

        // Default options for specific types
        // success: {
        //   //   duration: 3000,
        //   theme: {
        //     primary: "green",
        //     secondary: "black",
        //   },
        // },
      }}
    />
  );
};

export default Toast;
