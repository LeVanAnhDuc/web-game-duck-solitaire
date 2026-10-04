# Đăng nhập Ducker ID — thiết kế riêng cho Duck Solitaire

Spec chung (hành vi, copy, biến môi trường, kiểm thử): `web-game/docs/superpowers/specs/2026-10-04-ducker-id-sign-in-design.md`. Quyết định và ngoại lệ NFR: [ADR-0012](../../decisions/0012-dang-nhap-ducker-id-tuy-chon.md). Chức năng FR-15 · hành trình US-06.

## Chỗ đặt và giao diện

- Đầu trang, bên phải, cạnh nhãn "Ván số N" (`src/views/Home/index.tsx`). Nút icon + chữ giống thanh công cụ (`min-h-[44px]`, `bg-toolbar`, `text-fg`), vành tiêu điểm hai lớp `--ring-focus` + `--ring-focus-edge`. Popover cùng màu thanh công cụ. Chỉ token trong `MASTER.md`, thang 4/8/12/16, font hệ thống, icon lucide, không có transition riêng (chuyển động giảm đã tắt `transition-property`).
- Avatar: ảnh hoặc chữ cái đầu trên nền `--ring-focus`. Menu: tên (hoặc email nếu không có tên), email nếu có, **Mở hồ sơ Ducker ID** (`target=_blank rel="noopener noreferrer"`), **Đăng xuất**. Menu nằm trên mọi lá bài (z-index trên `FLIGHT_Z`). Bàn phím: mũi tên, Home/End, Esc (trả tiêu điểm cho nút), Tab đóng menu; khi menu mở, phím menu bị chặn ở pha capture trên `window` nên không tới `useSelection` (Escape) hay `<main>` (mũi tên, Space, Enter) của bàn bài.
- Khi cờ bật, dòng "Không tài khoản · …" đổi thành "Không tài khoản riêng · …" để không mâu thuẫn với nút; cờ tắt giữ nguyên chữ cũ.
- Chuỗi trong `src/lib/strings.ts` (`account.*`, `taglineWithSignIn`).

## Code

`src/lib/auth/` (types, config, pkce, duckerAuth, duckerRequests, duckerSession, initials) · `src/hooks/useDuckerAuth.ts`, `useAccountMenu.ts` · `src/views/Home/components/AccountButton`. `Home` import `@/lib/auth/duckerSession` đầu tiên để bắt callback trước khi game đọc `?van`. Router Next ghi lại URL cũ (còn `?code&state`) sau hydrate; `settleCallbackUrl` (một lần, trong effect của hook) đặt lại URL sạch kèm `?van`.

## Kiểm thử

Unit: `src/lib/auth/*.test.ts` (cấu hình, PKCE RFC 7636, callback, phiên, request, guard NFR). Component: `AccountButton/index.test.tsx`. e2e: `e2e/ducker-id-sign-in.spec.ts` chạy trên build cờ bật (`pnpm build:e2e-auth`, cổng 4185, issuer giả `http://ducker.test`) và build cờ tắt; smoke NFR-DATA-01 hiện có vẫn chạy trên build cờ tắt.
