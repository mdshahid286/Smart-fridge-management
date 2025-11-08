from ultralytics import YOLO
import cv2
import numpy as np
from PIL import Image, ImageEnhance
import os

# Load YOLOv8 pre-trained model (make sure yolov8n.pt is downloaded automatically)
print("[DETECTION] Loading YOLOv8 model...")
model = YOLO("yolov8n.pt")
print("[DETECTION] Model loaded successfully!")

# Extended food items that YOLO can detect (COCO dataset classes)
FOOD_ITEMS = {
    # Fruits
    'apple', 'banana', 'orange',
    # Vegetables
    'broccoli', 'carrot',
    # Prepared foods
    'hot dog', 'pizza', 'donut', 'cake', 'sandwich',
    # Containers (often contain food)
    'bottle', 'cup', 'bowl', 'wine glass',
    # Utensils
    'fork', 'knife', 'spoon',
    # Additional COCO classes that might be food-related
    'teddy bear',  # Sometimes misclassified, but we'll filter
}

# Food categories for better organization
FOOD_CATEGORIES = {
    'fruits': {'apple', 'banana', 'orange'},
    'vegetables': {'broccoli', 'carrot'},
    'prepared_foods': {'hot dog', 'pizza', 'donut', 'cake', 'sandwich'},
    'containers': {'bottle', 'cup', 'bowl', 'wine glass'},
    'utensils': {'fork', 'knife', 'spoon'},
}

# Minimum confidence score (0.0 to 1.0)
MIN_CONFIDENCE = 0.25

# Image preprocessing settings
ENABLE_PREPROCESSING = True
TARGET_SIZE = (640, 640)  # YOLOv8 optimal input size

def preprocess_image(image_path):
    """
    Preprocess image to improve detection accuracy
    - Adjust brightness and contrast
    - Enhance sharpness
    - Resize if needed
    """
    try:
        # Read image
        img = cv2.imread(image_path)
        if img is None:
            print(f"[WARNING] Could not read image: {image_path}")
            return image_path
        
        # Convert to RGB (OpenCV uses BGR)
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        
        # Convert to PIL for enhancement
        pil_img = Image.fromarray(img_rgb)
        
        # Enhance brightness (helps with dark fridge images)
        enhancer = ImageEnhance.Brightness(pil_img)
        pil_img = enhancer.enhance(1.2)  # Increase brightness by 20%
        
        # Enhance contrast
        enhancer = ImageEnhance.Contrast(pil_img)
        pil_img = enhancer.enhance(1.1)  # Increase contrast by 10%
        
        # Enhance sharpness
        enhancer = ImageEnhance.Sharpness(pil_img)
        pil_img = enhancer.enhance(1.1)  # Slight sharpness increase
        
        # Convert back to numpy array and BGR for OpenCV
        img_enhanced = np.array(pil_img)
        img_enhanced = cv2.cvtColor(img_enhanced, cv2.COLOR_RGB2BGR)
        
        # Save preprocessed image temporarily
        preprocessed_path = image_path.replace('.jpg', '_preprocessed.jpg').replace('.png', '_preprocessed.png')
        cv2.imwrite(preprocessed_path, img_enhanced)
        
        print(f"[PREPROCESSING] Enhanced image saved to: {preprocessed_path}")
        return preprocessed_path
        
    except Exception as e:
        print(f"[WARNING] Preprocessing failed: {str(e)}, using original image")
        return image_path


def get_food_category(item_name):
    """Get food category for an item"""
    item_lower = item_name.lower()
    for category, items in FOOD_CATEGORIES.items():
        if item_lower in items:
            return category
    return 'other'


def is_food_item(item_name):
    """Check if an item is food-related"""
    item_lower = item_name.lower()
    
    # Direct match
    if item_lower in FOOD_ITEMS:
        return True
    
    # Check for food-related keywords
    food_keywords = ['bottle', 'cup', 'bowl', 'glass', 'container']
    for keyword in food_keywords:
        if keyword in item_lower:
            return True
    
    return False


