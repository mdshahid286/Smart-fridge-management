# 🍳 Recipe Recommendations Feature

## Overview
The Smart Refrigerator app now includes an intelligent **Recipe Recommendations** feature that suggests recipes based on the items detected in your fridge by the ESP32-CAM.

## ✨ Features

### 1. **Smart Recipe Matching**
- Analyzes your current inventory
- Calculates match percentage for each recipe
- Shows which ingredients you have vs. what's missing
- Prioritizes recipes you can make right now

### 2. **Visual Inventory Status**
- **🟢 Green Dot**: Item in stock (quantity > 5)
- **🟡 Yellow Dot**: Low stock warning (quantity 3-5)
- **🔴 Red Dot**: Critical/expiring (quantity ≤ 2)

### 3. **Recipe Details Modal**
- Full ingredient list with availability status
- Step-by-step cooking instructions
- Preparation time and difficulty level
- Calorie information
- Match percentage badge

### 4. **Recipe Categories**
- Breakfast (Scrambled Eggs, Avocado Toast, Yogurt Parfait)
- Salads (Greek Salad, Caesar Salad, Caprese)
- Main Courses (Chicken Stir-Fry, Beef Tacos)
- Soups (Carrot Soup)
- Desserts (Apple Pie)

## 📱 Navigation

The app now has **5 tabs** in the bottom navigation:

```
🏠 Home → Dashboard overview
📦 Inventory → Manage detected items
🍳 Recipes → Recipe recommendations
📷 Monitor → ESP32-CAM status
⚙️ Settings → App configuration
```

## 🧠 How Recipe Matching Works

### Algorithm
```javascript
matchPercentage = (availableIngredients / totalIngredients) × 100
```

### Matching Rules
- **≥ 75%**: High match (green badge) - You can make this!
- **50-74%**: Medium match (yellow badge) - Missing a few items
- **30-49%**: Low match (red badge) - Need more ingredients
- **< 30%**: Not shown in recommendations

### Example
**Recipe**: Chicken Stir-Fry
- Ingredients needed: chicken, vegetables, soy sauce, oil (4 items)
- You have: chicken, oil (2 items)
- Match: 50% (2/4)

## 📂 New Files Created

### 1. `services/recipeService.js`
```javascript
export const RECIPES = [...];  // 10 built-in recipes
export const getRecommendedRecipes(inventory, minMatch);
export const calculateRecipeMatch(recipe, inventory);
export const getMissingIngredients(recipe, inventory);
export const getIngredientEmoji(ingredient);
```

### 2. `components/RecipeCard.js`
Displays recipe with:
- Recipe image
- Match percentage badge
- Ingredient icons (emojis)
- Preparation time
- Missing ingredients count

### 3. `screens/Recipes.js`
Main recipe screen featuring:
- Inventory summary with horizontal scroll
- Recommended recipes (sorted by match %)
- "Show All Recipes" expansion
- Recipe details modal
- Pull-to-refresh

## 🎨 UI Design Highlights

### Inventory List
```
┌─────────────────────────────────────┐
│ 🥛 Milk              1 bottle    🟢 │
│ 🥚 Eggs              12 units    🟢 │
│ 🍎 Apples            4 units     🟢 │
│ 🥬 Lettuce           1 head      🟢 │
│ 🧃 Orange Juice      half-full   🟡 │
│ 🥕 Carrots           5 units     🟡 │
│ 🍨 Yogurt            2 units     🔴 │
│ 🍗 Chicken           1 piece     🔴 │
└─────────────────────────────────────┘
```

### Recipe Card
```
┌─────────────────────────────────────┐
│ ┌─────────────────────────────────┐ │
│ │     [Recipe Image]        75%   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Chicken Stir-Fry                   │
│ 🍗 🥦 🥢 🫒                         │
│ ⏱️ 20 min          Missing: 1      │
└─────────────────────────────────────┘
```

## 🔧 Integration with Existing Features

### ESP32-CAM Workflow
1. ESP32-CAM captures image → Backend detects items
2. Items added to inventory with quantity
3. Recipe service calculates matches
4. Recommendations update automatically

### Status Indicators
The same status logic applies across:
- Inventory list (colored dots)
- Recipe screen (inventory chips)
- Dashboard (statistics)

### Navigation Flow
```
Dashboard
  └─> View Inventory → Edit Items
  └─> Check Camera → View recent captures
  └─> Browse Recipes → View details → Navigate to Inventory

Recipes
  └─> View Inventory → Add missing ingredients
  └─> Recipe Details → See what's needed
```

