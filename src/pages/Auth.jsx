import React, { useState } from 'react';
import { Container, Typography, Box, Paper, Tabs, Tab } from '@mui/material';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const Auth = () => {
  const [currentTab, setCurrentTab] = useState(0);
  
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  
  const toggleForm = () => {
    setCurrentTab(currentTab === 0 ? 1 : 0);
  };
  
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 8 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          DietPlanner
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" paragraph>
          Sign in to save your diet plans and track your progress
        </Typography>
        
        <Paper elevation={0} sx={{ mb: 3, borderRadius: 2 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Sign In" />
            <Tab label="Create Account" />
          </Tabs>
        </Paper>
        
        {currentTab === 0 ? (
          <LoginForm onToggleForm={toggleForm} />
        ) : (
          <RegisterForm onToggleForm={toggleForm} />
        )}
      </Box>
    </Container>
  );
};

export default Auth;