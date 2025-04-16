import React, { useContext, useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import UserDashboard from '../components/UserDashboard';
import { UserContext } from '../contexts/UserContext';

const Dashboard = () => {
  const { userData, isAuthenticated } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Give the user data a moment to load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {userData ? `Welcome, ${userData.name}!` : 'Welcome to your Dashboard'}
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
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