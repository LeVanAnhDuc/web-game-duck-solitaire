# DUCKERID — Test cases

Requirement: `docs/requirements/ducker-id.md` · quyết định: `docs/decisions/ducker-id.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề. TC-DUCKERID-001 chạy trên
bản cờ tắt (project `app`); còn lại trên bản cờ bật (project `app-auth`) với `fakeIssuer`, ván `?van=1`.

### TC-DUCKERID-001 — cờ tắt thì không có nút đăng nhập, không đọc callback, không chạm storage

- **Requirement:** REQ-DUCKERID-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 6
- **Bước:** mở `./?van=20260904&code=x&state=y` trên bản deploy
- **Mong đợi:** không nút "Đăng nhập", không nút tài khoản; `?code=x` còn trên địa chỉ; câu cam kết "Không tài khoản · …";
  storage trống; không request ra ngoài
- **Automated:** `tests/e2e/ducker-id/flag-off.e2e.ts`

### TC-DUCKERID-002 — chưa bấm thì không gọi issuer, không lưu gì; câu cam kết nói "không tài khoản riêng"

- **Requirement:** REQ-DUCKERID-02
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 6
- **Bước:** mở ván
- **Mong đợi:** nút "Đăng nhập" hiện; "Không tài khoản riêng · …"; 0 lần gọi issuer; storage trống
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-003 — đăng nhập: thấy tài khoản, địa chỉ sạch, giữ ?van, đăng xuất trả lại nút

- **Requirement:** REQ-DUCKERID-03, REQ-DUCKERID-04
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** "Đăng nhập" → mở menu → "Đăng xuất"
- **Mong đợi:** nút tài khoản hiện; địa chỉ đứng yên ở `?van=1`; thế bài = lúc chia; issuer: authorize, token, userinfo;
  storage trống; menu có tên, email, link hồ sơ `http://ducker.test/profile` mở tab mới; sau đăng xuất nút "Đăng nhập" có
  tiêu điểm; console sạch
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-004 — Esc đóng menu tài khoản và trả tiêu điểm về nút; phím trong menu không chạm tới bàn bài

- **Requirement:** REQ-DUCKERID-05
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** đăng nhập → mở menu → `↓` → `Home` → `End` → `Escape`
- **Mong đợi:** tiêu điểm: hồ sơ → đăng xuất → hồ sơ → đăng xuất; bàn bài không đổi; menu đóng, `aria-expanded="false"`, tiêu điểm ở nút tài khoản
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-005 — đã đăng nhập vẫn chơi như thường

- **Requirement:** REQ-DUCKERID-06
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 1
- **Bước:** đăng nhập → chạm đúp Tép Ba → rút 1
- **Mong đợi:** Tép Ba ở cột 7; bài đã rút 1 lá
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-006 — tải lại khi đang đăng nhập là về chưa đăng nhập

- **Requirement:** REQ-DUCKERID-07
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 4
- **Bước:** đăng nhập → tải lại
- **Mong đợi:** `?van=1`; nút "Đăng nhập" hiện; "Ván số 1"
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-007 — từ chối ở Ducker ID thì về chưa đăng nhập, ván còn nguyên

- **Requirement:** REQ-DUCKERID-08
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Bước:** issuer trả `error=access_denied` → "Đăng nhập"
- **Mong đợi:** địa chỉ `?van=1`; nút "Đăng nhập"; "Ván số 1"; chỉ một lần gọi (authorize)
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-008 — state bị sửa thì bị từ chối, không bao giờ đổi code lấy token

- **Requirement:** REQ-DUCKERID-08
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 6
- **Bước:** issuer trả `state` khác → "Đăng nhập"
- **Mong đợi:** nút "Đăng nhập"; địa chỉ không còn `code=` / `state=`; chỉ một lần gọi (authorize)
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-009 — issuer không trả lời thì sau tối đa 15 giây về chưa đăng nhập

- **Requirement:** REQ-DUCKERID-09
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Bước:** token endpoint treo → "Đăng nhập"
- **Mong đợi:** thấy "Đang đăng nhập…", rồi trong 20 giây nút "Đăng nhập" trở lại; ván còn
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-010 — sessionStorage bị chặn thì bấm đăng nhập không đưa đi đâu, game vẫn chạy

- **Requirement:** REQ-DUCKERID-10
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 5
- **Bước:** `sessionStorage` ném lỗi khi đọc → "Đăng nhập" → rút 1
- **Mong đợi:** địa chỉ không đổi; 0 lần gọi issuer; nút vẫn dùng được; rút bài chạy
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-011 — nút đăng nhập rộng 44px, không đè số hiệu ván, menu nằm trong màn hình và không làm header nhảy

- **Requirement:** REQ-DUCKERID-11
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 3
- **Bước:** đo nút và nhãn số hiệu → đăng nhập → mở menu
- **Mong đợi:** nút ≥ 44×44, không giao nhãn; không cuộn ngang; header giữ nguyên hộp; menu trong bề rộng màn hình; mục
  "Đăng xuất" bấm tới được (không bị lá bài che)
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`
