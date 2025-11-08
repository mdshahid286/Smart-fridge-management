# 🔄 Smart Refrigerator System - Complete Workflow

## Overview
This document explains the complete workflow of the Smart Refrigerator System from image capture to recipe suggestions.

## 📊 System Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   ESP32-CAM     │────────▶│  Flask Backend  │────────▶│   Mobile App    │
│  (Hardware)     │  HTTP   │   (Python)      │  REST   │  (React Native) │
└─────────────────┘  POST   └─────────────────┘   API   └─────────────────┘
     │                      │                          │
     │                      │                          │
     ▼                      ▼                          ▼
  Captures              Processes                  Displays
  Image                 Detects Items              Inventory
                        Saves to DB                Suggests Recipes
```

## 🔄 Complete Workflow

### Step 1: Image Capture (ESP32-CAM)
**Location**: `hardware/camera_sender/camera_sender.ino`

1. **ESP32-CAM Initialization**
   - Connects to WiFi
   - Initializes camera (640x480 VGA, JPEG quality: 10)
   - Sets up capture interval (30 seconds)

2. **Image Capture Loop**
   - Every 30 seconds (configurable):
     - Captures image from camera
     - Converts to JPEG format
     - Prepares multipart/form-data request
     - Sends to Flask backend: `POST /upload`

**Key Code**:
```cpp
// Capture image
camera_fb_t *fb = esp_camera_fb_get();
// Upload to backend
uploadImage(fb);
```

**Configuration**:
- `CAPTURE_INTERVAL`: 30000ms (30 seconds)
- Resolution: 640x480 (VGA)
- Quality: 10 (best quality)
- Format: JPEG

---

### Step 2: Image Upload & Processing (Flask Backend)
**Location**: `backend/app.py` → `/upload` endpoint

1. **Receive Image**
   - Receives multipart/form-data POST request
   - Extracts image file from request
   - Saves to `static/images/` with timestamp

2. **Image Validation**
   - Checks file existence
   - Validates file size (0-10MB)
   - Validates image format
   - Checks dimensions (min 50x50)

3. **Image Preprocessing** (Optional)
   - Enhances brightness (+20%)
   - Enhances contrast (+10%)
   - Enhances sharpness (+10%)
   - Optimizes for detection

4. **Object Detection** (YOLOv8)
   - Loads YOLOv8 model (`yolov8n.pt`)
   - Runs detection on image
   - Filters for food items
   - Counts multiple instances
   - Calculates confidence scores

5. **Process Results**
   - Adds metadata (status, timestamp, category)
   - Saves to `database.json`
   - Updates in-memory inventory
   - Returns JSON response

**Key Code**:
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

# Update inventory
merge_inventory(detected_items)
save_to_database(detected_items)
```

**Response Format**:
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
  "total_detected": 1,
  "detection_summary": {
    "total_items": 1,
    "total_quantity": 2,
    "categories": ["fruits"]
  }
}
```

---

### Step 3: Inventory Storage (Backend)
**Location**: `backend/app.py` → `merge_inventory()` and `save_to_database()`

1. **Merge with Existing Inventory**
   - Updates existing items (by name, case-insensitive)
   - Adds new items
   - Updates quantities and timestamps
   - Maintains in-memory inventory

2. **Save to Database**
   - Appends to `database.json`
   - Stores detection history (last 100 detections)
   - Includes timestamp and items

**Key Code**:
```python
def merge_inventory(new_items):
    # Create dictionary for quick lookup
    inventory_dict = {item["name"].lower(): item for item in inventory}
    
    # Merge new items
    for new_item in new_items:
        key = new_item["name"].lower()
        if key in inventory_dict:
            # Update existing
            existing_item["quantity"] = new_item["quantity"]
        else:
            # Add new
            inventory.append(new_item)
```

---

### Step 4: Fetch Inventory (Mobile App)
**Location**: `mobile_app/api.js` → `getInventory()`

1. **API Call**
   - Makes GET request to `/inventory` endpoint
   - Handles errors gracefully
   - Falls back to mock data if backend unavailable

2. **Update App State**
   - Updates inventory state in screens
   - Triggers re-render
   - Updates UI

**Key Code**:
```javascript
export const getInventory = async () => {
  const response = await axios.get(`${API_URL}/inventory`);
  return response.data || [];
};
```

**Screens that Fetch Inventory**:
- **Home Screen**: Shows recent detections
- **Inventory Screen**: Shows full inventory list
- **Dashboard Screen**: Shows inventory stats
- **Recipes Screen**: Uses inventory for recipe matching

---

### Step 5: Recipe Suggestions (Mobile App)
**Location**: `mobile_app/screens/Recipes.js` + `mobile_app/services/recipeService.js`

1. **Fetch Inventory**
   - Gets current inventory from backend
   - Filters valid items

2. **Calculate Recipe Matches**
   - For each recipe:
     - Compares recipe ingredients with inventory
     - Calculates match percentage
     - Identifies missing ingredients
     - Sorts by match percentage

3. **Display Recommendations**
   - Shows recipes with ≥30% match
   - Displays match percentage
   - Shows missing ingredients
   - Allows browsing all recipes

**Key Code**:
```javascript
// Calculate match
const matchPercentage = (matchedIngredients / totalIngredients) * 100;

