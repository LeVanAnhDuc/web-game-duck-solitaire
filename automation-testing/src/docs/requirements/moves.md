# MOVES — Nước đi: chạm, kéo thả, chồng rút, luật Klondike

Truy vết phía app: FR-02 · FR-03 · FR-04 · US-01 · US-02 · NFR-REL-03 · invariant #6 / #7 · klondike design §1–§2.

- **REQ-MOVES-01** Chạm một lá ngửa chơi được thì lá đó (cùng các lá nằm trên nó trong cột) được chọn; chạm tiếp một chồng hợp lệ thì bài chuyển sang, lựa chọn được bỏ.
- **REQ-MOVES-02** Nước không hợp lệ không đổi gì trên bàn, không ghi vào lịch sử ("Hoàn lại" vẫn tắt), bỏ lựa chọn, và được báo là bị từ chối ("Nước đi không hợp lệ").
- **REQ-MOVES-03** Đang chọn mà chạm lại chính lá đó thì bỏ chọn; chạm một lá khác trong cùng cột thì đổi lựa chọn sang lá đó (kèm các lá trên nó), không phải một nước đi vào chính cột mình.
- **REQ-MOVES-04** Đang chọn mà chạm vào vùng trống giữa hai chồng thì bỏ lựa chọn, không coi là nước đi.
- **REQ-MOVES-05** `Escape` bỏ lựa chọn.
- **REQ-MOVES-06** Lá úp không bao giờ được chọn hay kéo.
- **REQ-MOVES-07** Lấy lá ngửa cuối cùng khỏi một cột thì lá úp trên cùng của cột đó lật lên.
- **REQ-MOVES-08** Chạm chồng rút thì rút `chế độ rút` lá (1 hoặc 3) sang bài đã rút, ngửa; chồng rút cạn thì chạm là lật lại toàn bộ bài đã rút về chồng rút, đúng thứ tự cũ, không xáo, không giới hạn số lần.
- **REQ-MOVES-09** Ở chế độ rút 3, chỉ lá trên cùng của bài đã rút chơi được.
- **REQ-MOVES-10** Chồng rút và bài đã rút không nhận lá nào: đang cầm một lá mà chạm chồng rút là nước bị từ chối, không phải một lần rút.
- **REQ-MOVES-11** Cột trống chỉ nhận dãy bắt đầu bằng lá Già.
- **REQ-MOVES-12** Chồng đích chỉ nhận đúng chất của nó, bắt đầu từ Át, mỗi lần một lá cao hơn đúng một bậc; lá trên cùng của chồng đích được đưa về cột.
- **REQ-MOVES-13** Cột có bài chỉ nhận lá (hoặc đầu dãy) kém lá trên cùng đúng một bậc và khác màu.
- **REQ-MOVES-14** Một dãy đã xếp đúng trong cột di chuyển cùng nhau khi chọn hoặc kéo lá đầu dãy.
- **REQ-MOVES-15** Kéo thả cho đúng kết quả như chạm cho cùng một nước; thả vào chỗ không hợp lệ thì bài về chỗ cũ, không đổi gì.
- **REQ-MOVES-16** Không kẹt cử chỉ: kéo rồi thả lại chỗ cũ, hay nhả chuột ngoài cửa sổ, thì huỷ kéo, bài về chỗ cũ, không còn lá nào "đang kéo"; rung tay dưới ngưỡng 6px vẫn là một cú chạm; và cú chạm đầu tiên sau một lần kéo vẫn có tác dụng như mọi cú chạm.
- **REQ-MOVES-17** Thả lên vùng chồng lấn giữa hai chồng thì chọn chồng có phần chồng lấn lớn hơn, không chọn theo vị trí con trỏ hay thứ tự DOM.
