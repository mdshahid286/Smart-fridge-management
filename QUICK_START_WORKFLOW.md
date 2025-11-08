# 🚀 Quick Start - Complete Workflow Guide

## Overview
This guide explains how the complete Smart Refrigerator system works from image capture to recipe suggestions.

## 🔄 Complete Workflow (Step by Step)

### Step 1: ESP32-CAM Captures Image
**What Happens**:
1. ESP32-CAM runs in a loop
2. Every 30 seconds, it captures an image
3. Image is converted to JPEG format (640x480)
4. Image is sent to Flask backend via HTTP POST

**Code**: `hardware/camera_sender/camera_sender.ino`
```cpp
// Capture image
camera_fb_t *fb = esp_camera_fb_get();
// Upload to backend
uploadImage(fb);
```

**Configuration**:
- Update WiFi credentials in `camera_sender.ino`
- Update server URL: `http://YOUR_FLASK_IP:5000/upload`
- Set capture interval (default: 30 seconds)

---

### Step 2: Backend Receives and Processes Image
**What Happens**:
1. Flask backend receives POST request at `/upload`
2. Image is saved to `static/images/`
3. Image is validated (size, format, dimensions)
4. Image is preprocessed (brightness, contrast, sharpness)
5. YOLOv8 model detects objects in image
6. Food items are filtered and counted
7. Results are processed and stored

**Code**: `backend/app.py` → `/upload` endpoint

**Detection Process**:
```python
# Validate image
is_valid, error_message = validate_image(filepath)

# Run detection
detected_items = detect_objects(
    filepath, 
    min_confidence=0.25, 
    filter_food=True,
    enable_preprocessing=True
)
```

**Detected Items Example**:
```json
{
  "name": "apple",
  "quantity": 2,
  "confidence": 0.85,
  "category": "fruits",
  "status": "Detected",
  "last_detected": "2025-01-15T10:30:00"
}
```

---

### Step 3: Backend Updates Inventory
**What Happens**:
1. Detected items are merged with existing inventory
2. Existing items are updated (quantity, timestamp)
3. New items are added to inventory
4. Inventory is saved to `database.json`
5. In-memory inventory is updated

**Code**: `backend/app.py` → `merge_inventory()`

**Merge Logic**:
- Items matched by name (case-insensitive)
- Quantities updated to latest count
- Timestamps updated
- New items added

---

### Step 4: Mobile App Fetches Inventory
**What Happens**:
1. App makes GET request to `/inventory`
2. Backend returns current inventory
3. App updates state with inventory data
4. UI is refreshed with new data

**Code**: `mobile_app/api.js` → `getInventory()`

**API Call**:
```javascript
const response = await axios.get(`${API_URL}/inventory`);
const inventory = response.data; // Array of items
```

**Screens that Fetch Inventory**:
- **Home Screen**: Shows recent detections
- **Inventory Screen**: Shows full inventory list
- **Dashboard Screen**: Shows statistics
- **Recipes Screen**: Uses for recipe matching

---

### Step 5: App Suggests Recipes
**What Happens**:
1. App fetches current inventory
2. For each recipe, compares ingredients with inventory
3. Calculates match percentage
4. Filters recipes with ≥30% match
5. Sorts by match percentage (highest first)
6. Displays recommended recipes

**Code**: `mobile_app/services/recipeService.js`

**Recipe Matching**:
```javascript
// Calculate match percentage
const matchPercentage = (matchedIngredients / totalIngredients) * 100;

// Get recommended recipes
const recommended = getRecommendedRecipes(inventory, 30);
// Returns recipes with ≥30% match, sorted by match percentage
```

**Example Match**:
- Recipe: "Caprese Salad"
- Ingredients: ["tomato", "mozzarella", "basil", "olive oil"]
- Inventory: ["tomato", "mozzarella", "basil"]
- Match: 3/4 = 75% ✅ Recommended

---

## 📊 Complete Flow Example

### Scenario: ESP32 Detects Apples

1. **ESP32-CAM** (30 seconds pass)
   - Captures image of refrigerator
   - Detects 2 apples
   - Sends image to backend

