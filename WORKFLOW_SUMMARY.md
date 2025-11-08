# 📋 Smart Refrigerator Workflow - Quick Summary

## 🔄 Complete Workflow (5 Steps)

### 1. 📸 ESP32-CAM Captures Image
- **When**: Every 30 seconds (configurable)
- **What**: Captures JPEG image (640x480)
- **Action**: Sends to backend via HTTP POST
- **Location**: `hardware/camera_sender/camera_sender.ino`

### 2. 🧠 Backend Processes Image
- **Endpoint**: `POST /upload`
- **Actions**:
  - Validates image
  - Preprocesses (brightness, contrast, sharpness)
  - Runs YOLOv8 detection
  - Detects food items
  - Counts instances
- **Location**: `backend/app.py` → `detect_items.py`

### 3. 💾 Backend Updates Inventory
- **Actions**:
  - Merges with existing inventory
  - Updates quantities
  - Adds new items
  - Saves to `database.json`
- **Location**: `backend/app.py` → `merge_inventory()`

### 4. 📱 App Fetches Inventory
- **Endpoint**: `GET /inventory`
- **Actions**:
  - Fetches current inventory
  - Updates app state
  - Displays in UI
- **Location**: `mobile_app/api.js` → `getInventory()`

### 5. 🍳 App Suggests Recipes
- **Actions**:
  - Compares recipe ingredients with inventory
  - Calculates match percentage
  - Filters by threshold (≥30%)
  - Sorts by match percentage
- **Location**: `mobile_app/services/recipeService.js`

---

## 📊 Data Flow

```
ESP32-CAM → Backend → Inventory → App → Recipes
   📸         🧠        💾        📱      🍳
```

## 🎯 Key Components

| Component | Technology | Purpose |
|-----------|-----------|---------|
| ESP32-CAM | Arduino/C++ | Capture images |
| Flask Backend | Python | Process images, detect items |
| React Native App | JavaScript | Display inventory, suggest recipes |
| YOLOv8 | AI Model | Object detection |
| Recipe Service | JavaScript | Match recipes with inventory |

## 🔄 Update Frequency

- **ESP32 Capture**: Every 30 seconds
- **Backend Processing**: Immediate (on upload)
- **Inventory Update**: Automatic (on detection)
- **App Refresh**: Manual (pull to refresh)

## 📱 User Actions

1. **View Inventory**: Open Inventory screen
2. **View Recipes**: Open Recipes screen
3. **Refresh Data**: Pull down to refresh
4. **Manual Upload**: Pick image from gallery

## ✅ Current Status

- ✅ ESP32 image capture working
- ✅ Backend processing working
- ✅ Inventory management working
- ✅ Recipe suggestions working
- ✅ Manual refresh available

---

**Status**: ✅ Complete Workflow Implemented

