# Dàn persona — Duck Solitaire

Sáu người, **cố định**. Sinh ngày 2026-09-12 theo `../persona-rules.md`.

Đẻ persona mới mỗi lần chạy là phá thứ đắt nhất skill này tạo ra: khả năng so sánh trước
và sau khi sửa. Muốn đổi dàn thì đổi `persona-rules.md` trước, rồi sinh lại cả sáu, rồi ghi
vào `docs/04-state/backlog.md` là từ mốc nào trở đi hai lần chạy không so được với nhau nữa.

## Dàn

| # | Ai | Loại (Cooper) | Thiết bị · mạng | Nét quyết định hành vi | Kiên nhẫn |
| --- | --- | --- | --- | --- | --- |
| p01 | **Hằng** — trên xe buýt | primary | 375px · **Slow 4G** | một ngón cái, luôn chạm, không bao giờ kéo | 4 |
| p02 | **Ông Tâm** — 68 tuổi | primary | 375px, chữ hệ thống lớn · wifi | viễn thị, tay run, sợ bấm nhầm mất hết | 3 |
| p03 | **Thuỷ** — bàn phím | secondary | 1440px **phóng 200%** · nhanh | không đụng chuột, thị lực kém | 5 |
| p04 | **Dũng** — kéo thả | secondary | 1440px, chuột · nhanh | phản xạ kéo 20 năm, đi tìm đường tắt | **2** |
| p05 | **Mai** — được gửi link | secondary | 375px, trình duyệt trong Zalo · 4G | vào vì một ván cụ thể, quen rút 3 | 4 |
| p06 | **Khoa** — săn thành tích | **negative** | 1440px · nhanh | đi tìm điểm, chuỗi ngày, bảng xếp hạng | 3 |

Điều kiện bắt buộc của dàn, đã thoả:

- ✅ ít nhất một persona tiếp cận — **p03** (bàn phím + thị lực kém), **p02** (tuổi tác + vận động)
- ✅ **đúng một** negative persona — **p06**
- ✅ ít nhất một người dùng điện thoại trên mạng chậm — **p01**

## Phân phiên

10 phiên = 8 Red Route `live` + 2 phiên mù. Trần 4 phiên đồng thời → 3 đợt.

| Phiên | Mã phiên | Ai | Nội dung |
| --- | --- | --- | --- |
| 1 | `p01-RR-01` | Hằng | đi nước đầu tiên bằng chạm |
| 2 | `p02-RR-02` | Ông Tâm | rút bài khi bí nước |
| 3 | `p02-RR-03` | Ông Tâm | sửa một nước đi lỡ tay |
| 4 | `p03-RR-05` | Thuỷ | chơi bằng bàn phím |
| 5 | `p04-RR-04` | Dũng | đường tắt đưa lá lên chồng đích |
| 6 | `p04-RR-06` | Dũng | kéo thả, kể cả kéo hỏng |
| 7 | `p05-RR-07` | Mai | chơi lại đúng ván + gửi ván cho bạn |
| 8 | `p05-RR-08` | Mai | đổi rút 1 ↔ rút 3 |
| 9 | `p02-blind` | Ông Tâm | phiên mù — trình độ số thấp, trên điện thoại |
| 10 | `p06-blind` | Khoa | phiên mù — power user trên desktop |

Đánh số `NN` của mã phiên theo `lib/orchestration.md` khi dispatch; bảng này chỉ chốt
**ai đi route nào**, để hai lần chạy khác ngày vẫn so được với nhau.

## Vì sao ghép như vậy

- **p04 lấy cả RR-04 lẫn RR-06** vì cả hai đều là chuyện phản xạ của người chơi lâu năm,
  và người nóng nhất dàn (`patience_threshold: 2`) là phép thử khắc nghiệt nhất cho hai
  cơ chế nhập liệu chính.
- **p02 lấy cả RR-02 lẫn RR-03** vì tay run dẫn thẳng tới nước đi nhầm, mà nước đi nhầm
  dẫn thẳng tới undo. Hai route đó là một câu chuyện liên tục với người này.
- **p02 kiêm luôn phiên mù số 1** vì `lib/orchestration.md` yêu cầu phiên mù đó là "người
  trình độ số thấp trên điện thoại" — đúng mô tả của p02, không cần dựng thêm người thứ bảy.
- **p06 chỉ chạy phiên mù** và không nhận Red Route nào. Giao việc cho một negative persona
  là hỏng chính mục đích của nó: nó có mặt để xem sản phẩm có níu chân nhầm người không,
  chứ không phải để đo xem sản phẩm phục vụ nó tốt đến đâu.
- **p01 chỉ chạy một phiên**, và đó là phiên đắt nhất trong cả lượt: RR-01 trên Slow 4G
  bằng một ngón cái là điều kiện khắc nghiệt nhất mà nhóm người dùng chính thật sự gặp.
