# Thiết kế · Tầng lá phẳng, hiệu ứng, và một chạm

> **Liên quan:** FR-04 · FR-05 · FR-06 · FR-08 · FR-11 · FR-12 · FR-14
> · NFR-PERF-02 · NFR-PERF-05 · NFR-A11Y-02 · NFR-A11Y-03 · NFR-A11Y-04 · NFR-A11Y-05 · NFR-REL-03
> · ADR-0003 · ADR-0009
> **Ngày:** 2026-09-07

Hai yêu cầu, một nguyên nhân chung. Muốn lá bài **bay** giữa các chồng thì không thể để mỗi chồng sở hữu lá của nó — lá đi từ cột 3 sang foundation là unmount khỏi cây DOM này và mount vào cây kia, và CSS transition không có gì để nội suy. Nên tài liệu này đổi tầng vẽ trước, rồi mười hiệu ứng và luật một-chạm mới thành ra rẻ.

Luật chơi không bị chạm tới. `applyMove` vẫn là nơi duy nhất đổi thế bài, `MoveIntent` vẫn là đường duy nhất, `history` vẫn là seed cộng danh sách nước đi.

## 1. Hai lớp thay cho hai hàng grid

```
  ┌─ BoardLayer ─────────────────────────────┐   52 CardView, position: absolute
  │   toạ độ mỗi lá = calc() từ GameState    │   thứ tự DOM CỐ ĐỊNH, xếp lớp bằng z-index
  └──────────────────────────────────────────┘
  ┌─ PileSlot × 13 ──────────────────────────┐   vùng thả · nhãn · viền chồng rỗng
  │   grid 7 cột, không chứa lá nào          │   tiêu điểm bàn phím
  └──────────────────────────────────────────┘
```

**52 lá render theo một thứ tự DOM cố định** — thứ tự của `createDeck()` — và lá nào nằm trên lá nào **chỉ do `z-index`**. React do đó không bao giờ chèn, xoá hay đổi chỗ một node nào trong suốt ván. Không remount thì không mất transition, và bất biến 8 (`key` là `card.id`) chuyển từ một lời hứa thành một điều không thể vi phạm.

| Module | Đổi gì | Trách nhiệm sau khi đổi |
| --- | --- | --- |
| `lib/layout.ts` | **mới** | Từ `GameState` ra toạ độ `calc()`, mặt ngửa/úp và thứ tự vẽ của từng lá. Thuần, không React |
| `components/BoardLayer.tsx` | **mới** | Một container tuyệt đối; map `placements` ra `CardView`. Không biết luật, không biết cử chỉ |
| `components/PileSlot.tsx` | thay `PileView` | Vùng thả, `aria-label`, `aria-owns`, viền chồng rỗng, tiêu điểm bàn phím. **Không vẽ lá** |
| `components/CardView.tsx` | sửa | `offsetTop/offsetLeft` → `x/y/z`; hai mặt bài cùng tồn tại để lật được |
| `components/GameBoard.tsx` | sửa | Bày hai lớp; điều phối như cũ |
| `game/auto.ts` | thêm 1 hàm | `findFoundationTarget` — thứ một chạm cần |
| `hooks/useGame.ts`, `hooks/useSelection.ts` | không đổi ranh giới | `useSelection` thêm một mốc chặn, xem §4 |
| `game/cards.ts`, `state.ts`, `deal.ts`, `moves.ts` | **không đổi** | Luật không liên quan tới chuyện lá được vẽ ở đâu |

```ts
// src/lib/layout.ts
export type CardPlacement = {
  card: Card;
  pile: PileId;          // cho aria-owns và cho selector E2E
  indexInPile: number;
  faceUp: boolean;
  stackCount: number;    // bao nhiêu lá đi theo nó — cho aria-label
  x: string;             // "calc(3 * (var(--card-w) + var(--gap-x)))"
  y: string;
  z: number;
  dealOrder: number;     // thứ tự chia bài, cho hiệu ứng chia bài
};

export function placements(state: GameState): CardPlacement[];   // đúng 52, theo thứ tự bộ bài
export function pileHeight(state: GameState, pile: PileId): string;
export function pileOrigin(pile: PileId): { x: string; y: string };
```

