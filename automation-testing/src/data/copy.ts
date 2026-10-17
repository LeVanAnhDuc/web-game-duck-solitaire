// UI text, copied verbatim. Write the source next to each entry so a copy change is easy to trace:
//   UI text: ../client/src/lib/strings.ts (the game has one locale, Vietnamese, and no server messages)
// Specs assert text from here, never inline.

export type Suit = "spades" | "hearts" | "diamonds" | "clubs";

// strings.ts → SUIT_NAMES. Foundation i takes FOUNDATION_SUITS[i] = spades, hearts, diamonds, clubs.
export const SUIT_NAMES: Record<Suit, string> = {
  spades: "Bích",
  hearts: "Cơ",
  diamonds: "Rô",
  clubs: "Tép",
};
export const FOUNDATION_SUITS: readonly Suit[] = ["spades", "hearts", "diamonds", "clubs"];

// strings.ts → RANK_NAMES (1 = Át … 13 = Già)
export const RANK_NAMES = ["", "Át", "Hai", "Ba", "Bốn", "Năm", "Sáu", "Bảy", "Tám", "Chín", "Mười", "Bồi", "Đầm", "Già"];

export const copy = {
  // strings.ts → appTitle, tagline, taglineWithSignIn
  appTitle: "Duck Solitaire",
  tagline: "Không tài khoản · không quảng cáo · không lưu gì",
  taglineWithSignIn: "Không tài khoản riêng · không quảng cáo · không lưu gì",
  toolbar: {
    // strings.ts → toolbar.*
    undo: "Hoàn lại",
    restart: "Chơi lại",
    newGame: "Ván mới",
    autoComplete: "Hoàn tất",
    drawMode: "Chế độ rút",
    draw1: "Rút 1 lá",
    draw3: "Rút 3 lá",
  },
  pile: {
    // strings.ts → pile.*
    stock: "Chồng rút",
    stockEmpty: "Chồng rút đã cạn, chạm để lật lại",
    waste: "Bài đã rút",
    foundation: (suit: Suit) => `Chồng đích ${SUIT_NAMES[suit]}`,
    tableau: (index: number) => `Cột bài ${index + 1}`,
  },
  card: {
    // strings.ts → card.name / card.faceDown / card.label
    name: (suit: Suit, rank: number) => `${SUIT_NAMES[suit]} ${RANK_NAMES[rank]}`,
    faceDown: "Lá úp",
    label: (suit: Suit, rank: number, stackCount: number) =>
      stackCount > 1
        ? `${SUIT_NAMES[suit]} ${RANK_NAMES[rank]}, kèm ${stackCount - 1} lá bên dưới`
        : `${SUIT_NAMES[suit]} ${RANK_NAMES[rank]}`,
  },
  seed: {
    // strings.ts → seed.label / seed.hint
    label: (seed: number) => `Ván số ${seed}`,
    hint: "Cùng số hiệu ván luôn cho cùng thế bài",
  },
  account: {
    // strings.ts → account.*
    signIn: "Đăng nhập",
    signingIn: "Đang đăng nhập…",
    menuLabel: "Tài khoản Ducker ID",
    openProfile: "Mở hồ sơ Ducker ID",
    signOut: "Đăng xuất",
  },
  win: {
    // strings.ts → win.*
    title: "Thắng rồi!",
    body: (moves: number) => `Xong ván trong ${moves} nước đi.`,
    playAgain: "Chơi ván mới",
  },
  confirm: {
    // strings.ts → confirm.*
    drawModeTitle: "Đổi chế độ rút sẽ bắt đầu lại ván",
    drawModeBody: "Ván đang chơi sẽ bị bỏ. Vẫn đổi chứ?",
    accept: "Đổi và chia lại",
    cancel: "Giữ ván hiện tại",
  },
  a11y: {
    // strings.ts → a11y.*
    board: "Bàn bài Klondike",
    toolbar: "Thanh điều khiển",
    moveRejected: "Nước đi không hợp lệ",
    keyboardHint:
      "Dùng phím mũi tên để di chuyển giữa các chồng bài, phím cách để chọn và thả, Enter để tự tìm chỗ, Escape để bỏ chọn.",
  },
} as const;
