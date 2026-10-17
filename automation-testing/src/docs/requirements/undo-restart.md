# UNDORESTART — Hoàn lại, Chơi lại

Truy vết phía app: FR-07 · FR-09 (Chơi lại) · US-04 · US-05 · ADR-0001 · invariant #2 / #4 / #5.
Hoàn lại giữa chuỗi tự hoàn tất: module `win`.

- **REQ-UNDORESTART-01** "Hoàn lại" không giới hạn số lần: lặp lại được tới tận lúc chia, và ở đầu ván thì nút tắt.
- **REQ-UNDORESTART-02** Mỗi lần hoàn lại trả bàn về đúng thế bài trước nước vừa đi.
- **REQ-UNDORESTART-03** Hoàn lại qua một nước đã làm lật một lá thì lá đó úp trở lại.
- **REQ-UNDORESTART-04** Hoàn lại một lần rút 3 lá trả cả ba lá về chồng rút, đúng vị trí và thứ tự cũ.
- **REQ-UNDORESTART-05** Hoàn lại một lần lật lại chồng rút trả bài đã rút về như trước lần lật.
- **REQ-UNDORESTART-06** Bấm "Hoàn lại" khi đang cầm một lá thì bỏ lựa chọn.
- **REQ-UNDORESTART-07** "Chơi lại" chia lại đúng ván đang chơi từ đầu: cùng thế bài lúc chia, cùng số hiệu, giữ chế độ rút, lịch sử về 0, không hỏi lại.
- **REQ-UNDORESTART-08** "Hoàn lại" và "Chơi lại" không đổi số hiệu ván trên màn hình hay trên địa chỉ.
