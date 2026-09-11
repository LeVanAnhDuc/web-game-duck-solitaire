# ADR-0011 · Chạy UX persona review trên bản deploy, không trên `yarn dev`

> **Ngày:** 2026-09-12
> **Trạng thái:** accepted
> **Liên quan:** NFR-REL-04 · NFR-PERF-02 · ADR-0004 · `.claude/skills/ux-persona-review/`

## 1. Bối cảnh

`ux-persona-review` khai port `3000` và bảo người điều phối kiểm tra `yarn dev` có đang
chạy không. Mặc định đó thừa hưởng từ máy phát, vốn viết cho các app gen-1 có server.

Dự án này không có server. Thứ người chơi thật sự mở là **một trang tĩnh đã export, phục
vụ dưới `basePath` `/web-game-duck-solitaire`, qua CDN của GitHub Pages**. Ba thứ đó
`next dev` không tái hiện: `next dev` chạy từ gốc `/`, không áp `basePath`
(`next.config.ts` chỉ bật khi `GITHUB_PAGES=true`), không đi qua bước export, và không có
độ trễ mạng thật.

Hệ quả cụ thể, tìm được ngay ở lần tải đầu tiên: trang xin `favicon.ico` và nhận **404 hai
lần mỗi lần tải**, vi phạm `NFR-REL-04`. Ở `localhost:3000` lỗi này vẫn tồn tại nhưng vô
hại về mặt đường dẫn; trên bản deploy nó lộ ra là trình duyệt đang xin **gốc domain**
(`levananhduc.github.io/favicon.ico`) chứ không phải dưới `basePath` — một dạng hỏng chỉ
nhìn thấy khi chạy đúng chỗ nó sẽ chạy.

Thêm một ràng buộc: port `3000` trùng với client của Ducker ID trong cùng workspace.

## 2. Quyết định

Mọi lượt `ux-persona-review` chạy trên `https://levananhduc.github.io/web-game-duck-solitaire/`.

**Trước mỗi lượt, bắt buộc kiểm bản deploy có bằng `main` không** — `git rev-list --count
<tag mới nhất>..main` phải bằng 0, và tag phải trỏ đúng commit đang deploy. Lệch thì hoặc
deploy lại trước, hoặc ghi rõ độ lệch vào §Ghi chú của báo cáo. Không có bước này thì
persona đi nhận xét một phiên bản không còn tồn tại trong repo.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| `yarn dev` ở `:3000` (mặc định của skill) | Không áp `basePath`, không qua export, không có độ trễ thật — đúng ba thứ sinh ra lỗi loại `favicon.ico`. Và `:3000` trùng client Ducker ID, persona có thể đi nhận xét nhầm sản phẩm |
| `yarn build` rồi `node scripts/serve.mjs 4183 out` | Gần đúng nhất trong các phương án local: có export, có `basePath`. Nhưng vẫn là mạng loopback — `NFR-PERF-02` và cảm giác chờ của persona điện thoại mạng chậm đều vô nghĩa trên loopback. Vẫn dùng được khi cần chạy offline |
| Chạy cả hai rồi so | Gấp đôi chi phí một lượt (10 phiên → 20) để trả lời một câu hỏi không ai hỏi. Khác biệt giữa hai môi trường là chuyện của CI, không phải của persona |

## 4. Hệ quả

**Được:**
- Persona gặp đúng thứ người chơi gặp: `basePath`, bản export, độ trễ CDN thật.
- Bắt được cả lớp lỗi chỉ tồn tại sau khi export — `favicon.ico` 404 là ca đầu tiên.
- Không còn nguy cơ đụng port với Ducker ID.

**Mất / phải chấp nhận:**
- **Không review được code chưa deploy.** Một feature đang nằm trên nhánh phải merge và
  deploy xong mới đưa persona vào được. Đổi lại, mọi phát hiện chắc chắn nói về code thật.
- Phụ thuộc GitHub Pages còn sống và workflow deploy đã chạy xong.
- Thêm một bước kiểm bắt buộc trước mỗi lượt, và bước đó **im lặng khi sai** nếu quên —
  nên nó nằm trong `SKILL.md` chứ không chỉ trong ADR này.

**Điều kiện xem lại:** khi dự án có môi trường staging riêng, hoặc khi cần cho persona
chạy trên nhánh trước khi merge.
