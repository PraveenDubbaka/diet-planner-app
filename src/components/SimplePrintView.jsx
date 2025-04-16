import React, { useEffect } from 'react';

// Accept userData and userMealPlan directly as props
const SimplePrintView = ({ userData, userMealPlan }) => {
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
      // ... other diet types (existing code)
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
  
  // Calculate total nutrients from actual meal plan if provided
  const calculateTotalNutrients = () => {
    if (!userMealPlan) return { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, totalFiber: 0 };
    
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalFiber = 0;

    Object.values(userMealPlan).forEach(meal => {
      meal.forEach(food => {
        totalCalories += food.calories;
        totalProtein += food.protein;
        totalCarbs += food.carbs;
        totalFat += food.fats || food.fat || 0;
        totalFiber += food.fiber || 0;
      });
    });

    return { totalCalories, totalProtein, totalCarbs, totalFat, totalFiber };
  };
  
  // Trigger print dialog when component mounts
  useEffect(() => {
    // Wait for styles to apply before printing
    const timer = setTimeout(() => {
      window.print();
    }, 1000); // Longer timeout for better rendering

    return () => clearTimeout(timer);
  }, []);

  // Extra check for userData 
  if (!userData) {
    return <div style={{padding: '20px', textAlign: 'center'}}>No user data available</div>;
  }

  // Get food recommendations based on user's diet type and goal
  // Use either userMealPlan data or generated food items if userMealPlan isn't provided
  const { totalCalories, totalProtein, totalCarbs, totalFat, totalFiber } = calculateTotalNutrients();
  const foodItems = userMealPlan ? 
    // Flatten all meals into a single array of food items
    Object.values(userMealPlan).flat() :
    // Use generated food items if no meal plan provided
    getDietFoodItems(userData.dietType, userData.goal);

  // Take the first 6 items if we have a lot
  const displayFoodItems = foodItems.slice(0, 6);
  
  // Get meal plan keys or use default ones
  const mealKeys = userMealPlan ? Object.keys(userMealPlan) : ['breakfast', 'lunch', 'dinner'];

  return (
    <div className="simple-print">
      {/* Header with logo */}
      <div className="simple-print-section">
        <img 
          src="/images/diet-logo.png" 
          alt="Diet Planner Logo" 
          className="simple-logo"
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = 'none';
          }}
        />
        <h1 className="simple-print-title">Personalized Diet Plan</h1>
        <div style={{ textAlign: 'center', marginBottom: '10px', fontSize: '12px' }}>
          Generated on {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Profile Section */}
      <div className="simple-print-section">
        <h2 className="simple-print-section-header">Profile Information</h2>
        <table className="simple-table">
          <tbody>
            <tr>
              <td><strong>Name:</strong></td>
              <td>{userData.name || 'Not specified'}</td>
              <td><strong>Age:</strong></td>
              <td>{userData.age ? `${userData.age} years` : 'Not specified'}</td>
            </tr>
            <tr>
              <td><strong>Height:</strong></td>
              <td>{userData.height ? `${userData.height} cm` : 'Not specified'}</td>
              <td><strong>Weight:</strong></td>
              <td>{userData.weight ? `${userData.weight} kg` : 'Not specified'}</td>
            </tr>
            <tr>
              <td><strong>Goal:</strong></td>
              <td>{getGoalText(userData.goal)}</td>
              <td><strong>Diet Type:</strong></td>
              <td>{getDietTypeDisplay(userData.dietType)}</td>
            </tr>
            <tr>
              <td><strong>Activity Level:</strong></td>
              <td>{userData.activityLevel || 'Moderate'}</td>
              <td><strong>Gluten-Free:</strong></td>
              <td>{userData.isGlutenFree ? 'Yes' : 'No'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Nutrition Section */}
      <div className="simple-print-section">
        <h2 className="simple-print-section-header">Daily Nutrition Targets</h2>
        
        <div className="simple-calorie-box">
          {userData.calorieNeeds ? `${userData.calorieNeeds.toFixed(0)} calories per day` : 
          totalCalories ? `${totalCalories.toFixed(0)} calories per day` : 'Calories not specified'}
        </div>
        
        <div className="simple-macros">
          <div className="simple-macro-item">
            <div className="simple-macro-value">
              {userData.macros?.protein ? `${userData.macros.protein.toFixed(0)}` : 
               totalProtein ? `${totalProtein.toFixed(0)}` : 'N/A'} g
            </div>
            <div className="simple-macro-label">Protein</div>
          </div>
          <div className="simple-macro-item">
            <div className="simple-macro-value">
              {userData.macros?.carbs ? `${userData.macros.carbs.toFixed(0)}` : 
               totalCarbs ? `${totalCarbs.toFixed(0)}` : 'N/A'} g
            </div>
            <div className="simple-macro-label">Carbs</div>
          </div>
          <div className="simple-macro-item">
            <div className="simple-macro-value">
              {userData.macros?.fat || userData.macros?.fats ? `${(userData.macros.fat || userData.macros.fats).toFixed(0)}` : 
               totalFat ? `${totalFat.toFixed(0)}` : 'N/A'} g
            </div>
            <div className="simple-macro-label">Fat</div>
          </div>
          <div className="simple-macro-item">
            <div className="simple-macro-value">
              {userData.macros?.fiber ? `${userData.macros.fiber.toFixed(0)}` : 
               totalFiber ? `${totalFiber.toFixed(0)}` : 'N/A'} g
            </div>
            <div className="simple-macro-label">Fiber</div>
          </div>
        </div>
      </div>

      {/* Food List - Force page break */}
      <div className="simple-print-section simple-page-break">
        <h2 className="simple-print-section-header">Recommended Foods</h2>
        <table className="simple-table">
          <thead>
            <tr>
              <th>Food Item</th>
              <th>Calories</th>
              <th>Protein (g)</th>
              <th>Carbs (g)</th>
              <th>Fat (g)</th>
              <th>Fiber (g)</th>
            </tr>
          </thead>
          <tbody>
            {displayFoodItems.map((item, index) => (
              <tr key={index}>
                <td><strong>{item.name}</strong></td>
                <td>{item.calories}</td>
                <td>{item.protein}</td>
                <td>{item.carbs}</td>
                <td>{item.fats || item.fat || 0}</td>
                <td>{item.fiber || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Meal Plan */}
      <div className="simple-print-section">
        <h2 className="simple-print-section-header">Sample Daily Meal Plan</h2>
        
        <div className="simple-two-col">
          {mealKeys.slice(0, 3).map((mealKey, mealIndex) => (
            <div className="simple-col" key={mealKey}>
              <h3 style={{ margin: '15px 0 10px', fontSize: '16px' }}>
                {userMealPlan && userMealPlan.mealDisplayNames && userMealPlan.mealDisplayNames[mealKey] 
                  ? userMealPlan.mealDisplayNames[mealKey] 
                  : mealKey.charAt(0).toUpperCase() + mealKey.slice(1).replace(/([A-Z])/g, ' $1').trim()}
              </h3>
              <ul style={{ paddingLeft: '20px' }}>
                {userMealPlan && userMealPlan[mealKey] ? (
                  // Display actual meal plan items
                  userMealPlan[mealKey].slice(0, 2).map((item, index) => (
                    <li key={index} className="simple-food-item">
                      <strong>{item.name}</strong>
                      <div>{item.calories} cal | {item.protein}g protein</div>
                    </li>
                  ))
                ) : (
                  // Display generated food items
                  displayFoodItems.slice(mealIndex * 2, mealIndex * 2 + 2).map((item, index) => (
                    <li key={index} className="simple-food-item">
                      <strong>{item.name}</strong>
                      <div>{item.calories} cal | {item.protein}g protein</div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="simple-print-footer">
        <p>This personalized diet plan is based on your specific profile and goals.</p>
        <p>
          BMR: {userData.bmr?.toFixed(0) || 'N/A'} cal | 
          TDEE: {userData.tdee?.toFixed(0) || 'N/A'} cal | 
          BMI: {userData.bmi?.toFixed(1) || 'N/A'}
        </p>
        <p>© {new Date().getFullYear()} Diet Planner App</p>
      </div>
    </div>
  );
};

export default SimplePrintView;