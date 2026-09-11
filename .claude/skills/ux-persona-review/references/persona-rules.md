# Rule tạo persona — Duck Solitaire

> Bản này **thay thế** bản seed offline. Fetch ngày **2026-09-12**.
> Dàn persona ở `personas/` sinh ra từ đúng các rule dưới đây. Sửa rule mà không sinh lại
> dàn là làm hai file nói hai chuyện khác nhau.

## Nhật ký fetch — đọc trước khi tin bất cứ dòng nào bên dưới

| Nguồn | Kết quả |
| --- | --- |
| NN/g — ba loại persona (proto / qualitative / statistical) | ✅ lấy được |
| GDS/alphagov — bộ 7 persona tiếp cận | ✅ lấy được |
| JTBD — dạng câu job story, ba chiều functional/emotional/social | ✅ lấy được (tổng hợp nhiều nguồn) |
| Cooper — phân loại persona theo goal-directed design | ✅ lấy được (qua tóm tắt thứ cấp, **không** đọc trực tiếp *About Face* / *The Inmates Are Running the Asylum*) |
| Travis / Userfocus — bài gốc về Red Routes | ⚠️ **403 Forbidden**. Dùng tóm tắt thứ cấp thay thế |
| Nghiên cứu domain — người chơi Solitaire | ✅ lấy được, **chất lượng số liệu kém** — xem §6 |

---

## 1. Dàn này là proto-persona. Nói thẳng ra thế.

Theo phân loại của NN/g, persona chia ba mức theo bằng chứng:

| Loại | Bằng chứng | Khi nào dùng |
| --- | --- | --- |
| **proto** | giả định của đội, không có nghiên cứu mới | đội rất gọn, không thì sẽ bỏ luôn persona |
| qualitative | phỏng vấn 5–30 người, rút mẫu chung | hợp với đa số đội |
| statistical | khảo sát 100–500+ người rồi phân cụm | tổ chức lớn, có người làm thống kê |

**Dàn của project này là proto.** Chưa có ai phỏng vấn một người chơi Duck Solitaire nào.
NN/g cảnh báo đúng chỗ đau: proto-persona *"thường là hình dung sai về người dùng thật và
có thể trở thành buồng vọng âm cho chính những giả định sai của đội"*.

Hệ quả bắt buộc, không được quên khi đọc báo cáo:

- Một phát hiện là **"persona này vấp ở đây"**, không phải **"người dùng thật vấp ở đây"**.
- Persona không quyết được **ưu tiên**. Nó chỉ ra chỗ nên đi nhìn. Việc xếp mức nghiêm
  trọng dựa vào `red-routes.md` và `nfr.md` — hai thứ đó có bằng chứng thật.
- Đừng dùng dàn này thay cho việc để một người thật ngồi chơi.

## 2. Phân loại Cooper — bốn loại project này dùng

Cooper định ra sáu loại; ở đây chỉ bốn loại có nghĩa (không có ai *mua* sản phẩm này nên
customer persona không tồn tại):

| Loại | Nghĩa | Trong dàn |
| --- | --- | --- |
| **primary** | người sản phẩm được thiết kế cho. Không thể phục vụ họ bằng giao diện thiết kế cho người khác | p01, p02 |
| **secondary** | dùng được, nhưng cần thêm vài thứ | p03, p04, p05 |
| **served** | chịu ảnh hưởng nhưng không trực tiếp dùng | không có — sản phẩm một người chơi, không sinh ra tác động lên ai khác |
| **negative** | người sản phẩm **không** nhắm tới. Có mặt để phát hiện đang phục vụ nhầm ai | p06, **đúng một người** |

## 3. Bám hành vi, không bám nhân khẩu học

Tuổi và nghề chỉ có ích khi chúng **đổi cách người đó dùng sản phẩm**.

- ❌ "Nữ, 28 tuổi, thích du lịch" — không suy ra được hành vi nào.
- ✅ "Chơi bằng ngón cái tay phải trong lúc tay trái cầm móc treo trên xe buýt" — suy ra
  được ngay là vùng chạm nào tới được và vùng nào không.

