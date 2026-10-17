# DEPLOY — Quyết định

Đi cặp với `docs/requirements/deploy.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/decisions/0004-next-js-tinh-theo-khuon-cac-game-anh-em.md`, `docs/01-product/overview.md` (trần chi phí
  0 đồng, GitHub Pages), `README.md` (link Play).
- **Code:** `client/next.config.ts`, `.github/workflows/deploy.yml`, `client/scripts/serve.mjs` (phục vụ `out/` như Pages).

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Hai case viết để chạy y nguyên trên dev (gốc `/`) và prd (`https://levananhduc.github.io/web-game-duck-solitaire`),
  nhờ page object đi tới `./…` và `baseURL` kết thúc bằng `/`. Đã chạy cả hai môi trường ngày 2026-10-18 (prd: thêm module
  `deal`, `ducker-id/flag-off` và INFRA-01 — đều xanh), chứng minh luôn cách điều hướng tương đối.
- **Q2** Không kiểm `deploy.yml` (CI tự chứng minh khi deploy chạy) và không kiểm bản bật cờ trên prd (không tồn tại).

## Tài khoản test

Không có.

## Ngoài phạm vi

- Header HTTP / cache của GitHub Pages.

## Tech debt liên quan

_(không có)_
