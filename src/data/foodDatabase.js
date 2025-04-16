// Common foods with their nutritional information per 100g/ml unless specified
const foodDatabase = [
  // Proteins
  { 
    name: "Chicken Breast", 
    category: "Protein",
    baseQuantity: "100g",
    caloriesPer100g: 165,
    proteinPer100g: 31,
    carbsPer100g: 0.3,
    fatsPer100g: 3.6,
    fiberPer100g: 0
  },
  { 
    name: "Salmon", 
    category: "Protein",
    baseQuantity: "100g",
    caloriesPer100g: 206,
    proteinPer100g: 22,
    carbsPer100g: 0.5,
    fatsPer100g: 13,
    fiberPer100g: 0
  },
  { 
    name: "Tuna", 
    category: "Protein",
    baseQuantity: "100g",
    caloriesPer100g: 130,
    proteinPer100g: 29,
    carbsPer100g: 0.3,
    fatsPer100g: 1,
    fiberPer100g: 0
  },
  { 
    name: "Ground Beef (95% Lean)", 
    category: "Protein",
    baseQuantity: "100g",
    caloriesPer100g: 172,
    proteinPer100g: 21,
    carbsPer100g: 0.5,
    fatsPer100g: 9,
    fiberPer100g: 0
  },
  { 
    name: "Egg", 
    category: "Protein",
    baseQuantity: "1 large (50g)",
    caloriesPer100g: 155,
    proteinPer100g: 12.5,
    carbsPer100g: 1.1,
    fatsPer100g: 10.6,
    fiberPer100g: 0
  },
  { 
    name: "Greek Yogurt", 
    category: "Protein",
    baseQuantity: "100g",
    caloriesPer100g: 59,
    proteinPer100g: 10,
    carbsPer100g: 3.6,
    fatsPer100g: 0.4,
    fiberPer100g: 0
  },
  { 
    name: "Cottage Cheese", 
    category: "Protein",
    baseQuantity: "100g",
    caloriesPer100g: 98,
    proteinPer100g: 11,
    carbsPer100g: 3.4,
    fatsPer100g: 4.3,
    fiberPer100g: 0
  },
  { 
    name: "Tofu", 
    category: "Protein",
    baseQuantity: "100g",
    caloriesPer100g: 76,
    proteinPer100g: 8,
    carbsPer100g: 1.9,
    fatsPer100g: 4.8,
    fiberPer100g: 1.2
  },
  { 
    name: "Whey Protein Powder", 
    category: "Protein",
    baseQuantity: "1 scoop (30g)",
    caloriesPer100g: 375,
    proteinPer100g: 80,
    carbsPer100g: 7,
    fatsPer100g: 3,
    fiberPer100g: 0.3
  },
  
  // North American Cuisine
  {
    name: "Bacon",
    category: "North American",
    baseQuantity: "2 slices (30g)",
    caloriesPer100g: 417,
    proteinPer100g: 37.0,
    carbsPer100g: 1.4,
    fatsPer100g: 32.0,
    fiberPer100g: 0
  },
  {
    name: "Pancakes",
    category: "North American",
    baseQuantity: "1 pancake (60g)",
    caloriesPer100g: 227,
    proteinPer100g: 6.4,
    carbsPer100g: 28.0,
    fatsPer100g: 9.8,
    fiberPer100g: 0.9
  },
  {
    name: "Maple Syrup",
    category: "North American",
    baseQuantity: "1 tbsp (20g)",
    caloriesPer100g: 260,
    proteinPer100g: 0,
    carbsPer100g: 67.0,
    fatsPer100g: 0.1,
    fiberPer100g: 0
  },
  {
    name: "Pumpkin Pie",
    category: "North American",
    baseQuantity: "1 slice (110g)",
    caloriesPer100g: 229,
    proteinPer100g: 4.5,
    carbsPer100g: 29.0,
    fatsPer100g: 10.9,
    fiberPer100g: 1.1
  },

  // European Cuisine
  {
    name: "Croissant",
    category: "European",
    baseQuantity: "1 medium (60g)",
    caloriesPer100g: 406,
    proteinPer100g: 8.2,
    carbsPer100g: 45.8,
    fatsPer100g: 21.0,
    fiberPer100g: 2.3
  },
  {
    name: "Baguette",
    category: "European",
    baseQuantity: "1 slice (30g)",
    caloriesPer100g: 272,
    proteinPer100g: 9.0,
    carbsPer100g: 51.5,
    fatsPer100g: 2.9,
    fiberPer100g: 3.1
  },
  {
    name: "Prosciutto",
    category: "European",
    baseQuantity: "1 slice (15g)",
    caloriesPer100g: 195,
    proteinPer100g: 22.6,
    carbsPer100g: 0.4,
    fatsPer100g: 11.9,
    fiberPer100g: 0
  },
  {
    name: "Feta Cheese",
    category: "European",
    baseQuantity: "30g",
    caloriesPer100g: 264,
    proteinPer100g: 14.2,
    carbsPer100g: 4.1,
    fatsPer100g: 21.3,
    fiberPer100g: 0
  },
  {
    name: "Paella",
    category: "European",
    baseQuantity: "1 serving (250g)",
    caloriesPer100g: 156,
    proteinPer100g: 8.5,
    carbsPer100g: 21.0,
    fatsPer100g: 3.9,
    fiberPer100g: 1.2
  },
  {
    name: "Schnitzel",
    category: "European",
    baseQuantity: "1 piece (150g)",
    caloriesPer100g: 248,
    proteinPer100g: 18.5,
    carbsPer100g: 12.3,
    fatsPer100g: 14.9,
    fiberPer100g: 0.8
  },
  {
    name: "Moussaka",
    category: "European",
    baseQuantity: "1 serving (200g)",
    caloriesPer100g: 135,
    proteinPer100g: 7.2,
    carbsPer100g: 7.9,
    fatsPer100g: 8.4,
    fiberPer100g: 2.0
  },
  {
    name: "Risotto",
    category: "European",
    baseQuantity: "1 cup (175g)",
    caloriesPer100g: 165,
    proteinPer100g: 4.0,
    carbsPer100g: 27.5,
    fatsPer100g: 4.9,
    fiberPer100g: 0.6
  },
  
  // Asian Cuisine
  {
    name: "White Rice",
    category: "Asian",
    baseQuantity: "100g cooked",
    caloriesPer100g: 130,
    proteinPer100g: 2.7,
    carbsPer100g: 28.2,
    fatsPer100g: 0.3,
    fiberPer100g: 0.4
  },
  {
    name: "Miso Soup",
    category: "Asian",
    baseQuantity: "1 cup (240g)",
    caloriesPer100g: 36,
    proteinPer100g: 2.4,
    carbsPer100g: 5.1,
    fatsPer100g: 0.7,
    fiberPer100g: 0.9
  },
  {
    name: "Ramen Noodles",
    category: "Asian",
    baseQuantity: "1 package (85g)",
    caloriesPer100g: 436,
    proteinPer100g: 9.0,
    carbsPer100g: 62.0,
    fatsPer100g: 17.0,
    fiberPer100g: 2.1
  },
  {
    name: "Sushi (Tuna Roll)",
    category: "Asian",
    baseQuantity: "1 roll (100g)",
    caloriesPer100g: 150,
    proteinPer100g: 5.8,
    carbsPer100g: 30.0,
    fatsPer100g: 0.7,
    fiberPer100g: 0.3
  },
  {
    name: "Pad Thai",
    category: "Asian",
    baseQuantity: "1 serving (250g)",
    caloriesPer100g: 161,
    proteinPer100g: 7.5,
    carbsPer100g: 20.0,
    fatsPer100g: 6.0,
    fiberPer100g: 1.5
  },
  {
    name: "Kimchi",
    category: "Asian",
    baseQuantity: "100g",
    caloriesPer100g: 25,
    proteinPer100g: 1.7,
    carbsPer100g: 4.0,
    fatsPer100g: 0.4,
    fiberPer100g: 2.1
  },
  {
    name: "Fried Rice",
    category: "Asian",
    baseQuantity: "1 cup (198g)",
    caloriesPer100g: 168,
    proteinPer100g: 4.3,
    carbsPer100g: 29.0,
    fatsPer100g: 3.9,
    fiberPer100g: 0.9
  },
  {
    name: "Curry (Japanese)",
    category: "Asian",
    baseQuantity: "1 serving (250g)",
    caloriesPer100g: 92,
    proteinPer100g: 3.3,
    carbsPer100g: 14.5,
    fatsPer100g: 2.5,
    fiberPer100g: 1.7
  },
  {
    name: "Naan Bread",
    category: "Asian",
    baseQuantity: "1 piece (84g)",
    caloriesPer100g: 310,
    proteinPer100g: 9.0,
    carbsPer100g: 50.0,
    fatsPer100g: 9.0,
    fiberPer100g: 1.7
  },
  {
    name: "Biryani",
    category: "Asian",
    baseQuantity: "1 serving (200g)",
    caloriesPer100g: 184,
    proteinPer100g: 6.0,
    carbsPer100g: 23.0,
    fatsPer100g: 7.5,
    fiberPer100g: 1.4
  },
  
  // Latin American Cuisine
  {
    name: "Tortilla (Corn)",
    category: "Latin American",
    baseQuantity: "1 tortilla (30g)",
    caloriesPer100g: 237,
    proteinPer100g: 5.7,
    carbsPer100g: 49.0,
    fatsPer100g: 2.5,
    fiberPer100g: 5.3
  },
  {
    name: "Black Beans",
    category: "Latin American",
    baseQuantity: "100g cooked",
    caloriesPer100g: 132,
    proteinPer100g: 8.9,
    carbsPer100g: 24.0,
    fatsPer100g: 0.5,
    fiberPer100g: 8.7
  },
  {
    name: "Guacamole",
    category: "Latin American",
    baseQuantity: "2 tbsp (30g)",
    caloriesPer100g: 150,
    proteinPer100g: 2.0,
    carbsPer100g: 8.0,
    fatsPer100g: 13.0,
    fiberPer100g: 5.2
  },
  {
    name: "Salsa",
    category: "Latin American",
    baseQuantity: "2 tbsp (30g)",
    caloriesPer100g: 36,
    proteinPer100g: 1.5,
    carbsPer100g: 7.0,
    fatsPer100g: 0.2,
    fiberPer100g: 1.6
  },
  {
    name: "Empanada",
    category: "Latin American",
    baseQuantity: "1 empanada (80g)",
    caloriesPer100g: 294,
    proteinPer100g: 8.5,
    carbsPer100g: 30.0,
    fatsPer100g: 16.0,
    fiberPer100g: 1.7
  },
  {
    name: "Churrasco",
    category: "Latin American",
    baseQuantity: "150g",
    caloriesPer100g: 252,
    proteinPer100g: 26.5,
    carbsPer100g: 0.0,
    fatsPer100g: 16.0,
    fiberPer100g: 0
  },
  {
    name: "Plantains (Fried)",
    category: "Latin American",
    baseQuantity: "100g",
    caloriesPer100g: 271,
    proteinPer100g: 1.3,
    carbsPer100g: 51.4,
    fatsPer100g: 8.0,
    fiberPer100g: 3.4
  },
  
  // Middle Eastern/Mediterranean Cuisine
  {
    name: "Hummus",
    category: "Middle Eastern",
    baseQuantity: "2 tbsp (28g)",
    caloriesPer100g: 166,
    proteinPer100g: 7.9,
    carbsPer100g: 14.3,
    fatsPer100g: 9.6,
    fiberPer100g: 6.0
  },
  {
    name: "Tahini",
    category: "Middle Eastern",
    baseQuantity: "1 tbsp (15g)",
    caloriesPer100g: 595,
    proteinPer100g: 17.0,
    carbsPer100g: 23.0,
    fatsPer100g: 50.0,
    fiberPer100g: 9.3
  },
  {
    name: "Pita Bread",
    category: "Middle Eastern",
    baseQuantity: "1 pita (60g)",
    caloriesPer100g: 275,
    proteinPer100g: 9.0,
    carbsPer100g: 55.0,
    fatsPer100g: 1.2,
    fiberPer100g: 2.2
  },
  {
    name: "Tabbouleh",
    category: "Middle Eastern",
    baseQuantity: "100g",
    caloriesPer100g: 140,
    proteinPer100g: 3.5,
    carbsPer100g: 22.0,
    fatsPer100g: 7.0,
    fiberPer100g: 3.8
  },
  {
    name: "Falafel",
    category: "Middle Eastern",
    baseQuantity: "1 patty (17g)",
    caloriesPer100g: 333,
    proteinPer100g: 13.3,
    carbsPer100g: 31.8,
    fatsPer100g: 17.8,
    fiberPer100g: 9.6
  },
  {
    name: "Couscous",
    category: "Middle Eastern",
    baseQuantity: "100g cooked",
    caloriesPer100g: 112,
    proteinPer100g: 3.8,
    carbsPer100g: 23.2,
    fatsPer100g: 0.2,
    fiberPer100g: 1.4
  },
  {
    name: "Shawarma (Chicken)",
    category: "Middle Eastern",
    baseQuantity: "1 serving (150g)",
    caloriesPer100g: 233,
    proteinPer100g: 23.0,
    carbsPer100g: 6.0,
    fatsPer100g: 14.0,
    fiberPer100g: 1.0
  },
  {
    name: "Dolma (Stuffed Grape Leaves)",
    category: "Middle Eastern",
    baseQuantity: "5 pieces (100g)",
    caloriesPer100g: 149,
    proteinPer100g: 3.5,
    carbsPer100g: 17.0,
    fatsPer100g: 8.0,
    fiberPer100g: 5.8
  },
  {
    name: "Tzatziki",
    category: "Middle Eastern",
    baseQuantity: "2 tbsp (30g)",
    caloriesPer100g: 94,
    proteinPer100g: 3.7,
    carbsPer100g: 3.7,
    fatsPer100g: 7.0,
    fiberPer100g: 0.3
  },
  
  // African Cuisine
  {
    name: "Injera",
    category: "African",
    baseQuantity: "1 piece (56g)",
    caloriesPer100g: 141,
    proteinPer100g: 5.0,
    carbsPer100g: 29.0,
    fatsPer100g: 0.4,
    fiberPer100g: 3.5
  },
  {
    name: "Fufu",
    category: "African",
    baseQuantity: "100g",
    caloriesPer100g: 159,
    proteinPer100g: 0.9,
    carbsPer100g: 38.0,
    fatsPer100g: 0.2,
    fiberPer100g: 2.3
  },
  {
    name: "Jollof Rice",
    category: "African",
    baseQuantity: "1 cup (200g)",
    caloriesPer100g: 183,
    proteinPer100g: 4.0,
    carbsPer100g: 37.0,
    fatsPer100g: 3.0,
    fiberPer100g: 1.5
  },
  {
    name: "Doro Wat (Ethiopian Chicken Stew)",
    category: "African",
    baseQuantity: "1 serving (200g)",
    caloriesPer100g: 179,
    proteinPer100g: 18.0,
    carbsPer100g: 8.0,
    fatsPer100g: 9.0,
    fiberPer100g: 2.2
  },
  {
    name: "Suya (Spiced Meat Skewers)",
    category: "African",
    baseQuantity: "100g",
    caloriesPer100g: 250,
    proteinPer100g: 25.0,
    carbsPer100g: 2.0,
    fatsPer100g: 16.0,
    fiberPer100g: 0.8
  },
  
  // Indian Cuisine
  {
    name: "Lentil Dal",
    category: "Indian",
    baseQuantity: "1 cup (200g)",
    caloriesPer100g: 116,
    proteinPer100g: 9.0,
    carbsPer100g: 20.0,
    fatsPer100g: 0.4,
    fiberPer100g: 7.9
  },
  {
    name: "Chicken Tikka Masala",
    category: "Indian",
    baseQuantity: "1 serving (200g)",
    caloriesPer100g: 171,
    proteinPer100g: 14.0,
    carbsPer100g: 6.5,
    fatsPer100g: 10.5,
    fiberPer100g: 1.2
  },
  {
    name: "Saag Paneer",
    category: "Indian",
    baseQuantity: "1 cup (200g)",
    caloriesPer100g: 190,
    proteinPer100g: 11.0,
    carbsPer100g: 10.0,
    fatsPer100g: 12.0,
    fiberPer100g: 4.5
  },
  {
    name: "Samosa",
    category: "Indian",
    baseQuantity: "1 samosa (60g)",
    caloriesPer100g: 308,
    proteinPer100g: 6.0,
    carbsPer100g: 35.0,
    fatsPer100g: 16.0,
    fiberPer100g: 3.2
  },
  {
    name: "Chana Masala",
    category: "Indian",
    baseQuantity: "1 cup (200g)",
    caloriesPer100g: 130,
    proteinPer100g: 7.0,
    carbsPer100g: 20.0,
    fatsPer100g: 3.0,
    fiberPer100g: 8.5
  },
  {
    name: "Raita",
    category: "Indian",
    baseQuantity: "100g",
    caloriesPer100g: 70,
    proteinPer100g: 3.3,
    carbsPer100g: 5.2,
    fatsPer100g: 4.0,
    fiberPer100g: 0.5
  },
  {
    name: "Butter Chicken",
    category: "Indian",
    baseQuantity: "1 serving (200g)",
    caloriesPer100g: 200,
    proteinPer100g: 15.0,
    carbsPer100g: 6.0,
    fatsPer100g: 14.0,
    fiberPer100g: 0.8
  },
  
  // Carbohydrates
  { 
    name: "Brown Rice", 
    category: "Carbohydrate",
    baseQuantity: "100g cooked",
    caloriesPer100g: 112,
    proteinPer100g: 2.6,
    carbsPer100g: 23,
    fatsPer100g: 0.9,
    fiberPer100g: 1.8
  },
  { 
    name: "Quinoa", 
    category: "Carbohydrate",
    baseQuantity: "100g cooked",
    caloriesPer100g: 120,
    proteinPer100g: 4.4,
    carbsPer100g: 21.3,
    fatsPer100g: 1.9,
    fiberPer100g: 2.8
  },
  { 
    name: "Sweet Potato", 
    category: "Carbohydrate",
    baseQuantity: "100g",
    caloriesPer100g: 86,
    proteinPer100g: 1.6,
    carbsPer100g: 20.1,
    fatsPer100g: 0.1,
    fiberPer100g: 3.0
  },
  { 
    name: "Oatmeal", 
    category: "Carbohydrate",
    baseQuantity: "100g dry",
    caloriesPer100g: 389,
    proteinPer100g: 16.9,
    carbsPer100g: 66.3,
    fatsPer100g: 6.9,
    fiberPer100g: 10.6
  },
  { 
    name: "Whole Wheat Bread", 
    category: "Carbohydrate",
    baseQuantity: "1 slice (30g)",
    caloriesPer100g: 247,
    proteinPer100g: 13,
    carbsPer100g: 41,
    fatsPer100g: 3.4,
    fiberPer100g: 6.8
  },
  { 
    name: "Pasta", 
    category: "Carbohydrate",
    baseQuantity: "100g cooked",
    caloriesPer100g: 158,
    proteinPer100g: 5.8,
    carbsPer100g: 31,
    fatsPer100g: 0.9,
    fiberPer100g: 1.8
  },
  {
    name: "Buckwheat",
    category: "Carbohydrate",
    baseQuantity: "100g cooked",
    caloriesPer100g: 155,
    proteinPer100g: 5.7,
    carbsPer100g: 33.5,
    fatsPer100g: 1.0,
    fiberPer100g: 2.7
  },
  {
    name: "Barley",
    category: "Carbohydrate",
    baseQuantity: "100g cooked",
    caloriesPer100g: 123,
    proteinPer100g: 2.3,
    carbsPer100g: 28.2,
    fatsPer100g: 0.4,
    fiberPer100g: 3.8
  },
  {
    name: "Millet",
    category: "Carbohydrate",
    baseQuantity: "100g cooked",
    caloriesPer100g: 119,
    proteinPer100g: 3.5,
    carbsPer100g: 23.7,
    fatsPer100g: 1.0,
    fiberPer100g: 2.3
  },
  {
    name: "Amaranth",
    category: "Carbohydrate",
    baseQuantity: "100g cooked",
    caloriesPer100g: 102,
    proteinPer100g: 3.8,
    carbsPer100g: 18.7,
    fatsPer100g: 1.6,
    fiberPer100g: 2.1
  },
  
  // Fruits
  { 
    name: "Banana", 
    category: "Fruit",
    baseQuantity: "1 medium (118g)",
    caloriesPer100g: 89,
    proteinPer100g: 1.1,
    carbsPer100g: 22.8,
    fatsPer100g: 0.3,
    fiberPer100g: 2.6
  },
  { 
    name: "Apple", 
    category: "Fruit",
    baseQuantity: "1 medium (182g)",
    caloriesPer100g: 52,
    proteinPer100g: 0.3,
    carbsPer100g: 13.8,
    fatsPer100g: 0.2,
    fiberPer100g: 2.4
  },
  { 
    name: "Orange", 
    category: "Fruit",
    baseQuantity: "1 medium (131g)",
    caloriesPer100g: 47,
    proteinPer100g: 0.9,
    carbsPer100g: 11.8,
    fatsPer100g: 0.1,
    fiberPer100g: 2.4
  },
  { 
    name: "Berries", 
    category: "Fruit",
    baseQuantity: "100g",
    caloriesPer100g: 57,
    proteinPer100g: 0.7,
    carbsPer100g: 14.1,
    fatsPer100g: 0.3,
    fiberPer100g: 2.4
  },
  {
    name: "Mango",
    category: "Fruit",
    baseQuantity: "1 medium (207g)",
    caloriesPer100g: 60,
    proteinPer100g: 0.8,
    carbsPer100g: 15.0,
    fatsPer100g: 0.4,
    fiberPer100g: 1.6
  },
  {
    name: "Pineapple",
    category: "Fruit",
    baseQuantity: "1 cup chunks (165g)",
    caloriesPer100g: 50,
    proteinPer100g: 0.5,
    carbsPer100g: 13.1,
    fatsPer100g: 0.1,
    fiberPer100g: 1.4
  },
  {
    name: "Watermelon",
    category: "Fruit",
    baseQuantity: "1 cup (152g)",
    caloriesPer100g: 30,
    proteinPer100g: 0.6,
    carbsPer100g: 7.6,
    fatsPer100g: 0.2,
    fiberPer100g: 0.4
  },
  {
    name: "Grapes",
    category: "Fruit",
    baseQuantity: "1 cup (151g)",
    caloriesPer100g: 69,
    proteinPer100g: 0.7,
    carbsPer100g: 18.1,
    fatsPer100g: 0.2,
    fiberPer100g: 0.9
  },
  {
    name: "Kiwi",
    category: "Fruit",
    baseQuantity: "1 medium (76g)",
    caloriesPer100g: 61,
    proteinPer100g: 1.1,
    carbsPer100g: 14.7,
    fatsPer100g: 0.5,
    fiberPer100g: 3.0
  },
  {
    name: "Papaya",
    category: "Fruit",
    baseQuantity: "1 cup (140g)",
    caloriesPer100g: 43,
    proteinPer100g: 0.5,
    carbsPer100g: 10.8,
    fatsPer100g: 0.3,
    fiberPer100g: 1.7
  },
  {
    name: "Pomegranate",
    category: "Fruit",
    baseQuantity: "1/2 fruit (87g)",
    caloriesPer100g: 83,
    proteinPer100g: 1.7,
    carbsPer100g: 18.7,
    fatsPer100g: 1.2,
    fiberPer100g: 4.0
  },
  {
    name: "Dragon Fruit",
    category: "Fruit",
    baseQuantity: "100g",
    caloriesPer100g: 60,
    proteinPer100g: 1.2,
    carbsPer100g: 13.0,
    fatsPer100g: 0.4,
    fiberPer100g: 3.0
  },
  {
    name: "Lychee",
    category: "Fruit",
    baseQuantity: "1 cup (190g)",
    caloriesPer100g: 66,
    proteinPer100g: 0.8,
    carbsPer100g: 16.5,
    fatsPer100g: 0.4,
    fiberPer100g: 1.3
  },
  {
    name: "Durian",
    category: "Fruit",
    baseQuantity: "100g",
    caloriesPer100g: 147,
    proteinPer100g: 1.5,
    carbsPer100g: 27.0,
    fatsPer100g: 5.3,
    fiberPer100g: 3.8
  },
  {
    name: "Jackfruit",
    category: "Fruit",
    baseQuantity: "100g",
    caloriesPer100g: 95,
    proteinPer100g: 1.7,
    carbsPer100g: 23.5,
    fatsPer100g: 0.6,
    fiberPer100g: 1.5
  },
  
  // Fats
  { 
    name: "Avocado", 
    category: "Fat",
    baseQuantity: "1/2 medium (68g)",
    caloriesPer100g: 160,
    proteinPer100g: 2,
    carbsPer100g: 8.5,
    fatsPer100g: 14.7,
    fiberPer100g: 6.7
  },
  { 
    name: "Olive Oil", 
    category: "Fat",
    baseQuantity: "1 tbsp (15ml)",
    caloriesPer100g: 884,
    proteinPer100g: 0,
    carbsPer100g: 0,
    fatsPer100g: 93.3,
    fiberPer100g: 0
  },
  { 
    name: "Almonds", 
    category: "Fat",
    baseQuantity: "1 oz (28g)",
    caloriesPer100g: 579,
    proteinPer100g: 21,
    carbsPer100g: 21.6,
    fatsPer100g: 49.9,
    fiberPer100g: 12.5
  },
  { 
    name: "Peanut Butter", 
    category: "Fat",
    baseQuantity: "1 tbsp (16g)",
    caloriesPer100g: 588,
    proteinPer100g: 25,
    carbsPer100g: 20,
    fatsPer100g: 50,
    fiberPer100g: 6.0
  },
  {
    name: "Flax Seeds",
    category: "Fat",
    baseQuantity: "1 tbsp (10g)",
    caloriesPer100g: 534,
    proteinPer100g: 18.3,
    carbsPer100g: 28.9,
    fatsPer100g: 42.2,
    fiberPer100g: 27.3
  },
  {
    name: "Chia Seeds",
    category: "Fat",
    baseQuantity: "1 tbsp (12g)",
    caloriesPer100g: 486,
    proteinPer100g: 16.5,
    carbsPer100g: 42.1,
    fatsPer100g: 30.7,
    fiberPer100g: 34.4
  },
  {
    name: "Walnuts",
    category: "Fat",
    baseQuantity: "1 oz (28g)",
    caloriesPer100g: 654,
    proteinPer100g: 15.2,
    carbsPer100g: 13.7,
    fatsPer100g: 65.2,
    fiberPer100g: 6.7
  },
  {
    name: "Coconut Oil",
    category: "Fat",
    baseQuantity: "1 tbsp (14g)",
    caloriesPer100g: 892,
    proteinPer100g: 0,
    carbsPer100g: 0,
    fatsPer100g: 99.1,
    fiberPer100g: 0
  },

  // Vegetables
  { 
    name: "Broccoli", 
    category: "Vegetable",
    baseQuantity: "100g",
    caloriesPer100g: 34,
    proteinPer100g: 2.8,
    carbsPer100g: 6.6,
    fatsPer100g: 0.4,
    fiberPer100g: 2.6
  },
  { 
    name: "Spinach", 
    category: "Vegetable",
    baseQuantity: "100g",
    caloriesPer100g: 23,
    proteinPer100g: 2.9,
    carbsPer100g: 3.6,
    fatsPer100g: 0.4,
    fiberPer100g: 2.2
  },
  { 
    name: "Mixed Vegetables", 
    category: "Vegetable",
    baseQuantity: "100g",
    caloriesPer100g: 40,
    proteinPer100g: 2,
    carbsPer100g: 8,
    fatsPer100g: 0.4,
    fiberPer100g: 3.0
  },
  { 
    name: "Cucumber Slices", 
    category: "Vegetable",
    baseQuantity: "100g",
    caloriesPer100g: 15,
    proteinPer100g: 0.7,
    carbsPer100g: 3.6,
    fatsPer100g: 0.1,
    fiberPer100g: 0.5
  },
  { 
    name: "Steamed Broccoli", 
    category: "Vegetable",
    baseQuantity: "100g",
    caloriesPer100g: 35,
    proteinPer100g: 2.4,
    carbsPer100g: 7.2,
    fatsPer100g: 0.4,
    fiberPer100g: 3.3
  },
  { 
    name: "Roasted Vegetables", 
    category: "Vegetable",
    baseQuantity: "100g",
    caloriesPer100g: 80,
    proteinPer100g: 2.1,
    carbsPer100g: 11.5,
    fatsPer100g: 3.2,
    fiberPer100g: 3.0
  },
  {
    name: "Kale",
    category: "Vegetable",
    baseQuantity: "100g",
    caloriesPer100g: 49,
    proteinPer100g: 4.3,
    carbsPer100g: 8.8,
    fatsPer100g: 0.9,
    fiberPer100g: 3.6
  },
  {
    name: "Bell Pepper",
    category: "Vegetable",
    baseQuantity: "1 medium (119g)",
    caloriesPer100g: 31,
    proteinPer100g: 1.0,
    carbsPer100g: 6.0,
    fatsPer100g: 0.3,
    fiberPer100g: 2.1
  },
  {
    name: "Carrots",
    category: "Vegetable",
    baseQuantity: "1 medium (61g)",
    caloriesPer100g: 41,
    proteinPer100g: 0.9,
    carbsPer100g: 9.6,
    fatsPer100g: 0.2,
    fiberPer100g: 2.8
  },
  {
    name: "Tomato",
    category: "Vegetable",
    baseQuantity: "1 medium (123g)",
    caloriesPer100g: 18,
    proteinPer100g: 0.9,
    carbsPer100g: 3.9,
    fatsPer100g: 0.2,
    fiberPer100g: 1.2
  },
  {
    name: "Zucchini",
    category: "Vegetable",
    baseQuantity: "1 medium (196g)",
    caloriesPer100g: 17,
    proteinPer100g: 1.2,
    carbsPer100g: 3.1,
    fatsPer100g: 0.3,
    fiberPer100g: 1.0
  },
  {
    name: "Mushrooms",
    category: "Vegetable",
    baseQuantity: "100g",
    caloriesPer100g: 22,
    proteinPer100g: 3.1,
    carbsPer100g: 3.3,
    fatsPer100g: 0.3,
    fiberPer100g: 1.0
  },
  {
    name: "Eggplant",
    category: "Vegetable",
    baseQuantity: "100g",
    caloriesPer100g: 25,
    proteinPer100g: 1.0,
    carbsPer100g: 6.0,
    fatsPer100g: 0.2,
    fiberPer100g: 3.0
  },
  {
    name: "Cabbage",
    category: "Vegetable",
    baseQuantity: "100g",
    caloriesPer100g: 25,
    proteinPer100g: 1.3,
    carbsPer100g: 5.8,
    fatsPer100g: 0.1,
    fiberPer100g: 2.5
  },
  {
    name: "Bok Choy",
    category: "Vegetable",
    baseQuantity: "100g",
    caloriesPer100g: 13,
    proteinPer100g: 1.5,
    carbsPer100g: 2.2,
    fatsPer100g: 0.2,
    fiberPer100g: 1.0
  },
  {
    name: "Okra",
    category: "Vegetable",
    baseQuantity: "100g",
    caloriesPer100g: 33,
    proteinPer100g: 1.9,
    carbsPer100g: 7.5,
    fatsPer100g: 0.2,
    fiberPer100g: 3.2
  },
  {
    name: "Cassava",
    category: "Vegetable",
    baseQuantity: "100g",
    caloriesPer100g: 160,
    proteinPer100g: 1.4,
    carbsPer100g: 38.1,
    fatsPer100g: 0.3,
    fiberPer100g: 1.8
  },
  {
    name: "Taro",
    category: "Vegetable",
    baseQuantity: "100g",
    caloriesPer100g: 112,
    proteinPer100g: 1.5,
    carbsPer100g: 26.5,
    fatsPer100g: 0.2,
    fiberPer100g: 4.1
  },
  
  // Dairy
  { 
    name: "Milk", 
    category: "Dairy",
    baseQuantity: "100ml",
    caloriesPer100g: 42,
    proteinPer100g: 3.4,
    carbsPer100g: 5,
    fatsPer100g: 1,
    fiberPer100g: 0
  },
  { 
    name: "Cheese", 
    category: "Dairy",
    baseQuantity: "1 oz (28g)",
    caloriesPer100g: 402,
    proteinPer100g: 25,
    carbsPer100g: 1.3,
    fatsPer100g: 33,
    fiberPer100g: 0
  },
  {
    name: "Yogurt (Plain)",
    category: "Dairy",
    baseQuantity: "100g",
    caloriesPer100g: 61,
    proteinPer100g: 3.5,
    carbsPer100g: 4.7,
    fatsPer100g: 3.3,
    fiberPer100g: 0
  },
  {
    name: "Butter",
    category: "Dairy",
    baseQuantity: "1 tbsp (14g)",
    caloriesPer100g: 717,
    proteinPer100g: 0.9,
    carbsPer100g: 0.1,
    fatsPer100g: 81.1,
    fiberPer100g: 0
  },
  {
    name: "Cream Cheese",
    category: "Dairy",
    baseQuantity: "1 tbsp (15g)",
    caloriesPer100g: 350,
    proteinPer100g: 6.2,
    carbsPer100g: 5.5,
    fatsPer100g: 34.4,
    fiberPer100g: 0
  },
  {
    name: "Sour Cream",
    category: "Dairy",
    baseQuantity: "1 tbsp (15g)",
    caloriesPer100g: 198,
    proteinPer100g: 2.1,
    carbsPer100g: 4.6,
    fatsPer100g: 19.4,
    fiberPer100g: 0
  },
  
  // Seafood
  {
    name: "Shrimp",
    category: "Seafood",
    baseQuantity: "100g",
    caloriesPer100g: 99,
    proteinPer100g: 24.0,
    carbsPer100g: 0.2,
    fatsPer100g: 0.3,
    fiberPer100g: 0
  },
  {
    name: "Cod",
    category: "Seafood",
    baseQuantity: "100g",
    caloriesPer100g: 82,
    proteinPer100g: 18.0,
    carbsPer100g: 0,
    fatsPer100g: 0.7,
    fiberPer100g: 0
  },
  {
    name: "Crab",
    category: "Seafood",
    baseQuantity: "100g",
    caloriesPer100g: 97,
    proteinPer100g: 20.0,
    carbsPer100g: 0,
    fatsPer100g: 1.5,
    fiberPer100g: 0
  },
  {
    name: "Lobster",
    category: "Seafood",
    baseQuantity: "100g",
    caloriesPer100g: 89,
    proteinPer100g: 19.0,
    carbsPer100g: 0.5,
    fatsPer100g: 0.9,
    fiberPer100g: 0
  },
  {
    name: "Mussels",
    category: "Seafood",
    baseQuantity: "100g",
    caloriesPer100g: 86,
    proteinPer100g: 11.9,
    carbsPer100g: 3.4,
    fatsPer100g: 2.2,
    fiberPer100g: 0
  },
  {
    name: "Sardines",
    category: "Seafood",
    baseQuantity: "100g",
    caloriesPer100g: 208,
    proteinPer100g: 24.6,
    carbsPer100g: 0,
    fatsPer100g: 11.5,
    fiberPer100g: 0
  },
  {
    name: "Mackerel",
    category: "Seafood",
    baseQuantity: "100g",
    caloriesPer100g: 262,
    proteinPer100g: 19.0,
    carbsPer100g: 0,
    fatsPer100g: 17.8,
    fiberPer100g: 0
  },
  
  // Legumes
  {
    name: "Lentils",
    category: "Legume",
    baseQuantity: "100g cooked",
    caloriesPer100g: 116,
    proteinPer100g: 9.0,
    carbsPer100g: 20.0,
    fatsPer100g: 0.4,
    fiberPer100g: 8.0
  },
  {
    name: "Chickpeas",
    category: "Legume",
    baseQuantity: "100g cooked",
    caloriesPer100g: 164,
    proteinPer100g: 8.9,
    carbsPer100g: 27.4,
    fatsPer100g: 2.6,
    fiberPer100g: 7.6
  },
  {
    name: "Kidney Beans",
    category: "Legume",
    baseQuantity: "100g cooked",
    caloriesPer100g: 127,
    proteinPer100g: 8.7,
    carbsPer100g: 22.8,
    fatsPer100g: 0.5,
    fiberPer100g: 6.4
  },
  {
    name: "Pinto Beans",
    category: "Legume",
    baseQuantity: "100g cooked",
    caloriesPer100g: 143,
    proteinPer100g: 9.0,
    carbsPer100g: 26.2,
    fatsPer100g: 0.7,
    fiberPer100g: 9.0
  },
  {
    name: "Green Peas",
    category: "Legume",
    baseQuantity: "100g",
    caloriesPer100g: 81,
    proteinPer100g: 5.4,
    carbsPer100g: 14.5,
    fatsPer100g: 0.4,
    fiberPer100g: 5.1
  },
  {
    name: "Peanuts",
    category: "Legume",
    baseQuantity: "1 oz (28g)",
    caloriesPer100g: 567,
    proteinPer100g: 25.8,
    carbsPer100g: 16.1,
    fatsPer100g: 49.2,
    fiberPer100g: 8.5
  },
  {
    name: "Edamame",
    category: "Legume",
    baseQuantity: "100g",
    caloriesPer100g: 121,
    proteinPer100g: 12.0,
    carbsPer100g: 9.9,
    fatsPer100g: 5.2,
    fiberPer100g: 5.0
  },

  // Snacks and Supplements
  { 
    name: "Protein Bar", 
    category: "Supplement",
    baseQuantity: "1 bar (60g)",
    caloriesPer100g: 333,
    proteinPer100g: 33,
    carbsPer100g: 30,
    fatsPer100g: 10,
    fiberPer100g: 3.0
  },
  { 
    name: "Protein Smoothie", 
    category: "Supplement",
    baseQuantity: "300ml",
    caloriesPer100g: 67,
    proteinPer100g: 8.3,
    carbsPer100g: 5,
    fatsPer100g: 1,
    fiberPer100g: 0.3
  },
  { 
    name: "Trail Mix", 
    category: "Snack",
    baseQuantity: "1 oz (28g)",
    caloriesPer100g: 462,
    proteinPer100g: 16,
    carbsPer100g: 35,
    fatsPer100g: 30,
    fiberPer100g: 7.5
  },
  { 
    name: "Mixed Nuts", 
    category: "Snack",
    baseQuantity: "1 oz (28g)",
    caloriesPer100g: 607,
    proteinPer100g: 21,
    carbsPer100g: 16.2,
    fatsPer100g: 53.5,
    fiberPer100g: 8.3
  },
  { 
    name: "Honey", 
    category: "Carbohydrate",
    baseQuantity: "1 tbsp (21g)",
    caloriesPer100g: 304,
    proteinPer100g: 0.3,
    carbsPer100g: 82.4,
    fatsPer100g: 0,
    fiberPer100g: 0.2
  },
  {
    name: "Dark Chocolate",
    category: "Snack",
    baseQuantity: "1 oz (28g)",
    caloriesPer100g: 598,
    proteinPer100g: 7.8,
    carbsPer100g: 45.9,
    fatsPer100g: 43.0,
    fiberPer100g: 10.9
  },
  {
    name: "Popcorn (Air-popped)",
    category: "Snack",
    baseQuantity: "1 cup (8g)",
    caloriesPer100g: 387,
    proteinPer100g: 12.0,
    carbsPer100g: 77.9,
    fatsPer100g: 4.5,
    fiberPer100g: 14.5
  },
  {
    name: "Rice Cakes",
    category: "Snack",
    baseQuantity: "1 cake (9g)",
    caloriesPer100g: 387,
    proteinPer100g: 7.3,
    carbsPer100g: 80.9,
    fatsPer100g: 3.5,
    fiberPer100g: 1.8
  },
  {
    name: "Granola Bar",
    category: "Snack",
    baseQuantity: "1 bar (28g)",
    caloriesPer100g: 471,
    proteinPer100g: 8.2,
    carbsPer100g: 57.0,
    fatsPer100g: 20.0,
    fiberPer100g: 7.1
  },
  
  // Additional Meals
  { 
    name: "Turkey Sandwich", 
    category: "Mixed Meal",
    baseQuantity: "1 sandwich (150g)",
    caloriesPer100g: 233,
    proteinPer100g: 16.7,
    carbsPer100g: 23.3,
    fatsPer100g: 6.7,
    fiberPer100g: 2.0
  },
  { 
    name: "Grilled Chicken Pasta", 
    category: "Mixed Meal",
    baseQuantity: "1 serving (300g)",
    caloriesPer100g: 150,
    proteinPer100g: 11.7,
    carbsPer100g: 16.7,
    fatsPer100g: 3.3,
    fiberPer100g: 1.5
  },
  { 
    name: "Garlic Bread", 
    category: "Carbohydrate",
    baseQuantity: "1 slice (40g)",
    caloriesPer100g: 350,
    proteinPer100g: 7.5,
    carbsPer100g: 40,
    fatsPer100g: 17.5,
    fiberPer100g: 2.0
  },
  { 
    name: "Rice Pilaf", 
    category: "Carbohydrate",
    baseQuantity: "100g cooked",
    caloriesPer100g: 180,
    proteinPer100g: 4,
    carbsPer100g: 35,
    fatsPer100g: 3,
    fiberPer100g: 0.8
  },
  { 
    name: "Mass Gainer Shake", 
    category: "Supplement",
    baseQuantity: "1 serving (120g)",
    caloriesPer100g: 417,
    proteinPer100g: 33.3,
    carbsPer100g: 50,
    fatsPer100g: 8.3,
    fiberPer100g: 2.0
  },
  { 
    name: "Peanut Butter and Jelly Sandwich", 
    category: "Mixed Meal",
    baseQuantity: "1 sandwich (100g)",
    caloriesPer100g: 350,
    proteinPer100g: 12,
    carbsPer100g: 45,
    fatsPer100g: 16,
    fiberPer100g: 3.5
  },
  { 
    name: "Grilled Steak", 
    category: "Protein",
    baseQuantity: "100g",
    caloriesPer100g: 250,
    proteinPer100g: 26,
    carbsPer100g: 0,
    fatsPer100g: 17,
    fiberPer100g: 0
  },
  { 
    name: "Baked Salmon", 
    category: "Protein",
    baseQuantity: "100g",
    caloriesPer100g: 208,
    proteinPer100g: 22.5,
    carbsPer100g: 0,
    fatsPer100g: 13.5,
    fiberPer100g: 0
  },
];