## 2. Toạ độ

`BoardLayer` canh giữa, bề rộng `calc(7 * var(--card-w) + 6 * var(--gap-x))`. Trong đó mọi toạ độ là `calc()` — **không con số pixel nào do JS đo**, nên bố cục đúng ở mọi bề rộng mà không cần resize listener.

| Cái gì | x | y |
| --- | --- | --- |
| Cột `i` | `calc(i * (var(--card-w) + var(--gap-x)))` | tuỳ hàng |
| Hàng trên: stock cột 0, waste cột 1, cột 2 trống, foundation cột 3–6 | như trên | `0px` |
| Hàng tableau | như trên | `calc(var(--card-h) + var(--gap-y))` |
| Lá thứ `n` của cột tableau, có `d` lá úp và `u` lá ngửa nằm dưới nó | x của cột | `calc(<y hàng> + d * var(--overlap-down) + u * var(--overlap-up))` |
| Lá thứ `k` trong nan quạt waste (draw‑3) | `calc(<x cột 1> + k * var(--overlap-up))` | `0px` |

Token mới trong `MASTER.md` §3: **`--gap-y`** = `16px / 24px / 32px`. Hôm nay giá trị đó là `gap-4` của Tailwind nằm lẫn trong class — một giá trị thị giác không có trong `MASTER.md`, tức là đúng loại thứ mà file đó tồn tại để chặn.

`PileSlot` mất nguồn chiều cao tự nhiên nên `layout.ts` trả nó ra. Hai thứ phụ thuộc chiều cao đó và cả hai là lý do nó không được đoán: **vùng thả** phải phủ toàn bộ cột kể cả khoảng trống dưới lá cuối, và **ô lưới** phải chiếm đủ chỗ để cột dài nhất không đè thanh công cụ.

**Thứ tự vẽ.** `z = pileBase + indexInPile`, `pileBase` cách nhau 100. Cái này lo chuyện trong một chồng. Nó **không** lo được lá đang bay: lá rời cột 1 (index 5) sang cột 3 (index 2) mang `z` của đích, thấp hơn các lá index 3–5 của cột 2 mà nó bay ngang qua, nên mắt thấy lá lặn xuống rồi trồi lên.

`BoardLayer` vì thế giữ **một mẩu state tạm duy nhất**: so `placements` lần này với lần trước; lá nào đổi chồng thì được nâng `z` lên trên tất cả trong đúng `--dur-move` rồi trả về `z` cơ sở. Đây là **chỗ duy nhất trong toàn bộ tầng vẽ biết rằng có thứ gì đang chuyển động**, và là ngoại lệ duy nhất với "toạ độ suy ra từ state": `z` của lá đang bay là hàm của *state trước đó*. Nó không vào `history`, không ảnh hưởng luật, mất đi thì game vẫn đúng — chỉ xấu.

Việc nâng `z` đó có một cái giá phải trả ngay, và nó là một lỗi thật đã xảy ra: lá được
nâng lên trên tất cả cũng **che vùng bấm** của những lá khác trong cùng cột, nên trong
`--dur-move` sau mỗi nước, cú bấm nhắm vào một lá giữa cột lại rơi vào lá vừa bay. Nên
**lá đang bay thôi nhận thao tác** (bất biến 13) — thứ đang lơ lửng thì không phải thứ
để cầm — và khi tắt hiệu ứng thì không nâng `z` gì cả, vì không có gì đang bay.

## 3. Chuyển động: `transform`, không phải `top/left`

Mỗi lá đặt tại `top: 0; left: 0` và dời bằng `transform: translate(x, y)`. `top/left` sẽ bắt trình duyệt tính lại bố cục mỗi khung hình cho 52 phần tử; `transform` thì hợp thành ở tầng compositor. Đây là điều kiện để NFR-PERF-02 (< 100ms mỗi nước trên máy tầm trung) không bị chính hiệu ứng phá.

Lật bài cần một `rotateY` **không** được trộn vào cùng chuỗi transform với `translate`, nên `CardView` có hai tầng:

