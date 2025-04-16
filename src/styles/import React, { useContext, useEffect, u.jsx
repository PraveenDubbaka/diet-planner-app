import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const PrintSavedDietView = () => {
  const { userData } = useContext(UserContext);
  const { planId } = useParams();
  const [dietPlan, setDietPlan] = useState(null);
  const navigate = useNavigate();

  // Find the saved diet plan based on planId
  useEffect(() => {
    if (userData && userData.savedDietPlans && planId) {
      const plan = userData.savedDietPlans.find(plan => plan.id === planId);
      if (plan) {
        setDietPlan(plan);
      } else {
        // If plan not found, go back to history
        navigate('/history');
      }
    }
  }, [userData, planId, navigate]);

  // Trigger print dialog when component mounts and data is loaded
  useEffect(() => {
    if (dietPlan) {
      // Wait for styles to apply before printing
      const timer = setTimeout(() => {
        window.print();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [dietPlan]);

  if (!userData || !dietPlan) {
    return <div>Loading diet plan data...</div>;
  }

  // Format goal text
  const getGoalText = (goal) => {
    switch(goal) {
      case 'lose': return 'Lose Fat';
      case 'gain': return 'Gain Muscle';
      default: return 'Maintain Weight';
    }
  };

  // Get diet type display name
  const getDietTypeDisplay = (dietType) => {
    const dietTypes = {
      'standard': 'Standard Balanced Diet',
      'keto': 'Ketogenic Diet',
      'paleo': 'Paleo Diet',
      'mediterranean': 'Mediterranean Diet',
      'vegan': 'Vegan Diet',
      'vegetarian': 'Vegetarian Diet',
      'lowCarb': 'Low Carb Diet',
      'highProtein': 'High Protein Diet',
      'intermittentFasting': 'Intermittent Fasting',
      'zone': 'Zone Diet',
      'dash': 'DASH Diet',
      'carnivore': 'Carnivore Diet'
    };
    
    return dietTypes[dietType] || 'Standard Diet';
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="print-container">
      <div className="print-header">
        <h1>Saved Diet Plan</h1>
        <p className="print-date">Created on: {formatDate(dietPlan.createdAt)}</p>
        <p className="print-plan-name">{dietPlan.name || 'Unnamed Plan'}</p>
      </div>
      
      <div className="print-profile">
        <h2>Profile Details</h2>
        <table className="profile-table">
          <tbody>
            <tr>
              <td><strong>Name:</strong></td>
              <td>{userData.name}</td>
              <td><strong>Age:</strong></td>
              <td>{dietPlan.age || userData.age} years</td>
            </tr>
            <tr>
              <td><strong>Goal:</strong></td>
              <td>{getGoalText(dietPlan.goal || userData.goal)}</td>
              <td><strong>Diet Type:</strong></td>
              <td>{getDietTypeDisplay(dietPlan.dietType || userData.dietType)}</td>
            </tr>
            <tr>
              <td><strong>Activity Level:</strong></td>
              <td>{dietPlan.activityLevel || userData.activityLevel || 'Moderate'}</td>
              <td><strong>Gluten-Free:</strong></td>
              <td>{(dietPlan.isGlutenFree || userData.isGlutenFree) ? 'Yes' : 'No'}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="print-nutrition">
        <h2>Daily Nutrition Targets</h2>
        <div className="print-calories">
          <span className="calories-label">Daily Calories:</span>
          <span className="calories-value">{dietPlan.calorieNeeds?.toFixed(0) || userData.calorieNeeds?.toFixed(0) || 'N/A'} calories</span>
        </div>
        
        <table className="macros-table">
          <thead>
            <tr>
              <th>Protein</th>
              <th>Carbs</th>
              <th>Fats</th>
              <th>Fiber</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{dietPlan.macros?.protein?.toFixed(0) || userData.macros?.protein?.toFixed(0) || 'N/A'} g</td>
              <td>{dietPlan.macros?.carbs?.toFixed(0) || userData.macros?.carbs?.toFixed(0) || 'N/A'} g</td>
              <td>{dietPlan.macros?.fat?.toFixed(0) || userData.macros?.fat?.toFixed(0) || 'N/A'} g</td>
              <td>{dietPlan.macros?.fiber?.toFixed(0) || userData.macros?.fiber?.toFixed(0) || 'N/A'} g</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {dietPlan.foodItems && dietPlan.foodItems.length > 0 && (
        <div className="print-food-list">
          <h2>Recommended Foods</h2>
          <table className="food-table">
            <thead>
              <tr>
                <th>Food Item</th>
                <th>Calories</th>
                <th>Protein (g)</th>
                <th>Carbs (g)</th>
                <th>Fats (g)</th>
                <th>Fiber (g)</th>
              </tr>
            </thead>
            <tbody>
              {dietPlan.foodItems.map((item, index) => (
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
        </div>
      )}
      
      {dietPlan.meals && (
        <div className="print-meal-plan">
          <h2>Meal Plan</h2>
          
          {dietPlan.meals.breakfast && (
            <div className="meal-section">
              <h3>Breakfast</h3>
              <ul>
                {dietPlan.meals.breakfast.map((item, index) => (
                  <li key={`breakfast-${index}`}>
                    {item.name} - {item.calories} cal, {item.protein}g protein
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {dietPlan.meals.lunch && (
            <div className="meal-section">
              <h3>Lunch</h3>
              <ul>
                {dietPlan.meals.lunch.map((item, index) => (
                  <li key={`lunch-${index}`}>
                    {item.name} - {item.calories} cal, {item.protein}g protein
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {dietPlan.meals.dinner && (
            <div className="meal-section">
              <h3>Dinner</h3>
              <ul>
                {dietPlan.meals.dinner.map((item, index) => (
                  <li key={`dinner-${index}`}>
                    {item.name} - {item.calories} cal, {item.protein}g protein
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {dietPlan.meals.snacks && (
            <div className="meal-section">
              <h3>Snacks</h3>
              <ul>
                {dietPlan.meals.snacks.map((item, index) => (
                  <li key={`snack-${index}`}>
                    {item.name} - {item.calories} cal, {item.protein}g protein
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      {dietPlan.notes && (
        <div className="print-notes">
          <h2>Notes</h2>
          <p>{dietPlan.notes}</p>
        </div>
      )}
      
      <div className="print-footer">
        <p>This diet plan is personalized based on your profile data and goals.</p>
        <p>BMR: {dietPlan.bmr?.toFixed(0) || userData.bmr?.toFixed(0) || 'N/A'} cal | TDEE: {dietPlan.tdee?.toFixed(0) || userData.tdee?.toFixed(0) || 'N/A'} cal | BMI: {dietPlan.bmi?.toFixed(1) || userData.bmi?.toFixed(1) || 'N/A'}</p>
      </div>
    </div>
  );
};

export default PrintSavedDietView;
