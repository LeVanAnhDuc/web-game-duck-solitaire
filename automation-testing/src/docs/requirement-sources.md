# Nguồn requirement của Duck Solitaire

**Requirement của module lấy ở đâu.** `/write-tests` đọc file này ở bước 1 và chỉ đọc các nơi liệt kê dưới đây, cộng với
những gì user nói trong chat. Không dùng Jira/Confluence.

Đường dẫn tính từ thư mục gốc repo test. Danh sách này được user xác nhận lúc scaffold; khi user chỉ thêm nơi khác, hoặc
một nơi bị bỏ/đóng băng, sửa bảng này trong cùng lượt.

## Tài liệu

- `../docs/README.md` — bản đồ tài liệu + quy ước ID (US / FR / NFR / ADR); đọc trước để biết file nào là nguồn đúng
- `../docs/01-product/overview.md` — định vị, Non-Goals (không tài khoản game, không lưu gì, không server)
- `../docs/01-product/journeys.md` — luồng người dùng US-01…US-06, kèm "Điều gì có thể sai" (nguồn chính cho case negative)
- `../docs/01-product/glossary.md` — tên khái niệm ↔ tên trong code ↔ tên trên UI (tableau = Cột bài, stock = Chồng rút…)
- `../docs/02-requirements/scope.md` — danh mục chức năng FR-01…FR-15 và trạng thái
- `../docs/02-requirements/nfr.md` — ngưỡng NFR-PERF / A11Y / REL / DATA áp cho mọi feature
- `../docs/03-design/invariants.md` — điều kiện sai âm thầm (#7 không ghi nước rỗng, #9 auto-complete huỷ được, #10 không lưu gì, #13 lá đang bay thôi nhận thao tác)
- `../docs/decisions/` — ADR-0001…0012: vì sao hành vi như vậy (ADR-0001 seed + undo phát lại, ADR-0005 không lưu ván, ADR-0006 `?van=`, ADR-0012 đăng nhập sau cờ)
- `../docs/specs/<feature>/design.md` — thiết kế đã duyệt của từng feature (klondike, board-motion, ux-feedback-2026-09, ducker-id-sign-in)
- `../docs/design-system/solitaire/MASTER.md` — ngưỡng hiển thị (vùng bấm 44px, màu vòng chọn, tương phản)
- `../README.md` — mục Features + Controls: hợp đồng hành vi hướng tới người chơi

## Code

- `../client/src/lib/strings.ts` — mọi chuỗi UI (tiếng Việt), nguồn của `src/data/copy.ts`
- `../client/src/views/Home/` — màn hình duy nhất: header (tên, số hiệu ván), bàn bài, thanh công cụ, hộp thoại đổi chế độ rút, màn thắng, nút tài khoản
- `../client/src/hooks/` — `useGame` (lịch sử, undo, ván mới), `useSelection` (chạm / kéo / bàn phím), `useBoardMotion`, `useDuckerAuth`
- `../client/src/game/` — luật Klondike thuần (chia bài theo seed, nước đi, auto-target, auto-complete)
- `../client/src/lib/` — `seedUrl.ts` (`?van=`), `layout.ts` (toạ độ lá), `auth/` (Ducker ID OIDC + PKCE sau cờ)
- `../client/src/app/globals.css` — `prefers-reduced-motion`, vòng chọn, bản đồ phím
- `../client/scripts/build-e2e-auth.mjs`, `../client/scripts/serve.mjs`, `../client/scripts/find-winnable.ts` — bản build bật cờ đăng nhập (issuer giả), server tĩnh mà suite này dùng, và công cụ sinh ván thắng được (`src/data/files/winnable.json`)

## Không đọc như nguồn đúng

- `../docs/specs/*/plan.md` — danh sách task lúc build, không phải hành vi
- `../docs/04-state/backlog.md` — việc đang làm / nợ kỹ thuật, không phải hành vi đã ship
- `../docs/code-conventions.md` — quy ước viết code dùng chung, không nói về hành vi
- `../docs/ux-reviews/` — nhật ký phiên persona 2026-09-12 (phát hiện UX lịch sử, đã xử lý ở `ux-feedback-2026-09`)
- `../client/src/**/*.test.ts(x)` — unit/component test của app: gợi ý hành vi, không phải requirement

## Thứ tự thẩm quyền

User (chat) > tài liệu trên > code. Code cho biết app *đang* làm gì, không cho biết *nên* làm gì.
