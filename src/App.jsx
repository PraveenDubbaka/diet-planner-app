import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Container, Toolbar } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import OfflineStatusBar from './components/OfflineStatusBar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import Admin from './pages/Admin';
import AdminLoginPage from './pages/AdminLoginPage';
import { UserContext, UserContextProvider } from './contexts/UserContext';

// Protected route component to ensure authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, userData } = React.useContext(UserContext);
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    // Check if localStorage has user data
    const storedUser = localStorage.getItem('userData');
    if (!isAuthenticated && !storedUser) {
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);
  
  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>Loading...</Box>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  
  return children;
};

function App() {
  return (
    <UserContextProvider>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Toolbar /> {/* This empty Toolbar acts as a spacer */}
        <Container component="main" sx={{ flex: 1, py: 4 }}>
          <OfflineStatusBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<Admin />} />
          </Routes>
        </Container>
        <Footer />
      </Box>
    </UserContextProvider>
  );
}

export default App;