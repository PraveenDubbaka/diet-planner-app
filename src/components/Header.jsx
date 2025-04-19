import React, { useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container,
  useMediaQuery,
  useTheme,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Tooltip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LoginIcon from '@mui/icons-material/Login';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { UserContext } from '../contexts/UserContext';
import { useState } from 'react';

const Header = () => {
  const { userData, isAuthenticated, logout } = useContext(UserContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const navigate = useNavigate();
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenu = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    navigate('/');
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <RestaurantIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              fontWeight: 700,
              color: 'white',
              textDecoration: 'none',
              flexGrow: isMobile ? 0 : 1,
            }}
          >
            DietPlanner
          </Typography>

          {isMobile ? (
            <>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMenu}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem 
                  component={RouterLink} 
                  to="/"
                  onClick={handleClose}
                >
                  Home
                </MenuItem>
                
                {isAuthenticated ? (
                  <>
                    <MenuItem 
                      component={RouterLink} 
                      to="/dashboard"
                      onClick={handleClose}
                    >
                      Dashboard
                    </MenuItem>
                    <MenuItem 
                      component={RouterLink} 
                      to="/profile"
                      onClick={handleClose}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      Logout
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem 
                      component={RouterLink} 
                      to="/auth"
                      onClick={handleClose}
                    >
                      Login
                    </MenuItem>
                    <MenuItem 
                      component={RouterLink} 
                      to="/profile"
                      onClick={handleClose}
                    >
                      Get Started
                    </MenuItem>
                  </>
                )}
                
                <MenuItem 
                  component={RouterLink} 
                  to="/admin"
                  onClick={handleClose}
                >
                  Admin
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/"
              >
                Home
              </Button>
              
              {isAuthenticated ? (
                <>
                  <Button 
                    color="inherit" 
                    component={RouterLink} 
                    to="/dashboard"
                  >
                    Dashboard
                  </Button>
                  <Button 
                    color="inherit" 
                    component={RouterLink} 
                    to="/profile"
                  >
                    Profile
                  </Button>
                  <Box sx={{ ml: 2 }}>
                    <Tooltip title="Account settings">
                      <IconButton
                        onClick={handleUserMenu}
                        size="small"
                        sx={{ p: 0.5, color: 'white' }}
                      >
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                          {userData?.name?.charAt(0) || <PersonIcon />}
                        </Avatar>
                      </IconButton>
                    </Tooltip>
                    <Menu
                      anchorEl={userMenuAnchorEl}
                      open={Boolean(userMenuAnchorEl)}
                      onClose={handleUserMenuClose}
                      onClick={handleUserMenuClose}
                      PaperProps={{
                        elevation: 0,
                        sx: {
                          overflow: 'visible',
                          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                          mt: 1.5,
                          '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                          },
                        },
                      }}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                      <MenuItem component={RouterLink} to="/profile">
                        <PersonIcon sx={{ mr: 1 }} /> My Profile
                      </MenuItem>
                      <MenuItem onClick={handleLogout}>
                        <ExitToAppIcon sx={{ mr: 1 }} /> Logout
                      </MenuItem>
                    </Menu>
                  </Box>
                </>
              ) : (
                <>
                  <Button 
                    color="inherit"
                    component={RouterLink}
                    to="/auth"
                    startIcon={<LoginIcon />}
                  >
                    Login
                  </Button>
                  <Button 
                    color="inherit" 
                    component={RouterLink} 
                    to="/profile"
                    variant="outlined" 
                    sx={{ ml: 1 }}
                  >
                    Get Started
                  </Button>
                </>
              )}
              
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/admin"
                startIcon={<AdminPanelSettingsIcon />}
                sx={{ ml: 2 }}
              >
                Admin
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;