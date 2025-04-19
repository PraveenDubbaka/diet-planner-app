import React, { useState, useContext, useEffect } from 'react';
import { AdminContext } from '../contexts/AdminContext';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Container,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { isAdmin, adminLogin } = useContext(AdminContext);
  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    console.log("Admin login check, isAdmin:", isAdmin);
    const timer = setTimeout(() => {
      if (isAdmin) {
        console.log("Already admin, redirecting to dashboard");
        navigate('/admin/dashboard');
      }
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [isAdmin, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validate input
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required');
      return;
    }

    console.log("Attempting login with:", username);
    // Try to log in
    const result = adminLogin(username, password);
    console.log("Login result:", result);
    
    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.message || 'Login failed. Please check your credentials.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Checking authentication...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Admin Login
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            tabIndex={0} // Ensure button is always focusable
          >
            Sign In
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary" align="center">
        </Typography>
      </Paper>
    </Container>
  );
};

export default AdminLogin;