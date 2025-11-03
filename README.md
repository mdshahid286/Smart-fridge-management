# 🧊 Smart Refrigerator System

An intelligent refrigerator management system that uses ESP32-CAM, YOLOv8 object detection, and a React Native mobile app to automatically track food inventory.

![Status](https://img.shields.io/badge/status-production%20ready-success)
![Python](https://img.shields.io/badge/python-3.8%2B-blue)
![React Native](https://img.shields.io/badge/react--native-expo-61DAFB)
![ESP32](https://img.shields.io/badge/ESP32-CAM-orange)

---

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Hardware Setup](#-hardware-setup)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)

---

## 🎯 Features

- **📸 Automatic Image Capture**: ESP32-CAM automatically captures images of refrigerator contents
- **🧠 AI-Powered Detection**: YOLOv8 object detection identifies food items with confidence scores
- **📱 Mobile App**: Beautiful React Native app for managing inventory and viewing recipes
- **🔄 Smart Inventory Management**: Automatic merging and updating of detected items
- **📊 Real-time Tracking**: View current inventory status from mobile app
- **🍳 Recipe Suggestions**: Get recipe recommendations based on available ingredients
- **🔌 Auto-Reconnection**: ESP32 automatically reconnects to WiFi if connection drops
- **📈 Detection Analytics**: Confidence scores and quantity tracking for all detected items

---

## 🏗️ Architecture

```
┌─────────────┐      ┌──────────────┐      ┌──────────────┐
│  ESP32-CAM  │─────▶│ Flask Backend│─────▶│ Mobile App   │
│  (Hardware) │      │  (YOLO AI)   │      │  (React Nav) │
└─────────────┘      └──────────────┘      └──────────────┘
     │                       │                       │
     │                       ▼                       │
     │              ┌──────────────┐                 │
     │              │  Database    │                 │
     │              │  (JSON)      │                 │
     │              └──────────────┘                 │
     │                                               │
     └─────────────── Image Upload ──────────────────┘
```

### Components

1. **Hardware** (`hardware/`): ESP32-CAM Arduino code for image capture and upload
2. **Backend** (`backend/`): Flask server with YOLOv8 integration for object detection
3. **Mobile App** (`mobile_app/`): React Native/Expo app for user interface

---

## 🚀 Quick Start

### Prerequisites

- **Python** 3.8 or higher
- **Node.js** 16+ and npm
- **Arduino IDE** (for ESP32)
- **Expo CLI**: `npm install -g expo-cli`
- **ESP32-CAM** module (optional for hardware integration)

### 5-Minute Setup

#### 1. Backend Setup (2 mins)

```bash
cd backend
pip install -r requirements.txt
python app.py
```

✅ Backend running on `http://localhost:5000`

#### 2. Mobile App Setup (2 mins)

```bash
cd mobile_app
npm install

# Update API_URL in api.js with your computer's IP address
# Get IP: ipconfig (Windows) or ifconfig (Mac/Linux)

expo start
# Scan QR code with Expo Go app on your phone
```

#### 3. Test Upload (1 min)

1. Open mobile app
2. Check "✅ Connected" status at top
3. Click "Pick from Gallery"
4. Select an image with food items
5. Click "Upload Image"
6. Wait for detection (5-10 seconds)
7. View detected items in inventory!

---

## 📦 Installation

### Backend Installation

```bash
cd backend
pip install -r requirements.txt
```

**Dependencies:**
- Flask - Web framework
- Flask-CORS - Cross-origin resource sharing
- Ultralytics - YOLOv8 object detection
- OpenCV-Python - Image processing
- Pillow - Image manipulation

**Note:** YOLOv8 model (`yolov8n.pt`) will be automatically downloaded on first run (~6MB).

### Mobile App Installation

```bash
cd mobile_app
npm install
```

**Key Dependencies:**
- React Native
- Expo
- Axios
- React Navigation

### Hardware Setup

See [Hardware Setup](#-hardware-setup) section below for detailed ESP32-CAM installation.

---

## ⚙️ Configuration

### Backend Configuration

**File:** `backend/app.py`

Default settings (can be modified):
- Detection confidence threshold: `0.25`
- Food item filtering: `True`
- Upload folder: `static/images/`
- Database file: `database.json`

### Mobile App Configuration

**File:** `mobile_app/api.js`

Update API URL based on your setup:

**For Expo Go on Physical Device:**
```javascript
const USE_ANDROID_EMULATOR = false;
export const API_URL = "http://YOUR_IP_ADDRESS:5000";
```

**For Android Emulator:**
```javascript
const USE_ANDROID_EMULATOR = true;
// Automatically uses http://10.0.2.2:5000
```

### ESP32-CAM Configuration

**File:** `hardware/camera_sender/camera_sender.ino`

Update lines 10-12:
```cpp
const char *ssid = "YOUR_WIFI_SSID";
const char *password = "YOUR_WIFI_PASSWORD";
const char *serverUrl = "http://YOUR_FLASK_IP:5000/upload";
```

**Configuration Options:**
```cpp
const unsigned long CAPTURE_INTERVAL = 30000;  // 30 seconds
config.frame_size = FRAMESIZE_VGA;  // 640x480 resolution
config.jpeg_quality = 10;  // Quality: 10-63 (lower = better)
```

---

## 💻 Usage

### Backend

Start the Flask server:
```bash
cd backend
python app.py
```

The server will:
- Run on `http://0.0.0.0:5000`
- Accept image uploads at `/upload`
- Serve inventory at `/inventory`
- Auto-load previous inventory on startup

### Mobile App

Start Expo development server:
```bash
cd mobile_app
expo start
```

**Features:**
- **Home Screen**: Upload images, test connection
- **Inventory Screen**: View/edit detected items
- **Recipes Screen**: Recipe suggestions based on inventory
- **Settings Screen**: App configuration

### ESP32-CAM

After uploading the Arduino sketch:
- Automatically connects to WiFi
- Captures images every 30 seconds (configurable)
- Uploads to Flask backend
- Auto-reconnects if WiFi disconnects

**Monitor via Serial:**
- Baud Rate: 115200
- View capture status, upload progress, and errors

---

## 📚 API Documentation

### Endpoints

#### `GET /`
Health check endpoint.

**Response:**
```json
{
  "message": "Smart Fridge Backend Running 🚀",
  "status": "ok",
  "endpoints": [...],
  "inventory_count": 5
}
```

#### `POST /upload`
Upload image for object detection.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `image` (file)

**Response:**
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

**Optional Parameters:**
- `min_confidence`: Minimum detection confidence (0.0-1.0)
- `filter_food`: Enable food filtering (`true`/`false`)

#### `GET /inventory`
Get current inventory.

**Response:**
```json
[
  {
    "name": "apple",
    "quantity": 2,
    "confidence": 0.85,
    "status": "Detected",
    "last_detected": "2025-01-15T10:30:00"
  }
]
```

#### `POST /add_item`
Manually add item to inventory.

**Request:**
```json
{
  "name": "milk",
  "quantity": 1,
  "status": "Manual"
}
```

#### `PUT /inventory`
Update existing inventory item.

**Request:**
```json
{
  "name": "apple",
  "quantity": 3,
  "status": "Updated"
}
```

#### `DELETE /inventory?name=apple`
Delete item from inventory.

---

## 🔌 Hardware Setup

### ESP32-CAM Installation

#### 1. Install Arduino IDE & ESP32 Support

1. Download and install [Arduino IDE](https://www.arduino.cc/en/software)
2. Open Arduino IDE → `File` → `Preferences`
3. Add to "Additional Board Manager URLs":
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```
4. Go to `Tools` → `Board` → `Boards Manager`
5. Search "ESP32" and install

#### 2. Install Required Libraries

These are built-in with ESP32 board package:
- ESP32 Camera
- WiFi
- HTTPClient

#### 3. Configure and Upload

1. Open `hardware/camera_sender/camera_sender.ino`
2. Update WiFi credentials (lines 10-12)
3. Update server URL with your Flask server IP
4. Select board: `Tools` → `Board` → `ESP32 Arduino` → `AI Thinker ESP32-CAM`
5. Select port: `Tools` → `Port` → Your ESP32 port
6. Upload code

#### 4. Monitor Serial Output

- Open Serial Monitor: `Tools` → `Serial Monitor`
- Set baud rate to **115200**
- You should see WiFi connection and capture logs

### Camera Specifications

- **Resolution**: 640x480 (VGA)
- **Format**: JPEG
- **Quality**: 10 (high quality)
- **Capture Interval**: 30 seconds (configurable)

---

## 🧪 Testing

### Backend Testing

**Health Check:**
```bash
curl http://localhost:5000/
```

**Test Upload:**
```bash
curl -X POST http://localhost:5000/upload \
  -F "image=@path/to/test_image.jpg"
```

**Get Inventory:**
```bash
curl http://localhost:5000/inventory
```

### Mobile App Testing

1. Start backend server
2. Update API URL in `mobile_app/api.js`
3. Run `expo start`
4. Scan QR code with Expo Go
5. Test connection: Home screen → "Test Connection"
6. Upload test image: Home screen → "Pick from Gallery" → Upload

### ESP32 Testing

1. Monitor Serial output (115200 baud)
2. Check for WiFi connection confirmation
3. Verify image capture messages
4. Check Flask console for upload requests
5. Verify detection results in inventory

---

## 🐛 Troubleshooting

### Backend Issues

**Problem: ModuleNotFoundError**
```bash
pip install flask flask-cors ultralytics opencv-python pillow
```

**Problem: YOLO model download fails**
- First run downloads `yolov8n.pt` (~6MB)
- May take 1-2 minutes
- Check internet connection
- Check console for download progress

**Problem: Permission denied (Windows)**
- Run as Administrator
- Or temporarily disable antivirus

### Mobile App Issues

**Problem: "Network Error" or "Disconnected"**
- ✅ Phone and computer on same WiFi network?
- ✅ Correct IP address in `api.js`?
- ✅ Backend server running?
- ✅ Windows Firewall allowing port 5000?

**Solution:**
```powershell
# Windows Firewall: Allow port 5000
netsh advfirewall firewall add rule name="Flask" dir=in action=allow protocol=TCP localport=5000
```

**Problem: Image upload timeout**
- Increase timeout in `api.js` (default: 30 seconds)
- Check image size (large images may take longer)

### ESP32-CAM Issues

**Problem: "Camera capture failed"**
- ✅ Check camera ribbon cable connection
- ✅ Ensure camera module is properly seated
- ✅ Try resetting ESP32

**Problem: "HTTP begin failed" or "POST error: -1"**
- ✅ Verify `serverUrl` format (include `http://` and port)
- ✅ Ensure Flask backend is running
- ✅ Check ESP32 and computer on same network
- ✅ Check Windows Firewall

**Problem: "WiFi connection failed"**
- ✅ Verify SSID and password
- ✅ Check WiFi signal strength
- ✅ Ensure 2.4GHz network (ESP32 doesn't support 5GHz)
- ✅ Check router allows new device connections

**Problem: Detection returns too many/too few items**
- Adjust `min_confidence` in `detect_items.py`
- Disable `filter_food` to see all detected objects
- Improve lighting conditions for better image quality

---

## 📁 Project Structure

```
Smart-Refrigerator/
├── backend/                      # Flask backend server
│   ├── app.py                   # Main Flask application
│   ├── detect_items.py          # YOLO detection logic
│   ├── requirements.txt         # Python dependencies
│   ├── database.json           # Inventory database (auto-generated)
│   └── static/
│       └── images/              # Uploaded images storage
│
├── hardware/                    # ESP32-CAM code
│   └── camera_sender/
│       ├── camera_sender.ino    # Main Arduino sketch
│       └── camera_pins.h        # Pin configuration
│
├── mobile_app/                  # React Native app
│   ├── App.js                   # Main app component
│   ├── api.js                   # API client
│   ├── package.json             # Node dependencies
│   ├── screens/                 # App screens
│   │   ├── Home.js
│   │   ├── Inventory.js
│   │   ├── Recipes.js
│   │   └── Settings.js
│   ├── components/              # Reusable components
│   │   ├── ItemCard.js
│   │   ├── RecipeCard.js
│   │   └── ...
│   └── android/                 # Android build files
│
└── README.md                    # This file
```

---

## 🎯 Supported Food Items

The system can detect the following food items (YOLOv8 COCO dataset):

**Fruits:**
- Apple, Banana, Orange

**Vegetables:**
- Broccoli, Carrot

**Prepared Foods:**
- Pizza, Donut, Cake, Sandwich, Hot Dog

**Containers:**
- Bottle, Cup, Bowl, Wine Glass

**Utensils:**
- Fork, Knife, Spoon

---

## 🔮 Future Enhancements

- [ ] Real-time ESP32 triggering via WebSocket/MQTT
- [ ] Motion detection (capture only when door opens)
- [ ] Image annotation with bounding boxes
- [ ] Food expiration tracking
- [ ] Custom food category training
- [ ] Cloud storage integration
- [ ] Multi-user support
- [ ] Push notifications for low stock

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available for educational purposes.

---

## 🙏 Acknowledgments

- **YOLOv8** by Ultralytics for object detection
- **ESP32 Arduino Core** for hardware support
- **React Native** and **Expo** communities
- **Flask** framework

---

## 📧 Support

For issues, questions, or contributions:
- Open an issue on [GitHub](https://github.com/mdshahid286/Smart-fridge-management)
- Check existing documentation
- Review troubleshooting section above

---

**Status**: ✅ Production Ready | 🚀 Active Development

**Last Updated**: January 2025
