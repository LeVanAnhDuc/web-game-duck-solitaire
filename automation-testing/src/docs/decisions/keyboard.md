# KEYBOARD — Quyết định

Đi cặp với `docs/requirements/keyboard.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-12), `docs/02-requirements/nfr.md` (NFR-A11Y-02: "thử tay + E2E chơi
  hết ván chỉ bằng phím"), `docs/specs/klondike/design.md` §2 + §5, `docs/specs/ux-feedback-2026-09/design.md` (F-06 bản
  đồ phím, F-07 con trỏ đi theo lá), `README.md` §Controls.
- **Code:** `client/src/views/Home/index.tsx` (`ROWS`, `onBoardKeyDown` gắn trên `<main>`, `gridPosOf`,
  `FocusActivePile`), `client/src/app/globals.css` (`.keyboard-map`, `:has(:focus-visible)`), `client/src/lib/strings.ts`.
- **Test đã gom (gợi ý):** `src/tests/e2e/moves/tap-and-drag.e2e.ts` — "keyboard play" (3 case) và
  `accessibility/feedback.e2e.ts` F-06, F-07 viết lại ở đây thành `keyboard.e2e.ts`.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** "Chơi hết ván chỉ bằng phím" (NFR-A11Y-02) kiểm bằng ván thắng được trong `src/data/winnable.ts`: phần đã ghi
  sẵn (tới lúc mọi lá ngửa) đi bằng phím mũi tên + `Space` (+ `↑` để cầm dãy sâu) + `Enter` cho nước lên chồng đích; phần
  còn lại người chơi bàn phím tự đẩy bằng `Enter` từng chồng, rút khi một vòng không đưa được lá nào lên. Không dùng nút
  "Hoàn tất" vì thanh điều khiển chưa dùng được bằng bàn phím (BUG-KEYBOARD-01). Test dài (~1,5 phút).
- **Q2** Cầm lá từ cột thì `↑` `↓` đổi độ sâu, không đổi hàng (README §Controls) — nên đưa lá cột lên chồng đích bằng bàn
  phím là `Enter`. Đây là thiết kế, không phải bug.
- **Q3** Nút trên thanh điều khiển nằm trong `<main>`, nơi `onBoardKeyDown` bắt `Enter`, `Space` và bốn phím mũi tên rồi
  `preventDefault()`: nút không nhận `Enter`/`Space`, ô chọn không đổi giá trị bằng mũi tên, và phím còn tác động lên
  chồng bài đang là con trỏ. NFR-A11Y-02 + README ("Play the whole game from the keyboard") → bug BUG-KEYBOARD-01. Cùng
  gốc với BUG-DRAWMODE-02 (hộp thoại) nhưng ở chỗ khác, người dùng gặp ở chỗ khác.
- **Q4** "Tiêu điểm thấy được" kiểm bằng style tính được của chồng có tiêu điểm (outline hoặc box-shadow khác none);
  độ tương phản 3:1 của vòng tiêu điểm thuộc NFR-A11Y-06, ngoài phạm vi tự động (đo tay bằng devtools).

## Tài khoản test

Không có.

## Ngoài phạm vi

- Độ tương phản của vòng tiêu điểm (Q4).

## Tech debt liên quan

- BUG-KEYBOARD-01.
