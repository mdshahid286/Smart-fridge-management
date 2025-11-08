from flask import Flask, request, jsonify
from flask_cors import CORS
from detect_items import detect_objects
from image_utils import validate_image, get_image_info
import os
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = os.path.join("static", "images")
DATABASE_FILE = "database.json"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Temporary in-memory storage for detected items
inventory = []


@app.route("/upload", methods=["POST"])
def upload():
    try:
        print("\n" + "="*50)
        print("[DEBUG] Upload request received")
        print("[DEBUG] Request method:", request.method)
        print("[DEBUG] Request content type:", request.content_type)
        print("[DEBUG] Request headers:", dict(request.headers))
        print("[DEBUG] Request files keys:", list(request.files.keys()))
        print("[DEBUG] Request form keys:", list(request.form.keys()))
        print("[DEBUG] Request data:", request.data[:100] if request.data else "No data")
        
        # Check if image file is present
        if "image" not in request.files:
            print("[ERROR] No 'image' key in request.files")
            print("[DEBUG] Available keys:", list(request.files.keys()))
            return jsonify({
                "error": "No image file provided. Expected key: 'image'",
                "available_keys": list(request.files.keys())
            }), 400
        
        file = request.files["image"]
        
        if file.filename == "" or file.filename is None:
            print("[ERROR] Empty or None filename")
            return jsonify({"error": "No file selected"}), 400
        
        print(f"[SUCCESS] File received successfully!")
        print(f"[SUCCESS] Filename: {file.filename}")
        print(f"[SUCCESS] Content-Type: {file.content_type}")
        
        # Save the uploaded image with timestamped filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp}.jpg"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        print(f"[SUCCESS] Image saved to: {filepath}")
        
        # Validate image
        is_valid, error_message = validate_image(filepath)
        if not is_valid:
            print(f"[ERROR] Image validation failed: {error_message}")
            return jsonify({"error": f"Invalid image: {error_message}"}), 400
        
        # Get image information
        image_info = get_image_info(filepath)
        file_size = os.path.getsize(filepath) if os.path.exists(filepath) else 0
        
        if image_info:
            print(f"[INFO] Image dimensions: {image_info['width']}x{image_info['height']}")
            print(f"[INFO] Image size: {image_info['file_size_kb']} KB")
            print(f"[INFO] Image sharpness: {image_info['sharpness']}")
            print(f"[INFO] Image brightness: {image_info['brightness']}")
        
        # 🧠 Run YOLO object detection
        print("[DETECTION] Running YOLOv8 detection...")
        
        # Get detection parameters from request (optional)
        min_confidence = float(request.form.get('min_confidence', 0.25))
        filter_food = request.form.get('filter_food', 'true').lower() == 'true'
        enable_preprocessing = request.form.get('preprocess', 'true').lower() == 'true'
        save_annotated = request.form.get('save_annotated', 'false').lower() == 'true'
        
        # Run detection with enhanced settings
        detected_items = detect_objects(
            filepath, 
            min_confidence=min_confidence, 
            filter_food=filter_food,
            enable_preprocessing=enable_preprocessing,
            save_annotated=save_annotated
        )
        print(f"[DETECTION] Detected {len(detected_items)} items")
        
        # Add status and timestamp to each item
        for item in detected_items:
            item["status"] = "Detected"
            item["last_detected"] = datetime.now().isoformat()
        
        # Save to database file
        save_to_database(detected_items)
        
        # Merge with existing inventory instead of replacing
        merge_inventory(detected_items)

        print("[SUCCESS] Returning response with", len(detected_items), "items")
        return jsonify({
            "message": "Items detected successfully", 
            "items": detected_items,
            "detected_items": detected_items,  # Support both formats
            "total_detected": len(detected_items),
            "detection_summary": {
                "total_items": len(detected_items),
                "total_quantity": sum(item.get('quantity', 1) for item in detected_items),
                "categories": list(set(item.get('category', 'other') for item in detected_items))
            },
            "image_info": {
                "filename": filename,
                "filepath": filepath,
                "size_kb": round(file_size / 1024, 2) if 'file_size' in locals() else 0
            }
        })
        
    except Exception as e:
        print(f"[ERROR] Upload exception: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


@app.route("/", methods=["GET"])
def home():
    """Health check endpoint"""
    return jsonify({
        "message": "Smart Fridge Backend Running 🚀",
        "status": "ok",
        "endpoints": [
            "/upload - POST: Upload image for detection",
            "/inventory - GET: Get current inventory",
            "/inventory - PUT: Update inventory item",
            "/inventory - DELETE: Delete inventory item",
            "/add_item - POST: Manually add item",
            "/trigger_capture - POST: Trigger ESP32 capture (for future use)"
        ],
        "inventory_count": len(inventory)
    }), 200


@app.route("/get_inventory", methods=["GET"])
def get_inventory():
    return jsonify(inventory)


@app.route("/inventory", methods=["GET"])
def get_inventory_route():
    """Alternative endpoint name for inventory"""
    return jsonify(inventory)


def merge_inventory(new_items):
    """Merge newly detected items with existing inventory"""
    global inventory
    
    # Create a dictionary for quick lookup by name (case-insensitive)
    inventory_dict = {}
    for item in inventory:
        key = item["name"].lower()
        inventory_dict[key] = item
    
    # Merge new items
    merged_count = 0
    added_count = 0
    for new_item in new_items:
        key = new_item["name"].lower()
        
        if key in inventory_dict:
            # Item exists - update quantity and detection info
            existing_item = inventory_dict[key]
            existing_item["quantity"] = new_item["quantity"]  # Update to latest count
            existing_item["last_detected"] = new_item.get("last_detected", datetime.now().isoformat())
            existing_item["confidence"] = new_item.get("confidence", 0.0)
            existing_item["status"] = "Detected"
            merged_count += 1
            print(f"[MERGE] Updated: {existing_item['name']} (qty: {existing_item['quantity']})")
        else:
            # New item - add to inventory
            inventory.append(new_item)
            inventory_dict[key] = new_item
            added_count += 1
            print(f"[ADD] New item: {new_item['name']} (qty: {new_item['quantity']})")
    
    print(f"[INVENTORY] Merged: {merged_count} updated, {added_count} added, Total: {len(inventory)} items")


def save_to_database(items):
    """Save detected items to database.json with timestamp"""
    try:
        # Load existing data
        if os.path.exists(DATABASE_FILE):
            with open(DATABASE_FILE, 'r') as f:
                try:
                    data = json.load(f)
                except json.JSONDecodeError:
                    data = []
        else:
            data = []
        
        # Append new detection
        data.append({
            "timestamp": datetime.now().isoformat(),
            "items": items
        })
        
        # Save back to file (keep last 100 detections to prevent file bloat)
        if len(data) > 100:
            data = data[-100:]
        
        with open(DATABASE_FILE, 'w') as f:
            json.dump(data, f, indent=4)
        
        print(f"[DATABASE] Saved {len(items)} items to database")
    except Exception as e:
        print(f"[DATABASE ERROR] {str(e)}")


@app.route("/add_item", methods=["POST"])
def add_item():
    """Manually add an item to inventory"""
    data = request.get_json()

    if not data or "name" not in data or "quantity" not in data or "status" not in data:
        return jsonify({"error": "Invalid item data"}), 400

    new_item = {
        "name": data["name"],
        "quantity": data["quantity"],
        "status": data["status"]
    }
    
    inventory.append(new_item)
    
    # Also save to database
    save_to_database([new_item])

    return jsonify({"message": "Item added successfully", "inventory": inventory})


@app.route("/inventory", methods=["PUT"])
def update_inventory():
    """Update an existing inventory item"""
    data = request.get_json()
    
    if not data or "name" not in data:
        return jsonify({"error": "Item name required"}), 400
    
    # Find and update item
    for item in inventory:
        if item["name"] == data["name"]:
            if "quantity" in data:
                item["quantity"] = data["quantity"]
            if "status" in data:
                item["status"] = data["status"]
            return jsonify({"message": "Item updated", "item": item})
    
    return jsonify({"error": "Item not found"}), 404


@app.route("/inventory", methods=["DELETE"])
def delete_inventory():
    """Delete an item from inventory"""
    name = request.args.get("name")
    
    if not name:
        return jsonify({"error": "Item name required"}), 400
    
    global inventory
    original_count = len(inventory)
    inventory = [item for item in inventory if item["name"].lower() != name.lower()]
    
    if len(inventory) < original_count:
        return jsonify({"message": "Item deleted", "inventory": inventory})
    else:
        return jsonify({"error": "Item not found"}), 404


@app.route("/trigger_capture", methods=["POST"])
def trigger_capture():
    """
    Trigger endpoint for on-demand ESP32 capture.
    Note: ESP32 would need to poll this endpoint or use WebSocket for real-time triggering.
    For now, this is a placeholder for future implementation.
    """
    data = request.get_json() or {}
    trigger_id = data.get("trigger_id", "manual")
    
    print(f"[TRIGGER] Capture requested: {trigger_id}")
    
    # In the future, this could:
    # - Add trigger to a queue that ESP32 polls
    # - Use WebSocket to notify ESP32
    # - Use MQTT to send command to ESP32
    
    return jsonify({
        "message": "Trigger received",
        "trigger_id": trigger_id,
        "note": "ESP32 currently captures on interval. Real-time triggering requires additional setup."
    }), 200


if __name__ == "__main__":
    # Load existing inventory from database on startup
    print("[INIT] Loading inventory from database...")
    try:
        if os.path.exists(DATABASE_FILE):
            with open(DATABASE_FILE, 'r') as f:
                data = json.load(f)
                if data:
                    # Get the most recent detection as starting inventory
                    latest_detection = data[-1]
                    inventory.extend(latest_detection.get("items", []))
                    print(f"[INIT] Loaded {len(inventory)} items from database")
    except Exception as e:
        print(f"[INIT ERROR] Could not load inventory: {str(e)}")
    
    app.run(host="0.0.0.0", port=5000, debug=True)
