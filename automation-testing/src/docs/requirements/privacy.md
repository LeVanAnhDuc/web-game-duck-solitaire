# PRIVACY — Không gửi, không lưu, console sạch, chạy không cần mạng

Truy vết phía app: NFR-DATA-01 · NFR-REL-04 · invariant #10 · ADR-0005 · `docs/01-product/overview.md` (Non-Goals).
Bản cờ tắt (bản deploy); ngoại lệ có biên giới của ADR-0012 (đăng nhập) thuộc module `ducker-id`.

- **REQ-PRIVACY-01** Tải trang không gọi tới bất kỳ origin nào ngoài chính trang (không CDN font, không analytics).
- **REQ-PRIVACY-02** Sau khi tải xong, chơi — rút, lật lại, chạm, kéo, hoàn lại, chơi lại, đổi chế độ, ván mới — không gửi request nào.
- **REQ-PRIVACY-03** Không lưu gì trên máy người chơi: `localStorage`, `sessionStorage` trống, không cookie, sau cả một lượt chơi.
- **REQ-PRIVACY-04** Tải lại trang là quên ván đang chơi: cùng địa chỉ cho lại ván đó từ lúc chia, không nhớ nước nào.
- **REQ-PRIVACY-05** Console không có lỗi hay cảnh báo nào suốt một lượt chơi.
- **REQ-PRIVACY-06** Mất mạng sau khi tải xong vẫn chơi tiếp được, kể cả chia ván mới.
