# Web Document Management System

Hệ thống quản lý tài liệu sử dụng Google Drive API và Firebase Authentication.

## Cài đặt

1. Clone repository:
```bash
git clone https://github.com/your-username/web_document.git
cd web_document
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file `.env` và thêm các biến môi trường:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Phát triển

Chạy server development:
```bash
npm run dev
```

## Triển khai lên GitHub Pages

1. Cập nhật `vite.config.js` với tên repository của bạn:
```javascript
export default defineConfig({
  base: '/your-repo-name/',
  // ...
})
```

2. Push code lên GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

3. Triển khai lên GitHub Pages:
```bash
npm run deploy
```

4. Trong repository settings trên GitHub, cấu hình GitHub Pages để sử dụng branch `gh-pages`.

## Tính năng

- Đăng nhập bằng Google
- Quản lý tài liệu (tải lên, xem, xóa)
- Tìm kiếm tài liệu
- Phân quyền người dùng
- Quản lý tài khoản Google Drive 