2. **Flask Backend** (receives image)
   - Validates image ✅
   - Preprocesses image ✅
   - Runs YOLOv8 detection ✅
   - Detects: 2 apples (confidence: 0.85)
   - Updates inventory ✅
   - Saves to database.json ✅

3. **Inventory Storage** (updated)
   - Previous: ["banana": 1, "orange": 3]
   - New: ["banana": 1, "orange": 3, "apple": 2]
   - Saved to database.json ✅

4. **Mobile App** (user opens Recipes screen)
   - Fetches inventory: ["banana", "orange", "apple"]
   - Calculates recipe matches
   - Finds recipes with these ingredients
   - Shows recommendations ✅

5. **Recipe Suggestions** (displayed)
   - "Fruit Salad" - 100% match (has all ingredients)
   - "Apple Pie" - 33% match (has apple)
   - Sorted by match percentage ✅

---

## 🔧 Configuration

### ESP32-CAM
**File**: `hardware/camera_sender/camera_sender.ino`
```cpp
const char *ssid = "YOUR_WIFI_SSID";
const char *password = "YOUR_WIFI_PASSWORD";
const char *serverUrl = "http://YOUR_FLASK_IP:5000/upload";
const unsigned long CAPTURE_INTERVAL = 30000; // 30 seconds
```

### Flask Backend
**File**: `backend/app.py`
- Port: 5000
- Upload folder: `static/images/`
- Database: `database.json`

### Mobile App
**File**: `mobile_app/api.js`
```javascript
export const API_URL = "http://YOUR_IP:5000";
```

---

## 🧪 Testing the Workflow

### 1. Test ESP32 Capture
```bash
# Monitor serial output
# Should see:
# ✅ WiFi connected
# ✅ Camera initialized
# 📸 Image captured
# 📤 Uploading...
# ✅ Image uploaded successfully
```

### 2. Test Backend Processing
```bash
# Check backend console
# Should see:
# [DEBUG] Upload request received
# [SUCCESS] File received successfully
# [DETECTION] Running YOLOv8 detection...
# [DETECTION] Detected X items
```

### 3. Test Mobile App
```bash
# Open app
# Navigate to Inventory screen
# Should see detected items
# Navigate to Recipes screen
# Should see recipe recommendations
```

---

## 🔄 Automatic Updates

### Current Implementation
- ESP32 captures every 30 seconds
- Backend processes automatically
- Inventory updates in real-time
- App requires manual refresh (pull to refresh)

### Manual Refresh
- **Inventory Screen**: Pull down to refresh
- **Recipes Screen**: Pull down to refresh
- **Home Screen**: Pull down to refresh

---

## 📱 User Actions

### View Inventory
1. Open app
2. Navigate to Inventory screen
3. See all detected items
4. Search/filter items
5. Edit/delete items

### View Recipes
1. Open app
2. Navigate to Recipes screen
3. See recommended recipes
4. View recipe details
5. See missing ingredients

### Manual Upload
1. Open app
2. Navigate to Home screen
3. Tap "Pick from Gallery"
4. Select image
5. Upload and detect

---

## 🎯 Key Points

### ✅ What Works
- ESP32 captures images automatically
- Backend processes images automatically
- Inventory updates automatically
- Recipes update when inventory changes
- Manual refresh available

### 🔄 Update Flow
1. ESP32 captures → Backend processes → Inventory updates
2. User refreshes app → App fetches inventory → Recipes update

### 📊 Data Flow
- ESP32 → Backend (HTTP POST)
- Backend → Inventory (Merge & Save)
- Backend → App (HTTP GET)
- App → Recipes (Calculate Matches)

---

## 🚀 Quick Test

### Test Complete Workflow
1. **Start Backend**: `python backend/app.py`
2. **Upload ESP32**: Flash code to ESP32-CAM
3. **Open App**: Start mobile app
4. **Wait**: ESP32 captures every 30 seconds
5. **Refresh**: Pull to refresh in app
6. **Check**: Inventory should update
7. **View Recipes**: Recipes should show matches

---

**Status**: ✅ Complete Workflow Documented

**Last Updated**: January 2025

