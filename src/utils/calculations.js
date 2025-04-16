// BMI Calculation: weight (kg) / (height (m))^2
export const calculateBMI = (weight, heightCm) => {
  const heightM = heightCm / 100;
  // Return a number instead of a string, for calculations in components
  return parseFloat((weight / (heightM * heightM)).toFixed(1));
};

// BMI Categories
export const getBMICategory = (bmi) => {
  if (bmi < 18.5) return { category: 'Underweight', color: '#2196f3' };
  if (bmi < 25) return { category: 'Normal weight', color: '#4caf50' };
  if (bmi < 30) return { category: 'Overweight', color: '#ff9800' };
  return { category: 'Obesity', color: '#f44336' };
};

// Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor Equation
export const calculateBMR = (weight, heightCm, age, gender) => {
  if (gender === 'male') {
    return (10 * weight) + (6.25 * heightCm) - (5 * age) + 5;
  } else {
    return (10 * weight) + (6.25 * heightCm) - (5 * age) - 161;
  }
};

// Calculate Total Daily Energy Expenditure (TDEE)
export const calculateTDEE = (bmr, activityLevel) => {
  const activityMultipliers = {
    sedentary: 1.2,      // Little to no exercise
    light: 1.375,         // Light exercise 1-3 days/week
    moderate: 1.55,       // Moderate exercise 3-5 days/week
    active: 1.725,        // Heavy exercise 6-7 days/week
    veryActive: 1.9       // Very heavy exercise, physical job or twice daily training
  };
  
  return Math.round(bmr * activityMultipliers[activityLevel]);
};

// Calculate calorie needs based on goal
export const calculateCalorieNeeds = (tdee, goal) => {
  switch (goal) {
    case 'lose':
      return Math.round(tdee * 0.8); // 20% deficit for weight loss
    case 'maintain':
      return tdee;
    case 'gain':
      return Math.round(tdee * 1.15); // 15% surplus for weight gain
    default:
      return tdee;
  }
};

