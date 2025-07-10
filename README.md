# 🔐 Gallery Site với Bảo vệ Ảnh

Dự án gallery site với hệ thống bảo vệ ảnh khỏi việc truy cập trực tiếp khi deploy lên GitHub Pages.

## 🛡️ Tính năng Bảo vệ

- **Ẩn thư mục images**: Sử dụng `.gitignore` để ẩn thư mục `images/` khỏi Git repository
- **Mã hóa Base64**: Chuyển đổi ảnh thành Base64 để ẩn đường dẫn thực
- **Tương thích ngược**: Code vẫn hoạt động bình thường nếu không có file Base64

## 📁 Cấu trúc Dự án

```
AlT/
├── images/                 # Thư mục ảnh (bị ẩn bởi .gitignore)
├── index.html             # Trang chính
├── view.html              # Trang xem ảnh lớn
├── script.js              # Logic chính
├── style.css              # CSS
├── image_data.js          # File chứa ảnh Base64 (tạo tự động)
├── encode_images.js       # Script mã hóa ảnh
├── encode.html            # Trang web để mã hóa ảnh
├── .gitignore             # Ẩn thư mục images
└── README.md              # Hướng dẫn này
```

## 🚀 Cách sử dụng

### 1. Chuẩn bị ảnh
- Đặt tất cả ảnh vào thư mục `images/`
- Đảm bảo tên file ảnh khớp với danh sách trong `script.js`

### 2. Mã hóa ảnh thành Base64

#### Cách 1: Sử dụng trang web (Khuyến nghị)
1. Mở file `encode.html` trong trình duyệt
2. Chọn tất cả ảnh trong thư mục `images/`
3. Nhấn "Mã hóa ảnh"
4. Tải về file `image_data.js` và `image_names.js`
5. Đặt file `image_data.js` vào thư mục gốc của dự án

#### Cách 2: Sử dụng Python (nếu có Python)
```bash
python encode_images.py
```

### 3. Deploy lên GitHub Pages
1. Push code lên GitHub (thư mục `images/` sẽ không được upload)
2. Bật GitHub Pages trong repository settings
3. Website sẽ hoạt động với ảnh Base64

## 🔧 Cách hoạt động

### Khi có file `image_data.js`:
- Ảnh được load từ dữ liệu Base64
- Không cần thư mục `images/` trên server
- Ảnh được bảo vệ khỏi truy cập trực tiếp

### Khi không có file `image_data.js`:
- Ảnh được load từ thư mục `images/` như bình thường
- Code vẫn hoạt động bình thường

## 📝 Lưu ý quan trọng

1. **Kích thước file**: File `image_data.js` sẽ rất lớn (có thể vài MB)
2. **Thời gian load**: Lần đầu load sẽ chậm hơn do phải tải dữ liệu Base64
3. **Cache**: Trình duyệt sẽ cache file `image_data.js` nên các lần sau sẽ nhanh hơn
4. **Bảo mật**: Base64 không phải là mã hóa bảo mật, chỉ ẩn đường dẫn thực

## 🔄 Cập nhật ảnh

Khi thêm/sửa/xóa ảnh:
1. Cập nhật danh sách `imageNames` trong `script.js`
2. Chạy lại script mã hóa ảnh
3. Thay thế file `image_data.js` mới
4. Deploy lại

## 🛠️ Troubleshooting

### Ảnh không hiển thị
- Kiểm tra tên file trong `image_data.js` có khớp với `script.js` không
- Kiểm tra file `image_data.js` có được include đúng không

### File quá lớn
- Có thể chia nhỏ file `image_data.js` thành nhiều phần
- Hoặc sử dụng CDN để host file Base64

### Lỗi JavaScript
- Kiểm tra console để xem lỗi cụ thể
- Đảm bảo thứ tự load script: `image_data.js` trước `script.js`

## 📞 Hỗ trợ

Nếu gặp vấn đề, hãy kiểm tra:
1. Console của trình duyệt
2. Network tab để xem file nào bị lỗi
3. Đảm bảo tất cả file được include đúng thứ tự 