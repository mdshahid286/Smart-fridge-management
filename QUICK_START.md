# ⚡ Smart Refrigerator — Quick Start Guide

## 🚀 5-Minute Setup

### 1. Backend Setup (2 mins)
```bash
cd Smart-Refrigerator/backend
pip install -r requirements.txt
python app.py
```
✅ Backend running on `http://0.0.0.0:5000`

### 2. Mobile App Setup (2 mins)
```bash
cd Smart-Refrigerator/mobile_app

# Update YOUR IP address in api.js (line 22)
# Get IP: ipconfig (Windows) or ifconfig (Mac/Linux)

expo start
# Scan QR code with Expo Go app on your phone
```
✅ Mobile app connected

### 3. Test Upload (1 min)
1. Open mobile app
2. Check "✅ Connected" status at top
3. Click "Pick from Gallery"
4. Select an image with food
5. Click "Upload Image"
6. Wait 5 seconds
7. See detected items!

---

## 📱 Quick Feature Overview

### Home Screen
- **Backend Status**: Shows connection status
- **Test Connection**: Manual connection test
- **Capture Image**: Take photo with camera
- **Pick from Gallery**: Choose existing image
- **Upload Image**: Send to backend for detection

### Inventory Screen
- **View Items**: All detected items
- **Tap Item**: Edit quantity/status
- **Add New Item**: Manually add items

---

## 🔧 Configuration

### Update IP Address
**File:** `mobile_app/api.js` (line 18-22)

For **Expo Go** on physical device:
```javascript
const USE_ANDROID_EMULATOR = false;
export const API_URL = "http://YOUR_IP:5000";
```

For **Android Emulator**:
```javascript
const USE_ANDROID_EMULATOR = true;
// Will use http://10.0.2.2:5000 automatically
```

### ESP32-CAM Setup
**File:** `hardware/camera_sender/camera_sender.ino`

Update lines 10-12:
```cpp
const char *ssid = "YOUR_WIFI_NAME";
const char *password = "YOUR_WIFI_PASSWORD";
const char *serverUrl = "http://YOUR_FLASK_IP:5000/upload";
```

Upload to ESP32-CAM via Arduino IDE.

---

## 🎯 What's Working Now

✅ YOLO object detection (auto-detects food items)
✅ Image upload from mobile app
✅ Image save to `static/images/`
✅ Database persistence (`database.json`)
✅ Full CRUD inventory management
✅ ESP32-CAM auto-upload every 10 seconds
✅ Real-time detection results
✅ Edit/Add manual items

---

## 🆘 Quick Troubleshooting

**Backend not starting?**
```bash
pip install flask flask-cors ultralytics opencv-python pillow
```

**Mobile app "Disconnected"?**
- Phone and computer on same WiFi?
- Correct IP in `api.js`?
- Backend running?

**ESP32-CAM not uploading?**
- Check WiFi credentials
- Verify serverUrl IP address
- Monitor Serial output (115200 baud)

---

## 📖 Full Documentation

- [TESTING_GUIDE.md](TESTING_GUIDE.md) - Comprehensive testing instructions
- [README.md](README.md) - Project overview

---

**Ready to go! 🎉**

Test it now:
1. Start backend
2. Open mobile app
3. Upload an image
4. See the magic! ✨

