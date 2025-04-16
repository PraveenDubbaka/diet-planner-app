import React, { useState, useContext, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent,
  Divider,
  Tab,
  Tabs,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import DietHistoryList from './DietHistoryList';
import DietChart from './DietChart';
import BMICalculator from './BMICalculator';
import { UserContext } from '../contexts/UserContext';

const UserDashboard = () => {
  const { userData, dietCharts, deleteDietChart } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for viewing saved diet chart
  const [selectedChart, setSelectedChart] = useState(null);
  const [viewChartDialogOpen, setViewChartDialogOpen] = useState(false);
  
  // Tabs state
  const [currentTab, setCurrentTab] = useState(0);

  // Add loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);
  
  // Verify userData has required properties
  useEffect(() => {
    if (userData && !isLoading) {
      try {
        // Check for required properties
        if (!userData.name || !userData.height || !userData.weight || 
            !userData.gender || !userData.age || !userData.activityLevel || 
            !userData.goal || !userData.bmi || !userData.bmr || 
            !userData.calorieNeeds || !userData.macros) {
          
          setError('Profile data is incomplete. Please update your profile information.');
        } else {
          setError(null);
        }
      } catch (err) {
        console.error('Error validating user data:', err);
        setError('There was a problem loading your profile. Please try refreshing or updating your profile.');
      }
    }
  }, [userData, isLoading]);
  
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  
  const handleViewChart = (chart) => {
    setSelectedChart(chart);
    setViewChartDialogOpen(true);
  };
  
  const handleCloseViewDialog = () => {
    setViewChartDialogOpen(false);
  };

  const handleDeleteChart = (chartId) => {
    deleteDietChart(chartId);
  };
  
  if (isLoading) {
    return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <CircularProgress />
      </Paper>
    );
  }
  
  if (!userData) {
    return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" align="center">
          Please complete your profile to view your dashboard
        </Typography>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" align="center" color="error" gutterBottom>
          {error}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button variant="contained" color="primary" href="/profile">
            Go to Profile
          </Button>
        </Box>
      </Paper>
    );
  }
  
  // Safe access to user properties
  const renderSafely = (property, formatter = (val) => val) => {
    try {
      const props = property.split('.');
      let value = userData;
      
      for (const prop of props) {
        value = value[prop];
        if (value === undefined || value === null) {
          return 'Not available';
        }
      }
      
      return formatter(value);
    } catch (e) {
      console.error('Error rendering property:', e);
      return 'Not available';
    }
  };

  return (
    <>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Your Dashboard
        </Typography>
        
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange} 
          variant="fullWidth" 
          indicatorColor="primary"
          textColor="primary"
          sx={{ mb: 3 }}
        >
          <Tab label="Overview" />
          <Tab label="Diet Generator" />
          <Tab label="Diet History" />
          <Tab label="BMI Calculator" />
        </Tabs>
        
        {currentTab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Profile Overview
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle1" color="primary" gutterBottom>
                      Personal Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Box sx={{ display: 'flex', mb: 1.5 }}>
                      <Typography variant="body2" sx={{ minWidth: 120, fontWeight: 'bold' }}>
                        Name:
                      </Typography>
                      <Typography variant="body2">
                        {renderSafely('name')}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', mb: 1.5 }}>
                      <Typography variant="body2" sx={{ minWidth: 120, fontWeight: 'bold' }}>
                        Age:
                      </Typography>
                      <Typography variant="body2">
                        {renderSafely('age', (val) => `${val} years`)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', mb: 1.5 }}>
                      <Typography variant="body2" sx={{ minWidth: 120, fontWeight: 'bold' }}>
                        Gender:
                      </Typography>
                      <Typography variant="body2">
                        {renderSafely('gender', (val) => val === 'male' ? 'Male' : 'Female')}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', mb: 1.5 }}>
                      <Typography variant="body2" sx={{ minWidth: 120, fontWeight: 'bold' }}>
                        Height:
                      </Typography>
                      <Typography variant="body2">
                        {renderSafely('height', (val) => {
                          const feet = renderSafely('feet');
                          const inches = renderSafely('inches');
                          return feet !== 'Not available' && inches !== 'Not available' 
                            ? `${feet}'${inches}" (${Math.round(val)} cm)` 
                            : `${Math.round(val)} cm`;
                        })}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', mb: 1.5 }}>
                      <Typography variant="body2" sx={{ minWidth: 120, fontWeight: 'bold' }}>
                        Weight:
                      </Typography>
                      <Typography variant="body2">
                        {renderSafely('weight', (val) => `${val} kg`)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', mb: 1.5 }}>
                      <Typography variant="body2" sx={{ minWidth: 120, fontWeight: 'bold' }}>
                        Activity Level:
                      </Typography>
                      <Typography variant="body2">
                        {renderSafely('activityLevel', (val) => {
                          switch(val) {
                            case 'sedentary': return 'Sedentary (little or no exercise)';
                            case 'light': return 'Lightly active (light exercise 1-3 days/week)';
                            case 'moderate': return 'Moderately active (moderate exercise 3-5 days/week)';
                            case 'active': return 'Very active (hard exercise 6-7 days/week)';
                            case 'veryActive': return 'Extra active (very hard exercise & physical job)';
                            default: return val;
                          }
                        })}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle1" color="primary" gutterBottom>
                      Diet & Nutrition
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Box sx={{ display: 'flex', mb: 1.5 }}>
                      <Typography variant="body2" sx={{ minWidth: 120, fontWeight: 'bold' }}>
                        Goal:
                      </Typography>
                      <Typography variant="body2">
                        {renderSafely('goal', (val) => {
                          switch(val) {
                            case 'lose': return 'Lose Fat';
                            case 'maintain': return 'Maintain Muscle';
                            case 'gain': return 'Gain Muscle';
                            default: return val;
                          }
                        })}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', mb: 1.5 }}>
                      <Typography variant="body2" sx={{ minWidth: 120, fontWeight: 'bold' }}>
                        Diet Type:
                      </Typography>
                      <Typography variant="body2">
                        {renderSafely('dietType', (val) => 
                          val ? val.charAt(0).toUpperCase() + val.slice(1).replace(/([A-Z])/g, ' $1') : 'Standard'
                        )}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', mb: 1.5 }}>
                      <Typography variant="body2" sx={{ minWidth: 120, fontWeight: 'bold' }}>
                        Gluten Free:
                      </Typography>
                      <Typography variant="body2">
                        {renderSafely('isGlutenFree', (val) => val ? 'Yes' : 'No')}
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="subtitle1" color="primary" gutterBottom>
                      Calculated Values
                    </Typography>
                    
                    <Box sx={{ display: 'flex', mb: 1.5 }}>
                      <Typography variant="body2" sx={{ minWidth: 120, fontWeight: 'bold' }}>
                        BMI:
                      </Typography>
                      <Typography variant="body2">
                        {renderSafely('bmi', (val) => {
                          // Convert to number if it's a string, then format
                          const bmiValue = typeof val === 'string' ? parseFloat(val) : val;
                          return `${bmiValue.toFixed(1)} kg/m²`;
                        })}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', mb: 1.5 }}>
                      <Typography variant="body2" sx={{ minWidth: 120, fontWeight: 'bold' }}>
                        BMR:
                      </Typography>
                      <Typography variant="body2">
                        {renderSafely('bmr', (val) => `${val} calories/day`)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', mb: 1.5 }}>
                      <Typography variant="body2" sx={{ minWidth: 120, fontWeight: 'bold' }}>
                        Daily Calories:
                      </Typography>
                      <Typography variant="body2">
                        {renderSafely('calorieNeeds', (val) => `${val} calories`)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', mb: 1.5 }}>
                      <Typography variant="body2" sx={{ minWidth: 120, fontWeight: 'bold' }}>
                        Protein:
                      </Typography>
                      <Typography variant="body2">
                        {renderSafely('macros.protein', (val) => `${val}g per day`)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', mb: 1.5 }}>
                      <Typography variant="body2" sx={{ minWidth: 120, fontWeight: 'bold' }}>
                        Carbs:
                      </Typography>
                      <Typography variant="body2">
                        {renderSafely('macros.carbs', (val) => `${val}g per day`)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', mb: 1.5 }}>
                      <Typography variant="body2" sx={{ minWidth: 120, fontWeight: 'bold' }}>
                        Fats:
                      </Typography>
                      <Typography variant="body2">
                        {renderSafely('macros.fats', (val) => `${val}g per day`)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
        
        {currentTab === 1 && (
          <Box>
            <DietChart userData={userData} />
          </Box>
        )}
        
        {currentTab === 2 && (
          <Box>
            <DietHistoryList dietCharts={dietCharts || []} onViewChart={handleViewChart} onDeleteChart={handleDeleteChart} />
          </Box>
        )}
        
        {currentTab === 3 && (
          <Box>
            <BMICalculator 
              initialHeight={userData?.height || 170} 
              initialWeight={userData?.weight || 70} 
            />
          </Box>
        )}
      </Paper>
      
      {/* Diet Chart View Dialog */}
      <Dialog 
        open={viewChartDialogOpen} 
        onClose={handleCloseViewDialog}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>
          Diet Plan - {selectedChart ? new Date(selectedChart.date).toLocaleDateString() : ''}
        </DialogTitle>
        <DialogContent dividers>
          {selectedChart && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Diet Type: {selectedChart.dietType.charAt(0).toUpperCase() + selectedChart.dietType.slice(1).replace(/([A-Z])/g, ' $1')}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Goal: {selectedChart.goal === 'lose' ? 'Lose Fat' : selectedChart.goal === 'maintain' ? 'Maintain Muscle' : 'Gain Muscle'}
              </Typography>
              {selectedChart.isGlutenFree && (
                <Typography variant="subtitle1" gutterBottom>
                  Gluten-Free: Yes
                </Typography>
              )}
              
              <Divider sx={{ my: 2 }} />
              
              {/* Display saved diet chart */}
              {selectedChart.data && (
                <Box sx={{ mt: 2 }}>
                  {/* Render meal plan */}
                  {selectedChart.data.mealPlan && Object.keys(selectedChart.data.mealPlan).map((mealKey) => (
                    <Box key={mealKey} sx={{ mb: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        {selectedChart.data.mealDisplayNames && selectedChart.data.mealDisplayNames[mealKey] ? 
                          selectedChart.data.mealDisplayNames[mealKey] : 
                          mealKey.charAt(0).toUpperCase() + mealKey.slice(1).replace(/([A-Z])/g, ' $1')}
                      </Typography>
                      
                      {selectedChart.data.mealPlan[mealKey].length > 0 ? (
                        <Grid container spacing={2}>
                          {selectedChart.data.mealPlan[mealKey].map((food, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                              <Card variant="outlined">
                                <CardContent>
                                  <Typography variant="subtitle1">{food.name}</Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {food.quantity}
                                  </Typography>
                                  <Divider sx={{ my: 1 }} />
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2">Calories: {food.calories}</Typography>
                                    <Typography variant="body2">P: {food.protein}g</Typography>
                                    <Typography variant="body2">C: {food.carbs}g</Typography>
                                    <Typography variant="body2">F: {food.fats}g</Typography>
                                  </Box>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No foods in this meal
                        </Typography>
                      )}
                    </Box>
                  ))}
                  
                  {/* Render total nutrients */}
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Total Nutrients
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={4} md={2.4}>
                        <Card variant="outlined" sx={{ textAlign: 'center' }}>
                          <CardContent>
                            <Typography variant="body2" color="text.secondary">Calories</Typography>
                            <Typography variant="h6">
                              {selectedChart.data.totalNutrients?.totalCalories || 0}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={6} sm={4} md={2.4}>
                        <Card variant="outlined" sx={{ textAlign: 'center' }}>
                          <CardContent>
                            <Typography variant="body2" color="text.secondary">Protein</Typography>
                            <Typography variant="h6">
                              {(selectedChart.data.totalNutrients?.totalProtein || 0).toFixed(1)}g
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={6} sm={4} md={2.4}>
                        <Card variant="outlined" sx={{ textAlign: 'center' }}>
                          <CardContent>
                            <Typography variant="body2" color="text.secondary">Carbs</Typography>
                            <Typography variant="h6">
                              {(selectedChart.data.totalNutrients?.totalCarbs || 0).toFixed(1)}g
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={6} sm={4} md={2.4}>
                        <Card variant="outlined" sx={{ textAlign: 'center' }}>
                          <CardContent>
                            <Typography variant="body2" color="text.secondary">Fats</Typography>
                            <Typography variant="h6">
                              {(selectedChart.data.totalNutrients?.totalFats || 0).toFixed(1)}g
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={6} sm={4} md={2.4}>
                        <Card variant="outlined" sx={{ textAlign: 'center' }}>
                          <CardContent>
                            <Typography variant="body2" color="text.secondary">Fiber</Typography>
                            <Typography variant="h6">
                              {(selectedChart.data.totalNutrients?.totalFiber || 0).toFixed(1)}g
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserDashboard;