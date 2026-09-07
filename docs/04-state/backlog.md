# Đang làm · Việc tiếp theo · Nợ

> **Trả lời:** Đang làm gì, tiếp theo làm gì, và đang nợ những gì?
> **Trạng thái:** 🟢 đủ
> **Cập nhật:** 2026-09-04 · commit —
> **Cập nhật khi:** bắt đầu/kết thúc một việc · brainstorm ra việc mới · cố ý đi đường tắt

## Đang làm

Không có việc nào đang dở. `v1.0.0` đã phát hành và đang chạy tại
https://levananhduc.github.io/web-game-solitaire/

Trạng thái đo được ngày 2026-09-07:

- FR-01 → FR-13 đều `xong`; 208 test Vitest, 85 test Playwright ở 320/375/768/1440.
- `ci.yml` xanh cả ba job trên PR #1; `deploy.yml` và `release.yml` xanh trên `main`.
- First-load JS 110KB (trần NFR-PERF-05 là 150KB).
- Kiểm bản deploy thật bằng trình duyệt: chia đủ 7 cột 1..7, rút bài được, không cuộn
  ngang ở 375, console và network sạch.
- Dependabot alert + automated security fixes đã bật; 0 alert đang mở.

## Việc tiếp theo

| Việc | Liên quan | Ưu tiên | Vì sao ưu tiên đó |
| --- | --- | --- | --- |
| E2E chơi hết một ván **bằng kéo thả** | FR-04 | trung bình | Hiện kéo thả chỉ được kiểm ở mức một nước. Hai lối vào phải cho cùng kết quả, và đó đúng là thứ dễ trôi ra khỏi nhau |
| Đo NFR-PERF-02 trên máy thật, có throttle CPU 4× | NFR-PERF-02 | trung bình | Ngưỡng 100ms mỗi nước là ngưỡng duy nhất trong `nfr.md` chưa có số đo |
| Xem lại `--overlap-up` ở 320px | FR-11 | thấp | Lá bài rộng ~41px, dải nhìn thấy của lá bị che còn 18px — chơi được nhưng chật |
| Cân nhắc `.github/dependabot.yml` cho cập nhật dependency định kỳ | NFR-SEC-05 | thấp | Alert hiện chỉ báo lỗ hổng; cập nhật thường kỳ là chuyện khác. Đổi lại là PR nhiễu hằng tuần cho một dự án bốn dependency |

## Nợ kỹ thuật — cố ý làm tạm

| Chỗ nào | Đã đánh đổi gì | Vì sao chấp nhận | Khi nào buộc phải trả |
| --- | --- | --- | --- |
| nhánh `feat/klondike` trong chính repo, không dùng git worktree | `feature-flow` §3 yêu cầu worktree tách khỏi `main` | Lúc bắt đầu repo chưa có `origin`, và một worktree riêng buộc phải cài lại `node_modules` lần hai cho một dự án chưa có dòng code nào | Ở feature thứ hai, hoặc ngay khi có hai nhánh chạy song song |
| chưa có mockup trên canvas Claude Design | `feature-flow` §1 bước 2 yêu cầu ba artboard mỗi màn hình | Người dùng yêu cầu chạy một mạch không dừng ở cổng duyệt nào; canvas chỉ có nghĩa khi có người xem và duyệt. Bù lại: wireframe ASCII trong `design.md` §3, token đo tương phản thật trong `MASTER.md`, và ảnh chụp app thật ở 320/375/768/1440 | Trước feature UI tiếp theo, hoặc khi bố cục đổi lớn |
| `scripts/find-winnable.ts` tìm được lời giải nhưng rất chậm | Tìm kiếm DFS thuần với bảng chuyển vị, không có heuristic mạnh | Nó chỉ cần chạy một lần để sinh fixture, và fixture đã được commit. Không nằm trên đường CI | Khi cần thêm ván mẫu thứ hai, hoặc khi luật/PRNG đổi làm fixture cũ hết đúng |
| `e2e/fixtures/winnable.json` gắn chặt với thuật toán chia bài | Đổi `mulberry32`, thứ tự `createDeck`, hay cách xáo là fixture trỏ sang ván khác và `win.spec.ts` đỏ | Đây là tính chất mong muốn: cùng seed phải cho cùng ván (ADR-0001), nên fixture đỏ chính là cảnh báo đúng | Khi nào thật sự đổi cách chia bài — lúc đó sinh lại fixture |