```
<div id="card-hearts-12" data-card="hearts-12" data-face="up"    ← translate(x,y) + scale khi được cầm
     data-card-pile="tableau-3" data-index="4" aria-label="Cơ Đầm">
  <div class="card-inner">                                        ← rotateY(0deg | 180deg)
    <div class="card-face-front" aria-hidden="true">…</div>
    <div class="card-face-back"  aria-hidden="true">…</div>
  </div>
  <span data-hit-area>…</span>                                    ← vùng chạm 44px, không quay
</div>
```

`data-card-pile` chứ không phải `data-pile`: `PileSlot` giữ tên đó, và một thuộc tính
mang cả nghĩa "đây là một chồng" lẫn "lá này thuộc một chồng" làm mọi selector nhập
nhằng. `data-index` phải có vì **thứ tự DOM giờ là thứ tự bộ bài, không phải thứ tự xếp
lớp** — "lá cuối trong DOM" thôi nghĩa là "lá trên cùng".

Hai mặt bài **luôn cùng tồn tại** trong DOM, phân biệt bằng `backface-visibility: hidden`. 104 phần tử mặt bài là chuyện nhỏ với trình duyệt, và nó đổi việc lật từ "đổi cây DOM giữa animation" thành một phép quay. Cả hai mặt `aria-hidden`; nhãn nằm trên phần tử ngoài như hiện nay, nên trình đọc màn hình không bao giờ đọc được mặt đang úp.

## 4. Một chạm, hai chạm

```ts
// src/game/auto.ts
export function findFoundationTarget(s: GameState, from: PileId): Move | null;
```

Chỉ tìm foundation, không bao giờ trả nước đi vào tableau. Nó phải nằm trong engine vì nó là câu hỏi về luật; component tự trả lời là có hai bản luật (bất biến 6).

| Cử chỉ | Làm gì | Nếu không được |
| --- | --- | --- |
| **Một chạm lên lá** | `findFoundationTarget` — đi lên chồng đích được thì bay lên | Rơi về hành vi cũ: chọn lá, và cả dãy dưới nó nếu là tableau |
| **Hai chạm lên lá** | `findAutoTarget` — foundation, rồi tableau, rồi cột trống | Nháy đỏ chồng nguồn, bỏ chọn |
| **Chạm chồng khi đang cầm lá** | Không đổi: phát `MoveIntent` | Nháy đỏ chồng đích, bỏ chọn |
| **Kéo thả** | Không đổi một dòng | Không đổi |
| **`Space` / `Enter` / mũi tên** | Không đổi. `Enter` vẫn là `findAutoTarget` | Không đổi |

Bàn phím **cố ý không** phân biệt một-nhấn/hai-nhấn: sự phân biệt đó là đặc thù của ngón tay, còn `Enter` đã mang nghĩa "tìm cho lá này một chỗ". Thêm một tổ hợp chỉ để đối xứng là thêm thứ phải học mà không thêm khả năng.

**Không cần timer chờ cú thứ hai.** Trình duyệt bắn `click` ngay ở cú đầu rồi `click` + `dblclick` ở cú sau, nên hai cử chỉ cùng tồn tại sẵn — chỗ vẽ lá đã nối cả hai móc từ trước.

**Nhưng cần một cái chặn.** Khi cú chạm đầu thành công, lá rời khỏi chỗ đang bị chạm; cú thứ hai rơi xuống lá nằm dưới và **chọn** nó. Việc chọn thì vô hại, nhưng nó dựng sẵn cái bẫy: chạm đúp lên Át → Át bay lên, lá dưới bị chọn → chạm tiếp vào một chồng là **đi một nước không ai muốn đi**. Nên `useSelection` giữ một mốc thời gian: sau một nước đi sinh ra từ *một chạm*, cú `click` kế tiếp trong **300ms** bị bỏ qua. Đây là timer duy nhất trong toàn lớp tương tác.

## 5. Mười hiệu ứng

Token thời lượng lấy từ `MASTER.md` §4; hai token mới: `--stagger-run: 20ms` và `--stagger-deal: 25ms`.

