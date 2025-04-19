import React, { useState, useEffect, useContext } from 'react';
import { AdminContext } from '../contexts/AdminContext';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Snackbar,
  IconButton,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { 
  getFoodCategories, 
  getCustomFoods, 
  addNewFood, 
  deleteCustomFood 
} from '../data/foodDatabase';
import { useNavigate } from 'react-router-dom';

const AdminFoodManager = () => {
  // Context and navigation
  const { isAdmin, adminLogout } = useContext(AdminContext);
  const navigate = useNavigate();
  
  // UI States
  const [loading, setLoading] = useState(true);
  const [customFoods, setCustomFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Form state
  const [newFood, setNewFood] = useState({
    name: '',
    category: '',
    baseQuantity: '',
    caloriesPer100g: '',
    proteinPer100g: '',
    carbsPer100g: '',
    fatsPer100g: '',
    fiberPer100g: ''
  });

  // Initial authentication check and redirect if needed
  useEffect(() => {
    console.log("Admin status:", isAdmin); // For debugging
    
    const timer = setTimeout(() => {
      if (!isAdmin) {
        console.log("Not admin, redirecting to login");
        navigate('/admin');
      }
      setLoading(false);
    }, 500); // Slightly longer delay to ensure context is loaded
    
    return () => clearTimeout(timer);
  }, [isAdmin, navigate]);

  // Load data when admin is authenticated
  useEffect(() => {
    if (isAdmin) {
      try {
        const foodCategories = getFoodCategories();
        const userCustomFoods = getCustomFoods();
        
        setCategories(foodCategories);
        setCustomFoods(userCustomFoods);
        
        console.log("Loaded categories:", foodCategories.length);
        console.log("Loaded custom foods:", userCustomFoods.length);
      } catch (error) {
        console.error("Error loading data:", error);
        setNotification({
          open: true,
          message: "Error loading data: " + error.message,
          severity: 'error'
        });
      }
    }
  }, [isAdmin]);

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (['caloriesPer100g', 'proteinPer100g', 'carbsPer100g', 'fatsPer100g', 'fiberPer100g'].includes(name)) {
      setNewFood({ ...newFood, [name]: value === '' ? '' : parseFloat(value) });
    } else {
      setNewFood({ ...newFood, [name]: value });
    }
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Form validation
    if (!newFood.name || !newFood.category || !newFood.baseQuantity ||
        newFood.caloriesPer100g === '' || newFood.proteinPer100g === '' ||
        newFood.carbsPer100g === '' || newFood.fatsPer100g === '') {
      setNotification({
        open: true,
        message: 'Please fill all required fields',
        severity: 'error'
      });
      return;
    }
    
    // Prepare food object
    const foodToAdd = {
      ...newFood,
      fiberPer100g: newFood.fiberPer100g === '' ? 0 : newFood.fiberPer100g
    };
    
    // Add food to database
    try {
      const result = addNewFood(foodToAdd);
      
      if (result.success) {
        // Reset form
        setNewFood({
          name: '',
          category: '',
          baseQuantity: '',
          caloriesPer100g: '',
          proteinPer100g: '',
          carbsPer100g: '',
          fatsPer100g: '',
          fiberPer100g: ''
        });
        
        // Update foods list
        setCustomFoods(getCustomFoods());
        
        // Show success message
        setNotification({
          open: true,
          message: 'Food added successfully!',
          severity: 'success'
        });
      } else {
        setNotification({
          open: true,
          message: result.message || 'Error adding food',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error("Error adding food:", error);
      setNotification({
        open: true,
        message: "Error adding food: " + error.message,
        severity: 'error'
      });
    }
  };

  // Delete food handler
  const handleDeleteFood = (foodName) => {
    try {
      const result = deleteCustomFood(foodName);
      
      if (result.success) {
        setCustomFoods(getCustomFoods());
        setNotification({
          open: true,
          message: 'Food deleted successfully!',
          severity: 'success'
        });
      } else {
        setNotification({
          open: true,
          message: result.message || 'Error deleting food',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error("Error deleting food:", error);
      setNotification({
        open: true,
        message: "Error deleting food: " + error.message,
        severity: 'error'
      });
    }
  };

  // Close notification handler
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  // Handle logout
  const handleLogout = () => {
    adminLogout();
    navigate('/admin');
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading admin dashboard...</Typography>
      </Box>
    );
  }

  // Not authorized state
  if (!isAdmin) {
    return null;
  }

  // Main component render
  return (
    <Container>
      <Box sx={{ my: 4, pt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Food Database Manager
        </Typography>
        
        <Button 
          variant="outlined" 
          color="secondary" 
          sx={{ mb: 4 }}
          onClick={handleLogout}
        >
          Logout
        </Button>
        
        <Grid container spacing={4}>
          {/* Form to add new food */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Add New Food Item
              </Typography>
              
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Food Name"
                  name="name"
                  value={newFood.name}
                  onChange={handleInputChange}
                />
                
                <FormControl fullWidth required margin="normal">
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    id="category"
                    name="category"
                    value={newFood.category}
                    label="Category"
                    onChange={handleInputChange}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="baseQuantity"
                  label="Base Quantity (e.g., '100g', '1 medium (118g)')"
                  name="baseQuantity"
                  value={newFood.baseQuantity}
                  onChange={handleInputChange}
                  helperText="Specify a base quantity like '100g' or '1 medium (118g)'"
                />
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="caloriesPer100g"
                      label="Calories per 100g"
                      name="caloriesPer100g"
                      type="number"
                      value={newFood.caloriesPer100g}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="proteinPer100g"
                      label="Protein per 100g"
                      name="proteinPer100g"
                      type="number"
                      value={newFood.proteinPer100g}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="carbsPer100g"
                      label="Carbs per 100g"
                      name="carbsPer100g"
                      type="number"
                      value={newFood.carbsPer100g}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="fatsPer100g"
                      label="Fats per 100g"
                      name="fatsPer100g"
                      type="number"
                      value={newFood.fatsPer100g}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
                
                <TextField
                  margin="normal"
                  fullWidth
                  id="fiberPer100g"
                  label="Fiber per 100g (optional)"
                  name="fiberPer100g"
                  type="number"
                  value={newFood.fiberPer100g}
                  onChange={handleInputChange}
                />
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3 }}
                >
                  Add Food
                </Button>
              </Box>
            </Paper>
          </Grid>
          
          {/* Table of custom foods */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Custom Foods
              </Typography>
              
              {customFoods.length === 0 ? (
                <Alert severity="info">
                  No custom foods added yet. Add your first custom food item using the form.
                </Alert>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Calories</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {customFoods.map((food) => (
                        <TableRow key={food.name}>
                          <TableCell>{food.name}</TableCell>
                          <TableCell>{food.category}</TableCell>
                          <TableCell>{food.caloriesPer100g}</TableCell>
                          <TableCell>
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={() => handleDeleteFood(food.name)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
      
      {/* Notification snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminFoodManager;