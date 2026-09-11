# Ghi chú về chính lần chạy này — 2026-09-12

Ghi tại thời điểm xảy ra, không viết lại ở cuối. Mọi mục ở đây phải xuất hiện trong
§Ghi chú về chính lần chạy này của báo cáo.

## 1. Mục tiêu là bản deploy, không phải localhost

Người dùng yêu cầu chạy trên `https://levananhduc.github.io/web-game-duck-solitaire/`
thay vì `http://localhost:3000`.

**Đã kiểm tra bản deploy có đúng bằng `main` không, trước khi chạy:** tag `v1.2.4` trỏ
đúng commit `b222152`, và `git rev-list --count v1.2.4..main` = 0. Bản đang chạy trên
GitHub Pages chính là `main`. Nên mọi phát hiện ánh xạ thẳng vào code hiện tại, không có
độ trễ giữa cái được test và cái được sửa.

Đây thực ra **tốt hơn** localhost cho lần chạy này: nó test đúng `basePath`, đúng bản
export tĩnh, đúng độ trễ mạng thật — ba thứ `yarn dev` không tái hiện được. Lỗi
`favicon.ico` 404 ở mục 5 là loại lỗi chỉ lộ ra khi chạy dưới `basePath`.

## 2. Lượt chạy đầu bị bỏ — agent lấy sai công cụ trình duyệt

`p01-RR-01`, `p02-RR-02`, `p03-RR-03` bị **huỷ, không dùng làm dẫn chứng**. Số phiên
`p01`–`p03` coi như đã tiêu, không tái sử dụng.

Nguyên nhân: `.claude/agents/ux-persona.md` khai `tools:` bằng wildcard
`mcp__playwright__*, mcp__chrome-devtools__*`. Ở máy này plugin MCP đăng ký dưới tiền tố
`mcp__plugin_<plugin>_<server>__`, nên hai wildcard đó **không khớp gì cả**; chỉ
`mcp__claude-in-chrome__*` khớp. Agent lặng lẽ rơi xuống hạng 3 của
`lib/browser-capability.md` và chạy trên Chrome cá nhân của chủ máy.

Hậu quả đúng như `browser-capability.md` cảnh báo — degrade âm thầm, báo cáo vẫn trông
hợp lý:

- không đặt được viewport 375px, không throttle Slow 4G → persona "đứng trên xe buýt"
  thực chất chạy trên màn desktop;
- không ghi được ảnh vào `anh-tho/` → **trượt cổng kiểm ảnh**;
- console trả về lỗi của **extension trong Chrome cá nhân**
  (`chrome-extension://hfgko...content.js`), không phải lỗi của trang;
- persona không còn "mới tinh" vì mang sẵn session của chủ máy.

Đã sửa `tools:` trong `.claude/agents/ux-persona.md` thành tiền tố thật. **Nhưng định
nghĩa agent không nạp nóng** — bản đã nạp từ đầu phiên vẫn là bản cũ. Không khởi động lại
được phiên giữa chừng, nên lượt chạy thật dùng `general-purpose` với toàn bộ system prompt
của `ux-persona` nội tuyến vào prompt, cộng lệnh cấm đọc file mã nguồn để giữ tính "mù".

Việc cần làm ở phiên sau: xác nhận `ux-persona` đã nhận `tools:` mới và bỏ cách nội tuyến này.

## 3. `chrome-devtools-mcp` không dùng được từ subagent — đã thử và bỏ

Định dùng `chrome-devtools-mcp` (hạng 2) **thay** playwright (hạng 1), vì nó có đủ hai
năng lực bắt buộc mà bản playwright MCP ở máy này thiếu: `emulate` cấp
`networkConditions: Slow 4G` và `viewport 375x720x2,mobile,touch`. Người điều phối đã tự
chạy thử thành công: mở trang, đặt viewport điện thoại, throttle, chụp ảnh vào đúng thư
mục. Xác nhận `?van=2` có A♠ ngửa sẵn ngay khi chia, đúng như RR-04 giả định.

**Nhưng từ subagent thì không chạy được.** Mỗi subagent nhận một **instance MCP server
riêng**, và `chrome-devtools-mcp` khoá theo một thư mục profile cố định
(`~/.cache/chrome-devtools-mcp/chrome-profile`). Server của subagent không gắn được vào
trình duyệt mà server của phiên chính đang giữ, và cũng không mở được cái mới:

```
The browser is already running for C:\Users\User\.cache\chrome-devtools-mcp\chrome-profile.
Use a different `userDataDir` or stop the running browser first.
```

Đã thử giải phóng bằng cách kill toàn bộ tiến trình Chrome của profile đó — server tự dựng
lại trình duyệt ngay, nên tắc lại y như cũ. Hai lượt dispatch (`p11` lần 1 và lần 2) chết ở
đúng chỗ này, không sinh được ảnh hay log nào.

## 4. Persona chạy bằng playwright MCP — mất throttle và cảm ứng

Chốt: **persona dùng `mcp__plugin_playwright_playwright__*`** (hạng 1 theo
`browser-capability.md`). Nó tự quản trình duyệt riêng cho từng agent nên chạy song song
được thật, và ghi ảnh vào đúng thư mục run (đã kiểm bằng
`probe-01-playwright-duong-dan-tuyet-doi.png`).

**Hai năng lực bắt buộc bị mất, ghi ra đây chứ không degrade âm thầm:**

| Mất gì | Hệ quả thật |
| --- | --- |
| **throttle mạng** | p11 (Hằng) mất điều kiện định danh của mình — "mạng 4G chập chờn trên xe buýt". Mọi nhận xét về *chờ đợi* trong phiên đó không dùng được. Phần còn lại của phiên vẫn dùng được |
| **giả lập cảm ứng** | Cú "chạm" thực chất là cú **click chuột**. Ta test đường pointer chứ không test đường touch. Với sản phẩm này mức thiệt hại thấp — bất biến #6 buộc tap và drag phải dựng cùng một `Move` qua cùng `applyMove` — nhưng **không** loại trừ được lỗi chỉ xảy ra với `pointerType: touch` |

Viewport **vẫn đặt được** (`browser_resize`), nên toàn bộ phần bố cục 375px vẫn được đo thật.

Thứ hạng-1 đáng giá nhất — context sạch cho mỗi phiên — ở sản phẩm này gần như miễn phí:
`NFR-DATA-01` cấm localStorage, cookie và mọi thứ sống qua phiên, nên **mỗi lần tải trang
vốn đã là một người dùng mới tinh**.

Người điều phối giữ `chrome-devtools-mcp` cho riêng mình, để đo những thứ persona không đo
được (throttle CPU cho `NFR-PERF-02`, console sạch, tương phản).

## 5. Lượt chạy song song bị bỏ — và một "lỗi nghiêm trọng" hoá ra là ảo

Đã thả 4 phiên song song đúng trần của `lib/orchestration.md` (`p11`–`p14`). **Bỏ toàn bộ.**
Ảnh chuyển sang `bo-luot-song-song/`, không dùng làm dẫn chứng. Số `p11`–`p14` coi như đã tiêu.

Playwright MCP **dùng chung đúng một trình duyệt và một trang** cho cả phiên chính lẫn mọi
subagent — khác hẳn giả định "context riêng mỗi phiên" mà `browser-capability.md` gán cho
hạng 1. Bốn persona vì thế cùng lái một tab. Mỗi lần một agent `browser_navigate` tới địa
chỉ không kèm `?van=`, app chia một ván mới, và **ba agent kia thấy bàn bài của mình đột
ngột biến thành ván khác**.

`p11` (Hằng) báo về đúng như vậy, và kết luận rất nặng:

> "Số ván nhảy từ 93712 sang 830491, dù tôi chưa hề bấm nút Ván mới… dấu hiệu của một lỗi
> tái tạo trạng thái rất nghiêm trọng — nên được ưu tiên điều tra trước bất kỳ tính năng nào khác."

**Đã kiểm chứng và bác bỏ.** Người điều phối chạy lại một mình, không có agent nào khác
đụng trình duyệt:

- mở `/` → app tự ghi seed vào địa chỉ: `?van=66725`;
- chạm **một lần** vào `Cơ Át` ở Cột bài 1;
- lá bay lên `Chồng đích Cơ`, `?van=66725` **giữ nguyên**, nút `Hoàn lại` chuyển từ
  `aria-disabled=true` sang `false`.

FR-14 chạy đúng, seed không đổi. Cái `p11` thấy là nhiễu do điều phối, không phải lỗi sản phẩm.

