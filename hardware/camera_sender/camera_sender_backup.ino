#include "esp_camera.h"
#include <WiFi.h>
#include <HTTPClient.h>
// Optional: Uncomment to parse JSON responses (requires ArduinoJson library)
// #include <ArduinoJson.h>

// Camera model
#define CAMERA_MODEL_AI_THINKER
#include "camera_pins.h"

// ⚠️ CONFIGURATION - Update these with your network details
// IMPORTANT: Replace these with your actual WiFi credentials and Flask server IP
const char *ssid = "YOUR_WIFI_SSID";           // Replace with your WiFi name
const char *password = "YOUR_WIFI_PASSWORD";    // Replace with your WiFi password
const char *serverUrl = "http://10.79.192.126:5000/upload";  // Flask backend server IP (update if different)

// Settings
const unsigned long CAPTURE_INTERVAL = 30000;  // Capture every 30 seconds (adjust as needed)
const unsigned long WIFI_RECONNECT_DELAY = 5000;  // Reconnect WiFi every 5 seconds if disconnected
unsigned long lastCaptureTime = 0;
unsigned long lastWiFiCheck = 0;

// WiFi connection helper
bool ensureWiFiConnected() {
  if (WiFi.status() == WL_CONNECTED) {
    return true;
  }
  
  Serial.println("⚠️ WiFi disconnected. Attempting to reconnect...");
  WiFi.disconnect();
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ WiFi reconnected!");
    Serial.print("📡 IP Address: ");
    Serial.println(WiFi.localIP());
    return true;
  } else {
    Serial.println("\n❌ WiFi reconnection failed");
    return false;
  }
}

void setup() {
  Serial.begin(115200);
  Serial.setDebugOutput(true);
  delay(1000);
  
  Serial.println("\n🚀 ESP32-CAM Smart Refrigerator Initializing...");
  
  // Initialize WiFi
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  
  Serial.print("📶 Connecting to WiFi");
  int wifiAttempts = 0;
  while (WiFi.status() != WL_CONNECTED && wifiAttempts < 30) {
    delay(500);
    Serial.print(".");
    wifiAttempts++;
  }
  
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("\n❌ WiFi connection failed! Check credentials.");
    return;
  }
  
  Serial.println("\n✅ WiFi connected!");
  Serial.print("📡 IP Address: ");
  Serial.println(WiFi.localIP());
  Serial.print("📡 Server URL: ");
  Serial.println(serverUrl);

  // Initialize camera
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM;
  config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;
  
  // Higher resolution for better detection
  config.frame_size = FRAMESIZE_VGA;  // 640x480 (better for object detection)
  config.jpeg_quality = 10;  // Lower number = higher quality (10-63, 10 is best)
  config.fb_count = 1;

  // Camera init with error handling
  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("❌ Camera init failed with error 0x%x\n", err);
    return;
  }
  
  Serial.println("✅ Camera initialized successfully");
  
  // Print camera sensor info
  sensor_t *s = esp_camera_sensor_get();
  Serial.printf("📷 Camera sensor: %d\n", s->id.PID);
  
  lastCaptureTime = millis();
  lastWiFiCheck = millis();
  
  Serial.println("✅ Setup complete! Starting capture loop...\n");
}

void loop() {
  unsigned long currentTime = millis();
  
  // Check WiFi connection periodically
  if (currentTime - lastWiFiCheck > WIFI_RECONNECT_DELAY) {
    ensureWiFiConnected();
    lastWiFiCheck = currentTime;
  }
  
  // Check if it's time to capture
  if (currentTime - lastCaptureTime < CAPTURE_INTERVAL) {
    delay(1000);  // Small delay to prevent tight loop
    return;
  }
  
  // Ensure WiFi is connected before capturing
  if (!ensureWiFiConnected()) {
    Serial.println("⏳ Waiting for WiFi connection...");
    delay(5000);
    return;
  }
  
  Serial.println("\n📸 Starting image capture...");
  
  // Capture image from camera
  camera_fb_t *fb = esp_camera_fb_get();

  if (!fb) {
    Serial.println("❌ Camera capture failed");
    delay(5000);
    lastCaptureTime = currentTime;  // Reset timer even on failure
    return;
  }

  Serial.printf("📸 Image captured: %d bytes (%.2f KB)\n", fb->len, fb->len / 1024.0);

  // Send image to Flask backend
  if (uploadImage(fb)) {
    Serial.println("✅ Image uploaded and processed successfully");
  } else {
    Serial.println("❌ Image upload failed");
  }

  // Return framebuffer to be reused
  esp_camera_fb_return(fb);
  
  lastCaptureTime = currentTime;
  
  // Calculate time until next capture
  unsigned long nextCaptureIn = CAPTURE_INTERVAL / 1000;
  Serial.printf("⏱️  Next capture in %lu seconds\n\n", nextCaptureIn);
}

