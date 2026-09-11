# Duck Solitaire — UX persona review · 2026-09-12

> 8 phiên · 5 persona chạy Red Route (+1 negative persona chỉ chạy phiên mù — 6 người nói ấn tượng đầu) · 8 Red Route `live` (RR-09 `excluded`, không tính vào bảng)
> Công cụ trình duyệt: playwright MCP (hạng 1) — **có degrade: mất throttle mạng và mất giả lập cảm ứng**. Mọi cú "chạm" trong lượt này thực chất là click chuột (đường pointer, không phải đường touch); mọi nhận xét về *chờ đợi* của phiên `p21` (Hằng — "mạng 4G chập chờn trên xe buýt") không dùng được. Viewport vẫn đặt được thật, nên toàn bộ phần bố cục 375px là đo thật.
> Red route chốt ngày: 2026-09-12
> Mục tiêu đo: bản deploy `https://levananhduc.github.io/web-game-duck-solitaire/`, đã xác nhận `v1.2.4` == `main` (`git rev-list --count v1.2.4..main` = 0) — xem [ADR-0011](../decisions/0011-ux-persona-review-chay-tren-ban-deploy.md).

Log thô từng phiên: [`2026-09-12-duck-solitaire/log/`](2026-09-12-duck-solitaire/log/) ·
Ảnh của các phát hiện High: [`2026-09-12-duck-solitaire/anh/`](2026-09-12-duck-solitaire/anh/)

Phiên có log: `p21-RR-01` (Hằng) · `p22-RR-02` (ông Tâm) · `p23-RR-03` (ông Tâm) · `p24-RR-05` (Thuỷ) · `p26-RR-06` (Dũng) · `p27-RR-07` (Mai) · `p28-RR-08` (Mai) · `p30-blind` (Khoa).

---

## Ấn tượng đầu

6 người, 8 lần ghi (ông Tâm và Mai mỗi người hai phiên).

| Thước | Kết quả |
| --- | --- |
| Đoán đúng đây là trang gì | **6/6** — cả sáu gọi ngay ra "bài xếp kiểu Klondike / Solitaire" mà không cần thao tác nào. ⚠️ Thước này **bị nhiễu có hệ thống**: hai persona (Thuỷ, Mai) "đọc" được chuỗi `sr-only` mà mắt thật không thấy. Nhiễu không làm đổi kết quả đoán — cả hai nhận ra bàn bài trước khi nhắc tới dòng chữ đó — nhưng mọi câu ấn tượng đầu nhắc tới "trang có sẵn hướng dẫn phím" đã bị loại khỏi báo cáo này |
| Đoán đúng **điểm khác biệt** của sản phẩm (số hiệu ván) | **0/6** ngay ở ấn tượng đầu. Mai là người duy nhất hiểu ra, và chỉ sau khi tự thử. Khoa hiểu ngược hẳn: tưởng là điểm số |
| Dám nhập email | **0/6**. Không ai gặp ô nhập liệu nào (sản phẩm không có), nhưng cả 6 đều tự trả lời câu giả định theo hướng từ chối hoặc dè chừng |
| Lý do người không dám | "chưa biết trang này của ai" (Thuỷ) · "trang không có gì để biết ai đứng sau nó" (Mai) · "trang trông đơn giản quá, không có logo, không rõ ai làm ra" (Mai) · "chả rõ trang này 'sống' bằng gì — không quảng cáo, không gì cả" (Khoa) · "nếu có chắc tôi cũng thoát liền như mấy lần trước" (Hằng) · "nếu lát nữa nó hiện ra đòi, chắc tôi cũng dè chừng" (ông Tâm) |

**Ba từ trước khi dùng:**
Hằng — *trống trải · im ắng · hơi hồi hộp* | ông Tâm (p22) — *quen mắt · yên tâm · chữ bé tí* | ông Tâm (p23) — *quen tay · dè dặt · tò mò* | Thuỷ — *dè dặt · hơi tò mò · chờ xem* | Dũng — *gọn · quen tay · chờ xem có ẩu không* | Mai (p27) — *đơn giản · im ắng · hơi lơ mơ* | Mai (p28) — *gọn gàng · hơi trống trải · chưa chắc chắn* | Khoa — *trống · im lặng · chưa xong*

Từ lặp ở nhiều người:

- **"trống / trống trải"** — 3 người (Hằng, Mai, Khoa).
- **"im ắng / im lặng"** — 3 người (Hằng, Mai, Khoa).
- **"dè dặt / chưa chắc chắn / chờ xem"** — 4 người (ông Tâm, Thuỷ, Dũng, Mai).
- Đối trọng tích cực: **"quen mắt / quen tay"** — 2 người (ông Tâm, Dũng): bàn bài đọc ra ngay là bài thật.

