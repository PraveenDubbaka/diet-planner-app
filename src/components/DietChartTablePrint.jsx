import React, { useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

// Simple component for printing just the diet chart in a table format
const DietChartTablePrint = ({ userMealPlan, mealOrder, mealDisplayNames, totalNutrients }) => {
  // Trigger print on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 500); // Give the page time to render before printing

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="diet-print-only">
      <style type="text/css" media="print">
        {`
          @page {
            size: portrait;
            margin: 1cm;
          }
          
          body {
            font-family: Arial, sans-serif;
            padding: 0;
            margin: 0;
          }
          
          body * {
            visibility: hidden;
          }
          
          .diet-print-only,
          .diet-print-only * {
            visibility: visible;
          }
          
          .diet-print-only {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
            box-sizing: border-box;
          }
          
          .no-print {
            display: none !important;
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
          
          .meal-title {
            margin-top: 20px;
            margin-bottom: 10px;
            font-size: 16pt;
            font-weight: bold;
            border-bottom: 1px solid #333;
          }
          
          .total-nutrients {
            margin-top: 30px;
            font-weight: bold;
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
          
          .food-name {
            text-align: left;
            padding-left: 15px;
          }
        `}
      </style>

      <div className="print-header">
        <h1>Diet Plan - Meal Chart</h1>
        <p className="print-date">Generated on {new Date().toLocaleDateString()}</p>
      </div>

      {/* Render each meal as a table */}
      {mealOrder.map((mealKey) => (
        <div key={mealKey}>
          <Typography variant="h5" className="meal-title">
            {mealDisplayNames && mealDisplayNames[mealKey] ? mealDisplayNames[mealKey] : mealKey.charAt(0).toUpperCase() + mealKey.slice(1).replace(/([A-Z])/g, ' $1')}
          </Typography>
          
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Food Item</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Calories</TableCell>
                  <TableCell>Protein (g)</TableCell>
                  <TableCell>Carbs (g)</TableCell>
                  <TableCell>Fats (g)</TableCell>
                  <TableCell>Fiber (g)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userMealPlan[mealKey] && userMealPlan[mealKey].length > 0 ? (
                  userMealPlan[mealKey].map((food, index) => (
                    <TableRow key={index}>
                      <TableCell className="food-name">{food.name}</TableCell>
                      <TableCell>{food.quantity}</TableCell>
                      <TableCell>{food.calories}</TableCell>
                      <TableCell>{food.protein.toFixed(1)}</TableCell>
                      <TableCell>{food.carbs.toFixed(1)}</TableCell>
                      <TableCell>{food.fats.toFixed(1)}</TableCell>
                      <TableCell>{food.fiber?.toFixed(1) || '0.0'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">No food items added</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ))}

      {/* Total nutrients table */}
      <Typography variant="h5" className="meal-title">Total Daily Nutrients</Typography>
      <TableContainer component={Paper} className="total-nutrients">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Total Calories</TableCell>
              <TableCell>Total Protein (g)</TableCell>
              <TableCell>Total Carbs (g)</TableCell>
              <TableCell>Total Fats (g)</TableCell>
              <TableCell>Total Fiber (g)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{totalNutrients.totalCalories}</TableCell>
              <TableCell>{totalNutrients.totalProtein.toFixed(1)}</TableCell>
              <TableCell>{totalNutrients.totalCarbs.toFixed(1)}</TableCell>
              <TableCell>{totalNutrients.totalFats.toFixed(1)}</TableCell>
              <TableCell>{totalNutrients.totalFiber.toFixed(1)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DietChartTablePrint;