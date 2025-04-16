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

const LoginForm = ({ onToggleForm }) => {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    const newValue = name === 'rememberMe' ? checked : value;
    
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
    
    // Clear login error when typing
    if (loginError) {
      setLoginError('');
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!form.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const result = login(form.email, form.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setLoginError(result.message || 'Invalid email or password');
    }
  };
  
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
        Welcome Back
      </Typography>
      
      {loginError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {loginError}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
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
              autoFocus
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
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  name="rememberMe"
                  checked={form.rememberMe}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label="Remember me"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 2 }}
            >
              Sign In
            </Button>
          </Grid>
        </Grid>
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Don't have an account?
        </Typography>
        <Button 
          variant="outlined" 
          onClick={onToggleForm}
          sx={{ mt: 1 }}
        >
          Create Account
        </Button>
      </Box>
    </Paper>
  );
};

export default LoginForm;