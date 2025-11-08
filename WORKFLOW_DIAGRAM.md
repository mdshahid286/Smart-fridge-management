# 📊 Smart Refrigerator Workflow - Visual Diagram

## 🔄 Complete System Workflow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         ESP32-CAM (Hardware)                            │
│                                                                         │
│  1. Initialize Camera                                                  │
│     ├─ Connect to WiFi                                                 │
│     ├─ Setup camera (640x480, JPEG quality: 10)                       │
│     └─ Start capture loop                                              │
│                                                                         │
│  2. Capture Image (Every 30 seconds)                                   │
│     ├─ Capture from camera                                             │
│     ├─ Convert to JPEG                                                 │
│     └─ Prepare multipart/form-data                                     │
│                                                                         │
│  3. Upload to Backend                                                  │
│     └─ POST http://YOUR_IP:5000/upload                                 │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP POST
                              │ (multipart/form-data)
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      Flask Backend (Python)                             │
│                                                                         │
│  1. Receive Image                                                       │
│     ├─ Extract image from request                                      │
│     ├─ Save to static/images/                                          │
│     └─ Validate image (size, format, dimensions)                       │
│                                                                         │
│  2. Preprocess Image (Optional)                                        │
│     ├─ Enhance brightness (+20%)                                       │
│     ├─ Enhance contrast (+10%)                                         │
│     └─ Enhance sharpness (+10%)                                        │
│                                                                         │
│  3. Run Detection (YOLOv8)                                             │
│     ├─ Load YOLOv8 model                                               │
│     ├─ Detect objects in image                                         │
│     ├─ Filter for food items                                           │
│     ├─ Count instances                                                 │
│     └─ Calculate confidence scores                                     │
│                                                                         │
│  4. Process Results                                                    │
│     ├─ Add metadata (status, timestamp, category)                      │
│     ├─ Merge with existing inventory                                   │
│     ├─ Save to database.json                                           │
│     └─ Return JSON response                                            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              │ JSON Response
                              │ (detected items)
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Inventory Storage (Backend)                          │
│                                                                         │
│  1. Merge Inventory                                                    │
│     ├─ Update existing items (by name)                                 │
│     ├─ Add new items                                                   │
│     └─ Update quantities and timestamps                                │
│                                                                         │
│  2. Save to Database                                                   │
│     ├─ Append to database.json                                         │
│     ├─ Store detection history                                         │
│     └─ Keep last 100 detections                                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              │ REST API
                              │ GET /inventory
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      Mobile App (React Native)                          │
│                                                                         │
│  1. Fetch Inventory                                                    │
│     ├─ GET http://YOUR_IP:5000/inventory                               │
│     ├─ Update app state                                                │
│     └─ Display in UI                                                   │
│                                                                         │
│  2. Inventory Screen                                                   │
│     ├─ Display all items                                               │
│     ├─ Show quantities                                                 │
│     ├─ Filter by category                                              │
│     └─ Search items                                                    │
│                                                                         │
│  3. Recipes Screen                                                     │
│     ├─ Fetch inventory                                                 │
│     ├─ Calculate recipe matches                                        │
│     ├─ Filter by match percentage (≥30%)                               │
│     └─ Display recommended recipes                                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 📱 User Interaction Flow

```
User Opens App
    │
    ├─▶ Home Screen
    │   ├─ Check connection status
    │   ├─ Fetch inventory
    │   └─ Show recent detections
    │
    ├─▶ Inventory Screen
    │   ├─ Fetch inventory
    │   ├─ Display all items
    │   ├─ Filter/search
    │   └─ Edit/delete items
    │
    └─▶ Recipes Screen
        ├─ Fetch inventory
        ├─ Calculate matches
        ├─ Show recommendations
        └─ View recipe details
```

## 🔄 Data Flow

### 1. Image Capture → Backend
```
ESP32-CAM
  │
  ├─▶ Capture image (JPEG, 640x480)
  ├─▶ Prepare multipart/form-data
  └─▶ POST /upload
      │
      ▼
Flask Backend
  ├─▶ Receive image
  ├─▶ Validate
  ├─▶ Preprocess
  ├─▶ Detect objects
  └─▶ Return JSON
```

### 2. Backend → Inventory Storage
```
Detection Results
  │
  ├─▶ Process items
  ├─▶ Add metadata
  ├─▶ Merge with existing
  └─▶ Save to database.json
```

### 3. Backend → Mobile App
```
Mobile App
  │
  ├─▶ GET /inventory
  ├─▶ Receive JSON
  ├─▶ Update state
  └─▶ Display in UI
```

### 4. Inventory → Recipe Matching
```
Inventory Items
  │
  ├─▶ Get recipe ingredients
  ├─▶ Compare with inventory
  ├─▶ Calculate match percentage
  ├─▶ Filter by threshold (≥30%)
  └─▶ Sort by match
```

## 🎯 Key Components

### ESP32-CAM
- **File**: `hardware/camera_sender/camera_sender.ino`
- **Function**: Capture and upload images
- **Interval**: 30 seconds
- **Format**: JPEG, 640x480

### Flask Backend
- **File**: `backend/app.py`
- **Endpoints**:
  - `POST /upload` - Receive and process images
  - `GET /inventory` - Get current inventory
  - `PUT /inventory` - Update item
  - `DELETE /inventory` - Delete item

### Detection Engine
- **File**: `backend/detect_items.py`
- **Model**: YOLOv8n
- **Preprocessing**: Brightness, contrast, sharpness
- **Filtering**: Food items only

### Mobile App
- **Screens**:
  - Home - Connection status, recent detections
  - Inventory - Full inventory list
  - Recipes - Recipe recommendations
  - Dashboard - Statistics

### Recipe Service
- **File**: `mobile_app/services/recipeService.js`
- **Function**: Match recipes with inventory
- **Threshold**: 30% match minimum
- **Sorting**: By match percentage

## 🔄 Real-Time Updates

### Current Implementation
- ESP32 captures every 30 seconds
- Backend processes automatically
- App can pull to refresh
- Manual refresh required

### Future Enhancement
- WebSocket for real-time updates
- Push notifications
- Auto-refresh in app
- Live inventory updates

---

**Status**: ✅ Complete Workflow Documented

**Last Updated**: January 2025

