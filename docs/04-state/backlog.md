# Đang làm · Việc tiếp theo · Nợ

> **Trả lời:** Đang làm gì, tiếp theo làm gì, và đang nợ những gì?
> **Trạng thái:** 🟢 đủ
> **Cập nhật:** 2026-09-04 · commit —
> **Cập nhật khi:** bắt đầu/kết thúc một việc · brainstorm ra việc mới · cố ý đi đường tắt

## Đang làm

**Đổi thương hiệu sang `Duck Solitaire`** (2026-09-08). Repo GitHub đổi từ
`web-game-solitaire` thành `web-game-duck-solitaire`; GitHub redirect URL *repo* cũ
nhưng **không** redirect đường dẫn Pages cũ, nên link chơi ở dưới chỉ sống sau lần
deploy tới. **Thư mục local vẫn là** `web-game-solitaire` — thương hiệu đổi, đường dẫn
không. Từ "Klondike" giữ nguyên ở mọi chỗ nói về *thể loại và luật*; chỉ tên sản phẩm đổi.

Không có việc nào đang dở. `v1.0.2` đang chạy tại
https://levananhduc.github.io/web-game-duck-solitaire/ ; feature `board-motion` xong trên
nhánh `feat/board-motion`, chưa merge.

Trạng thái đo được ngày 2026-09-07:

- FR-01 → FR-14 đều `xong`. 238 test Vitest, 141 test Playwright ở 320/375/768/1440.
- Bàn bài đổi sang **một tầng lá phẳng** (ADR-0009): lá bay giữa các chồng, lật bài,
  chia bài đầu ván, và **một chạm đưa lá lên chồng đích** (FR-14).
- First-load JS 111.7KB (trần NFR-PERF-05 là 150KB).
- `win.spec.ts` chơi trọn ván 573 nước **bằng kéo thả** — trả nốt món nợ E2E kéo thả.

## Việc tiếp theo

| Việc | Liên quan | Ưu tiên | Vì sao ưu tiên đó |
| --- | --- | --- | --- |
| Đo NFR-PERF-02 trên máy thật, có throttle CPU 4× | NFR-PERF-02 | cao | Ngưỡng 100ms mỗi nước là ngưỡng duy nhất trong `nfr.md` chưa có số đo, và giờ mỗi nước có kèm chuyển động của 52 phần tử |
| Xem lại `--overlap-up` ở 320px | FR-11 | thấp | Lá rộng 40px, dải nhìn thấy của lá bị che còn 18px — chơi được nhưng chật |
| Cân nhắc `.github/dependabot.yml` cho cập nhật dependency định kỳ | NFR-SEC-05 | thấp | Alert hiện chỉ báo lỗ hổng; cập nhật thường kỳ là chuyện khác. Đổi lại là PR nhiễu hằng tuần cho một dự án bốn dependency |

## Nợ kỹ thuật — cố ý làm tạm

| Chỗ nào | Đã đánh đổi gì | Vì sao chấp nhận | Khi nào buộc phải trả |
| --- | --- | --- | --- |
| nhánh `feat/klondike` trong chính repo, không dùng git worktree | `feature-flow` §3 yêu cầu worktree tách khỏi `main` | Lúc bắt đầu repo chưa có `origin`, và một worktree riêng buộc phải cài lại `node_modules` lần hai cho một dự án chưa có dòng code nào | Ở feature thứ hai, hoặc ngay khi có hai nhánh chạy song song |
| `e2e/fixtures.ts` tự gọi `page.emulateMedia` thay vì dùng `use: { reducedMotion }` | Một cơ chế riêng thay cho tuỳ chọn có sẵn của Playwright | Tuỳ chọn đó **không có tác dụng** ở đây (đã kiểm cả cấp config lẫn cấp project trên 1.62.1: `matchMedia` vẫn báo không có preference). Một dòng cấu hình im lặng không làm gì còn tệ hơn là không có | Khi nâng Playwright và tuỳ chọn đó chạy thật |
| chưa có mockup trên canvas Claude Design | `feature-flow` §1 bước 2 yêu cầu ba artboard mỗi màn hình | Người dùng yêu cầu chạy một mạch không dừng ở cổng duyệt nào; canvas chỉ có nghĩa khi có người xem và duyệt. Bù lại: wireframe ASCII trong `design.md` §3, token đo tương phản thật trong `MASTER.md`, và ảnh chụp app thật ở 320/375/768/1440 | Trước feature UI tiếp theo, hoặc khi bố cục đổi lớn |
| `scripts/find-winnable.ts` tìm được lời giải nhưng rất chậm | Tìm kiếm DFS thuần với bảng chuyển vị, không có heuristic mạnh | Nó chỉ cần chạy một lần để sinh fixture, và fixture đã được commit. Không nằm trên đường CI | Khi cần thêm ván mẫu thứ hai, hoặc khi luật/PRNG đổi làm fixture cũ hết đúng |
| `v1.0.1` chỉ chứa một lần sửa `backlog.md` | Một phiên bản không mang thay đổi nào cho người dùng | `next-version.sh` lúc đó chỉ đọc subject của HEAD, mà merge commit của GitHub có subject riêng, nên `[skip release]` không tới được script. Lỗi đã sửa; tag thì để nguyên — xoá một tag đã publish rủi ro hơn là để lại một bản patch vô hại | Không phải trả. Ghi lại để lần sau không ai phải đoán `v1.0.1` là gì |
| `e2e/fixtures/winnable.json` gắn chặt với thuật toán chia bài | Đổi `mulberry32`, thứ tự `createDeck`, hay cách xáo là fixture trỏ sang ván khác và `win.spec.ts` đỏ | Đây là tính chất mong muốn: cùng seed phải cho cùng ván (ADR-0001), nên fixture đỏ chính là cảnh báo đúng | Khi nào thật sự đổi cách chia bài — lúc đó sinh lại fixture |
