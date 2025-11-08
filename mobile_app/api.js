import axios from "axios";
import { USE_MOCK_DATA, MOCK_INVENTORY } from "./data/mockData";

// ⚙️ Replace this with your actual IPv4 address (from ipconfig)
// For Android Emulator use: http://10.0.2.2:5000
// For iOS Simulator use: http://localhost:5000 or your machine's IP
// For physical device: use your machine's IP (e.g., http://10.79.192.126:5000)

// ⚠️ For Expo Go on Physical Device:
// - Use your computer's IP address (from ipconfig on Windows)
// - Both your phone and computer must be on the SAME Wi-Fi network
// - Set USE_ANDROID_EMULATOR = false

// ⚠️ For Android Emulator (Android Studio):
// - Use http://10.0.2.2:5000
// - Set USE_ANDROID_EMULATOR = true

// 🧪 DEMO MODE: Set USE_MOCK_DATA = true in data/mockData.js to test without backend
console.log(`🔧 API Mode: ${USE_MOCK_DATA ? '📦 Mock Data (Demo)' : '🌐 Live Backend'}`);

// Auto-detect: Set this based on your setup
const USE_ANDROID_EMULATOR = false; // false for Expo Go physical device, true for emulator

export const API_URL = USE_ANDROID_EMULATOR 
  ? "http://10.0.2.2:5000"  // Android Emulator special IP
  : "http://10.79.192.126:5000"; // Your machine's IP for Expo Go physical device

// 🧪 Test Backend Connection
export const testConnection = async () => {
  if (USE_MOCK_DATA) {
    console.log("✅ Mock mode - connection simulated");
    return { message: "Mock data mode active", status: "connected" };
  }
  
  try {
    const response = await axios.get(`${API_URL}/`, {
      timeout: 5000,
    });
    console.log("✅ Backend connection successful:", response.data);
    return response.data || { message: "Connected", status: "ok" };
  } catch (error) {
    console.error("❌ Backend connection failed:", {
      message: error.message,
      code: error.code,
      url: API_URL,
    });
    // Don't throw - return error status instead
    return { 
      message: "Connection failed", 
      status: "error",
      error: error.message 
    };
  }
};

// 📸 Upload Image
export const uploadImage = async (fileUri) => {
  console.log("📤 Preparing upload for URI:", fileUri);
  
  // Create FormData with proper file object for React Native/Expo
  const formData = new FormData();
  
  // Handle different URI formats from expo-image-picker
  let uri = fileUri;
  
  console.log("📋 Original URI:", fileUri);
  console.log("📋 URI type:", typeof fileUri);
  
  // Ensure we have a valid URI
  if (!uri.includes("://")) {
    uri = `file://${uri}`;
  }
  
  console.log("📋 Processed URI:", uri);

  // CRITICAL: React Native FormData expects an object with uri, name, type
  // This creates a proper multipart/form-data request
  formData.append("image", {
    uri: uri,
    name: "image.jpg",
    type: "image/jpeg",
  });

  console.log("📤 FormData created, sending request...");

  try {
    // CRITICAL FIX: Don't set ANY Content-Type header manually
    // React Native will automatically set it to multipart/form-data with boundary
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        // Don't set Content-Type - let React Native handle it
        // Don't set Accept either - causes issues in some RN versions
      },
      timeout: 30000, // 30 second timeout
      transformRequest: (data) => {
        // CRITICAL: Return data as-is for React Native FormData
        // Don't let axios transform it
        return data;
      },
    });
    
    console.log("✅ Upload successful:", response.data);
    console.log("✅ Response status:", response.status);
    return response.data;
  } catch (error) {
    // Enhanced error logging
    console.error("❌ Upload Error Details:", {
      message: error.message,
      code: error.code,
      config: error.config?.url,
      headers: error.config?.headers,
    });
    
    if (error.response) {
      // Server responded with error status
      console.error("❌ Upload Error - Server Response:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      });
      throw new Error(
        `Server error (${error.response.status}): ${JSON.stringify(error.response.data)}`
      );
    } else if (error.request) {
      // Request was made but no response received
      console.error("❌ Upload Error - No Response:", {
        message: error.message,
        code: error.code,
        headers: error.request?._headers,
      });
      throw new Error(
        `Network error: Unable to connect to server at ${API_URL}. Check if backend is running and reachable.`
      );
    } else {
      // Something else happened
      console.error("❌ Upload Error - Request Setup:", error.message);
      throw new Error(`Upload failed: ${error.message}`);
    }
  }
};

// 🧺 Fetch Full Inventory
export const getInventory = async () => {
  if (USE_MOCK_DATA) {
    console.log("📦 Returning mock inventory data");
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return Array.isArray(MOCK_INVENTORY) ? [...MOCK_INVENTORY] : [];
  }
  
  try {
    const response = await axios.get(`${API_URL}/inventory`, {
      timeout: 10000,
    });
    // Ensure we return an array
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("❌ Fetch Inventory Error:", error.message);
    // Return empty array instead of throwing to prevent app crashes
    console.warn("⚠️ Falling back to empty inventory");
    return [];
  }
};

// ➕ Add New Item
export const addInventoryItem = async (item) => {
  if (USE_MOCK_DATA) {
    console.log("📦 Mock mode - item would be added");
    await new Promise(resolve => setTimeout(resolve, 300));
    return { message: "Item added (mock mode)", item };
  }
  
  try {
    // Try /add_item endpoint first (if available)
    let response;
    try {
      response = await axios.post(`${API_URL}/add_item`, item, {
        headers: { "Content-Type": "application/json" },
        timeout: 10000,
      });
    } catch (e) {
      // Fallback to POST /inventory if /add_item doesn't exist
      response = await axios.post(`${API_URL}/inventory`, item, {
        headers: { "Content-Type": "application/json" },
        timeout: 10000,
      });
    }
    return response.data;
  } catch (error) {
    console.error("❌ Add Item Error:", error.message);
    throw error;
  }
};

// ✏️ Update Existing Item
export const updateInventoryItem = async (item) => {
  if (USE_MOCK_DATA) {
    console.log("📦 Mock mode - item would be updated");
    await new Promise(resolve => setTimeout(resolve, 300));
    return { message: "Item updated (mock mode)", item };
  }
  
  try {
    const response = await axios.put(`${API_URL}/inventory`, item, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Update Item Error:", error.message);
    throw error;
  }
};

// ❌ Delete Item
export const deleteInventoryItem = async (name) => {
  if (USE_MOCK_DATA) {
    console.log("📦 Mock mode - item would be deleted");
    await new Promise(resolve => setTimeout(resolve, 300));
    return { message: "Item deleted (mock mode)" };
  }
  
  try {
    const response = await axios.delete(`${API_URL}/inventory`, {
      params: { name },
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Delete Item Error:", error.message);
    throw error;
  }
};
