# DRAWMODE — Bug log

## Đang mở

| Bug | Mức | TC | Tóm tắt |
|---|---|---|---|
| [BUG-DRAWMODE-01](#bug-drawmode-01) | Cao | TC-DRAWMODE-008 | Lá bài vẽ đè lên hộp thoại đổi chế độ rút; "Đổi và chia lại" bị che, bấm chuột trúng lá bài |
| [BUG-DRAWMODE-02](#bug-drawmode-02) | Cao | TC-DRAWMODE-009 | `Enter` / `Space` trên nút của hộp thoại bị bàn bài nuốt: không nút nào bấm được bằng bàn phím |

### BUG-DRAWMODE-01

- **TC:** TC-DRAWMODE-008 · **Requirement:** REQ-DRAWMODE-06
- **Bước tái hiện:** `./?van=20260904`, cửa sổ 1280×720 → rút 1 lá → chọn "Rút 3 lá"
- **Mong đợi:** hộp thoại phủ trên bàn bài, cả hai nút nhìn thấy và bấm được
- **Thực tế:** các lá ngửa của cột 2–7 vẽ đè lên hộp thoại (lá mang `z-index` inline tới hàng trăm, hộp thoại `z-40`);
  điểm giữa nút "Đổi và chia lại" thuộc Rô Át (`z-index: 404`), nên bấm chuột vào nút là bấm vào lá bài. Chỉ thấy được
  nửa tiêu đề và câu hỏi. Ảnh: chạy TC-DRAWMODE-008 bỏ `test.fail()`.

### BUG-DRAWMODE-02

- **TC:** TC-DRAWMODE-009 · **Requirement:** REQ-DRAWMODE-07
- **Bước tái hiện:** `./?van=20260904` → rút 1 lá → chọn "Rút 3 lá" (tiêu điểm ở "Giữ ván hiện tại") → `Tab` (tiêu
  điểm ở "Đổi và chia lại") → `Enter` (hoặc `Space`)
- **Mong đợi:** chia lại ở rút 3, hộp thoại đóng
- **Thực tế:** không có gì xảy ra, hộp thoại vẫn mở. `onBoardKeyDown` gắn trên `<main>` — bọc cả hộp thoại — xử lý
  `Enter` / `Space` và gọi `preventDefault()`, nên nút không bao giờ nhận cú kích hoạt; phím còn tác động lên chồng bài
  đang có tiêu điểm phía sau hộp thoại. Chỉ `Escape` thoát được.

## Đã sửa

_(chưa có)_
