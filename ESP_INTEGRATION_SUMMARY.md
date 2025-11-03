# ESP32-CAM & Image Detection Integration Summary

## 🎯 Overview

This document summarizes the integration between the ESP32-CAM hardware and the Flask backend's YOLO-based image detection system.

## ✅ Completed Enhancements

### 1. **ESP32-CAM Code Improvements** (`hardware/camera_sender/camera_sender.ino`)

#### Features Added:
- ✅ **WiFi Auto-Reconnection**: Automatically reconnects if WiFi connection drops
- ✅ **Better Error Handling**: Detailed error messages and HTTP status code interpretation
- ✅ **Improved Image Quality**: 
  - Resolution: `FRAMESIZE_VGA` (640x480) - better for object detection
  - JPEG Quality: 10 (higher quality, lower compression)
- ✅ **Configurable Capture Interval**: Default 30 seconds (adjustable via `CAPTURE_INTERVAL`)
- ✅ **Better Serial Logging**: Detailed status messages for debugging
- ✅ **Response Parsing Support**: Ready for JSON parsing (optional ArduinoJson library)

#### Camera Pin Configuration:
- Created `camera_pins.h` with proper ESP32-CAM (AI Thinker) pin definitions

### 2. **Enhanced Image Detection** (`backend/detect_items.py`)

#### Features Added:
- ✅ **Food Item Filtering**: Only returns food-related items (apples, bananas, bottles, etc.)
- ✅ **Confidence Scores**: Returns detection confidence (0.0-1.0) for each item
- ✅ **Quantity Tracking**: Counts multiple instances of the same item
- ✅ **Configurable Parameters**:
  - `min_confidence`: Minimum confidence threshold (default: 0.25)
  - `filter_food`: Enable/disable food filtering (default: True)

#### Supported Food Items:
- Fruits: apple, banana, orange
- Vegetables: broccoli, carrot
- Prepared Foods: pizza, donut, cake, sandwich, hot dog
- Containers: bottle, cup, bowl, wine glass
- Utensils: fork, knife, spoon

### 3. **Backend Improvements** (`backend/app.py`)

#### Features Added:
- ✅ **Smart Inventory Merging**: Merges new detections with existing inventory instead of replacing
  - Updates quantities for existing items
  - Adds new items
  - Preserves item history
- ✅ **Inventory Persistence**: Loads inventory from database on startup
- ✅ **Detection Parameters**: Accepts `min_confidence` and `filter_food` via form data
- ✅ **Better Logging**: Detailed merge/add logs
- ✅ **Trigger Endpoint**: `/trigger_capture` for future on-demand capture support
- ✅ **Database Management**: Keeps last 100 detections to prevent file bloat

## 📋 Setup Instructions

### ESP32-CAM Configuration

1. **Install Arduino IDE & ESP32 Board Support**:
   - Install Arduino IDE
   - Add ESP32 board: `File > Preferences > Additional Board Manager URLs`
   - Add: `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json`
   - Install "ESP32" from Board Manager

2. **Install Required Libraries**:
   - ESP32 Camera (built-in with ESP32 board package)
   - HTTPClient (built-in)
   - WiFi (built-in)

3. **Configure WiFi & Server**:
   Edit `camera_sender.ino`:
   ```cpp
   const char *ssid = "YOUR_WIFI_SSID";
   const char *password = "YOUR_WIFI_PASSWORD";
   const char *serverUrl = "http://YOUR_FLASK_IP:5000/upload";
   ```

4. **Upload Code**:
   - Select Board: `Tools > Board > ESP32 Arduino > AI Thinker ESP32-CAM`
   - Select Port: Your ESP32-CAM port
   - Upload code

5. **Monitor Serial Output**:
   - Open Serial Monitor (115200 baud)
   - Check for connection status and capture logs

### Backend Configuration

1. **Install Python Dependencies**:
   ```bash
   pip install flask flask-cors ultralytics opencv-python pillow
   ```

2. **Run Backend**:
   ```bash
   cd backend
   python app.py
   ```

3. **Verify Integration**:
   - Check Flask console for upload requests
   - Check Serial Monitor on ESP32 for upload status
   - View inventory via: `http://YOUR_IP:5000/inventory`

## 🔄 Data Flow

```
ESP32-CAM                    Flask Backend                    Database
    |                            |                               |
    |-- Capture Image ---------->|                               |
    |                            |-- Save Image ----------------->|
    |                            |-- YOLO Detection               |
    |                            |-- Filter Food Items            |
    |                            |-- Merge with Inventory         |
    |                            |-- Save to database.json ------->|
    |<-- JSON Response (200) ----|                               |
```

