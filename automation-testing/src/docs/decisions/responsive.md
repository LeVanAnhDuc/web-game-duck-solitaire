# RESPONSIVE — Quyết định

Đi cặp với `docs/requirements/responsive.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-11), `docs/02-requirements/nfr.md` (NFR-A11Y-03, NFR-REL-03),
  `docs/specs/klondike/design.md` §3 (375 trước, 768 / 1440 nới ra), `docs/design-system/solitaire/MASTER.md` (bề rộng
  lá, vùng chạm 44px bằng padding trong suốt), `docs/04-state/backlog.md` (mục "Cầm bài rồi chạm chồng rút ở 320/375px").
- **Code:** `client/src/app/globals.css` (`--card-w`, `--gap-x`, `--pad-board` theo bề rộng),
  `client/src/views/Home/components/CardView/index.tsx` (`data-hit-area` min 44px),
  `client/src/views/Home/mains/Toolbar/index.tsx` (`min-h-[44px]`).
- **Test đã gom (gợi ý):** `src/tests/e2e/responsive/layout.e2e.ts` (từ `client/e2e/layout.spec.ts`) — bộ cũ chạy mọi spec ở
  4 project viewport; giờ logic chạy một lần, các khẳng định theo bề rộng gom về đây, mỗi bề rộng một test.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Bề rộng kiểm: 320 (hẹp nhất FR-11 hứa), 375 (mốc thiết kế), 768, 1024, 1440 (hai mốc design §3 + một khổ laptop).
- **Q2** "Cầm bài rồi chạm chồng rút ở 320/375px không có gì xảy ra" đã nằm trong backlog như một nợ **chưa sửa**, mức cao,
  vi phạm NFR-REL-03. Với bộ test này nó là bug của tính năng đã ship: BUG-RESPONSIVE-01, `test.fail()` chỉ ở bề rộng
  < 768px (ở 768 / 1024 / 1440 cú chạm bị từ chối đúng). Cơ chế chưa rõ — giữ nguyên nhận định của backlog.
- **Q3** Vùng bấm 44px kiểm trên phần tử `data-hit-area` của từng lá (padding trong suốt, MASTER.md), không trên phần vẽ.

## Tài khoản test

Không có.

## Ngoài phạm vi

- Thang chữ / `--overlap-up` ở dải 320–767px (backlog: việc thiết kế đang mở, chưa thành yêu cầu đo được).

## Tech debt liên quan

- BUG-RESPONSIVE-01 (trùng mục backlog "Cầm bài rồi chạm chồng rút ở 320/375px").
