# Đang làm · Việc tiếp theo · Nợ

> **Trả lời:** Đang làm gì, tiếp theo làm gì, và đang nợ những gì?
> **Trạng thái:** 🟢 đủ
> **Cập nhật:** 2026-09-12 · commit —
> **Cập nhật khi:** bắt đầu/kết thúc một việc · brainstorm ra việc mới · cố ý đi đường tắt

## Đang làm

**Đổi thương hiệu sang `Duck Solitaire`** (2026-09-08). Repo GitHub đổi từ
`web-game-solitaire` thành `web-game-duck-solitaire`; GitHub redirect URL *repo* cũ
nhưng **không** redirect đường dẫn Pages cũ, nên link chơi ở dưới chỉ sống sau lần
deploy tới. **Thư mục local vẫn là** `web-game-solitaire` — thương hiệu đổi, đường dẫn
không. Từ "Klondike" giữ nguyên ở mọi chỗ nói về *thể loại và luật*; chỉ tên sản phẩm đổi.

**Đã cài skill `ux-persona-review` và chạy lượt đầu** (2026-09-12). Sinh từ máy phát
`<workspace>/.claude/skills/ux-persona-lab`, chạy đủ 6 bước; `red-routes.md` đã qua cổng
duyệt thủ công. Lượt chạy đầu tiên: **8/10 phiên** trên bản deploy (ADR-0011), 10 phát hiện,
báo cáo ở [`docs/ux-reviews/2026-09-12-duck-solitaire.md`](../ux-reviews/2026-09-12-duck-solitaire.md).
9/10 phát hiện đã sửa trên nhánh `fix/ux-feedback-2026-09`.

Ba thứ cố định, sửa là mất khả năng so sánh giữa các lần chạy:

- `references/red-routes.md` — 8 route `live` (RR-01…RR-08), 1 route `excluded` (RR-09).
- `references/personas/` — 6 persona cố định, 10 phiên (8 route + 2 phiên mù).
- Ghép persona ↔ route chốt ở `references/personas/README.md`.

Ba chỗ project này lệch khỏi mặc định của máy phát, đã ghi trong `SKILL.md` của skill con:

- Thêm giá trị `status: excluded` — cho route đã làm xong nhưng dài hơn trần 40 hành động
  của một phiên persona. Hiện chỉ RR-09 (màn mừng thắng): ván thắng đo được dài 573 nước,
  `e2e/win.spec.ts` mới là phép đo đúng cho chặng đó.
- Token thiết kế lấy ở `docs/design-system/solitaire/MASTER.md`, không phải `.claude/uiux/`
  như `lib/orchestration.md` giả định (thư mục đó không tồn tại ở project này).
- `.gitignore` thêm `!/.claude/agents/` — `/.claude/*` đang nuốt hai file agent, clone mới
  sẽ không có chúng và skill gãy ngay lần chạy đầu.

`v1.2.4` đang chạy tại https://levananhduc.github.io/web-game-duck-solitaire/ và trỏ đúng
commit của `main` — đó là điều kiện ADR-0011 đòi trước mỗi lượt persona.

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
| Xem lại `--overlap-up` **và thang chữ** ở dải 320–767px | FR-11 · F-08 | trung bình | Lá rộng 40px, dải nhìn thấy của lá bị che còn 18px. Lượt persona cộng thêm lý do: 3/6 người kêu chữ nhỏ, hai trong ba là persona tiếp cận. Hai việc này **cùng một lượt thiết kế** — đổi cỡ chữ mà không đổi bố cục lá là vô nghĩa. ⚠️ Lượt 2026-09-12 **không đo được** phần vùng chạm: mọi lần persona "bấm hụt" đều là nhiễu công cụ (DC-9), không dùng làm dẫn chứng |
| **Cầm bài rồi chạm chồng rút ở 320/375px: không có gì xảy ra** | NFR-REL-03 | **cao** | Tìm ra khi viết test cho F-02. Ở 1440 và 768 thì cú chạm bị từ chối đúng cách; ở 320/375 nó **không đổi bàn bài mà cũng không bỏ lựa chọn** — đúng trạng thái kẹt `NFR-REL-03` cấm. Tái hiện: `Tab` · `Space` · chạm lá trên cùng chồng rút; ở khổ hẹp, cú click không tới được `onCardClick` của lá nào cả. Chưa rõ cơ chế, **chưa sửa** — đoán mò ở chỗ này tệ hơn là để nguyên. Đường chạm-để-đi bình thường vẫn chạy đúng ở mọi khổ (177 test e2e xanh) |
| Chạy phiên mù trên điện thoại (`p29`) | — | trung bình | Lượt 2026-09-12 bỏ phiên này, nên góc nhìn "người lạ hoàn toàn, trên thiết bị chính, **không được giao việc**" chưa được đo. F-03 và F-04 là hai chỗ nhiều khả năng còn đào thêm được |
| Cân nhắc `.github/dependabot.yml` cho cập nhật dependency định kỳ | NFR-SEC-05 | thấp | Alert hiện chỉ báo lỗ hổng; cập nhật thường kỳ là chuyện khác. Đổi lại là PR nhiễu hằng tuần cho một dự án bốn dependency |

