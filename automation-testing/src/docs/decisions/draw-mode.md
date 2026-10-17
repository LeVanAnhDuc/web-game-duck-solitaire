# DRAWMODE — Quyết định

Đi cặp với `docs/requirements/draw-mode.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-10), `docs/01-product/journeys.md` (US-05 + "Điều gì có thể sai":
  phải nói rõ ván sẽ bắt đầu lại và hỏi trước), `docs/specs/ux-feedback-2026-09/design.md` (F-09: Escape, tiêu điểm),
  `docs/02-requirements/nfr.md` (NFR-A11Y-02 mọi thao tác làm được bằng bàn phím), `docs/04-state/backlog.md` (hộp thoại
  chưa bẫy Tab — nợ đã biết).
- **Code:** `client/src/views/Home/index.tsx` (`onDrawModeChange`: `moveCount === 0` thì đổi ngay; hộp thoại
  `role="dialog"` `z-40`, `autoFocus` ở nút giữ ván, `Escape` → `closeDrawModeDialog`; `onBoardKeyDown` gắn trên
  `<main>` bọc cả hộp thoại), `client/src/hooks/useGame.ts` (`setDrawMode` giữ seed, xoá lịch sử),
  `client/src/views/Home/components/CardView/index.tsx` (`zIndex` inline của lá).
- **Test đã gom (gợi ý):** `src/tests/e2e/moves/tap-and-drag.e2e.ts` — "changing draw mode asks first" (2 case, một case
  đỏ khi chạy lần đầu sau khi dời) và `accessibility/feedback.e2e.ts` F-09 viết lại ở đây thành `confirm.e2e.ts`.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Case cũ "it redeals only after the player agrees" hết 30 giây vì nút "Đổi và chia lại" bị một lá bài (z-index 404,
  Rô Át ở `?van=20260904`, 1280×720) che: Playwright từ chối bấm vì phần tử khác nhận cú bấm. Đó là bug của app
  (BUG-DRAWMODE-01), không phải lỗi script. Bộ cũ xanh ở 4 viewport cũ vì ở đó nút không trùng lá có z cao.
- **Q2** Các case kiểm **hệ quả** của việc đồng ý (TC-DRAWMODE-004/005/007) bấm nút bằng `dispatchEvent("click")` để kết
  quả không phụ thuộc hai bug về đường tới nút; đường tới nút (chuột, bàn phím) có case riêng mang `test.fail()`.
- **Q3** `Enter` / `Space` trên nút của hộp thoại là đường bàn phím tiêu chuẩn của một `<button>`; NFR-A11Y-02 đòi mọi thao
  tác làm được bằng bàn phím. Handler phím của bàn bài nằm trên `<main>` và `preventDefault` hai phím đó, nên nút không bao
  giờ nhận được → BUG-DRAWMODE-02. `Escape` (F-09) vẫn chạy.
- **Q4** Bẫy Tab trong hộp thoại: backlog ghi là nợ đã biết, chưa thành yêu cầu → ngoài phạm vi.

## Tài khoản test

Không có.

## Ngoài phạm vi

- Bẫy Tab trong hộp thoại (Q4, `docs/04-state/backlog.md`).

## Tech debt liên quan

- BUG-DRAWMODE-01, BUG-DRAWMODE-02.
