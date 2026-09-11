# Kế hoạch · Sửa phản hồi UX lượt 2026-09-12

Thiết kế: [`design.md`](design.md) · Báo cáo: [`../../ux-reviews/2026-09-12-duck-solitaire.md`](../../ux-reviews/2026-09-12-duck-solitaire.md)

Thứ tự chọn theo **rủi ro tăng dần**: token và chuỗi trước (không đụng logic), rồi tới
component, cuối cùng mới tới máy trạng thái bàn phím.

## Nhóm A — hệ thống thiết kế và tài liệu ngưỡng

- [x] **A1** `MASTER.md` §1: khai `--shadow-lift` (`0 6px 14px rgb(0 0 0 / 0.45)`) và ghi rõ
      vành hai lớp cho **lá đang chọn**, song song với vành tiêu điểm đã có.
- [x] **A2** `globals.css`: thêm `--ring-selected: #ffd166` và `--shadow-lift`; thêm lớp
      `.card-selected`. Chép từ A1, không bịa giá trị.
- [x] **A3** `nfr.md`: thêm `NFR-A11Y-06` (chỉ báo trạng thái ≥3:1 **và** có kênh không phụ
      thuộc chuyển động).

## Nhóm B — lá bài và chồng bài

- [x] **B1** `CardView`: đổi bóng đổ inline sang `var(--shadow-lift)`, thêm lớp
      `.card-selected` khi `selected`. **Test trước:** lá đang chọn mang lớp đó; lá thường thì không.
- [x] **B2** `PileSlot`: thêm prop cho biết đây là chồng rút đã cạn; vẽ icon vòng lại trong
      khung rỗng. **Test trước:** chồng rút cạn có icon, chồng đích rỗng thì không.
- [x] **B3** `Home`: truyền cờ đó xuống, và đổi nhãn chồng rút sang `strings.pile.stockEmpty`
      khi cạn. **Test trước:** nhãn đổi đúng lúc.

## Nhóm C — header

- [x] **C1** `strings.ts`: thêm `strings.tagline` (không thu thập gì). Mọi chuỗi hiển thị vẫn
      ở một chỗ — `NFR-I18N-01`.
- [x] **C2** `Home`: viết lại header — tên sản phẩm · số hiệu ván (lớn hơn, `--fg-default`) ·
      `seed.hint` **hiện rõ** thay vì nằm trong `title` · tagline.
      **Test trước:** cả ba chuỗi có mặt trong DOM và không còn thuộc tính `title`.

## Nhóm D — bàn phím và phản hồi

- [x] **D1** `Home`: vùng `role="status"` `aria-live="polite"` `sr-only`, xướng
      `strings.a11y.moveRejected` mỗi lần từ chối. Cần khoá đổi mỗi lần để hai lần từ chối
      liên tiếp vẫn được xướng lại. **Test trước:** sau một nước bị từ chối, vùng đó có chữ.
- [x] **D2** `globals.css` + `Home`: hướng dẫn phím hiện ra khi vùng bàn bài có
      `:has(:focus-visible)`; bản hiện ra mang `aria-hidden="true"`.
- [x] **D3** `Home` `autoMoveFrom`: sau khi `playMove` thành công, dịch `focus` tới ô của
      `move.to`. **Test trước:** Enter đưa lá lên chồng đích thì `tabIndex=0` chuyển sang chồng đích.
- [x] **D4** Hộp thoại đổi chế độ rút: `Escape` đóng · tiêu điểm vào nút "Giữ ván hiện tại"
      khi mở · trả tiêu điểm về ô chọn khi đóng. **Test trước:** Escape đóng hộp thoại và
      **không** đổi chế độ rút.

## Nhóm E — icon

- [x] **E1** `src/app/icon.svg` dùng đúng màu đã có (`#4A90D9` trên `#0B3D2E`).
- [x] **E2** Kiểm bằng `yarn build` rằng `out/` có icon và HTML tham chiếu nó kèm `basePath`.

## Nhóm F — kiểm và chốt

- [x] **F1** `yarn test` · `yarn typecheck` · `yarn lint` — tất cả xanh.
- [x] **F2** `yarn build` rồi `yarn check:bundle` — vẫn dưới trần 150KB của `NFR-PERF-05`.
- [x] **F3** `yarn test:e2e` — 141 test ở 320/375/768/1440 vẫn xanh. Nhóm D là nhóm dễ làm
      đỏ nhất; nếu đỏ thì đọc kỹ trước khi sửa test, vì test có thể đang đúng.
- [x] **F4** Chạy app thật và **nhìn tận mắt** ở 375 và 1440: vành chọn, icon chồng rút cạn,
      header mới, hướng dẫn phím hiện khi Tab. Kèm ảnh chụp.
- [x] **F5** `README.md` §Features: một gạch đầu dòng tiếng Anh cho phần người dùng thấy được.
- [x] **F6** `backlog.md`: ghi F-08, hiệu ứng từ chối bằng mắt, bẫy Tab, và phiên mù trên
      điện thoại vào §Nợ kỹ thuật — kèm lý do hoãn, không ghi chung chung.

## Không nằm trong kế hoạch này

F-08 (thang chữ 320–767px) · tăng cường hiệu ứng từ chối bằng mắt · bẫy Tab đầy đủ ·
nút chia sẻ. Lý do từng cái ở `design.md` §4.

## Kết quả chạy kiểm (F1–F3)

| Kiểm | Kết quả |
| --- | --- |
| `yarn test` | 249 xanh (trước: 238) |
| `yarn typecheck` · `yarn lint` | sạch |
| `yarn test:e2e` | **177 xanh** ở 320/375/768/1440 (trước: 141), 3 skipped |
| `yarn check:bundle` | 112.3 kB / 150 kB — `NFR-PERF-05` còn dư |

**F3 làm đỏ hai lần, và cả hai lần test là bên đúng:**

1. `ArrowUp` khi đang cầm bài **đổi độ sâu dãy cầm**, không di chuyển con trỏ (đúng như
   bảng Controls trong README). Kịch bản test ban đầu của tôi sai, không phải code sai.
2. Đường chạm để gây ra nước đi bị từ chối **chỉ chạy ở 768/1440**, ở 320/375 thì không
   có gì xảy ra cả. Đổi test sang đường bàn phím (độc lập khổ màn hình) và **ghi phát
   hiện mới vào `backlog.md` §Việc tiếp theo, ưu tiên cao** — không sửa mò.
