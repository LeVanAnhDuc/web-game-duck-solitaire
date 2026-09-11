# p24-RR-05 · Thuỷ · RR-05 chơi bằng bàn phím, không đụng chuột

Điều kiện: 720×600 (mô phỏng 1440px phóng 200%), playwright, chỉ dùng `browser_press_key`.
Log thô, chép nguyên văn lời persona.

⚠️ **Phần 1 của log này bị nhiễm `sr-only` — đọc kèm §DC-7.**

---

**1. Ấn tượng 5 giây**

Vừa mở ra, tôi đứng yên nhìn cái đã. Có dòng chữ nhỏ "Ván số 253327" và ngay dưới là một câu hướng dẫn: "Dùng phím mũi tên để di chuyển giữa các chồng bài, phím cách để chọn và thả, Enter để tự tìm chỗ, Escape để bỏ chọn." Bên dưới là cả bàn bài — một hàng bài úp, mấy ô trống, rồi bảy cột bài.

- **Đây là trang gì, làm được gì cho tôi?** Là một ván bài kiểu Klondike. Nó cho tôi chơi bài một mình để giết thời gian.
- **Trang này dành cho người như tôi hay ai khác?** Thấy có ghi sẵn hướng dẫn phím ngay đầu trang — cái này lạ, đa số web game tôi từng vào không ai buồn viết ra vậy. Nên ít nhất người ta có nghĩ tới người dùng bàn phím, dù tôi chưa biết có làm đúng như lời hứa không.
- **Tôi có tin để nhập email/số điện thoại không?** Không có ô nào đòi thông tin cả. Nhưng nếu có, tôi cũng sẽ dè chừng vì chưa biết trang này của ai.
- **Ba từ:** dè dặt, hơi tò mò, chờ xem.

**2. Chuyện đã xảy ra**

**Gõ Tab lần 1** — tôi tưởng con trỏ sẽ nhảy vào một lá bài cụ thể nào đó, kiểu lá trên cùng của chồng rút. Thực tế nó nhảy thẳng vào cả "Cột bài 1" — nghĩa là cái khung bao quanh nguyên cột đầu tiên, không phải một lá bài riêng lẻ. Nếu tôi không hỏi máy, tôi sẽ không biết được là "cả cột" hay "một lá" đang sáng — **nhìn ảnh chụp tôi cũng không dám chắc viền sáng bao quanh đúng cái gì**, chữ với viền nó mảnh quá so với mắt tôi bây giờ.

**Gõ Tab tiếp 5 lần nữa** — mỗi lần tôi nghĩ "chắc giờ nó nhảy qua chồng rút hay cột 2 gì đó". Không — nó nhảy thẳng ra bốn nút ở thanh dưới cùng: Hoàn lại → Chơi lại → Ván mới → Hoàn tất → rồi tới cái hộp chọn "Rút 1 lá / Rút 3 lá". Trong đầu tôi lúc đó: *"ơ, vậy 6 cột bài kia, chồng rút, chồng bỏ, bốn chồng đích... Tab không ghé qua chỗ nào trong đó à?"*

**Gõ Tab thêm 1 lần** — con trỏ biến mất khỏi trang luôn, không còn thấy viền sáng ở đâu cả. Đúng cái cảm giác mà tôi sợ nhất: *"tôi không biết mình đang ở đâu nữa."*

**Gõ Tab lần nữa** — nó quay lại đúng chỗ "Cột bài 1" ban đầu. Vậy là đi hết vòng Tab, **tổng cộng chỉ có 6 điểm dừng trong trang** (1 cột bài + 5 nút/hộp chọn), còn 6 cột bài kia, chồng rút, chồng bỏ và bốn chồng đích thì Tab không bao giờ ghé tới.

**Đổi sang mũi tên.** ArrowRight — từ Cột bài 1 nhảy sang Cột bài 2. ArrowLeft — về lại Cột bài 1. ArrowLeft lần nữa (tưởng sẽ đứng yên vì đã ở đầu) — nó vòng ngược ra tận Cột bài 7. À, hoá ra mũi tên trái/phải chỉ chạy vòng quanh trong 7 cột bài thôi, không tự nhảy lên hàng trên.

ArrowUp từ Cột bài 7 — nhảy lên "Chồng đích Tép". Tôi hiểu ra: hàng trên và hàng dưới là hai "tầng", muốn qua tầng kia phải bấm Lên/Xuống, còn Trái/Phải chỉ đi ngang trong cùng một tầng.

Tôi dò tiếp bằng ArrowLeft trên hàng trên: Chồng đích Tép → Chồng đích Rô → Chồng đích Bích → Bài đã rút → Chồng rút. Ra là cả hàng trên có 6 chỗ — **đúng những chỗ mà Tab bỏ qua hoàn toàn**. Vậy muốn chạm được vào phần lớn bàn bài, tôi bắt buộc phải biết bấm mũi tên sau khi Tab, chứ không thể chỉ dùng Tab như tôi vẫn quen.

**Đứng ở Chồng rút, bấm Space** — tôi tưởng là "chọn" lá bài, hoá ra đây là "bốc bài": một lá từ chồng úp chạy sang chồng bỏ, lật ngửa lên (Cơ Đầm). Vậy **Space không phải lúc nào cũng có nghĩa giống nhau, tuỳ vào đang đứng ở chồng nào** — tôi phải nhớ trong đầu chứ trang không nhắc lại.

**Bấm Enter ngay sau đó, vẫn đứng ở chồng rút** — không có gì xảy ra thêm, không có dấu hiệu gì báo là "không làm được gì" hay "đã xong". Tôi gõ mà không thấy gì đổi, hơi hoang mang.

