# MOTION — Test cases

Requirement: `docs/requirements/motion.md` · quyết định: `docs/decisions/motion.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.
Mọi case chạy với chuyển động **bật** (`test.use({ motion: "on" })`) và `page.clock`.

### TC-MOTION-001 — chia bài đầu ván bay ra so le, lá sau chờ lá trước theo thứ tự chia

- **Requirement:** REQ-MOTION-01
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 1
- **Bước:** `./?van=20260904` → chạy đồng hồ 100ms
- **Mong đợi:** 7 lá cột 7 có `transition-delay` tăng dần theo vị trí, lớn nhất > 0
- **Automated:** `tests/e2e/motion/animation.e2e.ts`

### TC-MOTION-002 — độ trễ của lần chia chỉ thuộc về lần chia; nước đi sau đó không bị trễ

- **Requirement:** REQ-MOTION-02
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** qua cửa sổ chia bài → rút 1 lá
- **Mong đợi:** lá vừa rút có `transition-delay: 0s`
- **Automated:** `tests/e2e/motion/animation.e2e.ts`

### TC-MOTION-003 — lá di chuyển bằng transform có thời lượng, không bằng top/left

- **Requirement:** REQ-MOTION-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** `./?van=20260904`, qua cửa sổ chia → đọc style lá trên cùng cột 7
- **Mong đợi:** `transition-property` có `transform`, thời lượng ≠ 0; `top`/`left` = 0px; vị trí là `translate(…)`
- **Automated:** `tests/e2e/motion/animation.e2e.ts`

### TC-MOTION-004 — lá úp được lật bằng một phép quay, không bị tráo

- **Requirement:** REQ-MOTION-04
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** `./?van=1` → đọc mặt trong lá úp cột 2 → chạm đúp Tép Ba
- **Mong đợi:** trước `rotateY(180deg)` có thời lượng; sau, cùng lá đó ngửa và `rotateY(0deg)`
- **Automated:** `tests/e2e/motion/animation.e2e.ts`

### TC-MOTION-005 — lá đang bay được nâng lên trên và không nhận thao tác cho tới khi đáp

- **Requirement:** REQ-MOTION-05
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 4, 6
- **Bước:** rút 1 lá (đồng hồ đứng yên) → chạy 300ms
- **Mong đợi:** lúc bay `pointer-events: none`, `z-index` cao hơn lá đang nằm yên; sau khi đáp nhận thao tác lại
- **Automated:** `tests/e2e/motion/animation.e2e.ts`

### TC-MOTION-006 — một dãy bay so le theo độ sâu

- **Requirement:** REQ-MOTION-06
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 2
- **Bước:** `./?van=23` → Bích Sáu lên Cơ Bảy → dãy Cơ Bảy sang cột 1
- **Mong đợi:** `transition-delay` của Bích Sáu > của Cơ Bảy
- **Automated:** `tests/e2e/motion/animation.e2e.ts`

### TC-MOTION-007 — lá đang cầm được nâng lên

- **Requirement:** REQ-MOTION-07
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 4
- **Bước:** chạm Cơ Tám
- **Mong đợi:** trước không có `scale(`; sau `transform` có `scale(1.04)`
- **Automated:** `tests/e2e/motion/animation.e2e.ts`

### TC-MOTION-008 — nước bị từ chối: lá nguồn lắc, chồng đích nháy đỏ, rồi thôi

- **Requirement:** REQ-MOTION-08
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Bước:** `./?van=1` → Tép Ba lên cột 1 (bị từ chối) → chạy 500ms
- **Mong đợi:** lúc đầu lá và ô cột 1 đều có `animation-name` ≠ none; sau 500ms cả hai về none
- **Automated:** `tests/e2e/motion/animation.e2e.ts`

### TC-MOTION-009 — chồng đích nảy lên khi nhận lá

- **Requirement:** REQ-MOTION-09
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 1
- **Bước:** `./?van=66725` → chạm Cơ Át → chạy 300ms
- **Mong đợi:** ô chồng đích Cơ: none → có animation → none
- **Automated:** `tests/e2e/motion/animation.e2e.ts`