**Ba từ sau khi dùng:**
Hằng — *nhẹ nhõm · mượt · yên tâm* | ông Tâm (p22) — *hồi hộp · hên xui · nhẹ người* | ông Tâm (p23) — *nhẹ người · tin hơn · còn hơi rén* | Thuỷ — *nhẹ nhõm · vẫn hoang mang · tò mò muốn chơi tiếp* | Mai (p27) — *yên tâm hơn · vẫn hơi mò mẫm · ưng ý* | Mai (p28) — *rõ ràng · sòng phẳng · đỡ lo* | Khoa — *trơ · một mình · không đáng quay lại*
Dũng (`p26`) — **không dùng được**: ba từ của anh bị quyết định bởi một sự cố giả (xem §Ghi chú).

**Đổi theo hướng:**

- **Lên** ở 5/7 phiên dùng được. Từ lặp nhiều nhất của vế "sau" là **"nhẹ nhõm / nhẹ người"** — 3 người.
- **Xuống** ở 1 phiên: ông Tâm `p22` tự nói *"đổi theo hướng xấu đi một chút"* — nguyên nhân là đúng một khoảnh khắc: chồng rút cạn (F-03).
- Khoa đi xuống, và **đó là kết quả đúng**: anh là negative persona, đi tìm điểm/streak/thống kê/đăng nhập — năm Non-Goal đã ghi rõ. Anh nhận ra trong 3 bước, chưa đầy nửa phút, rồi bỏ đi. Sản phẩm không níu chân nhầm người.
- **Cái không tan đi:** dư âm bất an còn lại ở 4/7 phiên — "còn hơi rén", "vẫn hoang mang", "vẫn hơi mò mẫm", "hên xui". Cả bốn đều trỏ về cùng một chỗ: **sau khi thao tác, người chơi không chắc chuyện gì vừa xảy ra.**

---

## Bảng điểm theo Red Route

| Red Route | Hiệu quả | Hiệu suất (trung vị / `min_steps`) | Hài lòng |
| --- | --- | --- | --- |
| **RR-01** Đi nước đầu tiên bằng chạm | 1/1 (`p21`) | **1 / 2** — tốt hơn đường tối ưu: lá Át tự bay lên đích chỉ với 1 chạm | Tích cực, có bảo lưu |
| **RR-02** Rút bài khi bí nước | 1/1 (`p22`) | **27 / 2** — 24 lần bốc là bắt buộc để chồng cạn, nên con số này không phản ánh lãng phí. Chi phí thật là quãng **ngần ngừ không dám bấm** | **Đi xuống** — tự xếp là *"xấu đi một chút"* |
| **RR-03** Sửa một nước đi lỡ tay | 1/1 (`p23`) | **1 / 1** | Tích cực |
| **RR-04** Đưa lá lên chồng đích nhanh nhất | **không chạy phiên riêng — suy ra từ `p21` + `p26`** | **1 / 1** ở cả hai đường vào | Tích cực nhưng **khám phá do tình cờ** |
| **RR-05** Chơi bằng bàn phím | 1/1 (`p24`) | **28 / 2** — nước đi thành công tốn đúng 2 phím, phần còn lại là dò đường | **Hỗn hợp** |
| **RR-06** Kéo thả bằng chuột | 1/1 (`p26`) — cả hai vế `done_when` đều đạt | **1 / 1** | **Không đo được** — cảm nhận bị nhiễu công cụ |
| **RR-07** Chơi lại đúng ván + rủ bạn | 1/1 (`p27`) | **6 / 1** — 5 bước dôi ra là **tự kiểm chứng**, không phải lạc đường | Tích cực |
| **RR-08** Đổi sang rút 3 lá | 1/1 (`p28`) | **2 / 2** — đúng bằng đường tối ưu | **Tốt nhất lượt chạy** |

**Ghi chú RR-04.** Không có phiên riêng. Trả lời gián tiếp: Hằng đưa Át Bích lên chồng đích bằng **một cú chạm** — *"chạm thử một cái. Không ngờ nó tự bay thẳng lên ô đích luôn… à, chạm là nó tự biết mình muốn làm gì"*; Dũng đưa Rô Át lên bằng **một cử chỉ kéo**; Mai xác nhận vế "rẻ hơn cách thường". **Nhưng cả ba đều vấp phải nó, không ai đi tìm nó**, và cả ba lần đều là một con Át — trường hợp dễ đoán nhất. Không có dẫn chứng nào cho thấy người chơi tự suy ra cơ chế này áp cho mọi lá.

