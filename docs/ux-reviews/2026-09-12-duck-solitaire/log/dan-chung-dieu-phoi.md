# Dẫn chứng do người điều phối tự đo

Không phải log persona. Đây là những thứ persona **không** đo được (đọc CSS đã tính, đọc
console mức network, tái hiện một mình để bác bỏ nhiễu). Mỗi mục dưới đây tự đứng được mà
không cần persona nào xác nhận.

Tiền tố ảnh là `dc-`, **không** trùng tiền tố phiên nào, nên cổng kiểm ảnh của
`lib/orchestration.md` không nhầm chúng với ảnh persona.

---

## DC-1 · `favicon.ico` 404 hai lần mỗi lần tải trang

**Đo bằng:** chrome-devtools-mcp, lần tải đầu tiên để xác nhận đúng app.

```
[ 1818ms] [ERROR] Failed to load resource: the server responded with a status of 404 ()
          @ https://levananhduc.github.io/favicon.ico:0
[ 1955ms] [ERROR] Failed to load resource: the server responded with a status of 404 ()
          @ https://levananhduc.github.io/favicon.ico:0
```

**Đối chiếu repo:** `public/` rỗng · không có `src/app/icon.*` · `layout.tsx` không khai
`metadata.icons` · `out/` không có file icon nào.

Đường dẫn là **gốc domain**, không nằm dưới `basePath` — hành vi mặc định của trình duyệt
khi trang không khai `<link rel="icon">` nào.

**Chạm ngưỡng:** `NFR-REL-04` — "Console không có lỗi hay cảnh báo nào trong suốt một ván
chơi đầy đủ". Đây là lỗi có mặt từ giây đầu tiên, trước cả nước đi đầu tiên.

**Lưu ý về cách đo:** `browser_console_messages` của playwright ở `level=error` trả về
`Total messages: 0` cho cùng trang đó. Hai kết quả **không mâu thuẫn** — playwright không
coi resource load 404 là console message, chrome-devtools thì có. Nghĩa là các phiên persona
báo "0 lỗi console" **không phủ nhận** được DC-1.

## DC-2 · Lá đang chọn gần như không có dấu hiệu nhìn thấy được

**Ảnh:** `dc-01-la-dang-chon-chi-co-bong-do.png` (375px, ván `?van=66725`, lá `Rô Đầm` cột 3).

**Đo được từ DOM sau khi chạm chọn:**

| Thuộc tính | Giá trị |
| --- | --- |
| `aria-label` | `"Rô Đầm, đang chọn"` ✓ |
| `aria-pressed` | `true` ✓ |
| `data-selected` | `"true"` ✓ |
| `box-shadow` | `rgba(0,0,0,0.45) 0px 6px 14px 0px` ← **thay đổi thị giác duy nhất** |
| `transform` | thêm `scale(1.04)` |
| ring màu | **không có** |

Nguồn: `src/views/Home/components/CardView/index.tsx:118` và `:121`.

**Vì sao đây là lỗi, không phải lựa chọn thẩm mỹ — đây là chỗ hệ thống thiết kế bị hở hai chiều:**

`docs/design-system/solitaire/MASTER.md:49` khai hẳn một vai trò màu cho đúng trạng thái này —

> | Lá đang chọn | `--ring-selected` | `#FFD166` | **8.46:1** trên nền bàn ✓ |

| Chiều hở | Sự thật đo được |
| --- | --- |
| MASTER.md → code | `grep -n "ring-selected" src/app/globals.css` → **không có dòng nào**. Biến này chưa bao giờ được định nghĩa trong code. `grep -rn "ring-selected" src/ tailwind.config.ts` → rỗng |
| code → MASTER.md | Giá trị thật đang dùng là `box-shadow: 0 6px 14px rgb(0 0 0 / 0.45)` viết thẳng vào `style` inline (`CardView/index.tsx:121`). Giá trị này **không có** trong MASTER.md |

`globals.css` tự nhận ở ngay dòng đầu: *"The ONLY transcription of
docs/design-system/solitaire/MASTER.md. Every value below appears there with its contrast
ratio; nothing here is invented."* Cả hai vế đều đang sai: một token của MASTER.md thiếu
trong bản chép, và một giá trị thị giác trong code không có trong MASTER.md.

Trạng thái đang-chọn vì thế được truyền đạt bằng một vệt bóng **tối** trên nền bàn **tối**
(`#0B3D2E`), cộng một cú phóng to 4% — ở 375px lá bài rộng ~40px nên 4% là **1.6px**.

