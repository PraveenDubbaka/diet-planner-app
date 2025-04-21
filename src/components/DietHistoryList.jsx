import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Divider,
  Grid,
  Paper,
  Chip
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  Print as PrintIcon,
  Visibility as VisibilityIcon,
  CalendarToday as CalendarIcon,
  Spa as SpaIcon,
  FitnessCenter as FitnessCenterIcon,
  DeleteSweep as DeleteSweepIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const DietHistoryList = ({ dietCharts, onViewChart, onDeleteChart }) => {
  // Debug: log props
  useEffect(() => {
    console.log('DietHistoryList props dietCharts:', dietCharts);
  }, [dietCharts]);

  const navigate = useNavigate();
  const [selectedChart, setSelectedChart] = useState(null);
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chartToDelete, setChartToDelete] = useState(null);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);

  const handlePrintChart = (chart) => {
    setSelectedChart(chart);
    setPrintDialogOpen(true);
  };

  const handlePrintConfirm = () => {
    // Create an iframe-based print with professional styling similar to DietChart
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups for this website to print diet plans.');
      return;
    }

    // HTML structure with styling
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Diet Plan - ${new Date(selectedChart.date).toLocaleDateString()}</title>
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
          .meal-totals {
            font-weight: bold;
            background-color: #f5f5f5;
          }
          .total-label {
            text-align: right;
            padding-right: 15px;
          }
          .total-nutrients {
            margin-top: 30px;
            font-weight: bold;
          }
          .diet-info {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            margin-bottom: 20px;
          }
          .diet-info-item {
            flex: 1;
            min-width: 200px;
            background-color: #f9f9f9;
            padding: 10px;
            border-radius: 4px;
            border-left: 4px solid #2e7d32;
          }
          .diet-info-item strong {
            font-weight: bold;
            display: inline-block;
            width: 100px;
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
          <h1>Saved Diet Plan</h1>
          <p class="print-date">Generated on ${new Date(selectedChart.date).toLocaleDateString()}</p>
        </div>
        
        <div class="diet-info">
          <div class="diet-info-item">
            <strong>Diet Type:</strong> ${selectedChart.dietType ? selectedChart.dietType.charAt(0).toUpperCase() + selectedChart.dietType.slice(1).replace(/([A-Z])/g, ' $1') : 'Standard'}
          </div>
          <div class="diet-info-item">
            <strong>Goal:</strong> ${selectedChart.goal === 'lose' ? 'Lose Fat' : selectedChart.goal === 'maintain' ? 'Maintain Weight' : 'Gain Muscle'}
          </div>
          ${selectedChart.isGlutenFree ? '<div class="diet-info-item"><strong>Gluten-Free:</strong> Yes</div>' : ''}
        </div>
    `);

    // Add meal plan sections if available
    if (selectedChart.data && selectedChart.data.mealPlan) {
      // Get all meal keys
      const mealKeys = Object.keys(selectedChart.data.mealPlan);
      
      // Render each meal
      mealKeys.forEach(mealKey => {
        const mealName = getMealDisplayName(mealKey, selectedChart);
        const foods = selectedChart.data.mealPlan[mealKey];
        
        printWindow.document.write(`
          <h2 class="meal-title">${mealName}</h2>
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
        `);
        
        if (foods && foods.length > 0) {
          // Calculate meal nutrients manually for each meal
          let mealCalories = 0, mealProtein = 0, mealCarbs = 0, mealFats = 0, mealFiber = 0;
          
          foods.forEach(food => {
            printWindow.document.write(`
              <tr>
                <td class="food-name">${food.name}</td>
                <td>${food.quantity || ''}</td>
                <td>${food.calories}</td>
                <td>${food.protein.toFixed(1)}</td>
                <td>${food.carbs.toFixed(1)}</td>
                <td>${food.fats.toFixed(1)}</td>
                <td>${food.fiber ? food.fiber.toFixed(1) : '0.0'}</td>
              </tr>
            `);
            
            // Add to meal totals
            mealCalories += (food.calories || 0);
            mealProtein += (food.protein || 0);
            mealCarbs += (food.carbs || 0);
            mealFats += (food.fats || 0);
            mealFiber += (food.fiber || 0);
          });
          
          // Add meal totals row
          printWindow.document.write(`
            <tr class="meal-totals">
              <td colspan="2" class="total-label">Meal Totals:</td>
              <td>${mealCalories}</td>
              <td>${mealProtein.toFixed(1)}</td>
              <td>${mealCarbs.toFixed(1)}</td>
              <td>${mealFats.toFixed(1)}</td>
              <td>${mealFiber.toFixed(1)}</td>
            </tr>
          `);
        } else {
          printWindow.document.write('<tr><td colspan="7" style="text-align:center">No foods in this meal</td></tr>');
        }
        
        printWindow.document.write('</tbody></table>');
      });
    }

    // Add total nutrients table
    if (selectedChart.data && selectedChart.data.totalNutrients) {
      const nutrients = selectedChart.data.totalNutrients;
      
      printWindow.document.write(`
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
              <td>${nutrients.totalCalories || 0}</td>
              <td>${(nutrients.totalProtein || 0).toFixed(1)}</td>
              <td>${(nutrients.totalCarbs || 0).toFixed(1)}</td>
              <td>${(nutrients.totalFats || 0).toFixed(1)}</td>
              <td>${(nutrients.totalFiber || 0).toFixed(1)}</td>
            </tr>
          </tbody>
        </table>
        
        <div style="margin-top: 30px; text-align: center;">
          <button onclick="window.print();" style="padding: 10px 20px; background-color: #4caf50; color: white; border: none; border-radius: 4px; cursor: pointer;">Print</button>
        </div>
      `);
    }

    // Close the HTML structure
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    
    // Focus the window and wait for it to load before triggering print
    setTimeout(() => {
      printWindow.focus();
      try {
        // Trigger print directly on the window
        printWindow.print();
      } catch (err) {
        console.error("Print error:", err);
        // Show print button as fallback
      }
    }, 1000);
    
    setPrintDialogOpen(false);
  };

  const handleClosePrintDialog = () => {
    setPrintDialogOpen(false);
  };
  
  const handleDeleteClick = (chart) => {
    setChartToDelete(chart);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    if (onDeleteChart && chartToDelete) {
      onDeleteChart(chartToDelete.id);
    }
    setDeleteDialogOpen(false);
  };
  
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteAllClick = () => {
    setDeleteAllDialogOpen(true);
  };
  
  const handleDeleteAllConfirm = () => {
    if (onDeleteChart && dietCharts.length > 0) {
      // Create a copy of all chart IDs to avoid issues with changing state during deletion
      const chartIds = dietCharts.map(chart => chart.id);
      
      // Use a special identifier to indicate this is a bulk delete operation
      onDeleteChart("DELETE_ALL", chartIds);
    }
    setDeleteAllDialogOpen(false);
  };
  
  const handleCloseDeleteAllDialog = () => {
    setDeleteAllDialogOpen(false);
  };
  
  const getMealDisplayName = (mealKey, chart) => {
    // First check if this meal has a custom display name in the chart data
    if (chart && chart.data && chart.data.mealDisplayNames && chart.data.mealDisplayNames[mealKey]) {
      return chart.data.mealDisplayNames[mealKey];
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
  };

  if (!dietCharts || dietCharts.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
        <SpaIcon sx={{ fontSize: 60, color: 'primary.light', mb: 2, opacity: 0.7 }} />
        <Typography variant="h6" gutterBottom>
          No saved diet plans yet
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Your saved diet plans will appear here after you create and save them.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/')}
          sx={{ mt: 1 }}
        >
          Create Diet Plan
        </Button>
      </Paper>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Your Saved Diet Plans
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteSweepIcon />}
          onClick={handleDeleteAllClick}
          sx={{ borderRadius: 2 }}
        >
          Delete All Diet Plans
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {dietCharts.map((chart, index) => (
          <Grid item xs={12} md={6} key={chart.id || index}>
            <Card 
              elevation={3}
              sx={{ 
                height: '100%',
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                },
                borderTop: '4px solid #4caf50'
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" component="div">
                    {new Date(chart.date).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Chip 
                    icon={<SpaIcon />} 
                    label={(chart.dietType || 'Standard').charAt(0).toUpperCase() + (chart.dietType || 'standard').slice(1).replace(/([A-Z])/g, ' $1')} 
                    color="primary" 
                    variant="outlined" 
                    size="small"
                  />
                  <Chip 
                    icon={<FitnessCenterIcon />} 
                    label={(chart.goal || 'maintain') === 'lose' ? 'Lose Fat' : (chart.goal || 'maintain') === 'maintain' ? 'Maintain Weight' : 'Gain Muscle'} 
                    color="secondary" 
                    variant="outlined" 
                    size="small"
                  />
                  {chart.isGlutenFree && (
                    <Chip 
                      label="Gluten-Free" 
                      color="success" 
                      variant="outlined" 
                      size="small"
                    />
                  )}
                </Box>
                
                {chart.data && chart.data.totalNutrients && (
                  <Box sx={{ my: 2 }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Calories
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {chart.data.totalNutrients.totalCalories || 0}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Protein
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {(chart.data.totalNutrients.totalProtein || 0).toFixed(1)}g
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Carbs
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {(chart.data.totalNutrients.totalCarbs || 0).toFixed(1)}g
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Fats
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {(chart.data.totalNutrients.totalFats || 0).toFixed(1)}g
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                )}
                
                {chart.data && chart.data.mealPlan && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Meals:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {Object.keys(chart.data.mealPlan).map((mealKey) => (
                        <Chip
                          key={mealKey}
                          label={getMealDisplayName(mealKey, chart)}
                          size="small"
                          sx={{ mb: 0.5 }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </CardContent>
              
              <Box sx={{ 
                p: 2, 
                display: 'flex', 
                justifyContent: 'flex-end',
                backgroundColor: 'rgba(0,0,0,0.03)',
                borderTop: '1px solid rgba(0,0,0,0.09)'
              }}>
                <Tooltip title="View Diet Plan">
                  <IconButton 
                    color="primary" 
                    onClick={() => onViewChart(chart)}
                    aria-label="View Diet Plan"
                    sx={{ mr: 1 }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Print Diet Plan">
                  <IconButton 
                    color="primary" 
                    onClick={() => handlePrintChart(chart)}
                    aria-label="Print Diet Plan"
                    sx={{ mr: 1 }}
                  >
                    <PrintIcon />
                  </IconButton>
                </Tooltip>
                
                {onDeleteChart && (
                  <Tooltip title="Delete Diet Plan">
                    <IconButton 
                      color="error" 
                      onClick={() => handleDeleteClick(chart)}
                      aria-label="Delete Diet Plan"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Dialog 
        open={printDialogOpen} 
        onClose={handleClosePrintDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Print Diet Plan
        </DialogTitle>
        <DialogContent dividers>
          {printDialogOpen && selectedChart && (
            <iframe
              title="Diet Plan Print Preview"
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
                  <title>Diet Plan - ${new Date(selectedChart.date).toLocaleDateString()}</title>
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
                      margin-bottom: 20px.
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
                      margin-bottom: 20px.
                    }
                    .meal-totals {
                      font-weight: bold;
                      background-color: #f5f5f5.
                    }
                    .total-label {
                      text-align: right;
                      padding-right: 15px.
                    }
                    .total-nutrients {
                      margin-top: 30px;
                      font-weight: bold.
                    }
                    .diet-info {
                      display: flex;
                      flex-wrap: wrap;
                      gap: 20px;
                      margin-bottom: 20px.
                    }
                    .diet-info-item {
                      flex: 1;
                      min-width: 200px;
                      background-color: #f9f9f9;
                      padding: 10px;
                      border-radius: 4px;
                      border-left: 4px solid #2e7d32.
                    }
                    .diet-info-item strong {
                      font-weight: bold;
                      display: inline-block;
                      width: 100px.
                    }
                    @media print {
                      body {
                        padding: 0.
                      }
                      button {
                        display: none.
                      }
                    }
                  </style>
                </head>
                <body>
                  <div class="print-header">
                    <h1>Saved Diet Plan</h1>
                    <p class="print-date">Generated on ${new Date(selectedChart.date).toLocaleDateString()}</p>
                  </div>
                  
                  <div class="diet-info">
                    <div class="diet-info-item">
                      <strong>Diet Type:</strong> ${selectedChart.dietType ? selectedChart.dietType.charAt(0).toUpperCase() + selectedChart.dietType.slice(1).replace(/([A-Z])/g, ' $1') : 'Standard'}
                    </div>
                    <div class="diet-info-item">
                      <strong>Goal:</strong> ${selectedChart.goal === 'lose' ? 'Lose Fat' : selectedChart.goal === 'maintain' ? 'Maintain Weight' : 'Gain Muscle'}
                    </div>
                    ${selectedChart.isGlutenFree ? '<div class="diet-info-item"><strong>Gluten-Free:</strong> Yes</div>' : ''}
                  </div>
                  
                  ${selectedChart.data && selectedChart.data.mealPlan ? 
                    Object.keys(selectedChart.data.mealPlan).map((mealKey, i) => {
                      const mealName = (() => {
                        if (selectedChart.data.mealDisplayNames && selectedChart.data.mealDisplayNames[mealKey]) {
                          return selectedChart.data.mealDisplayNames[mealKey];
                        }
                        
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
                        
                        return mealKey.charAt(0).toUpperCase() + mealKey.slice(1).replace(/([A-Z])/g, ' $1').replace(/_/g, ' ');
                      })();
                      
                      const foods = selectedChart.data.mealPlan[mealKey];
                      
                      // Calculate meal totals manually here instead of using a function
                      const mealNutrients = (() => {
                        let calories = 0, protein = 0, carbs = 0, fats = 0, fiber = 0;
                        
                        if (foods && foods.length > 0) {
                          foods.forEach(food => {
                            calories += (food.calories || 0);
                            protein += (food.protein || 0);
                            carbs += (food.carbs || 0);
                            fats += (food.fats || 0);
                            fiber += (food.fiber || 0);
                          });
                        }
                        
                        return { calories, protein, carbs, fats, fiber };
                      })();
                      
                      return `
                        <h2 class="meal-title">${mealName}</h2>
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
                            ${foods && foods.length > 0 ? 
                              foods.map(food => `
                                <tr>
                                  <td class="food-name">${food.name}</td>
                                  <td>${food.quantity || ''}</td>
                                  <td>${food.calories}</td>
                                  <td>${food.protein.toFixed(1)}</td>
                                  <td>${food.carbs.toFixed(1)}</td>
                                  <td>${food.fats.toFixed(1)}</td>
                                  <td>${food.fiber ? food.fiber.toFixed(1) : '0.0'}</td>
                                </tr>
                              `).join('') : 
                              `<tr><td colspan="7" style="text-align:center">No foods in this meal</td></tr>`
                            }
                            ${foods && foods.length > 0 ? `
                              <tr class="meal-totals">
                                <td colspan="2" class="total-label">Meal Totals:</td>
                                <td>${mealNutrients.calories}</td>
                                <td>${mealNutrients.protein.toFixed(1)}</td>
                                <td>${mealNutrients.carbs.toFixed(1)}</td>
                                <td>${mealNutrients.fats.toFixed(1)}</td>
                                <td>${mealNutrients.fiber.toFixed(1)}</td>
                              </tr>
                            ` : ''}
                          </tbody>
                        </table>
                      `;
                    }).join('') : '<p>No meal plan data available</p>'
                  }
                  
                  ${selectedChart.data && selectedChart.data.totalNutrients ? `
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
                          <td>${selectedChart.data.totalNutrients.totalCalories || 0}</td>
                          <td>${(selectedChart.data.totalNutrients.totalProtein || 0).toFixed(1)}</td>
                          <td>${(selectedChart.data.totalNutrients.totalCarbs || 0).toFixed(1)}</td>
                          <td>${(selectedChart.data.totalNutrients.totalFats || 0).toFixed(1)}</td>
                          <td>${(selectedChart.data.totalNutrients.totalFiber || 0).toFixed(1)}</td>
                        </tr>
                      </tbody>
                    </table>
                  ` : ''}
                  
                  <div style="margin-top: 30px; text-align: center;">
                    <button onclick="window.print();" style="padding: 10px 20px; background-color: #4caf50; color: white; border: none; border-radius: 4px; cursor: pointer;">Print</button>
                  </div>
                </body>
                </html>
              `}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePrintDialog} color="secondary">
            Cancel
          </Button>
          <Button 
            onClick={handlePrintConfirm} 
            color="primary" 
            variant="contained" 
            startIcon={<PrintIcon />}
          >
            Print
          </Button>
        </DialogActions>
      </Dialog>
      
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Diet Plan</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this diet plan from {chartToDelete ? new Date(chartToDelete.date).toLocaleDateString() : ''}?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained" 
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      <Dialog open={deleteAllDialogOpen} onClose={handleCloseDeleteAllDialog}>
        <DialogTitle>Delete All Diet Plans</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete all saved diet plans?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteAllDialog} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteAllConfirm} 
            color="error" 
            variant="contained" 
            startIcon={<DeleteSweepIcon />}
          >
            Delete All
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DietHistoryList;