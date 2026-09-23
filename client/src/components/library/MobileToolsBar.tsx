/**
 * JDM LEGENDS — Thanh công cụ mobile của thư viện (chỉ hiện ở ≤860px).
 *
 * Một hàng duy nhất: ô tìm kiếm (mở bottom sheet) · nút lọc · kiểu xem.
 * Dòng kết quả tách ra dưới thanh nên khi cuộn nó trôi đi, không dính lại cùng
 * thanh công cụ — bớt một tầng chữ thường trực trên màn hình.
 *
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

import type { LibraryView } from "./constants";
import type { LibraryFilters } from "./useLibraryFilters";

interface MobileToolsBarProps {
  filters: LibraryFilters;
  view: LibraryView;
  onViewChange: (view: LibraryView) => void;
  /** Mở bottom sheet (dùng khi bấm nút lọc). */
  onOpenSheet: () => void;
  /** Mở bottom sheet rồi focus thẳng vào ô tìm kiếm. */
  onFocusSearch: () => void;
}

export function MobileToolsBar({
  filters,
  view,
  onViewChange,
  onOpenSheet,
  onFocusSearch,
}: MobileToolsBarProps) {
  const countLabel = filters.brand === "all" ? "Tất cả" : filters.brand;

  return (
    <>
      <div className="mobile-tools">
        <button type="button" className="mobile-tools__btn" aria-haspopup="dialog" onClick={onFocusSearch}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <span>Tìm xe, mã khung…</span>
        </button>

        <button
          type="button"
          className={`mt-filter${filters.activeCount > 0 ? " is-on" : ""}`}
          aria-label="Mở bộ lọc và tìm kiếm"
          aria-haspopup="dialog"
          onClick={onOpenSheet}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 6h16M7 12h10M10 18h4" />
          </svg>
          {filters.activeCount > 0 && <b>{filters.activeCount}</b>}
        </button>

        <div className="viewbar" role="tablist" aria-label="Kiểu hiển thị">
          <button
            type="button"
            className={`vb${view === "swipe" ? " is-active" : ""}`}
            role="tab"
            aria-selected={view === "swipe"}
            onClick={() => onViewChange("swipe")}
          >
            Thẻ
          </button>
          <button
            type="button"
            className={`vb${view === "grid" ? " is-active" : ""}`}
            role="tab"
            aria-selected={view === "grid"}
            onClick={() => onViewChange("grid")}
          >
            Lưới
          </button>
        </div>
      </div>

      <p className="mt-meta">
        <b>{countLabel}</b>
        <span aria-hidden="true">·</span>
        <span>{filters.cars.length} xe</span>
        {filters.activeCount > 0 && (
          <button type="button" className="mt-meta__clear" onClick={filters.resetFilters}>
            Xoá {filters.activeCount} lọc
          </button>
        )}
      </p>
    </>
  );
}
