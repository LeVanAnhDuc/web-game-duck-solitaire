# ADR-0012 · Đăng nhập Ducker ID tuỳ chọn, chỉ danh tính, giao ở trạng thái tắt

> **Ngày:** 2026-10-04
> **Trạng thái:** accepted
> **Liên quan:** FR-15 · US-06 · NFR-DATA-01 · NFR-SEC-04 · invariant #10 · ADR-0005

## 1. Bối cảnh

Người dùng yêu cầu (2026-10-04) mọi game trong workspace có "Đăng nhập bằng Ducker ID" tuỳ chọn, cùng cơ chế với `web-app-calculate-badminton`, và sửa NFR cho khớp. Phạm vi chỉ là danh tính: nút, avatar + tên, menu tài khoản. Ván, lưu trữ, cài đặt không đổi. Spec chung: `web-game/docs/superpowers/specs/2026-10-04-ducker-id-sign-in-design.md`; chi tiết repo này ở [`docs/specs/ducker-id-sign-in/design.md`](../specs/ducker-id-sign-in/design.md).

## 2. Quyết định

OIDC Authorization Code + PKCE, client công khai (không secret), trong `src/lib/auth/`. **Giao ở trạng thái tắt:** chỉ bật khi `NEXT_PUBLIC_FEATURE_DUCKER_SIGN_IN` đúng bằng `true` **và** đủ bốn giá trị Ducker; `deploy.yml` không truyền cờ nào, nên GitHub Pages không bao giờ hiện nút. Hồ sơ chỉ nằm trong bộ nhớ: tải lại là chưa đăng nhập. Lỗi xác thực lặng lẽ về chưa đăng nhập. Không thêm dependency.

**Ngoại lệ có biên giới** cho NFR-DATA-01, invariant #10, ADR-0005 và NFR-SEC-04: sessionStorage chỉ với khoá `ducker.pkce`, xoá khi người chơi quay lại; mạng chỉ tới issuer đã cấu hình, và tới URL ảnh đại diện mà issuer trả về, chỉ sau khi người chơi bấm đăng nhập; cờ tắt thì không có gì. Sáu biến `NEXT_PUBLIC_*` (đường dẫn gốc, cờ, issuer, client id, scope, đường dẫn hồ sơ) là biến môi trường duy nhất, đều tuỳ chọn. Đường dẫn gốc thay `GITHUB_PAGES`. Test grep (`src/lib/auth/nfrData.test.ts`) giới hạn `sessionStorage` trong `duckerAuth.ts` và `fetch(` trong `duckerRequests.ts`; kiểm tab Network vẫn trống khi cờ tắt và khi chưa đăng nhập.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Lưu token/hồ sơ vào localStorage để giữ đăng nhập qua tải lại | Phá thẳng NFR-DATA-01; token sống lâu trong kho đọc được bởi mọi script |
| Bật cho mọi người ngay | Chưa đăng ký client ở Ducker ID; người dùng muốn code vào `main` nhưng chưa lộ ra |
| Gắn giá trị mặc định cho issuer/client id trong code | Người dùng cấm; thiếu giá trị thì tắt, không đoán |

## 4. Hệ quả

**Được:** nền cho đăng nhập chung toàn hệ sinh thái; bản deploy không đổi hành vi; thiếu cấu hình thì game vẫn chạy.

**Mất / phải chấp nhận:** trong build bật cờ, ảnh đại diện có thể tải từ host khác issuer (không giới hạn ảnh); NFR-DATA-01 không còn tuyệt đối mà có ngoại lệ; thêm một build thứ hai (`pnpm build:e2e-auth`) cho e2e.

**Nợ `[skip release]`:** commit của tính năng mang `[skip release]`; `release.yml` quét cả khoảng từ tag gần nhất nên mọi push sau cũng bị bỏ qua cho tới khi có tag mới. Lần phát hành thật kế tiếp cắt tay một lần: `pnpm release:next` → `git tag vX.Y.Z && git push origin vX.Y.Z` → `gh release create vX.Y.Z --notes "$(pnpm -s release:notes)"`; sau đó khoảng sạch và tự động chạy lại.

**Điều kiện xem lại:** khi bật cờ trên bản deploy (đăng ký client, thêm biến repo, truyền trong `deploy.yml`), hoặc khi game cần lưu dữ liệu theo tài khoản.