Bài học, ghi ra vì nó suýt thành một phát hiện Critical bịa: **một persona bị đặt trong môi
trường hỏng vẫn kể chuyện rất thuyết phục.** Luật "không dẫn chứng thì không có phát hiện"
của `frameworks.md` không đủ — ở đây dẫn chứng có thật, ảnh có thật, lời kể trung thực, chỉ
có môi trường là sai. Phát hiện nào đụng tới **bất biến của engine** (ADR-0001 cùng seed
cùng thế bài, bất biến #2 chỉ `applyMove` đổi thế bài) thì người điều phối **phải tự tái
hiện một mình** trước khi cho nó vào báo cáo.

## 6. Chạy tuần tự — trần "4 phiên đồng thời" không dùng được ở máy này

Hệ quả của mục 5: **mỗi lúc đúng một phiên**. Cả hai công cụ trình duyệt ở máy này đều
không cấp được trình duyệt riêng cho từng subagent — `chrome-devtools-mcp` khoá profile,
playwright dùng chung một tab.

Trần 4 phiên chỉ giãn thời gian chứ không cắt phạm vi, nên vẫn phủ đủ 8 Red Route + 2 phiên
mù. Lượt chạy thật đánh số **`p21`–`p30`**.

Việc cần làm ở phiên sau: sửa `lib/browser-capability.md` — dòng "context riêng mỗi phiên →
song song thật" của hạng 1 **không đúng** với playwright MCP chạy dưới subagent.

## 7. Lỗi console tìm được trước khi persona chạy

Người điều phối tự tải trang một lần để xác nhận đúng app (đối chiếu dấu hiệu nhận biết
trong `SKILL.md`). Ngay lần tải đó console đã có **2 lỗi**:

```
[ERROR] Failed to load resource: the server responded with a status of 404 ()
        @ https://levananhduc.github.io/favicon.ico:0   (× 2)
```

Xác nhận bằng repo: `public/` rỗng, không có `src/app/icon.*`, `layout.tsx` không khai
`metadata.icons`. Đây là dẫn chứng máy móc, không cần persona, và nó chạm thẳng
`NFR-REL-04`. Lưu ý đường dẫn là **gốc domain**, không nằm dưới `basePath` — đó là hành vi
mặc định của trình duyệt khi trang không khai `<link rel="icon">` nào.

## 8. Hai phiên cố ý bỏ — `p25` và `p29`

`ux-expert` ghi nhận đúng là hai số này không có log và §trên không nói tới. Đây là quyết
định của người điều phối, ghi lại để không ai tưởng là sót.

| Phiên bỏ | Lẽ ra là gì | Vì sao bỏ |
| --- | --- | --- |
| `p25-RR-04` | Dũng · một chạm đưa lá lên chồng đích | RR-04 đã được **hai** phiên khác trả lời bằng dẫn chứng thật: `p21` (một chạm, `p21-RR-01-02`) và `p26` (một cử chỉ kéo, `p26-RR-06-02`), cộng `p27` xác nhận vế "rẻ hơn cách thường". Chạy thêm một phiên nữa để đo lại thứ đã có ba dẫn chứng là không đáng |
| `p29-blind` | ông Tâm · phiên mù trên điện thoại | Ông Tâm đã chạy **hai** phiên có mục tiêu trên cùng thiết bị (`p22`, `p23`), nên góc nhìn "trình độ số thấp trên điện thoại" đã có dữ liệu |

**Lý do bỏ của `p29` yếu hơn lý do bỏ của `p25`, và `ux-expert` đã chỉ đúng chỗ đó.** Phiên
mù khác phiên có mục tiêu ở đúng một điểm: **không ai giao việc gì**. Hai phiên của ông Tâm
đều được giao việc, nên thứ một phiên mù trên điện thoại đo được — *người dùng chính, hoàn
toàn xa lạ, tự quyết định làm gì trước* — lượt này **không có**. F-03 (chồng rút cạn) và
F-04 (số hiệu ván) là hai chỗ một phiên mù trên điện thoại nhiều khả năng còn đào thêm được.

Ghi vào việc cần làm cho lượt sau, không tự chữa ở lượt này.

Hệ quả cần nói thẳng: lượt này chạy **8 phiên / 10 phiên** theo công thức của
`lib/orchestration.md` (8 Red Route `live` + 2 phiên mù), và trong 8 phiên đó có 1 phiên mù
thay vì 2.
