import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAccount } from "wagmi";
// import { useUserRole } from "../context/UserRoleContext";

const ProtectedRoutes = ({ allowedRoles }) => {
  const { status } = useAccount();
  //   const { role } = useUserRole();

  // Check if the user is connected or in the process of connecting
  if (status === "connecting") {
    return <div>Connecting to wallet...</div>; // Or any appropriate loading indicator
  }

  if (status !== "connected") {
    return <Navigate to="/" />;
  }

  // If allowedRoles is provided, check if the user has an appropriate role
  //   if (allowedRoles && !allowedRoles.includes(role)) {
  //     return <Navigate to="/" />;
  //   }

  // If the user is connected and has an appropriate role, render the children
  return <Outlet />;
};

export default ProtectedRoutes;
