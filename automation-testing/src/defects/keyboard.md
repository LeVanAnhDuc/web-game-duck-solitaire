# KEYBOARD — Bug log

## Đang mở

| Bug | Mức | TC | Tóm tắt |
|---|---|---|---|
| [BUG-KEYBOARD-01](#bug-keyboard-01) | Cao | TC-KEYBOARD-012 | Thanh điều khiển không dùng được bằng bàn phím: `Enter`/`Space`/mũi tên bị bàn bài nuốt |

### BUG-KEYBOARD-01

- **TC:** TC-KEYBOARD-012 · **Requirement:** REQ-KEYBOARD-10
- **Bước tái hiện:** `./?van=20260904` → rút 1 lá → Tab tới "Hoàn lại" → `Enter` (hoặc "Ván mới" + `Space`, hoặc ô "Chế
  độ rút" + `↓`)
- **Mong đợi:** nước rút được hoàn lại / ván mới được chia / ô chọn đổi sang "Rút 3 lá" (và hỏi trước vì ván đã có nước)
- **Thực tế:** không có gì xảy ra với nút / ô chọn. `onBoardKeyDown` gắn trên `<main>` — bọc cả thanh điều khiển — xử lý
  `Enter`, `Space`, `←` `→` `↑` `↓` rồi `preventDefault()`, nên phần tử có tiêu điểm không bao giờ nhận hành động mặc định;
  phím còn tác động lên chồng bài đang là con trỏ bàn phím (vd `Enter` trên "Hoàn lại" có thể đưa lá ở cột 1 đi).

## Đã sửa

_(chưa có)_