---

## Phát hiện

### F-01 · High · Interaction Design + Visual hierarchy + Visual craft

**Ở đâu:** RR-01 và RR-05 — trạng thái "lá đang chọn", trên mọi khổ màn hình.

**Chuyện gì xảy ra:** Sau khi chạm chọn một lá, trên màn hình gần như không có gì đổi. Người chơi phải chạm bước tiếp theo mới biết mình có thực sự "cầm" lá đó không. Với người dùng bàn phím thì nặng hơn một bậc: **vành tiêu điểm thì nhìn rõ, còn trạng thái đang-chọn thì không có vành nào cả** — nên "tôi đang đứng ở đây" và "tôi đang cầm lá này" trông y hệt nhau.

**Dẫn chứng:**

- Hằng (`p21-RR-01`) — *"Tôi có zoom lại tấm hình ngay sau khi chạm chọn lá 5 Bích để xem nó có 'sáng lên' hay viền khác gì không — nhìn bằng mắt thường thì **không thấy gì khác cả**, lá bài y hệt lúc chưa chạm. Nếu tay tôi không nhớ mình vừa chạm lá nào… tôi sẽ không biết là mình đang 'cầm' lá nào trong tay."* Ảnh `p21-RR-01-03b-zoom-la-chon.png`.
- Thuỷ (`p24-RR-05`) — *"máy xác nhận là 'đang chọn', nhưng **nhìn ảnh chụp tôi không dám chắc là có thấy nó nhô lên hay sáng viền rõ ràng không**."* Ảnh đối chứng cùng phiên: vành vàng của **tiêu điểm** hiện rất rõ. Trang biết vẽ vành — chỉ trạng thái chọn là không được vẽ.
- Đo độc lập (ảnh `dc-01-la-dang-chon-chi-co-bong-do.png`): thay đổi thị giác duy nhất khi chọn là một **bóng đổ tối** `rgba(0,0,0,0.45)` trên nền bàn tối `#0B3D2E`, cộng `scale(1.04)` — ở 375px lá rộng ~40px nên 4% là **1.6px**. [`MASTER.md`](../design-system/solitaire/MASTER.md) §1 khai vai trò `--ring-selected` `#FFD166` **8.46:1** cho đúng trạng thái này; **biến đó không tồn tại trong `globals.css` và không chỗ nào dùng.**

**Bao nhiêu người vấp:** 2/6 — hai người ở hai đường nhập liệu khác nhau (chạm và bàn phím).

**Hướng xử lý:** Trạng thái đang-chọn cần chỉ báo **sáng hơn nền**, đạt ≥ 3:1 (WCAG 1.4.11) — token đã tồn tại trong `MASTER.md` và chưa bao giờ tới được màn hình. Đồng thời cần phân biệt **chọn** với **tiêu điểm**.

### F-02 · High · Interaction Design + ISO 9241-11

**Ở đâu:** RR-03 và RR-05 — mọi nước đi bị từ chối.

**Chuyện gì xảy ra:** Hai người ở hai đường nhập liệu khác nhau đều **không nhận ra mình vừa bị từ chối**, và cả hai tự nghĩ ra một lời giải thích sai rồi đi tiếp.

**Dẫn chứng:**

- Ông Tâm (`p23-RR-03`) — *"thử bấm lá đó đưa lên một trong bốn ô trống ở hàng trên cùng — **bấm xong chả thấy gì xảy ra cả**… Tôi nghĩ: 'chắc chưa đúng lượt của nó, thôi kệ'."* Ảnh `p23-RR-03-02-sau-4-nuoc.png`.
- Thuỷ (`p24-RR-05`) — *"nó tự bỏ chọn lại, **im lặng, không có dòng chữ nào báo 'không đặt được'**. Nếu tôi không hỏi máy, tôi sẽ chỉ nghĩ 'ơ, sao lá đó tự nhiên hết sáng, chắc tôi bấm nhầm.'"* Ảnh `p24-RR-05-15-enter-khong-cho-hop-le.png`.
- Đo độc lập: chuỗi `strings.a11y.moveRejected` = "Nước đi không hợp lệ" **đã viết sẵn nhưng không bao giờ tới được người dùng**; không có vùng `aria-live`/`role="alert"` nào trong sản phẩm.

**Bao nhiêu người vấp:** 2/6 — và cả hai là persona tiếp cận, đúng nhóm mà phản hồi im lặng gây hại nhất.

**Hướng xử lý:** Nước đi bị từ chối phải để lại dấu vết người chơi **chắc chắn** bắt được, ở cả ba kênh: nhìn (hiệu ứng hiện tại rõ ràng chưa đủ), chữ, và trình đọc màn hình. Câu chữ đã có sẵn, chỉ chưa được nối vào đâu.

