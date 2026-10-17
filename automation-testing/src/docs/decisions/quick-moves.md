# QUICKMOVES — Quyết định

Đi cặp với `docs/requirements/quick-moves.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-05, FR-06, FR-14), `docs/01-product/journeys.md` (US-03 + "Điều gì có
  thể sai"), `docs/specs/klondike/design.md` §1 (`findAutoTarget`: chồng đích → cột có bài → cột trống, chỉ số nhỏ nhất),
  `docs/specs/board-motion/design.md` (một chạm đưa lá lên), `docs/03-design/invariants.md` (#7), `README.md` §Controls.
- **Code:** `client/src/views/Home/index.tsx` (`tapCard`: `findFoundationTarget` + `count === 1`, `suppressNextTap`;
  `autoMoveFrom` + `flashReject`), `client/src/hooks/useSelection.ts` (`TAP_SUPPRESS_MS = 300`),
  `client/src/views/Home/mains/Toolbar/index.tsx` (`aria-disabled`).
- **Test đã gom (gợi ý):** `src/tests/e2e/moves/tap-and-drag.e2e.ts` — "one tap puts a card up" (3 case) và "two taps look
  further" (1 case) viết lại ở đây thành `taps.e2e.ts`.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** "Cả bàn không còn lá úp" (US-03) đọc theo design §1: `canAutoComplete` = mọi `down` của cột rỗng; lá trong chồng
  rút không tính (chuỗi tự hoàn tất tự rút / lật lại khi cần). → REQ-QUICKMOVES-06.
- **Q2** Nút "Hoàn tất" và "Hoàn lại" tắt bằng `aria-disabled` (vẫn nhận click). Test bấm thẳng vào nút đang tắt để chứng
  minh "bấm cũng không làm gì", không chỉ đọc thuộc tính.
- **Q3** Chạm đúp trong test là `dblclick` của Playwright (hai click + `dblclick`), đúng cử chỉ trình duyệt nhận từ chuột.
- **Q4** Thứ tự ưu tiên giữa hai cột cùng nhận được (chỉ số nhỏ nhất) không tự động hoá: cần một thế bài có một lá vừa
  hai cột ngay từ đầu, và unit test `client/src/game/auto.test.ts` đã phủ. Phần "chồng đích trước" và "cột trống sau
  cùng" có case UI.

## Tài khoản test

Không có.

## Ngoài phạm vi

- Thứ tự giữa hai cột cùng nhận (Q4).

## Tech debt liên quan

_(không có)_
