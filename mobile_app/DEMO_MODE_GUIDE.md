# 📦 Demo Mode - Quick Start Guide

## 🚀 Test the App WITHOUT Backend (5 seconds)

### Step 1: Verify Demo Mode is ON
```javascript
// Check: data/mockData.js (Line 151)
export const USE_MOCK_DATA = true;  // ← Should be true
```

### Step 2: Start the App
```bash
cd mobile_app
npm start
```

### Step 3: Open on Device/Emulator
- Press `a` for Android
- Press `i` for iOS
- Scan QR code with Expo Go

### Step 4: Explore! 🎉
✅ **15 pre-loaded inventory items**
✅ **10 recipe recommendations**
✅ **Status indicators working**
✅ **All features functional**

---

## 📱 What You'll See

### Home Screen (Dashboard)
- ✅ ESP32 Status: "Online & Monitoring"
- 📊 Total: 15 items
- 📦 Low Stock: 2 items
- 🆕 Recently Added: 8 items

### Inventory Tab
```
🥛 Milk           1 bottle    🟢
🥚 Eggs           12 units    🟢
🍎 Apples         4 units     🟢
🥬 Lettuce        1 head      🟢
🧃 Orange Juice   1 unit      🟡
🥕 Carrots        5 units     🟡
🍨 Yogurt         2 units     🔴
🍗 Chicken        1 piece     🔴
... and 7 more items
```

### Recipes Tab
**Recommended** (sorted by match %):
1. Scrambled Eggs - 100% match ✅
2. Chicken Stir-Fry - 50% match
3. Carrot Soup - 75% match
4. Yogurt Parfait - 100% match
... and 6 more recipes

### Monitor Tab
- 📷 ESP32-CAM Active (simulated)
- 📊 Statistics: 15 total, 8 recent
- 🔄 How It Works (3-step guide)
- 📋 Recently Detected Items

### Settings Tab
```
┌────────────────────────────────────┐
│  📦 Using Mock Data                │
│                                    │
│  Testing with sample data (15)    │
│                                    │
│  💡 To connect to backend:        │
│     set USE_MOCK_DATA = false     │
└────────────────────────────────────┘
```

---

## 🌐 Switch to LIVE Backend

### When Flask is Running:

1. **Update Mock Data Flag**
```javascript
// data/mockData.js (Line 151)
export const USE_MOCK_DATA = false;  // ← Change to false
```

2. **Verify Server IP** (if needed)
```javascript
// api.js (Line 24)
export const API_URL = "http://YOUR_IP:5000";
```

3. **Restart App**
```bash
npm start
```

4. **Check Settings Tab**
- Should show: "🌐 Connected to Backend"
- Server address displayed

---

## 🎨 UI Features

### Bottom Navigation
- 🏠 Home - Dashboard
- 📦 Inventory - Manage items  
- 🍳 Recipes - Recommendations
- 📷 Monitor - ESP32 status
- ⚙️ Settings - Configuration

### Design Highlights
- ✨ Modern indigo-purple theme
- 🎯 Floating navbar with rounded corners
- 📊 Status indicators (🟢🟡🔴)
- 🔄 Pull-to-refresh everywhere
- 🎨 Premium shadows and spacing

---

## 🐛 Troubleshooting

### "No items in inventory"
- ✅ Check `USE_MOCK_DATA = true` in `data/mockData.js`
- ✅ Restart the app

### "Backend connection failed"
- ✅ Normal in Demo Mode (no backend needed)
- ✅ Settings will show "📦 Using Mock Data"

### Want to add more mock items?
```javascript
// data/mockData.js
export const MOCK_INVENTORY = [
  ...existingItems,
  {
    name: "Your Item",
    quantity: 5,
    status: "In Stock",
    category: "Custom",
    addedDate: "2025-11-02",
  }
];
```

---

## 📊 Mock Data Details

### Categories
- 🥛 Dairy (5 items): Milk, Eggs, Cheese, Yogurt, Butter
- 🥬 Vegetables (6 items): Lettuce, Carrots, Tomato, Cucumber, Onion
- 🍎 Fruits (1 item): Apples
- 🥩 Meat (2 items): Chicken, Beef
- 🧃 Beverages (1 item): Orange Juice
- 🍞 Bakery (1 item): Bread

### Status Distribution
- 🟢 In Stock: 10 items
- 🟡 Warning: 3 items
- 🔴 Low/Expiring: 2 items

---

## 🎯 Demo Mode Benefits

✅ **No Setup Required** - Works instantly
✅ **Test All Features** - Recipes, inventory, monitoring
✅ **Realistic Data** - 15 diverse items with status
✅ **No Network Needed** - Perfect for development
✅ **Easy Switch** - Toggle one flag to go live

---

## 🚀 Ready to Test!

```bash
# Quick Start (3 commands)
cd Smart-Refrigerator/mobile_app
npm install  # First time only
npm start    # Every time
```

Then explore all 5 tabs! Everything works with realistic mock data! 🎉

---

**💡 Tip**: Leave Demo Mode ON while building UI features, switch to live backend when testing ESP32 integration!

