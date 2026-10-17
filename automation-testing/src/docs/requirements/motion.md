# MOTION — Hiệu ứng chuyển động (khi người chơi không xin tắt)

Truy vết phía app: `docs/specs/board-motion/design.md` §3, §5 (mười hiệu ứng) · NFR-PERF-02 · invariant #8 / #11 / #13 · README §Features ("The board animates").
Chuyển động tắt (`prefers-reduced-motion`): module `accessibility`.

- **REQ-MOTION-01** Đầu ván bài được chia ra so le: mỗi lá chờ theo thứ tự chia, cột sau nhận lá muộn hơn cột trước.
- **REQ-MOTION-02** Độ trễ so le chỉ thuộc về lần chia; mọi nước đi sau khi chia xong không mang độ trễ đó.
- **REQ-MOTION-03** Lá di chuyển bằng `transform` có thời lượng, không bằng `top`/`left` (không làm trình duyệt dàn trang lại mỗi khung hình).
- **REQ-MOTION-04** Lá úp được lật bằng một phép quay trên chính phần tử đó, không bị tráo phần tử.
- **REQ-MOTION-05** Lá đang bay được nâng lên trên mọi chồng và không nhận thao tác cho tới khi đáp.
- **REQ-MOTION-06** Một dãy nhiều lá bay so le theo độ sâu.
- **REQ-MOTION-07** Lá đang cầm được nâng lên (phóng nhẹ).
- **REQ-MOTION-08** Nước bị từ chối: lá nguồn lắc và chồng đích nháy, rồi thôi sau một nhịp.
- **REQ-MOTION-09** Chồng đích nảy lên một nhịp khi nhận một lá.