**Chạm ngưỡng:** WCAG 1.4.11 (tương phản thành phần phi văn bản ≥ 3:1) áp cho chỉ báo trạng
thái. Bóng đổ tối trên nền tối không đạt. Gián tiếp chạm `NFR-A11Y-01`.

**Persona xác nhận độc lập:** `p21-RR-01` (Hằng) — chạm chọn `5♠`, tự phóng to ảnh ra xem
rồi kết luận *"nhìn bằng mắt thường thì không thấy gì khác cả, lá bài y hệt lúc chưa chạm"*,
và *"nếu tay tôi không nhớ mình vừa chạm lá nào… tôi sẽ không biết là mình đang cầm lá nào"*.
Ảnh của cô: `p21-RR-01-03b-zoom-la-chon.png`.

## DC-3 · Bác bỏ: bàn bài **không** tự đổi ván

Xem `../ghi-chu-lan-chay.md` §5. Tái hiện một mình: chạm `Cơ Át` → lên `Chồng đích Cơ`,
`?van=66725` giữ nguyên, `Hoàn lại` chuyển `aria-disabled` từ `true` sang `false`.
FR-14 và ADR-0001 đều đứng vững. Cái `p11` thấy là nhiễu do bốn agent dùng chung một trình duyệt.

## DC-4 · Cần kiểm: 45 điểm dừng bàn phím cùng mang một tên "Lá úp"

**Quan sát từ cây a11y** (`browser_snapshot`, ván `?van=66725`): chồng rút phơi ra **24**
phần tử `role="button"` đều có `aria-label = "Lá úp"`; cộng các lá úp trong 7 cột là khoảng
**45** phần tử cùng tên.

Chưa kết luận — còn phụ thuộc `tabIndex` thật của chúng, mà phiên bàn phím `p24-RR-05`
(Thuỷ) mới trả lời được. Ghi ở đây để đừng quên đối chiếu.

## DC-5 · Ba chuỗi được khai báo nhưng không bao giờ tới được người dùng

Quét toàn bộ khoá trong `src/lib/strings.ts` rồi đối chiếu với chỗ dùng trong `src/`:

| Chuỗi chết | Nội dung | Lẽ ra phải xuất hiện lúc nào |
| --- | --- | --- |
| `strings.pile.stockEmpty` | "Chồng rút đã cạn, chạm để lật lại" | khi chồng rút hết bài |
| `strings.a11y.moveRejected` | "Nước đi không hợp lệ" | sau mỗi nước đi bị từ chối |
| `strings.appTitle` | "Duck Solitaire" | trên chính trang |

`grep -rn "\.stockEmpty\|\.moveRejected\|appTitle" src/ --include=*.tsx` → không có kết quả nào
ngoài chính `strings.ts`.

Hệ quả từng cái:

- **`stockEmpty`** — `PileSlot` vẽ mọi chồng rỗng bằng đúng một khung viền `--edge-empty`
  2px, không phân biệt chồng rút đã cạn với chồng đích còn trống. Không icon, không chữ.
  Câu chỉ dẫn đã viết sẵn nằm đó không ai đọc được, kể cả người dùng trình đọc màn hình —
  nhãn họ nghe chỉ là "Chồng rút" + "trống".
- **`moveRejected`** — không có `aria-live` hay `role="alert"` nào trong `src/`
  (`grep -rn 'aria-live\|role="alert"' src/` → rỗng). Nước đi bị từ chối chỉ báo bằng
  **hiệu ứng nháy đỏ và rung lá bài**. Người không nhìn thấy màn hình không được báo gì.
- **`appTitle`** — tên sản phẩm chỉ nằm ở `<title>` của tab. Trên trang không có tên,
  không logo, không một chữ nào nói đây là cái gì của ai.

## DC-6 · Số hiệu ván: 13px, và là thứ duy nhất trên header

`src/views/Home/index.tsx:381-387`

```
<header className="flex items-center justify-between text-[13px] text-muted" ...>
  <span className="font-num" title={strings.seed.hint}>Ván số 66725</span>
```

