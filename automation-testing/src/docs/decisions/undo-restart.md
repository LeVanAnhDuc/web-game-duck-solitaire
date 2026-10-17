# UNDORESTART — Quyết định

Đi cặp với `docs/requirements/undo-restart.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-07, FR-09), `docs/01-product/journeys.md` (US-04 + "Điều gì có thể
  sai": rút 3 và lá đã lật; US-05), `docs/decisions/0001-seed-va-undo-bang-phat-lai.md`,
  `docs/03-design/invariants.md` (#2, #4, #5), `README.md` §Features ("Unlimited undo, back to the first move").
- **Code:** `client/src/hooks/useGame.ts` (`undo` cắt phần tử cuối của `history`, `restart` xoá `history`, giữ
  `seed` và `drawMode`), `client/src/views/Home/index.tsx` (`onUndo` / `onRestart` gọi `stopAuto` + `selection.clear`).
- **Test đã gom (gợi ý):** `src/tests/e2e/moves/tap-and-drag.e2e.ts` — "undo and restart" (3 case) viết lại ở đây thành
  `undo.e2e.ts`.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** "Không giới hạn" (FR-07) kiểm bằng 30 nước (một vòng chồng rút, lần lật lại, 4 lần rút, một nước cột) rồi 30 lần
  hoàn lại về đúng lúc chia — đủ để vượt mọi trần kiểu 10/20 nước, đủ nhanh cho một test.
- **Q2** "Chơi lại" không hỏi trước khi bỏ ván dở (code không hỏi; US-05 chỉ đòi hỏi trước khi **đổi chế độ rút**). Ghi
  thành hành vi mong muốn, không phải bug.
- **Q3** "Thế bài" so bằng id + chồng + vị trí + mặt của cả 52 lá đọc từ DOM.

## Tài khoản test

Không có.

## Ngoài phạm vi

- NFR-PERF-06 (phát lại 300 nước < 16ms): benchmark trong Vitest của app, không đo được có nghĩa qua trình duyệt.

## Tech debt liên quan

_(không có)_