// Function to upload image using multipart/form-data
bool uploadImage(camera_fb_t *fb) {
  WiFiClient client;
  HTTPClient http;
  
  // Set timeout
  http.setTimeout(30000);  // 30 seconds timeout
  
  Serial.print("📤 Connecting to server: ");
  Serial.println(serverUrl);
  
  if (!http.begin(client, serverUrl)) {
    Serial.println("❌ HTTP begin failed");
    return false;
  }

  // Create multipart/form-data boundary
  String boundary = "----ESP32Boundary" + String(millis());
  String contentType = "multipart/form-data; boundary=" + boundary;

  // Build multipart body
  String head = "--" + boundary + "\r\n";
  head += "Content-Disposition: form-data; name=\"image\"; filename=\"esp32cam.jpg\"\r\n";
  head += "Content-Type: image/jpeg\r\n\r\n";

  String tail = "\r\n--" + boundary + "--\r\n";

  uint32_t totalLen = head.length() + fb->len + tail.length();

  // Set headers
  http.addHeader("Content-Type", contentType);
  http.addHeader("Content-Length", String(totalLen));

  Serial.print("📤 Uploading ");
  Serial.print(fb->len / 1024.0);
  Serial.println(" KB...");

  // Allocate buffer for full request
  uint8_t *fullRequest = (uint8_t *)malloc(totalLen);
  if (!fullRequest) {
    Serial.println("❌ Memory allocation failed");
    http.end();
    return false;
  }

  // Copy parts into buffer
  memcpy(fullRequest, head.c_str(), head.length());
  memcpy(fullRequest + head.length(), fb->buf, fb->len);
  memcpy(fullRequest + head.length() + fb->len, tail.c_str(), tail.length());

  // Send POST request
  int httpResponseCode = http.POST(fullRequest, totalLen);

  // Free buffer
  free(fullRequest);

  // Check response
  if (httpResponseCode > 0) {
    Serial.printf("📡 Server response code: %d\n", httpResponseCode);
    
    String response = http.getString();
    Serial.println("📦 Response: " + response);
    
    // Try to parse JSON response (optional - requires ArduinoJson library)
    // Uncomment if you have ArduinoJson installed
    /*
    if (httpResponseCode == 200) {
      StaticJsonDocument<1024> doc;
      DeserializationError error = deserializeJson(doc, response);
      
      if (!error) {
        if (doc.containsKey("items")) {
          JsonArray items = doc["items"];
          Serial.printf("✅ Detected %d items:\n", items.size());
          for (JsonObject item : items) {
            if (item.containsKey("name")) {
              Serial.printf("  - %s\n", item["name"].as<const char*>());
            }
          }
        }
      }
    }
    */
    
    http.end();
    return (httpResponseCode == 200);
  } else {
    Serial.printf("❌ POST error: %d\n", httpResponseCode);
    if (httpResponseCode == -1) {
      Serial.println("   (Connection timeout or failed)");
    } else if (httpResponseCode == -2) {
      Serial.println("   (No server response)");
    } else if (httpResponseCode == -3) {
      Serial.println("   (Invalid URL)");
    } else if (httpResponseCode == -11) {
      Serial.println("   (Connection closed)");
    }
    http.end();
    return false;
  }
}
