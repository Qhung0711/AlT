#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script để mã hóa ảnh thành Base64 và tạo file JavaScript
Bảo vệ ảnh khỏi việc truy cập trực tiếp khi deploy lên GitHub Pages
"""

import os
import base64
import json
from pathlib import Path

def encode_image_to_base64(image_path):
    """Mã hóa một ảnh thành Base64"""
    try:
        with open(image_path, 'rb') as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
            # Xác định MIME type dựa trên extension
            ext = image_path.suffix.lower()
            if ext in ['.jpg', '.jpeg']:
                mime_type = 'image/jpeg'
            elif ext == '.png':
                mime_type = 'image/png'
            elif ext == '.gif':
                mime_type = 'image/gif'
            elif ext == '.webp':
                mime_type = 'image/webp'
            else:
                mime_type = 'image/jpeg'  # Default
            
            return f"data:{mime_type};base64,{encoded_string}"
    except Exception as e:
        print(f"Lỗi khi mã hóa {image_path}: {e}")
        return None

def main():
    """Hàm chính để mã hóa tất cả ảnh"""
    images_dir = Path('images')
    output_file = 'image_data.js'
    
    if not images_dir.exists():
        print("Thư mục images không tồn tại!")
        return
    
    # Lấy danh sách tất cả file ảnh
    image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    image_files = []
    
    for ext in image_extensions:
        image_files.extend(images_dir.glob(f'*{ext}'))
        image_files.extend(images_dir.glob(f'*{ext.upper()}'))
    
    if not image_files:
        print("Không tìm thấy file ảnh nào trong thư mục images!")
        return
    
    print(f"Tìm thấy {len(image_files)} file ảnh")
    
    # Mã hóa từng ảnh
    encoded_images = {}
    for i, image_file in enumerate(sorted(image_files)):
        print(f"Đang mã hóa {i+1}/{len(image_files)}: {image_file.name}")
        encoded_data = encode_image_to_base64(image_file)
        if encoded_data:
            encoded_images[image_file.name] = encoded_data
    
    # Tạo file JavaScript
    js_content = f"""// File này được tạo tự động bởi encode_images.py
// Chứa dữ liệu ảnh đã mã hóa Base64
// Không chỉnh sửa file này thủ công!

const imageDataBase64 = {json.dumps(encoded_images, indent=2)};

// Hàm để lấy ảnh theo tên
function getImageData(imageName) {{
    return imageDataBase64[imageName] || null;
}}

// Hàm để kiểm tra ảnh có tồn tại không
function hasImage(imageName) {{
    return imageName in imageDataBase64;
}}

// Hàm để lấy danh sách tên ảnh
function getImageNames() {{
    return Object.keys(imageDataBase64);
}}

// Export cho module (nếu cần)
if (typeof module !== 'undefined' && module.exports) {{
    module.exports = {{
        imageDataBase64,
        getImageData,
        hasImage,
        getImageNames
    }};
}}
"""
    
    # Ghi file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f"\n✅ Hoàn thành! Đã mã hóa {len(encoded_images)} ảnh")
    print(f"📁 File output: {output_file}")
    print(f"💾 Kích thước file: {os.path.getsize(output_file) / (1024*1024):.2f} MB")
    
    # Tạo file danh sách ảnh cho script.js
    image_names = list(encoded_images.keys())
    names_file = 'image_names.js'
    
    names_content = f"""// Danh sách tên ảnh được tạo tự động
const imageNames = {json.dumps(image_names, indent=2)};
"""
    
    with open(names_file, 'w', encoding='utf-8') as f:
        f.write(names_content)
    
    print(f"📝 File danh sách ảnh: {names_file}")

if __name__ == "__main__":
    main() 