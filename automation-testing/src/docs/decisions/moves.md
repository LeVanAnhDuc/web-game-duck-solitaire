# MOVES — Quyết định

Đi cặp với `docs/requirements/moves.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-02, FR-03, FR-04), `docs/01-product/journeys.md` (US-01, US-02 +
  "Điều gì có thể sai"), `docs/specs/klondike/design.md` §1 (bảng luật nhận / cho), §2 (máy trạng thái chạm / kéo, ngưỡng
  6px), `docs/03-design/invariants.md` (#6 chạm và kéo cùng một `Move`, #7 nước rỗng không vào lịch sử),
  `docs/02-requirements/nfr.md` (NFR-REL-03), `docs/specs/board-motion/design.md` (tầng lá phẳng), `README.md` §Controls.
- **Code:** `client/src/hooks/useSelection.ts` (chạm / kéo / huỷ, `swallowNextTap`, `elementFromPoint`),
  `client/src/views/Home/index.tsx` (`tapCard`, `tapOrDropOnStock`, `flashReject` + vùng `role="status"`),
  `client/src/game/moves.ts`, `client/src/lib/strings.ts`.
- **Test đã gom (gợi ý):** `src/tests/e2e/moves/tap-and-drag.e2e.ts` (từ `client/e2e/play.spec.ts`): phần "drawing from
  the stock" và "moving cards" viết lại thành `tap.e2e.ts`, `stock.e2e.ts`, `rules.e2e.ts`, `drag.e2e.ts`; phần còn lại
  (một chạm, hai chạm, bàn phím, hoàn lại, chế độ rút) thuộc module khác.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** "Kéo rồi thả ngay tại chỗ cũ → phải hiểu là một cú chạm chọn bài" (US-02) đọc theo design §2: dưới ngưỡng 6px
  là chạm (chọn bài); đã qua ngưỡng rồi thả lại chồng cũ là huỷ kéo, không chọn, không nước đi. → REQ-MOVES-16,
  TC-MOVES-022 / 024.
- **Q2** "Không kẹt" (NFR-REL-03, US-02) gồm cả cú chạm kế tiếp: nếu sau một lần kéo cú chạm đầu tiên bị nuốt thì người
  chơi vẫn còn ở giữa một cử chỉ dở dang. → REQ-MOVES-16, BUG-MOVES-02.
- **Q3** Vùng trống "giữa hai chồng" (US-01) kiểm ở khe giữa hai cột liền nhau, ngang mép trên của ô cột — chỗ không có lá
  nào và không có vùng chạm 44px nào phủ tới ở bề rộng desktop. → REQ-MOVES-04, BUG-MOVES-03.
- **Q4** Thả trên hai chồng (US-02) kiểm bằng phần lá được thả phủ lên mỗi cột (tính từ chỗ nắm lá và chỗ nhả chuột),
  không bằng vị trí con trỏ. Docs nói rõ "chồng có phần chồng lấn lớn hơn"; code chọn theo điểm dưới con trỏ. → REQ-MOVES-17,
  BUG-MOVES-01.
- **Q5** "Bị từ chối" kiểm qua vùng `role="status"` ("Nước đi không hợp lệ") — kênh duy nhất còn lại khi chuyển động tắt
  (NFR-A11Y-06); ánh đỏ và lắc lá là hoạt ảnh, không kiểm ở đây.
- **Q6** Một cú chạm ngay sau một nước "một chạm" bị nuốt trong 300ms (nửa sau của chạm đúp, FR-14) — đúng thiết kế. Test
  nào chạm tiếp ngay sau một nước một chạm thì cài `page.clock` và tua qua cửa sổ đó.

## Tài khoản test

Không có.

## Ngoài phạm vi

- Cử chỉ cảm ứng thật (touch): app dùng Pointer Events chung cho chuột và ngón tay; bộ này kéo bằng chuột.
- Ánh đỏ / lắc lá khi bị từ chối (hoạt ảnh, module `motion` / `accessibility` lo phần kênh không phụ thuộc chuyển động).

## Tech debt liên quan

- BUG-MOVES-01, BUG-MOVES-02, BUG-MOVES-03 (xem `defects/moves.md`).
