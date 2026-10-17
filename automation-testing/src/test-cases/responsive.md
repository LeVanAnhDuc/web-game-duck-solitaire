# RESPONSIVE — Test cases

Requirement: `docs/requirements/responsive.md` · quyết định: `docs/decisions/responsive.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.
Mỗi case chạy ở 320×720, 375×720, 768×900, 1024×768, 1440×900 (tên test kèm bề rộng).

### TC-RESPONSIVE-001 — không bao giờ cuộn ngang

- **Requirement:** REQ-RESPONSIVE-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 3
- **Bước:** mở `./?van=20260904` ở từng bề rộng
- **Mong đợi:** `scrollWidth − clientWidth ≤ 0`
- **Automated:** `tests/e2e/responsive/layout.e2e.ts`

### TC-RESPONSIVE-002 — mỗi lá và mỗi nút có vùng bấm tối thiểu 44px

- **Requirement:** REQ-RESPONSIVE-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 3
- **Bước:** đo 52 vùng `data-hit-area` và mọi nút / ô chọn trên thanh điều khiển
- **Mong đợi:** mỗi vùng ≥ 44×44px; mỗi điều khiển cao ≥ 44px
- **Automated:** `tests/e2e/responsive/layout.e2e.ts`

### TC-RESPONSIVE-003 — bảy cột nằm trọn trong màn hình, hai lề bằng nhau, hàng trên thẳng cột

- **Requirement:** REQ-RESPONSIVE-03
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 1
- **Bước:** đo ô cột 1, cột 7, chồng rút, chồng đích cuối
- **Mong đợi:** lề trái > 0, |lề trái − lề phải| ≤ 1px; x chồng rút = x cột 1; x chồng đích cuối = x cột 7
- **Automated:** `tests/e2e/responsive/layout.e2e.ts`

### TC-RESPONSIVE-004 — chơi được bằng chạm: chọn rồi đặt một lá

- **Requirement:** REQ-RESPONSIVE-04
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** `./?van=1` → chạm Tép Ba → chạm cột 7 → chạm chồng rút
- **Mong đợi:** Tép Ba ở cột 7; bài đã rút có 1 lá
- **Automated:** `tests/e2e/responsive/layout.e2e.ts`

### TC-RESPONSIVE-005 — cầm một lá rồi chạm chồng rút thì bị từ chối và bỏ lựa chọn

- **Requirement:** REQ-RESPONSIVE-05
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Bước:** `./?van=20260904` → `Tab` → `Space` → chạm lá trên cùng chồng rút
- **Mong đợi:** không lá nào được chọn; "Nước đi không hợp lệ"; bàn không đổi
- **Automated:** `tests/e2e/responsive/layout.e2e.ts`
