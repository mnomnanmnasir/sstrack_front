// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ token, suspended, children }) => {
  if (!token) {
    return <Navigate to="/signin" />;
  }

  if (suspended) {
    return <Navigate to="/account" />;
  }

  return children;
};

export default PrivateRoute;
