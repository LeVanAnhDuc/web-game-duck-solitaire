# p26-RR-06 · Dũng · RR-06 kéo thả bằng chuột

Điều kiện: 1440×900, playwright. Log thô, chép nguyên văn lời persona.

⚠️ **Kết luận bỏ cuộc của phiên này là nhiễu công cụ — đọc kèm §DC-9.**

---

**1. Ấn tượng 5 giây**
- Đây là trang gì, làm được gì cho tôi? — Solitaire kiểu Klondike, đúng bài cào quen thuộc, có số ván (403977) để chơi lại y hệt nếu muốn.
- Trang này dành cho người như tôi hay ai khác? — Nhìn hợp với dân chơi bài cũ như tôi, không có mấy trò mùi mẫn hoạt hình trẻ con.
- Có tin đủ để nhập email/số điện thoại không? — Không cần, vì trang không hề hỏi. Đỡ phải nghĩ.
- Ba từ tả cảm giác lúc mở: "gọn", "quen tay", "chờ xem có ẩu không".

**2. Chuyện đã xảy ra**

- *Kéo hợp lệ (Át Rô lên ô đích):* Tôi thấy Rô Át nằm cuối một cột, tay tự động tóm kéo lên ô đích trên cùng. **Ăn ngay**, cột bài lật thêm một lá (Bích Sáu) — mượt, đúng phản xạ của tôi.
- *Kéo không hợp lệ (5 Cơ vào Đầm Tép):* Tôi thử nhét bừa 5 Cơ vào Đầm Tép — sai bét. Trong đầu nghĩ "chắc lại dính đây" — nhưng không, **lá tự bay về đúng chỗ cũ, không kẹt**. Được, ít nhất phần này bản này làm không ẩu.
- *Thả vào khoảng trống giữa hai chồng:* Tôi kéo 6 Bích thả đại vào vùng nền xanh trống giữa các cột — **lại tự về chỗ cũ, không đơ, không dính chuột**. Yên tâm hơn chút.
- *Kéo dãy nhiều lá:* Bàn chưa có sẵn dãy nào nên tôi tự tạo: nối 5 Cơ xuống 6 Bích (hợp lệ, ăn luôn, thành dãy 2 lá 6-5), rồi dọn cột 1 trống bằng cách đẩy 8 Cơ lên 9 Tép (cũng ăn). Xong tôi thử tóm cả dãy "6 Bích kèm 5 Cơ" để lôi nguyên cụm sang cột trống — **đúng chỗ tôi ngại nhất: kéo xong bị kẹt.** Cả hai lần bấm-kéo đều không nhấc nổi lá 6 Bích lên, vì cái vùng chạm vô hình của lá 5 Cơ nằm chồng ngay lên nó chặn mất, tay tôi tóm hụt liên tục. Thử lại đúng một lần như thói quen — vẫn y vậy. Bản này làm ẩu chỗ ghép dãy, kéo cụm không được là tôi bỏ, đóng tab.

**3. Con số**
- Số lần kéo thực hiện được: 5.
- Số lần kéo không ăn (nhưng tự về đúng chỗ, không kẹt): 2.
- Số lần bị kẹt thật sự (không tóm được lá để kéo): 2 lần liên tiếp, cùng một thao tác.
- Kết quả: bỏ cuộc sau bước kẹt thứ hai liên tiếp (đúng ngưỡng kiên nhẫn của tôi).

**4. Ba từ sau khi dùng**

"khó chịu", "dở dang", "không tin cột dãy". Không quay lại — vì cái duy nhất tôi cần làm mỗi ván lại chính là cái không dùng được. So với ấn tượng ban đầu ("quen tay") thì tụt hẳn.

**5. Đính kèm thô**

- `p26-RR-06-01-mo-trang.png` — vừa mở trang.
- `p26-RR-06-02-keo-hop-le-at-ro.png` — kéo hợp lệ, ăn ngay.
- `p26-RR-06-03-keo-khong-hop-le.png` — kéo sai, lá tự về.
- `p26-RR-06-04-tha-khoang-trong.png` — thả vào khoảng trống, lá tự về.
- `p26-RR-06-05-noi-day-6-5.png` — đã tạo được dãy 2 lá.
- `p26-RR-06-06-ket-khi-tom-la-day.png` — lần thử đầu tóm dãy, "kẹt".
- `p26-RR-06-07-bo-cuoc.png` — ảnh cuối, bỏ cuộc.

Log console (level=error): `Total messages: 0 (Errors: 0, Warnings: 0)`

---

## Ghi chú của người điều phối

⚠️ **Tình huống 4 và toàn bộ kết luận bỏ cuộc là NHIỄU CÔNG CỤ, không phải lỗi sản phẩm.**

`browser_drag` nhắm vào **tâm hình học** của phần tử. Lá bài cao 134px ở desktop,
`--overlap-up` là 32px, nên lá đã bị lá khác đè chỉ lộ 32px trên cùng và **tâm của nó nằm
dưới lá đè lên**. Công cụ luôn tóm nhầm lá trên.

Người điều phối tái hiện bằng toạ độ thật (ván `?van=66725`, dãy `Rô Năm` + `Tép Bốn`):
bấm vào **dải nhìn thấy được** → chọn được cả dãy (`"Rô Năm, kèm 1 lá bên dưới, đang chọn"`
+ `"Tép Bốn, đang chọn"`); bấm vào **tâm** → chỉ chọn lá trên. **Kéo cả dãy chạy đúng.**
Xem §DC-9.

**Tình huống 1, 2, 3 dùng được và toàn tin tốt** — kéo hợp lệ ăn ngay; kéo sai tự về; thả
vào khoảng trống tự về, không kẹt, không dính con trỏ. Đó đúng ba điều `NFR-REL-03` đòi hỏi.

Phần 4 "ba từ sau khi dùng" **không dùng được** vì cảm nhận bị quyết định bởi sự cố giả.