### F-03 · High · LATCH + Visual hierarchy + Interaction Design

**Ở đâu:** RR-02 — chồng rút sau khi cạn hết bài.

**Chuyện gì xảy ra:** Khi chồng rút hết bài, ô đó trở thành khung viền rỗng **giống hệt** bốn ô chồng đích bên cạnh. Không icon, không chữ, không mũi tên. Người chơi tưởng mình đã hết bài và thua.

**Dẫn chứng:** Ông Tâm (`p22-RR-02`) —

> *"cái ô góc trên bên trái… bây giờ trống trơn. Không còn hoa văn gì, không chữ, không có cái mũi tên hay hình gì báo cho biết. **Nhìn y hệt như mấy cái ô trống bên cạnh**… 'Ủa, hết bài rồi à? Hay là nó bị lỗi mất bài của tôi rồi?' Tay tôi hơi run, tôi ngần ngừ không dám bấm ngay."*

và kết luận của chính ông:

> *"**Nếu là người khác nhát tay hơn tôi, chắc nhìn cái ô trống ấy rồi bỏ luôn, không dám bấm, vì cứ ngỡ bài đã hết, thua rồi.**"*

Ảnh `p22-RR-02-04-co-bai-up-can.png`, `p22-RR-02-05-bam-thu-o-trong.png`. Cùng chỗ hở này gây ra F-02 ở phiên kế: ông Tâm (`p23`) cũng thử thả một lá vào *"một trong bốn ô trống ở hàng trên cùng"* mà không hiểu bốn ô đó để làm gì.

Câu chỉ dẫn cho đúng tình huống này **đã được viết sẵn** — `strings.pile.stockEmpty` = "Chồng rút đã cạn, chạm để lật lại" — và không bao giờ được hiển thị, kể cả cho trình đọc màn hình.

**Bao nhiêu người vấp:** 1/1 người đi tới trạng thái này. Không nâng bậc theo luật 2-persona, nhưng giữ High vì nó **suýt chặn `done_when` của chính route đó** — vế "người chơi tự tìm ra cách lật vòng lại" chỉ đạt nhờ persona chấp nhận rủi ro.

**Hướng xử lý:** Hàng trên đang trộn ba loại chồng khác hẳn nhau (rút · đã rút · 4 đích) và phân biệt chúng bằng duy nhất khoảng cách. Ô rỗng cần nói được nó là ô rỗng **loại gì** và có bấm được không.

### F-04 · High · Trigger words + LATCH + Visual hierarchy + Trust & desirability

**Ở đâu:** Ấn tượng đầu của mọi phiên, và RR-07 — dòng "Ván số NNNNNN".

**Chuyện gì xảy ra:** Số hiệu ván là **điểm khác biệt duy nhất** của sản phẩm. Nó đang mang cỡ chữ nhỏ nhất trang (13px) và không có một chữ nào giải thích. Ba người đọc nó theo ba kiểu, không kiểu nào đúng: không đọc nổi · không hiểu để làm gì · tưởng là điểm số.

**Dẫn chứng:**

- Khoa (`p30-blind`) — *"Tôi nghĩ ngay: **'689926 — số này chắc là điểm, hoặc số ván tôi đã chơi.'** Tôi bấm vào chữ đó xem có mở bảng thống kê không. **Không có gì xảy ra cả.** Bế tắc 1."* Ảnh `p30-blind-02-bam-van-so.png`.
- Mai (`p27-RR-07`) — ba từ đầu gồm *"**hơi lơ mơ (không hiểu cái số '542141' để làm gì)**"*; và *"**Tôi không thấy chữ nào giải thích điều đó, tự tôi thử rồi rút ra kết luận.**"* Ảnh `p27-RR-07-01-mo-trang.png`, `p27-RR-07-04-choi-lai.png`.
- Ông Tâm — *"**chữ bé tí** (cái dòng số ván trên góc tôi nhìn không ra, bỏ qua luôn)"* (`p22`); *"góc trên bên trái có mấy chữ nhỏ xíu tôi không đọc được"* (`p23`).
- Đo độc lập: lời giải thích *"Cùng số hiệu ván luôn cho cùng thế bài"* nằm trong thuộc tính `title` — **chỉ hiện khi rê chuột**, vô hình với nhóm người dùng chính vốn dùng điện thoại.

**Bao nhiêu người vấp:** 3/6, trải trên 4 phiên, ba thiết bị khác nhau. **0/6 hiểu đúng ngay từ ấn tượng đầu.**