**ArrowRight sang chồng bỏ, bấm Space** — lần này Space lại có nghĩa khác: nhấc lá Cơ Đầm lên (máy xác nhận là "đang chọn", nhưng **nhìn ảnh chụp tôi không dám chắc là có thấy nó nhô lên hay sáng viền rõ ràng không** — chỗ này tôi thật sự không tự tin bằng mắt).

**Bấm Enter để nhờ máy tự tìm chỗ** — không có chỗ nào hợp lệ cho con Q cơ lúc này, nên nó tự bỏ chọn lại, **im lặng, không có dòng chữ nào báo "không đặt được"**. Nếu tôi không hỏi máy, tôi sẽ chỉ nghĩ *"ơ, sao lá đó tự nhiên hết sáng, chắc tôi bấm nhầm."*

**Tôi đi tìm một lá dễ hơn.** ArrowDown xuống Cột bài 2, ArrowRight sang Cột bài 3 — ở đây có lá Cơ Át đang lộ. Bấm Space chọn nó, bấm Enter — **lần này thành công thật sự**: lá Át bay lên chồng đích, cột bài lật lá úp bên dưới lên thành Rô Tám. Đây là lần đầu tiên tôi tự tay "nhấc một lá bài sang chỗ khác" chỉ bằng bàn phím — làm được! Nhưng **con trỏ của tôi thì không đi theo lá bài** — nó vẫn đứng nguyên ở "Cột bài 3", tức là chỗ lá bài cũ vừa rời đi, không nhảy tới chồng đích nơi lá bài vừa tới. Nếu tôi cứ tưởng con trỏ đi theo bài mà bấm tiếp mũi tên, tôi sẽ thao tác nhầm chỗ.

**Bấm Space chọn tiếp lá Rô Tám, rồi bấm Escape** — lá bài bỏ chọn, không di chuyển, mọi thứ y nguyên. Cái này thì đúng như tôi mong đợi.

**3. Con số**

- Tổng số phím đã gõ: **28 lần** (8 Tab, 3 ArrowRight, 7 ArrowLeft, 1 ArrowUp, 1 ArrowDown, 4 Space, 3 Enter, 1 Escape).
- Số lần Tab để đi hết một vòng: **8 lần** — nhưng chỉ có **6 điểm dừng thật sự trong trang**; 1 trong 8 lần Tab đưa tôi ra khỏi trang hẳn.
- Số lần gõ mà không thấy gì đổi rõ ràng: **1 lần** (Enter ngay sau khi bốc bài ở chồng rút).
- Kết quả: **không bỏ cuộc** — làm xong việc chính, nhưng phải dò mất khá nhiều bước mới hiểu luật chơi phím.

**4. Ba từ sau khi dùng**

**Nhẹ nhõm, vẫn hoang mang, tò mò muốn chơi tiếp.**

So với lúc đầu (dè dặt, tò mò, chờ xem) thì cảm giác đỡ hơn — vì cuối cùng tôi làm được việc mình cần, và trang có thật sự chơi bằng bàn phím được, không phải nói suông. Nhưng cái hoang mang thì tăng lên chứ không giảm: Tab không chạm được tới phần lớn bàn bài, Space đổi nghĩa tuỳ chỗ đứng, và khi bấm hụt thì trang im lặng hoàn toàn. Tôi nghĩ mình sẽ quay lại chơi, vì nó chạy được thật — nhưng chắc phải mất buổi đầu dò dẫm giống hôm nay để nhớ luật đi phím, chứ không thể vào là chơi ngay như tôi mong.

**5. Đính kèm thô**

21 ảnh, `p24-RR-05-01-vua-mo.png` → `p24-RR-05-21-escape-bo-chon.png`. Ảnh đáng chú ý:

- `p24-RR-05-02-tab-lan-1.png` — sau Tab lần 1, con trỏ vào "Cột bài 1".
- `p24-RR-05-04-tab-quay-lai-cot-1.png` — sau khi Tab đi hết vòng (8 lần).
- `p24-RR-05-11-sau-enter.png` — Enter ở chồng rút, không thấy đổi gì.
- `p24-RR-05-15-enter-khong-cho-hop-le.png` — Enter không có chỗ hợp lệ, tự bỏ chọn im lặng.
- `p24-RR-05-19-enter-thanh-cong-len-chong-dich.png` — thành công, nhưng con trỏ ở lại Cột bài 3.

Log console (level=error): `Total messages: 0 (Errors: 0, Warnings: 0)`

---

## Ghi chú của người điều phối

⚠️ **Phần 1 bị nhiễm.** Thuỷ kể đã đọc câu hướng dẫn phím "ngay đầu trang". Câu đó là
`sr-only` — **ẩn khỏi mắt**. Nhân vật này dùng kính lúp màn hình, **không** dùng trình đọc
màn hình, nên trong đời thật cô không có câu đó. Nội dung lọt vào qua `browser_snapshot`
(dựng theo cây a11y). Mọi câu khen "trang có nghĩ tới người dùng bàn phím" phải loại, và
quãng dò dẫm thật lẽ ra còn dài hơn. Xem §DC-7.

**Phần 2 trở đi dùng được bình thường** — số lần Tab, hành vi mũi tên, Space, Enter, Escape,
tiêu điểm không đi theo lá bài, thất bại im lặng: tất cả đều quan sát được trên bàn bài và
trên ảnh, không phải chữ đọc từ snapshot.

Việc "Tab chỉ tới 6 chỗ" là **roving tabindex** — đúng chuẩn ARIA cho widget dạng lưới,
**không phải lỗi**. Xem §DC-4.
