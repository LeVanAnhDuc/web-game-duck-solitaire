# ADR-0009 · Một tầng lá phẳng, thay cho việc mỗi chồng sở hữu lá của nó

> **Ngày:** 2026-09-07
> **Trạng thái:** accepted
> **Liên quan:** FR-04 · FR-05 · FR-08 · FR-14 · NFR-PERF-02 · NFR-A11Y-04 · NFR-A11Y-05 · ADR-0003

## 1. Bối cảnh

Bản đầu đặt mỗi `CardView` làm con của `PileView` chứa nó. Hệ quả: lá đi từ cột 3 sang foundation là **unmount khỏi cây DOM này và mount vào cây kia**, nên CSS transition không có gì để nội suy. Bàn bài vì thế **không có chuyển động nào cả** — token `--dur-flip` được khai báo mà không chỗ nào dùng, và `transition: top/left` trên lá chỉ có tác dụng khi lá đổi chỗ trong cùng một chồng, chuyện gần như không xảy ra.

Yêu cầu là bài phải bay giữa các chồng. Không có cách nào làm việc đó mà giữ nguyên "chồng sở hữu lá".

## 2. Quyết định

Cả 52 lá render trong **một** container tuyệt đối (`BoardLayer`), theo **thứ tự bộ bài cố định**, và vị trí mỗi lá suy ra từ `GameState` thành biểu thức `calc()` (`lib/layout.ts`). `PileSlot` thay `PileView`: giữ vùng thả, nhãn, viền chồng rỗng, tiêu điểm bàn phím — và **không vẽ lá nào**.

Vì thứ tự DOM cố định, React không bao giờ chèn, xoá hay đổi chỗ một node trong suốt ván. Lá nào nằm trên lá nào do `z-index`. Lá dời chỗ bằng `transform: translate()`, không phải `top/left`.

Quan hệ "chồng chứa lá" trong cây trợ năng được dựng lại bằng `aria-owns` trên `PileSlot`.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| FLIP tại chỗ: lá vào chồng đích ngay rồi kéo ngược về bằng `transform` | Giữ được cây DOM và 85 test E2E, nhưng phải nuôi một lớp đo (`rect` trước mỗi commit) **và** trả giá mãi cho hai lỗi hình ảnh: lá bay từ cột 1 lên foundation bị các chồng nằm sau trong DOM vẽ đè, và `overflow-x: hidden` trên `body` là một vùng cắt |
| Clone bay trên overlay | Cùng ưu điểm như trên, nhưng **một lá tồn tại ở hai chỗ** trong lúc bay. Chia bài 28 lá và chuỗi Hoàn tất chạy đồng thời là đúng lúc loại máy móc đó sinh bug |
| Đo vị trí bằng JS rồi đặt `top/left` bằng pixel | Bỏ mất tính co giãn: phải nghe `resize`, và `layout.ts` hết test được mà không render |

## 4. Hệ quả

**Được:**
- Bài bay giữa các chồng là **hành vi mặc định**, không phải tính năng phải viết: cùng một node đổi toạ độ.
- "Lá bị cắt giữa đường thì bay tiếp từ chỗ đang hiển thị" cũng miễn phí — CSS transition khi đổi đích giữa đường nội suy tiếp từ giá trị hiện tại.
- Chia bài đầu ván, dãy bay so le, waste quét về stock: gần như không tốn code. Cái thứ ba **không tốn dòng nào** — toạ độ đổi thì chúng tự bay.
- Một tầng xếp lớp duy nhất, nên không còn chuyện lá bay bị chồng bên cạnh vẽ đè.
- `lib/layout.ts` thuần nên hình học test được mà không render gì (19 test).
- `src/game/` không bị chạm tới. Luật, `applyMove`, `history`, undo: không đổi một dòng.

**Mất / phải chấp nhận:**
- Lá không còn nằm trong `[data-pile]`, nên selector E2E đổi sang `[data-card][data-card-pile="…"]` và **thứ tự DOM không còn là thứ tự xếp lớp** — "lá cuối trong DOM" thôi nghĩa là "lá trên cùng", nên mỗi lá phải mang thêm `data-index`.
- Cây trợ năng phụ thuộc `aria-owns` được giữ đúng. Đây là sổ sách thật, và có test riêng canh.
- `BoardLayer` phải giữ **một mẩu state tạm**: lá nào vừa đổi chồng, để nâng `z` cho nó trong lúc bay. Đây là ngoại lệ duy nhất với "mọi thứ suy ra từ state hiện tại" — `z` của lá đang bay là hàm của state *trước đó*.
- Việc nâng `z` đó **buộc lá đang bay phải thôi nhận thao tác** (bất biến 13). Nếu không, trong 180ms sau mỗi nước nó che vùng của các lá khác trong cột và ăn cú bấm nhắm vào chúng. Lỗi này đã xảy ra thật và bị bộ E2E bắt được ở nước 432 của ván mẫu.

**Điều kiện xem lại quyết định này:** nếu bàn bài có lúc vượt vài trăm lá (một biến thể nhiều bộ bài), vì lúc đó việc render mọi lá kể cả lá không thấy sẽ phải cân lại.