// Calculate macronutrient breakdown
export const calculateMacros = (calories, dietType, goal) => {
  let protein, carbs, fats, fiber;
  
  // First set baseline macros based on goal
  switch (goal) {
    case 'lose':
      // Higher protein for weight loss
      protein = Math.round((calories * 0.4) / 4); // 40% protein (4 calories per gram)
      fats = Math.round((calories * 0.3) / 9); // 30% fats (9 calories per gram)
      carbs = Math.round((calories * 0.3) / 4); // 30% carbs (4 calories per gram)
      fiber = Math.round(carbs * 0.2); // About 20% of carbs as fiber
      break;
    case 'maintain':
      // Balanced macros for maintenance
      protein = Math.round((calories * 0.3) / 4); // 30% protein 
      fats = Math.round((calories * 0.3) / 9); // 30% fats
      carbs = Math.round((calories * 0.4) / 4); // 40% carbs
      fiber = Math.round(carbs * 0.15); // About 15% of carbs as fiber
      break;
    case 'gain':
      // Higher carbs for weight gain
      protein = Math.round((calories * 0.25) / 4); // 25% protein
      fats = Math.round((calories * 0.25) / 9); // 25% fats
      carbs = Math.round((calories * 0.5) / 4); // 50% carbs
      fiber = Math.round(carbs * 0.12); // About 12% of carbs as fiber
      break;
    default:
      // Default balanced split
      protein = Math.round((calories * 0.3) / 4);
      fats = Math.round((calories * 0.3) / 9);
      carbs = Math.round((calories * 0.4) / 4);
      fiber = Math.round(carbs * 0.15); // About 15% of carbs as fiber
  }
  
  // Now adjust macros based on specific diet type - this overrides the goal-based calculations
  if (dietType) {
    switch (dietType) {
      case 'keto':
        // High fat, very low carb, moderate protein
        fats = Math.round((calories * 0.7) / 9);      // 70% from fat
        protein = Math.round((calories * 0.25) / 4);  // 25% from protein
        carbs = Math.round((calories * 0.05) / 4);    // 5% from carbs (20-50g max)
        carbs = Math.min(carbs, 50);                  // Cap carbs at 50g
        fiber = Math.min(Math.round(carbs * 0.4), 25); // About 40% of limited carbs as fiber
        break;
        
      case 'lowCarb':
        // Moderate fat, low carb, higher protein
        fats = Math.round((calories * 0.5) / 9);      // 50% from fat
        protein = Math.round((calories * 0.3) / 4);   // 30% from protein
        carbs = Math.round((calories * 0.2) / 4);     // 20% from carbs (typically under 100g)
        carbs = Math.min(carbs, 100);                 // Cap carbs at 100g
        fiber = Math.round(carbs * 0.25);             // 25% of carbs as fiber
        break;
        
      case 'highProtein':
        // Higher protein, moderate carbs and fat
        protein = Math.round((calories * 0.4) / 4);   // 40% from protein
        carbs = Math.round((calories * 0.3) / 4);     // 30% from carbs
        fats = Math.round((calories * 0.3) / 9);      // 30% from fat
        fiber = Math.round(carbs * 0.18);             // 18% of carbs as fiber
        break;
        
      case 'paleo':
        // Higher fat and protein, lower carbs
        fats = Math.round((calories * 0.4) / 9);      // 40% from fat
        protein = Math.round((calories * 0.35) / 4);  // 35% from protein
        carbs = Math.round((calories * 0.25) / 4);    // 25% from carbs
        fiber = Math.round(carbs * 0.3);              // 30% of carbs as fiber (from fruits/vegetables)
        break;
        
      case 'mediterranean':
        // Moderate fat (healthy sources), moderate protein, higher carbs
        fats = Math.round((calories * 0.35) / 9);     // 35% from fat (olive oil, nuts)
        protein = Math.round((calories * 0.25) / 4);  // 25% from protein
        carbs = Math.round((calories * 0.4) / 4);     // 40% from carbs
        fiber = Math.round(carbs * 0.25);             // 25% of carbs as fiber (whole grains, legumes)
        break;
        
      case 'vegetarian':
        // Moderate fat, higher carbs, moderate protein
        fats = Math.round((calories * 0.25) / 9);     // 25% from fat
        protein = Math.round((calories * 0.25) / 4);  // 25% from protein (plant sources + dairy/eggs)
        carbs = Math.round((calories * 0.5) / 4);     // 50% from carbs
        fiber = Math.round(carbs * 0.2);              // 20% of carbs as fiber
        break;
        
      case 'vegan':
        // Moderate fat, higher carbs, adequate protein
        fats = Math.round((calories * 0.25) / 9);     // 25% from fat
        protein = Math.round((calories * 0.2) / 4);   // 20% from protein (plant sources only)
        carbs = Math.round((calories * 0.55) / 4);    // 55% from carbs
        fiber = Math.round(carbs * 0.25);             // 25% of carbs as fiber
        break;
        
      case 'zone':
        // Balanced 30/40/30 approach
        fats = Math.round((calories * 0.3) / 9);      // 30% from fat
        protein = Math.round((calories * 0.3) / 4);   // 30% from protein
        carbs = Math.round((calories * 0.4) / 4);     // 40% from carbs
        fiber = Math.round(carbs * 0.2);              // 20% of carbs as fiber
        break;
        
      case 'dash':
        // Heart-healthy approach - moderate fat, carb focused, moderate protein
        fats = Math.round((calories * 0.27) / 9);     // 27% from fat
        protein = Math.round((calories * 0.18) / 4);  // 18% from protein
        carbs = Math.round((calories * 0.55) / 4);    // 55% from carbs
        fiber = Math.round(carbs * 0.25);             // 25% of carbs as fiber
        break;
        
      case 'carnivore':
        // Almost exclusively animal products
        fats = Math.round((calories * 0.7) / 9);      // 70% from fat
        protein = Math.round((calories * 0.3) / 4);   // 30% from protein
        carbs = 0;                                     // Almost no carbs
        fiber = 0;                                     // Almost no fiber
        break;
        
      default:
        // No special adjustment for standard balanced diet
        // We'll keep the goal-based calculations from above
    }
  }
  
  // Apply goal-specific adjustments after diet type calculation
  if (goal === 'lose') {
    // For weight loss, slightly increase protein across all diet types
    const proteinCalories = (protein * 4) / calories; // Current protein percentage
    if (proteinCalories < 0.35 && dietType !== 'keto' && dietType !== 'carnivore') {
      // Adjust protein slightly upward for satiety during weight loss
      protein = Math.round((calories * 0.35) / 4);
      // Reduce carbs slightly to compensate (unless already very low)
      if (carbs > 50) {
        const proteinIncrease = (calories * 0.35) / 4 - protein;
        carbs -= Math.round(proteinIncrease);
      }
    }
  }
  
  // Ensure minimum recommended fiber intake (except for zero-carb diets)
  if (dietType !== 'carnivore' && carbs > 20) {
    fiber = Math.max(fiber, 25); // Minimum 25g of fiber per day
  }
  
  return { protein, carbs, fats, fiber };
};