## Nợ kỹ thuật — cố ý làm tạm

| Chỗ nào | Đã đánh đổi gì | Vì sao chấp nhận | Khi nào buộc phải trả |
| --- | --- | --- | --- |
| Hiệu ứng từ chối bằng mắt vẫn như cũ | `ux-expert` nói hiệu ứng hiện tại "rõ ràng chưa đủ" với 2 persona; lượt sửa 2026-09-12 chỉ thêm kênh `aria-live` | Mọi phương án tăng cường đều là quyết định thị giác mới (giữ vành đỏ lâu hơn? đổi màu? thêm chữ?), mà `NFR-A11Y-05` cấm dựa vào chuyển động. Kênh `aria-live` đóng được lỗ hổng **nặng nhất** ngay — người không nhìn thấy màn hình và người tắt chuyển động trước đó không nhận được gì cả | Lượt thiết kế tiếp theo chạm vào bàn bài, hoặc khi có persona vấp lần thứ ba |
| Hộp thoại đổi chế độ rút chưa bẫy Tab | `Escape` + đưa tiêu điểm vào trong đã có; Tab vẫn đi ra sau lớp phủ được | **Chưa persona nào thử hộp thoại này bằng bàn phím** — Thuỷ không chạy RR-08 — nên mức nghiêm trọng thật chưa đo được. Làm phần chắc chắn đúng trước, đợi số đo rồi làm phần còn lại | Sau khi chạy RR-08 với persona bàn phím |
| nhánh `feat/klondike` trong chính repo, không dùng git worktree | `feature-flow` §3 yêu cầu worktree tách khỏi `main` | Lúc bắt đầu repo chưa có `origin`, và một worktree riêng buộc phải cài lại `node_modules` lần hai cho một dự án chưa có dòng code nào | Ở feature thứ hai, hoặc ngay khi có hai nhánh chạy song song |
| `e2e/fixtures.ts` tự gọi `page.emulateMedia` thay vì dùng `use: { reducedMotion }` | Một cơ chế riêng thay cho tuỳ chọn có sẵn của Playwright | Tuỳ chọn đó **không có tác dụng** ở đây (đã kiểm cả cấp config lẫn cấp project trên 1.62.1: `matchMedia` vẫn báo không có preference). Một dòng cấu hình im lặng không làm gì còn tệ hơn là không có | Khi nâng Playwright và tuỳ chọn đó chạy thật |
| chưa có mockup trên canvas Claude Design | `feature-flow` §1 bước 2 yêu cầu ba artboard mỗi màn hình | Người dùng yêu cầu chạy một mạch không dừng ở cổng duyệt nào; canvas chỉ có nghĩa khi có người xem và duyệt. Bù lại: wireframe ASCII trong `design.md` §3, token đo tương phản thật trong `MASTER.md`, và ảnh chụp app thật ở 320/375/768/1440 | Trước feature UI tiếp theo, hoặc khi bố cục đổi lớn |
| `scripts/find-winnable.ts` tìm được lời giải nhưng rất chậm | Tìm kiếm DFS thuần với bảng chuyển vị, không có heuristic mạnh | Nó chỉ cần chạy một lần để sinh fixture, và fixture đã được commit. Không nằm trên đường CI | Khi cần thêm ván mẫu thứ hai, hoặc khi luật/PRNG đổi làm fixture cũ hết đúng |
| `v1.0.1` chỉ chứa một lần sửa `backlog.md` | Một phiên bản không mang thay đổi nào cho người dùng | `next-version.sh` lúc đó chỉ đọc subject của HEAD, mà merge commit của GitHub có subject riêng, nên `[skip release]` không tới được script. Lỗi đã sửa; tag thì để nguyên — xoá một tag đã publish rủi ro hơn là để lại một bản patch vô hại | Không phải trả. Ghi lại để lần sau không ai phải đoán `v1.0.1` là gì |
| `e2e/fixtures/winnable.json` gắn chặt với thuật toán chia bài | Đổi `mulberry32`, thứ tự `createDeck`, hay cách xáo là fixture trỏ sang ván khác và `win.spec.ts` đỏ | Đây là tính chất mong muốn: cùng seed phải cho cùng ván (ADR-0001), nên fixture đỏ chính là cảnh báo đúng | Khi nào thật sự đổi cách chia bài — lúc đó sinh lại fixture |
