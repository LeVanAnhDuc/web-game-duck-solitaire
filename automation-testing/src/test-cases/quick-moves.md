# QUICKMOVES — Test cases

Requirement: `docs/requirements/quick-moves.md` · quyết định: `docs/decisions/quick-moves.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.

### TC-QUICKMOVES-001 — một chạm vào lá Át trên cột đưa nó lên đúng chồng đích

- **Requirement:** REQ-QUICKMOVES-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** `./?van=66725` → chạm Cơ Át (cột 1)
- **Mong đợi:** chồng đích Cơ (thứ hai) có 1 lá; cột 1 trống; không lá nào được chọn; "Hoàn lại" bật
- **Automated:** `tests/e2e/quick-moves/taps.e2e.ts`

### TC-QUICKMOVES-002 — một chạm vào lá Át trên bài đã rút cũng đưa nó lên

- **Requirement:** REQ-QUICKMOVES-01
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** `./?van=20260904` → rút đến khi bài đã rút lộ một lá Át → chạm lá đó
- **Mong đợi:** chồng đích có 1 lá; không lá nào được chọn
- **Automated:** `tests/e2e/quick-moves/taps.e2e.ts`

### TC-QUICKMOVES-003 — một chạm vào lá chồng đích chưa nhận thì chỉ cầm lá lên, kể cả khi có cột nhận

- **Requirement:** REQ-QUICKMOVES-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 2
- **Bước:** `./?van=1` → chạm Tép Ba (cột 7 nhận được nó)
- **Mong đợi:** Tép Ba được chọn; thế bài không đổi; "Hoàn lại" tắt
- **Automated:** `tests/e2e/quick-moves/taps.e2e.ts`

### TC-QUICKMOVES-004 — chạm đúp vào lá Át chỉ đi một nước, không cầm lá nằm dưới

- **Requirement:** REQ-QUICKMOVES-03
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Bước:** `./?van=20260904` → chạm đúp Bích Át (trên cùng cột 4)
- **Mong đợi:** chồng đích Bích có 1 lá; tổng lá trên chồng đích là 1; không lá nào được chọn; cột 4 còn 3 lá
- **Automated:** `tests/e2e/quick-moves/taps.e2e.ts`

### TC-QUICKMOVES-005 — chạm đúp đưa lá sang cột khi không chồng đích nào nhận

- **Requirement:** REQ-QUICKMOVES-04
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** `./?van=1` → chạm đúp Tép Ba
- **Mong đợi:** Tép Ba ở cột 7; chồng đích trống; không lá nào được chọn; "Hoàn lại" bật
- **Automated:** `tests/e2e/quick-moves/taps.e2e.ts`

### TC-QUICKMOVES-006 — chạm đúp lá Già khi có cột trống thì nó vào cột trống

- **Requirement:** REQ-QUICKMOVES-04
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 2
- **Bước:** `./?van=66725` → chạm Cơ Át (cột 1 trống) → chạm đúp Rô Già (cột 7)
- **Mong đợi:** Rô Già ở cột 1
- **Automated:** `tests/e2e/quick-moves/taps.e2e.ts`

### TC-QUICKMOVES-007 — chạm đúp lá không có chỗ đi thì không có gì xảy ra và không ghi nước rỗng

- **Requirement:** REQ-QUICKMOVES-05
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 5
- **Bước:** `./?van=20260904` → chạm đúp Cơ Tám (cột 1)
- **Mong đợi:** thế bài y nguyên; không lá nào được chọn; "Hoàn lại" tắt; "Nước đi không hợp lệ"
- **Automated:** `tests/e2e/quick-moves/taps.e2e.ts`

### TC-QUICKMOVES-008 — "Hoàn tất" tắt khi còn lá úp và bấm vào cũng không làm gì

- **Requirement:** REQ-QUICKMOVES-06
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** `./?van=20260904` → bấm "Hoàn tất"
- **Mong đợi:** nút `aria-disabled="true"`; thế bài y nguyên; "Hoàn lại" tắt
- **Automated:** `tests/e2e/quick-moves/taps.e2e.ts`