**Điểm sáng đi kèm:** khi Mai *tự* mò ra, cơ chế phía dưới chạy đúng và cô tin nó — cô tự mở lại `?van=542141` để kiểm và kết luận *"đã tự mở thử lại thấy đúng ván nên không sợ bị trêu nữa"*. **Vấn đề không nằm ở cơ chế, nằm ở chỗ nó không tự giới thiệu.**

**Hướng xử lý:** Con số trần trên màn hình game **mặc định bị đọc là thành tích** — hai người độc lập đã chứng minh. Thứ khác biệt duy nhất của sản phẩm cần đặt ở nơi mắt chạm tới trước, kèm một câu nói nó dùng để làm gì, và câu đó không được phụ thuộc vào rê chuột. Mai cũng đi tìm nút chia sẻ và không thấy — đường "rủ bạn chơi cùng ván" hiện chỉ tồn tại qua thanh địa chỉ trình duyệt.

### F-05 · Medium · Trust & desirability + Visual craft + Visual hierarchy

**Ở đâu:** Ấn tượng đầu của toàn bộ 8 phiên — toàn trang.

**Chuyện gì xảy ra:** Trên màn hình không có tên sản phẩm, không logo, không một chữ nào nói đây là cái gì của ai; và bàn bài để lại một mảng nền trống rất lớn. Ba người mô tả bằng cùng một nhóm từ, một trong ba nói thẳng trang trông **chưa xong**.

**Dẫn chứng:** Khoa — *"**trống**, **im lặng**, **chưa xong**"* · Mai (`p28`) — *"**Không thấy tên hãng**… trang trông đơn giản quá, **không có logo, không rõ ai làm ra**"* · Mai (`p27`) — *"**Không thấy logo, không thấy tên công ty**… cứ như một trang tự làm chơi vui"* · Hằng — *"**trống trải**, **im ắng**"* · Thuỷ — *"dè chừng vì **chưa biết trang này của ai**"*.

Quan sát ảnh (cả 8 ảnh `-01-`): ở **mọi** phiên, chuỗi duy nhất trên màn hình ngoài bàn bài và 4 nhãn nút là "Ván số NNNNNN". Ở 1440×900 bàn bài kết thúc ở ~450px và bên dưới là gần **400px nền xanh trống** trước khi tới thanh công cụ; ở 375×720 khoảng trống đó là ~380px. Chuỗi `strings.appTitle` = "Duck Solitaire" **chỉ nằm ở tiêu đề tab**.

**Bao nhiêu người vấp:** 4/6 nói ra thành lời; 3/6 dùng chính từ "trống / trống trải".

**Hướng xử lý:** Hôm nay chưa gây thiệt hại đo được — sản phẩm không hỏi gì nên không có gì để mất (`NFR-DATA-01` chính là thứ giữ cho nó vô hại). Nhưng 0/6 dám nhập email, lý do lặp lại là "không biết ai đứng sau". Việc **"không thu thập gì" đang được giấu đi thay vì được nói ra** — đó là một lợi thế của sản phẩm mà không người dùng nào biết. Khoảng trống giữa bàn bài là chỗ rẻ nhất để nói điều đó.

### F-06 · Medium · Trigger words + Interaction Design

**Ở đâu:** RR-05 — điều hướng bàn phím.

**Chuyện gì xảy ra:** Tab chỉ dừng ở 6 chỗ; 11 chồng bài còn lại chỉ tới được bằng phím mũi tên. Đây là **roving tabindex, đúng chuẩn ARIA — không phải lỗi**. Lỗi là: **hướng dẫn phím duy nhất của sản phẩm được đặt `sr-only`, tức ẩn khỏi mắt.** Người dùng bàn phím vẫn nhìn được màn hình — kính lúp, chuột hỏng, cổ tay đau — không bao giờ đọc được nó.

**Dẫn chứng:** Thuỷ (`p24-RR-05`), phần **không** bị nhiễm — *"ơ, vậy 6 cột bài kia, chồng rút, chồng bỏ, bốn chồng đích... **Tab không ghé qua chỗ nào trong đó à?**"*; *"**tôi bắt buộc phải biết bấm mũi tên sau khi Tab**"*; *"**Space không phải lúc nào cũng có nghĩa giống nhau, tuỳ vào đang đứng ở chồng nào** — tôi phải nhớ trong đầu chứ trang không nhắc lại."* Con số của chính cô: **28 phím gõ** cho một việc mà đường tối ưu là 2.

**Bao nhiêu người vấp:** 1/1 người chơi bằng bàn phím. Không nâng bậc. Nhưng Thuỷ là persona **kiên nhẫn nhất dàn**, nên 28 phím là **sàn, không phải trần** — và quãng dò dẫm thật lẽ ra còn dài hơn, vì công cụ đã vô tình cấp cho cô câu hướng dẫn mà đời thật cô không có.

