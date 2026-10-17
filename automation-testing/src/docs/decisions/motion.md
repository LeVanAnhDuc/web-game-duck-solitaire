# MOTION — Quyết định

Đi cặp với `docs/requirements/motion.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/specs/board-motion/design.md` (§3 transform, §5 bảng mười hiệu ứng, §7 kiểm thử),
  `docs/decisions/0009-tang-la-phang-thay-cho-chong-bai-so-huu-la.md`, `docs/02-requirements/nfr.md` (NFR-PERF-02),
  `docs/03-design/invariants.md` (#8, #11, #13), `docs/design-system/solitaire/MASTER.md` §4 (thời lượng).
- **Code:** `client/src/hooks/useBoardMotion.ts` (cửa sổ chia bài `DEAL_MS`, `flying` trong `MOVE_MS`),
  `client/src/views/Home/mains/BoardLayer/index.tsx` (`FLIGHT_Z`, `interactive={!flying}`, độ trễ theo `dealOrder` / độ
  sâu), `client/src/views/Home/components/CardView/index.tsx` (`transform`, `scale(1.04)`, `rotateY`),
  `client/src/app/globals.css` (`--dur-*`, `--stagger-*`, keyframes `card-reject`, `reject-flash`, `pile-accept`).
- **Test đã gom (gợi ý):** `src/tests/e2e/motion/animation.e2e.ts` (từ `client/e2e/motion.spec.ts`) — chuẩn hoá tại chỗ; phần
  "with motion off" chuyển sang `accessibility`.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Kiểm hiệu ứng đã **được gắn** (thuộc tính, thời lượng, độ trễ, keyframes, style inline) chứ không xem nó chạy: trang
  headless không vẽ thì transition không tiến, quan sát nó là đo bộ chạy test. Cách này kế thừa bộ cũ.
- **Q2** Đồng hồ trang chạy bằng `page.clock`: cài trước khi mở, `pauseAt` qua cửa sổ chia bài rồi đứng yên, nên "đang bay"
  hay "đang nháy" là một trạng thái test giữ được, không phải một cuộc đua (lần đầu đọc ngay sau cú chạm thì thỉnh thoảng
  trễ hơn 180ms bay).
- **Q3** Lật bài kiểm qua `transform` inline của phần tử mặt trong (`rotateY(180deg)` → `rotateY(0deg)`) trên cùng một id lá
  — chứng minh "quay, không tráo" mà không cần chụp khung hình (bộ cũ chụp 60 ảnh để ép vẽ).
- **Q4** Màn mừng khi thắng (#10: chồng đích sáng lần lượt, thác bài canvas) không tự động hoá: cần một ván thắng (một phút
  chơi lại) chỉ để đọc keyframes; ADR-0003 đặt thác bài trên canvas, ngoài DOM.

## Tài khoản test

Không có.

## Ngoài phạm vi

- Màn mừng khi thắng (Q4). NFR-PERF-02 (< 100ms mỗi nước trên CPU chậm 4×) đo tay bằng Performance panel.

## Tech debt liên quan

_(không có)_
