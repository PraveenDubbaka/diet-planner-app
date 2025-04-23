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
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
  CircularProgress
} from '@mui/material';
import { UserContext } from '../contexts/UserContext';

const LoginForm = ({ onToggleForm }) => {
  const { login, resetPassword } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // State for forgot password dialog
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetEmailError, setResetEmailError] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  
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
    
    // Check network connectivity before attempting login
    if (!navigator.onLine) {
      setLoginError("You appear to be offline. Please check your internet connection and try again.");
      return;
    }
    
    try {
      setIsLoggingIn(true);
      console.log("Attempting login for:", form.email);
      const result = await login(form.email, form.password);
      console.log("Login result:", result);
      
      if (result.success) {
        console.log("Login successful, navigating to dashboard");
        navigate('/dashboard');
      } else {
        console.log("Login failed:", result.message);
        // Special handling for offline or connectivity errors
        if (result.message?.includes("offline") || 
            result.message?.includes("network") || 
            result.message?.includes("unavailable")) {
          setLoginError("Unable to connect to the server. You might be offline or experiencing network issues.");
        } else {
          setLoginError(result.message || 'Invalid email or password');
        }
      }
    } catch (error) {
      console.error("Login error caught in component:", error);
      // Check if the error is related to being offline
      if (!navigator.onLine || 
          error.message?.includes("offline") || 
          error.message?.includes("network") ||
          error.code === "unavailable") {
        setLoginError("Login failed: You appear to be offline. Some app features may be limited.");
      } else {
        setLoginError('Login failed. Please try again.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  // Forgot password handlers
  const handleForgotPasswordOpen = () => {
    setForgotPasswordOpen(true);
    setResetEmail(form.email || ''); // Pre-fill with login email if available
  };
  
  const handleForgotPasswordClose = () => {
    setForgotPasswordOpen(false);
    setResetEmail('');
    setResetEmailError('');
  };
  
  const validateResetEmail = () => {
    if (!resetEmail.trim()) {
      setResetEmailError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(resetEmail)) {
      setResetEmailError('Please enter a valid email address');
      return false;
    }
    return true;
  };
  
  const handleResetPassword = async () => {
    if (!validateResetEmail()) return;
    
    setIsResetting(true);
    try {
      const result = await resetPassword(resetEmail);
      
      if (result.success) {
        setResetSuccess(result.message || 'Password reset email sent. Please check your inbox.');
        handleForgotPasswordClose();
      } else {
        setResetEmailError(result.message || 'Failed to send reset email. Please try again.');
      }
    } catch (error) {
      // More specific error message for when the email doesn't exist
      setResetEmailError('No account found with this email address. Please check your email or create a new account.');
      console.error(error);
    } finally {
      setIsResetting(false);
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
      
      {resetSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {resetSuccess}
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
              disabled={isLoggingIn}
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
              disabled={isLoggingIn}
            />
          </Grid>
          
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Checkbox
                  name="rememberMe"
                  checked={form.rememberMe}
                  onChange={handleChange}
                  color="primary"
                  disabled={isLoggingIn}
                />
              }
              label="Remember me"
            />
            <Link 
              component="button"
              variant="body2"
              onClick={handleForgotPasswordOpen}
              underline="hover"
              disabled={isLoggingIn}
              sx={{ pointerEvents: isLoggingIn ? 'none' : 'auto', opacity: isLoggingIn ? 0.7 : 1 }}
            >
              Forgot password?
            </Link>
          </Grid>
          
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 2 }}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                  Signing in...
                </Box>
              ) : (
                'Sign In'
              )}
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
          disabled={isLoggingIn}
        >
          Create Account
        </Button>
      </Box>
      
      {/* Forgot Password Dialog */}
      <Dialog open={forgotPasswordOpen} onClose={isResetting ? undefined : handleForgotPasswordClose}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter your email address below and we'll send you a link to reset your password.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="resetEmail"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={resetEmail}
            onChange={(e) => {
              setResetEmail(e.target.value);
              if (resetEmailError) setResetEmailError('');
            }}
            error={!!resetEmailError}
            helperText={resetEmailError}
            sx={{ mt: 2 }}
            disabled={isResetting}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleForgotPasswordClose} disabled={isResetting}>
            Cancel
          </Button>
          <Button 
            onClick={handleResetPassword} 
            variant="contained" 
            color="primary"
            disabled={isResetting}
          >
            {isResetting ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default LoginForm;