**Hướng xử lý:** Hướng dẫn phím cần tới được **mắt**, không chỉ tới tai. Riêng việc `Space` đổi nghĩa theo chỗ đứng cần được nhắc tại chỗ.

### F-07 · Medium · Interaction Design

**Ở đâu:** RR-05 — sau một nước đi thành công bằng bàn phím.

**Chuyện gì xảy ra:** Lá bài bay lên chồng đích nhưng tiêu điểm ở lại chỗ cũ — đúng thứ `RR-05.done_when` đòi hỏi ("luôn nhìn thấy mình đang đứng ở đâu").

**Dẫn chứng:** Thuỷ — *"**con trỏ của tôi thì không đi theo lá bài** — nó vẫn đứng nguyên ở 'Cột bài 3'… **Nếu tôi cứ tưởng con trỏ đi theo bài mà bấm tiếp mũi tên, tôi sẽ thao tác nhầm chỗ.**"* Ảnh `p24-RR-05-19-enter-thanh-cong-len-chong-dich.png` — A♥ đã nằm trên chồng đích, vành vàng ở lại Cột bài 3, giờ bao quanh lá 8♦ vừa lật lên.

**Bao nhiêu người vấp:** 1/1 người chơi bằng bàn phím.

**Hướng xử lý:** Sau một nước đi tự động, tiêu điểm nên đi theo kết quả của hành động — hoặc, nếu chủ ý giữ nguyên, phải nói ra.

### F-08 · Medium · Visual craft + ISO 9241-11

**Ở đâu:** Mọi Red Route chạy ở 375px, và RR-05 ở mức phóng 200%.

**Chuyện gì xảy ra:** Ở khổ điện thoại, chữ trên lá bài và dòng số hiệu ván nhỏ tới mức người viễn thị bỏ qua luôn. Cộng thêm: chỉ số trên mặt bài in hai lần, lần thứ hai xoay 180° đúng như bài giấy thật — ở lá dưới cùng mỗi cột, hai chỉ số cùng nằm trong ô rộng ~48px.

**Dẫn chứng:** Ông Tâm — *"**chữ với số nhỏ quá**, tôi hơi ngại không biết mắt mình có theo được không"*; ba từ đầu gồm hẳn *"chữ bé tí"* · Mai — *"lá bài… in kiểu lộn ngược… **tôi phải nhìn kỹ thêm một chút mới đọc ra được đó là lá gì**"* · Thuỷ (phóng 200%) — *"**chữ với viền nó mảnh quá so với mắt tôi bây giờ**."*

**Bao nhiêu người vấp:** 3/6 — hai trong ba là persona tiếp cận của dàn.

**Hướng xử lý:** Chỉ số xoay ngược là **đúng và có chủ ý** (bài giấy thật in như vậy) — đừng bỏ. Vấn đề là ở khổ ~48px hai chỉ số tranh nhau diện tích quá nhỏ. Cần xem lại thang chữ riêng cho dải 320–767px; riêng dòng số hiệu ván còn chồng với F-04.

### F-09 · Low · Interaction Design

**Ở đâu:** RR-08 — hộp thoại xác nhận đổi chế độ rút.

**Chuyện gì xảy ra:** `Escape` không đóng được hộp thoại **duy nhất** của cả sản phẩm.

**Dẫn chứng:** Mai — *"tôi thử bấm phím Escape… **không ăn thua gì, hộp thoại vẫn còn nguyên đó, không tắt**."* Đo độc lập: hộp thoại khai `aria-modal="true"` nhưng **không chuyển tiêu điểm vào trong, không bẫy Tab, không trả tiêu điểm về chỗ cũ khi đóng**.

**Bao nhiêu người vấp:** 1/6. Với Mai chỉ là khó chịu — cô vẫn hoàn thành trọn vẹn RR-08.

**Hướng xử lý:** ⚠️ **Chưa ai thử hộp thoại này bằng bàn phím.** Thuỷ không chạy RR-08, nên hậu quả nặng nhất — người dùng bàn phím nghe thấy hộp thoại nhưng không tới được nút nào của nó — **vẫn chưa được đo**. Mức Low là mức đã quan sát được, không phải mức trần.

### F-10 · Low · Trust & desirability

**Ở đâu:** Toàn trang, ngay lần tải đầu tiên — **dẫn chứng máy, không có persona**.

**Chuyện gì xảy ra:** Mỗi lần tải trang, console ghi **2 lỗi 404** cho `favicon.ico`, trước cả nước đi đầu tiên. Trang không có icon nào ở tab trình duyệt.

