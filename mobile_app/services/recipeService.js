// Recipe recommendation service
// Matches recipes to available inventory items

export const RECIPES = [
  // Recipes that match YOLOv8 detectable items (shown first)
  {
    id: 1,
    name: "Fresh Fruit Salad",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
    ingredients: ["apple", "banana", "orange"],
    time: "5 min",
    difficulty: "Easy",
    instructions: [
      "Wash and prepare fruits",
      "Slice apple into cubes",
      "Slice banana into rounds",
      "Peel and segment orange",
      "Mix all fruits together in a bowl",
      "Serve chilled"
    ],
    category: "Salad",
    calories: 150,
  },
  {
    id: 2,
    name: "Vegetable Platter",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
    ingredients: ["broccoli", "carrot"],
    time: "10 min",
    difficulty: "Easy",
    instructions: [
      "Wash and cut vegetables",
      "Steam broccoli for 5 minutes",
      "Slice carrots into sticks",
      "Arrange on platter",
      "Serve with your favorite dip"
    ],
    category: "Appetizer",
    calories: 80,
  },
  {
    id: 3,
    name: "Pizza Slice",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400",
    ingredients: ["pizza"],
    time: "2 min",
    difficulty: "Easy",
    instructions: [
      "Heat pizza slice in oven or microwave",
      "Serve hot and enjoy!"
    ],
    category: "Main Course",
    calories: 300,
  },
  {
    id: 4,
    name: "Donut Delight",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400",
    ingredients: ["donut"],
    time: "1 min",
    difficulty: "Easy",
    instructions: [
      "Serve donut on a plate",
      "Enjoy as a sweet treat!"
    ],
    category: "Dessert",
    calories: 250,
  },
  {
    id: 5,
    name: "Cake Slice",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
    ingredients: ["cake"],
    time: "1 min",
    difficulty: "Easy",
    instructions: [
      "Slice cake into serving portions",
      "Serve on a plate",
      "Enjoy your dessert!"
    ],
    category: "Dessert",
    calories: 350,
  },
  {
    id: 6,
    name: "Sandwich Platter",
    image: "https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=400",
    ingredients: ["sandwich"],
    time: "2 min",
    difficulty: "Easy",
    instructions: [
      "Prepare sandwich",
      "Cut in half",
      "Serve with sides"
    ],
    category: "Main Course",
    calories: 400,
  },
  {
    id: 7,
    name: "Hot Dog",
    image: "https://images.unsplash.com/photo-1550617938-3f0d42b3f7d4?w=400",
    ingredients: ["hot dog"],
    time: "5 min",
    difficulty: "Easy",
    instructions: [
      "Heat hot dog",
      "Place in bun",
      "Add your favorite toppings",
      "Serve hot"
    ],
    category: "Main Course",
    calories: 280,
  },
  {
    id: 8,
    name: "Apple Pie",
    image: "https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=400",
    ingredients: ["apple"],
    time: "60 min",
    difficulty: "Hard",
    instructions: [
      "Make pie crust",
      "Slice apples thin",
      "Mix with cinnamon and sugar",
      "Fill crust with apples",
      "Bake at 375°F for 45 minutes"
    ],
    category: "Dessert",
    calories: 420,
    note: "Requires additional ingredients: flour, sugar, butter, cinnamon"
  },
  {
    id: 9,
    name: "Carrot Soup",
    image: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=400",
    ingredients: ["carrot"],
    time: "30 min",
    difficulty: "Medium",
    instructions: [
      "Chop carrots",
      "Sauté in butter",
      "Add stock and simmer",
      "Blend until smooth",
      "Stir in cream"
    ],
    category: "Soup",
    calories: 180,
    note: "Requires additional ingredients: onion, vegetable stock, cream"
  },
  {
    id: 10,
    name: "Tomato and Mozzarella Salad",
    image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=400",
    ingredients: ["tomato", "mozzarella", "basil", "olive oil"],
    time: "10 min",
    difficulty: "Easy",
    instructions: [
      "Slice tomatoes and mozzarella",
      "Arrange on a plate",
      "Add fresh basil leaves",
      "Drizzle with olive oil",
      "Season with salt and pepper"
    ],
    category: "Salad",
    calories: 250,
    note: "Manual ingredients - add manually to inventory"
  },
  {
    id: 11,
    name: "Chicken Stir-Fry",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400",
    ingredients: ["chicken", "vegetables", "soy sauce", "oil"],
    time: "20 min",
    difficulty: "Medium",
    instructions: [
      "Cut chicken into strips",
      "Heat oil in wok",
      "Stir-fry chicken until golden",
      "Add vegetables and sauce",
      "Cook for 5 minutes"
    ],
    category: "Main Course",
    calories: 450,
    note: "Manual ingredients - add manually to inventory"
  },
  {
    id: 12,
    name: "Avocado Toast",
    image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400",
    ingredients: ["avocado", "bread", "salt", "pepper"],
    time: "5 min",
    difficulty: "Easy",
    instructions: [
      "Toast bread slices",
      "Mash avocado with fork",
      "Spread on toast",
      "Season with salt and pepper",
      "Optional: add lemon juice"
    ],
    category: "Breakfast",
    calories: 320,
    note: "Manual ingredients - add manually to inventory"
  },
  {
    id: 13,
    name: "Beef Tacos",
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400",
    ingredients: ["beef", "tortilla", "onion", "cheese"],
    time: "25 min",
    difficulty: "Medium",
    instructions: [
      "Brown ground beef",
      "Add taco seasoning",
      "Warm tortillas",
      "Fill with beef and toppings",
      "Serve with cheese and onions"
    ],
    category: "Main Course",
    calories: 550,
    note: "Manual ingredients - add manually to inventory"
  },
  {
    id: 14,
    name: "Greek Salad",
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400",
    ingredients: ["cucumber", "tomato", "feta", "olive", "onion"],
    time: "10 min",
    difficulty: "Easy",
    instructions: [
      "Chop cucumber and tomato",
      "Add sliced onion",
      "Crumble feta cheese",
      "Add olives",
      "Dress with olive oil and lemon"
    ],
    category: "Salad",
    calories: 200,
    note: "Manual ingredients - add manually to inventory"
  },
  {
    id: 15,
    name: "Scrambled Eggs",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400",
    ingredients: ["eggs", "milk", "butter", "salt"],
    time: "8 min",
    difficulty: "Easy",
    instructions: [
      "Beat eggs with milk",
      "Melt butter in pan",
      "Pour egg mixture",
      "Stir gently until cooked",
      "Season with salt and pepper"
    ],
    category: "Breakfast",
    calories: 280,
    note: "Manual ingredients - add manually to inventory"
  },
  {
    id: 16,
    name: "Chicken Caesar Salad",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400",
    ingredients: ["chicken", "lettuce", "parmesan", "croutons", "caesar dressing"],
    time: "15 min",
    difficulty: "Easy",
    instructions: [
      "Grill or cook chicken",
      "Chop lettuce",
      "Slice chicken",
      "Toss with dressing",
      "Top with parmesan and croutons"
    ],
    category: "Salad",
    calories: 380,
    note: "Manual ingredients - add manually to inventory"
  },
  {
    id: 17,
    name: "Yogurt Parfait",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400",
    ingredients: ["yogurt", "granola", "berries", "honey"],
    time: "5 min",
    difficulty: "Easy",
    instructions: [
      "Layer yogurt in glass",
      "Add granola",
      "Top with fresh berries",
      "Drizzle with honey",
      "Repeat layers"
    ],
    category: "Breakfast",
    calories: 220,
    note: "Manual ingredients - add manually to inventory"
  },
];

