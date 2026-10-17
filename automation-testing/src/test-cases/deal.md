# DEAL — Test cases

Requirement: `docs/requirements/deal.md` · quyết định: `docs/decisions/deal.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.

### TC-DEAL-001 — mở trang là có ngay ván đã chia đúng luật Klondike

- **Requirement:** REQ-DEAL-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** mở `./?van=20260904`
- **Mong đợi:** bàn "Bàn bài Klondike" hiện; cột i có i lá, chỉ lá trên cùng ngửa; chồng rút 24 lá úp; bài đã rút và 4 chồng đích 0 lá; tổng 52 lá, 52 id khác nhau
- **Automated:** `tests/e2e/deal/deal.e2e.ts`

### TC-DEAL-002 — cùng số hiệu ván, tải lại vẫn ra đúng thế bài

- **Requirement:** REQ-DEAL-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** mở `./?van=4242`, chụp thế bài → tải lại → chụp lại
- **Mong đợi:** hai lần chụp giống hệt (id, chồng, vị trí, mặt của cả 52 lá)
- **Automated:** `tests/e2e/deal/deal.e2e.ts`

### TC-DEAL-003 — hai số hiệu khác nhau cho hai thế bài khác nhau

- **Requirement:** REQ-DEAL-03
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** mở `./?van=1`, chụp → mở `./?van=2`, chụp
- **Mong đợi:** hai thế bài khác nhau
- **Automated:** `tests/e2e/deal/deal.e2e.ts`

### TC-DEAL-004 — số hiệu không dùng được thì chia ván ngẫu nhiên, không lỗi, địa chỉ ghi số thật

- **Requirement:** REQ-DEAL-04
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 3, 5
- **Bước:** lần lượt mở `./?van=khong-phai-so`, `-1`, `1.5`, `4294967296`
- **Mong đợi:** có 52 lá, không lỗi trang; "Ván số n" hiện, `?van` trên địa chỉ = n; n nằm trong 0…4294967295
- **Automated:** `tests/e2e/deal/deal.e2e.ts`

### TC-DEAL-005 — hai biên 0 và 4294967295 là số hiệu hợp lệ

- **Requirement:** REQ-DEAL-04
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 3
- **Bước:** mở `./?van=0`, rồi `./?van=4294967295`
- **Mong đợi:** "Ván số 0" / "Ván số 4294967295", địa chỉ giữ nguyên số đó
- **Automated:** `tests/e2e/deal/deal.e2e.ts`

### TC-DEAL-006 — không có số hiệu thì ván ngẫu nhiên tự ghi số lên địa chỉ, mở lại ra đúng ván

- **Requirement:** REQ-DEAL-05
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** mở `./` → đọc `?van` → chụp → mở `./?van=<số đó>` → chụp
- **Mong đợi:** `?van` có mặt và bằng số trên màn hình; hai lần chụp giống hệt
- **Automated:** `tests/e2e/deal/deal.e2e.ts`

### TC-DEAL-007 — số hiệu ván và câu giải thích đọc được ngay trên màn hình

- **Requirement:** REQ-DEAL-06
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 1, 6
- **Bước:** mở `./?van=20260904`
- **Mong đợi:** "Ván số 20260904" và "Cùng số hiệu ván luôn cho cùng thế bài" hiện; trong header không phần tử nào có `title`
- **Automated:** `tests/e2e/deal/deal.e2e.ts`

### TC-DEAL-008 — "Ván mới" chia ván khác, đổi số trên màn hình và địa chỉ, không thêm lịch sử trình duyệt

- **Requirement:** REQ-DEAL-07
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1, 4
- **Bước:** mở `./?van=777` → rút 2 lá → "Ván mới"
- **Mong đợi:** số mới ≠ 777 trên màn hình và trong `?van`; thế bài khác; bài đã rút 0 lá, "Hoàn lại" tắt; `history.length` không đổi
- **Automated:** `tests/e2e/deal/deal.e2e.ts`

### TC-DEAL-009 — trang tự giới thiệu: tên, câu cam kết, tiêu đề tab, biểu tượng

- **Requirement:** REQ-DEAL-08
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 1
- **Bước:** mở `./?van=20260904`
- **Mong đợi:** "Duck Solitaire" và "Không tài khoản · không quảng cáo · không lưu gì" trong header; tiêu đề tab "Duck Solitaire"; có `link[rel=icon]` trỏ tới một biểu tượng
- **Automated:** `tests/e2e/deal/deal.e2e.ts`
