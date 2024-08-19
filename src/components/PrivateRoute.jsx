import React from 'react';
import { Navigate } from 'react-router-dom';
import { readCookie } from '../utils'; 
const PrivateRoute = ({ element, allowedRoles }) => {
    const token = readCookie('token');
    const userRole = parseInt(readCookie('role'), 10);
  if (!token) {
    // Redirect to login if no token
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(userRole)) {
    // Redirect to home or forbidden page if role is not allowed
    return <Navigate to="/" />;
  }

  return element;
};

export default PrivateRoute;