- Cỡ **13px**, màu `--fg-muted` (#A9C6B6, 6.65:1 — tương phản đạt, **cỡ chữ mới là vấn đề**).
- Lời giải thích "Cùng số hiệu ván luôn cho cùng thế bài" nằm trong thuộc tính `title`,
  tức là **chỉ hiện khi rê chuột** — vô hình trên điện thoại, mà điện thoại là nhóm người
  dùng chính (`overview.md` §3).

**Hai persona đụng độc lập:**

- `p22-RR-02` (ông Tâm, 68 tuổi, viễn thị): *"chữ bé tí (cái dòng số ván trên góc tôi nhìn
  không ra, bỏ qua luôn)"* — kể trong chính phần ấn tượng 5 giây.
- ~~`p21-RR-01` (Hằng): "Không có logo, không có tên hãng… chỉ thấy dòng nhỏ 'Ván số 93712'."~~
  **DẪN CHỨNG HỎNG — ĐÃ RÚT.** `ux-expert` bắt được khi đối chiếu: câu này **không có** trong
  `p21-RR-01-hang.md`, và ván của Hằng ở phiên đó là **228359** (kiểm bằng
  `p21-RR-01-01-vua-mo-trang.png`). Số **93712** thuộc phiên `p11` — **lượt đã bị bỏ**. Người
  điều phối trích nhầm từ ký ức lượt chạy hỏng sang lượt chạy thật.
  Thay bằng câu **có thật** trong `p21-RR-01-hang.md`, cùng ý: *"Không thấy ô nhập liệu nào cả
  nên chưa phải lo chuyện đó — mà nếu có chắc tôi cũng thoát liền như mấy lần trước."* Phần
  "không biết ai đứng sau trang" được chứng minh bằng `p27`, `p28`, `p30` thay thế.
  **Bài học:** luật khớp tiền tố phiên của `frameworks.md` áp cho **cả người điều phối**, không
  chỉ cho ảnh của persona.

Đây là chỗ đau nhất về mặt sản phẩm: theo `README.md:1` thì seed **là** điểm khác biệt duy
nhất của Duck Solitaire ("every deal comes from a seed, so you can play the same one twice").
Nó đang được trình bày bằng cỡ chữ nhỏ nhất trang, kèm một lời giải thích chỉ hiện khi rê chuột.

## DC-4 (đã trả lời) · Ngược lại với lo ngại ban đầu: Tab chỉ tới được **6** chỗ

Lo ngại ghi ở DC-4 lúc đầu — "45 điểm dừng Tab cùng tên Lá úp" — **sai**. Lá bài không nằm
trong thứ tự Tab. `p24-RR-05` (Thuỷ) đo được sự thật ngược lại:

> "tổng cộng chỉ có **6 điểm dừng** trong trang (1 cột bài + 5 nút/hộp chọn), còn 6 cột bài
> kia, chồng rút, chồng bỏ và bốn chồng đích thì **Tab không bao giờ ghé tới**."

Đây là **roving tabindex** — đúng chuẩn ARIA cho một widget dạng lưới, không phải lỗi. Bàn
bài là một điểm vào, rồi điều hướng bên trong bằng phím mũi tên. Ghi lại để không ai "sửa"
nó thành 52 điểm dừng Tab.

Nhưng nó đẻ ra một điều kiện: **người dùng phải biết là có phím mũi tên.** Xem DC-7.

## DC-7 · Hướng dẫn phím duy nhất của app chỉ trình đọc màn hình mới thấy

`src/views/Home/index.tsx:388`

```
<span className="sr-only">{strings.a11y.keyboardHint}</span>
```

`strings.a11y.keyboardHint` = "Dùng phím mũi tên để di chuyển giữa các chồng bài, phím cách
để chọn và thả, Enter để tự tìm chỗ, Escape để bỏ chọn."

`sr-only` nghĩa là **ẩn khỏi mắt**. Người dùng bàn phím mà **vẫn nhìn được màn hình** — dùng
kính lúp, chuột hỏng, cổ tay đau, hoặc chỉ thích phím tắt — không bao giờ thấy câu này. Với
DC-4 ở trên, nghĩa là: Tab chỉ đưa họ tới 1 trong 12 chồng bài, và thứ duy nhất giải thích
cách tới 11 chồng còn lại thì họ không đọc được.

**⚠️ Nhiễm công cụ trong log `p24-RR-05` — phải đọc kèm cảnh báo này.** Thuỷ kể ở phần ấn
tượng 5 giây:

> "ngay dưới là một câu hướng dẫn: 'Dùng phím mũi tên để di chuyển giữa các chồng bài…'
> — cái này lạ, đa số web game tôi từng vào không ai buồn viết ra vậy."

