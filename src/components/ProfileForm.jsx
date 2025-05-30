import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
  useMediaQuery,
  useTheme,
  Tooltip,
  IconButton,
  Alert,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { UserContext } from '../contexts/UserContext';
import { calculateBMI, calculateBMR, calculateTDEE, calculateCalorieNeeds, calculateMacros } from '../utils/calculations';

const ProfileForm = () => {
  const { userData, updateUserProfileData, isAuthenticated, changeUserPassword } = useContext(UserContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Form state and other existing states
  const [form, setForm] = useState({
    name: '',
    email: '',
    age: '',
    gender: 'male',
    feet: '5',
    inches: '7',
    weight: '',
    activityLevel: 'moderate',
    goal: 'maintain',
    dietType: '',
    isGlutenFree: false,
    dietaryRestrictions: [],
  });

  // Add state for form validation errors
  const [formErrors, setFormErrors] = useState({});
  
  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordMessage, setPasswordMessage] = useState({
    type: '',
    text: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // Add state for updating profile
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Add state for success message
  const [successMessage, setSuccessMessage] = useState('');
  
  // Add state for error message
  const [errorMessage, setErrorMessage] = useState('');

  // Add mobile-specific state for summary visibility
  const [showMobileSummary, setShowMobileSummary] = useState(true);

  // Toggle mobile summary visibility
  const toggleMobileSummary = () => {
    setShowMobileSummary(!showMobileSummary);
  };

  // Load user data if it exists (for profile editing)
  useEffect(() => {
    if (userData) {
      const heightInInches = userData.height ? Math.round(userData.height / 2.54) : 67; // Default to 5'7"
      const feet = Math.floor(heightInInches / 12);
      const inches = heightInInches % 12;
      setForm({
        name: userData.name || '',
        email: userData.email || '',
        age: userData.age || '',
        gender: userData.gender || 'male',
        feet: feet.toString() || '5',
        inches: inches.toString() || '7',
        weight: userData.weight || '',
        activityLevel: userData.activityLevel || 'moderate',
        goal: userData.goal || 'maintain',
        dietType: userData.dietType || 'standard',
        isGlutenFree: userData.isGlutenFree || false,
        dietaryRestrictions: userData.dietaryRestrictions || [],
      });
    }
  }, [userData]);

  // Validate form fields
  const validateForm = () => {
    const errors = {};
    
    if (!form.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!form.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!form.age) {
      errors.age = 'Age is required';
    } else if (isNaN(parseInt(form.age)) || parseInt(form.age) < 1 || parseInt(form.age) > 120) {
      errors.age = 'Age must be between 1 and 120';
    }
    
    if (!form.weight) {
      errors.weight = 'Weight is required';
    } else if (isNaN(parseFloat(form.weight)) || parseFloat(form.weight) < 20 || parseFloat(form.weight) > 500) {
      errors.weight = 'Weight must be between 20 and 500 kg';
    }
    
    if (!form.dietType) {
      errors.dietType = 'Please select a diet type';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Clear previous messages
    setSuccessMessage('');
    setErrorMessage('');
    
    // Validate all required fields
    if (!validateForm()) {
      setErrorMessage('Please fill in all required fields');
      window.scrollTo(0, 0);
      return;
    }
    
    setIsUpdatingProfile(true);
    
    try {
      // Convert height from feet/inches to cm
      const heightInInches = parseInt(form.feet) * 12 + parseInt(form.inches);
      const heightInCm = Math.round(heightInInches * 2.54);
      
      // Calculate metrics
      const bmi = calculateBMI(parseFloat(form.weight), heightInCm);
      const bmr = calculateBMR(
        parseFloat(form.weight),
        heightInCm,
        parseInt(form.age),
        form.gender
      );
      const tdee = calculateTDEE(bmr, form.activityLevel);
      const calorieNeeds = calculateCalorieNeeds(tdee, form.goal);
      const macros = calculateMacros(calorieNeeds, form.dietType, form.goal);
      
      // Create updated user data
      const updatedData = {
        name: form.name,
        email: form.email,
        age: parseInt(form.age),
        gender: form.gender,
        height: heightInCm,
        weight: parseFloat(form.weight),
        activityLevel: form.activityLevel,
        goal: form.goal,
        dietType: form.dietType,
        isGlutenFree: form.isGlutenFree,
        dietaryRestrictions: form.dietaryRestrictions,
        // Add the calculated metrics
        bmi,
        bmr,
        tdee,
        calorieNeeds,
        macros
      };
      
      // Update user data in context
      const result = await updateUserProfileData(updatedData);
      
      if (result.success) {
        // Show success message
        setSuccessMessage('Profile updated successfully!');
        // Clear any errors
        setFormErrors({});
        setErrorMessage('');
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        // Show error message
        setErrorMessage(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('An error occurred while updating your profile');
    } finally {
      setIsUpdatingProfile(false);
      window.scrollTo(0, 0);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  // Handle password change form input
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value
    });
    
    // Clear errors when typing
    if (passwordErrors[name]) {
      setPasswordErrors({
        ...passwordErrors,
        [name]: null
      });
    }
  };

  // Validate password form
  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle password change submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;
    
    setIsChangingPassword(true);
    setPasswordMessage({ type: '', text: '' });
    
    try {
      const result = await changeUserPassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      
      if (result.success) {
        setPasswordMessage({
          type: 'success',
          text: 'Password changed successfully!'
        });
        // Reset password form
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setPasswordMessage({
          type: 'error',
          text: result.message || 'Failed to change password'
        });
      }
    } catch (error) {
      setPasswordMessage({
        type: 'error',
        text: 'An error occurred. Please try again.'
      });
      console.error(error);
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Helper function to get food items based on diet type and goal
  const getDietFoodItems = (dietType, goal) => {
    // Default items if no specific diet is selected
    const defaultItems = [
      { name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
      { name: 'Brown Rice (100g)', calories: 112, protein: 2.6, carbs: 24, fat: 0.8, fiber: 1.8 },
      { name: 'Sweet Potato (100g)', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3 },
      { name: 'Salmon (100g)', calories: 206, protein: 22, carbs: 0, fat: 13, fiber: 0 },
      { name: 'Broccoli (100g)', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6 },
      { name: 'Avocado (100g)', calories: 160, protein: 2, carbs: 8.5, fat: 14.7, fiber: 6.7 }
    ];

    // Diet-specific items
    switch (dietType) {
      case 'keto':
        return [
          { name: 'Ribeye Steak (100g)', calories: 291, protein: 24, carbs: 0, fat: 22, fiber: 0 },
          { name: 'Avocado (100g)', calories: 160, protein: 2, carbs: 8.5, fat: 14.7, fiber: 6.7 },
          { name: 'Butter (30g)', calories: 215, protein: 0.2, carbs: 0.1, fat: 24, fiber: 0 },
          { name: 'MCT Oil (15ml)', calories: 130, protein: 0, carbs: 0, fat: 14, fiber: 0 },
          { name: 'Bacon (50g)', calories: 235, protein: 8, carbs: 0.6, fat: 22, fiber: 0 },
          { name: 'Spinach (100g)', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2 }
        ];
      case 'lowCarb':
        return [
          { name: 'Ground Beef 80/20 (100g)', calories: 254, protein: 26, carbs: 0, fat: 17, fiber: 0 },
          { name: 'Bell Peppers (100g)', calories: 31, protein: 1, carbs: 6, fat: 0.3, fiber: 2.1 },
          { name: 'Almonds (30g)', calories: 170, protein: 6, carbs: 6, fat: 15, fiber: 3.5 },
          { name: 'Zucchini (100g)', calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3, fiber: 1 },
          { name: 'Eggs (2 large)', calories: 143, protein: 12.6, carbs: 0.7, fat: 9.5, fiber: 0 },
          { name: 'Greek Yogurt - Full Fat (170g)', calories: 140, protein: 20, carbs: 6, fat: 5, fiber: 0 }
        ];
      case 'paleo':
        return [
          { name: 'Grass-fed Beef (100g)', calories: 217, protein: 26, carbs: 0, fat: 12, fiber: 0 },
          { name: 'Sweet Potato (100g)', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3 },
          { name: 'Walnuts (30g)', calories: 185, protein: 4.3, carbs: 3.9, fat: 18.5, fiber: 1.9 },
          { name: 'Kale (100g)', calories: 49, protein: 4.3, carbs: 8.8, fat: 0.9, fiber: 3.6 },
          { name: 'Blueberries (100g)', calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3, fiber: 2.4 },
          { name: 'Eggs (2 large)', calories: 143, protein: 12.6, carbs: 0.7, fat: 9.5, fiber: 0 }
        ];
      case 'highProtein':
        return [
          { name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
          { name: 'Greek Yogurt (170g)', calories: 100, protein: 17, carbs: 6, fat: 0, fiber: 0 },
          { name: 'Whey Protein (30g)', calories: 120, protein: 24, carbs: 3, fat: 2, fiber: 0 },
          { name: 'Tuna (100g)', calories: 130, protein: 29, carbs: 0, fat: 1, fiber: 0 },
          { name: 'Lentils (100g cooked)', calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 8 },
          { name: 'Cottage Cheese (100g)', calories: 98, protein: 11, carbs: 3.4, fat: 4.3, fiber: 0 }
        ];
      case 'mediterranean':
        return [
          { name: 'Grilled Fish (100g)', calories: 150, protein: 22, carbs: 0, fat: 7, fiber: 0 },
          { name: 'Olive Oil (15ml)', calories: 120, protein: 0, carbs: 0, fat: 14, fiber: 0 },
          { name: 'Whole Grain Bread (30g)', calories: 80, protein: 3, carbs: 15, fat: 1, fiber: 2 },
          { name: 'Chickpeas (100g cooked)', calories: 164, protein: 9, carbs: 27, fat: 2.6, fiber: 8 },
          { name: 'Feta Cheese (30g)', calories: 75, protein: 4, carbs: 1.2, fat: 6, fiber: 0 },
          { name: 'Tomatoes (100g)', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2 }
        ];
      case 'vegetarian':
        return [
          { name: 'Tofu (100g)', calories: 76, protein: 8, carbs: 2, fat: 4.5, fiber: 1 },
          { name: 'Quinoa (100g cooked)', calories: 120, protein: 4.4, carbs: 21, fat: 1.9, fiber: 2.8 },
          { name: 'Greek Yogurt (170g)', calories: 100, protein: 17, carbs: 6, fat: 0, fiber: 0 },
          { name: 'Eggs (2 large)', calories: 143, protein: 12.6, carbs: 0.7, fat: 9.5, fiber: 0 },
          { name: 'Lentils (100g cooked)', calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 8 },
          { name: 'Nuts Mix (30g)', calories: 170, protein: 5, carbs: 7, fat: 14, fiber: 3 }
        ];
      case 'vegan':
        return [
          { name: 'Tofu (100g)', calories: 76, protein: 8, carbs: 2, fat: 4.5, fiber: 1 },
          { name: 'Tempeh (100g)', calories: 193, protein: 19, carbs: 9, fat: 11, fiber: 6 },
          { name: 'Quinoa (100g cooked)', calories: 120, protein: 4.4, carbs: 21, fat: 1.9, fiber: 2.8 },
          { name: 'Lentils (100g cooked)', calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 8 },
          { name: 'Chia Seeds (15g)', calories: 74, protein: 2.5, carbs: 6, fat: 4.7, fiber: 5.5 },
          { name: 'Nutritional Yeast (15g)', calories: 45, protein: 8, carbs: 5, fat: 0.5, fiber: 3 }
        ];
      case 'carnivore':
        return [
          { name: 'Ribeye Steak (100g)', calories: 291, protein: 24, carbs: 0, fat: 22, fiber: 0 },
          { name: 'Beef Liver (100g)', calories: 135, protein: 20.4, carbs: 3.9, fat: 3.6, fiber: 0 },
          { name: 'Salmon (100g)', calories: 206, protein: 22, carbs: 0, fat: 13, fiber: 0 },
          { name: 'Eggs (2 large)', calories: 143, protein: 12.6, carbs: 0.7, fat: 9.5, fiber: 0 },
          { name: 'Bacon (50g)', calories: 235, protein: 8, carbs: 0.6, fat: 22, fiber: 0 },
          { name: 'Bone Marrow (30g)', calories: 213, protein: 4, carbs: 0, fat: 22, fiber: 0 }
        ];
      default:
        // Return different defaults based on goal
        if (goal === 'lose') {
          return [
            { name: 'Turkey Breast (100g)', calories: 157, protein: 24, carbs: 0, fat: 7, fiber: 0 },
            { name: 'Spinach (100g)', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2 },
            { name: 'Quinoa (100g cooked)', calories: 120, protein: 4.4, carbs: 21, fat: 1.9, fiber: 2.8 },
            { name: 'Greek Yogurt (170g)', calories: 100, protein: 17, carbs: 6, fat: 0, fiber: 0 },
            { name: 'Berries (100g)', calories: 57, protein: 0.7, carbs: 14, fat: 0.3, fiber: 2.4 },
            { name: 'Egg Whites (100g)', calories: 52, protein: 10.8, carbs: 0.7, fat: 0.2, fiber: 0 }
          ];
        } else if (goal === 'gain') {
          return [
            { name: 'Lean Beef (100g)', calories: 250, protein: 26, carbs: 0, fat: 15, fiber: 0 },
            { name: 'Whole Milk (250ml)', calories: 150, protein: 8, carbs: 12, fat: 8, fiber: 0 },
            { name: 'Peanut Butter (30g)', calories: 188, protein: 8, carbs: 6, fat: 16, fiber: 2 },
            { name: 'Banana (1 medium)', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1 },
            { name: 'Brown Rice (100g)', calories: 112, protein: 2.6, carbs: 24, fat: 0.8, fiber: 1.8 },
            { name: 'Oats (100g)', calories: 389, protein: 16.9, carbs: 66, fat: 6.9, fiber: 10.6 }
          ];
        } else {
          return defaultItems;
        }
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
        {userData ? 'Update Your Profile' : 'Personal Profile'}
      </Typography>
      
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}
      
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      {/* Nutrition Summary - Enhanced for Print */}
      {userData && (
        <>
          {/* Mobile toggle button - hide in print */}
          {isMobile && (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={toggleMobileSummary}
              sx={{ mb: 2 }}
              className="no-print"
            >
              {showMobileSummary ? 'Hide Nutrition Summary' : 'View Nutrition Summary'}
            </Button>
          )}

          {/* Printable Nutrition Summary */}
          <Box
            sx={{
              mb: 3,
              p: 2,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 1,
              border: `1px solid ${theme.palette.primary.light}`,
              display: isMobile && !showMobileSummary ? 'none' : 'block'
            }}
            className="meal-section nutrition-table"
          >
            <Typography variant="h6" align="center" gutterBottom className="meal-section-header">
              Daily Nutrition Summary
            </Typography>

            {/* Calories - Special Emphasis */}
            <Box className="meal-section" sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="h5" className="meal-section-header">
                Target: {userData.calorieNeeds?.toFixed(0) || 'N/A'} Calories
              </Typography>
            </Box>

            {/* Macronutrient Table with Clear Headers */}
            <Typography variant="subtitle1" className="meal-section-header">
              MACRONUTRIENTS
            </Typography>
            <Grid container spacing={1} className="meal-section">
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography className="meal-item-label">Protein:</Typography>
                  <Typography className="nutrition-value">{userData.macros?.protein?.toFixed(0) || 'N/A'} g</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography className="meal-item-label">Carbs:</Typography>
                  <Typography className="nutrition-value">{userData.macros?.carbs?.toFixed(0) || 'N/A'} g</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography className="meal-item-label">Fats:</Typography>
                  <Typography className="nutrition-value">{userData.macros?.fats?.toFixed(0) || '0'} g</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography className="meal-item-label">Fiber:</Typography>
                  <Typography className="nutrition-value">{userData.macros?.fiber?.toFixed(0) || '0'} g</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
          
          {/* Food Items Table with Headers for Print - Enhanced for visibility */}
          <Box
            sx={{
              mb: 3,
              p: 2,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 1,
              border: `1px solid ${theme.palette.primary.light}`,
              display: { xs: 'none', print: 'block' } // Only show in print view
            }}
            className="meal-section nutrition-table"
          >
            <Typography variant="subtitle1" className="meal-section-header">
              RECOMMENDED FOOD ITEMS
            </Typography>
            <table className="food-table">
              <thead>
                <tr>
                  <th className="food-item-header" style={{ width: '40%' }}>Food Item</th>
                  <th className="food-item-header" style={{ width: '12%' }}>Calories</th>
                  <th className="food-item-header" style={{ width: '12%' }}>P(g)</th>
                  <th className="food-item-header" style={{ width: '12%' }}>C(g)</th>
                  <th className="food-item-header" style={{ width: '12%' }}>F(g)</th>
                  <th className="food-item-header" style={{ width: '12%' }}>Fiber(g)</th>
                </tr>
              </thead>
              <tbody>
                {/* Sample food items based on diet type - you could make this dynamic */}
                {getDietFoodItems(form.dietType, form.goal).map((item, index) => (
                  <tr key={index}>
                    <td className="food-name">{item.name}</td>
                    <td>{item.calories}</td>
                    <td>{item.protein}</td>
                    <td>{item.carbs}</td>
                    <td>{item.fat}</td>
                    <td>{item.fiber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Typography variant="caption" sx={{ display: 'block', mt: 2, fontStyle: 'italic', textAlign: 'center' }}>
              * These food recommendations are based on your selected diet type and goals.
            </Typography>
          </Box>
        </>
      )}

      {/* Form - Hide when printing */}
      <Box component="form" onSubmit={handleSubmit} noValidate className="no-print">
        {/* Personal Information Section */}
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }}>
          Personal Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Name"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleInputChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              required
              fullWidth
              label="Age"
              name="age"
              type="number"
              value={form.age}
              onChange={handleInputChange}
              error={!!formErrors.age}
              helperText={formErrors.age}
              inputProps={{ min: 1, max: 120 }}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Gender</FormLabel>
              <RadioGroup
                row
                name="gender"
                value={form.gender}
                onChange={handleInputChange}
              >
                <FormControlLabel value="male" control={<Radio />} label="Male" />
                <FormControlLabel value="female" control={<Radio />} label="Female" />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>

        {/* Body Metrics Section */}
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 3, fontWeight: 'bold' }}>
          Body Metrics
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <FormControl fullWidth sx={{ mr: 1 }}>
                <InputLabel>Feet</InputLabel>
                <Select
                  value={form.feet}
                  label="Feet"
                  name="feet"
                  onChange={handleInputChange}
                >
                  {Array.from({ length: 8 }, (_, i) => i + 1).map((feet) => (
                    <MenuItem key={feet} value={feet.toString()}>
                      {feet}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Inches</InputLabel>
                <Select
                  value={form.inches}
                  label="Inches"
                  name="inches"
                  onChange={handleInputChange}
                >
                  {Array.from({ length: 12 }, (_, i) => i).map((inch) => (
                    <MenuItem key={inch} value={inch.toString()}>
                      {inch}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Tooltip title="Enter your height">
                <IconButton sx={{ ml: 1 }}>
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Weight (kg)"
              name="weight"
              type="number"
              value={form.weight}
              onChange={handleInputChange}
              error={!!formErrors.weight}
              helperText={formErrors.weight}
              inputProps={{ min: 20, max: 500 }}
            />
          </Grid>
        </Grid>

        {/* Fitness Goals Section */}
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 3, fontWeight: 'bold' }}>
          Fitness Goals
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Activity Level</InputLabel>
              <Select
                value={form.activityLevel}
                label="Activity Level"
                name="activityLevel"
                onChange={handleInputChange}
              >
                <MenuItem value="sedentary">Sedentary (office job)</MenuItem>
                <MenuItem value="light">Light Activity (1-2 days/week)</MenuItem>
                <MenuItem value="moderate">Moderate Activity (3-5 days/week)</MenuItem>
                <MenuItem value="active">Very Active (6-7 days/week)</MenuItem>
                <MenuItem value="extreme">Extremely Active (athlete)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Goal</InputLabel>
              <Select
                value={form.goal}
                label="Goal"
                name="goal"
                onChange={handleInputChange}
              >
                <MenuItem value="lose">Lose Weight</MenuItem>
                <MenuItem value="maintain">Maintain Weight</MenuItem>
                <MenuItem value="gain">Gain Muscle</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Diet Preferences Section */}
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 3, fontWeight: 'bold' }}>
          Diet Preferences
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth error={!!formErrors.dietType}>
              <InputLabel>Diet Type</InputLabel>
              <Select
                value={form.dietType}
                label="Diet Type"
                name="dietType"
                onChange={handleInputChange}
              >
                <MenuItem value="standard">Standard Balanced</MenuItem>
                <MenuItem value="keto">Ketogenic</MenuItem>
                <MenuItem value="lowCarb">Low Carb</MenuItem>
                <MenuItem value="highProtein">High Protein</MenuItem>
                <MenuItem value="paleo">Paleo</MenuItem>
                <MenuItem value="mediterranean">Mediterranean</MenuItem>
                <MenuItem value="vegetarian">Vegetarian</MenuItem>
                <MenuItem value="vegan">Vegan</MenuItem>
              </Select>
              {formErrors.dietType && (
                <Typography variant="caption" color="error">
                  {formErrors.dietType}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <RadioGroup
                  name="isGlutenFree"
                  value={form.isGlutenFree ? "true" : "false"}
                  onChange={(e) => setForm({ ...form, isGlutenFree: e.target.value === "true" })}
                  row
                >
                  <FormControlLabel
                    value="true"
                    control={<Radio />}
                    label="Gluten-Free"
                  />
                  <FormControlLabel
                    value="false"
                    control={<Radio />}
                    label="Regular (Contains Gluten)"
                  />
                </RadioGroup>
              }
              label=""
            />
          </Grid>
        </Grid>

        {/* Submit Button */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{ minWidth: 200 }}
            disabled={isUpdatingProfile}
          >
            {isUpdatingProfile ? "Updating..." : (userData ? 'Update Profile' : 'Save Profile')}
          </Button>
        </Box>
      </Box>

      {/* Password Change Section - Only for authenticated users */}
      {isAuthenticated && (
        <Box sx={{ mt: 4 }}>
          <Divider sx={{ my: 3 }} />
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="password-change-content"
              id="password-change-header"
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Change Password
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {passwordMessage.text && (
                <Alert 
                  severity={passwordMessage.type} 
                  sx={{ mb: 2 }}
                  onClose={() => setPasswordMessage({ type: '', text: '' })}
                >
                  {passwordMessage.text}
                </Alert>
              )}
              <Box component="form" onSubmit={handlePasswordSubmit} noValidate>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Current Password"
                      name="currentPassword"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      error={!!passwordErrors.currentPassword}
                      helperText={passwordErrors.currentPassword}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="New Password"
                      name="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      error={!!passwordErrors.newPassword}
                      helperText={passwordErrors.newPassword}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      name="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      error={!!passwordErrors.confirmPassword}
                      helperText={passwordErrors.confirmPassword}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isChangingPassword}
                      sx={{ mt: 1 }}
                    >
                      {isChangingPassword ? 'Changing Password...' : 'Change Password'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
    </Paper>
  );
};

export default ProfileForm;