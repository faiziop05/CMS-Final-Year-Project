// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './store/AuthContext';

const PrivateRoute = ({ element: Element, allowedRoles, ...rest }) => {
  const { isLoggedIn, userType } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userType)) {
    return <Navigate to="/" replace />;
  }

  return <Element {...rest} />;
};

export default PrivateRoute;
