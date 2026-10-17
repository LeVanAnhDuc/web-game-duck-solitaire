# RESPONSIVE — Bug log

## Đang mở

| Bug | Mức | TC | Tóm tắt |
|---|---|---|---|
| [BUG-RESPONSIVE-01](#bug-responsive-01) | Cao | TC-RESPONSIVE-005 | Ở 320/375px, cầm một lá rồi chạm chồng rút: không đổi bàn, không bỏ chọn, không báo — kẹt |

### BUG-RESPONSIVE-01

- **TC:** TC-RESPONSIVE-005 · **Requirement:** REQ-RESPONSIVE-05
- **Bước tái hiện:** cửa sổ 320×720 hoặc 375×720, `./?van=20260904` → `Tab` → `Space` (cầm lá cột 1) → chạm lá trên cùng
  chồng rút
- **Mong đợi:** nước bị từ chối: bỏ lựa chọn, "Nước đi không hợp lệ" (như ở 768 / 1024 / 1440px)
- **Thực tế:** lá vẫn được cầm, không có thông báo, bàn không đổi. Đã ghi sẵn trong `docs/04-state/backlog.md` ("Cầm bài
  rồi chạm chồng rút ở 320/375px", mức cao, chưa rõ cơ chế, chưa sửa); bộ test này xác nhận lại ngày 2026-10-18.

## Đã sửa

_(chưa có)_
