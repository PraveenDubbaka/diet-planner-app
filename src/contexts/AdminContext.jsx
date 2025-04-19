import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const AdminContext = createContext({
  isAdmin: false,
  adminToken: null,
  adminLogin: () => {},
  adminLogout: () => {}
});

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminToken, setAdminToken] = useState(null);

  // Check if admin is logged in on component mount
  useEffect(() => {
    const storedAdminToken = localStorage.getItem('adminToken');
    if (storedAdminToken) {
      setAdminToken(storedAdminToken);
      setIsAdmin(true);
    }
  }, []);

  // Admin login function
  const adminLogin = (username, password) => {
    // Simple admin authentication - in a real app, this should use a secure backend
    if (username === 'admin' && password === 'admin123') {
      const token = 'admin-' + Math.random().toString(36).substring(2);
      localStorage.setItem('adminToken', token);
      setAdminToken(token);
      setIsAdmin(true);
      return { success: true };
    }
    return { success: false, message: 'Invalid admin credentials' };
  };

  // Admin logout function
  const adminLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken(null);
    setIsAdmin(false);
  };

  // Context value
  const value = {
    isAdmin,
    adminToken,
    adminLogin,
    adminLogout
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

// Don't use default export to avoid confusion
// No default export here - use named exports instead