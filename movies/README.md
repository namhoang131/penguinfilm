# Cấu trúc thư mục Movies

Thư mục này chứa tất cả các file video phim được tổ chức theo cấu trúc:

\`\`\`
movies/
├── jujutsu_kaisen/
│   ├── ep1.mp4
│   ├── ep2.mp4
│   ├── ep3.mp4
│   └── ...
├── demon_slayer/
│   ├── ep1.mp4
│   ├── ep2.mp4
│   ├── ep3.mp4
│   └── ...
├── attack_on_titan/
│   ├── ep1.mp4
│   ├── ep2.mp4
│   ├── ep3.mp4
│   └── ...
├── your_name/
│   └── movie.mp4
├── spirited_away/
│   └── movie.mp4
├── weathering_with_you/
│   └── movie.mp4
├── one_piece/
│   ├── ep1.mp4
│   ├── ep2.mp4
│   ├── ep3.mp4
│   └── ...
└── naruto/
    ├── ep1.mp4
    ├── ep2.mp4
    ├── ep3.mp4
    └── ...
\`\`\`

## Quy tắc đặt tên:

1. **Folder phim**: Sử dụng ID phim từ movies.json (snake_case)
2. **File tập phim**: Định dạng `ep{số_tập}.mp4` (ví dụ: ep1.mp4, ep2.mp4)
3. **File phim lẻ**: Sử dụng `movie.mp4`

## Cách thêm phim mới:

1. Tạo folder mới với tên ID phim
2. Thêm các file video tập phim vào folder
3. Cập nhật thông tin phim trong `movies.json`
4. Đảm bảo tên file khớp với `filename` trong JSON

## Lưu ý:

- Tất cả file video phải có định dạng MP4
- Chất lượng khuyến nghị: 720p hoặc 1080p
- Kích thước file nên được tối ưu để tải nhanh
- Đảm bảo tên file không có ký tự đặc biệt hoặc khoảng trắng
