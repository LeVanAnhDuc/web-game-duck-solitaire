"use client";

// libs
import { useEffect, useState } from "react";

const MEDIA_REDUCE = "(prefers-reduced-motion: reduce)";

/** Đọc một lần, an toàn cả khi không có `window` (static export chạy lúc build). */
function read(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia(MEDIA_REDUCE).matches;
}

/**
 * `prefers-reduced-motion`, theo dõi thay đổi trong lúc đang chơi.
 *
 * Component không tự gọi `window.matchMedia` (R-19): mọi truy cập hạ tầng đi qua một
 * hook. Khác với `prefersReducedMotion()` trong `lib/motion` — hàm đó đọc MỘT lần cho
 * một quyết định tức thời, hook này còn nghe cả khi người dùng đổi cài đặt hệ thống
 * giữa ván.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(read);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const query = window.matchMedia(MEDIA_REDUCE);
    const onChange = () => setReduced(query.matches);
    query.addEventListener?.("change", onChange);
    return () => query.removeEventListener?.("change", onChange);
  }, []);

  return reduced;
}
