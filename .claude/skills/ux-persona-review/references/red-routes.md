# Red Routes — Duck Solitaire

> **Trạng thái:** 🟢 **đã duyệt 2026-09-12** — 8 route `live`, 1 route `excluded`
> Đây là bản hợp đồng phạm vi. Mọi lần chạy persona về sau đều chỉ đi các route ở đây.
> Sửa file này là làm các lần chạy trước và sau **không so được với nhau nữa** — sửa thì
> ghi mốc vào `docs/04-state/backlog.md`.

## Luật đọc file này

- `lib/orchestration.md` chỉ chạy các route **`status: live`**. Mọi giá trị khác bị loại
  khỏi lượt chạy nhưng **ở lại file** để theo dõi. ID không bao giờ được dùng lại.
- Giá trị `status` dùng ở project này:

  | giá trị | nghĩa |
  | --- | --- |
  | `live` | đã làm xong, và **một người lạ hoàn thành được trong trần 40 hành động** |
  | `planned` | chưa làm |
  | `excluded` | đã làm xong nhưng **không đo được bằng một phiên persona** — phải kèm `why_excluded` |

- `excluded` là phần mở rộng riêng của project này. Lý do nó tồn tại: Klondike có những
  chặng cần vài trăm nước đi, dài hơn trần 40 hành động của một phiên. Xếp chúng là
  `planned` sẽ nói dối về trạng thái sản phẩm; xếp là `live` sẽ sinh ra báo cáo toàn
  "không làm xong được" mà lỗi nằm ở thiết kế phép đo, không ở sản phẩm.
- `done_when` viết bằng thứ **quan sát được từ phía người dùng**. Không câu nào nhắc tới
  tên hàm, tên component hay selector — persona không được biết trước phải bấm gì.
- `min_steps` là số bước của đường đi tối ưu, dùng làm mẫu số khi chấm hiệu suất. Nó
  **không** tính 5 giây đứng yên ở đầu phiên.

---

## RR-01 · Đi nước đầu tiên bằng chạm

- **id:** RR-01
- **name:** Đi nước đầu tiên bằng chạm
- **actor:** Người chơi điện thoại, biết luật Klondike, chưa từng vào trang này
- **entry:** `http://localhost:3000/` (viewport 375px)
- **done_when:** Có ít nhất một lá bài đã nằm ở chồng khác so với lúc trang vừa mở, và
  người chơi làm được điều đó mà không phải đọc hướng dẫn nào.
- **min_steps:** 2 — chạm lá nguồn, chạm chồng đích
- **why_red:** Đây là nước đi đầu tiên của **mọi** người chơi và là điểm rẽ sống chết:
  không làm được thì mọi thứ còn lại không có cơ hội xảy ra. Nhóm người dùng chính là
  người dùng điện thoại, và họ được phục vụ bằng chạm chứ không bằng kéo.
- **status:** live
- **derived_from:** `docs/01-product/journeys.md:8` (US-01, bước 2–3) ·
  `docs/02-requirements/scope.md:11` (FR-02) · `docs/01-product/overview.md:22` (§3 nhóm chính)

## RR-02 · Rút bài khi bí nước

- **id:** RR-02
- **name:** Rút bài khi bí nước
- **actor:** Người chơi điện thoại đã đi vài nước và hết chỗ đi
- **entry:** `http://localhost:3000/` (viewport 375px)
- **done_when:** Có một lá mới ngửa ra ở chồng bài đã rút; và khi chồng úp cạn, người
  chơi tự tìm ra cách lật vòng lại để rút tiếp.
- **min_steps:** 1 — chạm chồng úp (lật vòng lại: thêm 1)
- **why_red:** Một ván Klondike bí sau ba đến bốn nước nếu không rút bài. Chồng úp là chỗ
  duy nhất trên bàn mà cú chạm đầu tiên **không** chọn một lá mà thực hiện một hành động
  khác — affordance mờ nhất của toàn bộ giao diện, và chồng đã cạn lại đổi nghĩa lần nữa.
