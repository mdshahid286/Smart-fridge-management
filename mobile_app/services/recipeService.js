// Recipe recommendation service
// Matches recipes to available inventory items

export const RECIPES = [
  {
    id: 1,
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
  },
  {
    id: 2,
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
  },
  {
    id: 3,
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
  },
  {
    id: 4,
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
  },
  {
    id: 5,
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
  },
  {
    id: 6,
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
  },
  {
    id: 7,
    name: "Apple Pie",
    image: "https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=400",
    ingredients: ["apples", "flour", "sugar", "butter", "cinnamon"],
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
  },
  {
    id: 8,
    name: "Carrot Soup",
    image: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=400",
    ingredients: ["carrots", "onion", "vegetable stock", "cream"],
    time: "30 min",
    difficulty: "Medium",
    instructions: [
      "Chop carrots and onion",
      "Sauté in butter",
      "Add stock and simmer",
      "Blend until smooth",
      "Stir in cream"
    ],
    category: "Soup",
    calories: 180,
  },
  {
    id: 9,
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
  },
  {
    id: 10,
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
  },
];

/**
 * Calculate match percentage between recipe and available inventory
 */
export const calculateRecipeMatch = (recipe, inventory) => {
  if (!inventory || inventory.length === 0) return 0;

  const inventoryNames = inventory.map(item => 
    typeof item === 'object' ? item.name.toLowerCase() : item.toLowerCase()
  );

  let matchCount = 0;
  recipe.ingredients.forEach(ingredient => {
    const matched = inventoryNames.some(invItem => 
      invItem.includes(ingredient.toLowerCase()) || 
      ingredient.toLowerCase().includes(invItem)
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
  const inventoryNames = inventory.map(item => 
    typeof item === 'object' ? item.name.toLowerCase() : item.toLowerCase()
  );

  return recipe.ingredients.filter(ingredient => {
    return !inventoryNames.some(invItem => 
      invItem.includes(ingredient.toLowerCase()) || 
      ingredient.toLowerCase().includes(invItem)
    );
  });
};

/**
 * Get ingredient emoji based on name
 */
export const getIngredientEmoji = (ingredient) => {
  const emojiMap = {
    tomato: '🍅',
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
    cheese: '🧀',
    cucumber: '🥒',
    feta: '🧀',
    olive: '🫒',
    eggs: '🥚',
    milk: '🥛',
    butter: '🧈',
    apples: '🍎',
    flour: '🌾',
    sugar: '🍬',
    cinnamon: '🥄',
    carrots: '🥕',
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
  };

  return emojiMap[ingredient.toLowerCase()] || '🔸';
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

