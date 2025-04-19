import React from 'react';
import AdminLogin from '../components/AdminLogin';
import { AdminProvider } from '../contexts/AdminContext';
import { Box } from '@mui/material';

const AdminLoginPage = () => {
  console.log("Admin login page rendered");
  
  return (
    <AdminProvider>
      <Box sx={{ width: '100%' }}>
        <AdminLogin />
      </Box>
    </AdminProvider>
  );
};

export default AdminLoginPage;