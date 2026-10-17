# WIN — Test cases

Requirement: `docs/requirements/win.md` · quyết định: `docs/decisions/win.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.
Cả ba case chơi lại ván thắng được (`src/data/winnable.ts`) bằng kéo thả ở 1440×1600, mất khoảng một phút mỗi case.

### TC-WIN-001 — "Hoàn tất" bật đúng lúc lá úp cuối cùng lật lên và đưa ván tới màn thắng

- **Requirement:** REQ-WIN-01, REQ-WIN-02, REQ-WIN-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1, 3
- **Bước:** mở ván → chơi lại từng nước (kiểm số lá mỗi chồng sau mỗi nước) → "Hoàn tất"
- **Mong đợi:** nút tắt lúc chia và ngay trước nước cuối, bật sau nước cuối; màn "Thắng rồi!" hiện; 4 chồng đích × 13 lá,
  Át dưới Già trên, đúng chất; "Xong ván trong N nước đi." với N ≥ số nước kịch bản + số lá còn phải lên
- **Automated:** `tests/e2e/win/replay.e2e.ts`

### TC-WIN-002 — hoàn lại hay ván mới giữa chuỗi tự hoàn tất thì chuỗi dừng ngay

- **Requirement:** REQ-WIN-05
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4, 5
- **Bước:** (đồng hồ giả) chơi lại tới lúc mọi lá ngửa → "Hoàn tất" → chạy 400ms → "Hoàn lại" → chạy 3s → "Hoàn tất" →
  chạy 400ms → "Ván mới" → chạy 3s
- **Mong đợi:** chuỗi đã chạy (thêm lá lên chồng đích); sau "Hoàn lại" thế bài đứng yên, không thắng; sau "Ván mới" ván
  mới đứng yên, "Hoàn lại" tắt
- **Automated:** `tests/e2e/win/replay.e2e.ts`

### TC-WIN-003 — "Chơi ván mới" trên màn thắng chia một ván khác

- **Requirement:** REQ-WIN-03, REQ-WIN-04
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** chơi tới màn thắng → "Chơi ván mới"
- **Mong đợi:** màn thắng có tiêu điểm; sau khi bấm màn đóng, số hiệu khác, chồng đích trống, chồng rút 24, "Hoàn lại" tắt
- **Automated:** `tests/e2e/win/replay.e2e.ts`
