# UNDORESTART — Test cases

Requirement: `docs/requirements/undo-restart.md` · quyết định: `docs/decisions/undo-restart.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.

### TC-UNDORESTART-001 — hoàn lại từng nước về tận lúc chia, đến đầu ván thì nút tắt

- **Requirement:** REQ-UNDORESTART-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1, 3
- **Bước:** `./?van=1` → 24 lần rút + lật lại + 4 lần rút + chạm đúp Tép Ba (30 nước) → "Hoàn lại" 29 lần → 1 lần nữa
- **Mong đợi:** sau 29 lần nút vẫn bật; sau lần thứ 30 thế bài giống hệt lúc chia và nút tắt
- **Automated:** `tests/e2e/undo-restart/undo.e2e.ts`

### TC-UNDORESTART-002 — hoàn lại một nước trả bàn về đúng thế trước nước đó

- **Requirement:** REQ-UNDORESTART-02
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 1
- **Bước:** `./?van=20260904` → rút 3 lần → chụp → rút 1 lần → "Hoàn lại"
- **Mong đợi:** thế bài bằng lần chụp; nút vẫn bật
- **Automated:** `tests/e2e/undo-restart/undo.e2e.ts`

### TC-UNDORESTART-003 — hoàn lại qua nước đã lật một lá thì lá đó úp trở lại

- **Requirement:** REQ-UNDORESTART-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 4
- **Bước:** `./?van=1` → chạm đúp Tép Ba (lá dưới nó lật lên) → "Hoàn lại"
- **Mong đợi:** lá dưới cùng cột 2 úp lại; Tép Ba về trên nó
- **Automated:** `tests/e2e/undo-restart/undo.e2e.ts`

### TC-UNDORESTART-004 — hoàn lại một lần rút 3 lá trả cả ba lá về chồng rút đúng thứ tự

- **Requirement:** REQ-UNDORESTART-04
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** `./?van=20260904` → "Rút 3 lá" → rút → chụp → rút → "Hoàn lại" → "Hoàn lại"
- **Mong đợi:** lần hoàn lại thứ nhất ra đúng lần chụp; lần thứ hai ra đúng lúc chia
- **Automated:** `tests/e2e/undo-restart/undo.e2e.ts`

### TC-UNDORESTART-005 — hoàn lại lần lật lại chồng rút trả bài đã rút về như cũ

- **Requirement:** REQ-UNDORESTART-05
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 4
- **Bước:** `./?van=20260904` → rút đủ 24 lá → chụp → lật lại → "Hoàn lại"
- **Mong đợi:** thế bài bằng lần chụp (chồng rút 0, bài đã rút 24)
- **Automated:** `tests/e2e/undo-restart/undo.e2e.ts`

### TC-UNDORESTART-006 — bấm hoàn lại khi đang cầm một lá thì bỏ lựa chọn

- **Requirement:** REQ-UNDORESTART-06
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 4
- **Bước:** `./?van=1` → rút 1 → chạm Tép Ba (được chọn) → "Hoàn lại"
- **Mong đợi:** không lá nào được chọn; nước rút được hoàn lại
- **Automated:** `tests/e2e/undo-restart/undo.e2e.ts`

### TC-UNDORESTART-007 — "Chơi lại" chia lại đúng ván đang chơi từ đầu, giữ số hiệu và chế độ rút

- **Requirement:** REQ-UNDORESTART-07
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1, 4
- **Bước:** `./?van=20260904` → "Rút 3 lá" → chụp → rút 2 lần → chạm Bích Át → "Chơi lại"
- **Mong đợi:** thế bài bằng lần chụp; "Ván số 20260904" và `?van=20260904`; chế độ rút vẫn 3; "Hoàn lại" tắt; không hộp thoại nào
- **Automated:** `tests/e2e/undo-restart/undo.e2e.ts`

### TC-UNDORESTART-008 — hoàn lại và chơi lại không đổi số hiệu ván trên địa chỉ

- **Requirement:** REQ-UNDORESTART-08
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 6
- **Bước:** `./?van=20260904` → rút 2 → "Hoàn lại" → "Chơi lại"
- **Mong đợi:** `?van=20260904` sau mỗi bước; "Ván số 20260904" vẫn hiện
- **Automated:** `tests/e2e/undo-restart/undo.e2e.ts`