## 🎯 Sample Recipes Included

1. **Tomato and Mozzarella Salad** (10 min, Easy)
2. **Chicken Stir-Fry** (20 min, Medium)
3. **Avocado Toast** (5 min, Easy)
4. **Beef Tacos** (25 min, Medium)
5. **Greek Salad** (10 min, Easy)
6. **Scrambled Eggs** (8 min, Easy)
7. **Apple Pie** (60 min, Hard)
8. **Carrot Soup** (30 min, Medium)
9. **Chicken Caesar Salad** (15 min, Easy)
10. **Yogurt Parfait** (5 min, Easy)

## 🚀 Future Enhancements

### Potential Features
- [ ] Add custom recipes
- [ ] Share recipes with friends
- [ ] Nutritional information breakdown
- [ ] Dietary filters (vegetarian, vegan, gluten-free)
- [ ] Shopping list generation for missing ingredients
- [ ] Recipe favorites/bookmarks
- [ ] Search and filter recipes
- [ ] Integration with meal planning
- [ ] Voice-guided cooking instructions
- [ ] Recipe rating and reviews

### AI Enhancements
- [ ] Generate recipes based on available items using GPT
- [ ] Suggest substitutions for missing ingredients
- [ ] Personalized recommendations based on history
- [ ] Expiry date-based recipe urgency

## 📊 Technical Details

### Data Flow
```
ESP32-CAM → Flask Backend → Database (JSON)
                              ↓
Mobile App (Fetch Inventory) ← API
                              ↓
Recipe Service (Calculate Matches)
                              ↓
Display Sorted Recommendations
```

### State Management
```javascript
// Recipes screen state
const [inventory, setInventory] = useState([]);
const [recommendedRecipes, setRecommendedRecipes] = useState([]);
const [allRecipes, setAllRecipes] = useState([]);
const [selectedRecipe, setSelectedRecipe] = useState(null);
```

### Performance
- Recipes load instantly (pre-defined data)
- Match calculation: O(n×m) where n = recipes, m = inventory
- Images lazy-loaded from URLs
- Pull-to-refresh updates inventory and recalculates

## 🎓 How to Use

### For Users
1. **Open Recipes Tab** (🍳 icon in bottom navigation)
2. **View Your Inventory** (horizontal scrolling chips at top)
3. **Browse Recommendations** (sorted by best match)
4. **Tap a Recipe** to see full details
5. **Check Missing Ingredients** (marked in red)
6. **Follow Instructions** step by step

### For Developers
```javascript
// Add new recipe
import { RECIPES } from './services/recipeService';

RECIPES.push({
  id: 11,
  name: "Your Recipe Name",
  image: "https://...",
  ingredients: ["item1", "item2", ...],
  time: "15 min",
  difficulty: "Easy",
  instructions: ["Step 1", "Step 2", ...],
  category: "Main Course",
  calories: 400,
});
```

## 🐛 Testing

### Test Scenarios
1. **Empty Inventory**: Should show "Browse All Recipes" option
2. **Partial Match**: Should show recipes with missing ingredients highlighted
3. **Full Match**: Should show 100% badge and no missing items
4. **Low Stock Items**: Should show yellow/red dots
5. **Modal Interaction**: Should open/close smoothly

### Test Commands
```bash
cd Smart-Refrigerator/mobile_app
npm start

# Test on physical device or emulator
# Navigate to Recipes tab
# Pull down to refresh
# Tap recipe cards
```

## 📝 Notes

- Recipe images are fetched from Unsplash (requires internet)
- Ingredient matching is case-insensitive and uses partial matching
- Status colors update dynamically based on quantity
- All screens support pull-to-refresh
- Bottom tab bar height increased to 70px for full visibility

## 🎉 Summary

The Recipe Recommendations feature transforms your Smart Refrigerator from a simple inventory tracker into an intelligent cooking assistant. It leverages the ESP32-CAM's automatic detection to provide real-time, personalized recipe suggestions based on what you actually have in your fridge.

**Key Benefits:**
- ✅ Reduces food waste by suggesting recipes before items expire
- ✅ Saves time planning meals
- ✅ Helps discover new recipes with available ingredients
- ✅ Visual status indicators for quick inventory assessment
- ✅ Seamless integration with automatic detection

---

**Ready to cook? Open the Recipes tab and start exploring!** 🍳👨‍🍳