- **status:** live
- **derived_from:** `docs/01-product/journeys.md:8` (US-01, bước 4 và mục "chạm chồng bài
  úp khi nó đã rỗng") · `docs/02-requirements/scope.md:12` (FR-03)

## RR-03 · Sửa một nước đi lỡ tay

- **id:** RR-03
- **name:** Sửa một nước đi lỡ tay
- **actor:** Người chơi vừa đẩy nhầm một lá và muốn lấy lại
- **entry:** `http://localhost:3000/`
- **done_when:** Bàn bài trở về đúng như trước nước vừa rồi — kể cả lá vừa được lật lên
  thì úp trở lại — và người chơi tin rằng mình đã lấy lại được đúng thứ đã mất.
- **min_steps:** 1 — chạm nút hoàn lại (sau khi đã đi ít nhất một nước)
- **why_red:** Đi nhầm là chuyện thường xuyên trong Klondike. Không lấy lại được thì
  người chơi phải bỏ cả ván, và một sản phẩm không có tài khoản, không có điểm thì thứ
  duy nhất họ có để mất chính là ván đang chơi. Đây cũng là chỗ tài liệu tự nhận là dễ
  sai âm thầm nhất.
- **status:** live
- **derived_from:** `docs/01-product/journeys.md:72` (US-04) ·
  `docs/02-requirements/scope.md:16` (FR-07)

## RR-04 · Đưa lá lên chồng đích nhanh nhất có thể

- **id:** RR-04
- **name:** Đưa lá lên chồng đích nhanh nhất có thể
- **actor:** Người chơi Klondike lâu năm, phản xạ là tìm đường tắt
- **entry:** `http://localhost:3000/?van=2`
  *(ván số 2: nước đi hợp lệ đầu tiên của thế bài này đi từ một cột bài thẳng lên một
  chồng đích còn trống, nghĩa là có một con Át ngửa sẵn ngay khi chia xong — nguồn:
  `e2e/fixtures/winnable.json`, `seed: 2` và phần tử đầu của `moves`)*
- **done_when:** Có ít nhất một lá nằm trên một trong bốn chồng đích, và người chơi nhận
  ra cách đưa lá lên đó **rẻ hơn** cách chạm-nguồn-rồi-chạm-đích thông thường.
- **min_steps:** 1 — một cú chạm lên lá
- **why_red:** Đây là nước đi lặp lại nhiều nhất trong cả ván. README bán nó như một
  tính năng ("one tap sends a card up to its foundation"); nếu người chơi không tự khám
  phá ra thì lời hứa đó chỉ tồn tại trong tài liệu. Nó cũng chính là chỗ một-chạm và
  hai-chạm chồng nghĩa lên nhau — nguy cơ cú chạm thứ hai rơi nhầm xuống lá bên dưới.
- **status:** live
- **derived_from:** `docs/01-product/journeys.md:50` (US-03, bước 1–2) ·
  `docs/02-requirements/scope.md:23` (FR-14) · `docs/02-requirements/scope.md:14` (FR-05) ·
  `README.md:21`

## RR-05 · Chơi bằng bàn phím, không đụng chuột

- **id:** RR-05
- **name:** Chơi bằng bàn phím, không đụng chuột
- **actor:** Người chơi không dùng được chuột hay cảm ứng, điều khiển hoàn toàn bằng bàn phím
- **entry:** `http://localhost:3000/` (desktop 1440px)
- **done_when:** Một lá bài đã đổi chỗ mà người chơi chưa hề chạm vào chuột, và trong
  suốt quá trình họ luôn nhìn thấy mình đang đứng ở đâu trên bàn bài.
- **min_steps:** 2 — đi tới lá rồi ra lệnh tự tìm chỗ (đường thủ công: 4)
- **why_red:** `NFR-A11Y-02` hứa **mọi** nước đi làm được bằng bàn phím và focus luôn
  thấy được. Bàn bài là một tầng lá phẳng đổi vị trí liên tục, nên đây là lời hứa dễ vỡ
  nhất trong cả sản phẩm — và là lời hứa không ai phát hiện ra là đã vỡ nếu chỉ test bằng
  chuột.
- **status:** live
- **derived_from:** `docs/02-requirements/scope.md:21` (FR-12) ·
  `docs/02-requirements/nfr.md:40` (NFR-A11Y-02) · `README.md:17`

## RR-06 · Kéo thả bằng chuột như mọi Solitaire khác

- **id:** RR-06
- **name:** Kéo thả bằng chuột như mọi Solitaire khác
- **actor:** Người chơi desktop, phản xạ hai mươi năm là bấm giữ rồi kéo
- **entry:** `http://localhost:3000/` (desktop 1440px)
- **done_when:** Một lá đáp xuống chồng người chơi nhắm tới sau khi nhả chuột; và một cú
  kéo hỏng — thả giữa khoảng trống, hoặc nhả ra ngoài cửa sổ — trả lá về chỗ cũ chứ không
  để người chơi kẹt giữa một cử chỉ dở dang.
- **min_steps:** 1 — một cử chỉ kéo-thả
- **why_red:** Nhóm người dùng phụ vào trang với đúng một phản xạ này. Kéo không ăn, hoặc
  kéo xong kẹt, là kết luận "game hỏng" chứ không phải "mình làm sai" — và `NFR-REL-03`
  cấm đúng trạng thái kẹt đó.
- **status:** live
- **derived_from:** `docs/01-product/journeys.md:30` (US-02) ·
  `docs/02-requirements/scope.md:13` (FR-04) · `docs/02-requirements/nfr.md:59` (NFR-REL-03)

## RR-07 · Chơi lại đúng ván vừa rồi, và rủ người khác chơi cùng ván

- **id:** RR-07
- **name:** Chơi lại đúng ván vừa rồi, và rủ người khác chơi cùng ván
- **actor:** Người chơi vừa thua một ván hay và muốn thử lại chính thế bài đó
- **entry:** `http://localhost:3000/`
- **done_when:** Bàn bài trở về đầu ván với **cùng** số hiệu ván đang hiện trên màn hình;
  và người chơi nói được ra làm thế nào để mở lại đúng ván này ở một lần khác.
- **min_steps:** 1 — chạm nút chơi lại
- **why_red:** "Mỗi ván sinh từ một seed nên chơi lại được đúng ván đó" là điểm khác biệt
  duy nhất của sản phẩm, nằm ngay trên dòng tiêu đề README. Nếu người chơi nhìn thấy
  `Ván số 12345` mà không hiểu nó để làm gì, thì tính năng phân biệt sản phẩm này với mọi
  Solitaire khác trên web là **vô hình** — và đó là một phát hiện UX, không phải lỗi code.
- **status:** live
- **derived_from:** `docs/01-product/journeys.md:91` (US-05) ·
  `docs/02-requirements/scope.md:18` (FR-09) · `docs/02-requirements/scope.md:22` (FR-13) ·
  `README.md:1`

## RR-08 · Đổi sang rút 3 lá mà không mất ván đang chơi

- **id:** RR-08
- **name:** Đổi sang rút 3 lá mà không mất ván đang chơi
- **actor:** Người chơi quen luật rút 3, vào thấy đang ở rút 1
- **entry:** `http://localhost:3000/`
- **done_when:** Chồng úp lật ra ba lá một lần thay vì một; và trước khi ván đang chơi
  bị bỏ, người chơi được hỏi bằng câu họ hiểu và **chọn giữ ván được** nếu đổi ý.
- **min_steps:** 2 — chọn chế độ, xác nhận
- **why_red:** Đây là chỗ **duy nhất** trong toàn sản phẩm người chơi có thể mất việc
  đang làm, và cũng là hộp thoại xác nhận duy nhất. Một sản phẩm không lưu gì, không có
  tài khoản thì cả gánh nặng "đừng làm mất công của người ta" dồn hết vào một màn hình này.
- **status:** live
- **derived_from:** `docs/01-product/journeys.md:91` (US-05, mục "Đổi chế độ rút giữa ván") ·
  `docs/02-requirements/scope.md:19` (FR-10)

---

## Loại khỏi lượt chạy

## RR-09 · Kết thúc ván và nhận màn mừng thắng

- **id:** RR-09
- **name:** Kết thúc ván và nhận màn mừng thắng
- **actor:** Người chơi đã lật hết bài, còn mỗi việc bê bài lên bốn chồng đích
- **entry:** `http://localhost:3000/?van=2`
- **done_when:** Màn mừng thắng hiện ra sau khi lá cuối cùng lên chồng đích.
- **min_steps:** 1 — chạm nút hoàn tất, tính từ lúc bàn không còn lá úp
- **why_red:** Đây là phần thưởng duy nhất sản phẩm có. Ba Non-Goal (không điểm, không
  đồng hồ, không thống kê) dồn toàn bộ cảm giác hoàn thành vào đúng một màn hình này.
- **status:** excluded
- **why_excluded:** Không có đường nào vào trạng thái "hết lá úp" ngoài việc chơi thật.
  Ván thắng đã đo được của project dài **573 nước** (`docs/04-state/backlog.md` §Đang làm,
  chạy trong `e2e/win.spec.ts`), gấp hơn mười bốn lần trần 40 hành động của một phiên
  persona. Persona sẽ hết kiên nhẫn từ lâu trước khi nút hoàn tất bật lên, và báo cáo sẽ
  nói về sức bền của persona chứ không nói gì về màn mừng thắng. **`win.spec.ts` đã phủ
  chặng này** — đó là phép đo đúng cho nó. Mở lại khi nào có cách nạp thẳng một thế bài
  gần thắng.
- **derived_from:** `docs/01-product/journeys.md:50` (US-03, bước 3–4) ·
  `docs/02-requirements/scope.md:15` (FR-06) · `docs/02-requirements/scope.md:17` (FR-08) ·
  `docs/04-state/backlog.md` (§Đang làm)

---

## Không phải Red Route

Ghi lại để lần sau không ai phải hỏi lại vì sao chúng vắng mặt:

- **Bàn bài co giãn từ 320px (FR-11)** — là **điều kiện** áp cho mọi phiên chạy trên
  điện thoại, không phải một hành trình có đích. Đặt viewport của persona điện thoại ở
  320/375px là đã đo nó ở mọi route rồi.
- **Đăng nhập, đăng ký, thanh toán, onboarding, thông báo** — không tồn tại và sẽ không
  tồn tại (`docs/01-product/overview.md` §4). Persona nào đi tìm chúng là persona viết sai.
