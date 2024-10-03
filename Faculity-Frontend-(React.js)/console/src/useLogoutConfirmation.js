// useLogoutConfirmation.js
import { useEffect, useState } from 'react';

const useLogoutConfirmation = (handleLogout) => {
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const handlePopState = (event) => {
    event.preventDefault();
    setShowLogoutConfirmation(true);
    window.history.pushState(null, null, window.location.pathname);
  };

  useEffect(() => {
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const confirmLogout = () => {
    setShowLogoutConfirmation(false);
    handleLogout();
  };

  const cancelLogout = () => {
    setShowLogoutConfirmation(false);
  };

  return {
    showLogoutConfirmation,
    confirmLogout,
    cancelLogout,
  };
};

export default useLogoutConfirmation;
