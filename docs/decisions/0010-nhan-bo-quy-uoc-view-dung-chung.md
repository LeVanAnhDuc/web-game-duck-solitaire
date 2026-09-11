# ADR-0010 · Nhận bộ quy ước view dùng chung của workspace `web-game`

> **Ngày:** 2026-09-11
> **Trạng thái:** accepted
> **Liên quan:** ADR-0003 · ADR-0009 · [`docs/code-conventions.md`](../code-conventions.md)

## 1. Bối cảnh

Bộ quy ước dùng chung rút từ `quapp-developer-frontend`, đã lọc qua năm lần áp thật
trước khi tới đây.

Repo này không có tầng `views/`, và `components/GameBoard.tsx` phình tới **562 dòng** —
file lớn nhất của cả workspace. Trong đó có ba `useEffect` làm ba việc không liên quan
gì nhau: chạy nhịp auto-complete, diễn hoạt cảnh thắng, và dịch focus theo con trỏ bàn
phím. Ba việc đó không vẽ gì cả; chúng chỉ nằm đó vì không có chỗ nào khác để đặt.

`WinOverlay` còn gọi thẳng `window.matchMedia` và tự gắn listener.

## 2. Quyết định

Theo [`docs/code-conventions.md`](../code-conventions.md):

- `GameBoard` → `views/Home/index.tsx`, đổi tên hàm thành `Home`; `app/page.tsx` gọi
  view.
- `BoardLayer` · `Toolbar` → `mains/` (khối cấu trúc). `CardView` · `PileSlot` ·
  `WinOverlay` → `components/` (mảnh hiển thị, hai cái đầu dựng lại 52 lần).
- Ba effect → ba ghost: `AutoCompleteRunner` · `CelebrateWin` · `FocusActivePile`.
- `window.matchMedia` ra khỏi `WinOverlay`, thành hook `useReducedMotion` (R-19).
  Khác `prefersReducedMotion()` ở `lib/motion`: hàm đó đọc một lần cho một quyết định
  tức thời, hook còn **nghe** cả khi người dùng đổi cài đặt hệ thống giữa ván.
- `CardViewProps` · `ToolbarProps` viết inline (R-16); test lấy kiểu bằng
  `Parameters<typeof X>[0]`.
- Thêm barrel `hooks/index.ts`, năm luật ESLint chung, `.githooks/pre-commit`.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Để ba effect ở lại, chỉ chia nhỏ JSX | Cái đắt của file 562 dòng không phải JSX. Ba effect kia mỗi cái là một vòng đời riêng, và đọc chúng cạnh nhau làm người đọc tưởng chúng liên quan |
| Truyền arrow inline cho ghost | `AutoCompleteRunner` đặt lại timer mỗi khi callback đổi, nên arrow inline sẽ kéo dài mỗi bước auto-complete. Callback phải `useCallback` |
| Dùng `prefersReducedMotion()` sẵn có cho `WinOverlay` | Hàm đó không nghe thay đổi. Người dùng bật "giảm chuyển động" giữa ván sẽ vẫn thấy hoạt cảnh chạy tới hết |
| Giữ `pileKey` suy từ `focusedPile` cho ghost focus | `focusedPile` có giá trị dự phòng `TABLEAU[0]`, còn effect gốc **bỏ qua** khi con trỏ không nằm trên chồng thật. Dùng giá trị dự phòng sẽ dịch focus tới chỗ người chơi không yêu cầu |

## 4. Hệ quả

**Được:**
- `views/Home/index.tsx` không còn `useEffect` nào; ba vòng đời có tên riêng.
- Đổi cài đặt giảm-chuyển-động giữa ván giờ có tác dụng ngay.

**Mất / phải chấp nhận:**
- **Thứ tự ghost trong JSX = thứ tự chạy effect**, và ghost phải render **vô điều
  kiện**. Xê dịch ba dòng ghost là đổi thứ tự ba vòng đời, mà test vẫn xanh.
- `onPlay` / `onExhausted` / `onCelebrating` **buộc** phải ổn định. Thay bằng arrow
  inline không làm UI sai — chỉ làm auto-complete chậm đi, và không có test nào thấy.
