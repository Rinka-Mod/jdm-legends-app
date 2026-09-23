/**
 * JDM LEGENDS — Ngữ cảnh giao diện.
 * Cho phép topbar PC và phím tắt "/" gọi tới ô tìm kiếm của Thư viện dù
 * chúng nằm ở hai nhánh cây component khác nhau.
 *
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

import { createContext, useCallback, useContext, useMemo, useRef } from "react";
import type { ReactNode } from "react";

interface UiContextValue {
  /** Thư viện đăng ký hàm focus ô tìm kiếm của nó. */
  registerSearchFocus: (fn: (() => void) | null) => void;
  /** Gọi hàm đó (nếu có). Trả về false khi Thư viện chưa được mount. */
  focusSearch: () => boolean;
}

const UiContext = createContext<UiContextValue | null>(null);

export function UiProvider({ children }: { children: ReactNode }) {
  const focusRef = useRef<(() => void) | null>(null);

  const registerSearchFocus = useCallback((fn: (() => void) | null) => {
    focusRef.current = fn;
  }, []);

  const focusSearch = useCallback(() => {
    if (!focusRef.current) return false;
    focusRef.current();
    return true;
  }, []);

  const value = useMemo(
    () => ({ registerSearchFocus, focusSearch }),
    [registerSearchFocus, focusSearch],
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi(): UiContextValue {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error("useUi phải được dùng bên trong <UiProvider>.");
  return ctx;
}
