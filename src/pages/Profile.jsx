import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import ProfileForm from '../components/ProfileForm';

const Profile = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Your Profile Information
        </Typography>
        <Typography variant="body1" paragraph align="center" color="text.secondary">
          Fill out your details below to get a personalized diet plan tailored to your needs
        </Typography>
      </Box>
      
      <ProfileForm />
    </Container>
  );
};

export default Profile;