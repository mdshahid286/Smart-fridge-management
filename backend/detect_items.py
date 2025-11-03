from ultralytics import YOLO

# Load YOLOv8 pre-trained model (make sure yolov8n.pt is downloaded automatically)
model = YOLO("yolov8n.pt")

# Common food items that YOLO can detect (COCO dataset classes)
FOOD_ITEMS = {
    'apple', 'banana', 'orange', 'broccoli', 'carrot', 'hot dog', 
    'pizza', 'donut', 'cake', 'bottle', 'cup', 'bowl', 'sandwich',
    'wine glass', 'fork', 'knife', 'spoon'
}

# Minimum confidence score (0.0 to 1.0)
MIN_CONFIDENCE = 0.25

def detect_objects(image_path, min_confidence=MIN_CONFIDENCE, filter_food=True):
    """
    Detect objects in an image using YOLOv8
    
    Args:
        image_path: Path to the image file
        min_confidence: Minimum confidence score (0.0-1.0)
        filter_food: If True, only return food-related items
    
    Returns:
        List of detected items with their details
    """
    try:
        results = model(image_path, conf=min_confidence)
        detected_items = []
        item_counts = {}  # Track quantities

        for r in results:
            for box in r.boxes:
                cls = int(box.cls)
                confidence = float(box.conf)
                item_name = model.names[cls].lower()
                
                # Filter for food items if requested
                if filter_food:
                    # Check if item is a food item or food-related container
                    is_food = (
                        item_name in FOOD_ITEMS or
                        'bottle' in item_name or
                        'cup' in item_name or
                        'bowl' in item_name
                    )
                    
                    if not is_food:
                        continue
                
                # Count occurrences of same item
                if item_name not in item_counts:
                    item_counts[item_name] = {
                        'name': model.names[cls],  # Keep original capitalization
                        'confidence': confidence,
                        'count': 0
                    }
                
                item_counts[item_name]['count'] += 1
                # Update to highest confidence if this detection is more confident
                if confidence > item_counts[item_name]['confidence']:
                    item_counts[item_name]['confidence'] = confidence

        # Convert to list format
        for item_data in item_counts.values():
            detected_items.append({
                'name': item_data['name'],
                'quantity': item_data['count'],
                'confidence': round(item_data['confidence'], 2)
            })

        return detected_items

    except Exception as e:
        print(f"[ERROR] Detection failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return []
