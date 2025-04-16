import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Alert,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { UserContext } from '../contexts/UserContext';

const RegisterForm = ({ onToggleForm }) => {
  const { register } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  
  const [errors, setErrors] = useState({});
  const [registrationError, setRegistrationError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    const newValue = name === 'acceptTerms' ? checked : value;
    
    setForm({
      ...form,
      [name]: newValue
    });
    
    // Clear errors when typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
    
    // Clear registration error when typing
    if (registrationError) {
      setRegistrationError('');
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!form.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const result = register(form.name, form.email, form.password);
    
    if (result.success) {
      setRegistrationSuccess(true);
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } else {
      setRegistrationError(result.message || 'Registration failed. Please try again.');
    }
  };
  
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
        Create an Account
      </Typography>
      
      {registrationError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {registrationError}
        </Alert>
      )}
      
      {registrationSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Registration successful! Redirecting to profile setup...
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              required
              autoFocus
              disabled={registrationSuccess}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              required
              disabled={registrationSuccess}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              required
              disabled={registrationSuccess}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              required
              disabled={registrationSuccess}
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  name="acceptTerms"
                  checked={form.acceptTerms}
                  onChange={handleChange}
                  color="primary"
                  disabled={registrationSuccess}
                />
              }
              label="I agree to the terms and conditions"
            />
            {errors.acceptTerms && (
              <Typography variant="caption" color="error">
                {errors.acceptTerms}
              </Typography>
            )}
          </Grid>
          
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 2 }}
              disabled={registrationSuccess}
            >
              Register
            </Button>
          </Grid>
        </Grid>
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Already have an account?
        </Typography>
        <Button 
          variant="outlined" 
          onClick={onToggleForm}
          sx={{ mt: 1 }}
          disabled={registrationSuccess}
        >
          Sign In
        </Button>
      </Box>
    </Paper>
  );
};

export default RegisterForm;