# KEYBOARD — Chơi bằng bàn phím

Truy vết phía app: FR-12 · NFR-A11Y-02 · klondike design §2 · F-06 / F-07 (ux-feedback-2026-09) · README §Controls.

- **REQ-KEYBOARD-01** Bàn bài là một điểm dừng Tab duy nhất (roving tabindex); Tab vào bàn thì tiêu điểm ở cột 1, Tab tiếp thì rời bàn sang thanh điều khiển.
- **REQ-KEYBOARD-02** `←` `→` đi dọc một hàng và quay vòng ở hai đầu; `↑` `↓` đổi giữa hàng trên (chồng rút, bài đã rút, 4 chồng đích) và hàng cột, giữ cột trong giới hạn hàng mới.
- **REQ-KEYBOARD-03** Tiêu điểm bàn phím luôn nhìn thấy được trên chồng đang được chọn.
- **REQ-KEYBOARD-04** `Space` cầm lá trên cùng của chồng có tiêu điểm, `Space` trên chồng khác đặt nó xuống (đi nước nếu hợp lệ, bị từ chối nếu không); `Space` trên chồng rút là rút bài, còn đang cầm lá thì là nước bị từ chối.
- **REQ-KEYBOARD-05** `Space` trên chồng không có gì để cầm thì bị từ chối và được đọc lên.
- **REQ-KEYBOARD-06** `Enter` tự tìm chỗ cho lá trên cùng (hoặc dãy đang cầm) như chạm đúp, và con trỏ bàn phím đi theo lá tới chồng mới.
- **REQ-KEYBOARD-07** `Escape` bỏ lá đang cầm.
- **REQ-KEYBOARD-08** Đang cầm một dãy từ cột, `↑` `↓` đổi độ sâu của dãy, trong giới hạn các lá ngửa (ít nhất 1 lá).
- **REQ-KEYBOARD-09** Bản đồ phím trên màn hình ẩn khi dùng chuột, hiện ngay khi bàn bài nhận tiêu điểm bàn phím; câu hướng dẫn luôn có cho trình đọc màn hình.
- **REQ-KEYBOARD-10** Các nút trên thanh điều khiển và ô "Chế độ rút" dùng được bằng bàn phím như mọi nút / ô chọn (`Enter`, `Space`, phím mũi tên).
- **REQ-KEYBOARD-11** Chơi trọn một ván tới màn thắng chỉ bằng bàn phím.
