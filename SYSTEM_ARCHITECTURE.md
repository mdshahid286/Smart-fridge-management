# 🏗️ Smart Refrigerator System Architecture

## System Overview

The Smart Refrigerator System consists of three main components working together:

1. **ESP32-CAM** (Hardware) - Image capture
2. **Flask Backend** (Python) - Image processing and detection
3. **React Native App** (Mobile) - User interface and recipe suggestions

## Component Architecture

### 1. ESP32-CAM (Hardware Layer)

**Purpose**: Capture images of refrigerator contents

**Technology**: 
- ESP32-CAM module
- Arduino framework
- WiFi connectivity
- Camera sensor

**Responsibilities**:
- Initialize camera and WiFi
- Capture images at intervals
- Upload images to backend
- Handle WiFi reconnection

**Key Files**:
- `hardware/camera_sender/camera_sender.ino`
- `hardware/camera_sender/camera_pins.h`

**Configuration**:
```cpp
const char *ssid = "YOUR_WIFI_SSID";
const char *password = "YOUR_WIFI_PASSWORD";
const char *serverUrl = "http://YOUR_FLASK_IP:5000/upload";
const unsigned long CAPTURE_INTERVAL = 30000; // 30 seconds
```

---

### 2. Flask Backend (Server Layer)

**Purpose**: Process images and detect food items

**Technology**:
- Python 3.x
- Flask web framework
- YOLOv8 object detection
- OpenCV image processing
- PIL image enhancement

**Responsibilities**:
- Receive image uploads
- Validate and preprocess images
- Run object detection
- Manage inventory
- Store detection history

**Key Files**:
- `backend/app.py` - Main Flask application
- `backend/detect_items.py` - Detection logic
- `backend/image_utils.py` - Image utilities

**Endpoints**:
- `GET /` - Health check
- `POST /upload` - Upload and process image
- `GET /inventory` - Get current inventory
- `PUT /inventory` - Update inventory item
- `DELETE /inventory` - Delete inventory item
- `POST /add_item` - Manually add item

**Data Storage**:
- `database.json` - Detection history
- `static/images/` - Uploaded images

---

### 3. React Native App (Client Layer)

**Purpose**: Display inventory and suggest recipes

**Technology**:
- React Native
- Expo framework
- React Navigation
- Axios for API calls

**Responsibilities**:
- Fetch inventory from backend
- Display inventory list
- Calculate recipe matches
- Show recipe recommendations
- Manage user interface

**Key Files**:
- `mobile_app/App.js` - Main app component
- `mobile_app/api.js` - API client
- `mobile_app/screens/` - App screens
- `mobile_app/services/recipeService.js` - Recipe matching

**Screens**:
- **Home** - Connection status, recent detections
- **Inventory** - Full inventory list with search/filter
- **Recipes** - Recipe recommendations
- **Dashboard** - Statistics and overview
- **Settings** - App configuration

---

## Data Flow

### Image Capture → Detection → Inventory → Recipes

```
1. ESP32-CAM captures image
   ↓
2. Sends to Flask backend (POST /upload)
   ↓
3. Backend processes image
   ├─ Validate image
   ├─ Preprocess image
   ├─ Run YOLOv8 detection
   └─ Detect food items
   ↓
4. Update inventory
   ├─ Merge with existing items
   ├─ Update quantities
   └─ Save to database.json
   ↓
5. Mobile app fetches inventory (GET /inventory)
   ↓
6. Calculate recipe matches
   ├─ Compare ingredients with inventory
   ├─ Calculate match percentage
   └─ Filter by threshold (≥30%)
   ↓
7. Display recommendations
   └─ Show recipes sorted by match
```

## Communication Protocols

### ESP32 → Backend
- **Protocol**: HTTP POST
- **Format**: multipart/form-data
- **Endpoint**: `/upload`
- **Payload**: Image file (JPEG)

### Backend → Mobile App
- **Protocol**: HTTP REST API
- **Format**: JSON
- **Endpoints**:
  - `GET /inventory` - Get inventory
  - `POST /upload` - Upload image
  - `PUT /inventory` - Update item
  - `DELETE /inventory` - Delete item

### Mobile App → Backend
- **Protocol**: HTTP REST API
- **Format**: JSON
- **Authentication**: None (local network)

## Data Models

### Inventory Item
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

### Detection Response
```json
{
  "message": "Items detected successfully",
  "items": [...],
  "total_detected": 1,
  "detection_summary": {
    "total_items": 1,
    "total_quantity": 2,
    "categories": ["fruits"]
  },
  "image_info": {
    "filename": "20250115_103000.jpg",
    "size_kb": 245.67
  }
}
```

### Recipe
```json
{
  "id": 1,
  "name": "Caprese Salad",
  "ingredients": ["tomato", "mozzarella", "basil", "olive oil"],
  "instructions": [...],
  "time": "15 min",
  "difficulty": "Easy",
  "matchPercentage": 75,
  "missingIngredients": ["olive oil"]
}
```

## Technology Stack

### Hardware
- ESP32-CAM module
- Camera sensor
- WiFi connectivity

### Backend
- Python 3.x
- Flask (web framework)
- YOLOv8 (object detection)
- OpenCV (image processing)
- PIL (image enhancement)

### Mobile App
- React Native
- Expo
- React Navigation
- Axios
- JavaScript/ES6+

## Deployment Architecture

### Development
```
ESP32-CAM (Local Network)
    ↓
Flask Backend (localhost:5000)
    ↓
React Native App (Expo Go)
```

### Production (Future)
```
ESP32-CAM (Home Network)
    ↓
Flask Backend (Cloud Server)
    ↓
React Native App (App Store/Play Store)
```

## Security Considerations

### Current (Development)
- Local network only
- No authentication
- No encryption

### Future (Production)
- HTTPS/TLS encryption
- User authentication
- API key authentication
- Rate limiting
- Input validation

## Performance Considerations

### Image Processing
- Image size: ~50-200 KB
- Processing time: 2-5 seconds
- Detection accuracy: 75-90%

### API Response Times
- Inventory fetch: <100ms
- Image upload: 2-5 seconds
- Recipe matching: <50ms

### Mobile App
- Initial load: <2 seconds
- Inventory refresh: <1 second
- Recipe calculation: <100ms

## Scalability

### Current Limitations
- Single ESP32-CAM
- Single backend instance
- Local network only

### Future Enhancements
- Multiple ESP32-CAMs
- Load balancing
- Cloud deployment
- Database (PostgreSQL/MongoDB)
- Caching (Redis)

## Monitoring & Logging

### Backend Logging
- Image uploads
- Detection results
- Inventory updates
- Error handling

### Mobile App Logging
- API calls
- Errors
- User interactions
- Performance metrics

---

**Status**: ✅ Architecture Documented

**Last Updated**: January 2025

