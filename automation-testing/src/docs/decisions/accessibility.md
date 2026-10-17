# ACCESSIBILITY — Quyết định

Đi cặp với `docs/requirements/accessibility.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/nfr.md` (NFR-A11Y-01…06), `docs/specs/ux-feedback-2026-09/design.md` (F-01 vòng chọn,
  F-02 vùng thông báo, F-03 chồng rút cạn), `docs/specs/board-motion/design.md` (tầng phẳng + `aria-owns`),
  `docs/design-system/solitaire/MASTER.md` (`--ring-selected` #FFD166), `docs/03-design/invariants.md` (#11).
- **Code:** `client/src/views/Home/components/CardView/index.tsx` (`aria-label`, `aria-pressed`, id cho `aria-owns`),
  `client/src/views/Home/components/PileSlot/index.tsx` (`role="group"`, `aria-owns`, "trống", `data-recyclable`),
  `client/src/views/Home/index.tsx` (`labelFor`, vùng `role="status"` remount theo `key`),
  `client/src/app/globals.css` (`.card-selected`, khối `prefers-reduced-motion`), `client/src/lib/strings.ts`.
- **Test đã gom (gợi ý):** `src/tests/e2e/accessibility/screen-reader.e2e.ts` (từ `client/e2e/ux-feedback.spec.ts`, đổi tên)
  — F-01/F-02/F-03 chuẩn hoá ở đây; F-04/F-05/F-10 → `deal`, F-06/F-07 → `keyboard`, F-09 → `draw-mode`. Case aria-owns
  từ `smoke.spec.ts` và "with motion off" từ `motion.spec.ts` cũng về đây.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** "Hai lần đọc" (F-02) kiểm bằng việc phần tử trong vùng thông báo bị thay (phần tử cũ rời DOM) dù chữ giống hệt —
  đó là cơ chế khiến trình đọc màn hình đọc lại; không có trình đọc màn hình thật trong CI.
- **Q2** Vòng chọn kiểm bằng `box-shadow` tính được có màu `rgb(255, 209, 102)`; tỉ lệ tương phản 3:1 (NFR-A11Y-06) và
  4.5:1 của chữ (NFR-A11Y-01) đo tay bằng devtools, ngoài phạm vi tự động.
- **Q3** Lá úp không lộ mặt với công nghệ hỗ trợ: kiểm qua nhãn ("Lá úp"); mặt lá vẽ sẵn trong DOM (để lật bằng một phép
  xoay) nằm trong cây `aria-hidden`, không phải nhãn.

## Tài khoản test

Không có.

## Ngoài phạm vi

- Đo tương phản (Q2); kiểm bằng axe (NFR-A11Y-04 ghi "review + axe") — chưa có axe trong gói này.

## Tech debt liên quan

_(không có)_
