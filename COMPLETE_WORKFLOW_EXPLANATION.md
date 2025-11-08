# 🔄 Complete Workflow Explanation

## Overview
This document explains the complete workflow of the Smart Refrigerator System from image capture to recipe suggestions.

## 📊 Workflow Steps

### Step 1: ESP32-CAM Captures Image ⏰
**Location**: `hardware/camera_sender/camera_sender.ino`

**What Happens**:
1. ESP32-CAM runs continuously in a loop
2. Every 30 seconds (configurable), it:
   - Captures an image from the camera
   - Converts it to JPEG format (640x480 resolution)
   - Prepares a multipart/form-data HTTP request
   - Sends the image to the Flask backend

**Code Flow**:
```cpp
void loop() {
  // Check if 30 seconds have passed
  if (currentTime - lastCaptureTime >= CAPTURE_INTERVAL) {
    // Capture image
    camera_fb_t *fb = esp_camera_fb_get();
    // Upload to backend
    uploadImage(fb);
  }
}
```

**Configuration**:
- Capture Interval: 30 seconds
- Resolution: 640x480 (VGA)
- Format: JPEG
- Quality: 10 (best quality)

---

### Step 2: Backend Receives and Processes Image 🧠
**Location**: `backend/app.py` → `/upload` endpoint

**What Happens**:
1. **Receive Image**
   - Flask receives POST request at `/upload`
   - Extracts image file from multipart/form-data
   - Saves image to `static/images/` with timestamp

2. **Validate Image**
   - Checks file existence
   - Validates file size (0-10MB)
   - Validates image format
   - Checks dimensions (min 50x50 pixels)

3. **Preprocess Image** (Optional)
   - Enhances brightness (+20%)
   - Enhances contrast (+10%)
   - Enhances sharpness (+10%)
   - Optimizes for detection

4. **Run Detection**
   - Loads YOLOv8 model
   - Runs object detection on image
   - Filters for food items
   - Counts multiple instances
   - Calculates confidence scores

**Code Flow**:
```python
@app.route("/upload", methods=["POST"])
def upload():
    # Receive image
    file = request.files["image"]
    filepath = save_image(file)
    
    # Validate
    is_valid, error = validate_image(filepath)
    
    # Detect objects
    detected_items = detect_objects(
        filepath,
        min_confidence=0.25,
        filter_food=True,
        enable_preprocessing=True
    )
    
    # Update inventory
    merge_inventory(detected_items)
    save_to_database(detected_items)
    
    return jsonify({"items": detected_items})
```

**Response**:
```json
{
  "message": "Items detected successfully",
  "items": [
    {
      "name": "apple",
      "quantity": 2,
      "confidence": 0.85,
      "category": "fruits",
      "status": "Detected",
      "last_detected": "2025-01-15T10:30:00"
    }
  ],
  "total_detected": 1
}
```

---

### Step 3: Backend Updates Inventory 💾
**Location**: `backend/app.py` → `merge_inventory()`

**What Happens**:
1. **Merge with Existing Inventory**
   - Creates dictionary of existing items (by name, case-insensitive)
   - For each detected item:
     - If item exists: Update quantity and timestamp
     - If item is new: Add to inventory
   - Updates in-memory inventory

2. **Save to Database**
   - Appends detection to `database.json`
   - Stores timestamp and items
   - Keeps last 100 detections (prevents file bloat)

**Code Flow**:
```python
def merge_inventory(new_items):
    inventory_dict = {item["name"].lower(): item for item in inventory}
    
    for new_item in new_items:
        key = new_item["name"].lower()
        if key in inventory_dict:
            # Update existing
            existing_item["quantity"] = new_item["quantity"]
            existing_item["last_detected"] = new_item["last_detected"]
        else:
            # Add new
            inventory.append(new_item)
```

**Inventory Structure**:
```json
[
  {
    "name": "apple",
    "quantity": 2,
    "confidence": 0.85,
    "category": "fruits",
    "status": "Detected",
    "last_detected": "2025-01-15T10:30:00"
  }
]
```

---

### Step 4: Mobile App Fetches Inventory 📱
**Location**: `mobile_app/api.js` → `getInventory()`

**What Happens**:
1. **API Call**
   - Makes GET request to `/inventory` endpoint
   - Receives JSON response with inventory array
   - Handles errors gracefully (returns empty array)

2. **Update App State**
   - Updates inventory state in React components
   - Triggers re-render of UI
   - Updates all screens that use inventory

**Code Flow**:
```javascript
export const getInventory = async () => {
  const response = await axios.get(`${API_URL}/inventory`);
  return response.data || [];
};

// In component
const [inventory, setInventory] = useState([]);
const items = await getInventory();
setInventory(items);
```

**Screens that Use Inventory**:
- **Home Screen**: Shows recent detections
- **Inventory Screen**: Shows full inventory list
- **Dashboard Screen**: Shows statistics
- **Recipes Screen**: Uses for recipe matching

---

### Step 5: App Suggests Recipes 🍳
**Location**: `mobile_app/services/recipeService.js`

**What Happens**:
1. **Fetch Inventory**
   - Gets current inventory from backend
   - Filters valid items

2. **Calculate Recipe Matches**
   - For each recipe:
     - Compares recipe ingredients with inventory items
     - Calculates match percentage
     - Identifies missing ingredients
   - Filters recipes with ≥30% match
   - Sorts by match percentage (highest first)

