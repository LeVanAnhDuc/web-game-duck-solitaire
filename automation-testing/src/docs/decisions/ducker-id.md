# DUCKERID — Quyết định

Đi cặp với `docs/requirements/ducker-id.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-15), `docs/01-product/journeys.md` (US-06 + "Điều gì có thể sai"),
  `docs/decisions/0012-dang-nhap-ducker-id-tuy-chon.md`, `docs/specs/ducker-id-sign-in/design.md` (chỗ đặt, menu, bàn phím),
  `docs/03-design/invariants.md` (#10), `docs/02-requirements/nfr.md` (NFR-DATA-01, NFR-SEC-04 ngoại lệ), `README.md`.
- **Code:** `client/src/lib/auth/` (`config.ts` cờ + 4 biến, `duckerAuth.ts` PKCE / callback / `settleCallbackUrl` /
  `sessionStorage` chặn thì không đi, `duckerRequests.ts` `AbortSignal.timeout(15s)`, `duckerSession.ts`),
  `client/src/hooks/useDuckerAuth.ts`, `client/src/hooks/useAccountMenu.ts`,
  `client/src/views/Home/components/AccountButton/index.tsx`, `client/scripts/build-e2e-auth.mjs`.
- **Test đã gom (gợi ý):** `src/tests/e2e/ducker-id/sign-in.e2e.ts` (từ `client/e2e/ducker-id-sign-in.spec.ts`) và
  `flag-off.e2e.ts` (case cờ tắt tách ra) — chuẩn hoá tại chỗ; issuer giả tách thành fixture `fakeIssuer`.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Không dùng Ducker ID thật: test chạy trên bản cờ bật với issuer giả `http://ducker.test`, mọi request tới nó do
  fixture `fakeIssuer` trả lời (ADR-0012 chọn cách này cho bộ cũ). Bản cờ bật chỉ có trên dev (project `app-auth`); prd là
  bản deploy, cờ tắt.
- **Q2** US-06 "Ván, thế bài, nước đi không đổi" đọc là: quay về đúng ván (số hiệu, thế bài lúc chia) và cách chơi không
  đổi. Nước đã đi trước khi bấm "Đăng nhập" mất theo lần chuyển trang — hệ quả của ADR-0005/ADR-0012 (không lưu ván), không
  phải bug.
- **Q3** "Issuer treo": token endpoint không bao giờ trả lời; client dùng `AbortSignal.timeout` (đồng hồ thật, `page.clock`
  không giả được) → test chờ thật tới 20 giây.
- **Q4** Nút "Đăng nhập" khớp tên **chính xác**: nhãn lúc đang đi là "Đang đăng nhập…", chứa cùng chữ.
- **Q5** "Mở tab thứ hai giữa chừng", "bấm đúp", "quay lại bằng nút Back" không tự động hoá: cần điều phối hai tab / lịch
  sử quanh một redirect giả; unit test `client/src/lib/auth/duckerAuth.test.ts` phủ cờ `starting` và `pageshow`.

## Tài khoản test

Không có tài khoản thật. Người dùng giả của issuer giả: `DUCKER.user` trong `src/data/test-data.ts`.

## Ngoài phạm vi

- Ảnh đại diện từ issuer (issuer giả không trả `picture`); Q5.
- Đăng nhập với Ducker ID thật ở máy — thử tay theo `client/.env.example`.

## Tech debt liên quan

_(không có)_
