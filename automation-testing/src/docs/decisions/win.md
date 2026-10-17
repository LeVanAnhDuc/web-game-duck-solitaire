# WIN — Quyết định

Đi cặp với `docs/requirements/win.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-06, FR-08), `docs/01-product/journeys.md` (US-03 + "Điều gì có thể
  sai": Undo giữa chừng, nút bật khi còn lá úp; US-05: Ván mới giữa chuỗi), `docs/03-design/invariants.md` (#9),
  `docs/decisions/0003-dom-cho-bai-canvas-cho-man-thang.md`, `docs/specs/klondike/design.md` §1 (`autoCompleteMoves`).
- **Code:** `client/src/views/Home/ghosts/AutoCompleteRunner/index.tsx` (một nước mỗi 110ms bằng `window.setTimeout`),
  `client/src/views/Home/ghosts/CelebrateWin/index.tsx` (chuyển động tắt thì không có màn mừng động),
  `client/src/views/Home/components/WinOverlay/index.tsx` (`role="dialog"`, tự nhận tiêu điểm),
  `client/src/views/Home/index.tsx` (`onUndo` / `onNewGame` gọi `stopAuto`).
- **Test đã gom (gợi ý):** `src/tests/e2e/win/replay.e2e.ts` (từ `client/e2e/win.spec.ts`) — chuẩn hoá tại chỗ.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Ván thắng được lấy từ fixture `src/data/files/winnable.json` (sinh bằng `client/scripts/find-winnable.ts`), chơi lại
  bằng **kéo thả** (một chạm sẽ tự đưa lá lên và lệch kịch bản). Mốc so sánh từng nước là mô hình hộp đen số lá mỗi chồng
  (`src/utils/pile-counts.ts`), không import engine của app.
- **Q2** N trong "Xong ván trong N nước đi" không biết trước (số nước tự hoàn tất do app chọn): kiểm câu đúng mẫu, N ≥ số
  nước kịch bản + số lá còn phải lên chồng đích lúc bấm "Hoàn tất".
- **Q3** "Dừng ngay" kiểm bằng `page.clock`: chạy 400ms đồng hồ giả (vài nước), bấm "Hoàn lại", chạy thêm 3 giây — thế bài
  không đổi nữa. Tương tự với "Ván mới".
- **Q4** Màn mừng (thác bài canvas, chồng đích nhảy) là hoạt ảnh; với chuyển động tắt (mặc định của suite) màn thắng hiện
  ngay. Phần hoạt ảnh thuộc module `motion` / ngoài phạm vi.

## Tài khoản test

Không có.

## Ngoài phạm vi

- Thác bài canvas của màn thắng (Q4).

## Tech debt liên quan

_(không có)_