Với project này, một ràng buộc đến từ chính `overview.md` §3: **người chơi đã biết luật
Klondike**. Nghĩa là mọi lúng túng quan sát được **không bao giờ là lúng túng về luật** —
nó luôn là lúng túng về *điều khiển*. Persona nào viết "không hiểu Át đặt ở đâu" là persona
viết sai; cái đúng phải là "biết lá này phải lên chồng kia, không biết bảo máy làm thế nào".

## 4. Trường bắt buộc của một persona

| Trường | Vì sao bắt buộc |
| --- | --- |
| bối cảnh, nghề nghiệp | để lời kể của persona nghe như người thật |
| trình độ số | quyết mức chịu đựng với thuật ngữ và với giao diện lạ |
| thiết bị + điều kiện mạng | đổi **thẳng** thành viewport và network throttle của phiên |
| nhu cầu tiếp cận | dàn **bắt buộc** có ít nhất một người chỉ dùng bàn phím hoặc thị lực kém |
| động cơ, nỗi sợ | định hướng persona chú ý tới cái gì |
| `patience_threshold` | 2–6 bước bế tắc liên tiếp thì bỏ cuộc — điều kiện dừng thật của phiên |
| ngôn ngữ | UI chỉ có tiếng Việt (`NFR-I18N-03` đã bỏ đa ngôn ngữ), nên mọi persona nói tiếng Việt |

## 5. Jobs-To-Be-Done → `goal_in_user_words`

Dạng câu: **"Khi ___, tôi muốn ___, để ___."** Bỏ "Với tư cách là một ___" của user story
đi và thay bằng "Khi ___" — chỗ đó đổi trọng tâm từ *người đó là ai* sang *hoàn cảnh họ
đang ở*, và hoàn cảnh mới là thứ dự đoán được hành vi.

Ba chiều của một "job", cả ba đều có mặt ở sản phẩm này:

| Chiều | Ở Duck Solitaire là gì |
| --- | --- |
| **functional** | thắng ván, hoặc ít nhất đi được nước tiếp theo |
| **emotional** | giết mười phút mà đầu óc nhẹ đi, không bị quảng cáo giật mình, không bị đòi tài khoản |
| **social** | gần như không có — đây là trò một mình. Chỗ duy nhất chiều xã hội ló ra là gửi số hiệu ván cho người khác (RR-07) |

Câu JTBD chính là nguyên liệu sinh `goal_in_user_words`: **diễn đạt bằng từ của người
dùng, cố ý tránh từ của sản phẩm.** "tôi muốn bày lại đúng cái ván lúc nãy" chứ không phải
"dùng tính năng seed".

## 6. Nghiên cứu domain — người chơi Solitaire

⚠️ **Cảnh báo chất lượng.** Mảng này gần như không có nghiên cứu học thuật về *hành vi*.
Phần lớn con số lưu hành là do chính các app Solitaire công bố, không có phương pháp kèm
theo. Dùng chúng để **định hình persona**, tuyệt đối không trích vào báo cáo như bằng chứng.

**Số liệu cứng, có nguồn thật:**