| # | Hiệu ứng | Làm bằng gì | Cần state? |
| --- | --- | --- | --- |
| 1 | Lá trượt giữa các chồng | `transition: transform var(--dur-move) var(--ease-move)` | không |
| 2 | Dãy nhiều lá bay so le | `transition-delay: calc(depth * var(--stagger-run))`, `depth` từ `indexInPile` | không |
| 3 | Chuỗi Hoàn tất bay liên tiếp | Đã có sẵn: `AUTO_STEP_MS` 110ms < `--dur-move` 180ms nên các chuyến bay gối nhau thành một dòng | không |
| 4 | Nước bị từ chối | **Lá nguồn lắc `±3px` 200ms**, cộng với nháy đỏ chồng đích đã có. Áp cho cả chạm lẫn kéo | có — 1 cờ tạm trong `GameBoard` |
| 5 | Lật lá | `rotateY` trên `.card-inner`, `var(--dur-flip)` — token 220ms hôm nay **khai báo mà không dùng** | không |
| 6 | Chia bài đầu ván | Khung đầu: mọi lá ở `pileOrigin(stock)` không transition. Khung sau: toạ độ thật + `transition-delay: calc(dealOrder * var(--stagger-deal))` | có — 1 cờ trong `BoardLayer` |
| 7 | Lá đang cầm được nâng | `scale(1.04)` nối vào chuỗi transform + bóng đổ | không (đã có `selected`) |
| 8 | Foundation nảy khi nhận lá | `@keyframes` trên `PileSlot`; kích khi lá mới đổi chồng có đích là foundation — **dùng lại đúng phép so `placements` của §2** | không thêm |
| 9 | Bài đã rút quét về chồng rút | **Miễn phí**: `recycle` đổi toạ độ cả xấp, chúng tự bay về | không |
| 10 | Bốn foundation sáng lần lượt khi thắng | `animation-delay: calc(i * 120ms)`; `WinOverlay` mount sau 500ms | có — 1 timer trong `GameBoard` |

Ba thứ không phải hiệu ứng nhưng là giá của chúng, và không phải tuỳ chọn:

- **Lá đang bay không chặn thao tác tiếp theo.** State đổi ngay khi nước đi hợp lệ; hiệu ứng chỉ là phần vẽ bắt kịp. Người chơi đi nhanh thì chuyến bay bị cắt giữa đường, và lá **bay tiếp từ chỗ đang hiển thị** — CSS transition khi đổi đích giữa đường nội suy tiếp từ giá trị hiện tại, nên đây là hành vi mặc định chứ không phải thứ phải viết.
- **Chuỗi Hoàn tất vẫn huỷ được** (bất biến 9). Không đổi: nó vẫn hỏi engine từng nhịp.
- **Mọi hiệu ứng tắt sạch dưới `prefers-reduced-motion`** — xem §6.

Một chỗ khác với dự định ban đầu, ghi lại vì lý do đáng giữ: hiệu ứng (4) định cho **bản
xem trước lúc kéo bay về đúng chỗ lá** rồi mới tan. Muốn biết "chỗ lá" thì phải đo
`getBoundingClientRect` của lá thật, tức là thêm một lớp đo cho một hiệu ứng duy nhất.
Lá nguồn lắc tại chỗ nói đúng cùng một điều — *lá này không đi đâu cả* — mà không cần
đo gì, và nó áp được cho cả cú chạm chứ không riêng cú kéo.

## 6. Trợ năng

`aria-owns`. Lá không còn nằm trong `PileSlot`, nên cây trợ năng mất quan hệ "chồng chứa lá". `PileSlot` khai `aria-owns` liệt kê `id` các lá của nó (`card-hearts-12`), dựng lại đúng quan hệ đó. Mỗi `CardView` do đó cần một `id` ổn định — nó đã có `card.id`.