3. **Display Recommendations**
   - Shows recipes with match percentage
   - Displays missing ingredients
   - Allows viewing recipe details

**Code Flow**:
```javascript
// Calculate match
const matchPercentage = (matchedIngredients / totalIngredients) * 100;

// Get recommended recipes
const recommended = getRecommendedRecipes(inventory, 30);
// Returns recipes with ≥30% match, sorted by match percentage
```

**Recipe Matching Logic**:
- Matches ingredients by name (case-insensitive)
- Supports partial matches (e.g., "apple" matches "apples")
- Maps containers to ingredients (e.g., "bottle" → "milk", "juice")
- Calculates percentage: `(matched / total) * 100`
- Filters by threshold: ≥30% match
- Sorts by match percentage (highest first)

**Example Match**:
- Recipe: "Fresh Fruit Salad"
- Ingredients: ["apple", "banana", "orange"]
- Inventory: ["apple": 2, "banana": 1, "orange": 3]
- Match: 3/3 = 100% ✅ Highly Recommended

---

## 🔄 Complete Flow Example

### Scenario: ESP32 Detects 2 Apples and 1 Banana

**1. ESP32-CAM** (30 seconds pass)
```
📸 Capturing image...
📸 Image captured: 45.2 KB
📤 Uploading to http://192.168.1.100:5000/upload...
✅ Upload successful
```

**2. Flask Backend** (receives image)
```
[DEBUG] Upload request received
[SUCCESS] File received: 20250115_103000.jpg
[INFO] Image dimensions: 640x480
[PREPROCESSING] Enhancing image...
[DETECTION] Running YOLOv8 detection...
[DETECTION] Detected 2 unique items:
  - apple: 2x (confidence: 0.85)
  - banana: 1x (confidence: 0.78)
[MERGE] Updated: apple (qty: 2)
[ADD] New item: banana (qty: 1)
```

**3. Inventory Storage** (updated)
```json
[
  {"name": "apple", "quantity": 2, "confidence": 0.85, "category": "fruits"},
  {"name": "banana", "quantity": 1, "confidence": 0.78, "category": "fruits"}
]
```

**4. Mobile App** (user opens Recipes screen)
```
📦 Fetching inventory...
✅ Inventory loaded: 2 items
🍳 Calculating recipe matches...
✅ Found 3 recommended recipes
```

**5. Recipe Suggestions** (displayed)
```
1. Fresh Fruit Salad - 100% match ✅
   Ingredients: apple, banana, orange
   Available: apple ✅, banana ✅
   Missing: orange

2. Apple Pie - 33% match
   Ingredients: apple, flour, sugar, butter, cinnamon
   Available: apple ✅
   Missing: flour, sugar, butter, cinnamon
```

---

## 🎯 Key Features

### Automatic Updates
- ✅ ESP32 captures every 30 seconds
- ✅ Backend processes automatically
- ✅ Inventory updates in real-time
- ⏳ App requires manual refresh (pull to refresh)

### Manual Updates
- ✅ User can pull to refresh in app
- ✅ User can manually upload images
- ✅ User can manually add items
- ✅ User can edit/delete items

### Recipe Matching
- ✅ Matches ingredients with inventory
- ✅ Calculates match percentage
- ✅ Filters by threshold (≥30%)
- ✅ Sorts by match percentage
- ✅ Shows missing ingredients

---

## 🔧 Configuration

### ESP32-CAM
- **Capture Interval**: 30 seconds
- **Resolution**: 640x480
- **Quality**: 10 (best)
- **Server URL**: `http://YOUR_IP:5000/upload`

### Flask Backend
- **Port**: 5000
- **Detection Confidence**: 0.25 (default)
- **Preprocessing**: Enabled by default
- **Database**: `database.json`

### Mobile App
- **API URL**: `http://YOUR_IP:5000`
- **Recipe Match Threshold**: 30%
- **Refresh**: Manual (pull to refresh)

---

## 📊 Data Flow Summary

```
ESP32-CAM
  │
  ├─▶ Captures image (every 30s)
  ├─▶ Converts to JPEG
  └─▶ POST /upload
      │
      ▼
Flask Backend
  │
  ├─▶ Receives image
  ├─▶ Validates image
  ├─▶ Preprocesses image
  ├─▶ Runs YOLOv8 detection
  ├─▶ Detects food items
  ├─▶ Updates inventory
  └─▶ Returns JSON
      │
      ▼
Inventory Storage
  │
  ├─▶ Merges with existing
  ├─▶ Updates quantities
  └─▶ Saves to database.json
      │
      ▼
Mobile App
  │
  ├─▶ GET /inventory
  ├─▶ Receives inventory
  ├─▶ Updates state
  └─▶ Displays in UI
      │
      ▼
Recipe Matching
  │
  ├─▶ Compares ingredients
  ├─▶ Calculates matches
  ├─▶ Filters by threshold
  └─▶ Displays recommendations
```

---

## ✅ Current Status

### Working Features
- ✅ ESP32 image capture and upload
- ✅ Backend image processing and detection
- ✅ Inventory storage and management
- ✅ Mobile app inventory display
- ✅ Recipe matching and suggestions
- ✅ Manual refresh in app

### Future Enhancements
- [ ] Real-time updates (WebSocket)
- [ ] Push notifications
- [ ] Auto-refresh in app
- [ ] Custom food item training
- [ ] Better recipe matching

---

**Status**: ✅ Complete Workflow Implemented

**Last Updated**: January 2025