- Tỉ lệ ván Klondike **giải được** khi chơi tối ưu: **81.945% ± 0.084%** (Blake & Gent,
  *JAIR* Vol. 85, 2026). Con số này **khớp** với `overview.md` §4 ("khoảng 20% ván là vô
  nghiệm") — nghĩa là Non-Goal đó đứng vững, không phải câu nói cho qua.

**Số liệu mềm, nguồn là ước lượng ngành — chỉ dùng để hình dung:**

- Tỉ lệ thắng thực tế của người chơi thường: **rút 1 ≈ 30–35%**, **rút 3 ≈ 10–15%**.
  → Đây là lý do RR-08 quan trọng hơn vẻ ngoài của nó: đổi sang rút 3 là **giảm tỉ lệ
  thắng đi khoảng ba lần**. Người chơi chọn nó là chọn có chủ đích, và họ sẽ rất khó chịu
  nếu lựa chọn đó làm mất ván đang chơi mà không báo trước.
- Một phiên Solitaire dài **≈ 10–15 phút**, trong khi phiên game mobile trung bình chỉ
  **≈ 4–5 phút**. → `patience_threshold` của dàn này được đặt **cao hơn** mức thường: người
  chơi Solitaire đến để ngồi lâu, không phải để lướt qua. Nhưng sự kiên nhẫn đó dành cho
  *ván bài*, không dành cho *giao diện* — bế tắc ở một nút bấm vẫn làm họ bỏ đi rất nhanh.
- Khán giả **lệch về phía lớn tuổi**; nhóm 65+ chiếm tỉ trọng cao bất thường trong game
  bài casual. → Persona lớn tuổi trong dàn này **không phải một suất tượng trưng cho đủ
  lệ**; đó là một phần lớn của người dùng thật. Nó cũng là lý do `NFR-A11Y-01` (tương phản)
  và `NFR-A11Y-03` (vùng chạm 44px) là ngưỡng trung tâm chứ không phải ngưỡng phụ.
- Động cơ áp đảo là **thư giãn và lấp chỗ trống**, không phải thử thách hay thi đấu.
  → Củng cố đúng các Non-Goal ở `overview.md` §4 (không điểm, không đồng hồ, không bảng
  xếp hạng), và cho negative persona một hình hài rõ ràng: người đi tìm chuỗi ngày, thành
  tích và bảng xếp hạng.

## 7. Bộ persona tiếp cận của GDS — lấy gì từ đó

GDS (alphagov) dựng 7 persona tiếp cận: **Claudia** (thị lực kém, dùng kính lúp màn hình),
**Ashleigh** (khiếm thị nặng, screen reader), **Ron** (nhiều tình trạng do tuổi tác),
**Chris** (viêm khớp dạng thấp, khó điều khiển vận động), **Pawel** (phổ tự kỷ),
**Simone** (khó đọc), **Saleem** (điếc sâu).

Áp vào sản phẩm này:

- **Claudia + Ron** là hai archetype sát nhất, vì họ trùng với nhóm người dùng thật đã nói
  ở §6. p03 dựng theo Claudia, p02 dựng theo Ron.
- **Chris** (khó điều khiển vận động) đi thẳng vào `NFR-A11Y-03` — lá bài 40px ở màn 320px
  mà `backlog.md` đang để ngỏ chính là chỗ persona kiểu này vấp. Nét này gộp vào p02.
- **Saleem** (điếc) **không áp dụng** — sản phẩm không có âm thanh (Non-Goal), nên không
  có thông tin nào truyền bằng tiếng để mà mất.
- **Simone** (khó đọc) áp dụng yếu — toàn bộ chữ trong app đếm được trên đầu ngón tay.

Và giữ nguyên cảnh báo của chính GDS: **đây không phải thứ thay thế cho việc mời người
khuyết tật thật vào test.** Mô phỏng chỉ cho ra *mức khó xấp xỉ*, không cho ra trải nghiệm thật.

## 8. Kích thước dàn và tính bất biến

5–7 người, **cố định giữa các lần chạy**. Đẻ persona mới mỗi lần chạy là tự tay phá thứ
đắt nhất skill này tạo ra: khả năng so sánh trước và sau khi sửa.

Bắt buộc trong dàn: ít nhất một persona tiếp cận, **đúng một** negative persona, ít nhất
một người dùng điện thoại trên mạng chậm.

Dàn hiện tại: **6 người**, xem `personas/`.

## Nguồn

- [Three Persona Types — NN/g](https://www.nngroup.com/articles/persona-types/)
- [Accessibility Personas — GDS / alphagov](https://alphagov.github.io/accessibility-personas/)
- [Personas vs. Jobs-to-Be-Done — NN/g](https://www.nngroup.com/articles/personas-jobs-be-done/)
- [Job Story (JTBD) — Learning Loop](https://learningloop.io/glossary/job-stories-jtbd)
- [Alan Cooper and the Goal Directed Design Process — Dubberly](https://www.dubberly.com/articles/alan-cooper-and-the-goal-directed-design-process.html)
- [Red Route Usability — The Decision Lab](https://thedecisionlab.com/reference-guide/design/red-route-usability)
- [How red routes can help you take charge of your product backlog — Userfocus](https://www.userfocus.co.uk/articles/prioritising-functions.html) *(bài gốc `redroutes.html` trả 403)*
- [Solitaire Statistics — Card & Puzzle](https://cardandpuzzle.com/blog/solitaire-statistics/) *(tổng hợp; số liệu ngành là ước lượng, chính bài thừa nhận)*