Cô **không thể nhìn thấy câu đó**. Nó tới từ `browser_snapshot`, vốn dựng cây a11y nên phơi
cả nội dung `sr-only` ra như thể nó hiện trên màn hình. Nhân vật Thuỷ dùng **kính lúp màn
hình, không dùng trình đọc màn hình**, nên trong đời thật cô sẽ không có câu hướng dẫn đó.

Hệ quả khi đọc log của cô: mọi câu khen về "trang có nghĩ tới người dùng bàn phím" ở phần 1
**không dùng được**, và quãng dò dẫm của cô ở phần 2 lẽ ra còn dài hơn nữa. Phần còn lại của
phiên — số lần Tab, hành vi phím mũi tên, Space, Enter, Escape — vẫn dùng được bình thường.

Đây là lần thứ hai trong lượt chạy này môi trường đo làm sai lời kể của persona (lần đầu:
§5 `ghi-chu-lan-chay.md`). Cần ghi vào `lib/browser-capability.md`: **snapshot theo cây a11y
phơi cả `sr-only`**, nên persona "nhìn được nhưng không dùng trình đọc màn hình" phải được
nhắc rõ là đừng tin nội dung chỉ có trong snapshot mà không có trên ảnh.

## DC-8 · Bàn phím: ba chỗ hụt, do chính `p24-RR-05` đo

1. **Tiêu điểm không đi theo lá bài vừa đi.** Thuỷ chọn `Cơ Át` ở Cột bài 3, bấm Enter, lá
   bay lên chồng đích — *"con trỏ của tôi thì không đi theo lá bài — nó vẫn đứng nguyên ở
   'Cột bài 3'… Nếu tôi cứ tưởng con trỏ đi theo bài mà bấm tiếp mũi tên, tôi sẽ thao tác
   nhầm chỗ."* Ảnh: `p24-RR-05-19-enter-thanh-cong-len-chong-dich.png`.
2. **Thất bại im lặng.** Enter trên lá không có chỗ đi hợp lệ → tự bỏ chọn, không báo gì:
   *"nó tự bỏ chọn lại, im lặng, không có dòng chữ nào báo 'không đặt được'. Nếu tôi không
   hỏi máy, tôi sẽ chỉ nghĩ 'ơ, sao lá đó tự nhiên hết sáng, chắc tôi bấm nhầm.'"*
   Đây chính là chỗ `strings.a11y.moveRejected` (DC-5) lẽ ra phải được xướng lên.
   Ảnh: `p24-RR-05-15-enter-khong-cho-hop-le.png`.
3. **`Space` đổi nghĩa theo chỗ đứng** — ở chồng rút là "bốc bài", ở chồng khác là
   "chọn/thả". *"tôi phải nhớ trong đầu chứ trang không nhắc lại."* Học được, nhưng cộng
   với DC-7 thì không có chỗ nào để học.

Ghi chú: phát hiện 1 và 2 **không** liên quan tới nhiễu sr-only ở DC-7 — chúng là hành vi
quan sát được trên ảnh và trên bàn bài, không phải chữ đọc từ snapshot.

## DC-9 · Bác bỏ: kéo cả dãy nhiều lá **chạy đúng**

`p26-RR-06` (Dũng) bỏ cuộc ở đúng thao tác quan trọng nhất với anh ta:

> "Cả hai lần bấm-kéo đều không nhấc nổi lá 6 Bích lên, vì cái vùng chạm vô hình của lá 5 Cơ
> nằm chồng ngay lên nó chặn mất… Bản này làm ẩu chỗ ghép dãy, kéo cụm không được là tôi bỏ."

**Đây là nhiễu công cụ, không phải lỗi sản phẩm.** `browser_drag` và `browser_click` của
playwright nhắm vào **tâm hình học** của phần tử. Lá bài cao 134px ở desktop, `--overlap-up`
là 32px — nên một lá đã bị lá khác đè lên chỉ còn lộ ra **32px trên cùng**, và **tâm của nó
nằm dưới lá đè lên**. Công cụ vì thế luôn tóm nhầm lá trên.

Tái hiện bằng toạ độ thật, ván `?van=66725`, dãy `Rô Năm` + `Tép Bốn` ở `tableau-1`
(5♦ tại y=247.5, 4♣ tại y=279.5, cùng rộng 96 cao 134):

| Bấm vào | `data-selected` sau đó |
| --- | --- |
| **dải nhìn thấy được** của 5♦ — `(504, 263)` | `Rô Năm, kèm 1 lá bên dưới, đang chọn` **+** `Tép Bốn, đang chọn` |
| **tâm hình học** của 5♦ — `(504, 314)` | chỉ `Tép Bốn, đang chọn` |

