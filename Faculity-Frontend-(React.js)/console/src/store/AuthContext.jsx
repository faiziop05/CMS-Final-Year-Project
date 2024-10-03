// AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isLoggedIn: !!localStorage.getItem('token'),
    token: localStorage.getItem('token') || null,
    userType: localStorage.getItem('userType') || null, // 'admin', 'teacher', 'mainAdmin'
  });

  const login = (token, userType) => {
    setAuth({ isLoggedIn: true, token, userType });
    localStorage.setItem('token', token);
    localStorage.setItem('userType', userType);
  };

  const logout = () => {
    setAuth({ isLoggedIn: false, token: null, userType: null });
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
