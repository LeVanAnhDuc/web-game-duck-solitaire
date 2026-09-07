# Kế hoạch hiện thực · Tầng lá phẳng, hiệu ứng, một chạm

> **Liên quan:** [`design.md`](design.md) · FR-04 · FR-05 · FR-06 · FR-08 · FR-14
> **Ngày:** 2026-09-07 · nhánh `feat/board-motion`

Thứ tự các giai đoạn là thứ tự phụ thuộc. TDD cho mọi việc có logic.

Giai đoạn 1 là điểm không quay lại: sau khi `PileView` mất quyền vẽ lá, bàn bài không
chạy được cho tới khi `BoardLayer` xong. Nên giai đoạn 0 và 1 phải đi liền nhau.

---

## Giai đoạn 0 · Nền: token, engine, helper dùng chung

- [x] `MASTER.md` §3 thêm `--gap-y` (16/24/32px); §4 thêm `--stagger-run` 20ms và `--stagger-deal` 25ms
- [x] `globals.css` khai ba token mới ở cả ba breakpoint
- [x] `src/lib/motion.ts` — chuyển `prefersReducedMotion()` ra khỏi `WinOverlay` để hai chỗ dùng chung
- [x] `game/auto.ts` — `findFoundationTarget` + test: không bao giờ trả đích tableau, `null` khi không nhận, khớp `findAutoTarget` ở phần foundation

## Giai đoạn 1 · Tầng lá phẳng

- [x] `src/lib/layout.ts` + test: 52 placement, thứ tự bộ bài, toạ độ khớp công thức §2 cho cả 4 loại chồng ở draw-1 và draw-3, `faceUp` khớp state, `z` tăng trong chồng và không chồng dải giữa các chồng, `pileHeight`, `dealOrder` là hoán vị 0..51
- [x] `CardView` — props `x/y/z`, hai mặt bài với `backface-visibility`, `rotateY` trên `.card-inner`, `id={card-<id>}`, `data-pile`; giữ `aria-label`, vùng chạm 44px, `.focus-ring`
- [x] `CardView` test: hai mặt cùng trong DOM, `data-face`, hai mặt `aria-hidden`, vùng chạm ≥ 44px, transform có `translate` + `scale` khi được chọn
- [x] `PileSlot` thay `PileView`: vùng thả, `aria-label`, `aria-owns`, viền rỗng, tiêu điểm, chiều cao từ `pileHeight`
- [x] `PileSlot` test: `aria-owns` đúng id, viền khi rỗng, nháy khi bị từ chối
- [x] `BoardLayer` + test: map placements ra `CardView`, nâng `z` cho lá đổi chồng rồi trả về
- [x] `GameBoard` bày hai lớp; `sourceAt` và các handler đọc từ `placements` thay vì từ `cardsOf` + index của pile
- [x] `yarn typecheck` + `yarn test` xanh, `yarn dev` chơi được bằng chạm và kéo

## Giai đoạn 2 · Một chạm, hai chạm

- [x] `GameBoard`: một chạm → `findFoundationTarget`, không được thì chọn như cũ
- [x] `useSelection`: mốc chặn 300ms sau một nước đi sinh từ một chạm + test cả hai phía mốc
- [x] `strings.ts` — đã kiểm, không cần chuỗi mới: `Enter` vẫn mang đúng nghĩa cũ

## Giai đoạn 3 · Mười hiệu ứng

- [x] (1)(2) Lá trượt + dãy bay so le
- [x] (5) Lật lá `--dur-flip`
- [x] (7) Nâng lá đang cầm
- [x] (9) Waste quét về stock — kiểm là miễn phí, không thêm code
- [x] (4) Từ chối: lá nguồn lắc — xem ghi chú cuối §5 của `design.md` về chỗ đổi so với dự định
- [x] (8) Foundation nảy khi nhận lá, dùng lại phép so `placements`
- [x] (6) Chia bài đầu ván, so le theo `dealOrder`
- [x] (10) Bốn foundation sáng lần lượt rồi mới mount `WinOverlay`
- [x] (3) Kiểm chuỗi Hoàn tất đã đọc thành một dòng liên tục, chỉnh `AUTO_STEP_MS` nếu cần
- [x] Reduced-motion: chia bài và màn thắng tự tắt; test cả hai

## Giai đoạn 4 · E2E và xác minh

- [x] `helpers.ts` + 3 spec: selector sang `[data-card][data-card-pile="…"]`, thêm `data-index` vì thứ tự DOM không còn là thứ tự xếp lớp
- [x] `win.spec.ts` phát lại bằng **kéo thả** — bắt buộc vì một chạm làm lệch kịch bản; trả nốt món nợ E2E kéo thả trong `backlog.md`
- [x] E2E mới: một chạm đưa Át lên foundation; một chạm lên lá không có chỗ thì chỉ chọn; hai chạm sang tableau; cú chạm ngay sau một nước đi-bằng-một-chạm không sinh nước thứ hai
- [x] `motion.spec.ts` mới, và cả bộ E2E chạy ở chế độ tắt hiệu ứng qua `e2e/fixtures.ts`
- [x] `yarn typecheck` · `yarn lint` · `yarn test` · `yarn build` · `yarn check:bundle` · `yarn test:e2e` xanh
- [x] Xem app thật ở 320/375/768/1440, có ảnh chụp

## Giai đoạn 5 · Tài liệu và merge

- [x] `scope.md`: FR-05 đổi câu chữ, thêm FR-14
- [x] `journeys.md`: US-03 đổi bước đầu sang một chạm
- [x] `invariants.md`: bất biến 11 (thứ tự DOM cố định), 12 (`layout.ts` thuần, toạ độ `calc()`) và 13 (lá đang bay thôi nhận thao tác)
- [x] ADR-0009 cho tầng lá phẳng
- [x] `README.md` §Features một dòng cho một chạm
- [x] `backlog.md`: xoá món nợ E2E kéo thả, cập nhật §Đang làm
- [x] PR, CI xanh, merge
