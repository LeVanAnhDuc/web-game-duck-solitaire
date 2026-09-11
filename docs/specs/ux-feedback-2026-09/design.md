# Thiết kế · Sửa phản hồi UX lượt 2026-09-12

Liên quan: FR-03 · FR-12 · FR-13 · FR-14 · NFR-A11Y-01 · NFR-A11Y-02 · NFR-A11Y-05 ·
NFR-REL-04 · NFR-I18N-01 · ADR-0011 ·
[báo cáo](../../ux-reviews/2026-09-12-duck-solitaire.md)

## 1. Việc này giải quyết cái gì

Lượt persona review ngày 2026-09-12 trả về 10 phát hiện. Tài liệu này nhận **9**, hoãn **1**.

Điều đáng nói nhất: **ba trong bốn phát hiện High có chung một hình dạng — câu trả lời đã
nằm sẵn trong hệ thống thiết kế và code chưa bao giờ nối nó vào.**

| | Đã khai ở đâu | Thực tế trên màn hình |
| --- | --- | --- |
| `--ring-selected` `#FFD166` 8.46:1 | `MASTER.md:49` | **không tồn tại trong `globals.css`**, không chỗ nào dùng |
| `strings.pile.stockEmpty` | `strings.ts:75` | không chỗ nào dùng |
| `strings.a11y.moveRejected` | `strings.ts:119` | không chỗ nào dùng, và không có `aria-live` nào |
| `strings.appTitle` | `strings.ts:61` | không chỗ nào dùng |

Nên phần lớn việc ở đây **không phải thiết kế cái mới**, mà là nối cái đã quyết vào chỗ nó
phải xuất hiện. Đó cũng là lý do không cần cổng duyệt mockup: không có quyết định thị giác
mới nào ngoài hai chỗ được nêu rõ ở §3.

## 2. Không làm gì

- **Không đụng `src/game/`.** Không phát hiện nào chạm tới luật chơi. Bất biến 1–13 giữ nguyên.
- **Không thêm chức năng mới.** Không nút chia sẻ, không thống kê, không điểm — Non-Goal.
  Mai đi tìm nút chia sẻ và không thấy; câu trả lời đúng là **giải thích cái đã có**
  (địa chỉ mang `?van=`), không phải đẻ thêm nút.
- **Không sửa hiệu ứng nháy từ chối.** Xem §4.
- **Không đổi thang chữ ở dải 320–767px (F-08).** Xem §4.

## 3. Từng phát hiện, và cách sửa

### F-01 · Lá đang chọn không có dấu hiệu nhìn thấy được → vành `--ring-selected`

Thêm `--ring-selected: #ffd166` vào `globals.css` (chép từ `MASTER.md`, không bịa), và một
lớp `.card-selected` dựng **vành hai lớp** đúng nguyên tắc MASTER.md §1 đã lập cho vành tiêu
điểm: 3px `--ring-selected` bên trong, 3px `--ring-focus-edge` bên ngoài.

Vì sao hai lớp: `#FFD166` đạt 8.46:1 trên nền bàn nhưng chỉ 1.41:1 trên mặt bài trắng. Lá
đang chọn có thể nằm cạnh lá khác hoặc trên nền bàn, nên luôn phải có ít nhất một lớp tương
phản đủ với thứ nằm dưới. Đây là nguyên tắc **đã có sẵn**, chỉ áp thêm cho một trạng thái nữa.

**Phân biệt với tiêu điểm.** Hiện tiêu điểm dùng `outline` + `box-shadow`; lá đang chọn sẽ
dùng `box-shadow` với bán kính khác và giữ cú nhấc (`scale(1.04)` + bóng đổ). Hai trạng thái
chồng nhau được: một lá vừa được chọn vừa đang có tiêu điểm sẽ thấy cả hai.

Bóng đổ `0 6px 14px rgb(0 0 0 / 0.45)` đang viết thẳng trong `CardView` — đưa nó thành
`--shadow-lift` và khai vào `MASTER.md`, vì `globals.css` tự nhận là bản chép duy nhất.

### F-02 · Nước đi bị từ chối không báo gì → vùng `aria-live`

Thêm một vùng `role="status"` `aria-live="polite"` `sr-only` ở `Home`, xướng
`strings.a11y.moveRejected` mỗi lần `flashReject` chạy.

