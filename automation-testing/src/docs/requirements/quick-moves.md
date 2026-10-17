# QUICKMOVES — Một chạm, chạm đúp, nút "Hoàn tất" khi còn lá úp

Truy vết phía app: FR-05 · FR-06 · FR-14 · US-03 · invariant #7 · klondike design §1 (`findAutoTarget`).
Chuỗi tự hoàn tất chạy đến thắng và bị huỷ giữa chừng: module `win` (cần một ván đã lật hết bài).

- **REQ-QUICKMOVES-01** Một chạm vào một lá mà chồng đích nhận được (từ cột hay từ bài đã rút) thì lá đó lên chồng đích đúng chất, không để lại lựa chọn nào.
- **REQ-QUICKMOVES-02** Một chạm vào lá mà không chồng đích nào nhận thì chỉ cầm lá lên — kể cả khi một cột nhận được nó; không có nước đi.
- **REQ-QUICKMOVES-03** Cú chạm thứ hai của một cú chạm đúp, sau khi cú thứ nhất đã đưa lá lên, bị bỏ qua: không có nước thứ hai, không cầm lá nằm dưới.
- **REQ-QUICKMOVES-04** Chạm đúp tìm chỗ rộng hơn: chồng đích trước, rồi cột đang có bài, cuối cùng mới là cột trống (chỉ lá Già).
- **REQ-QUICKMOVES-05** Chạm đúp vào lá không có chỗ đi hợp lệ thì không có gì xảy ra, không ghi nước rỗng vào lịch sử ("Hoàn lại" vẫn tắt), và được báo là bị từ chối.
- **REQ-QUICKMOVES-06** Nút "Hoàn tất" tắt khi trên bàn còn lá úp ở các cột; bấm vào lúc đó không làm gì.
