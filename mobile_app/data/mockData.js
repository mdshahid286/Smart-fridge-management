// Mock data for testing without backend
export const MOCK_INVENTORY = [
  {
    name: "Milk",
    quantity: 1,
    status: "In Stock",
    category: "Dairy",
    addedDate: "2025-11-01",
  },
  {
    name: "Eggs",
    quantity: 12,
    status: "In Stock",
    category: "Dairy",
    addedDate: "2025-11-01",
  },
  {
    name: "Apples",
    quantity: 4,
    status: "In Stock",
    category: "Fruits",
    addedDate: "2025-11-02",
  },
  {
    name: "Lettuce",
    quantity: 1,
    status: "In Stock",
    category: "Vegetables",
    addedDate: "2025-11-02",
  },
  {
    name: "Orange Juice",
    quantity: 1,
    status: "Half Full",
    category: "Beverages",
    addedDate: "2025-10-30",
  },
  {
    name: "Carrots",
    quantity: 5,
    status: "Warning - Use Soon",
    category: "Vegetables",
    addedDate: "2025-10-28",
  },
  {
    name: "Yogurt",
    quantity: 2,
    status: "Low Stock",
    category: "Dairy",
    addedDate: "2025-11-01",
  },
  {
    name: "Chicken",
    quantity: 1,
    status: "Expiring Soon",
    category: "Meat",
    addedDate: "2025-10-31",
  },
  {
    name: "Tomato",
    quantity: 6,
    status: "In Stock",
    category: "Vegetables",
    addedDate: "2025-11-02",
  },
  {
    name: "Cheese",
    quantity: 3,
    status: "In Stock",
    category: "Dairy",
    addedDate: "2025-11-01",
  },
  {
    name: "Bread",
    quantity: 2,
    status: "In Stock",
    category: "Bakery",
    addedDate: "2025-11-02",
  },
  {
    name: "Butter",
    quantity: 1,
    status: "In Stock",
    category: "Dairy",
    addedDate: "2025-10-29",
  },
  {
    name: "Cucumber",
    quantity: 3,
    status: "In Stock",
    category: "Vegetables",
    addedDate: "2025-11-01",
  },
  {
    name: "Onion",
    quantity: 4,
    status: "In Stock",
    category: "Vegetables",
    addedDate: "2025-10-25",
  },
  {
    name: "Beef",
    quantity: 2,
    status: "Warning - Use Soon",
    category: "Meat",
    addedDate: "2025-10-30",
  },
];

export const MOCK_RECENT_DETECTIONS = [
  {
    name: "Tomato",
    quantity: 6,
    status: "Detected",
    timestamp: new Date().toISOString(),
  },
  {
    name: "Bread",
    quantity: 2,
    status: "Detected",
    timestamp: new Date().toISOString(),
  },
  {
    name: "Cucumber",
    quantity: 3,
    status: "Detected",
    timestamp: new Date().toISOString(),
  },
];

// Mock settings
export const MOCK_SETTINGS = {
  notifications: {
    lowStock: true,
    expiringSoon: true,
    newDetections: true,
  },
  camera: {
    captureInterval: 10,
    imageQuality: "QVGA",
  },
  server: {
    ipAddress: "10.79.192.126",
    port: 5000,
  },
};

// Usage flag - set to true to use mock data, false for real backend
export const USE_MOCK_DATA = true;

