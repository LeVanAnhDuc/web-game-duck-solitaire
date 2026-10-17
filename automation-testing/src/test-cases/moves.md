# MOVES — Test cases

Requirement: `docs/requirements/moves.md` · quyết định: `docs/decisions/moves.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề. Ván dùng trong từng case và
lý do chọn nó: `src/data/test-data.ts`.

### TC-MOVES-001 — chạm một lá rồi chạm chồng hợp lệ thì bài chuyển sang

- **Requirement:** REQ-MOVES-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** `./?van=1` → chạm Tép Ba (cột 2) → chạm cột 7 (Cơ Bốn)
- **Mong đợi:** Tép Ba nằm ở cột 7 (8 lá), không còn lá nào được chọn, "Hoàn lại" bật, vùng thông báo trống
- **Automated:** `tests/e2e/moves/tap.e2e.ts`

### TC-MOVES-002 — nước không hợp lệ không đổi gì, bỏ chọn và báo là bị từ chối

- **Requirement:** REQ-MOVES-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 5
- **Bước:** `./?van=1` → chạm Tép Ba → chạm cột 1 (Cơ Đầm)
- **Mong đợi:** thế bài y nguyên; không lá nào được chọn; "Hoàn lại" vẫn tắt; vùng `role="status"` đọc "Nước đi không hợp lệ"
- **Automated:** `tests/e2e/moves/tap.e2e.ts`

### TC-MOVES-003 — chạm lại lá đang chọn thì bỏ chọn, không có nước đi

- **Requirement:** REQ-MOVES-03
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** `./?van=1` → chạm Tép Ba → chạm Tép Ba lần nữa
- **Mong đợi:** không lá nào được chọn; "Hoàn lại" tắt
- **Automated:** `tests/e2e/moves/tap.e2e.ts`

### TC-MOVES-004 — chạm lá khác trong cùng cột khi đang chọn thì đổi lựa chọn, không phải nước đi

- **Requirement:** REQ-MOVES-03
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Tiền điều kiện:** `./?van=23`, Bích Sáu đã chuyển lên Cơ Bảy (cột 4)
- **Bước:** chạm Bích Sáu → chạm Cơ Bảy (dải lộ ra phía trên)
- **Mong đợi:** 2 lá được chọn (Cơ Bảy và Bích Sáu); thế bài không đổi
- **Automated:** `tests/e2e/moves/tap.e2e.ts`

### TC-MOVES-005 — chạm vào khoảng trống giữa hai chồng thì bỏ chọn, không có nước đi

- **Requirement:** REQ-MOVES-04
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 5
- **Bước:** `./?van=1` → chạm Tép Ba → chạm khe giữa cột 5 và cột 6
- **Mong đợi:** không lá nào được chọn; thế bài không đổi; "Hoàn lại" tắt
- **Automated:** `tests/e2e/moves/tap.e2e.ts`

### TC-MOVES-006 — Escape đặt lá đang cầm xuống

- **Requirement:** REQ-MOVES-05
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** `./?van=1` → chạm Tép Ba → `Escape`
- **Mong đợi:** không lá nào được chọn
- **Automated:** `tests/e2e/moves/tap.e2e.ts`

### TC-MOVES-007 — lá úp không chọn được

- **Requirement:** REQ-MOVES-06
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** `./?van=20260904` → chạm lá úp dưới cùng cột 7
- **Mong đợi:** không lá nào được chọn; "Hoàn lại" tắt
- **Automated:** `tests/e2e/moves/tap.e2e.ts`

### TC-MOVES-008 — bỏ lá cuối cùng đang ngửa khỏi cột thì lá úp bên dưới lật lên

- **Requirement:** REQ-MOVES-07
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** `./?van=1` → Tép Ba sang cột 7
- **Mong đợi:** cột 2 còn 1 lá, ngửa, "Tép Sáu"
- **Automated:** `tests/e2e/moves/tap.e2e.ts`

### TC-MOVES-009 — chạm chồng rút thì một lá ngửa sang bài đã rút

- **Requirement:** REQ-MOVES-08
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** `./?van=20260904` → chạm chồng rút
- **Mong đợi:** bài đã rút 1 lá ngửa; chồng rút 23; "Hoàn lại" bật
- **Automated:** `tests/e2e/moves/stock.e2e.ts`

### TC-MOVES-010 — chồng rút cạn thì chạm là lật lại toàn bộ, đúng thứ tự, lặp được mãi

- **Requirement:** REQ-MOVES-08
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 3, 4
- **Bước:** `./?van=20260904` → rút đủ 24 lá → chạm ô chồng rút trống; lặp lại hai vòng
- **Mong đợi:** sau 24 lần chồng rút 0, bài đã rút 24, lá trên cùng là lá từng nằm dưới đáy chồng rút; chạm thêm thì bài
  đã rút 0 và chồng rút có đúng thứ tự lúc chia, tất cả úp; vòng hai giống vòng một
- **Automated:** `tests/e2e/moves/stock.e2e.ts`

### TC-MOVES-011 — chế độ rút 3 lá: mỗi lần chạm ba lá sang, chỉ lá trên cùng chơi được

- **Requirement:** REQ-MOVES-08, REQ-MOVES-09
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2, 3
- **Bước:** `./?van=20260904` → chọn "Rút 3 lá" (chưa đi nước nào nên không hỏi) → chạm chồng rút → chạm lá dưới cùng
  của quạt → chạm chồng rút thêm 7 lần → chạm thêm 1 lần
- **Mong đợi:** 3 lá sang, chồng rút 21; lá dưới quạt không chọn được; sau lần thứ 8 chồng rút 0 / bài đã rút 24; lần
  thứ 9 lật lại đủ 24
- **Automated:** `tests/e2e/moves/stock.e2e.ts`

### TC-MOVES-012 — cầm một lá rồi chạm chồng rút là nước bị từ chối, không phải một lần rút

- **Requirement:** REQ-MOVES-10
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Bước:** `./?van=1` → chạm Tép Ba → chạm chồng rút
- **Mong đợi:** thế bài y nguyên (không rút lá nào); bỏ chọn; "Hoàn lại" tắt; "Nước đi không hợp lệ"
- **Automated:** `tests/e2e/moves/stock.e2e.ts`

### TC-MOVES-013 — bài đã rút không nhận lá nào

- **Requirement:** REQ-MOVES-10
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 5
- **Bước:** `./?van=1` → rút 1 lá → chạm Tép Ba → chạm bài đã rút
- **Mong đợi:** thế bài y nguyên; "Nước đi không hợp lệ"
- **Automated:** `tests/e2e/moves/stock.e2e.ts`

### TC-MOVES-014 — cột trống chỉ nhận lá Già

- **Requirement:** REQ-MOVES-11
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** `./?van=66725` → chạm Cơ Át (lên chồng đích, cột 1 trống) → Rô Năm vào cột 1 → Rô Già vào cột 1
- **Mong đợi:** Rô Năm bị từ chối, cột 1 vẫn trống; Rô Già vào cột 1 và lá úp dưới nó ở cột 7 lật lên
- **Automated:** `tests/e2e/moves/rules.e2e.ts`

### TC-MOVES-015 — chồng đích chỉ nhận đúng chất, bắt đầu từ Át, tăng đúng một bậc

- **Requirement:** REQ-MOVES-12
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2, 3
- **Bước:** `./?van=4` → Bích Hai vào chồng đích Bích (trống) → kéo Rô Át vào chồng đích Bích → kéo Rô Át vào chồng đích Rô
- **Mong đợi:** hai lần đầu bị từ chối, chồng đích Bích 0 lá; lần ba chồng đích Rô có 1 lá
- **Automated:** `tests/e2e/moves/rules.e2e.ts`

### TC-MOVES-016 — lá trên cùng của chồng đích được đưa về cột

- **Requirement:** REQ-MOVES-12
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 4
- **Bước:** `./?van=4` → chạm Rô Át (lên chồng đích Rô) → kéo nó về cột 4 (Bích Hai)
- **Mong đợi:** chồng đích Rô 0 lá; Rô Át nằm ở cột 4
- **Automated:** `tests/e2e/moves/rules.e2e.ts`

### TC-MOVES-017 — cột chỉ nhận lá kém một bậc và khác màu

- **Requirement:** REQ-MOVES-13
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** `./?van=20260904` → Rô Tám lên Cơ Tám (cùng bậc, cùng màu) → Tép Bốn lên Tép Mười (sai bậc, cùng màu)
- **Mong đợi:** thế bài y nguyên; "Hoàn lại" tắt
- **Automated:** `tests/e2e/moves/rules.e2e.ts`

### TC-MOVES-018 — một dãy đã xếp đúng đi cùng nhau khi chọn lá đầu dãy

- **Requirement:** REQ-MOVES-14
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** `./?van=23` → Bích Sáu lên Cơ Bảy (cột 4) → chạm Cơ Bảy → chạm cột 1 (Bích Tám)
- **Mong đợi:** nhãn Cơ Bảy "Cơ Bảy, kèm 1 lá bên dưới"; 2 lá được chọn; cột 1 = Bích Tám, Cơ Bảy, Bích Sáu; cột 4 còn
  3 lá, lá trên cùng ngửa
- **Automated:** `tests/e2e/moves/rules.e2e.ts`

### TC-MOVES-019 — kéo thả cho đúng kết quả như chạm

- **Requirement:** REQ-MOVES-15
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** `./?van=1` → Tép Ba sang cột 7 bằng chạm → chụp → "Chơi lại" → kéo Tép Ba sang cột 7 → chụp
- **Mong đợi:** hai lần chụp giống hệt (invariant #6)
- **Automated:** `tests/e2e/moves/drag.e2e.ts`

### TC-MOVES-020 — thả vào chỗ không hợp lệ thì bài về chỗ cũ, không đổi gì

- **Requirement:** REQ-MOVES-15
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Bước:** `./?van=1` → kéo Tép Ba thả lên cột 1 (Cơ Đầm)
- **Mong đợi:** thế bài y nguyên; đúng 52 lá (không còn bản sao bám con trỏ); không lá nào được chọn; "Hoàn lại" tắt
- **Automated:** `tests/e2e/moves/drag.e2e.ts`

### TC-MOVES-021 — kéo lá đầu dãy thì cả dãy đi theo

- **Requirement:** REQ-MOVES-14, REQ-MOVES-15
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 1
- **Bước:** `./?van=23` → kéo Bích Sáu lên cột 4 → kéo Cơ Bảy lên cột 1
- **Mong đợi:** cột 1 có 3 lá, Bích Sáu nằm ở cột 1
- **Automated:** `tests/e2e/moves/drag.e2e.ts`

### TC-MOVES-022 — kéo rồi thả lại đúng chỗ cũ thì không có nước đi và không kẹt lại gì

- **Requirement:** REQ-MOVES-16
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** `./?van=1` → nhấn Tép Ba, kéo qua ngưỡng, quay về đúng chỗ bấm, nhả
- **Mong đợi:** thế bài y nguyên; 52 lá; "Hoàn lại" tắt
- **Automated:** `tests/e2e/moves/drag.e2e.ts`

### TC-MOVES-023 — nhả chuột ngoài cửa sổ thì huỷ kéo, bài về chỗ cũ, không kẹt gì

- **Requirement:** REQ-MOVES-16
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Bước:** `./?van=1` → nhấn Tép Ba, kéo (thấy bản sao bám con trỏ: 53 lá) → đưa chuột ra ngoài cửa sổ → nhả
- **Mong đợi:** 52 lá; thế bài y nguyên; không lá nào được chọn; "Hoàn lại" tắt
- **Automated:** `tests/e2e/moves/drag.e2e.ts`

### TC-MOVES-024 — rung tay dưới 6px vẫn là một cú chạm chọn bài

- **Requirement:** REQ-MOVES-16
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 3
- **Bước:** `./?van=1` → nhấn Tép Ba, dịch 3px, nhả
- **Mong đợi:** Tép Ba được chọn; 52 lá
- **Automated:** `tests/e2e/moves/drag.e2e.ts`

### TC-MOVES-025 — thả lên vùng chồng lấn giữa hai cột thì chọn cột lấn nhiều hơn

- **Requirement:** REQ-MOVES-17
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 5
- **Bước:** `./?van=1` → nắm Tép Ba ở mép trái, nhả với con trỏ 3px trong mép phải cột 6 (lá phủ gần trọn cột 7)
- **Mong đợi:** Tép Ba vào cột 7 (Cơ Bốn)
- **Automated:** `tests/e2e/moves/drag.e2e.ts`

### TC-MOVES-026 — cú chạm đầu tiên sau một lần kéo vẫn có tác dụng

- **Requirement:** REQ-MOVES-16
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4, 5
- **Bước:** `./?van=1` → kéo Tép Ba sang cột 7 (hợp lệ) / sang cột 1 (bị từ chối) → chạm Cơ Đầm
- **Mong đợi:** Cơ Đầm được chọn ngay ở cú chạm đầu tiên
- **Automated:** `tests/e2e/moves/drag.e2e.ts`
