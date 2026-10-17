# PRIVACY — Quyết định

Đi cặp với `docs/requirements/privacy.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/nfr.md` (NFR-DATA-01, NFR-REL-04), `docs/03-design/invariants.md` (#10),
  `docs/decisions/0005-khong-luu-van-dang-choi.md`, `docs/01-product/overview.md` (Non-Goals, trần chi phí 0 đồng),
  câu cam kết trên trang "Không tài khoản · không quảng cáo · không lưu gì".
- **Code:** `client/src/lib/auth/nfrData.test.ts` (giới hạn `fetch` / `sessionStorage` trong hai file auth),
  `client/src/hooks/useGame.ts` (không đọc / ghi storage), `client/next.config.ts` (xuất tĩnh).
- **Test đã gom (gợi ý):** `src/tests/e2e/deal/deal.e2e.ts` (từ `smoke.spec.ts`) — hai case "console stays clean" và
  "nothing is stored and nothing is fetched" viết lại ở đây; flag-off của đăng nhập ở `ducker-id/flag-off.e2e.ts`.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** "Một ván chơi đầy đủ" (NFR-REL-04) kiểm bằng một lượt chơi chạm tới mọi điều khiển (`playARound`), không phải một
  ván tới thắng: ván thắng dài một phút và đã có ở `win`/`keyboard`; lỗi console đến từ code chạy theo thao tác, và lượt
  này chạm tới mọi thao tác.
- **Q2** "Không request ra ngoài" lúc tải so theo origin của chính trang (dev: `127.0.0.1:4183`; prd: GitHub Pages), nên
  chạy được trên cả hai môi trường.
- **Q3** "Mất mạng vẫn chơi" (không có trong NFR bằng chữ) là hệ quả trực tiếp của NFR-DATA-01 + xuất tĩnh: ghi thành yêu
  cầu vì người chơi trên xe buýt (persona p01) gặp đúng chuyện đó.

## Tài khoản test

Không có.

## Ngoài phạm vi

- Ngoại lệ đăng nhập Ducker ID (module `ducker-id`).

## Tech debt liên quan

_(không có)_
