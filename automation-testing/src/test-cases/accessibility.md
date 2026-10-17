# ACCESSIBILITY — Test cases

Requirement: `docs/requirements/accessibility.md` · quyết định: `docs/decisions/accessibility.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.

### TC-ACCESSIBILITY-001 — mỗi lá có nhãn đọc được: tên lá khi ngửa, "Lá úp" khi úp, số lá đi kèm khi là đầu dãy

- **Requirement:** REQ-ACCESSIBILITY-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1, 2
- **Bước:** `./?van=23` → đọc nhãn cả 52 lá → Bích Sáu lên Cơ Bảy
- **Mong đợi:** lá úp "Lá úp", lá ngửa "<chất> <hạng>"; sau nước đi "Cơ Bảy, kèm 1 lá bên dưới" và "Bích Sáu"
- **Automated:** `tests/e2e/accessibility/screen-reader.e2e.ts`

### TC-ACCESSIBILITY-002 — lá đang cầm được đọc là "đang chọn" và có trạng thái nhấn

- **Requirement:** REQ-ACCESSIBILITY-02
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** `./?van=20260904` → chạm Cơ Tám
- **Mong đợi:** trước `aria-pressed="false"`; sau nhãn "Cơ Tám, đang chọn", `aria-pressed="true"`
- **Automated:** `tests/e2e/accessibility/screen-reader.e2e.ts`

### TC-ACCESSIBILITY-003 — mỗi chồng là một vùng có tên, bàn bài và thanh điều khiển cũng vậy

- **Requirement:** REQ-ACCESSIBILITY-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** `./?van=20260904`
- **Mong đợi:** 13 vùng tên đúng trỏ đúng chồng; chồng đích trống chứa "trống"; "Bàn bài Klondike", "Thanh điều khiển";
  `<html lang="vi">`
- **Automated:** `tests/e2e/accessibility/screen-reader.e2e.ts`

### TC-ACCESSIBILITY-004 — mỗi chồng nhận đúng các lá của nó qua aria-owns

- **Requirement:** REQ-ACCESSIBILITY-04
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 1
- **Bước:** `./?van=20260904` → rút 3 lá → đọc `aria-owns` của 13 chồng
- **Mong đợi:** mỗi chồng trỏ đúng số lá nó có, và mỗi id trỏ tới một lá của chính chồng đó
- **Automated:** `tests/e2e/accessibility/screen-reader.e2e.ts`

### TC-ACCESSIBILITY-005 — chồng rút cạn tự đổi tên và hiện dấu lật lại; chồng đích trống thì không

- **Requirement:** REQ-ACCESSIBILITY-05
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 3, 4
- **Bước:** `./?van=20260904` → rút hết 24 lá → chạm ô chồng rút
- **Mong đợi:** lúc cạn có dấu lật lại và tên "Chồng rút đã cạn, chạm để lật lại"; 4 chồng đích không có dấu; sau khi lật
  lại dấu mất, tên về "Chồng rút"
- **Automated:** `tests/e2e/accessibility/screen-reader.e2e.ts`

### TC-ACCESSIBILITY-006 — nước bị từ chối được đọc lên qua vùng thông báo, kể cả khi chuyển động tắt và hai lần liền

- **Requirement:** REQ-ACCESSIBILITY-06
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 5
- **Bước:** `./?van=20260904` (chuyển động tắt) → tiêu điểm chồng đích Bích trống → `Space` → `Space`
- **Mong đợi:** vùng `aria-live="polite"` từ "" thành "Nước đi không hợp lệ"; lần hai phần tử chữ cũ bị thay bằng phần tử mới
- **Automated:** `tests/e2e/accessibility/screen-reader.e2e.ts`

### TC-ACCESSIBILITY-007 — lá đang cầm đeo vòng màu vẽ thật, không chỉ một cái bóng

- **Requirement:** REQ-ACCESSIBILITY-07
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 6
- **Bước:** `Tab` → `Space`
- **Mong đợi:** lá được cầm có `box-shadow` chứa `rgb(255, 209, 102)`
- **Automated:** `tests/e2e/accessibility/screen-reader.e2e.ts`

### TC-ACCESSIBILITY-008 — chuyển động tắt thì không lá nào có transition, lá ở ngay chỗ của nó

- **Requirement:** REQ-ACCESSIBILITY-08
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** `./?van=20260904` với `prefers-reduced-motion: reduce` → rút 1 lá
- **Mong đợi:** `transition-property` của cả 52 lá là `none`; lá trên cùng cột 7 nằm đúng x của cột 7; lá vừa rút nằm
  đúng x của bài đã rút
- **Automated:** `tests/e2e/accessibility/screen-reader.e2e.ts`
