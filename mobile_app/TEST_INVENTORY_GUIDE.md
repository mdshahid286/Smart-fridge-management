# 🔍 Testing Inventory Screen

## Current Setup
The Inventory screen should display all 15 mock items with:
- Large emoji icons (60×60px)
- Item name, quantity, category
- Status dots (🟢🟡🔴)
- Search functionality
- Category filter
- Edit capability

## Console Logs to Check

When you open the Inventory tab, you should see:

```
📦 Fetching inventory...
📦 Returning mock inventory data
✅ Inventory loaded: 15 items
📋 First item: {name: "Milk", quantity: 1, status: "In Stock", ...}
🔍 Rendering Inventory with 15 filtered items
📊 Total items: 15
🔎 Search query: 
🏷️ Selected category: All
Rendering item 0: Milk
Rendering item 1: Eggs
... (15 items total)
```

## If Items Are Not Showing

### 1. Check Mock Data is Enabled
```javascript
// In data/mockData.js (line 151)
export const USE_MOCK_DATA = true;  // Must be true
```

### 2. Check Console for Errors
Look for:
- ❌ Error messages
- Missing imports
- Navigation issues

### 3. Restart the App
```bash
# Stop the metro bundler
Ctrl+C

# Clear cache and restart
npm start -- --clear
```

### 4. Check Navigation
The Inventory is in a Stack Navigator:
- Tab: "Inventory" 
- Stack Screen: "InventoryList"
- Can navigate to: "EditItem", "AddItem"

## Expected UI

```
┌────────────────────────────────────┐
│ [🔍 Search items...          ✕]   │
│                                    │
│ [All] [Dairy] [Vegetables]...      │
│                                    │
│ 15 items                           │
│                                    │
│ ┌───────────────────────────────┐ │
│ │ ┌────┐                        │ │
│ │ │ 🥛 │ Milk               🟢 │ │
│ │ └────┘ 1 bottle            › │ │
│ │        Dairy                  │ │
│ └───────────────────────────────┘ │
│                                    │
│ ┌───────────────────────────────┐ │
│ │ ┌────┐                        │ │
│ │ │ 🥚 │ Eggs               🟢 │ │
│ │ └────┘ 12 units            › │ │
│ │        Dairy                  │ │
│ └───────────────────────────────┘ │
│                                    │
│ ┌───────────────────────────────┐ │
│ │ ┌────┐                        │ │
│ │ │ 🍎 │ Apples             🟢 │ │
│ │ └────┘ 4 units             › │ │
│ │        Fruits                 │ │
│ └───────────────────────────────┘ │
│                                    │
│                              [+]   │
└────────────────────────────────────┘
```

## Test Steps

1. **Open App**
2. **Go to Inventory Tab** (📦 icon)
3. **You should see:**
   - Search bar at top
   - Category chips below
   - "15 items" counter
   - 15 item cards with large icons
   - Floating + button

4. **Test Search:**
   - Type "milk" → Should show 1 item
   - Clear search → Back to 15 items

5. **Test Category Filter:**
   - Tap "Dairy" → Should show 5 items
   - Tap "All" → Back to 15 items

6. **Test Edit:**
   - Tap any item card
   - Should navigate to Edit Item screen
   - See item details in form

7. **Test Add:**
   - Tap the + button
   - Should navigate to Add Item screen

## If Still Not Working

### Check File Exists
```bash
cd Smart-Refrigerator/mobile_app
ls -la data/mockData.js
ls -la services/recipeService.js
```

### Verify Imports
```javascript
// In Inventory.js
import { getInventory } from "../api";
import { getIngredientEmoji } from "../services/recipeService";
```

### Reload App
```bash
# In Expo:
Press 'r' to reload
Press 'Shift+m' for menu
```

### Check React Native Debugger
1. Shake device (physical) or Cmd+D (iOS) / Cmd+M (Android)
2. Select "Debug"
3. Open Chrome DevTools
4. Check Console tab

## Common Issues

### Issue 1: "Cannot read property 'name' of undefined"
**Solution:** Item structure doesn't match expected format
Check mock data structure in `data/mockData.js`

### Issue 2: "getIngredientEmoji is not a function"
**Solution:** Recipe service not imported
Check if `services/recipeService.js` exists

### Issue 3: Empty screen (no loading, no error)
**Solution:** Navigation not set up correctly
Check `App.js` → InventoryStack configuration

### Issue 4: Items show but tapping doesn't navigate
**Solution:** Navigation prop not passed correctly
Check the Stack Navigator setup

## Debug Mode

To enable extra debugging, add this to top of Inventory.js:

```javascript
const DEBUG = true;

// Then use:
if (DEBUG) console.log("Debug info:", data);
```

## Expected Mock Items (15 Total)

1. 🥛 Milk - 1 bottle - In Stock - Dairy
2. 🥚 Eggs - 12 units - In Stock - Dairy
3. 🍎 Apples - 4 units - In Stock - Fruits
4. 🥬 Lettuce - 1 head - In Stock - Vegetables
5. 🧃 Orange Juice - 1 unit - Half Full - Beverages
6. 🥕 Carrots - 5 units - Warning - Vegetables
7. 🍨 Yogurt - 2 units - Low Stock - Dairy
8. 🍗 Chicken - 1 piece - Expiring Soon - Meat
9. 🍅 Tomato - 6 units - In Stock - Vegetables
10. 🧀 Cheese - 3 units - In Stock - Dairy
11. 🍞 Bread - 2 units - In Stock - Bakery
12. 🧈 Butter - 1 unit - In Stock - Dairy
13. 🥒 Cucumber - 3 units - In Stock - Vegetables
14. 🧅 Onion - 4 units - In Stock - Vegetables
15. 🥩 Beef - 2 units - Warning - Meat

## Success Criteria

✅ All 15 items visible
✅ Large emoji icons displayed
✅ Quantities shown correctly
✅ Status dots colored correctly
✅ Search works
✅ Category filter works
✅ Tap navigates to edit
✅ + button opens add form

---

**If you see all of this, the Inventory screen is working perfectly!** 🎉

