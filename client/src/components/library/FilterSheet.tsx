/**
 * JDM LEGENDS — Bottom sheet bộ lọc (mobile).
 *
 * Chỉ dùng ở ≤860px. Toàn bộ nội dung lọc được truyền vào qua `children` nên
 * sheet không cần biết gì về hình dạng của bộ lọc — nhờ vậy trên PC cùng thanh
 * công cụ đó vẫn nằm trong luồng trang mà không phải nhân đôi giao diện.
 *
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

import type { ReactNode } from "react";

export function FilterSheet({
  open,
  onClose,
  carCount,
  children,
}: {
  open: boolean;
  onClose: () => void;
  /** Số xe hiện có, hiện trên nút áp dụng. */
  carCount: number;
  /** Nội dung lọc (thường là `LibraryToolbar`). */
  children: ReactNode;
}) {
  return (
    <div className={`sheet${open ? " is-open" : ""}`} aria-hidden={!open}>
      <div className="sheet__backdrop" onClick={onClose} />
      <div className="sheet__panel" role="dialog" aria-modal="true" aria-label="Bộ lọc và tìm kiếm">
        <span className="sheet__handle" aria-hidden="true" />
        <div className="sheet__head">
          <h3>
            Bộ lọc <em>絞り込み</em>
          </h3>
          <button type="button" className="sheet__close" aria-label="Đóng bộ lọc" onClick={onClose}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Nút áp dụng dính đáy trên mobile (xem `.sheet__apply` trong
            `src/styles/mobile.css`) nên nằm sau phần thân, không phải cuộn tới. */}
        <div className="sheet__body">{children}</div>

        <button type="button" className="btn btn--primary sheet__apply" onClick={onClose}>
          <span>Xem {carCount} xe</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