/**
 * Calculate match percentage between recipe and available inventory
 */
// Mapping of recipe ingredients to detected item names
// This helps match recipe ingredients with YOLOv8 detected items
const INGREDIENT_MAPPING = {
  // Direct matches
  'apple': ['apple'],
  'banana': ['banana'],
  'orange': ['orange'],
  'broccoli': ['broccoli'],
  'carrot': ['carrot'],
  'pizza': ['pizza'],
  'donut': ['donut'],
  'cake': ['cake'],
  'sandwich': ['sandwich'],
  'hot dog': ['hot dog'],
  
  // Container matches (bottles/cups/bowls might contain these)
  'bottle': ['bottle'],
  'cup': ['cup'],
  'bowl': ['bowl'],
  'wine glass': ['wine glass'],
  
  // Generic matches (if detected items might contain these)
  'vegetables': ['broccoli', 'carrot'],
  'fruits': ['apple', 'banana', 'orange'],
  
  // Partial matches (for items that might be in containers)
  'milk': ['bottle', 'cup'],
  'juice': ['bottle', 'cup'],
  'yogurt': ['cup', 'bowl'],
  'soup': ['bowl', 'cup'],
  'water': ['bottle', 'cup'],
};

// Helper function to check if ingredient matches inventory item
const matchesIngredient = (ingredient, inventoryItem) => {
  const ingLower = ingredient.toLowerCase().trim();
  const invLower = inventoryItem.toLowerCase().trim();
  
  // Direct match
  if (ingLower === invLower) return true;
  
  // Check if ingredient contains inventory item or vice versa
  if (ingLower.includes(invLower) || invLower.includes(ingLower)) return true;
  
  // Check ingredient mapping
  if (INGREDIENT_MAPPING[ingLower]) {
    return INGREDIENT_MAPPING[ingLower].some(mapped => 
      invLower.includes(mapped) || mapped.includes(invLower)
    );
  }
  
  // Check reverse mapping (inventory item might map to ingredient)
  for (const [key, values] of Object.entries(INGREDIENT_MAPPING)) {
    if (values.includes(invLower) && ingLower.includes(key)) return true;
  }
  
  return false;
};