Tóm cả dãy chạy đúng, và nhãn còn nói rõ "kèm 1 lá bên dưới". Người thật bấm vào dải bài
nhìn thấy được — không ai nhắm vào tâm một lá đang bị che.

**Phần còn lại của `p26-RR-06` vẫn dùng được, và toàn tin tốt:** kéo hợp lệ ăn ngay; kéo sai
chỗ thì lá tự về chỗ cũ; thả vào khoảng nền trống giữa các chồng cũng tự về, không kẹt, không
dính con trỏ. Đó đúng là ba điều `NFR-REL-03` đòi hỏi, và Dũng xác nhận cả ba.

**Đây là nhiễu công cụ thứ ba của lượt chạy** (sau ván tự đổi ở §5 `ghi-chu-lan-chay.md`, và
sr-only ở DC-7). Rút ra: **mọi phát hiện dạng "không tương tác được với lá bài" đều phải tái
hiện bằng toạ độ trước khi tin.** Cần ghi vào `lib/browser-capability.md`: với giao diện có
phần tử chồng lấn, thao tác theo `ref` nhắm vào tâm và sẽ trỏ nhầm phần tử.

## DC-10 · `Escape` không đóng được hộp thoại đổi chế độ rút

`p28-RR-08` (Mai): *"tôi thử bấm phím Escape xem có đóng hộp thoại được không — không ăn
thua gì, hộp thoại vẫn còn nguyên đó, không tắt."*
Ảnh: `p28-RR-08-03-hop-thoai-hoi-doi-che-do.png`.

Khớp với code: `src/views/Home/index.tsx:495-527` dựng hộp thoại có `role="dialog"`,
`aria-modal="true"`, `aria-labelledby` — nhưng **không có** `onKeyDown` cho `Escape`,
**không** đưa tiêu điểm vào trong, **không** bẫy Tab, và **không** trả tiêu điểm về chỗ cũ
khi đóng.

`aria-modal="true"` mà không chuyển tiêu điểm vào hộp thoại là một phản mẫu đã biết: trình
đọc màn hình bị giới hạn trong hộp thoại, còn tiêu điểm bàn phím thì vẫn ở ngoài — người
dùng nghe thấy hộp thoại nhưng không tới được nút nào của nó.

**Phần còn lại của RR-08 là điểm sáng rõ nhất của cả lượt chạy.** Mai đi qua trọn vẹn, không
vấp: cảnh báo nói thẳng "Ván đang chơi sẽ bị bỏ. Vẫn đổi chứ?"; "Giữ ván hiện tại" giữ thật
và trả ô chọn về giá trị cũ; "Đổi và chia lại" làm đúng như đã nói. Cảm nhận đi **lên**:
"gọn gàng / hơi trống trải / chưa chắc chắn" → "rõ ràng / sòng phẳng / đỡ lo", kèm
*"mất ván là do tôi tự đồng ý mất, không phải bị gài."*

## DC-11 · Nhiễm `sr-only` là hệ thống, không phải cá biệt — ảnh hưởng tới bảng "Ấn tượng đầu"

Persona thứ hai cũng "đọc" được chuỗi `sr-only`. `p28-RR-08` (Mai, dùng điện thoại):

> "chỉ có một dòng chữ nhỏ nói về phím mũi tên với phím cách — mà tôi cầm điện thoại thì
> đâu có bàn phím mà bấm."

Cô không thể thấy dòng đó (xem DC-7). Hai trên hai persona được hỏi ấn tượng đầu sau khi
`browser_snapshot` đã chạy đều nhắc tới nó.

**Hệ quả khi dựng báo cáo:** thước "Đoán đúng đây là trang gì" trong bảng Ấn tượng đầu bị
**nhiễu có hệ thống** — persona được cấp thêm thông tin mà người dùng thật không có. Thước
đó phải kèm cảnh báo, và mọi câu ấn tượng đầu nào nhắc tới "hướng dẫn phím" đều phải loại.

Trớ trêu là chính phản ứng của Mai lại củng cố DC-7 từ hướng khác: ngay cả khi **được** đọc
câu đó, nó vẫn vô dụng với cô — hướng dẫn duy nhất mà app đưa ra chỉ nói về bàn phím, trong
khi nhóm người dùng chính dùng điện thoại và không có bàn phím nào.
