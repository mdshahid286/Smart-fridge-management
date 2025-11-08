"""
Utility functions for image processing and validation
"""
import cv2
import numpy as np
from PIL import Image
import os

def validate_image(image_path):
    """
    Validate that the image file is valid and can be processed
    
    Args:
        image_path: Path to the image file
    
    Returns:
        tuple: (is_valid, error_message)
    """
    try:
        # Check if file exists
        if not os.path.exists(image_path):
            return False, "Image file not found"
        
        # Check file size
        file_size = os.path.getsize(image_path)
        if file_size == 0:
            return False, "Image file is empty"
        
        if file_size > 10 * 1024 * 1024:  # 10MB limit
            return False, "Image file too large (max 10MB)"
        
        # Try to open and read the image
        try:
            img = cv2.imread(image_path)
            if img is None:
                return False, "Could not read image file (invalid format)"
            
            # Check image dimensions
            height, width = img.shape[:2]
            if width == 0 or height == 0:
                return False, "Image has invalid dimensions"
            
            if width < 50 or height < 50:
                return False, "Image is too small (min 50x50 pixels)"
            
            return True, "Image is valid"
            
        except Exception as e:
            return False, f"Error reading image: {str(e)}"
    
    except Exception as e:
        return False, f"Validation error: {str(e)}"


def get_image_info(image_path):
    """
    Get information about an image
    
    Args:
        image_path: Path to the image file
    
    Returns:
        dict: Image information
    """
    try:
        img = cv2.imread(image_path)
        if img is None:
            return None
        
        height, width = img.shape[:2]
        channels = img.shape[2] if len(img.shape) > 2 else 1
        file_size = os.path.getsize(image_path)
        
        # Calculate image quality metrics
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) if channels > 1 else img
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        brightness = np.mean(gray)
        
        return {
            "width": width,
            "height": height,
            "channels": channels,
            "file_size_kb": round(file_size / 1024, 2),
            "sharpness": round(laplacian_var, 2),  # Higher is sharper
            "brightness": round(brightness, 2),  # 0-255
            "aspect_ratio": round(width / height, 2)
        }
    
    except Exception as e:
        print(f"[ERROR] Could not get image info: {str(e)}")
        return None


def resize_image(image_path, target_size=(640, 640), maintain_aspect=True):
    """
    Resize an image to target size
    
    Args:
        image_path: Path to the image file
        target_size: Target size (width, height)
        maintain_aspect: If True, maintain aspect ratio
    
    Returns:
        str: Path to resized image
    """
    try:
        img = cv2.imread(image_path)
        if img is None:
            return image_path
        
        if maintain_aspect:
            # Calculate scaling factor
            height, width = img.shape[:2]
            scale = min(target_size[0] / width, target_size[1] / height)
            new_width = int(width * scale)
            new_height = int(height * scale)
            
            # Resize
            img_resized = cv2.resize(img, (new_width, new_height), interpolation=cv2.INTER_AREA)
            
            # Create canvas and center image
            canvas = np.zeros((target_size[1], target_size[0], 3), dtype=np.uint8)
            y_offset = (target_size[1] - new_height) // 2
            x_offset = (target_size[0] - new_width) // 2
            canvas[y_offset:y_offset+new_height, x_offset:x_offset+new_width] = img_resized
            
            img_resized = canvas
        else:
            img_resized = cv2.resize(img, target_size, interpolation=cv2.INTER_AREA)
        
        # Save resized image
        resized_path = image_path.replace('.jpg', '_resized.jpg').replace('.png', '_resized.png')
        cv2.imwrite(resized_path, img_resized)
        
        return resized_path
    
    except Exception as e:
        print(f"[ERROR] Could not resize image: {str(e)}")
        return image_path