export const calculateRecipeMatch = (recipe, inventory) => {
  if (!inventory || inventory.length === 0) return 0;
  if (!recipe || !recipe.ingredients || recipe.ingredients.length === 0) return 0;

  const inventoryNames = inventory.map(item => 
    typeof item === 'object' ? item.name.toLowerCase() : item.toLowerCase()
  );

  let matchCount = 0;
  recipe.ingredients.forEach(ingredient => {
    const matched = inventoryNames.some(invItem => 
      matchesIngredient(ingredient, invItem)
    );
    if (matched) matchCount++;
  });

  return Math.round((matchCount / recipe.ingredients.length) * 100);
};

/**
 * Get recommended recipes based on available inventory
 * Returns recipes sorted by match percentage
 */
export const getRecommendedRecipes = (inventory, minMatchPercentage = 30) => {
  const recipesWithMatch = RECIPES.map(recipe => ({
    ...recipe,
    matchPercentage: calculateRecipeMatch(recipe, inventory),
    missingIngredients: getMissingIngredients(recipe, inventory),
  }));

  // Filter and sort by match percentage
  return recipesWithMatch
    .filter(recipe => recipe.matchPercentage >= minMatchPercentage)
    .sort((a, b) => b.matchPercentage - a.matchPercentage);
};

/**
 * Get all recipes (for browsing)
 */
export const getAllRecipes = (inventory = []) => {
  return RECIPES.map(recipe => ({
    ...recipe,
    matchPercentage: calculateRecipeMatch(recipe, inventory),
    missingIngredients: getMissingIngredients(recipe, inventory),
  }));
};

/**
 * Get missing ingredients for a recipe
 */
export const getMissingIngredients = (recipe, inventory) => {
  if (!inventory || inventory.length === 0) {
    return recipe.ingredients || [];
  }
  
  const inventoryNames = inventory.map(item => 
    typeof item === 'object' ? item.name.toLowerCase() : item.toLowerCase()
  );

  return recipe.ingredients.filter(ingredient => {
    return !inventoryNames.some(invItem => 
      matchesIngredient(ingredient, invItem)
    );
  });
};

/**
 * Get ingredient emoji based on name
 */
export const getIngredientEmoji = (ingredient) => {
  if (!ingredient || typeof ingredient !== 'string') {
    return '🔸';
  }
  
  const ingredientLower = ingredient.toLowerCase().trim();
  const emojiMap = {
    tomato: '🍅',
    tomatoes: '🍅',
    mozzarella: '🧀',
    basil: '🌿',
    'olive oil': '🫒',
    chicken: '🍗',
    vegetables: '🥦',
    'soy sauce': '🥢',
    oil: '🫒',
    avocado: '🥑',
    bread: '🍞',
    salt: '🧂',
    pepper: '🌶️',
    beef: '🥩',
    tortilla: '🌮',
    onion: '🧅',
    onions: '🧅',
    cheese: '🧀',
    cucumber: '🥒',
    cucumbers: '🥒',
    feta: '🧀',
    olive: '🫒',
    olives: '🫒',
    eggs: '🥚',
    egg: '🥚',
    milk: '🥛',
    butter: '🧈',
    apples: '🍎',
    apple: '🍎',
    flour: '🌾',
    sugar: '🍬',
    cinnamon: '🥄',
    carrots: '🥕',
    carrot: '🥕',
    'vegetable stock': '🥣',
    cream: '🥛',
    lettuce: '🥬',
    parmesan: '🧀',
    croutons: '🍞',
    'caesar dressing': '🥗',
    yogurt: '🍨',
    granola: '🥣',
    berries: '🫐',
    honey: '🍯',
    // Additional common items
    banana: '🍌',
    bananas: '🍌',
    orange: '🍊',
    oranges: '🍊',
    broccoli: '🥦',
    potato: '🥔',
    potatoes: '🥔',
    rice: '🍚',
    pasta: '🍝',
    fish: '🐟',
    pork: '🥓',
    turkey: '🦃',
  };

  // Check exact match first
  if (emojiMap[ingredientLower]) {
    return emojiMap[ingredientLower];
  }
  
  // Check if any key contains the ingredient or vice versa
  for (const key in emojiMap) {
    if (ingredientLower.includes(key) || key.includes(ingredientLower)) {
      return emojiMap[key];
    }
  }

  return '🔸';
};

/**
 * Get recipes by category
 */
export const getRecipesByCategory = (category, inventory = []) => {
  return getAllRecipes(inventory).filter(recipe => recipe.category === category);
};

/**
 * Search recipes by name
 */
export const searchRecipes = (query, inventory = []) => {
  const lowerQuery = query.toLowerCase();
  return getAllRecipes(inventory).filter(recipe => 
    recipe.name.toLowerCase().includes(lowerQuery) ||
    recipe.ingredients.some(ing => ing.toLowerCase().includes(lowerQuery))
  );
};

