# DRAWMODE — Đổi chế độ rút 1 / 3 lá

Truy vết phía app: FR-10 · US-05 · F-09 (ux-feedback-2026-09) · NFR-A11Y-02.

- **REQ-DRAWMODE-01** Trước nước đi đầu tiên, đổi chế độ rút có hiệu lực ngay, không hỏi; thế bài vẫn là ván đó (cùng số hiệu), chỉ cách rút đổi.
- **REQ-DRAWMODE-02** Khi ván đã có nước đi, đổi chế độ rút phải hỏi trước, nói rõ ván sẽ bắt đầu lại; chưa có gì thay đổi khi hộp thoại đang mở.
- **REQ-DRAWMODE-03** "Giữ ván hiện tại" đóng hộp thoại, giữ nguyên ván, lịch sử và chế độ cũ.
- **REQ-DRAWMODE-04** "Đổi và chia lại" chia lại đúng ván đó (cùng số hiệu) ở chế độ mới, lịch sử về 0 — theo cả hai chiều 1 → 3 và 3 → 1; giữ ván một lần rồi đổi lại thì vẫn hỏi lại.
- **REQ-DRAWMODE-05** Khi mở, tiêu điểm nằm ở lựa chọn an toàn ("Giữ ván hiện tại"); `Escape` nghĩa là giữ ván; đóng xong tiêu điểm trả về ô "Chế độ rút".
- **REQ-DRAWMODE-06** Hộp thoại nằm trên bàn bài: không lá bài nào đè lên nó, cả hai nút bấm chuột được.
- **REQ-DRAWMODE-07** Hai nút của hộp thoại bấm được bằng bàn phím (`Enter` / `Space` khi nút có tiêu điểm), như mọi nút.
