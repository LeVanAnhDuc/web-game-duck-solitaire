# DEAL — Chia bài, số hiệu ván, ván mới, trang tự giới thiệu

Truy vết phía app: FR-01 · FR-09 (Ván mới) · FR-13 · US-01 · US-05 · ADR-0001 · ADR-0006 · F-04 / F-05 / F-10 (ux-feedback-2026-09).

- **REQ-DEAL-01** Mở trang là có ngay một ván đã chia (không màn chờ, không nút "Bắt đầu"): 7 cột lần lượt 1…7 lá, chỉ lá cuối mỗi cột ngửa; chồng rút 24 lá úp; bài đã rút và 4 chồng đích trống; đủ 52 lá.
- **REQ-DEAL-02** Cùng `?van=<số>` luôn cho cùng một thế bài — kể cả sau khi tải lại trang.
- **REQ-DEAL-03** Hai số hiệu ván khác nhau cho hai thế bài khác nhau.
- **REQ-DEAL-04** `?van` không dùng được (không phải số, âm, thập phân, lớn hơn 4294967295) thì coi như không có: chia một ván ngẫu nhiên, không lỗi, và địa chỉ được ghi lại bằng số của ván đang chơi. 0 và 4294967295 là số hợp lệ.
- **REQ-DEAL-05** Không có `?van` thì chia ván ngẫu nhiên và ghi số của nó lên địa chỉ; mở lại đúng địa chỉ đó cho lại đúng ván.
- **REQ-DEAL-06** Số hiệu ván hiện trên màn hình dạng "Ván số <n>", khớp `?van` trên địa chỉ, kèm câu giải thích "Cùng số hiệu ván luôn cho cùng thế bài" đọc được ngay (không nằm trong `title` chỉ hiện khi rê chuột).
- **REQ-DEAL-07** "Ván mới" chia một ván khác: số mới trên màn hình và trên địa chỉ, thế bài khác, lịch sử nước đi về 0; địa chỉ được thay tại chỗ (không thêm một mục vào lịch sử trình duyệt).
- **REQ-DEAL-08** Trang tự giới thiệu: tên "Duck Solitaire" ở đầu trang và trên tab, câu cam kết "Không tài khoản · không quảng cáo · không lưu gì", và khai báo biểu tượng tab.
