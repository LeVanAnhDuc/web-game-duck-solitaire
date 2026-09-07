# ADR-0008 · Kiểm lỗ hổng dependency bằng dependency review và Dependabot alert, không bằng `yarn audit`

> **Ngày:** 2026-09-04
> **Trạng thái:** accepted
> **Liên quan:** NFR-SEC-05 · ADR-0004 · ADR-0007

## 1. Bối cảnh

NFR-SEC-05 nói "dependency không có lỗ hổng mức high trở lên", và ADR-0007 dựng cổng chặn cho nó bằng `yarn audit --json` cộng một script lọc theo mức — đúng theo cách `web-game-minesweeper` làm.

Lần chạy CI đầu tiên cho thấy nó không dùng được: `registry.yarnpkg.com/-/npm/v1/security/audits` trả `ESOCKETTIMEDOUT`, cả trên GitHub runner lẫn ở máy. Kiểm lại log CI của minesweeper thì **mọi lần chạy của nó cũng đều timeout**, và script bản gốc in `no high or critical advisory (0 total)` rồi thoát 0. Nói cách khác: bước "Dependency audit" ở cả hai dự án chưa bao giờ thật sự chạy, và ở minesweeper nó vẫn đang báo xanh.

Yarn 1 không còn được bảo trì và endpoint audit của nó cũng vậy. `yarn npm audit` chỉ có ở Yarn Berry. `npm audit` cần `package-lock.json`, mà dự án dùng `yarn.lock` (ADR-0004) — dựng lockfile npm tạm thời cũng thất bại khi thử.

## 2. Quyết định

Cổng chặn trong CI là **`actions/dependency-review-action`** với `fail-on-severity: high`, chạy ở mỗi pull request. Nó soi phần dependency **thay đổi** của PR — đúng chỗ một dependency có lỗ hổng đi vào dự án.

Lỗ hổng mới công bố trên một dependency đã có từ trước thì không đi qua đường đó; nó đến dưới dạng **Dependabot alert** và PR sửa tự động, và PR đó lại chạy qua chính job trên. Cả alert lẫn automated security fixes đã được bật trên repo.

Kèm theo, `scripts/check-audit.mjs` đọc danh sách alert đang mở qua `gh api repos/<repo>/dependabot/alerts?state=open` và đỏ khi có mức high trở lên. Đây là **lệnh chạy ở máy** (`yarn check:audit`), không phải bước CI: `GITHUB_TOKEN` **không** đọc được Dependabot alert — trả 403 "Resource not accessible by integration" — nên đưa nó vào workflow thì phải phát sinh thêm một personal access token làm secret. Không query được thì script đỏ, không im lặng cho qua.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Giữ `yarn audit` (cách minesweeper) | Endpoint chết. Giữ nó nghĩa là giữ một bước CI trang trí, hoặc một build đỏ vĩnh viễn |
| Thêm retry cho `yarn audit` | Retry một endpoint không còn trả lời chỉ làm build chậm hơn trước khi đỏ |
| Dựng `package-lock.json` tạm rồi `npm audit` | Kết quả phân giải từ `package.json`, không phải từ `yarn.lock` đang thật sự cài — đo sai thứ. Và `npm install --package-lock-only` thất bại khi thử |
| Chạy `check-audit.mjs` trong CI bằng `GITHUB_TOKEN` | Đã thử, CI trả 403: `GITHUB_TOKEN` không có quyền đọc Dependabot alert. Đây là giới hạn của GitHub, không phải thiếu dòng `permissions` |
| Cấp một personal access token làm secret để CI đọc alert | Thêm một secret dài hạn phải tự tay tạo và tự tay xoay vòng, cho một dự án bốn dependency. Đường alert đã có PR sửa tự động, và PR đó vẫn phải qua CI |
| `osv-scanner` | Nguồn dữ liệu tốt, nhưng thêm một binary phải cài trong CI cho một dự án có bốn dependency lúc chạy |

## 4. Hệ quả

**Được:**
- Cổng thật sự chạy, và dữ liệu đến từ chính `yarn.lock` đã commit — tức là từ thứ đang được cài, không phải từ một bản phân giải khác.
- Hai cửa sổ thời gian được che kín: dependency mới thêm (chặn ở PR) và lỗ hổng mới công bố trên dependency cũ (alert + PR sửa tự động, rồi lại qua PR).
- Không cần secret nào. Cổng chạy được ngay sau khi clone, không chờ ai cấp token.
- Vẫn còn một lệnh chạy ở máy, đúng nguyên tắc của ADR-0007, và nó đỏ khi không query được — điểm mà cả hai bản trước đều làm sai.

**Mất / phải chấp nhận:**
- Cổng phụ thuộc hoàn toàn vào GitHub: cần dependency graph và Dependabot alert bật, và cần `gh` cho lệnh chạy ở máy. Rời khỏi GitHub là phải làm lại bước này từ đầu.
- `yarn check:audit` không chạy trong CI, nên nó chỉ hữu ích khi có người gọi. Cổng thật là job ở PR.
- Đẩy thẳng lên `main` không qua PR thì không có cổng nào chặn dependency mới. Dự án này làm việc qua PR (ADR-0007 §1 nói cả chuyện merge ở máy — nếu quay lại lối đó thì khoảng trống này mở ra).
- Hai cơ chế thay vì một. Chấp nhận vì chúng che hai khoảng trống khác nhau, không phải hai bản của cùng một việc.
- `web-game-minesweeper` vẫn đang có một cổng audit báo xanh giả. Nằm ngoài phạm vi dự án này; ghi lại ở đây để lần sau ai đọc còn biết.

**Điều kiện xem lại quyết định này:** khi dự án chuyển sang Yarn Berry (`yarn npm audit` dùng registry npm và hoạt động), hoặc khi rời GitHub.
