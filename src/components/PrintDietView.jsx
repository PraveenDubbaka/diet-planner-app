import React, { useContext, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';

const PrintDietView = () => {
  const { userData } = useContext(UserContext);

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
          { name: 'Bacon (100g)', calories: 417, protein: 13, carbs: 1.4, fat: 42, fiber: 0 },
          { name: 'Avocado (100g)', calories: 160, protein: 2, carbs: 8.5, fat: 14.7, fiber: 6.7 },
          { name: 'Eggs (2 large)', calories: 143, protein: 12.6, carbs: 0.7, fat: 9.5, fiber: 0 },
          { name: 'Cheddar Cheese (30g)', calories: 120, protein: 7, carbs: 0.4, fat: 10, fiber: 0 },
          { name: 'Macadamia Nuts (30g)', calories: 204, protein: 2.2, carbs: 3.9, fat: 21.5, fiber: 2.4 },
          { name: 'Salmon (100g)', calories: 206, protein: 22, carbs: 0, fat: 13, fiber: 0 }
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
          { name: 'Olive Oil (1 tbsp)', calories: 119, protein: 0, carbs: 0, fat: 14, fiber: 0 },
          { name: 'Greek Yogurt (170g)', calories: 100, protein: 17, carbs: 6, fat: 0, fiber: 0 },
          { name: 'Feta Cheese (30g)', calories: 75, protein: 4, carbs: 1.2, fat: 6, fiber: 0 },
          { name: 'Quinoa (100g cooked)', calories: 120, protein: 4.4, carbs: 21, fat: 1.9, fiber: 2.8 },
          { name: 'Chickpeas (100g)', calories: 164, protein: 9, carbs: 27, fat: 2.6, fiber: 8 },
          { name: 'Salmon (100g)', calories: 206, protein: 22, carbs: 0, fat: 13, fiber: 0 }
        ];
      case 'vegan':
        return [
          { name: 'Tofu (100g)', calories: 76, protein: 8, carbs: 2, fat: 4.8, fiber: 0.9 },
          { name: 'Quinoa (100g cooked)', calories: 120, protein: 4.4, carbs: 21, fat: 1.9, fiber: 2.8 },
          { name: 'Lentils (100g cooked)', calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 8 },
          { name: 'Chickpeas (100g)', calories: 164, protein: 9, carbs: 27, fat: 2.6, fiber: 8 },
          { name: 'Chia Seeds (15g)', calories: 74, protein: 2.5, carbs: 6, fat: 4.8, fiber: 5 },
          { name: 'Almond Milk (250ml)', calories: 39, protein: 1.5, carbs: 1.5, fat: 3, fiber: 0.5 }
        ];
      case 'vegetarian':
        return [
          { name: 'Greek Yogurt (170g)', calories: 100, protein: 17, carbs: 6, fat: 0, fiber: 0 },
          { name: 'Eggs (2 large)', calories: 143, protein: 12.6, carbs: 0.7, fat: 9.5, fiber: 0 },
          { name: 'Lentils (100g cooked)', calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 8 },
          { name: 'Cottage Cheese (100g)', calories: 98, protein: 11, carbs: 3.4, fat: 4.3, fiber: 0 },
          { name: 'Quinoa (100g cooked)', calories: 120, protein: 4.4, carbs: 21, fat: 1.9, fiber: 2.8 },
          { name: 'Almonds (30g)', calories: 173, protein: 6, carbs: 6, fat: 15, fiber: 3.5 }
        ];
      case 'lowCarb':
        return [
          { name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
          { name: 'Avocado (100g)', calories: 160, protein: 2, carbs: 8.5, fat: 14.7, fiber: 6.7 },
          { name: 'Eggs (2 large)', calories: 143, protein: 12.6, carbs: 0.7, fat: 9.5, fiber: 0 },
          { name: 'Spinach (100g)', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2 },
          { name: 'Salmon (100g)', calories: 206, protein: 22, carbs: 0, fat: 13, fiber: 0 },
          { name: 'Almonds (30g)', calories: 173, protein: 6, carbs: 6, fat: 15, fiber: 3.5 }
        ];
      case 'intermittentFasting':
        return [
          { name: 'Eggs (2 large)', calories: 143, protein: 12.6, carbs: 0.7, fat: 9.5, fiber: 0 },
          { name: 'Avocado (100g)', calories: 160, protein: 2, carbs: 8.5, fat: 14.7, fiber: 6.7 },
          { name: 'Salmon (100g)', calories: 206, protein: 22, carbs: 0, fat: 13, fiber: 0 },
          { name: 'Quinoa (100g cooked)', calories: 120, protein: 4.4, carbs: 21, fat: 1.9, fiber: 2.8 },
          { name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
          { name: 'Mixed Berries (100g)', calories: 57, protein: 0.7, carbs: 14, fat: 0.3, fiber: 2.4 }
        ];
      case 'zone':
        return [
          { name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
          { name: 'Almonds (15g)', calories: 87, protein: 3, carbs: 3, fat: 7.5, fiber: 1.8 },
          { name: 'Olive Oil (1 tsp)', calories: 40, protein: 0, carbs: 0, fat: 4.5, fiber: 0 },
          { name: 'Brown Rice (50g)', calories: 56, protein: 1.3, carbs: 12, fat: 0.4, fiber: 0.9 },
          { name: 'Broccoli (100g)', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6 },
          { name: 'Apple (1 medium)', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4 }
        ];
      case 'dash':
        return [
          { name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
          { name: 'Sweet Potato (100g)', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3 },
          { name: 'Quinoa (100g cooked)', calories: 120, protein: 4.4, carbs: 21, fat: 1.9, fiber: 2.8 },
          { name: 'Spinach (100g)', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2 },
          { name: 'Banana (1 medium)', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1 },
          { name: 'Walnuts (15g)', calories: 98, protein: 2.3, carbs: 2, fat: 9.2, fiber: 1 }
        ];
      case 'carnivore':
        return [
          { name: 'Ribeye Steak (100g)', calories: 291, protein: 24, carbs: 0, fat: 22, fiber: 0 },
          { name: 'Eggs (2 large)', calories: 143, protein: 12.6, carbs: 0.7, fat: 9.5, fiber: 0 },
          { name: 'Bacon (50g)', calories: 208, protein: 6.5, carbs: 0.7, fat: 21, fiber: 0 },
          { name: 'Salmon (100g)', calories: 206, protein: 22, carbs: 0, fat: 13, fiber: 0 },
          { name: 'Ground Beef (100g)', calories: 250, protein: 26, carbs: 0, fat: 15, fiber: 0 },
          { name: 'Liver (100g)', calories: 175, protein: 26.5, carbs: 3.8, fat: 4.7, fiber: 0 }
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

  // Trigger print dialog when component mounts
  useEffect(() => {
    // Wait for styles to apply before printing
    const timer = setTimeout(() => {
      window.print();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!userData) {
    return <div>No user data available</div>;
  }

  // Get food recommendations based on user's diet type and goal
  const foodItems = getDietFoodItems(userData.dietType, userData.goal);

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

  return (
    <div className="diet-print-container">
      {/* Header Section */}
      <header className="diet-print-header">
        <img 
          src="/images/diet-logo.png" 
          alt="Diet Planner Logo" 
          className="diet-print-logo"
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = 'none';
          }}
        />
        <h1 className="diet-print-title">Personalized Diet Plan</h1>
        <p className="diet-print-date">Generated on {new Date().toLocaleDateString()}</p>
      </header>

      {/* Profile Section */}
      <section className="diet-print-section diet-print-profile-section">
        <h2 className="diet-print-section-title">Profile Information</h2>
        <div className="diet-print-profile-grid">
          <div className="diet-print-profile-item">
            <span className="diet-print-profile-label">Name:</span>
            <span>{userData.name || 'Not specified'}</span>
          </div>
          <div className="diet-print-profile-item">
            <span className="diet-print-profile-label">Age:</span>
            <span>{userData.age ? `${userData.age} years` : 'Not specified'}</span>
          </div>
          <div className="diet-print-profile-item">
            <span className="diet-print-profile-label">Goal:</span>
            <span>{getGoalText(userData.goal)}</span>
          </div>
          <div className="diet-print-profile-item">
            <span className="diet-print-profile-label">Diet Type:</span>
            <span>{getDietTypeDisplay(userData.dietType)}</span>
          </div>
          <div className="diet-print-profile-item">
            <span className="diet-print-profile-label">Activity Level:</span>
            <span>{userData.activityLevel || 'Moderate'}</span>
          </div>
          <div className="diet-print-profile-item">
            <span className="diet-print-profile-label">Gluten-Free:</span>
            <span>{userData.isGlutenFree ? 'Yes' : 'No'}</span>
          </div>
          <div className="diet-print-profile-item">
            <span className="diet-print-profile-label">Height:</span>
            <span>{userData.height ? `${userData.height} cm` : 'Not specified'}</span>
          </div>
          <div className="diet-print-profile-item">
            <span className="diet-print-profile-label">Weight:</span>
            <span>{userData.weight ? `${userData.weight} kg` : 'Not specified'}</span>
          </div>
        </div>
      </section>

      {/* Nutrition Section */}
      <section className="diet-print-section diet-print-nutrition-section">
        <h2 className="diet-print-section-title">Daily Nutrition Targets</h2>
        
        {/* Calories Card */}
        <div className="diet-print-nutrition-card">
          <span className="diet-print-calories">
            {userData.calorieNeeds?.toFixed(0) || 'N/A'} calories per day
          </span>
        </div>
        
        {/* Macros Grid */}
        <div className="diet-print-macros-grid">
          <div className="diet-print-macro-item">
            <span className="diet-print-macro-label">Protein</span>
            <span className="diet-print-macro-value">{userData.macros?.protein?.toFixed(0) || 'N/A'} g</span>
          </div>
          <div className="diet-print-macro-item">
            <span className="diet-print-macro-label">Carbs</span>
            <span className="diet-print-macro-value">{userData.macros?.carbs?.toFixed(0) || 'N/A'} g</span>
          </div>
          <div className="diet-print-macro-item">
            <span className="diet-print-macro-label">Fat</span>
            <span className="diet-print-macro-value">{userData.macros?.fat?.toFixed(0) || 'N/A'} g</span>
          </div>
          <div className="diet-print-macro-item">
            <span className="diet-print-macro-label">Fiber</span>
            <span className="diet-print-macro-value">{userData.macros?.fiber?.toFixed(0) || 'N/A'} g</span>
          </div>
        </div>
      </section>

      {/* Food List Section */}
      <section className="diet-print-section diet-print-food-section">
        <h2 className="diet-print-section-title">Recommended Foods</h2>
        <table className="diet-print-food-table">
          <thead>
            <tr>
              <th>Food Item</th>
              <th>Calories</th>
              <th>Protein</th>
              <th>Carbs</th>
              <th>Fat</th>
              <th>Fiber</th>
            </tr>
          </thead>
          <tbody>
            {foodItems.map((item, index) => (
              <tr key={index}>
                <td className="diet-print-food-name">{item.name}</td>
                <td>{item.calories}</td>
                <td>{item.protein}g</td>
                <td>{item.carbs}g</td>
                <td>{item.fat}g</td>
                <td>{item.fiber}g</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Meal Plan Section */}
      <section className="diet-print-section diet-print-meal-section">
        <h2 className="diet-print-section-title">Sample Daily Meal Plan</h2>
        <div className="diet-print-meal-sections">
          {/* Breakfast */}
          <div className="diet-print-meal">
            <h3 className="diet-print-meal-title">Breakfast</h3>
            <ul className="diet-print-meal-list">
              {foodItems.slice(0, 2).map((item, index) => (
                <li key={index} className="diet-print-meal-item">
                  {item.name}
                  <div><small>{item.calories} cal | {item.protein}g protein</small></div>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Lunch */}
          <div className="diet-print-meal">
            <h3 className="diet-print-meal-title">Lunch</h3>
            <ul className="diet-print-meal-list">
              {foodItems.slice(2, 4).map((item, index) => (
                <li key={index} className="diet-print-meal-item">
                  {item.name}
                  <div><small>{item.calories} cal | {item.protein}g protein</small></div>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Dinner */}
          <div className="diet-print-meal">
            <h3 className="diet-print-meal-title">Dinner</h3>
            <ul className="diet-print-meal-list">
              {foodItems.slice(4, 6).map((item, index) => (
                <li key={index} className="diet-print-meal-item">
                  {item.name}
                  <div><small>{item.calories} cal | {item.protein}g protein</small></div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Stats and Footer */}
      <footer className="diet-print-footer">
        <p>This personalized diet plan is based on your specific profile and goals.</p>
        <p>
          BMR: {userData.bmr?.toFixed(0) || 'N/A'} cal | 
          TDEE: {userData.tdee?.toFixed(0) || 'N/A'} cal | 
          BMI: {userData.bmi?.toFixed(1) || 'N/A'}
        </p>
        <p>© {new Date().getFullYear()} Your Diet Planner App</p>
      </footer>
    </div>
  );
};

export default PrintDietView;
