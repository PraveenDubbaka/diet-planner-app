import React, { useState, useEffect, useContext, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
  useTheme,
  useMediaQuery,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Menu,
  MenuItem,
  Autocomplete,
  CircularProgress,
  Snackbar,
  Alert,
  Fade
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import FoodItem from './FoodItem';
import { getAllFoodNames, getFoodDetails, calculateNutrition } from '../data/foodDatabase';
import { UserContext } from '../contexts/UserContext';
import { createFilterOptions } from '@mui/material/Autocomplete';

// Sample meal plan data structure based on goals
const mealPlans = {
  lose: {
    breakfast: [
      { name: 'Greek Yogurt', quantity: '200g', calories: 130, protein: 22, carbs: 6, fats: 0, fiber: 0 },
      { name: 'Berries', quantity: '100g', calories: 50, protein: 1, carbs: 12, fats: 0, fiber: 2.4 },
      { name: 'Almonds', quantity: '15g', calories: 90, protein: 3, carbs: 3, fats: 8, fiber: 1.9 },
    ],
    morningSnack: [
      { name: 'Apple', quantity: '1 medium', calories: 95, protein: 0, carbs: 25, fats: 0, fiber: 4.4 },
      { name: 'Protein Shake', quantity: '1 scoop', calories: 120, protein: 24, carbs: 3, fats: 1, fiber: 0.1 },
    ],
    lunch: [
      { name: 'Grilled Chicken Breast', quantity: '120g', calories: 195, protein: 37, carbs: 0, fats: 4, fiber: 0 },
      { name: 'Quinoa', quantity: '50g cooked', calories: 115, protein: 4, carbs: 20, fats: 2, fiber: 1.4 },
      { name: 'Mixed Vegetables', quantity: '150g', calories: 60, protein: 3, carbs: 12, fats: 0, fiber: 4.5 },
    ],
    postWorkout: [
      { name: 'Protein Smoothie', quantity: '300ml', calories: 200, protein: 25, carbs: 15, fats: 3, fiber: 0.9 },
      { name: 'Banana', quantity: '1 medium', calories: 105, protein: 1, carbs: 27, fats: 0, fiber: 3.1 },
    ],
    eveningSnack: [
      { name: 'Cottage Cheese', quantity: '100g', calories: 98, protein: 11, carbs: 3, fats: 4, fiber: 0 },
      { name: 'Cucumber Slices', quantity: '100g', calories: 16, protein: 1, carbs: 4, fats: 0, fiber: 0.5 },
    ],
    dinner: [
      { name: 'Baked Salmon', quantity: '120g', calories: 206, protein: 30, carbs: 0, fats: 10, fiber: 0 },
      { name: 'Brown Rice', quantity: '50g cooked', calories: 108, protein: 3, carbs: 22, fats: 1, fiber: 0.9 },
      { name: 'Steamed Broccoli', quantity: '150g', calories: 51, protein: 4, carbs: 10, fats: 0, fiber: 5.0 },
    ]
  },
  maintain: {
    breakfast: [
      { name: 'Oatmeal', quantity: '60g dry', calories: 234, protein: 8, carbs: 40, fats: 4, fiber: 6.4 },
      { name: 'Banana', quantity: '1 medium', calories: 105, protein: 1, carbs: 27, fats: 0, fiber: 3.1 },
      { name: 'Peanut Butter', quantity: '20g', calories: 120, protein: 5, carbs: 3, fats: 10, fiber: 1.2 },
    ],
    morningSnack: [
      { name: 'Mixed Nuts', quantity: '30g', calories: 170, protein: 6, carbs: 5, fats: 15, fiber: 2.5 },
      { name: 'Orange', quantity: '1 medium', calories: 62, protein: 1, carbs: 15, fats: 0, fiber: 3.1 },
    ],
    lunch: [
      { name: 'Turkey Sandwich', quantity: '1 sandwich', calories: 350, protein: 25, carbs: 35, fats: 10, fiber: 3.0 },
      { name: 'Mixed Salad', quantity: '100g', calories: 25, protein: 2, carbs: 5, fats: 0, fiber: 2.0 },
      { name: 'Olive Oil Dressing', quantity: '10g', calories: 90, protein: 0, carbs: 0, fats: 10, fiber: 0 },
    ],
    postWorkout: [
      { name: 'Whey Protein Shake', quantity: '1 scoop', calories: 120, protein: 24, carbs: 3, fats: 1, fiber: 0.1 },
      { name: 'Whole Grain Crackers', quantity: '30g', calories: 120, protein: 3, carbs: 20, fats: 3, fiber: 2.0 },
      { name: 'Peanut Butter', quantity: '15g', calories: 90, protein: 4, carbs: 2, fats: 7, fiber: 0.9 },
    ],
    eveningSnack: [
      { name: 'Greek Yogurt', quantity: '150g', calories: 100, protein: 17, carbs: 5, fats: 0, fiber: 0 },
      { name: 'Honey', quantity: '10g', calories: 30, protein: 0, carbs: 8, fats: 0, fiber: 0 },
    ],
    dinner: [
      { name: 'Grilled Steak', quantity: '120g', calories: 250, protein: 35, carbs: 0, fats: 12, fiber: 0 },
      { name: 'Sweet Potato', quantity: '150g', calories: 150, protein: 2, carbs: 35, fats: 0, fiber: 4.5 },
      { name: 'Roasted Vegetables', quantity: '150g', calories: 90, protein: 4, carbs: 20, fats: 0, fiber: 4.5 },
    ]
  },
  gain: {
    breakfast: [
      { name: 'Scrambled Eggs', quantity: '3 large', calories: 215, protein: 18, carbs: 2, fats: 15, fiber: 0 },
      { name: 'Whole Grain Toast', quantity: '2 slices', calories: 160, protein: 8, carbs: 30, fats: 2, fiber: 4.0 },
      { name: 'Avocado', quantity: '1/2 medium', calories: 120, protein: 1, carbs: 6, fats: 10, fiber: 4.6 },
    ],
    morningSnack: [
      { name: 'Protein Shake with Milk', quantity: '300ml', calories: 300, protein: 30, carbs: 20, fats: 10, fiber: 0.9 },
      { name: 'Banana', quantity: '1 large', calories: 120, protein: 1, carbs: 30, fats: 0, fiber: 3.5 },
    ],
    lunch: [
      { name: 'Grilled Chicken Pasta', quantity: '1 serving', calories: 450, protein: 35, carbs: 50, fats: 10, fiber: 4.5 },
      { name: 'Garlic Bread', quantity: '2 slices', calories: 150, protein: 3, carbs: 20, fats: 7, fiber: 1.6 },
      { name: 'Mixed Salad', quantity: '100g', calories: 25, protein: 2, carbs: 5, fats: 0, fiber: 2.0 },
    ],
    postWorkout: [
      { name: 'Mass Gainer Shake', quantity: '1 serving', calories: 500, protein: 40, carbs: 60, fats: 10, fiber: 2.4 },
      { name: 'Peanut Butter and Jelly Sandwich', quantity: '1 sandwich', calories: 350, protein: 12, carbs: 45, fats: 16, fiber: 3.5 },
    ],
    eveningSnack: [
      { name: 'Trail Mix', quantity: '50g', calories: 250, protein: 8, carbs: 15, fats: 18, fiber: 3.8 },
      { name: 'Greek Yogurt', quantity: '200g', calories: 130, protein: 22, carbs: 6, fats: 0, fiber: 0 },
    ],
    dinner: [
      { name: 'Salmon Fillet', quantity: '150g', calories: 280, protein: 35, carbs: 0, fats: 15, fiber: 0 },
      { name: 'Rice Pilaf', quantity: '100g cooked', calories: 200, protein: 5, carbs: 40, fats: 3, fiber: 0.8 },
      { name: 'Steamed Vegetables', quantity: '150g', calories: 60, protein: 3, carbs: 12, fats: 0, fiber: 4.5 },
      { name: 'Olive Oil', quantity: '15ml', calories: 120, protein: 0, carbs: 0, fats: 14, fiber: 0 },
    ]
  }
};

// Diet-type specific meal plans for more accurate nutrition recommendations
const dietTypeMealPlans = {
  keto: {
    breakfast: [
      { name: 'Eggs', quantity: '2 large', calories: 143, protein: 12.6, carbs: 0.7, fats: 9.5, fiber: 0 },
      { name: 'Bacon', quantity: '2 slices (30g)', calories: 125, protein: 11.1, carbs: 0.4, fats: 9.6, fiber: 0 },
      { name: 'Avocado', quantity: '1/2 medium (68g)', calories: 109, protein: 1.4, carbs: 5.8, fats: 10, fiber: 4.6 },
    ],
    morningSnack: [
      { name: 'Macadamia Nuts', quantity: '1 oz (28g)', calories: 204, protein: 2.2, carbs: 3.9, fats: 21.5, fiber: 2.4 },
      { name: 'Cheese', quantity: '1 oz (28g)', calories: 113, protein: 7, carbs: 0.4, fats: 9.2, fiber: 0 },
    ],
    lunch: [
      { name: 'Ribeye Steak', quantity: '100g', calories: 291, protein: 24, carbs: 0, fats: 22, fiber: 0 },
      { name: 'Spinach', quantity: '100g', calories: 23, protein: 2.9, carbs: 3.6, fats: 0.4, fiber: 2.2 },
      { name: 'Olive Oil', quantity: '1 tbsp (15ml)', calories: 120, protein: 0, carbs: 0, fats: 14, fiber: 0 },
    ],
    postWorkout: [
      { name: 'Whey Protein Powder', quantity: '1 scoop (30g)', calories: 113, protein: 24, carbs: 2.1, fats: 0.9, fiber: 0.1 },
      { name: 'Coconut Oil', quantity: '1 tbsp (14g)', calories: 125, protein: 0, carbs: 0, fats: 13.9, fiber: 0 },
    ],
    eveningSnack: [
      { name: 'Almonds', quantity: '1 oz (28g)', calories: 162, protein: 5.9, carbs: 6.1, fats: 14, fiber: 3.5 },
      { name: 'Cucumber Slices', quantity: '100g', calories: 15, protein: 0.7, carbs: 3.6, fats: 0.1, fiber: 0.5 },
    ],
    dinner: [
      { name: 'Salmon', quantity: '150g', calories: 309, protein: 33, carbs: 0, fats: 19.5, fiber: 0 },
      { name: 'Broccoli', quantity: '100g', calories: 34, protein: 2.8, carbs: 6.6, fats: 0.4, fiber: 2.6 },
      { name: 'Butter', quantity: '1 tbsp (14g)', calories: 100, protein: 0.1, carbs: 0, fats: 11.4, fiber: 0 },
    ]
  },
  
  lowCarb: {
    breakfast: [
      { name: 'Eggs', quantity: '2 large', calories: 143, protein: 12.6, carbs: 0.7, fats: 9.5, fiber: 0 },
      { name: 'Avocado', quantity: '1/4 medium (34g)', calories: 54, protein: 0.7, carbs: 2.9, fats: 5, fiber: 2.3 },
      { name: 'Tomato', quantity: '1 medium (123g)', calories: 22, protein: 1.1, carbs: 4.8, fats: 0.2, fiber: 1.5 },
    ],
    morningSnack: [
      { name: 'Greek Yogurt', quantity: '150g', calories: 89, protein: 15, carbs: 5.4, fats: 0.6, fiber: 0 },
      { name: 'Berries', quantity: '50g', calories: 29, protein: 0.4, carbs: 7.1, fats: 0.2, fiber: 1.2 },
    ],
    lunch: [
      { name: 'Chicken Breast', quantity: '120g', calories: 198, protein: 37.2, carbs: 0.4, fats: 4.3, fiber: 0 },
      { name: 'Mixed Vegetables', quantity: '150g', calories: 60, protein: 3, carbs: 12, fats: 0.6, fiber: 4.5 },
      { name: 'Olive Oil', quantity: '1 tbsp (15ml)', calories: 120, protein: 0, carbs: 0, fats: 14, fiber: 0 },
    ],
    postWorkout: [
      { name: 'Whey Protein Powder', quantity: '1 scoop (30g)', calories: 113, protein: 24, carbs: 2.1, fats: 0.9, fiber: 0.1 },
      { name: 'Almonds', quantity: '15g', calories: 87, protein: 3.2, carbs: 3.2, fats: 7.5, fiber: 1.9 },
    ],
    eveningSnack: [
      { name: 'Cottage Cheese', quantity: '100g', calories: 98, protein: 11, carbs: 3.4, fats: 4.3, fiber: 0 },
      { name: 'Bell Pepper', quantity: '1 medium (119g)', calories: 37, protein: 1.2, carbs: 7.1, fats: 0.4, fiber: 2.5 },
    ],
    dinner: [
      { name: 'Grilled Steak', quantity: '120g', calories: 300, protein: 31.2, carbs: 0, fats: 20.4, fiber: 0 },
      { name: 'Broccoli', quantity: '100g', calories: 34, protein: 2.8, carbs: 6.6, fats: 0.4, fiber: 2.6 },
      { name: 'Butter', quantity: '1 tsp (5g)', calories: 36, protein: 0, carbs: 0, fats: 4.1, fiber: 0 },
    ]
  },
  
  highProtein: {
    breakfast: [
      { name: 'Greek Yogurt', quantity: '200g', calories: 118, protein: 20, carbs: 7.2, fats: 0.8, fiber: 0 },
      { name: 'Whey Protein Powder', quantity: '1/2 scoop (15g)', calories: 56, protein: 12, carbs: 1.1, fats: 0.5, fiber: 0.1 },
      { name: 'Berries', quantity: '100g', calories: 57, protein: 0.7, carbs: 14.1, fats: 0.3, fiber: 2.4 },
    ],
    morningSnack: [
      { name: 'Chicken Breast', quantity: '50g', calories: 83, protein: 15.5, carbs: 0.2, fats: 1.8, fiber: 0 },
      { name: 'Almonds', quantity: '10g', calories: 58, protein: 2.1, carbs: 2.2, fats: 5, fiber: 1.3 },
    ],
    lunch: [
      { name: 'Tuna', quantity: '120g', calories: 156, protein: 34.8, carbs: 0.4, fats: 1.2, fiber: 0 },
      { name: 'Brown Rice', quantity: '50g cooked', calories: 56, protein: 1.3, carbs: 11.5, fats: 0.5, fiber: 0.9 },
      { name: 'Mixed Vegetables', quantity: '150g', calories: 60, protein: 3, carbs: 12, fats: 0.6, fiber: 4.5 },
    ],
    postWorkout: [
      { name: 'Whey Protein Powder', quantity: '1 scoop (30g)', calories: 113, protein: 24, carbs: 2.1, fats: 0.9, fiber: 0.1 },
      { name: 'Banana', quantity: '1 medium (118g)', calories: 105, protein: 1.3, carbs: 27, fats: 0.4, fiber: 3.1 },
    ],
    eveningSnack: [
      { name: 'Cottage Cheese', quantity: '100g', calories: 98, protein: 11, carbs: 3.4, fats: 4.3, fiber: 0 },
      { name: 'Egg', quantity: '1 large (50g)', calories: 72, protein: 6.3, carbs: 0.6, fats: 5.3, fiber: 0 },
    ],
    dinner: [
      { name: 'Salmon', quantity: '150g', calories: 309, protein: 33, carbs: 0, fats: 19.5, fiber: 0 },
      { name: 'Sweet Potato', quantity: '100g', calories: 86, protein: 1.6, carbs: 20.1, fats: 0.1, fiber: 3 },
      { name: 'Broccoli', quantity: '100g', calories: 34, protein: 2.8, carbs: 6.6, fats: 0.4, fiber: 2.6 },
    ]
  },
  
  paleo: {
    breakfast: [
      { name: 'Eggs', quantity: '2 large', calories: 143, protein: 12.6, carbs: 0.7, fats: 9.5, fiber: 0 },
      { name: 'Bacon', quantity: '2 slices (30g)', calories: 125, protein: 11.1, carbs: 0.4, fats: 9.6, fiber: 0 },
      { name: 'Berries', quantity: '100g', calories: 57, protein: 0.7, carbs: 14.1, fats: 0.3, fiber: 2.4 },
    ],
    morningSnack: [
      { name: 'Walnuts', quantity: '30g', calories: 196, protein: 4.6, carbs: 4.1, fats: 19.6, fiber: 2 },
      { name: 'Apple', quantity: '1 medium (182g)', calories: 95, protein: 0.5, carbs: 25.1, fats: 0.4, fiber: 4.4 },
    ],
    lunch: [
      { name: 'Grilled Chicken Breast', quantity: '120g', calories: 198, protein: 37.2, carbs: 0.4, fats: 4.3, fiber: 0 },
      { name: 'Avocado', quantity: '1/2 medium (68g)', calories: 109, protein: 1.4, carbs: 5.8, fats: 10, fiber: 4.6 },
      { name: 'Mixed Vegetables', quantity: '150g', calories: 60, protein: 3, carbs: 12, fats: 0.6, fiber: 4.5 },
    ],
    postWorkout: [
      { name: 'Banana', quantity: '1 medium (118g)', calories: 105, protein: 1.3, carbs: 27, fats: 0.4, fiber: 3.1 },
      { name: 'Almonds', quantity: '15g', calories: 87, protein: 3.2, carbs: 3.2, fats: 7.5, fiber: 1.9 },
    ],
    eveningSnack: [
      { name: 'Hard-boiled Egg', quantity: '1 large (50g)', calories: 72, protein: 6.3, carbs: 0.6, fats: 5.3, fiber: 0 },
      { name: 'Carrots', quantity: '2 medium (122g)', calories: 50, protein: 1.1, carbs: 11.7, fats: 0.3, fiber: 3.4 },
    ],
    dinner: [
      { name: 'Salmon', quantity: '150g', calories: 309, protein: 33, carbs: 0, fats: 19.5, fiber: 0 },
      { name: 'Sweet Potato', quantity: '100g', calories: 86, protein: 1.6, carbs: 20.1, fats: 0.1, fiber: 3 },
      { name: 'Kale', quantity: '50g', calories: 25, protein: 2.2, carbs: 4.4, fats: 0.5, fiber: 1.8 },
    ]
  },
  
  mediterranean: {
    breakfast: [
      { name: 'Greek Yogurt', quantity: '150g', calories: 89, protein: 15, carbs: 5.4, fats: 0.6, fiber: 0 },
      { name: 'Honey', quantity: '1 tsp (7g)', calories: 21, protein: 0, carbs: 5.8, fats: 0, fiber: 0 },
      { name: 'Walnuts', quantity: '15g', calories: 98, protein: 2.3, carbs: 2.1, fats: 9.8, fiber: 1 },
    ],
    morningSnack: [
      { name: 'Orange', quantity: '1 medium (131g)', calories: 62, protein: 1.2, carbs: 15.5, fats: 0.1, fiber: 3.1 },
      { name: 'Almonds', quantity: '15g', calories: 87, protein: 3.2, carbs: 3.2, fats: 7.5, fiber: 1.9 },
    ],
    lunch: [
      { name: 'Grilled Fish', quantity: '120g', calories: 180, protein: 26.4, carbs: 0, fats: 8.4, fiber: 0 },
      { name: 'Couscous', quantity: '50g cooked', calories: 56, protein: 1.9, carbs: 11.6, fats: 0.1, fiber: 0.7 },
      { name: 'Olive Oil', quantity: '1 tbsp (15ml)', calories: 120, protein: 0, carbs: 0, fats: 14, fiber: 0 },
      { name: 'Tomato', quantity: '1 medium (123g)', calories: 22, protein: 1.1, carbs: 4.8, fats: 0.2, fiber: 1.5 },
    ],
    postWorkout: [
      { name: 'Hummus', quantity: '50g', calories: 83, protein: 4, carbs: 7.2, fats: 4.8, fiber: 3 },
      { name: 'Whole Wheat Bread', quantity: '1 slice (30g)', calories: 74, protein: 3.9, carbs: 12.3, fats: 1, fiber: 2 },
    ],
    eveningSnack: [
      { name: 'Feta Cheese', quantity: '30g', calories: 79, protein: 4.3, carbs: 1.2, fats: 6.4, fiber: 0 },
      { name: 'Cucumber Slices', quantity: '100g', calories: 15, protein: 0.7, carbs: 3.6, fats: 0.1, fiber: 0.5 },
    ],
    dinner: [
      { name: 'Chicken Breast', quantity: '100g', calories: 165, protein: 31, carbs: 0.3, fats: 3.6, fiber: 0 },
      { name: 'Quinoa', quantity: '50g cooked', calories: 60, protein: 2.2, carbs: 10.7, fats: 1, fiber: 1.4 },
      { name: 'Mixed Vegetables', quantity: '150g', calories: 60, protein: 3, carbs: 12, fats: 0.6, fiber: 4.5 },
      { name: 'Olive Oil', quantity: '1 tbsp (15ml)', calories: 120, protein: 0, carbs: 0, fats: 14, fiber: 0 },
    ]
  },
  
  vegetarian: {
    breakfast: [
      { name: 'Greek Yogurt', quantity: '150g', calories: 89, protein: 15, carbs: 5.4, fats: 0.6, fiber: 0 },
      { name: 'Oatmeal', quantity: '40g dry', calories: 156, protein: 6.8, carbs: 26.5, fats: 2.8, fiber: 4.2 },
      { name: 'Berries', quantity: '100g', calories: 57, protein: 0.7, carbs: 14.1, fats: 0.3, fiber: 2.4 },
    ],
    morningSnack: [
      { name: 'Almonds', quantity: '30g', calories: 174, protein: 6.3, carbs: 6.5, fats: 15, fiber: 3.8 },
      { name: 'Apple', quantity: '1 medium (182g)', calories: 95, protein: 0.5, carbs: 25.1, fats: 0.4, fiber: 4.4 },
    ],
    lunch: [
      { name: 'Lentils', quantity: '100g cooked', calories: 116, protein: 9, carbs: 20, fats: 0.4, fiber: 8 },
      { name: 'Brown Rice', quantity: '50g cooked', calories: 56, protein: 1.3, carbs: 11.5, fats: 0.5, fiber: 0.9 },
      { name: 'Mixed Vegetables', quantity: '150g', calories: 60, protein: 3, carbs: 12, fats: 0.6, fiber: 4.5 },
      { name: 'Olive Oil', quantity: '1 tbsp (15ml)', calories: 120, protein: 0, carbs: 0, fats: 14, fiber: 0 },
    ],
    postWorkout: [
      { name: 'Whey Protein Powder', quantity: '1 scoop (30g)', calories: 113, protein: 24, carbs: 2.1, fats: 0.9, fiber: 0.1 },
      { name: 'Banana', quantity: '1 medium (118g)', calories: 105, protein: 1.3, carbs: 27, fats: 0.4, fiber: 3.1 },
    ],
    eveningSnack: [
      { name: 'Cottage Cheese', quantity: '100g', calories: 98, protein: 11, carbs: 3.4, fats: 4.3, fiber: 0 },
      { name: 'Cucumber Slices', quantity: '100g', calories: 15, protein: 0.7, carbs: 3.6, fats: 0.1, fiber: 0.5 },
    ],
    dinner: [
      { name: 'Tofu', quantity: '150g', calories: 114, protein: 12, carbs: 2.9, fats: 7.2, fiber: 1.8 },
      { name: 'Quinoa', quantity: '50g cooked', calories: 60, protein: 2.2, carbs: 10.7, fats: 1, fiber: 1.4 },
      { name: 'Spinach', quantity: '100g', calories: 23, protein: 2.9, carbs: 3.6, fats: 0.4, fiber: 2.2 },
      { name: 'Olive Oil', quantity: '1 tbsp (15ml)', calories: 120, protein: 0, carbs: 0, fats: 14, fiber: 0 },
    ]
  },
  
  vegan: {
    breakfast: [
      { name: 'Tofu', quantity: '100g', calories: 76, protein: 8, carbs: 1.9, fats: 4.8, fiber: 1.2 },
      { name: 'Oatmeal', quantity: '40g dry', calories: 156, protein: 6.8, carbs: 26.5, fats: 2.8, fiber: 4.2 },
      { name: 'Berries', quantity: '100g', calories: 57, protein: 0.7, carbs: 14.1, fats: 0.3, fiber: 2.4 },
    ],
    morningSnack: [
      { name: 'Almonds', quantity: '30g', calories: 174, protein: 6.3, carbs: 6.5, fats: 15, fiber: 3.8 },
      { name: 'Apple', quantity: '1 medium (182g)', calories: 95, protein: 0.5, carbs: 25.1, fats: 0.4, fiber: 4.4 },
    ],
    lunch: [
      { name: 'Lentils', quantity: '100g cooked', calories: 116, protein: 9, carbs: 20, fats: 0.4, fiber: 8 },
      { name: 'Brown Rice', quantity: '50g cooked', calories: 56, protein: 1.3, carbs: 11.5, fats: 0.5, fiber: 0.9 },
      { name: 'Mixed Vegetables', quantity: '150g', calories: 60, protein: 3, carbs: 12, fats: 0.6, fiber: 4.5 },
      { name: 'Olive Oil', quantity: '1 tbsp (15ml)', calories: 120, protein: 0, carbs: 0, fats: 14, fiber: 0 },
    ],
    postWorkout: [
      { name: 'Chickpeas', quantity: '100g cooked', calories: 164, protein: 8.9, carbs: 27.4, fats: 2.6, fiber: 7.6 },
      { name: 'Banana', quantity: '1 medium (118g)', calories: 105, protein: 1.3, carbs: 27, fats: 0.4, fiber: 3.1 },
    ],
    eveningSnack: [
      { name: 'Hummus', quantity: '50g', calories: 83, protein: 4, carbs: 7.2, fats: 4.8, fiber: 3 },
      { name: 'Bell Pepper', quantity: '1 medium (119g)', calories: 37, protein: 1.2, carbs: 7.1, fats: 0.4, fiber: 2.5 },
    ],
    dinner: [
      { name: 'Tempeh', quantity: '100g', calories: 193, protein: 19, carbs: 9, fats: 11, fiber: 6 },
      { name: 'Quinoa', quantity: '50g cooked', calories: 60, protein: 2.2, carbs: 10.7, fats: 1, fiber: 1.4 },
      { name: 'Broccoli', quantity: '100g', calories: 34, protein: 2.8, carbs: 6.6, fats: 0.4, fiber: 2.6 },
      { name: 'Avocado', quantity: '1/4 medium (34g)', calories: 54, protein: 0.7, carbs: 2.9, fats: 5, fiber: 2.3 },
    ]
  },
  
  standard: mealPlans.maintain
};

// List of common gluten-containing foods and ingredients to filter out
const glutenContainingFoods = [
  "wheat", "barley", "rye", "triticale", "malt", "brewer's yeast", "wheat starch",
  "bread", "pasta", "noodles", "couscous", "crackers", "cereal", "biscuits", "cookies",
  "cake", "pastry", "beer", "ale", "flour tortilla", "breadcrumbs", "seitan",
  "flour", "whole wheat", "bulgar", "farro", "kamut", "spelt", "semolina", "graham",
  "wheat bread", "wheat pasta", "wheat tortilla", "wheat crackers", "wheat buns",
  "oats", "granola", "muesli", "bread crumbs", "croutons", "dumplings", "pie crust"
];

// Add diet-specific recommendations and guidelines
const dietTypeRecommendations = {
  standard: {
    description: "A balanced diet with moderate carbs, proteins, and fats to support your health and fitness goals.",
    guidelines: [
      "Aim for 45-65% of calories from carbs, 15-25% from protein, and 20-35% from fats",
      "Focus on whole grains, lean proteins, fruits, vegetables, and healthy fats",
      "Limit added sugars, saturated fats, and highly processed foods",
      "Stay hydrated with water throughout the day"
    ],
    foodRecommendations: [
      "Whole Grains: Brown rice, quinoa, whole wheat bread, oats",
      "Proteins: Chicken, fish, lean beef, tofu, beans, lentils",
      "Healthy Fats: Avocados, nuts, olive oil, fatty fish",
      "Vegetables: Leafy greens, broccoli, bell peppers, carrots",
      "Fruits: Berries, apples, oranges, bananas"
    ]
  },
  keto: {
    description: "A high-fat, very low-carb diet that shifts your body into ketosis, burning fat for fuel instead of carbs.",
    guidelines: [
      "Limit carbs to 20-50g per day (5-10% of calories)",
      "Consume 70-80% of calories from fat",
      "Moderate protein intake (15-20% of calories)",
      "Avoid grains, sugar, most fruits, and starchy vegetables"
    ],
    foodRecommendations: [
      "Fats: Avocados, olive oil, coconut oil, butter, ghee",
      "Proteins: Eggs, fatty fish, beef, chicken (with skin), full-fat dairy",
      "Low-Carb Vegetables: Spinach, kale, broccoli, cauliflower",
      "Nuts & Seeds: Almonds, walnuts, flaxseeds, chia seeds",
      "Berries: Small amounts of raspberries, blackberries (in moderation)"
    ]
  },
  lowCarb: {
    description: "A diet with reduced carbohydrate intake, typically below 100g per day, to support fat loss and metabolic health.",
    guidelines: [
      "Limit carbs to 50-100g per day (15-30% of calories)",
      "Increase protein and fat intake to compensate",
      "Focus on whole, unprocessed foods",
      "Avoid refined carbs, sugars, and processed foods"
    ],
    foodRecommendations: [
      "Proteins: Eggs, meat, poultry, fish, tofu",
      "Non-Starchy Vegetables: Leafy greens, broccoli, cauliflower, zucchini",
      "Healthy Fats: Avocados, olive oil, nuts, seeds",
      "Dairy: Greek yogurt, cheese, cottage cheese",
      "Low-Sugar Fruits: Berries, apples, pears (in moderation)"
    ]
  },
  paleo: {
    description: "Based on foods similar to what early humans ate, focusing on whole foods and excluding grains, dairy, and processed items.",
    guidelines: [
      "Eat whole, unprocessed foods like meat, fish, eggs, vegetables, fruits, nuts, and seeds",
      "Avoid grains, legumes, dairy, refined sugar, and processed foods",
      "Focus on grass-fed, organic, and wild-caught options when possible",
      "Emphasize nutrient density in food choices"
    ],
    foodRecommendations: [
      "Proteins: Grass-fed meat, wild-caught fish, free-range eggs",
      "Vegetables: All vegetables, especially leafy greens",
      "Fruits: All fruits, preferably low-sugar varieties",
      "Nuts & Seeds: Almonds, walnuts, pumpkin seeds, sunflower seeds",
      "Healthy Fats: Avocados, olive oil, coconut oil, ghee"
    ]
  },
  mediterranean: {
    description: "Inspired by traditional foods of regions around the Mediterranean Sea, rich in healthy fats, fish, and vegetables.",
    guidelines: [
      "Emphasize plant-based foods, whole grains, and healthy fats",
      "Include fish and seafood at least twice a week",
      "Limit red meat consumption to a few times per month",
      "Use olive oil as the primary source of added fat",
      "Enjoy moderate consumption of dairy, eggs, and wine (optional)"
    ],
    foodRecommendations: [
      "Healthy Fats: Olive oil, olives, nuts, seeds",
      "Vegetables: Tomatoes, spinach, eggplant, zucchini, peppers",
      "Fruits: Grapes, figs, citrus fruits, berries",
      "Whole Grains: Whole grain bread, pasta, bulgur, couscous",
      "Proteins: Fish, seafood, poultry, beans, lentils, yogurt"
    ]
  },
  vegetarian: {
    description: "A plant-based diet that excludes meat but may include dairy and eggs, providing nutrients through diverse plant sources.",
    guidelines: [
      "Get protein from eggs, dairy, legumes, tofu, tempeh, and seitan",
      "Include a variety of fruits, vegetables, whole grains, nuts, and seeds",
      "Pay attention to vitamin B12, iron, zinc, calcium, and omega-3 intake",
      "Consider supplements for nutrients commonly found in animal products"
    ],
    foodRecommendations: [
      "Proteins: Eggs, dairy, beans, lentils, chickpeas, tofu, tempeh",
      "Grains: Brown rice, quinoa, oats, barley, whole grain bread",
      "Healthy Fats: Avocados, olive oil, nuts, seeds",
      "Vegetables: Dark leafy greens, broccoli, carrots, bell peppers",
      "Calcium Sources: Dairy, fortified plant milks, tofu, leafy greens"
    ]
  },
  highProtein: {
    description: "A diet that emphasizes protein intake for muscle growth, recovery, and satiety, particularly beneficial for strength training.",
    guidelines: [
      "Consume 1.6-2.2g of protein per kg of body weight",
      "Distribute protein intake evenly throughout the day",
      "Include a mix of animal and plant proteins",
      "Balance with adequate carbohydrates for energy and fats for hormonal health"
    ],
    foodRecommendations: [
      "Animal Proteins: Chicken, turkey, beef, fish, eggs, dairy",
      "Plant Proteins: Lentils, beans, tofu, tempeh, seitan",
      "Protein Supplements: Whey, casein, or plant-based protein powders",
      "Complex Carbs: Sweet potatoes, brown rice, quinoa, oats",
      "Healthy Fats: Olive oil, nuts, seeds, avocados"
    ]
  },
  intermittentFasting: {
    description: "An eating pattern that cycles between periods of eating and fasting to improve metabolism and weight management.",
    guidelines: [
      "Common methods include 16/8 (16 hours fasting, 8 hours eating), 5:2 (5 normal days, 2 reduced-calorie days)",
      "During eating windows, focus on nutrient-dense, whole foods",
      "Stay hydrated during fasting periods",
      "Consider timing meals around workouts for optimal performance"
    ],
    foodRecommendations: [
      "Proteins: Eggs, fish, poultry, lean meats, beans, lentils",
      "Fiber-Rich Foods: Vegetables, fruits, whole grains, legumes",
      "Healthy Fats: Avocados, nuts, olive oil, fatty fish",
      "Nutrient-Dense Foods: Leafy greens, berries, organ meats",
      "Hydration: Water, herbal tea, black coffee during fasting"
    ]
  },
  zone: {
    description: "A balanced ratio of 40% carbs, 30% protein, and 30% fat in every meal to reduce inflammation and improve performance.",
    guidelines: [
      "Structure every meal with 40% carbohydrates, 30% protein, and 30% fat",
      "Use the 'hand-eye' method: 1/3 of plate lean protein (size of palm), 2/3 of plate colorful carbs (mostly vegetables)",
      "Add a small amount of healthy fat (like olive oil, nuts, or avocado)",
      "Eat 5 times per day: 3 meals and 2 snacks, roughly every 5 hours"
    ],
    foodRecommendations: [
      "Proteins: Lean meats, fish, egg whites, low-fat dairy",
      "Carbohydrates: Colorful vegetables, fruits (especially berries), whole grains in moderation",
      "Fats: Olive oil, avocados, nuts, seeds",
      "Foods to Limit: Refined carbs, high-glycemic fruits, saturated fats"
    ]
  },
  dash: {
    description: "Dietary Approaches to Stop Hypertension - focuses on reducing sodium intake to control blood pressure and improve heart health.",
    guidelines: [
      "Limit sodium to 2,300mg per day (1,500mg for stricter approach)",
      "Rich in fruits, vegetables, whole grains, and low-fat dairy",
      "Include lean proteins, beans, nuts, and vegetable oils",
      "Limit foods high in saturated fats, added sugars, and sodium"
    ],
    foodRecommendations: [
      "Vegetables: 4-5 servings per day",
      "Fruits: 4-5 servings per day",
      "Grains: 6-8 servings per day (mostly whole grains)",
      "Low-Fat Dairy: 2-3 servings per day",
      "Lean Proteins: 6 or fewer servings per day",
      "Nuts, Seeds, Legumes: 4-5 servings per week",
      "Healthy Oils: 2-3 servings per day"
    ]
  },
  carnivore: {
    description: "An animal-based diet that eliminates all plant foods, focusing on meat, fish, eggs, and some dairy products.",
    guidelines: [
      "Consume only animal products: meat, fish, eggs, and optionally dairy",
      "Eliminate all plant foods, including fruits, vegetables, grains, legumes, nuts, and seeds",
      "Emphasize nutrient-rich organ meats if possible",
      "Salt to taste and stay hydrated"
    ],
    foodRecommendations: [
      "Proteins: All types of meat, poultry, fish, seafood, eggs",
      "Organ Meats: Liver, heart, kidney (highly nutrient-dense)",
      "Optional: Butter, ghee, heavy cream, hard cheeses",
      "Bone Broth: For additional minerals and collagen",
      "Seasonings: Salt, pepper, herbs (some allow these in small amounts)"
    ]
  },
  glutenFree: {
    description: "Eliminates gluten, a protein found in wheat, barley, and rye, essential for those with celiac disease or gluten sensitivity.",
    guidelines: [
      "Avoid all foods containing wheat, barley, rye, and often oats (unless certified gluten-free)",
      "Focus on naturally gluten-free foods like fruits, vegetables, meats, fish, dairy",
      "Choose gluten-free grains like rice, quinoa, millet, and buckwheat",
      "Be cautious of cross-contamination in food preparation"
    ],
    foodRecommendations: [
      "Gluten-Free Grains: Rice, quinoa, corn, buckwheat, millet, amaranth",
      "Proteins: Meat, fish, poultry, eggs, beans, lentils (pure forms)",
      "Fruits & Vegetables: All fresh fruits and vegetables",
      "Dairy: Most plain dairy products (check for additives)",
      "Avoid: Wheat, barley, rye, triticale, and foods containing these ingredients"
    ]
  },
  vegan: {
    description: "Excludes all animal products including meat, dairy, eggs, and honey, relying entirely on plant-based nutrition.",
    guidelines: [
      "Consume only plant-based foods",
      "Ensure adequate protein by combining various plant sources",
      "Supplement with vitamin B12, and consider vitamins D, omega-3, iron, zinc, and calcium",
      "Focus on whole foods rather than processed vegan alternatives"
    ],
    foodRecommendations: [
      "Proteins: Tofu, tempeh, edamame, lentils, chickpeas, beans, seitan",
      "Grains: Brown rice, quinoa, oats, barley, whole grain bread",
      "Healthy Fats: Avocados, nuts, seeds, olive oil, coconut",
      "Vegetables: All vegetables, especially leafy greens",
      "Fruits: All fruits",
      "Supplemental Foods: Nutritional yeast, fortified plant milks, algae oil"
    ]
  }
};

// Function to check if a food contains gluten
const containsGluten = (foodName) => {
  if (!foodName) return false;
  const lowerCaseName = foodName.toLowerCase();
  return glutenContainingFoods.some(glutenFood => 
    lowerCaseName.includes(glutenFood.toLowerCase())
  );
};

// Function to filter gluten-containing foods from meal plan
const filterGlutenFoods = (mealPlan) => {
  if (!mealPlan) return mealPlan;
  
  const filteredMealPlan = { ...mealPlan };
  
  // Filter out gluten-containing foods from each meal
  Object.keys(filteredMealPlan).forEach(mealKey => {
    filteredMealPlan[mealKey] = filteredMealPlan[mealKey].filter(
      food => !containsGluten(food.name)
    );
  });
  
  return filteredMealPlan;
};

const DietChart = ({ userData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { saveDietChart, isAuthenticated } = useContext(UserContext);
  const [showStickySummary, setShowStickySummary] = useState(false);
  const summaryRef = useRef(null);
  const bottomSectionRef = useRef(null); // Add ref for bottom section
  
  // Add state for tracking last saved time
  const [lastSavedTime, setLastSavedTime] = useState(null);
  // Add state for success message visibility
  const [saveSuccessVisible, setSaveSuccessVisible] = useState(false);
  // Add state for tracking if there are unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(true);
  // Hide success alert when new edits are made
  useEffect(() => {
    if (hasUnsavedChanges) {
      setSaveSuccessVisible(false);
    }
  }, [hasUnsavedChanges]);

  // Initialize missing state variables
  const [userMealPlan, setUserMealPlan] = useState(null);
  const [mealOrder, setMealOrder] = useState([]);
  const [foodOptions, setFoodOptions] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedFoodDetails, setSelectedFoodDetails] = useState(null);
  const [foodDetailsLoading, setFoodDetailsLoading] = useState(false);
  const [foodSearchValue, setFoodSearchValue] = useState('');
  const [editedFood, setEditedFood] = useState({ name: '', quantity: '', calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 });
  const [mealMenuAnchorEl, setMealMenuAnchorEl] = useState(null);
  const [currentMealForMenu, setCurrentMealForMenu] = useState('');
  const [editingMealId, setEditingMealId] = useState(null);
  const [editedMealName, setEditedMealName] = useState('');
  const [editFoodDialogOpen, setEditFoodDialogOpen] = useState(false);
  const [currentMealKey, setCurrentMealKey] = useState('');
  const [currentFoodIndex, setCurrentFoodIndex] = useState(-1);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [foodToDelete, setFoodToDelete] = useState({ mealKey: '', foodIndex: -1, foodName: '' });
  const [saveSnackbarOpen, setSaveSnackbarOpen] = useState(false);
  const [saveSnackbarMessage, setSaveSnackbarMessage] = useState('');
  const [saveSnackbarSeverity, setSaveSnackbarSeverity] = useState('success');
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  
  // Check if current tab is the diet generator tab (index 1)
  const [isDietGeneratorTabActive, setIsDietGeneratorTabActive] = useState(true);
  
  // Get the current active tab from the parent component
  useEffect(() => {
    // Since this component is only rendered when in the diet generator tab (index 1)
    // We can set this to true when mounted and false when unmounted
    setIsDietGeneratorTabActive(true);
    return () => {
      setIsDietGeneratorTabActive(false);
    };
  }, []);
  
  // Handle scroll effects for the sticky Total Nutrients section
  useEffect(() => {
    const handleScroll = () => {
      if (summaryRef.current) {
        const summaryPosition = summaryRef.current.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        // Show sticky summary when the original summary scrolls out of view of the bottom of the viewport
        setShowStickySummary(summaryPosition > windowHeight);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check to see if we should show the sticky summary
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // LocalStorage persistence key (per user)
  const getDietChartStorageKey = (userId) => `dietChart_${userId}`;

  // Load from localStorage on mount (and only set defaults if nothing is found)
  useEffect(() => {
    if (userData && userData.uid) {
      const saved = localStorage.getItem(getDietChartStorageKey(userData.uid));
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.userMealPlan && parsed.mealOrder) {
            setUserMealPlan(parsed.userMealPlan);
            setMealOrder(parsed.mealOrder);
            return; // Don't set defaults if we loaded from storage
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
      // If nothing in storage, set defaults
      if (!userMealPlan) {
        const { goal, dietType, dietPreference } = userData;
        let defaultMealPlan;
        if (dietType && dietTypeMealPlans[dietType]) {
          defaultMealPlan = dietTypeMealPlans[dietType];
        } else if (goal && mealPlans[goal]) {
          defaultMealPlan = mealPlans[goal];
        } else {
          defaultMealPlan = mealPlans.maintain;
        }
        let mealPlanCopy = JSON.parse(JSON.stringify(defaultMealPlan));
        if (dietPreference === 'vegan' && dietTypeMealPlans.vegan) {
          mealPlanCopy = JSON.parse(JSON.stringify(dietTypeMealPlans.vegan));
        } else if (dietPreference === 'vegetarian' && dietTypeMealPlans.vegetarian) {
          mealPlanCopy = JSON.parse(JSON.stringify(dietTypeMealPlans.vegetarian));
        }
        if (userData.isGlutenFree) {
          mealPlanCopy = filterGlutenFoods(mealPlanCopy);
        }
        setUserMealPlan(mealPlanCopy);
        setMealOrder(Object.keys(mealPlanCopy));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData && userData.uid]);

  // Save to localStorage whenever meal plan/order changes
  useEffect(() => {
    if (userData && userData.uid && userMealPlan && mealOrder) {
      localStorage.setItem(
        getDietChartStorageKey(userData.uid),
        JSON.stringify({ userMealPlan, mealOrder })
      );
    }
  }, [userData && userData.uid, userMealPlan, mealOrder]);

  // Load food options for autocomplete and update when USDA foods are loaded
  useEffect(() => {
    // Initial load
    getAllFoodNames().then(setFoodOptions);

    // Handler for USDA foods loaded event
    const handleFoodDatabaseLoaded = () => {
      getAllFoodNames().then(setFoodOptions);
    };

    window.addEventListener('foodDatabaseLoaded', handleFoodDatabaseLoaded);
    return () => {
      window.removeEventListener('foodDatabaseLoaded', handleFoodDatabaseLoaded);
    };
  }, []);
  
  // Handle food selection from autocomplete
  const handleFoodSelect = (event, value) => {
    setSelectedFood(value);
    if (value) {
      setFoodDetailsLoading(true);
      const foodDetails = getFoodDetails(value);
      setSelectedFoodDetails(foodDetails);
      
      // Update editedFood with selected food name
      setEditedFood({
        ...editedFood,
        name: value,
      });
      
      setFoodDetailsLoading(false);
    } else {
      setSelectedFoodDetails(null);
    }
  };
  
  // Handle quantity change and calculate nutrition
  const handleQuantityChange = (e) => {
    const newQuantity = e.target.value;
    setEditedFood({...editedFood, quantity: newQuantity});
    
    if (selectedFood && newQuantity) {
      // Calculate nutrition based on quantity and selected food
      const nutrition = calculateNutrition(selectedFood, newQuantity);
      if (nutrition) {
        setEditedFood({
          ...editedFood,
          quantity: newQuantity,
          calories: nutrition.calories,
          protein: nutrition.protein,
          carbs: nutrition.carbs,
          fats: nutrition.fats,
          fiber: nutrition.fiber || 0
        });
      }
    }
  };
  
  // Handle saving diet chart
  const handleSaveDietChart = async () => {
    console.log("Starting save process with userData:", userData);
    // Disable save button immediately to prevent duplicates
    setHasUnsavedChanges(false);
    if (!isAuthenticated) {
      console.error("User not authenticated, cannot save");
      alert('Please log in to save your diet plan');
      return;
    }

    const dietChartData = {
      userId: userData.uid, // Explicitly include userId at top level
      mealPlan: userMealPlan,
      mealOrder: mealOrder,
      mealDisplayNames: mealDisplayNames,
      totalNutrients: calculateTotalNutrients(),
      // Add user preferences to be saved with the diet chart
      dietType: userData?.dietType || 'standard',
      goal: userData?.goal || 'maintain',
      isGlutenFree: userData?.isGlutenFree || false,
      dateCreated: new Date().toISOString()
    };

    console.log("Diet chart data prepared for saving:", dietChartData);

    try {
      // Show the success message immediately while the save is in progress
      setSaveSuccessVisible(true);
      
      console.log("Calling saveDietChart service function");
      const saveResult = await saveDietChart(dietChartData);
      console.log("Save result received:", saveResult);
      
      if (saveResult && saveResult.success) {
        // Create a new Date object explicitly
        const savedTime = new Date();
        
        // Update timestamp display with the current time
        console.log("Setting timestamp to:", savedTime.toLocaleString());
        setLastSavedTime(savedTime);
        
        // Keep success message visible for 5 seconds
        setTimeout(() => {
          setSaveSuccessVisible(false);
        }, 5000);
        
        // Show snackbar feedback
        setSaveSnackbarMessage('Diet plan saved successfully!');
        setSaveSnackbarSeverity('success');
        setSaveSnackbarOpen(true);

        // Already disabled; remain disabled until edits
      } else {
        console.error("Save failed with result:", saveResult);
        // Hide success message on error
        setSaveSuccessVisible(false);
        setLastSavedTime(null);
        
        // Re-enable save button since save failed
        setHasUnsavedChanges(true);
        
        // Show error alerts
        alert('Unable to save diet plan. Please try again.');
        setSaveSnackbarMessage('Failed to save diet plan. Please try again.');
        setSaveSnackbarSeverity('error');
        setSaveSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error saving diet plan:", error);
      
      // Hide success message on error
      setSaveSuccessVisible(false);
      setLastSavedTime(null);
      
      // Re-enable save button due to error
      setHasUnsavedChanges(true);
      
      // Show error alerts
      alert('An error occurred while saving the diet plan. Please try again.');
      setSaveSnackbarMessage('An error occurred while saving the diet plan.');
      setSaveSnackbarSeverity('error');
      setSaveSnackbarOpen(true);
    }
  };

  // Handle snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSaveSnackbarOpen(false);
  };

  // Meal name display mapping
  const mealDisplayNames = {
    breakfast: 'Breakfast',
    morningSnack: 'Morning Snack',
    lunch: 'Lunch',
    postWorkout: 'Post-Workout',
    eveningSnack: 'Evening Snack',
    dinner: 'Dinner'
  };
  
  // Time labels for meals
  const mealTimeLabels = {
    breakfast: 'Morning',
    morningSnack: '10-11 AM',
    lunch: 'Noon',
    postWorkout: 'After Exercise',
    eveningSnack: '4-5 PM',
    dinner: 'Evening'
  };
  
  // Colors for meal time chips
  const mealChipColors = {
    breakfast: theme.palette.primary.light,
    morningSnack: theme.palette.secondary.light,
    lunch: theme.palette.primary.main,
    postWorkout: theme.palette.success.main,
    eveningSnack: theme.palette.secondary.light,
    dinner: theme.palette.primary.dark
  };
  
  // Reordering handlers
  const moveMealUp = (index) => {
    if (index <= 0) return;
    const items = Array.from(mealOrder);
    const [movedItem] = items.splice(index, 1);
    items.splice(index - 1, 0, movedItem);
    setMealOrder(items);
    setHasUnsavedChanges(true);
  };

  const moveMealDown = (index) => {
    if (index >= mealOrder.length - 1) return;
    const items = Array.from(mealOrder);
    const [movedItem] = items.splice(index, 1);
    items.splice(index + 1, 0, movedItem);
    setMealOrder(items);
    setHasUnsavedChanges(true);
  };
  
  // Menu handlers
  const handleMealMenuOpen = (event, mealKey) => {
    setMealMenuAnchorEl(event.currentTarget);
    setCurrentMealForMenu(mealKey);
  };
  
  const handleMealMenuClose = () => {
    setMealMenuAnchorEl(null);
    setCurrentMealForMenu('');
  };
  
  // Rename meal handler
  const handleRenameMeal = () => {
    setEditingMealId(currentMealForMenu);
    setEditedMealName(mealDisplayNames[currentMealForMenu] || currentMealForMenu);
    handleMealMenuClose();
  };
  
  // Handle saving meal name edit
  const handleSaveMealName = (mealKey) => {
    if (!editedMealName.trim()) {
      setEditingMealId(null);
      setEditedMealName('');
      return;
    }
    
    // Save the original meal name with spaces and special characters for display
    const displayName = editedMealName.trim();
    
    // Update the display name for this meal key
    mealDisplayNames[mealKey] = displayName;
    
    setEditingMealId(null);
    setEditedMealName('');
    setHasUnsavedChanges(true);
  };
  
  // Delete meal handler
  const handleDeleteMeal = () => {
    const updatedMealPlan = { ...userMealPlan };
    delete updatedMealPlan[currentMealForMenu];
    
    setUserMealPlan(updatedMealPlan);
    setMealOrder(mealOrder.filter(meal => meal !== currentMealForMenu));
    setHasUnsavedChanges(true);
    
    handleMealMenuClose();
  };
  
  // Add new meal handler
  const handleAddNewMeal = () => {
    // Start with a default name that will also be used for the key
    const defaultMealName = 'New Meal';
    
    // Create a key based on the meal name (sanitized to work as an object key)
    const newMealKey = defaultMealName.trim()
      .replace(/\s+/g, '') // Remove spaces
      .replace(/[^a-zA-Z0-9]/g, ''); // Remove special characters
    
    // Use a fallback if key is empty after sanitization
    const finalMealKey = newMealKey || `meal${Date.now()}`;
    
    // Add the new meal to the plan
    const updatedMealPlan = {
      ...userMealPlan,
      [finalMealKey]: [] // Start with an empty meal
    };
    
    // Add display name - keep original with spaces
    mealDisplayNames[finalMealKey] = defaultMealName;
    mealTimeLabels[finalMealKey] = 'Custom';
    mealChipColors[finalMealKey] = theme.palette.info.main;
    
    setUserMealPlan(updatedMealPlan);
    setMealOrder([...mealOrder, finalMealKey]);
    setHasUnsavedChanges(true);
    
    // Open the rename dialog for the new meal
    setEditingMealId(finalMealKey);
    setEditedMealName(defaultMealName);
  };
  
  // Food editing handlers
  const handleOpenEditFoodDialog = (mealKey, foodIndex) => {
    const foodItem = userMealPlan[mealKey][foodIndex];
    setCurrentMealKey(mealKey);
    setCurrentFoodIndex(foodIndex);
    setEditedFood({ ...foodItem });
    setEditFoodDialogOpen(true);
  };
  
  const handleCloseEditFoodDialog = () => {
    setEditFoodDialogOpen(false);
    setCurrentMealKey('');
    setCurrentFoodIndex(-1);
    setEditedFood({ name: '', quantity: '', calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 });
  };
  
  const handleSaveEditedFood = () => {
    const updatedMealPlan = { ...userMealPlan };
    
    // If currentFoodIndex is -1, we're adding a new food
    if (currentFoodIndex === -1) {
      updatedMealPlan[currentMealKey].push({ ...editedFood });
    } else {
      updatedMealPlan[currentMealKey][currentFoodIndex] = { ...editedFood };
    }
    
    setUserMealPlan(updatedMealPlan);
    setHasUnsavedChanges(true);
    handleCloseEditFoodDialog();
  };
  
  // Add new food to meal
  const handleAddFood = (mealKey) => {
    setCurrentMealKey(mealKey);
    setCurrentFoodIndex(-1); // -1 indicates a new food
    setEditedFood({ name: '', quantity: '', calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 });
    setEditFoodDialogOpen(true);
  };
  
  // Modified delete food handler - now opens confirmation dialog
  const handleDeleteFoodClick = (mealKey, foodIndex) => {
    const foodName = userMealPlan[mealKey][foodIndex].name;
    setFoodToDelete({ mealKey, foodIndex, foodName });
    setDeleteConfirmOpen(true);
  };

  // Actual delete implementation (after confirmation)
  const confirmDeleteFood = () => {
    const { mealKey, foodIndex } = foodToDelete;
    const updatedMealPlan = { ...userMealPlan };
    updatedMealPlan[mealKey].splice(foodIndex, 1);
    setUserMealPlan(updatedMealPlan);
    setHasUnsavedChanges(true);
    setDeleteConfirmOpen(false);
  };

  // Calculate nutrients for a specific meal
  const calculateMealNutrients = (mealKey) => {
    if (!userMealPlan || !userMealPlan[mealKey]) return { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 };
    
    return userMealPlan[mealKey].reduce((totals, food) => {
      return {
        calories: totals.calories + (food.calories || 0),
        protein: totals.protein + (food.protein || 0),
        carbs: totals.carbs + (food.carbs || 0),
        fats: totals.fats + (food.fats || 0),
        fiber: totals.fiber + (food.fiber || 0)
      };
    }, { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 });
  };

  // Calculate total nutrients of the meal plan
  const calculateTotalNutrients = () => {
    if (!userMealPlan) return { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFats: 0, totalFiber: 0 };
    
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;
    let totalFiber = 0;

    Object.values(userMealPlan).forEach(meal => {
      meal.forEach(food => {
        totalCalories += food.calories;
        totalProtein += food.protein;
        totalCarbs += food.carbs;
        totalFats += food.fats;
        totalFiber += food.fiber || 0; // Add fiber values, default to 0 if not present
      });
    });

    return { totalCalories, totalProtein, totalCarbs, totalFats, totalFiber };
  };
  
  // Filter diet recommendations for gluten if needed
  const getFilteredDietRecommendations = (dietType) => {
    if (!dietType || !userData?.isGlutenFree) {
      return dietTypeRecommendations[dietType] || {};
    }
    
    const recommendations = { ...dietTypeRecommendations[dietType] };
    
    // Filter out food recommendations containing gluten
    if (recommendations.foodRecommendations) {
      recommendations.foodRecommendations = recommendations.foodRecommendations.filter(
        recommendation => !glutenContainingFoods.some(glutenFood => 
          recommendation.toLowerCase().includes(glutenFood.toLowerCase())
        )
      );
    }
    
    // Add gluten-free note to guidelines if not already present
    if (recommendations.guidelines) {
      const hasGlutenFreeGuideline = recommendations.guidelines.some(
        guideline => guideline.toLowerCase().includes('gluten')
      );
      
      if (!hasGlutenFreeGuideline) {
        recommendations.guidelines = [
          ...recommendations.guidelines,
          "Avoid all foods containing gluten (wheat, barley, rye, and often oats unless certified gluten-free)"
        ];
      }
    }
    
    return recommendations;
  };

  if (!userData) {
    return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Typography variant="h6" align="center">
          Please complete your profile to generate a diet chart
        </Typography>
      </Paper>
    );
  }

  if (!userMealPlan || mealOrder.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Typography variant="h6" align="center">
          Loading your meal plan...
        </Typography>
      </Paper>
    );
  }

  const { calorieNeeds, macros } = userData;
  const { totalCalories, totalProtein, totalCarbs, totalFats, totalFiber } = calculateTotalNutrients();

  return (
    <>
      <div id="diet-plan-content">
        <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
          Your Personalized Diet Plan
        </Typography>
        
        {userData.dietType && (
          <Card elevation={2} sx={{ mb: 4, bgcolor: 'rgba(76, 175, 80, 0.03)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                {userData.dietType.charAt(0).toUpperCase() + userData.dietType.slice(1).replace(/([A-Z])/g, ' $1').trim()} Diet Recommendations
              </Typography>
              
              <Typography variant="body2" paragraph sx={{ fontStyle: 'italic' }}>
                {getFilteredDietRecommendations(userData.dietType)?.description || "A customized diet plan based on your goals and preferences."}
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom color="primary.dark">
                  Guidelines:
                </Typography>
                <ul style={{ paddingLeft: '1.5rem', marginTop: 0 }}>
                  {getFilteredDietRecommendations(userData.dietType)?.guidelines.map((guideline, index) => (
                    <li key={index}>
                      <Typography variant="body2">{guideline}</Typography>
                    </li>
                  ))}
                </ul>
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom color="primary.dark">
                  Recommended Foods:
                </Typography>
                <Grid container spacing={1}>
                  {getFilteredDietRecommendations(userData.dietType)?.foodRecommendations.map((recommendation, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Chip 
                        label={recommendation} 
                        size="small" 
                        sx={{ 
                          height: 'auto', 
                          '& .MuiChip-label': { 
                            display: 'block', 
                            whiteSpace: 'normal',
                            p: 0.8 
                          },
                          bgcolor: 'rgba(76, 175, 80, 0.08)',
                          mb: 1
                        }} 
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </CardContent>
          </Card>
        )}
        
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2} sx={{ height: '100%', borderLeft: `4px solid ${theme.palette.primary.main}` }}>
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary">
                    Daily Calories
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {calorieNeeds} kcal
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2} sx={{ height: '100%', borderLeft: `4px solid ${theme.palette.primary.main}` }}>
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary">
                    Protein
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {macros.protein}g
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2} sx={{ height: '100%', borderLeft: `4px solid ${theme.palette.primary.main}` }}>
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary">
                    Carbs
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {macros.carbs}g
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2} sx={{ height: '100%', borderLeft: `4px solid ${theme.palette.primary.main}` }}>
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary">
                    Fats
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {macros.fats}g
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }} className="no-print">
          <Button 
            variant="contained" 
            color="success" 
            startIcon={<AddIcon />}
            onClick={handleAddNewMeal}
            sx={{ borderRadius: 2 }}
          >
            Add New Meal
          </Button>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={3}>
          {mealOrder.map((mealKey, index) => (
            <Grid 
              item 
              xs={12}
              key={mealKey}
              sx={{
                position: 'relative',
                pb: 4, // Add padding to bottom to create space between stacked cards
                mt: index > 0 ? -2 : 0 // Negative margin to create overlapping stacked effect
              }}
            >
              <Card 
                sx={{ 
                  mb: 3, 
                  position: 'relative',
                  transform: 'perspective(1000px) rotateX(0deg)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'perspective(1000px) rotateX(2deg) translateY(-4px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06)',
                    '& .meal-header': {
                      bgcolor: 'rgba(76, 175, 80, 0.08)',
                    }
                  },
                  borderTop: `4px solid ${mealChipColors[mealKey] || theme.palette.info.main}`,
                }}
                elevation={3}
              >
                <CardContent>
                  <Box 
                    className="meal-header"
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      mb: 2,
                      py: 1,
                      px: 2,
                      ml: -2,
                      mr: -2,
                      mt: -2,
                      borderTopLeftRadius: 4,
                      borderTopRightRadius: 4,
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    {editingMealId === mealKey ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <TextField
                          size="small"
                          value={editedMealName}
                          onChange={(e) => setEditedMealName(e.target.value)}
                          autoFocus
                          fullWidth
                          sx={{ mr: 1 }}
                        />
                        <Button 
                          variant="contained" 
                          size="small" 
                          onClick={() => handleSaveMealName(mealKey)}
                        >
                          Save
                        </Button>
                      </Box>
                    ) : (
                      <>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                          {mealDisplayNames[mealKey] || mealKey}
                          <Chip 
                            label={mealTimeLabels[mealKey] || 'Custom'} 
                            size="small" 
                            sx={{ 
                              ml: 1, 
                              bgcolor: mealChipColors[mealKey] || theme.palette.info.main,
                              color: ['postWorkout', 'breakfast', 'lunch', 'dinner'].includes(mealKey) ? 'white' : 'inherit'
                            }} 
                          />
                        </Typography>
                        <Box className="no-print" sx={{ display: 'flex', alignItems: 'center' }}>
                          {index > 0 && (
                            <IconButton
                              size="small"
                              onClick={() => moveMealUp(index)}
                              title="Move Up"
                            >
                              <ArrowUpwardIcon fontSize="small" />
                            </IconButton>
                          )}
                          {index < mealOrder.length - 1 && (
                            <IconButton
                              size="small"
                              onClick={() => moveMealDown(index)}
                              title="Move Down"
                            >
                              <ArrowDownwardIcon fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton
                            size="small"
                            onClick={(e) => handleMealMenuOpen(e, mealKey)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Box>
                      </>
                    )}
                  </Box>

                  {/* Meal Menu */}
                  <Menu
                    anchorEl={mealMenuAnchorEl}
                    open={Boolean(mealMenuAnchorEl)}
                    onClose={handleMealMenuClose}
                  >
                    <MenuItem onClick={handleRenameMeal}>
                      <EditIcon fontSize="small" sx={{ mr: 1 }} />
                      Rename Meal
                    </MenuItem>
                    <MenuItem onClick={handleDeleteMeal} sx={{ color: 'error.main' }}>
                      <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                      Delete Meal
                    </MenuItem>
                  </Menu>

                  {/* Individual meal section header */}
                  <Grid container spacing={1} sx={{ mb: 1, px: 1 }}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ 
                        pl: 1,
                        display: { xs: 'none', md: 'block' } // Hide on small screens, show on medium and up
                      }}>
                        Food Item
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <Grid container spacing={1}>
                        <Grid item xs={2.4} sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ 
                            display: { xs: 'none', md: 'block' } // Hide on small screens, show on medium and up
                          }}>
                            Calories
                          </Typography>
                        </Grid>
                        <Grid item xs={2.4} sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ 
                            display: { xs: 'none', md: 'block' } // Hide on small screens, show on medium and up
                          }}>
                            P(g)
                          </Typography>
                        </Grid>
                        <Grid item xs={2.4} sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ 
                            display: { xs: 'none', md: 'block' } // Hide on small screens, show on medium and up
                          }}>
                            C(g)
                          </Typography>
                        </Grid>
                        <Grid item xs={2.4} sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ 
                            display: { xs: 'none', md: 'block' } // Hide on small screens, show on medium and up
                          }}>
                            F(g)
                          </Typography>
                        </Grid>
                        <Grid item xs={2.4} sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ 
                            display: { xs: 'none', md: 'block' } // Hide on small screens, show on medium and up
                          }}>
                            Fiber(g)
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* Meal Nutrition Summary */}
                  {userMealPlan[mealKey] && userMealPlan[mealKey].length > 0 && (
                    <Box sx={{ 
                      mt: 2, 
                      p: 1.5, 
                      bgcolor: 'rgba(76, 175, 80, 0.05)', 
                      borderRadius: 1,
                      border: '1px dashed rgba(76, 175, 80, 0.3)'
                    }}>
                      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Meal Totals
                      </Typography>
                      
                      {isMobile ? (
                        // Mobile view with inline headers for meal totals
                        <Grid container spacing={1}>
                          {(() => {
                            const { calories, protein, carbs, fats, fiber } = calculateMealNutrients(mealKey);
                            return (
                              <>
                                <Grid item xs={4}>
                                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Typography variant="caption" color="text.secondary">Cal</Typography>
                                    <Chip 
                                      label={`${calories}`} 
                                      size="small" 
                                      variant="outlined"
                                      sx={{ width: '100%', bgcolor: 'rgba(76, 175, 80, 0.1)', fontWeight: 'bold' }} 
                                    />
                                  </Box>
                                </Grid>
                                <Grid item xs={4}>
                                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Typography variant="caption" color="text.secondary">P(g)</Typography>
                                    <Chip 
                                      label={`${protein.toFixed(1)}`} 
                                      size="small" 
                                      variant="outlined"
                                      sx={{ width: '100%', bgcolor: 'rgba(33, 150, 243, 0.1)', fontWeight: 'bold' }} 
                                    />
                                  </Box>
                                </Grid>
                                <Grid item xs={4}>
                                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Typography variant="caption" color="text.secondary">C(g)</Typography>
                                    <Chip 
                                      label={`${carbs.toFixed(1)}`} 
                                      size="small" 
                                      variant="outlined"
                                      sx={{ width: '100%', bgcolor: 'rgba(255, 152, 0, 0.1)', fontWeight: 'bold' }} 
                                    />
                                  </Box>
                                </Grid>
                                <Grid item xs={6}>
                                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Typography variant="caption" color="text.secondary">F(g)</Typography>
                                    <Chip 
                                      label={`${fats.toFixed(1)}`} 
                                      size="small" 
                                      variant="outlined"
                                      sx={{ width: '100%', bgcolor: 'rgba(244, 67, 54, 0.1)', fontWeight: 'bold' }} 
                                    />
                                  </Box>
                                </Grid>
                                <Grid item xs={6}>
                                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Typography variant="caption" color="text.secondary">Fiber(g)</Typography>
                                    <Chip 
                                      label={`${fiber.toFixed(1)}`} 
                                      size="small" 
                                      variant="outlined"
                                      sx={{ width: '100%', bgcolor: 'rgba(121, 85, 72, 0.1)', fontWeight: 'bold' }} 
                                    />
                                  </Box>
                                </Grid>
                              </>
                            );
                          })()}
                        </Grid>
                      ) : (
                        // Desktop view with side-by-side meal totals
                        <Grid container spacing={1}>
                          <Grid item xs={12} md={4}>
                            {/* Empty space to align with food item column */}
                          </Grid>
                          <Grid item xs={12} md={8}>
                            <Grid container spacing={1}>
                              {(() => {
                                const { calories, protein, carbs, fats, fiber } = calculateMealNutrients(mealKey);
                                return (
                                  <>
                                    <Grid item xs={2.4} sx={{ textAlign: 'center' }}>
                                      <Chip 
                                        label={`${calories}`} 
                                        size="small" 
                                        variant="outlined"
                                        sx={{ width: '100%', bgcolor: 'rgba(76, 175, 80, 0.1)', fontWeight: 'bold' }} 
                                      />
                                    </Grid>
                                    <Grid item xs={2.4} sx={{ textAlign: 'center' }}>
                                      <Chip 
                                        label={`${protein.toFixed(1)}g`} 
                                        size="small" 
                                        variant="outlined"
                                        sx={{ width: '100%', bgcolor: 'rgba(33, 150, 243, 0.1)', fontWeight: 'bold' }} 
                                      />
                                    </Grid>
                                    <Grid item xs={2.4} sx={{ textAlign: 'center' }}>
                                      <Chip 
                                        label={`${carbs.toFixed(1)}g`} 
                                        size="small" 
                                        variant="outlined"
                                        sx={{ width: '100%', bgcolor: 'rgba(255, 152, 0, 0.1)', fontWeight: 'bold' }} 
                                      />
                                    </Grid>
                                    <Grid item xs={2.4} sx={{ textAlign: 'center' }}>
                                      <Chip 
                                        label={`${fats.toFixed(1)}g`} 
                                        size="small" 
                                        variant="outlined"
                                        sx={{ width: '100%', bgcolor: 'rgba(244, 67, 54, 0.1)', fontWeight: 'bold' }} 
                                      />
                                    </Grid>
                                    <Grid item xs={2.4} sx={{ textAlign: 'center' }}>
                                      <Chip 
                                        label={`${fiber.toFixed(1)}g`} 
                                        size="small" 
                                        variant="outlined"
                                        sx={{ width: '100%', bgcolor: 'rgba(121, 85, 72, 0.1)', fontWeight: 'bold' }} 
                                      />
                                    </Grid>
                                  </>
                                );
                              })()}
                            </Grid>
                          </Grid>
                        </Grid>
                      )}
                    </Box>
                  )}

                  {/* Food Items */}
                  <List disablePadding>
                    {userMealPlan[mealKey] && userMealPlan[mealKey].map((food, foodIndex) => (
                      <Box key={foodIndex} sx={{ position: 'relative', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.02)' } }}>
                        <FoodItem 
                          food={food} 
                          onEdit={() => handleOpenEditFoodDialog(mealKey, foodIndex)}
                          onDelete={() => handleDeleteFoodClick(mealKey, foodIndex)}
                        />
                      </Box>
                    ))}
                    {(!userMealPlan[mealKey] || userMealPlan[mealKey].length === 0) && (
                      <ListItem>
                        <ListItemText primary="No foods added yet" />
                      </ListItem>
                    )}
                    
                    {/* Add Food Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }} className="no-print">
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => handleAddFood(mealKey)}
                      >
                        Add Food
                      </Button>
                    </Box>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ mt: 4, mb: 2 }} />

        <Box sx={{ mb: 2 }} ref={summaryRef}>
          <Typography variant="h6" gutterBottom>
            Total Nutrients
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={2.4}>
              <Card elevation={2} sx={{ height: '100%', borderLeft: `4px solid ${theme.palette.primary.main}` }}>
                <CardContent sx={{ 
                  p: { xs: 0.5, md: 1.5 }
                }}>
                  <Typography variant="caption" color="textSecondary">
                    Calories
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {totalCalories} kcal
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={2.4}>
              <Card elevation={2} sx={{ height: '100%', borderLeft: `4px solid ${theme.palette.primary.main}` }}>
                <CardContent sx={{ 
                  p: { xs: 0.5, md: 1.5 }
                }}>
                  <Typography variant="caption" color="textSecondary">
                    Protein
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {totalProtein.toFixed(1)}g
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={2.4}>
              <Card elevation={2} sx={{ height: '100%', borderLeft: `4px solid ${theme.palette.primary.main}` }}>
                <CardContent sx={{ 
                  p: { xs: 0.5, md: 1.5 }
                }}>
                  <Typography variant="caption" color="textSecondary">
                    Carbs
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {totalCarbs.toFixed(1)}g
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={2.4}>
              <Card elevation={2} sx={{ height: '100%', borderLeft: `4px solid ${theme.palette.primary.main}` }}>
                <CardContent sx={{ 
                  p: { xs: 0.5, md: 1.5 }
                }}>
                  <Typography variant="caption" color="textSecondary">
                    Fats
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {totalFats.toFixed(1)}g
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={2.4}>
              <Card elevation={2} sx={{ height: '100%', borderLeft: `4px solid ${theme.palette.primary.main}` }}>
                <CardContent sx={{ 
                  p: { xs: 0.5, md: 1.5 }
                }}>
                  <Typography variant="caption" color="textSecondary">
                    Fiber
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {totalFiber.toFixed(1)}g
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }} className="no-print">
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<PrintIcon />}
            onClick={() => setPrintDialogOpen(true)}
            sx={{ borderRadius: 2 }}
          >
            Print Diet Chart
          </Button>
          
          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 0.5, md: 2 }, 
            mt: { xs: 0, md: 0 },
            justifyContent: 'flex-end',
            ml: { xs: 0, md: 2 },
            flexShrink: 0,
            flexDirection: { xs: 'column', md: 'row' }  // Stack vertically on mobile, horizontal on larger screens
          }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="small"
              startIcon={isMobile ? null : <PrintIcon />}
              onClick={() => setPrintDialogOpen(true)}
              sx={{ 
                borderRadius: 2,
                minWidth: { xs: '100%', md: 'auto' },  // Full width on mobile
                px: { xs: 1, md: 2 },
                py: { xs: 0.5, md: 1 },
                mb: { xs: 1, md: 0 }  // Add bottom margin on mobile
              }}
            >
              {isMobile ? <PrintIcon fontSize="small" /> : "Print Diet Chart"}
            </Button>
            <Button 
              variant="contained" 
              color="success" 
              size="small"
              startIcon={isMobile ? null : <SaveIcon />}
              onClick={handleSaveDietChart} 
              disabled={!hasUnsavedChanges}
              sx={{ 
                borderRadius: 2,
                minWidth: { xs: '100%', md: 'auto' },  // Full width on mobile
                px: { xs: 1, md: 2 },
                py: { xs: 0.5, md: 1 }
              }}
            >
              {isMobile ? <SaveIcon fontSize="small" /> : (hasUnsavedChanges ? "Save" : "Saved")}
            </Button>
          </Box>
        </Box>
      </div>

      {/* Sticky Total Nutrients section - shows when original is scrolled out of view */}
      <Fade in={showStickySummary && isDietGeneratorTabActive}>
        <Box 
          sx={{ 
            position: 'fixed', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            bgcolor: 'background.paper', 
            boxShadow: 3, 
            p: { xs: 1, md: 2 }, 
            zIndex: 1100,
            borderTop: `4px solid ${theme.palette.primary.main}`,
            display: 'flex',
            flexDirection: { xs: 'row', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: { xs: 1, md: 2 },
            maxWidth: '100%',
            margin: '0 auto'
          }}
          className="no-print"
          ref={bottomSectionRef}
        >
          <Grid container spacing={1} sx={{ 
            flexGrow: 1, 
            maxWidth: { xs: '65%', md: '80%' },
            display: 'flex',
            flexWrap: { xs: 'nowrap', md: 'nowrap' }
          }}>
            {/* On mobile, only show calories, protein and a compact summary chip */}
            <Grid item xs={6} sm={2.4} md={2.4} sx={{ display: 'flex' }}>
              <Card elevation={1} sx={{ 
                height: '100%',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CardContent sx={{ 
                  p: { xs: 0.5, md: 1.5 }
                }}>
                  <Typography variant="caption" color="textSecondary" sx={{ fontSize: { xs: '0.6rem', md: '0.75rem' } }}>
                    Cal
                  </Typography>
                  <Typography variant="subtitle1" sx={{ 
                    fontWeight: 'bold',
                    fontSize: { xs: '0.8rem', md: '1.1rem' }
                  }}>
                    {totalCalories}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={2.4} md={2.4} sx={{ display: 'flex' }}>
              <Card elevation={1} sx={{ 
                height: '100%',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CardContent sx={{ 
                  p: { xs: 0.5, md: 1.5 }
                }}>
                  <Typography variant="caption" color="textSecondary" sx={{ fontSize: { xs: '0.6rem', md: '0.75rem' } }}>
                    P(g)
                  </Typography>
                  <Typography variant="subtitle1" sx={{ 
                    fontWeight: 'bold',
                    fontSize: { xs: '0.8rem', md: '1.1rem' }
                  }}>
                    {totalProtein.toFixed(0)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            {/* Show these items on all screens */}
            <Grid item xs={4} sm={2.4} md={2.4} sx={{ display: 'flex' }}>
              <Card elevation={1} sx={{ 
                height: '100%',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CardContent sx={{ 
                  p: { xs: 0.5, md: 1.5 }
                }}>
                  <Typography variant="caption" color="textSecondary" sx={{ fontSize: { xs: '0.6rem', md: '0.75rem' } }}>
                    C(g)
                  </Typography>
                  <Typography variant="subtitle1" sx={{ 
                    fontWeight: 'bold',
                    fontSize: { xs: '0.8rem', md: '1.1rem' }
                  }}>
                    {totalCarbs.toFixed(0)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4} sm={2.4} md={2.4} sx={{ display: 'flex' }}>
              <Card elevation={1} sx={{ 
                height: '100%',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CardContent sx={{ 
                  p: { xs: 0.5, md: 1.5 }
                }}>
                  <Typography variant="caption" color="textSecondary" sx={{ fontSize: { xs: '0.6rem', md: '0.75rem' } }}>
                    F(g)
                  </Typography>
                  <Typography variant="subtitle1" sx={{ 
                    fontWeight: 'bold',
                    fontSize: { xs: '0.8rem', md: '1.1rem' }
                  }}>
                    {totalFats.toFixed(0)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4} sm={2.4} md={2.4} sx={{ display: 'flex' }}>
              <Card elevation={1} sx={{ 
                height: '100%',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CardContent sx={{ 
                  p: { xs: 0.5, md: 1.5 }
                }}>
                  <Typography variant="caption" color="textSecondary" sx={{ fontSize: { xs: '0.6rem', md: '0.75rem' } }}>
                    Fib(g)
                  </Typography>
                  <Typography variant="subtitle1" sx={{ 
                    fontWeight: 'bold',
                    fontSize: { xs: '0.8rem', md: '1.1rem' }
                  }}>
                    {totalFiber.toFixed(0)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 0.5, md: 2 }, 
            mt: { xs: 0, md: 0 },
            justifyContent: 'flex-end',
            ml: { xs: 0, md: 2 },
            flexShrink: 0
          }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="small"
              startIcon={isMobile ? null : <PrintIcon />}
              onClick={() => setPrintDialogOpen(true)}
              sx={{ 
                borderRadius: 2,
                minWidth: { xs: '40px', md: 'auto' },
                px: { xs: 1, md: 2 },
                py: { xs: 0.5, md: 1 }
              }}
            >
              {isMobile ? <PrintIcon fontSize="small" /> : "Print Diet Chart"}
            </Button>
            <Button 
              variant="contained" 
              color="success" 
              size="small"
              startIcon={isMobile ? null : <SaveIcon />}
              // Removed the setTimeout logic here, rely on state update
              onClick={handleSaveDietChart} 
              disabled={!hasUnsavedChanges} // <--- Disable button if no unsaved changes
              sx={{ 
                borderRadius: 2,
                minWidth: { xs: '40px', md: 'auto' },
                px: { xs: 1, md: 2 },
                py: { xs: 0.5, md: 1 }
              }}
            >
              {isMobile ? <SaveIcon fontSize="small" /> : (hasUnsavedChanges ? "Save" : "Saved")} {/* Update text */}
            </Button>
          </Box>
        </Box>
      </Fade>

      {/* Edit Food Dialog */}
      <Dialog open={editFoodDialogOpen} onClose={handleCloseEditFoodDialog}>
        <DialogTitle>Edit Food</DialogTitle>
        <DialogContent>
          <Autocomplete
            openOnFocus
            includeInputInList
            options={foodOptions}
            value={selectedFood}
            onChange={handleFoodSelect}
            inputValue={foodSearchValue}
            onInputChange={(event, newInputValue) => setFoodSearchValue(newInputValue)}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Food Name" 
                variant="outlined" 
                fullWidth 
                margin="dense" 
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {foodDetailsLoading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          <TextField
            label="Quantity"
            variant="outlined"
            fullWidth
            margin="dense"
            value={editedFood.quantity}
            onChange={handleQuantityChange}
          />
          <TextField
            label="Calories"
            variant="outlined"
            fullWidth
            margin="dense"
            value={editedFood.calories}
            disabled
          />
          <TextField
            label="Protein"
            variant="outlined"
            fullWidth
            margin="dense"
            value={editedFood.protein}
            disabled
          />
          <TextField
            label="Carbs"
            variant="outlined"
            fullWidth
            margin="dense"
            value={editedFood.carbs}
            disabled
          />
          <TextField
            label="Fats"
            variant="outlined"
            fullWidth
            margin="dense"
            value={editedFood.fats}
            disabled
          />
          <TextField
            label="Fiber"
            variant="outlined"
            fullWidth
            margin="dense"
            value={editedFood.fiber}
            disabled
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditFoodDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveEditedFood} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{foodToDelete.foodName}</strong> from this meal?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteFood} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Save Feedback Snackbar - Modified to ensure visibility */}
      <Snackbar 
        open={saveSnackbarOpen} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ 
          zIndex: 9999,
          position: 'fixed',
          bottom: { xs: '80px', md: '20px' } // Ensure it's visible on mobile devices
        }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={saveSnackbarSeverity} 
          sx={{ 
            width: '100%', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontWeight: 'medium',
            fontSize: '1rem'
          }}
          variant="filled"
        >
          {saveSnackbarMessage}
        </Alert>
      </Snackbar>

      {/* Print Dialog */}
      <Dialog 
        open={printDialogOpen} 
        onClose={() => setPrintDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Print Diet Chart
        </DialogTitle>
        <DialogContent dividers>
          {printDialogOpen && (
            <iframe
              title="Diet Chart Table Print Preview"
              style={{
                width: '100%',
                height: '70vh',
                border: '1px solid #ddd',
                borderRadius: 4,
                backgroundColor: '#fff'
              }}
              srcDoc={`
                <!DOCTYPE html>
                <html>
                <head>
                  <title>Diet Chart Print</title>
                  <style>
                    body {
                      font-family: Arial, sans-serif;
                      padding: 20px;
                      margin: 0;
                      color: #333;
                    }
                    h1, h2 {
                      color: #2e7d32;
                    }
                    .meal-title {
                      margin-top: 20px;
                      margin-bottom: 10px;
                      font-size: 16pt;
                      font-weight: bold;
                      border-bottom: 1px solid #333;
                    }
                    table {
                      width: 100%;
                      border-collapse: collapse;
                      margin-bottom: 20px;
                    }
                    th, td {
                      border: 1px solid #ddd;
                      padding: 8px;
                      text-align: center;
                    }
                    th {
                      background-color: #f5f5f5;
                      font-weight: bold;
                    }
                    tr:nth-child(even) {
                      background-color: #f9f9f9;
                    }
                    .food-name {
                      text-align: left;
                      padding-left: 15px;
                    }
                    .print-header {
                      text-align: center;
                      margin-bottom: 20px;
                    }
                    .print-header h1 {
                      font-size: 20pt;
                      margin-bottom: 5px;
                    }
                    .print-date {
                      font-style: italic;
                      font-size: 10pt;
                      margin-bottom: 20px;
                    }
                    .total-nutrients {
                      margin-top: 30px;
                      font-weight: bold;
                    }
                    .meal-totals {
                      font-weight: bold;
                      background-color: #f5f5f5;
                    }
                    .total-label {
                      text-align: right;
                      padding-right: 15px;
                    }
                    @media print {
                      body {
                        padding: 0;
                      }
                      button {
                        display: none;
                      }
                    }
                  </style>
                </head>
                <body>
                  <div class="print-header">
                    <h1>Diet Plan - Meal Chart</h1>
                    <p class="print-date">Generated on ${new Date().toLocaleDateString()}</p>
                  </div>
                  
                  ${mealOrder.map(mealKey => `
                    <div>
                      <h2 class="meal-title">${mealDisplayNames[mealKey] || mealKey}</h2>
                      <table>
                        <thead>
                          <tr>
                            <th>Food Item</th>
                            <th>Quantity</th>
                            <th>Calories</th>
                            <th>Protein (g)</th>
                            <th>Carbs (g)</th>
                            <th>Fats (g)</th>
                            <th>Fiber (g)</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${userMealPlan[mealKey] && userMealPlan[mealKey].length > 0 ? 
                            userMealPlan[mealKey].map(food => `
                              <tr>
                                <td class="food-name">${food.name}</td>
                                <td>${food.quantity}</td>
                                <td>${food.calories}</td>
                                <td>${food.protein.toFixed(1)}</td>
                                <td>${food.carbs.toFixed(1)}</td>
                                <td>${food.fats.toFixed(1)}</td>
                                <td>${food.fiber?.toFixed(1) || '0.0'}</td>
                              </tr>
                            `).join('') : 
                            `<tr><td colspan="7" style="text-align:center">No food items added</td></tr>`
                          }
                          ${userMealPlan[mealKey] && userMealPlan[mealKey].length > 0 ? 
                            (() => {
                              const mealNutrients = calculateMealNutrients(mealKey);
                              return `
                                <tr class="meal-totals">
                                  <td colspan="2" class="total-label">Meal Totals:</td>
                                  <td>${mealNutrients.calories}</td>
                                  <td>${mealNutrients.protein.toFixed(1)}</td>
                                  <td>${mealNutrients.carbs.toFixed(1)}</td>
                                  <td>${mealNutrients.fats.toFixed(1)}</td>
                                  <td>${mealNutrients.fiber.toFixed(1)}</td>
                                </tr>
                              `;
                            })() : ''
                          }
                        </tbody>
                      </table>
                    </div>
                  `).join('')}
                  
                  <h2 class="meal-title">Total Daily Nutrients</h2>
                  <table class="total-nutrients">
                    <thead>
                      <tr>
                        <th>Total Calories</th>
                        <th>Total Protein (g)</th>
                        <th>Total Carbs (g)</th>
                        <th>Total Fats (g)</th>
                        <th>Total Fiber (g)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>${totalCalories}</td>
                        <td>${totalProtein.toFixed(1)}</td>
                        <td>${totalCarbs.toFixed(1)}</td>
                        <td>${totalFats.toFixed(1)}</td>
                        <td>${totalFiber.toFixed(1)}</td>
                      </tr>
                    </tbody>
                  </table>
                </body>
                </html>
              `}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPrintDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button 
            onClick={() => {
              // Get the iframe element
              const iframe = document.querySelector('iframe');
              if (iframe) {
                // We need to ensure the iframe is completely loaded
                setTimeout(() => {
                  try {
                    // Get the iframe's window
                    const iframeWindow = iframe.contentWindow;
                    
                    // Trigger print directly on the iframe window
                    iframeWindow.print();
                    
                    // Close the dialog after print dialog appears
                    setTimeout(() => setPrintDialogOpen(false), 500);
                  } catch (err) {
                    console.error("Print error:", err);
                    // Fallback to window.print() if iframe print fails
                    window.print();
                  }
                }, 1000); // Longer delay to ensure iframe content is fully loaded
              }
            }} 
            color="primary"
            variant="contained"
            startIcon={<PrintIcon />}
          >
            Print
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DietChart;