**Dẫn chứng:**

```
[ 1818ms] [ERROR] Failed to load resource: the server responded with a status of 404 ()
          @ https://levananhduc.github.io/favicon.ico:0
[ 1955ms] [ERROR] Failed to load resource: ... (lần 2)
```

Chạm ngưỡng `NFR-REL-04`.

**Lưu ý phương pháp, quan trọng:** 6/8 phiên persona báo `Total messages: 0`. Hai kết quả **không mâu thuẫn** — playwright không coi resource-load 404 là console message, chrome-devtools thì có. **Các phiên persona báo "0 lỗi console" không phủ nhận được F-10**, và cũng không đủ để tuyên bố console sạch.

**Bao nhiêu người vấp:** 0/6. Low vì không có tác động người dùng quan sát được, nhưng gắn với F-05: một trang không có cả icon tab lẫn tên trên màn hình thì không để lại dấu vết nào để nhận ra ở lần sau.

---

## Không phát hiện được gì ở

**RR-03 · Hoàn lại — sạch, và là chỗ đúng nhất của sản phẩm.** Ông Tâm tìm thấy nút gần như ngay: *"cái mũi tên cong cong… trông giống cái ký hiệu 'quay lại' tôi hay thấy trên cái đài radio cũ"* — 1 bước, đúng `min_steps`. Nó trả về đúng thứ khó nhất: *"cái lá vừa lật ngửa lúc nãy **úp trở lại y như cũ**"*, và tự khoá khi về tới đầu ván. Route duy nhất mà biểu tượng, hành vi và kỳ vọng khớp nhau hoàn toàn.

**RR-06 · Kéo thả — ba tình huống bắt buộc của `NFR-REL-03` đều đạt.** Kéo hợp lệ *"Ăn ngay… mượt"*; kéo sai *"lá tự bay về đúng chỗ cũ, không kẹt"*; thả vào nền trống *"không đơ, không dính chuột"*. Từ chính miệng người khó tính nhất dàn: *"ít nhất phần này bản này làm không ẩu."*

**RR-08 · Đổi chế độ rút — điểm sáng rõ nhất của cả lượt chạy.** Đúng 2 bước bằng `min_steps`. *"nó làm đúng như nó nói."* Câu tổng kết của Mai là thước đo tốt nhất cho một hộp thoại xác nhận: *"**mất ván là do tôi tự đồng ý mất, không phải bị gài**."*

**Phiên mù của negative persona — kết quả = sản phẩm đúng.** Khoa đi tìm điểm, kỷ lục, streak, thống kê, đăng nhập; không có cái nào, và cả năm đều là Non-Goal đã ghi rõ. Anh nhận ra trong **3 bước, chưa đầy nửa phút**. Sản phẩm không níu chân nhầm người. **Không có gì cần sửa từ phần này.**

---

## Ghi chú về chính lần chạy này

### Bốn lần nhiễu công cụ đã xác minh và bác bỏ — không cái nào là phát hiện

1. **"Bàn bài tự đổi ván" — bác bỏ.** Lượt chạy song song 4 phiên (`p11`–`p14`) đã bị **bỏ toàn bộ**. Playwright MCP dùng chung **đúng một trình duyệt và một trang** cho phiên chính lẫn mọi subagent, nên bốn persona cùng lái một tab. `p11` kết luận rất nặng — *"dấu hiệu của một lỗi tái tạo trạng thái rất nghiêm trọng"* — và người điều phối chạy lại một mình để bác bỏ: chạm `Cơ Át` → lên chồng đích, `?van=66725` **giữ nguyên**, `Hoàn lại` chuyển từ `aria-disabled=true` sang `false`. **Bài học: một persona bị đặt trong môi trường hỏng vẫn kể chuyện rất thuyết phục** — dẫn chứng thật, ảnh thật, lời kể trung thực, chỉ môi trường là sai.
2. **"Không tóm được dãy nhiều lá" — bác bỏ.** `browser_drag`/`browser_click` nhắm vào **tâm hình học**; lá bị đè chỉ lộ 32px trên cùng nên tâm của nó nằm dưới lá đè lên. Tái hiện bằng toạ độ thật: bấm vào **dải nhìn thấy được** → chọn được cả dãy, nhãn nói rõ *"Rô Năm, kèm 1 lá bên dưới, đang chọn"*. **Kéo dãy chạy đúng.**
3. **Mọi câu "bấm hụt vào lá bị lá khác đè lên" — nhiễu công cụ.** Câu này xuất hiện ở **4 phiên** và nghe rất giống một lỗi thật lặp lại nhiều người. Nó không phải.
4. **Nhiễm `sr-only`.** `browser_snapshot` dựng theo cây a11y nên phơi cả nội dung `sr-only`. **2/2 persona** được hỏi ấn tượng đầu sau khi snapshot đã chạy đều "đọc" được câu hướng dẫn phím mà mắt thật không thấy. Mọi câu khen "trang có sẵn hướng dẫn phím" đã bị loại. **Nhưng bản thân việc hướng dẫn phím là `sr-only` là một phát hiện thật** — F-06.

