# KEYBOARD — Test cases

Requirement: `docs/requirements/keyboard.md` · quyết định: `docs/decisions/keyboard.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.

### TC-KEYBOARD-001 — Tab vào bàn bài ở cột 1, cả bàn chỉ là một điểm dừng Tab

- **Requirement:** REQ-KEYBOARD-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** `./?van=20260904` → `Tab` → `Tab`
- **Mong đợi:** lần một tiêu điểm ở cột 1; đúng một chồng có `tabindex="0"`; lần hai tiêu điểm ở "Hoàn lại"
- **Automated:** `tests/e2e/keyboard/keyboard.e2e.ts`

### TC-KEYBOARD-002 — phím mũi tên đi dọc hàng, quay vòng ở hai đầu, lên xuống đổi hàng giữ cột

- **Requirement:** REQ-KEYBOARD-02
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 3
- **Bước:** cột 1 → `←` → `→` → `↑` → `←` → `↓` → `→` → `↑`
- **Mong đợi:** cột 7 → cột 1 → chồng rút → chồng đích 4 → cột 6 → (cột 7) → chồng đích 4
- **Automated:** `tests/e2e/keyboard/keyboard.e2e.ts`

### TC-KEYBOARD-003 — tiêu điểm bàn phím luôn nhìn thấy được

- **Requirement:** REQ-KEYBOARD-03
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 6
- **Bước:** `Tab` → `→`
- **Mong đợi:** cột 2 có tiêu điểm và vẽ outline hoặc box-shadow
- **Automated:** `tests/e2e/keyboard/keyboard.e2e.ts`

### TC-KEYBOARD-004 — Space cầm lá trên cùng lên rồi đặt xuống chồng khác

- **Requirement:** REQ-KEYBOARD-04
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** `./?van=1` → tiêu điểm cột 2 → `Space` → tới cột 7 → `Space`
- **Mong đợi:** Tép Ba được chọn, rồi nằm ở cột 7; không còn lá được chọn
- **Automated:** `tests/e2e/keyboard/keyboard.e2e.ts`

### TC-KEYBOARD-005 — Space trên chồng rút là rút bài; đang cầm lá thì bị từ chối

- **Requirement:** REQ-KEYBOARD-04
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2, 5
- **Bước:** tiêu điểm chồng rút → `Space` → cầm lá ở bài đã rút → `←` tới chồng rút → `Space`
- **Mong đợi:** lần đầu rút 1 lá; lần sau thế bài không đổi, "Nước đi không hợp lệ"
- **Automated:** `tests/e2e/keyboard/keyboard.e2e.ts`

### TC-KEYBOARD-006 — Space trên chồng không có gì để cầm thì bị từ chối và được đọc lên

- **Requirement:** REQ-KEYBOARD-05
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Bước:** `./?van=20260904` → tiêu điểm chồng đích Bích (trống) → `Space`
- **Mong đợi:** vùng thông báo từ "" thành "Nước đi không hợp lệ"; không lá nào được chọn
- **Automated:** `tests/e2e/keyboard/keyboard.e2e.ts`

### TC-KEYBOARD-007 — Enter tự tìm chỗ như chạm đúp

- **Requirement:** REQ-KEYBOARD-06
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** `./?van=1` → tiêu điểm cột 2 → `Enter`
- **Mong đợi:** Tép Ba sang cột 7
- **Automated:** `tests/e2e/keyboard/keyboard.e2e.ts`

### TC-KEYBOARD-008 — con trỏ bàn phím đi theo lá vừa bay tới chồng mới

- **Requirement:** REQ-KEYBOARD-06
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** `./?van=66725` → `Tab` → `Enter`
- **Mong đợi:** Cơ Át lên chồng đích Cơ; tiêu điểm và `tabindex="0"` chuyển sang chồng đích đó, cột 1 về `-1`
- **Automated:** `tests/e2e/keyboard/keyboard.e2e.ts`

### TC-KEYBOARD-009 — Escape bỏ lá đang cầm

- **Requirement:** REQ-KEYBOARD-07
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** cột 2 → `Space` → `Escape`
- **Mong đợi:** không lá nào được chọn
- **Automated:** `tests/e2e/keyboard/keyboard.e2e.ts`

### TC-KEYBOARD-010 — đang cầm một dãy, ↑ ↓ đổi độ sâu, không vượt quá các lá ngửa

- **Requirement:** REQ-KEYBOARD-08
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 3
- **Bước:** `./?van=23`, Bích Sáu lên Cơ Bảy (cột 4) → cột 4 `Space` → `↑` `↑` → `↓` `↓` → tới cột 1 → `↑` → `Space`
- **Mong đợi:** 1 → 2 → 2 (dừng ở lá úp) → 1 (không dưới 1); dãy hai lá sang cột 1 (3 lá)
- **Automated:** `tests/e2e/keyboard/keyboard.e2e.ts`

### TC-KEYBOARD-011 — bản đồ phím ẩn khi dùng chuột, hiện khi dùng bàn phím

- **Requirement:** REQ-KEYBOARD-09
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 4
- **Bước:** mở trang → `Tab` → chạm chồng rút bằng chuột
- **Mong đợi:** ẩn → hiện, đúng câu hướng dẫn → ẩn; câu hướng dẫn `sr-only` luôn có
- **Automated:** `tests/e2e/keyboard/keyboard.e2e.ts`

### TC-KEYBOARD-012 — nút trên thanh điều khiển dùng được bằng bàn phím

- **Requirement:** REQ-KEYBOARD-10
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 6
- **Bước:** rút 1 → tiêu điểm "Hoàn lại" + `Enter` / "Ván mới" + `Space` / "Chế độ rút" + `↓`
- **Mong đợi:** nước rút hoàn lại / số hiệu ván đổi / hộp thoại đổi chế độ hiện
- **Automated:** `tests/e2e/keyboard/keyboard.e2e.ts`

### TC-KEYBOARD-013 — chơi trọn một ván tới màn thắng chỉ bằng bàn phím

- **Requirement:** REQ-KEYBOARD-11
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 1
- **Tiền điều kiện:** ván thắng được `src/data/winnable.ts`, cửa sổ 1440×1600
- **Bước:** từng nước đã ghi bằng mũi tên / `Space` / `↑` / `Enter`; sau khi mọi lá ngửa, `Enter` lần lượt từng chồng,
  rút khi một vòng không đưa được lá nào lên
- **Mong đợi:** sau mỗi nước số lá từng chồng đúng như mô hình; không còn lá úp; màn "Thắng rồi!" hiện
- **Automated:** `tests/e2e/keyboard/full-game.e2e.ts`
