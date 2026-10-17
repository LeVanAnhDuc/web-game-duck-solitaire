# DEPLOY — Bản xuất tĩnh dưới đường dẫn gốc của GitHub Pages

Truy vết phía app: ADR-0004 (Next.js xuất tĩnh) · `.github/workflows/deploy.yml` (`NEXT_PUBLIC_BASE_PATH=/<repo>`) · `client/next.config.ts` (`basePath`, `assetPrefix`, `trailingSlash`) · FR-13.

- **REQ-DEPLOY-01** Mọi tài nguyên trang tải đều trả lời thành công (không 4xx/5xx, không request hỏng), ở gốc (dev) cũng như dưới `/web-game-duck-solitaire/` (prd).
- **REQ-DEPLOY-02** Mọi request của trang nằm dưới đường dẫn gốc của site, và địa chỉ của một ván là `<gốc>/?van=<số>`.