// Get recommended recipes
const recommended = getRecommendedRecipes(inventory, 30);
// Returns recipes sorted by match percentage
```

**Recipe Matching Logic**:
- Matches ingredients by name (case-insensitive)
- Calculates percentage: `(matched / total) * 100`
- Filters recipes with ≥30% match
- Sorts by match percentage (highest first)

---

## 🔄 Complete Flow Diagram

```
1. ESP32-CAM
   │
   ├─▶ Captures image (every 30s)
   ├─▶ Converts to JPEG
   └─▶ Sends POST /upload
       │
       ▼
2. Flask Backend
   │
   ├─▶ Receives image
   ├─▶ Validates image
   ├─▶ Preprocesses image (optional)
   ├─▶ Runs YOLOv8 detection
   ├─▶ Detects food items
   ├─▶ Updates inventory
   ├─▶ Saves to database.json
   └─▶ Returns JSON response
       │
       ▼
3. Inventory Storage
   │
   ├─▶ Merges with existing inventory
   ├─▶ Updates quantities
   ├─▶ Adds new items
   └─▶ Saves to database.json
       │
       ▼
4. Mobile App (Inventory Screen)
   │
   ├─▶ Fetches GET /inventory
   ├─▶ Updates state
   └─▶ Displays inventory list
       │
       ▼
5. Mobile App (Recipes Screen)
   │
   ├─▶ Fetches inventory
   ├─▶ Calculates recipe matches
   ├─▶ Filters by match percentage
   └─▶ Displays recommended recipes
```

## 📱 User Interaction Flow

### Scenario: User Opens App

1. **App Starts**
   - Home screen loads
   - Fetches inventory from backend
   - Shows connection status
   - Displays recent detections

2. **User Views Inventory**
   - Navigates to Inventory screen
   - App fetches latest inventory
   - Displays all items with quantities
   - Shows item categories

3. **User Views Recipes**
   - Navigates to Recipes screen
   - App fetches inventory
   - Calculates recipe matches
   - Shows recommended recipes
   - Displays match percentages

4. **ESP32 Captures New Image**
   - ESP32 captures image
   - Sends to backend
   - Backend processes and updates inventory
   - User pulls to refresh in app
   - App fetches updated inventory
   - Recipes update automatically

## 🔧 Configuration Points

### ESP32-CAM
- **Capture Interval**: `CAPTURE_INTERVAL = 30000` (30 seconds)
- **Server URL**: `http://YOUR_FLASK_IP:5000/upload`
- **Resolution**: `FRAMESIZE_VGA` (640x480)
- **Quality**: `jpeg_quality = 10`

### Flask Backend
- **Port**: 5000
- **Upload Folder**: `static/images/`
- **Database**: `database.json`
- **Detection Confidence**: 0.25 (default)
- **Preprocessing**: Enabled by default

### Mobile App
- **API URL**: `http://YOUR_IP:5000`
- **Refresh Interval**: Manual (pull to refresh)
- **Recipe Match Threshold**: 30%
- **Mock Data**: Can be enabled for testing

## 🔄 Data Flow

### Inventory Data Structure
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

### Recipe Matching
```javascript
Recipe: "Caprese Salad"
Ingredients: ["tomato", "mozzarella", "basil", "olive oil"]
Inventory: ["tomato", "mozzarella", "basil"]
Match: 3/4 = 75%
Status: Recommended (≥30% match)
```

## 🚀 Current Status

### ✅ Implemented
- ESP32 image capture and upload
- Backend image processing and detection
- Inventory storage and management
- Mobile app inventory display
- Recipe matching and suggestions
- Real-time updates (pull to refresh)

### 🔄 Automatic Updates
- ESP32 captures every 30 seconds
- Backend processes automatically
- Inventory updates in real-time
- App can refresh to get latest data

### 📊 Manual Updates
- User can pull to refresh in app
- User can manually upload images
- User can manually add items
- User can edit/delete items

## 🎯 Next Steps (Future Enhancements)

### Real-Time Updates
- [ ] WebSocket connection for live updates
- [ ] Push notifications for new detections
- [ ] Auto-refresh inventory in app

### Improved Detection
- [ ] Custom food item training
- [ ] Better confidence scoring
- [ ] Multi-model ensemble

### Enhanced Features
- [ ] Expiration date tracking
- [ ] Low stock alerts
- [ ] Shopping list generation
- [ ] Nutritional information

---

**Status**: ✅ Complete Workflow Implemented | 🚀 Production Ready

**Last Updated**: January 2025

