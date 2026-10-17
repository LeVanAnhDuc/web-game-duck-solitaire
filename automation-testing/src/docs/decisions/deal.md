# DEAL — Quyết định

Đi cặp với `docs/requirements/deal.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-01, FR-09, FR-13), `docs/01-product/journeys.md` (US-01, US-05),
  `docs/decisions/0001-seed-va-undo-bang-phat-lai.md`, `docs/decisions/0006-mo-mot-van-cu-the-qua-dia-chi.md`,
  `docs/specs/klondike/design.md` §1 (`deal.ts`), `docs/specs/ux-feedback-2026-09/design.md` (F-04, F-05, F-10),
  `README.md` §Features.
- **Code:** `client/src/lib/seedUrl.ts` (đọc/ghi `?van`, `replaceState`), `client/src/hooks/useGame.ts` (`newGame`,
  seed ngẫu nhiên khi thiếu), `client/src/views/Home/index.tsx` (header), `client/src/lib/strings.ts`,
  `client/src/app/layout.tsx` (tiêu đề tab).
- **Test đã gom (gợi ý):** `src/tests/e2e/deal/deal.e2e.ts` (từ `client/e2e/smoke.spec.ts`) — chuẩn hoá tại chỗ; hai case
  của nó thuộc module khác (aria-owns → `accessibility`, console + storage → `privacy`); "a new game changes the deal
  number" từ `play.spec.ts` và F-04/F-05/F-10 từ `ux-feedback.spec.ts` chuyển về đây.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Biên hợp lệ của `?van` lấy theo code (`readSeedFromUrl`: số nguyên 0…0xFFFFFFFF): docs chỉ nói "số hiệu ván"
  mà không nói biên; ADR-0006 nói số hiệu không dùng được thì coi như không có, khớp code. → REQ-DEAL-04.
- **Q2** "Ván mới" thay địa chỉ bằng `replaceState` (code) — ADR-0006: một ván mới không phải nơi nút Back quay về.
  Kiểm bằng `history.length` không tăng. → REQ-DEAL-07.
- **Q3** "Thế bài" so bằng id + chồng + vị trí + mặt của cả 52 lá đọc từ DOM (`data-card`, `data-card-pile`,
  `data-index`, `data-face`), không import bộ chia bài của app.
- **Q4** Ván ngẫu nhiên (thiếu `?van` / `?van` hỏng) không kiểm "khác ván trước" — trùng seed ngẫu nhiên là hợp lệ, chỉ
  hiếm. Chỉ kiểm: không lỗi, địa chỉ mang đúng số đang hiện, mở lại số đó ra đúng ván.

## Tài khoản test

Không có — game không có tài khoản.

## Ngoài phạm vi

- Tính ngẫu nhiên/phân bố của bộ xáo (unit test `client/src/game/rng.test.ts`, `deal.test.ts`).
- Ván không thắng được: Klondike có ván vô nghiệm, app không hứa ván nào cũng thắng.

## Tech debt liên quan

_(không có)_
