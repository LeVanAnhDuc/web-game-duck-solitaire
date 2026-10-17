# DRAWMODE — Test cases

Requirement: `docs/requirements/draw-mode.md` · quyết định: `docs/decisions/draw-mode.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.

### TC-DRAWMODE-001 — trước nước đầu tiên, đổi chế độ rút có hiệu lực ngay, không hỏi

- **Requirement:** REQ-DRAWMODE-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 3
- **Bước:** `./?van=20260904` → chọn "Rút 3 lá" → chạm chồng rút
- **Mong đợi:** không hộp thoại; ô chế độ = 3; thế bài không đổi; lần rút đưa 3 lá sang
- **Automated:** `tests/e2e/draw-mode/confirm.e2e.ts`

### TC-DRAWMODE-002 — giữa ván, đổi chế độ rút thì hỏi trước và nói rõ ván sẽ bắt đầu lại

- **Requirement:** REQ-DRAWMODE-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** `./?van=20260904` → rút 1 → chọn "Rút 3 lá"
- **Mong đợi:** hộp thoại `aria-modal` "Đổi chế độ rút sẽ bắt đầu lại ván" với "Ván đang chơi sẽ bị bỏ. Vẫn đổi chứ?";
  lá vừa rút vẫn trên bài đã rút
- **Automated:** `tests/e2e/draw-mode/confirm.e2e.ts`

### TC-DRAWMODE-003 — "Giữ ván hiện tại" giữ nguyên ván và chế độ cũ

- **Requirement:** REQ-DRAWMODE-03
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** `./?van=20260904` → rút 1 → chọn "Rút 3 lá" → "Giữ ván hiện tại" → rút 1
- **Mong đợi:** hộp thoại đóng; ô chế độ = 1; thế bài y nguyên; "Hoàn lại" bật; lần rút sau đưa đúng 1 lá
- **Automated:** `tests/e2e/draw-mode/confirm.e2e.ts`

### TC-DRAWMODE-004 — "Đổi và chia lại" chia lại đúng ván này ở chế độ mới

- **Requirement:** REQ-DRAWMODE-04
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1, 4
- **Bước:** `./?van=20260904` → rút 1 → chọn "Rút 3 lá" → "Đổi và chia lại" → rút 1
- **Mong đợi:** hộp thoại đóng; ô chế độ = 3; thế bài = lúc chia; "Ván số 20260904"; "Hoàn lại" tắt; lần rút đưa 3 lá
- **Automated:** `tests/e2e/draw-mode/confirm.e2e.ts`

### TC-DRAWMODE-005 — hỏi lại sau khi đã giữ ván, rồi đồng ý thì mới chia lại

- **Requirement:** REQ-DRAWMODE-03, REQ-DRAWMODE-04
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** rút 1 → "Rút 3 lá" → giữ ván → "Rút 3 lá" lần nữa → "Đổi và chia lại" → rút 1
- **Mong đợi:** lần hai vẫn hỏi; sau khi đồng ý bài đã rút 0, lần rút đưa 3 lá
- **Automated:** `tests/e2e/draw-mode/confirm.e2e.ts`

### TC-DRAWMODE-006 — Escape đóng hộp thoại, giữ ván; tiêu điểm vào lựa chọn an toàn rồi trả về ô chế độ rút

- **Requirement:** REQ-DRAWMODE-05
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4, 6
- **Bước:** rút 1 → "Rút 3 lá" → `Escape`
- **Mong đợi:** lúc mở tiêu điểm ở "Giữ ván hiện tại"; sau `Escape` hộp thoại đóng, ô chế độ = 1 và có tiêu điểm, lá đã
  rút vẫn còn, "Hoàn lại" bật
- **Automated:** `tests/e2e/draw-mode/confirm.e2e.ts`

### TC-DRAWMODE-007 — đổi từ rút 3 về rút 1 giữa ván cũng hỏi, và chia lại ở rút 1

- **Requirement:** REQ-DRAWMODE-04
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 2
- **Bước:** "Rút 3 lá" (chưa đi nước nào) → rút → chọn "Rút 1 lá" → "Đổi và chia lại" → rút
- **Mong đợi:** ô chế độ = 1; bài đã rút 0; lần rút đưa 1 lá
- **Automated:** `tests/e2e/draw-mode/confirm.e2e.ts`

### TC-DRAWMODE-008 — hộp thoại nằm trên bàn bài: bấm chuột vào "Đổi và chia lại" được

- **Requirement:** REQ-DRAWMODE-06
- **Layer:** e2e · **Priority:** P0 · **Lăng kính:** 6
- **Bước:** `./?van=20260904`, 1280×720 → rút 1 → "Rút 3 lá" → thử bấm (trial) "Đổi và chia lại" và "Giữ ván hiện tại"
- **Mong đợi:** con trỏ trúng đúng nút, không phần tử nào đè lên
- **Automated:** `tests/e2e/draw-mode/confirm.e2e.ts`

### TC-DRAWMODE-009 — bàn phím bấm được nút của hộp thoại

- **Requirement:** REQ-DRAWMODE-07
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 6
- **Bước:** rút 1 → "Rút 3 lá" → `Tab` (tới "Đổi và chia lại") → `Enter` / `Space`
- **Mong đợi:** hộp thoại đóng, ô chế độ = 3
- **Automated:** `tests/e2e/draw-mode/confirm.e2e.ts`