**Lý do nó quan trọng hơn vẻ ngoài:** `NFR-A11Y-05` tắt **mọi** animation khi người dùng bật
`prefers-reduced-motion` (`globals.css` đặt `animation: none !important`). Nghĩa là hôm nay,
người bật giảm-chuyển-động **không nhận được phản hồi từ chối nào cả** — không nháy, không
lắc, không chữ. Vùng `aria-live` là kênh duy nhất chạy được ở mọi cấu hình.

Cần một khoá đổi mỗi lần từ chối, nếu không hai lần từ chối liên tiếp cùng nội dung sẽ không
được xướng lại.

### F-03 · Chồng rút cạn giống hệt chồng đích rỗng → icon + nhãn

Hai việc, cùng chỗ:

1. `PileSlot` nhận thêm cờ cho biết đây là **chồng rút đã cạn**, và vẽ biểu tượng vòng lại
   (`RotateCw` của lucide, cùng bộ icon thanh công cụ đang dùng) trong khung rỗng.
2. Nhãn của chồng đó đổi từ `strings.pile.stock` sang `strings.pile.stockEmpty`
   ("Chồng rút đã cạn, chạm để lật lại") — chuỗi đã viết sẵn, chưa từng ai đọc được.

Không thêm chữ lên màn hình: ở 375px lá bài rộng ~48px, không đủ chỗ cho chữ. Biểu tượng
vòng lại là ký hiệu ông Tâm đã tự nhận ra ở nút Hoàn lại (*"trông giống cái ký hiệu 'quay
lại' tôi hay thấy trên cái đài radio cũ"*) — dùng lại đúng vốn từ thị giác đó.

### F-04 + F-05 · Số hiệu ván và danh tính sản phẩm → viết lại header

Header hiện có đúng một dòng 13px màu mờ: `Ván số NNNNNN`. Thay bằng ba thứ:

- **Tên sản phẩm** `strings.appTitle` — trả lời "trang này là gì của ai", thứ 4/6 persona
  nói là thiếu.
- **Số hiệu ván** ở cỡ lớn hơn và màu `--fg-default` thay vì `--fg-muted` — nó là điểm khác
  biệt duy nhất của sản phẩm, không thể mang cỡ chữ nhỏ nhất trang.
- **Câu giải thích hiện rõ**, không nằm trong `title`. `strings.seed.hint` hiện chỉ hiện khi
  rê chuột — vô hình trên điện thoại, mà điện thoại là nhóm người dùng chính.

Chỗ này có một **quyết định thị giác mới**: một dòng nói sản phẩm không thu thập gì. 0/6
persona dám nhập email, lý do lặp lại là "không biết ai đứng sau". Việc không thu thập gì là
lợi thế thật của sản phẩm (`NFR-DATA-01` là thứ giữ cho nó đúng) nhưng đang bị **giấu đi**.
Câu chữ lấy thẳng từ `overview.md` §1 — không bịa định vị mới.

### F-06 · Hướng dẫn phím `sr-only` → hiện ra khi có người dùng bàn phím

Không hiện thường trực: Mai (dùng điện thoại) đã nói thẳng câu đó vô nghĩa với cô.
Không giữ nguyên `sr-only`: người dùng bàn phím **nhìn được** không bao giờ đọc nó.

Giải: hiện đúng lúc có người thật sự dùng bàn phím, bằng CSS thuần —
`:has(:focus-visible)` trên vùng bàn bài. `:focus-visible` chỉ bật khi tương tác bằng bàn
phím, nên người chạm/kéo không bao giờ thấy nó.

Bản `sr-only` giữ nguyên cho trình đọc màn hình; bản hiện ra mang `aria-hidden="true"` để
không bị đọc hai lần.

### F-07 · Tiêu điểm không đi theo lá bài → dịch con trỏ tới đích

`autoMoveFrom` đã có `move.to` trong tay. Sau khi `playMove` thành công, đặt `focus` về
đúng ô của `move.to` trong lưới `ROWS`.

Chỉ áp cho **nước đi tự động khởi phát từ bàn phím** (Enter). Không đụng đường chạm/kéo —
ở đó không có con trỏ bàn phím để mà dịch.

### F-09 · `Escape` không đóng hộp thoại → xử phím + quản tiêu điểm

Hộp thoại khai `aria-modal="true"` nhưng không đưa tiêu điểm vào trong. Đó là phản mẫu đã
biết: trình đọc màn hình bị giới hạn trong hộp thoại còn tiêu điểm bàn phím ở ngoài — người
dùng nghe thấy hộp thoại nhưng không tới được nút nào.

Ba việc: `Escape` đóng (tương đương "Giữ ván hiện tại") · đưa tiêu điểm vào nút an toàn khi
mở · trả tiêu điểm về ô chọn chế độ rút khi đóng.

Không làm bẫy Tab đầy đủ ở lượt này — xem §4.

### F-10 · `favicon.ico` 404 → thêm `src/app/icon.svg`

Trình duyệt xin `/favicon.ico` ở **gốc domain** khi trang không khai `<link rel="icon">` nào,
nên nó còn không đi qua `basePath`. Thêm `src/app/icon.svg`: Next tự sinh thẻ link với
`basePath` đúng, và trình duyệt thôi đoán.

SVG chứ không PNG: vài trăm byte, không thêm tài nguyên nhị phân, không vi phạm
`NFR-DATA-01` (không tải font/ảnh từ ngoài). Hình lấy đúng vốn màu đã có — lưng bài
`#4A90D9` trên nền bàn `#0B3D2E`.

## 4. Hoãn có chủ ý, kèm lý do

| Việc | Vì sao hoãn |
| --- | --- |
| **F-08 · thang chữ 320–767px** | `MASTER.md` §2 chốt hạng bài 14/20/26px. Đổi cỡ chữ ở dải hẹp kéo theo bố cục lá bài (rộng ~40px ở 320px) và **chồng với mục `--overlap-up` đang nằm trong `backlog.md`**. Đây là một lượt thiết kế riêng, không phải một dòng sửa |
| **Tăng cường hiệu ứng từ chối bằng mắt** | `ux-expert` nói hiệu ứng hiện tại "rõ ràng chưa đủ" với hai persona. Nhưng mọi phương án đều là quyết định thị giác mới (giữ vành đỏ lâu hơn? đổi màu? thêm chữ?) và `NFR-A11Y-05` cấm dựa vào chuyển động. Vùng `aria-live` đóng được lỗ hổng nặng nhất (người không nhìn thấy màn hình, người tắt chuyển động) **ngay**; phần thị giác cần một lượt thiết kế có đo tương phản |
| **Bẫy Tab đầy đủ trong hộp thoại** | Chưa persona nào thử hộp thoại bằng bàn phím (Thuỷ không chạy RR-08), nên mức nghiêm trọng thật **chưa đo được**. `Escape` + đưa tiêu điểm vào trong là phần chắc chắn đúng; bẫy Tab đợi lượt sau đo rồi làm |
| **Phiên mù trên điện thoại** | Lượt này bỏ (`p29`). Cần chạy trước khi kết luận F-03 và F-04 đã đủ |

## 5. Ngưỡng mới sinh ra từ lượt này

`nfr.md` nói thêm ngưỡng "sau sự cố sinh ra ngưỡng mới". F-01 và F-02 là đúng loại đó:

**`NFR-A11Y-06`** — Mọi chỉ báo **trạng thái** (đang chọn, bị từ chối, đang có tiêu điểm)
phải đạt ≥ 3:1 so với thứ nằm dưới nó, **và** phải có ít nhất một kênh không phụ thuộc
chuyển động. Kiểm: đo tương phản + thử lại với `prefers-reduced-motion: reduce` bật.

Vế thứ hai là phần đắt: nó chặn đúng cái bẫy mà F-02 rơi vào — một phản hồi chỉ tồn tại
dưới dạng animation sẽ **biến mất hoàn toàn** với người đã xin đừng animate.

## 6. Bố cục header sau khi sửa

Không có mockup trên canvas cho lượt này (xem §Nợ ở `backlog.md`). Phác bằng chữ:

```
375px                                  1440px
┌────────────────────────────┐         ┌──────────────────────────────────────┐
│ Duck Solitaire             │         │ Duck Solitaire        Ván số 66725   │
│ Ván số 66725               │         │ Không tài khoản ·     Cùng số hiệu   │
│ Cùng số hiệu ván luôn cho  │         │ không quảng cáo ·     ván luôn cho   │
│ cùng thế bài               │         │ không lưu gì          cùng thế bài   │
│ Không tài khoản · không    │         ├──────────────────────────────────────┤
│ quảng cáo · không lưu gì   │         │            [bàn bài]                 │
├────────────────────────────┤         │                                      │
│        [bàn bài]           │         │  ← khoảng trống ~400px vẫn còn, và   │
└────────────────────────────┘         │    đó là chỗ header mượn để nói      │
```

Header cao thêm khoảng 40px. Ở 375×720 bàn bài đang kết thúc ở ~230px với ~380px trống bên
dưới, nên không có gì bị đẩy khỏi màn hình.
