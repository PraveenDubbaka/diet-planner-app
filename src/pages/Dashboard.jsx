import React, { useContext, useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import UserDashboard from '../components/UserDashboard';
import { UserContext } from '../contexts/UserContext';

const Dashboard = () => {
  const { userData, isAuthenticated } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // Give the user data a moment to load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Custom container styles for mobile - removing left and right padding
  const containerStyle = isMobile ? {
    p: 0, // Remove all padding
    maxWidth: '100% !important', // Use full width
    mx: 0, // Remove margin
    width: '100vw' // Use viewport width
  } : {};

  if (isLoading) {
    return (
      <Container maxWidth={isMobile ? false : "lg"} disableGutters={isMobile} sx={containerStyle}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth={isMobile ? false : "lg"} disableGutters={isMobile} sx={containerStyle}>
      <Box sx={{ mb: isMobile ? 2 : 4, px: isMobile ? 0 : 2 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ px: isMobile ? 2 : 0 }}>
          {userData ? `Welcome, ${userData.name}!` : 'Welcome to your Dashboard'}
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary" sx={{ px: isMobile ? 2 : 0 }}>
          {userData 
            ? 'Here you can view your profile information, saved diet plans, and health metrics.'
            : 'Please complete your profile to generate personalized diet plans and track your progress.'}
        </Typography>
      </Box>

      <UserDashboard />
    </Container>
  );
};

export default Dashboard;