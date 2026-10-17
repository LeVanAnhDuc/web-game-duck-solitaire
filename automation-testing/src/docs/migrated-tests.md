# Test đã gom về lúc scaffold

Bộ e2e Playwright cũ của app (`client/e2e/`, chạy bằng `client/playwright.config.ts` → `pnpm test:e2e`) được `git mv`
về đây khi dựng `automation-testing/`. Config cũ gộp vào `playwright.config.ts`: webServer build + phục vụ bản xuất tĩnh
ở :4183, bản bật cờ Ducker ID ở :4185 (project `app-auth`). Bốn project viewport cũ (320 / 375 / 768 / 1440) không giữ
làm project: logic chạy một lần, các khẳng định phụ thuộc bề rộng gom về module `responsive`, mỗi bề rộng một test.

| Từ | Về | Trạng thái |
|---|---|---|
| `client/e2e/helpers.ts` | `src/pages/game.page.ts` | chưa chuẩn hóa |
| `client/e2e/fixtures.ts` | `src/fixtures/motion.fixture.ts` (gộp vào `mergeTests`) | đã chuẩn hóa |
| `client/e2e/fixtures/winnable.json` | `src/data/files/winnable.json` | đã chuẩn hóa |
| `client/e2e/smoke.spec.ts` | `src/tests/e2e/deal/deal.e2e.ts` | chưa chuẩn hóa |
| `client/e2e/play.spec.ts` | `src/tests/e2e/moves/tap-and-drag.e2e.ts` | chưa chuẩn hóa |
| `client/e2e/win.spec.ts` | `src/tests/e2e/win/replay.e2e.ts` | chưa chuẩn hóa |
| `client/e2e/motion.spec.ts` | `src/tests/e2e/motion/animation.e2e.ts` | chưa chuẩn hóa |
| `client/e2e/layout.spec.ts` | `src/tests/e2e/responsive/layout.e2e.ts` | chưa chuẩn hóa |
| `client/e2e/ux-feedback.spec.ts` | `src/tests/e2e/accessibility/feedback.e2e.ts` | chưa chuẩn hóa |
| `client/e2e/ducker-id-sign-in.spec.ts` | `src/tests/e2e/ducker-id/sign-in.e2e.ts` (cờ bật, project `app-auth`) + `ducker-id/flag-off.e2e.ts` (cờ tắt) | chưa chuẩn hóa |
| `client/playwright.config.ts` (4 viewport, 2 webServer) | `playwright.config.ts` | gộp |

Sửa tối thiểu lúc dời: import `test`/`expect` từ `@/fixtures`, helper từ `@/pages/game.page`, điều hướng `./?van=` thay
`/?van=` (base path của GitHub Pages). `win.spec.ts` từng import engine của app (`@/game/deal`, `applyMove`) làm mốc so
sánh — gói này không import code app, nên mốc được đổi thành mô hình hộp đen: mỗi nước trong `winnable.json` nói đúng
chồng nào đổi bao nhiêu lá.

Chạy lần đầu sau khi dời (2026-10-18, Windows, CLIENT_PREBUILT=1): 53/54 xanh. Đỏ: "changing draw mode asks first › it
redeals only after the player agrees" (hết 30 giây) — để `/write-tests draw-mode` xử lý.

Unit + component test (vitest, `client/src/**/*.test.ts(x)`) ở lại `client/`: chúng thuộc về code.

## Còn trỏ về nơi cũ

- `docs/specs/*/design.md`, `docs/specs/*/plan.md`, `docs/decisions/00*.md` — tài liệu lịch sử (đã ship), giữ nguyên văn.
- `docs/ux-reviews/` — nhật ký phiên persona cũ.
