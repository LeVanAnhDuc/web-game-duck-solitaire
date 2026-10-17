# PRIVACY — Test cases

Requirement: `docs/requirements/privacy.md` · quyết định: `docs/decisions/privacy.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.
"Một lượt chơi": 25 lần chạm chồng rút (một vòng + lật lại), chạm đúp, hoàn lại, kéo thả, chơi lại, đổi sang rút 3, rút 3
lần, ván mới, rút 2 lần.

### TC-PRIVACY-001 — tải trang không gọi tới đâu ngoài chính trang

- **Requirement:** REQ-PRIVACY-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 6
- **Bước:** mở `./?van=20260904`, chờ mạng yên
- **Mong đợi:** không request nào tới origin khác origin của trang
- **Automated:** `tests/e2e/privacy/network-storage.e2e.ts`

### TC-PRIVACY-002 — sau khi tải xong, chơi không gọi mạng lần nào nữa

- **Requirement:** REQ-PRIVACY-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 6
- **Bước:** mở `./?van=1`, chờ mạng yên → một lượt chơi
- **Mong đợi:** 0 request
- **Automated:** `tests/e2e/privacy/network-storage.e2e.ts`

### TC-PRIVACY-003 — không lưu gì trên máy người chơi: localStorage, sessionStorage, cookie đều trống

- **Requirement:** REQ-PRIVACY-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 6
- **Bước:** một lượt chơi → đọc storage và cookie
- **Mong đợi:** cả hai storage 0 khoá; `document.cookie` rỗng; context không có cookie
- **Automated:** `tests/e2e/privacy/network-storage.e2e.ts`

### TC-PRIVACY-004 — tải lại trang là quên ván đang chơi

- **Requirement:** REQ-PRIVACY-04
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** `./?van=20260904` → rút 3 → tải lại
- **Mong đợi:** thế bài = lúc chia; "Hoàn lại" tắt
- **Automated:** `tests/e2e/privacy/network-storage.e2e.ts`

### TC-PRIVACY-005 — console không có lỗi hay cảnh báo nào suốt một lượt chơi

- **Requirement:** REQ-PRIVACY-05
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 6
- **Bước:** nghe console + lỗi trang → mở `./?van=1` → một lượt chơi
- **Mong đợi:** không `error`, `warning` hay lỗi trang nào
- **Automated:** `tests/e2e/privacy/network-storage.e2e.ts`

### TC-PRIVACY-006 — mất mạng sau khi tải xong vẫn chơi tiếp được, kể cả ván mới

- **Requirement:** REQ-PRIVACY-06
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Bước:** mở `./?van=1`, chờ mạng yên → ngắt mạng → một lượt chơi
- **Mong đợi:** mọi thao tác chạy; 52 lá; ván mới (giữ rút 3) có 6 lá trên bài đã rút sau 2 lần rút
- **Automated:** `tests/e2e/privacy/network-storage.e2e.ts`