// Helper functions for nutrition calculations
export const calculateNutrition = (foodName, quantity) => {
  const food = foodDatabase.find(item => item.name === foodName);
  if (!food) return null;
  
  // Handle the quantity string - allow for various formats
  const cleanQuantity = quantity.trim().toLowerCase();
  let quantityValue = parseFloat(cleanQuantity);
  let unit = cleanQuantity.replace(/^[\d.]+/, '').trim();
  
  // Default to grams if no unit specified
  if (isNaN(quantityValue)) return null;
  if (!unit) unit = 'g';
  
  // Convert unit to grams/ml for calculation
  let quantityInGrams = quantityValue;
  
  // Handle common units and special cases
  if (unit.includes('oz') || unit === 'ounce' || unit === 'ounces') {
    quantityInGrams = quantityValue * 28.35; // Convert oz to grams
  } else if (unit.includes('tbsp') || unit === 'tablespoon' || unit === 'tablespoons') {
    quantityInGrams = quantityValue * 15; // Approx 15g in a tablespoon
  } else if (unit.includes('tsp') || unit === 'teaspoon' || unit === 'teaspoons') {
    quantityInGrams = quantityValue * 5; // Approx 5g in a teaspoon
  } else if (unit.includes('cup') || unit === 'cups') {
    quantityInGrams = quantityValue * 240; // Approx 240g in a cup
  } else if (unit === 'ml' || unit === 'milliliter' || unit === 'milliliters') {
    quantityInGrams = quantityValue; // ml is approximately 1g for most liquids
  } else if (unit.includes('l') && !unit.includes('ml')) {
    quantityInGrams = quantityValue * 1000; // Convert liters to grams
  } else if (unit.includes('kg') || unit === 'kilogram' || unit === 'kilograms') {
    quantityInGrams = quantityValue * 1000; // Convert kg to grams
  } else if (unit.includes('lb') || unit === 'pound' || unit === 'pounds') {
    quantityInGrams = quantityValue * 453.592; // Convert pounds to grams
  } 
  
  // Handle special case measurements
  else if ((unit.includes('medium') || unit.includes('med')) && food.name.includes('Banana')) {
    quantityInGrams = quantityValue * 118; // Medium banana
  } else if ((unit.includes('large') || unit.includes('lg')) && food.name.includes('Banana')) {
    quantityInGrams = quantityValue * 136; // Large banana
  } else if ((unit.includes('small') || unit.includes('sm')) && food.name.includes('Banana')) {
    quantityInGrams = quantityValue * 90; // Small banana
  } else if ((unit.includes('medium') || unit.includes('med')) && food.name.includes('Apple')) {
    quantityInGrams = quantityValue * 182; // Medium apple
  } else if ((unit.includes('large') || unit.includes('lg')) && food.name.includes('Apple')) {
    quantityInGrams = quantityValue * 223; // Large apple
  } else if ((unit.includes('small') || unit.includes('sm')) && food.name.includes('Apple')) {
    quantityInGrams = quantityValue * 149; // Small apple
  } else if (unit.includes('scoop') && food.name.includes('Protein')) {
    quantityInGrams = quantityValue * 30; // Protein scoop approx 30g
  } else if (unit.includes('bar') && food.name.includes('Protein Bar')) {
    quantityInGrams = quantityValue * 60; // Protein bar approx 60g
  } else if (unit.includes('slice') && food.name.includes('Bread')) {
    quantityInGrams = quantityValue * 30; // Bread slice approx 30g
  } else if (unit.includes('piece') || unit.includes('pcs') || unit === 'piece' || unit === 'pieces') {
    // For piece, use the base quantity if available
    if (food.baseQuantity && food.baseQuantity.includes('(')) {
      const match = food.baseQuantity.match(/\((\d+)g\)/);
      if (match && match[1]) {
        quantityInGrams = quantityValue * parseInt(match[1]);
      }
    }
  } else if (unit.includes('serving') || unit === 'serve' || unit === 'serving') {
    // For serving, use a reasonable default or the base quantity
    if (food.baseQuantity && food.baseQuantity.includes('(')) {
      const match = food.baseQuantity.match(/\((\d+)g\)/);
      if (match && match[1]) {
        quantityInGrams = quantityValue * parseInt(match[1]);
      } else {
        quantityInGrams = quantityValue * 100; // Default to 100g per serving
      }
    } else {
      quantityInGrams = quantityValue * 100; // Default to 100g per serving
    }
  }
  
  // Calculate nutrition based on 100g values with better precision
  const nutritionPerUnit = quantityInGrams / 100;
  
  // Use toFixed(1) for more precise values but convert back to number
  return {
    calories: parseFloat((food.caloriesPer100g * nutritionPerUnit).toFixed(1)),
    protein: parseFloat((food.proteinPer100g * nutritionPerUnit).toFixed(1)),
    carbs: parseFloat((food.carbsPer100g * nutritionPerUnit).toFixed(1)),
    fats: parseFloat((food.fatsPer100g * nutritionPerUnit).toFixed(1)),
    fiber: parseFloat(((food.fiberPer100g || 0) * nutritionPerUnit).toFixed(1))
  };
};

// Function to get all food names for autocomplete
export const getAllFoodNames = () => {
  return foodDatabase.map(food => food.name);
};

// Function to get food categories for grouping
export const getFoodCategories = () => {
  return [...new Set(foodDatabase.map(food => food.category))];
};

// Function to get foods by category
export const getFoodsByCategory = (category) => {
  return foodDatabase.filter(food => food.category === category);
};

// Function to get food details by name
export const getFoodDetails = (foodName) => {
  return foodDatabase.find(food => food.name === foodName);
};

export default foodDatabase;