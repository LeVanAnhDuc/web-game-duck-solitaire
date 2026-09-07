# ADR-0008 · Kiểm lỗ hổng dependency bằng Dependabot alert, không bằng `yarn audit`

> **Ngày:** 2026-09-04
> **Trạng thái:** accepted
> **Liên quan:** NFR-SEC-05 · ADR-0004 · ADR-0007

## 1. Bối cảnh

NFR-SEC-05 nói "dependency không có lỗ hổng mức high trở lên", và ADR-0007 dựng cổng chặn cho nó bằng `yarn audit --json` cộng một script lọc theo mức — đúng theo cách `web-game-minesweeper` làm.

Lần chạy CI đầu tiên cho thấy nó không dùng được: `registry.yarnpkg.com/-/npm/v1/security/audits` trả `ESOCKETTIMEDOUT`, cả trên GitHub runner lẫn ở máy. Kiểm lại log CI của minesweeper thì **mọi lần chạy của nó cũng đều timeout**, và script bản gốc in `no high or critical advisory (0 total)` rồi thoát 0. Nói cách khác: bước "Dependency audit" ở cả hai dự án chưa bao giờ thật sự chạy, và ở minesweeper nó vẫn đang báo xanh.

Yarn 1 không còn được bảo trì và endpoint audit của nó cũng vậy. `yarn npm audit` chỉ có ở Yarn Berry. `npm audit` cần `package-lock.json`, mà dự án dùng `yarn.lock` (ADR-0004) — dựng lockfile npm tạm thời cũng thất bại khi thử.

## 2. Quyết định

Đọc **Dependabot alert của repo** qua `gh api repos/<repo>/dependabot/alerts?state=open`, chặn khi có alert mức high hoặc critical. Script `scripts/check-audit.mjs` được viết lại theo nguồn này; nó chạy được ở máy bằng `gh` đã đăng nhập, và trong CI bằng `GITHUB_TOKEN` với quyền `security-events: read`. **Không query được thì đỏ**, không im lặng cho qua.

Alert chỉ xuất hiện sau khi GitHub quét một lockfile đã push, nên nó không bắt được một dependency có lỗ hổng do chính nhánh này vừa thêm vào. Khoảng trống đó được `actions/dependency-review-action` bịt lại: nó soi phần dependency thay đổi của pull request, `fail-on-severity: high`.

Đã bật trên repo: Dependabot alert và automated security fixes.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Giữ `yarn audit` (cách minesweeper) | Endpoint chết. Giữ nó nghĩa là giữ một bước CI trang trí, hoặc một build đỏ vĩnh viễn |
| Thêm retry cho `yarn audit` | Retry một endpoint không còn trả lời chỉ làm build chậm hơn trước khi đỏ |
| Dựng `package-lock.json` tạm rồi `npm audit` | Kết quả phân giải từ `package.json`, không phải từ `yarn.lock` đang thật sự cài — đo sai thứ. Và `npm install --package-lock-only` thất bại khi thử |
| Chỉ dựa vào Dependabot alert, bỏ hẳn bước CI | Alert là thông báo, không phải cổng chặn. NFR-SEC-05 muốn một cổng |
| Chỉ dùng `dependency-review-action` | Nó chỉ soi phần **thay đổi** của một PR. Một lỗ hổng mới công bố trên dependency đã có từ trước sẽ không bao giờ đi qua nó |
| `osv-scanner` | Nguồn dữ liệu tốt, nhưng thêm một binary phải cài trong CI cho một dự án có bốn dependency lúc chạy |

## 4. Hệ quả

**Được:**
- Cổng thật sự chạy, và dữ liệu đến từ chính `yarn.lock` đã commit — tức là từ thứ đang được cài, không phải từ một bản phân giải khác.
- Hai cửa sổ thời gian được che kín: dependency mới thêm (ở PR) và lỗ hổng mới công bố trên dependency cũ (alert).
- Vẫn chạy được ở máy, đúng nguyên tắc của ADR-0007.
- Không query được là đỏ. Đây là điểm cả hai bản trước đều làm sai.

**Mất / phải chấp nhận:**
- Cổng phụ thuộc vào GitHub: cần Dependabot alert bật, cần quyền `security-events: read`, và cần `gh` khi chạy ở máy. Một dự án rời khỏi GitHub sẽ phải làm lại bước này.
- Có độ trễ: alert xuất hiện sau khi GitHub quét lockfile vừa push, không phải ngay lúc `yarn add`.
- Hai cơ chế thay vì một. Chấp nhận vì chúng che hai khoảng trống khác nhau, không phải hai bản của cùng một việc.
- `web-game-minesweeper` vẫn đang có một cổng audit báo xanh giả. Nằm ngoài phạm vi dự án này; ghi lại ở đây để lần sau ai đọc còn biết.

**Điều kiện xem lại quyết định này:** khi dự án chuyển sang Yarn Berry (`yarn npm audit` dùng registry npm và hoạt động), hoặc khi rời GitHub.