## 📊 API Endpoints

### ESP32 → Backend

**POST `/upload`**
- **Sender**: ESP32-CAM
- **Payload**: Multipart form-data with image
- **Response**: 
  ```json
  {
    "message": "Items detected successfully",
    "items": [
      {
        "name": "apple",
        "quantity": 2,
        "confidence": 0.85,
        "status": "Detected",
        "last_detected": "2025-01-15T10:30:00"
      }
    ]
  }
  ```

### Mobile App → Backend

**GET `/inventory`**
- Returns current inventory with merged items

**POST `/add_item`**
- Manually add item to inventory

**PUT `/inventory`**
- Update existing item

**DELETE `/inventory?name=item_name`**
- Delete item from inventory

## 🔧 Configuration Options

### ESP32 Settings

```cpp
const unsigned long CAPTURE_INTERVAL = 30000;  // 30 seconds (adjust as needed)
const unsigned long WIFI_RECONNECT_DELAY = 5000;  // WiFi check interval
config.frame_size = FRAMESIZE_VGA;  // Resolution: 640x480
config.jpeg_quality = 10;  // Quality: 10-63 (lower = better)
```

### Detection Settings

```python
MIN_CONFIDENCE = 0.25  # Minimum detection confidence (0.0-1.0)
filter_food = True  # Filter for food items only
```

## 🐛 Troubleshooting

### ESP32 Issues

**Problem**: "Camera capture failed"
- ✅ Check camera ribbon cable connection
- ✅ Ensure camera module is properly seated
- ✅ Try resetting ESP32

**Problem**: "HTTP begin failed" or "POST error: -1"
- ✅ Verify `serverUrl` is correct (include `http://` and port)
- ✅ Ensure Flask backend is running
- ✅ Check that ESP32 and computer are on same network
- ✅ Check Windows Firewall (allow port 5000)

**Problem**: "WiFi connection failed"
- ✅ Verify SSID and password
- ✅ Check WiFi signal strength
- ✅ Ensure 2.4GHz network (ESP32 doesn't support 5GHz)

### Backend Issues

**Problem**: "ModuleNotFoundError"
```bash
pip install flask flask-cors ultralytics opencv-python pillow
```

**Problem**: YOLO model download takes time
- First run downloads `yolov8n.pt` (~6MB)
- May take 1-2 minutes
- Check console for progress

**Problem**: Detection returns too many/too few items
- Adjust `min_confidence` in `detect_items.py` or via request
- Disable `filter_food` to see all detected objects

## 📈 Next Steps (Future Enhancements)

1. **Real-time Triggering**: Implement WebSocket or MQTT for on-demand ESP32 captures
2. **Motion Detection**: Only capture when fridge door opens/closes
3. **Image Annotated Output**: Save detection results with bounding boxes
4. **Food Expiration Tracking**: Add expiration dates based on item type
5. **Advanced Filtering**: Custom food categories and item recognition
6. **ArduinoJson Integration**: Parse detection results on ESP32 for LED feedback

## 📝 Files Modified

- ✅ `hardware/camera_sender/camera_sender.ino` - Enhanced ESP32 code
- ✅ `hardware/camera_sender/camera_pins.h` - Created pin configuration
- ✅ `backend/detect_items.py` - Improved detection with filtering
- ✅ `backend/app.py` - Added inventory merging and persistence

## 🎉 Success Indicators

✅ ESP32 Serial Monitor shows:
```
✅ WiFi connected!
📸 Image captured: 45678 bytes (44.61 KB)
📤 Uploading 44.61 KB...
📡 Server response code: 200
✅ Image uploaded and processed successfully
```

✅ Flask Console shows:
```
[DETECTION] Running YOLOv8 detection...
[DETECTION] Detected 3 items
[MERGE] Updated: apple (qty: 2)
[ADD] New item: banana (qty: 1)
[INVENTORY] Merged: 1 updated, 1 added, Total: 5 items
```

✅ Database (`database.json`) contains:
```json
[
  {
    "timestamp": "2025-01-15T10:30:00",
    "items": [
      {"name": "apple", "quantity": 2, "confidence": 0.85},
      {"name": "banana", "quantity": 1, "confidence": 0.78}
    ]
  }
]
```

---

**Integration Status**: ✅ Complete and Ready for Testing

