import React, { useState, useEffect, useContext } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  TextField,
  InputAdornment,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  LinearProgress,
  Snackbar,
  Alert,
  useTheme
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { calculateBMI, getBMICategory } from '../utils/calculations';
import { UserContext } from '../contexts/UserContext';

const BMICalculator = ({ initialHeight, initialWeight }) => {
  const theme = useTheme();
  const { userData, updateUserData } = useContext(UserContext);
  
  // State for metric units
  const [height, setHeight] = useState(initialHeight || 170);
  const [weight, setWeight] = useState(initialWeight || 70);
  
  // State for imperial units
  const [feet, setFeet] = useState(5);
  const [inches, setInches] = useState(7);
  const [pounds, setPounds] = useState(154);
  
  // Display state
  const [unitSystem, setUnitSystem] = useState('metric'); // 'metric' or 'imperial'
  const [bmi, setBmi] = useState(0);
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  
  // Convert between unit systems
  useEffect(() => {
    if (unitSystem === 'metric') {
      // Convert imperial to metric when switching to metric
      if (feet && inches) {
        const totalInches = (feet * 12) + parseInt(inches || 0);
        setHeight(Math.round(totalInches * 2.54)); // inches to cm
      }
      if (pounds) {
        setWeight(Math.round(pounds / 2.2046)); // pounds to kg
      }
    } else {
      // Convert metric to imperial when switching to imperial
      if (height) {
        const totalInches = height / 2.54;
        setFeet(Math.floor(totalInches / 12));
        setInches(Math.round(totalInches % 12));
      }
      if (weight) {
        setPounds(Math.round(weight * 2.2046)); // kg to pounds
      }
    }
  }, [unitSystem]);
  
  // Calculate BMI when weight/height change
  useEffect(() => {
    if (unitSystem === 'metric' && height && weight) {
      const calculatedBMI = calculateBMI(weight, height);
      setBmi(calculatedBMI);
    } else if (unitSystem === 'imperial' && feet && pounds) {
      // Imperial BMI calculation: (weight in pounds) × 703 / (height in inches)²
      const heightInInches = (feet * 12) + parseInt(inches || 0);
      const imperialBMI = (pounds * 703) / (heightInInches * heightInInches);
      setBmi(parseFloat(imperialBMI.toFixed(1)));
    }
  }, [height, weight, feet, inches, pounds, unitSystem]);
  
  // Update category based on BMI
  useEffect(() => {
    if (bmi > 0) {
      const bmiCategory = getBMICategory(bmi);
      setCategory(bmiCategory.category);
      setColor(bmiCategory.color);
    }
  }, [bmi]);
  
  // Create a scale for the BMI progress bar (normal BMI range is 18.5-24.9)
  const getBMIPercentage = () => {
    // Scale from 15 to 40 as practical min/max BMI values
    const minBMI = 15;
    const maxBMI = 40;
    const range = maxBMI - minBMI;
    const percentage = ((bmi - minBMI) / range) * 100;
    return Math.min(Math.max(percentage, 0), 100); // Clamp between 0-100
  };
  
  const handleUnitSystemChange = (event) => {
    setUnitSystem(event.target.value);
  };
  
  const handleHeightChange = (event) => {
    setHeight(event.target.value);
  };
  
  const handleWeightChange = (event) => {
    setWeight(event.target.value);
  };
  
  const handleFeetChange = (event) => {
    setFeet(event.target.value);
  };
  
  const handleInchesChange = (event) => {
    setInches(event.target.value);
  };
  
  const handlePoundsChange = (event) => {
    setPounds(event.target.value);
  };
  
  const handleSaveBMI = () => {
    // Only update if we have userData
    if (userData) {
      const updatedUserData = {
        ...userData,
        bmi,
        weight: unitSystem === 'metric' ? weight : Math.round(pounds / 2.2046),
        height: unitSystem === 'metric' ? height : Math.round(((feet * 12) + parseInt(inches || 0)) * 2.54)
      };
      
      if (unitSystem === 'imperial') {
        updatedUserData.feet = feet;
        updatedUserData.inches = inches;
      }
      
      updateUserData(updatedUserData);
      setShowSaveSuccess(true);
    }
  };
  
  const handleCloseSnackbar = () => {
    setShowSaveSuccess(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, color: theme.palette.primary.main, fontWeight: 'medium' }}>
        BMI Calculator
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" gutterBottom>
          Body mass index (BMI) estimates how healthy your weight is based on your height. There's no "perfect weight" that fits everyone, 
          but BMI can help most adults understand their weight-related health risks.
        </Typography>
      </Box>
      
      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
            Calculate Your BMI
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            {/* Unit System Selector */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="unit-system-label">Units</InputLabel>
                <Select
                  labelId="unit-system-label"
                  id="unit-system"
                  value={unitSystem}
                  label="Units"
                  onChange={handleUnitSystemChange}
                >
                  <MenuItem value="metric">Metric (cm, kg)</MenuItem>
                  <MenuItem value="imperial">Imperial (ft/in, lbs)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {unitSystem === 'metric' ? (
              <>
                {/* Metric Units */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="height"
                    label="Height"
                    type="number"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                    }}
                    value={height}
                    onChange={handleHeightChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="weight"
                    label="Weight"
                    type="number"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                    }}
                    value={weight}
                    onChange={handleWeightChange}
                  />
                </Grid>
              </>
            ) : (
              <>
                {/* Imperial Units - WebMD Style */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Height*
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      id="feet"
                      label="ft"
                      type="number"
                      InputProps={{
                        inputProps: { min: 1, max: 8 }
                      }}
                      value={feet}
                      onChange={handleFeetChange}
                      sx={{ width: '48%' }}
                    />
                    <TextField
                      id="inches"
                      label="in"
                      type="number"
                      InputProps={{
                        inputProps: { min: 0, max: 11 }
                      }}
                      value={inches}
                      onChange={handleInchesChange}
                      sx={{ width: '48%' }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Weight*
                  </Typography>
                  <TextField
                    fullWidth
                    id="pounds"
                    label="lbs"
                    type="number"
                    value={pounds}
                    onChange={handlePoundsChange}
                  />
                </Grid>
              </>
            )}
            
            <Grid item xs={12}>
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                size="large"
                sx={{ mt: 2, py: 1.5, fontWeight: 'bold' }}
              >
                Calculate
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {/* Results Section */}
      {bmi > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
              Your BMI Results
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
              <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold', color }}>
                {bmi.toFixed(1)}
              </Typography>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium', color, mb: 2 }}>
                {category}
              </Typography>
              
              <Box sx={{ width: '100%', mb: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={getBMIPercentage()} 
                  sx={{ 
                    height: 16, 
                    borderRadius: 8,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: color,
                    }
                  }} 
                />
              </Box>
              
              <Grid container sx={{ width: '100%', mt: 1, justifyContent: 'space-between' }}>
                <Grid item>
                  <Typography variant="body2" color="text.secondary">Underweight</Typography>
                  <Typography variant="caption" color="text.secondary">Below 18.5</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2" color="text.secondary">Normal</Typography>
                  <Typography variant="caption" color="text.secondary">18.5-24.9</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2" color="text.secondary">Overweight</Typography>
                  <Typography variant="caption" color="text.secondary">25-29.9</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2" color="text.secondary">Obesity</Typography>
                  <Typography variant="caption" color="text.secondary">30+</Typography>
                </Grid>
              </Grid>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button 
                variant="contained" 
                color="secondary" 
                startIcon={<SaveIcon />}
                onClick={handleSaveBMI}
                sx={{ fontWeight: 'medium' }}
              >
                Save Results
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
      
      {/* BMI Information Section */}
      <Box>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
          What Does My BMI Number Mean?
        </Typography>
        
        <Typography variant="body2" paragraph>
          Body mass index (BMI) is a measure of your weight relative to your height. For all adults 20 years old and older, 
          the BMI measurement is classified into one of four main weight categories:
        </Typography>
        
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <strong>Below 18.5:</strong> Underweight
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <strong>18.5 – 24.9:</strong> Healthy Weight
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <strong>25.0 – 29.9:</strong> Overweight
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <strong>30.0 and above:</strong> Obesity
          </Typography>
        </Box>
        
        <Typography variant="body2" paragraph sx={{ mt: 2 }}>
          People of Asian descent may have greater health risks at a lower BMI. People in this group may be placed in the overweight range 
          if their BMI is between 23 and 25 and may have obesity if their BMI is 25 or greater.
        </Typography>
        
        <Typography variant="body2" paragraph>
          BMI can't tell you if you're healthy or not or diagnose you with any condition. Talk with your doctor about your weight 
          and your BMI. They can help you understand it as part of the bigger picture of your health.
        </Typography>
      </Box>
      
      <Snackbar open={showSaveSuccess} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          BMI results successfully saved to your profile!
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default BMICalculator;