### Sai lệch tìm thấy khi đối chiếu dẫn chứng

- **Một câu trích của người điều phối bị gán nhầm phiên, đã rút.** Dẫn chứng nội bộ từng dẫn Hằng `p21` nói *"…chỉ thấy dòng nhỏ 'Ván số 93712'"*. Câu đó **không có** trong log `p21`, và ván của Hằng ở phiên đó là **228359**. Số 93712 thuộc phiên `p11` **đã bị bỏ**. Đã rút và thay bằng câu có thật. **Luật khớp phiên áp cho cả người điều phối, không chỉ cho ảnh của persona.**
- **Một quan sát thị giác chưa đủ dẫn chứng.** Trong `p28-RR-08-03-hop-thoai-hoi-doi-che-do.png`, lớp nền mờ của hộp thoại làm **lá 5♦ ở cột 1 xám hẳn đi trong khi sáu lá còn lại vẫn trắng bình thường**. Không persona nào nhắc tới, nên **không** xếp thành phát hiện. Ghi ra để lần sau kiểm có chủ đích.
- **Cổng kiểm ảnh: qua.** 9+7+7+21+7+6+6+4 = **67** ảnh, khớp đúng số ảnh trong thư mục. Không phiên nào thiếu ảnh, không ảnh nào mang tiền tố lạ.

### Sai lệch về chính phép đo

- **Hai năng lực bắt buộc bị mất:** throttle mạng (Hằng mất điều kiện định danh của cô) và giả lập cảm ứng (lượt này test đường pointer, **không loại trừ được lỗi chỉ xảy ra với `pointerType: touch`**). Viewport vẫn đặt được thật.
- **Chạy tuần tự, không song song.** Trần "4 phiên đồng thời" không dùng được ở máy này. Trần này chỉ giãn thời gian, không cắt phạm vi.
- **Số phiên đã tiêu:** `p01`–`p03` (agent lấy sai công cụ trình duyệt) và `p11`–`p14` (lượt song song bị bỏ). Lượt thật đánh số `p21`–`p30`.
- **`p25` và `p29` cố ý bỏ.** `p25` (RR-04) vì route đã có ba dẫn chứng từ phiên khác. `p29` (phiên mù trên điện thoại) vì ông Tâm đã chạy hai phiên trên cùng thiết bị — **nhưng lý do này yếu**: phiên mù khác phiên có mục tiêu ở đúng một điểm, **không ai giao việc gì**. Lượt này chạy **8/10 phiên**, và có **1 phiên mù thay vì 2**.
- **Hệ quả:** góc nhìn "người lạ hoàn toàn, trên thiết bị chính, không được giao việc" **chưa được đo** — mà đó đúng là góc nhìn của nhóm người dùng chính. F-03 và F-04 là hai chỗ một phiên mù trên điện thoại nhiều khả năng còn đào thêm được.
- **RR-09 `excluded`**, không tính vào bảng — `win.spec.ts` là phép đo đúng cho chặng đó.
- **`p22-RR-02` không có log console** (phiên bị ngắt rồi nối lại), nên không đóng góp vào việc xác nhận `NFR-REL-04`.

### Việc cần làm cho `lib/` trước lần chạy sau

Ba điều lượt này đã chứng minh và `lib/browser-capability.md` đang nói ngược lại:

1. Dòng "context riêng mỗi phiên → song song thật" của hạng 1 **không đúng** với playwright MCP chạy dưới subagent.
2. **Snapshot theo cây a11y phơi cả `sr-only`** — persona "nhìn được nhưng không dùng trình đọc màn hình" phải được nhắc rõ đừng tin nội dung chỉ có trong snapshot mà không có trên ảnh.
3. Với giao diện có phần tử chồng lấn, **thao tác theo `ref` nhắm vào tâm và sẽ trỏ nhầm phần tử**.

Và một luật bổ sung lượt này sinh ra: phát hiện nào đụng tới **bất biến của engine** thì người điều phối **phải tự tái hiện một mình** trước khi cho vào báo cáo — luật "không dẫn chứng thì không có phát hiện" là **chưa đủ**.
