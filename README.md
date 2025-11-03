# 🧊 Smart Refrigerator System

An intelligent refrigerator management system that uses ESP32-CAM, YOLO object detection, and a React Native mobile app to automatically track food inventory.

## 🎯 Features

- **📸 Automatic Image Capture**: ESP32-CAM automatically captures images of refrigerator contents
- **🧠 AI-Powered Detection**: YOLOv8 object detection identifies food items with confidence scores
- **📱 Mobile App**: Beautiful React Native app for managing inventory and viewing recipes
- **🔄 Smart Inventory Management**: Automatic merging and updating of detected items
- **📊 Real-time Tracking**: View current inventory status from mobile app
- **🍳 Recipe Suggestions**: Get recipe recommendations based on available ingredients

## 🏗️ Architecture

```
ESP32-CAM  →  Flask Backend  →  React Native App
   (Hardware)     (YOLO AI)        (Mobile UI)
```

### Components

1. **Hardware (`hardware/`)**: ESP32-CAM Arduino code for image capture and upload
2. **Backend (`backend/`)**: Flask server with YOLOv8 integration for object detection
3. **Mobile App (`mobile_app/`)**: React Native/Expo app for user interface

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- Arduino IDE (for ESP32)
- Expo CLI (`npm install -g expo-cli`)

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Backend runs on `http://localhost:5000`

### 2. Mobile App Setup

```bash
cd mobile_app
npm install
# Update API_URL in api.js with your computer's IP address
expo start
```

### 3. ESP32-CAM Setup

1. Install ESP32 board support in Arduino IDE
2. Open `hardware/camera_sender/camera_sender.ino`
3. Update WiFi credentials and server URL
4. Upload to ESP32-CAM board

See [ESP_INTEGRATION_SUMMARY.md](./ESP_INTEGRATION_SUMMARY.md) for detailed setup.

## 📖 Documentation

- [Quick Start Guide](./QUICK_START.md) - Get up and running in 5 minutes
- [ESP Integration Guide](./ESP_INTEGRATION_SUMMARY.md) - ESP32-CAM setup and integration
- [Testing Guide](./TESTING_GUIDE.md) - Comprehensive testing instructions
- [UI Design Plan](./mobile_app/UI_DESIGN_PLAN.md) - Mobile app UI documentation

## 🛠️ Tech Stack

### Backend
- **Flask**: Web framework
- **YOLOv8 (Ultralytics)**: Object detection model
- **Flask-CORS**: Cross-origin resource sharing

### Mobile App
- **React Native**: Cross-platform mobile framework
- **Expo**: Development platform
- **Axios**: HTTP client

### Hardware
- **ESP32-CAM**: WiFi-enabled camera module
- **Arduino IDE**: Development environment

## 📁 Project Structure

```
Smart-Refrigerator/
├── backend/              # Flask backend server
│   ├── app.py           # Main Flask application
│   ├── detect_items.py  # YOLO detection logic
│   ├── requirements.txt # Python dependencies
│   └── static/images/   # Uploaded images storage
├── hardware/            # ESP32-CAM code
│   └── camera_sender/   # Arduino sketch files
├── mobile_app/          # React Native app
│   ├── screens/         # App screens
│   ├── components/      # Reusable components
│   ├── api.js          # API client
│   └── package.json    # Node dependencies
└── docs/                # Documentation files
```

## 🔧 Configuration

### Backend Configuration

Update `backend/app.py` for custom settings:
- Detection confidence threshold
- Food item filtering
- Database settings

### Mobile App Configuration

Update `mobile_app/api.js`:
```javascript
export const API_URL = "http://YOUR_IP_ADDRESS:5000";
```

### ESP32 Configuration

Update `hardware/camera_sender/camera_sender.ino`:
```cpp
const char *ssid = "YOUR_WIFI_SSID";
const char *password = "YOUR_WIFI_PASSWORD";
const char *serverUrl = "http://YOUR_FLASK_IP:5000/upload";
```

## 🧪 Testing

1. **Backend Test**: `curl http://localhost:5000/`
2. **Upload Test**: Use mobile app or send POST to `/upload`
3. **Inventory Test**: `curl http://localhost:5000/inventory`

See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for detailed testing procedures.

## 📊 API Endpoints

- `GET /` - Health check
- `POST /upload` - Upload image for detection
- `GET /inventory` - Get current inventory
- `POST /add_item` - Manually add item
- `PUT /inventory` - Update item
- `DELETE /inventory?name=item` - Delete item

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is open source and available for educational purposes.

## 🙏 Acknowledgments

- YOLOv8 by Ultralytics
- ESP32 Arduino Core
- React Native community
- Expo team

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Status**: ✅ Production Ready | 🚀 Active Development

