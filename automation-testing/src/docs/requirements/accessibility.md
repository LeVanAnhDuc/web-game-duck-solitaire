# ACCESSIBILITY — Nhãn, vùng, thông báo, chỉ báo trạng thái, chuyển động tắt

Truy vết phía app: NFR-A11Y-04 · NFR-A11Y-05 · NFR-A11Y-06 · F-01 / F-02 / F-03 (ux-feedback-2026-09) · invariant #11.
Chơi bằng bàn phím: module `keyboard`. Vùng bấm 44px: module `responsive`.

- **REQ-ACCESSIBILITY-01** Mỗi lá có nhãn đọc được: lá ngửa là tên lá ("Bích Bảy"), lá đầu một dãy nói thêm số lá đi kèm ("…, kèm 1 lá bên dưới"), lá úp là "Lá úp" (không lộ mặt).
- **REQ-ACCESSIBILITY-02** Lá đang cầm được đọc là "…, đang chọn" và mang trạng thái nhấn (`aria-pressed`).
- **REQ-ACCESSIBILITY-03** Mỗi chồng là một vùng có tên ("Chồng rút", "Bài đã rút", "Chồng đích <chất>", "Cột bài <n>"), chồng trống nói "trống"; bàn bài ("Bàn bài Klondike") và thanh điều khiển ("Thanh điều khiển") có tên; trang khai báo tiếng Việt.
- **REQ-ACCESSIBILITY-04** Mỗi chồng nhận đúng các lá của nó qua `aria-owns` (lá nằm trong một tầng phẳng, không phải con DOM của chồng).
- **REQ-ACCESSIBILITY-05** Chồng rút cạn đổi tên thành "Chồng rút đã cạn, chạm để lật lại" và hiện dấu lật lại; chồng đích trống không mang dấu đó.
- **REQ-ACCESSIBILITY-06** Nước bị từ chối được đọc lên qua một vùng thông báo `polite`, kể cả khi chuyển động tắt, và hai lần từ chối liền nhau là hai lần đọc.
- **REQ-ACCESSIBILITY-07** Lá đang cầm có một vòng màu vẽ thật (`--ring-selected`), không chỉ một cái bóng — kênh không phụ thuộc chuyển động.
- **REQ-ACCESSIBILITY-08** `prefers-reduced-motion: reduce` thì không lá nào có transition: chia bài và mỗi nước đi tức thì, lá luôn ở đúng chỗ của nó.
