# MOVES — Bug log

## Đang mở

| Bug | Mức | TC | Tóm tắt |
|---|---|---|---|
| [BUG-MOVES-01](#bug-moves-01) | Trung bình | TC-MOVES-025 | Thả lá phủ hai cột thì cột dưới con trỏ thắng, không phải cột bị phủ nhiều hơn |
| [BUG-MOVES-02](#bug-moves-02) | Cao | TC-MOVES-026 | Cú chạm đầu tiên sau mọi lần kéo (thả được, bị từ chối, hay huỷ) bị nuốt mất |
| [BUG-MOVES-03](#bug-moves-03) | Thấp | TC-MOVES-005 | Chạm vào khe trống giữa hai cột không bỏ lựa chọn |

### BUG-MOVES-01

- **TC:** TC-MOVES-025 · **Requirement:** REQ-MOVES-17
- **Bước tái hiện:** `./?van=1`, 1280×720 → nắm Tép Ba (cột 2) ở mép trái → kéo sao cho con trỏ nằm 3px trong mép phải
  cột 6, lá được thả phủ gần trọn cột 7 (Cơ Bốn, nơi nó hợp lệ) → nhả
- **Mong đợi:** lá vào cột 7 — cột có phần chồng lấn lớn hơn (US-02 "Điều gì có thể sai")
- **Thực tế:** đích là cột 6 (dưới con trỏ, `useSelection.pileKeyAt` dùng `elementFromPoint`), nước bị từ chối, "Nước
  đi không hợp lệ", Tép Ba về chỗ cũ

### BUG-MOVES-02

- **TC:** TC-MOVES-026 · **Requirement:** REQ-MOVES-16
- **Bước tái hiện:** `./?van=1` → kéo Tép Ba sang cột 7 (hoặc sang cột 1, bị từ chối; hoặc nhả ngoài cửa sổ) → chạm Cơ Đầm
- **Mong đợi:** Cơ Đầm được chọn, như mọi cú chạm
- **Thực tế:** không có gì xảy ra; phải chạm lần hai. `useSelection` đặt `swallowNextTap` khi kết thúc kéo để nuốt cú
  `click` đi kèm `pointerup`, nhưng khi kéo kết thúc trên một phần tử khác chỗ bắt đầu thì trình duyệt phát `click` ở tổ
  tiên chung (không phải lá bài) — hoặc không phát gì (nhả ngoài cửa sổ) — nên cờ còn nguyên và ăn mất cú chạm thật tiếp theo

### BUG-MOVES-03

- **TC:** TC-MOVES-005 · **Requirement:** REQ-MOVES-04
- **Bước tái hiện:** `./?van=1` → chạm Tép Ba (được chọn) → chạm vào khe giữa cột 5 và cột 6, ngang mép trên ô cột
- **Mong đợi:** bỏ lựa chọn (US-01 "Điều gì có thể sai")
- **Thực tế:** Tép Ba vẫn được chọn — khe giữa các cột không có trình xử lý chạm nào

## Đã sửa

_(chưa có)_
