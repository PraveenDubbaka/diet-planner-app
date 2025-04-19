import React from 'react';
import AdminFoodManager from '../components/AdminFoodManager';
import { AdminProvider } from '../contexts/AdminContext';
import { Box, Typography } from '@mui/material';

const Admin = () => {
  console.log("Admin dashboard page rendered");
  
  return (
    <AdminProvider>
      <Box sx={{ width: '100%' }}>
        <AdminFoodManager />
      </Box>
    </AdminProvider>
  );
};

export default Admin;