def detect_objects(image_path, min_confidence=MIN_CONFIDENCE, filter_food=True, 
                  enable_preprocessing=ENABLE_PREPROCESSING, save_annotated=False):
    """
    Detect objects in an image using YOLOv8 with enhanced preprocessing
    
    Args:
        image_path: Path to the image file
        min_confidence: Minimum confidence score (0.0-1.0)
        filter_food: If True, only return food-related items
        enable_preprocessing: If True, enhance image before detection
        save_annotated: If True, save image with bounding boxes
    
    Returns:
        List of detected items with their details
    """
    try:
        print(f"[DETECTION] Starting detection for: {image_path}")
        
        # Validate image exists
        if not os.path.exists(image_path):
            print(f"[ERROR] Image not found: {image_path}")
            return []
        
        # Preprocess image if enabled
        processed_image_path = image_path
        if enable_preprocessing:
            print("[PREPROCESSING] Enhancing image...")
            processed_image_path = preprocess_image(image_path)
        
        # Run YOLOv8 detection with improved settings
        print(f"[DETECTION] Running YOLOv8 with confidence threshold: {min_confidence}")
        results = model(
            processed_image_path, 
            conf=min_confidence,
            iou=0.45,  # Non-maximum suppression IoU threshold
            imgsz=640,  # Input image size (optimal for YOLOv8n)
            verbose=False  # Reduce output noise
        )
        
        detected_items = []
        item_counts = {}  # Track quantities and bounding boxes
        all_detections = []  # Store all detections for annotation

        # Process detection results
        for r in results:
            if r.boxes is not None and len(r.boxes) > 0:
                for box in r.boxes:
                    cls = int(box.cls)
                    confidence = float(box.conf)
                    item_name = model.names[cls].lower()
                    
                    # Get bounding box coordinates
                    x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                    bbox = {
                        'x1': float(x1),
                        'y1': float(y1),
                        'x2': float(x2),
                        'y2': float(y2),
                        'width': float(x2 - x1),
                        'height': float(y2 - y1)
                    }
                    
                    # Filter for food items if requested
                    if filter_food:
                        if not is_food_item(item_name):
                            continue
                    
                    # Store detection info
                    detection_info = {
                        'name': model.names[cls],  # Keep original capitalization
                        'confidence': confidence,
                        'bbox': bbox
                    }
                    all_detections.append(detection_info)
                    
                    # Count occurrences of same item
                    if item_name not in item_counts:
                        item_counts[item_name] = {
                            'name': model.names[cls],
                            'confidence': confidence,
                            'count': 0,
                            'bboxes': [],
                            'category': get_food_category(item_name)
                        }
                    
                    item_counts[item_name]['count'] += 1
                    item_counts[item_name]['bboxes'].append(bbox)
                    
                    # Update to highest confidence if this detection is more confident
                    if confidence > item_counts[item_name]['confidence']:
                        item_counts[item_name]['confidence'] = confidence

        # Convert to list format with additional metadata
        for item_name, item_data in item_counts.items():
            detected_items.append({
                'name': item_data['name'],
                'quantity': item_data['count'],
                'confidence': round(item_data['confidence'], 2),
                'category': item_data['category'],
                'detections': item_data['count'],  # Number of times detected
                'avg_confidence': round(item_data['confidence'], 2)
            })
        
        # Sort by confidence (highest first)
        detected_items.sort(key=lambda x: x['confidence'], reverse=True)
        
        print(f"[DETECTION] Detected {len(detected_items)} unique items:")
        for item in detected_items:
            print(f"  - {item['name']}: {item['quantity']}x (confidence: {item['confidence']:.2f})")
        
        # Save annotated image if requested
        if save_annotated and len(all_detections) > 0:
            try:
                annotated_path = image_path.replace('.jpg', '_annotated.jpg').replace('.png', '_annotated.png')
                annotated_img = results[0].plot()  # Get annotated image
                cv2.imwrite(annotated_path, annotated_img)
                print(f"[DETECTION] Annotated image saved to: {annotated_path}")
            except Exception as e:
                print(f"[WARNING] Could not save annotated image: {str(e)}")
        
        # Clean up preprocessed image
        if enable_preprocessing and processed_image_path != image_path and os.path.exists(processed_image_path):
            try:
                os.remove(processed_image_path)
            except:
                pass  # Ignore cleanup errors
        
        return detected_items

    except Exception as e:
        print(f"[ERROR] Detection failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return []
