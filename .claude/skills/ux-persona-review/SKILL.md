---
name: ux-persona-review
description: Use when you want to know how a real stranger experiences Duck Solitaire — dispatches blind persona subagents that actually drive the running app in a browser, captures their first five seconds and their gut reaction, then returns UX/UI findings mapped to ISO 9241-11, LATCH, trigger words, interaction design, visual hierarchy, form design, visual craft and trust/desirability, every finding backed by a quote or a screenshot from a session log. Trigger on "chay persona", "test UX", "nguoi dung that thay sao", "UI co dep khong", "an tuong dau", "UX review", "red route", or before opening a PR that changes user-facing behaviour.
---

# Duck Solitaire — UX persona review

## Sản phẩm này

- Thư mục: `D:/Learn/web-app-ecosystem/web-game/web-game-solitaire`
- Port: **3000** (dev server) · 4183 (bản export tĩnh mà E2E dùng)
- Bật app: `yarn dev` → http://localhost:3000/
  Muốn test đúng thứ GitHub Pages phục vụ thì `yarn build` rồi `node scripts/serve.mjs 4183 out`.
- Dấu hiệu nhận biết đúng app:
  - tab có tiêu đề **`Duck Solitaire`**, `<html lang="vi">`
  - nền bàn xanh lá đậm (`#0b3d2e`), **7 cột bài** dưới **4 chồng đích** và một chồng rút
  - thanh nút tiếng Việt: **Ván mới · Chơi lại · Hoàn lại · Hoàn tất · Chế độ rút**
  - một dòng **`Ván số <số>`** trên màn hình
  - không có ô đăng nhập, không quảng cáo, không banner cookie
  ⚠️ **`:3000` đụng với client của Ducker ID.** Thấy màn đăng nhập hay admin console ở
  `:3000` là đang vào nhầm app — dừng lại, đừng cho persona chạy.
- Email dùng-một-lần cho persona: **không cần** — app không có đăng ký và không có ô nhập
  email nào. Persona nào đòi email là dấu hiệu persona đó viết sai cho sản phẩm này.
- Tài khoản thử: **không có, và sẽ không bao giờ có.** Không đăng nhập là Non-Goal số một
  (`docs/01-product/overview.md` §4). Mọi Red Route đều mở được bằng URL trần.

## Chạy

Toàn bộ quy trình nằm ở `lib/orchestration.md`. Đọc nó trước, rồi làm theo.

Dữ liệu riêng của sản phẩm này:

| Cần gì | Ở đâu |
| --- | --- |
| Red Route đã chốt | `references/red-routes.md` |
| Dàn persona | `references/personas/` |
| Rule đã dùng để sinh persona | `references/persona-rules.md` |
| Khung đánh giá, luật xếp hạng | `lib/frameworks.md` |
| Thứ tự công cụ trình duyệt | `lib/browser-capability.md` |

## Khác biệt của project này so với mặc định trong `lib/`

`lib/` viết cho các app gen-1 của workspace. Ba chỗ phải đọc lại cho đúng ở đây:

1. **Token thiết kế không nằm ở `.claude/uiux/`.** Bước 5 của `lib/orchestration.md` bảo
   tìm thư mục đó — ở project này nó không tồn tại. Truyền cho `ux-expert` đường dẫn
   `docs/design-system/solitaire/MASTER.md` thay thế. Token ở đó **thắng** cảm nhận thẩm
   mỹ chung, đúng như luật gốc.
2. **Ngưỡng đo đã có sẵn, đừng bịa ngưỡng mới.** `docs/02-requirements/nfr.md` giữ mọi
   ngưỡng có thật: `NFR-A11Y-01…05` (tương phản, bàn phím, vùng chạm 44px, nhãn đọc được,
   `prefers-reduced-motion`), `NFR-PERF-02` (một nước đi < 100ms), `NFR-REL-03` (không
   trạng thái kẹt). Phát hiện nào chạm một ngưỡng trong đó thì **trích ID**, đừng viết lại
   con số.
3. **Báo cáo dùng layout tài liệu hai tầng của project.** Ngoài feature:
   `docs/ux-reviews/YYYY-MM-DD-<scope>.md`. Trong feature: `docs/specs/<feature>/`.
   Không tạo `docs/ui-designs/` — `.claude/CLAUDE.md` nói rõ project này không lưu mockup
   trong repo.

## Hai agent

`ux-persona` (Sonnet, chỉ có trình duyệt) đóng vai người dùng.
`ux-expert` (Opus, chỉ có Read) dịch log sang khung đánh giá.

Cả hai định nghĩa ở `D:/Learn/web-app-ecosystem/web-game/web-game-solitaire/.claude/agents/`.
Nếu Claude Code báo không tìm thấy agent type, phiên hiện tại được mở trước khi hai file đó
tồn tại — khởi động lại phiên.

## Bảo trì

Nâng cấp phần logic: `bash D:/Learn/web-app-ecosystem/.claude/skills/ux-persona-lab/scripts/install.sh D:/Learn/web-app-ecosystem/web-game/web-game-solitaire --update`
Lấy lại rule persona mới: cùng lệnh với `--refresh-rules`.
Cả hai đều **không** đụng tới `red-routes.md` và `personas/`.
