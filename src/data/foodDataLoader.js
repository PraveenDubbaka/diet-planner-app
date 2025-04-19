// Fetch and return an array of { name, category, baseQuantity, caloriesPer100g, proteinPer100g, carbsPer100g, fatsPer100g, fiberPer100g }
export async function fetchAllFoods(apiKey) {
  let foods = [], page = 1, pageSize = 200;
  while (true) {
    const res = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/list?api_key=${apiKey}&pageSize=${pageSize}&pageNumber=${page}`
    );
    const batch = await res.json();
    if (!batch.length) break;
    foods.push(
      ...batch.map(f => ({
        name: f.description,
        category: f.foodCategory || 'Other',
        baseQuantity: '100g',
        caloriesPer100g: f.foodNutrients.find(n=>n.nutrientName==='Energy')?.value || 0,
        proteinPer100g: f.foodNutrients.find(n=>n.nutrientName==='Protein')?.value || 0,
        carbsPer100g: f.foodNutrients.find(n=>n.nutrientName==='Carbohydrate, by difference')?.value || 0,
        fatsPer100g: f.foodNutrients.find(n=>n.nutrientName==='Total lipid (fat)')?.value || 0,
        fiberPer100g: f.foodNutrients.find(n=>n.nutrientName==='Fiber, total dietary')?.value || 0,
      }))
    );
    page++;
  }
  return foods;
}