`prefers-reduced-motion: reduce`. `globals.css` đặt **`transition-property: none`** và
`animation: none` bằng một luật `*` — **không phải** `transition-duration: 0.01ms` như
cách quen dùng. Lý do không phải thẩm mỹ: một transition đã khởi động thì giá trị của
nó đang được nội suy, nên lá vừa đổi chỗ sẽ báo về **vị trí nó đang rời đi** cho tới khi
trình duyệt vẽ khung hình kế. Với người đã xin đừng làm nó chuyển động thì đó là sai, và
nó cũng làm bàn bài không đo được trong một trình duyệt không paint. Hai thứ là máy trạng thái JS chứ không phải CSS nên phải tự tắt: **chia bài** (bỏ hẳn khung xuất phát, vẽ luôn vị trí thật) và **màn thắng** (mount `WinOverlay` ngay, không chờ 500ms, không sáng lần lượt). Dùng lại đúng helper `prefersReducedMotion()` mà `WinOverlay` đang có — chuyển nó ra `src/lib/motion.ts` để hai chỗ dùng chung thay vì chép.

Không đổi: tiêu điểm vẫn ở `PileSlot` với roving tabindex, vùng chạm vẫn ≥ 44px, nhãn vẫn từ `strings.ts`. Các trạng thái mới (nâng lá, nảy, sáng) đều là **bổ trợ** — không có thông tin nào chỉ truyền được bằng chuyển động.

## 7. Kiểm thử

**Vitest — `layout.ts`** (thuần, không render):
- Luôn đúng 52 placement, mỗi `card.id` xuất hiện đúng một lần, thứ tự trả về là thứ tự bộ bài bất kể thế bài.
- Toạ độ khớp công thức của §2 cho cả bốn loại chồng, ở cả draw‑1 và draw‑3.
- `faceUp` khớp `down`/`up` của state — cùng một sự thật, không có cờ thứ hai (ADR‑0002).
- `z` tăng dần trong một chồng; hai chồng khác nhau không chồng dải `z`.
- `pileHeight` khớp công thức; cột rỗng ra `var(--card-h)`.
- `dealOrder` là một hoán vị của 0..51.

**Vitest — component:**
- `CardView`: hai mặt cùng có trong DOM; `data-face` đúng; `aria-label` đúng và hai mặt đều `aria-hidden`; vùng chạm ≥ 44px; `transform` chứa cả `translate` lẫn `scale` khi được chọn.
- `PileSlot`: `aria-owns` liệt kê đúng id các lá của chồng; viền hiện khi rỗng; nháy khi bị từ chối.
- `useSelection`: cú `click` trong 300ms sau một nước đi từ một chạm bị bỏ qua; ngoài 300ms thì không.
- `BoardLayer`: lá đổi chồng được nâng `z` rồi trả về; dưới reduced‑motion không có khung xuất phát chia bài.

**Vitest — `auto.ts`:** `findFoundationTarget` không bao giờ trả đích tableau; trả `null` khi không foundation nào nhận; nhất quán với `findAutoTarget` ở phần foundation.

**Playwright:**
- Selector đổi từ `[data-pile] [data-card]` sang `[data-card][data-pile="…"]`. Sửa ở `helpers.ts` và ba spec — việc máy móc, không viết lại test.
- Mới: một chạm lên con Át đưa nó lên foundation; một chạm lên lá không có chỗ trên foundation thì chỉ chọn; hai chạm đưa được lá sang tableau; cú chạm ngay sau một nước đi-bằng-một-chạm không sinh nước đi thứ hai.
- **`win.spec.ts` chuyển sang phát lại bằng kéo thả.** Bắt buộc: với luật một chạm, click lên một lá đi được lên foundation sẽ **đi luôn**, làm lệch kịch bản 573 nước. Kéo thả không nhập nhằng. Đổi lại, nó **trả nốt món nợ "E2E chơi hết ván bằng kéo thả"** đang ghi trong `backlog.md`.
- Mới: dưới `reducedMotion: 'reduce'`, ván hiện ra không qua hiệu ứng chia bài và màn thắng mở ngay.
- Giữ nguyên: không cuộn ngang ở 320/375/768/1440, vùng chạm ≥ 44px, console sạch, không request mạng, `localStorage` trống.

**Ngưỡng:** `yarn check:bundle` phải vẫn dưới 150KB gzip (hôm nay 110KB). Hiệu ứng là CSS, nên phần tăng là `layout.ts` cộng `BoardLayer` — dự kiến vài KB.
