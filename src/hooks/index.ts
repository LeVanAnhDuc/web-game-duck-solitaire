/**
 * Barrel cho tầng hook (R-18).
 *
 * `moveIntent.ts` KHÔNG có ở đây: nó là kiểu + hàm thuần dùng chung giữa các hook,
 * không phải hook. Đưa vào barrel là biến chi tiết nội bộ thành API công khai.
 */
export * from "./useBoardMotion";
export * from "./useGame";
export * from "./useSelection";
export * from "./useReducedMotion";
