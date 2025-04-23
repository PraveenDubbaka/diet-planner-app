import React, { useState, useContext, useEffect, useCallback, useMemo, useRef } from 'react';
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
  CircularProgress,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DietHistoryList from './DietHistoryList';
import DietChart from './DietChart';
import BMICalculator from './BMICalculator';
import { UserContext } from '../contexts/UserContext';

const UserDashboard = () => {
  const { userData, dietCharts, deleteDietChart, loadUserDietCharts, isLoadingCharts } = useContext(UserContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Create the ref at component level, not inside useEffect
  const hasInitiallyLoaded = useRef(false);
  
  // State for viewing saved diet chart
  const [selectedChart, setSelectedChart] = useState(null);
  const [viewChartDialogOpen, setViewChartDialogOpen] = useState(false);
  
  // Tabs state
  const [currentTab, setCurrentTab] = useState(0);

  // Debug: log dietCharts to verify they're loading - MOVED THIS HERE to maintain hook order
  useEffect(() => {
    console.log('Diet history data in Dashboard:', dietCharts);
  }, [dietCharts]);

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
  
  const handleTabChange = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  // Reload diet history when switching to History tab, with protection against infinite loops
  useEffect(() => {
    if (currentTab === 2 && userData?.uid) {
      // Only load if we haven't already loaded for this tab selection
      if (!hasInitiallyLoaded.current) {
        console.log("Diet History tab selected, loading charts for user:", userData.uid);
        
        // Mark that we've started loading
        hasInitiallyLoaded.current = true;
        
        // Use a small delay to avoid any state update race conditions
        const loadTimer = setTimeout(() => {
          loadUserDietCharts(userData.uid)
            .then(() => console.log("Diet charts reload complete"))
            .catch(err => console.error("Error reloading diet charts:", err));
        }, 300);
        
        return () => clearTimeout(loadTimer);
      }
    } else {
      // Reset the loading flag when we switch away from tab 2
      hasInitiallyLoaded.current = false;
    }
    
    // No cleanup needed if we didn't set a timer
    return undefined;
  }, [currentTab, userData?.uid, loadUserDietCharts]);
  
  // Separate effect for debugging only - now safe because it doesn't have conditional hook calls
  useEffect(() => {
    // Only log if we're on the diet history tab
    if (currentTab === 2) {
      console.log('Diet charts data updated:', dietCharts?.length || 0, 'charts');
    }
  }, [dietCharts, currentTab]);
  
  const handleViewChart = useCallback((chart) => {
    setSelectedChart(chart);
    setViewChartDialogOpen(true);
  }, []);
  
  const handleCloseViewDialog = useCallback(() => {
    setViewChartDialogOpen(false);
  }, []);

  const handleDeleteChart = useCallback((chartId, allChartIds) => {
    // Bulk delete all saved charts at once
    if (chartId === "DELETE_ALL" && Array.isArray(allChartIds)) {
      deleteDietChart("DELETE_ALL", allChartIds);
    } else {
      // Single chart deletion
      deleteDietChart(chartId);
    }
  }, [deleteDietChart]);
  
  const handleGoToProfile = useCallback(() => {
    navigate('/profile');
  }, [navigate]);
  
  // Mobile-optimized styling for main dashboard paper - no left/right padding
  const paperSx = useMemo(() => isMobile 
    ? { 
        p: { xs: 1, sm: 2 }, // Less padding on mobile, more on tablet
        px: 0,               // Remove left/right padding
        pt: 1,               // Small top padding
        pb: 2,               // Small bottom padding
        borderRadius: { xs: 0, sm: 2 }, // No border radius on mobile 
        mb: 3,
        boxShadow: 1,        // Lighter shadow on mobile
        width: '100%'        // Use full width
      } 
    : { 
        p: 3, 
        borderRadius: 2, 
        mb: 3 
      }, [isMobile]);

  // Safe access to user properties - MOVED UP before conditional returns to maintain hook order
  const renderSafely = useCallback((property, formatter = (val) => val) => {
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
  }, [userData]);

  if (isLoading) {
    return (
      <Paper elevation={isMobile ? 1 : 3} sx={paperSx}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }
  
  if (!userData) {
    return (
      <Paper elevation={isMobile ? 1 : 3} sx={paperSx}>
        <Typography variant="h6" align="center">
          Please complete your profile to view your dashboard
        </Typography>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper elevation={isMobile ? 1 : 3} sx={paperSx}>
        <Typography variant="h6" align="center" color="error" gutterBottom>
          {error}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleGoToProfile}>
            Go to Profile
          </Button>
        </Box>
      </Paper>
    );
  }
  
  return (
    <>
      <Paper elevation={isMobile ? 1 : 3} sx={paperSx}>
        <Typography variant="h5" gutterBottom sx={{ mb: isMobile ? 2 : 3, px: isMobile ? 2 : 0 }}>
          Your Dashboard
        </Typography>
        
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange} 
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="Dashboard navigation tabs"
          indicatorColor="primary"
          textColor="primary"
          sx={{ 
            mb: isMobile ? 2 : 3, 
            px: 0,
            width: '100%',
            '& .MuiTabs-flexContainer': {
              justifyContent: isMobile ? 'flex-start' : 'center',
            },
            '& .MuiTab-root': {
              minWidth: isMobile ? '80px' : '120px',
              px: isMobile ? 1 : 2,
              fontSize: isMobile ? '0.8rem' : 'inherit'
            }
          }}
        >
          <Tab label="Overview" />
          <Tab label="Diet Generator" />
          <Tab label="Diet History" />
          <Tab label="BMI Calculator" />
        </Tabs>
        
        {currentTab === 0 && (
          <Box sx={{ px: 0 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3, px: 0 }}>
              Profile Overview
            </Typography>
            
            <Grid 
              container 
              spacing={isMobile ? 3 : 4} 
              sx={{ 
                width: '100%', 
                mx: 0,
                pl: 0,
                mb: 3,
                '& > .MuiGrid-item': {
                  paddingLeft: '0px !important', // Override Material UI's padding with !important
                  mb: isMobile ? 3 : 4
                }
              }}
            >
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', ml: 0, mr: isMobile ? 0 : 2 }}>
                  <CardContent sx={{ p: isMobile ? 2.5 : 3, pr: isMobile ? 2.5 : 4 }}>
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
                  <CardContent sx={{ p: isMobile ? 2.5 : 3 }}>
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
          <Box sx={{ px: isMobile ? 0 : 0 }}>
            <DietChart userData={userData} />
          </Box>
        )}
        
        {currentTab === 2 && (
          <Box sx={{ px: isMobile ? 0 : 0 }}>
            {isLoadingCharts ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <DietHistoryList 
                dietCharts={dietCharts || []}
                onViewChart={handleViewChart}
                onDeleteChart={handleDeleteChart}
              />
            )}
          </Box>
        )}
        
        {currentTab === 3 && (
          <Box sx={{ px: isMobile ? 0 : 0 }}>
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
        fullScreen={isMobile}
      >
        <DialogTitle>
          Diet Plan - {selectedChart ? new Date(selectedChart.date).toLocaleDateString() : ''}
        </DialogTitle>
        <DialogContent dividers>
          {selectedChart && selectedChart.data && selectedChart.data.mealPlan && (
            <Box>
              {Object.keys(selectedChart.data.mealPlan).map((mealKey) => {
                const mealName = (() => {
                  // Try to get display name from mealDisplayNames
                  if (selectedChart.data.mealDisplayNames && selectedChart.data.mealDisplayNames[mealKey]) {
                    return selectedChart.data.mealDisplayNames[mealKey];
                  }
                  
                  // Fall back to standard meal names
                  const standardMealNames = {
                    breakfast: 'Breakfast',
                    morningSnack: 'Morning Snack',
                    lunch: 'Lunch',
                    afternoonSnack: 'Afternoon Snack',
                    dinner: 'Dinner',
                    eveningSnack: 'Evening Snack',
                    postWorkout: 'Post-Workout'
                  };
                  
                  if (standardMealNames[mealKey]) {
                    return standardMealNames[mealKey];
                  }
                  
                  // Last resort: format the key itself
                  return mealKey.charAt(0).toUpperCase() + mealKey.slice(1).replace(/([A-Z])/g, ' $1').replace(/_/g, ' ');
                })();
                
                return (
                  <Box key={mealKey} sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      {mealName}
                    </Typography>
                    
                    {selectedChart.data.mealPlan[mealKey].length > 0 ? (
                      <Grid container spacing={2}>
                        {selectedChart.data.mealPlan[mealKey].map((food, index) => (
                          <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card variant="outlined">
                              <CardContent>
                                <Typography variant="subtitle1">{food.name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {food.quantity || ''}
                                </Typography>
                                <Divider sx={{ my: 1 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Typography variant="body2">Cal: {food.calories || 0}</Typography>
                                  <Typography variant="body2">P: {(food.protein || 0).toFixed(1)}g</Typography>
                                  <Typography variant="body2">C: {(food.carbs || 0).toFixed(1)}g</Typography>
                                  <Typography variant="body2">F: {(food.fats || 0).toFixed(1)}g</Typography>
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
                );
              })}
              
              {/* Render total nutrients */}
              {selectedChart.data.totalNutrients && (
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
                            {selectedChart.data.totalNutrients.totalCalories || 0}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={6} sm={4} md={2.4}>
                      <Card variant="outlined" sx={{ textAlign: 'center' }}>
                        <CardContent>
                          <Typography variant="body2" color="text.secondary">Protein</Typography>
                          <Typography variant="h6">
                            {(selectedChart.data.totalNutrients.totalProtein || 0).toFixed(1)}g
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={6} sm={4} md={2.4}>
                      <Card variant="outlined" sx={{ textAlign: 'center' }}>
                        <CardContent>
                          <Typography variant="body2" color="text.secondary">Carbs</Typography>
                          <Typography variant="h6">
                            {(selectedChart.data.totalNutrients.totalCarbs || 0).toFixed(1)}g
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={6} sm={4} md={2.4}>
                      <Card variant="outlined" sx={{ textAlign: 'center' }}>
                        <CardContent>
                          <Typography variant="body2" color="text.secondary">Fats</Typography>
                          <Typography variant="h6">
                            {(selectedChart.data.totalNutrients.totalFats || 0).toFixed(1)}g
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={6} sm={4} md={2.4}>
                      <Card variant="outlined" sx={{ textAlign: 'center' }}>
                        <CardContent>
                          <Typography variant="body2" color="text.secondary">Fiber</Typography>
                          <Typography variant="h6">
                            {(selectedChart.data.totalNutrients.totalFiber || 0).toFixed(1)}g
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          )}
          
          {(!selectedChart || !selectedChart.data || !selectedChart.data.mealPlan) && (
            <Typography variant="body1" color="error" align="center" sx={{ py: 4 }}>
              Diet plan data not available or in an unexpected format.
            </Typography>
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