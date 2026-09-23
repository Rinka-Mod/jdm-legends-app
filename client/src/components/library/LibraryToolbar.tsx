/**
 * JDM LEGENDS — Thanh công cụ thư viện.
 *
 * Gồm ba hàng, đúng theo bố cục trong `src/index.css`:
 *   1. hàng điều khiển — ô tìm kiếm · chọn sắp xếp · nút mở bộ lọc nâng cao
 *   2. dãy chip thương hiệu (`BrandChips`)
 *   3. thẻ điều kiện đang lọc — chỉ hiện khi có lọc, bấm để bỏ nhanh
 * (và bảng lọc nâng cao bung ra bên dưới khi bấm nút "Bộ lọc")
 *
 * Không giữ state lọc — mọi giá trị nằm ở hook `useLibraryFilters`, còn trạng
 * thái mở/đóng bảng nâng cao là chuyện riêng của thanh công cụ.
 *
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

import { useState, type MutableRefObject } from "react";
import type { CarSort } from "../../types";
import { AdvancedFilterPanel } from "./AdvancedFilterPanel";
import { BrandChips } from "./BrandChips";
import { SORT_LABELS } from "./constants";
import type { LibraryFilters } from "./useLibraryFilters";

interface LibraryToolbarProps {
  filters: LibraryFilters;
  /** Ô tìm kiếm nằm trong thanh này nên ref do `Library` giữ để focus từ ngoài. */
  searchRef: MutableRefObject<HTMLInputElement | null>;
}

export function LibraryToolbar({ filters, searchRef }: LibraryToolbarProps) {
  const [advOpen, setAdvOpen] = useState(false);

  return (
    <div className="toolbar" data-delay="220">
      {/* ---- Hàng 1: tìm kiếm · sắp xếp · bộ lọc nâng cao ---- */}
      <div className="ltop">
        <label className="search" data-cursor="link">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <input
            ref={searchRef}
            type="search"
            id="searchInput"
            value={filters.query}
            placeholder="Tìm tên xe, động cơ, mã khung…"
            aria-label="Tìm kiếm xe"
            onChange={(e) => filters.setQuery(e.target.value)}
          />
          {filters.query ? (
            <button
              type="button"
              className="search__clear"
              aria-label="Xoá từ khoá tìm kiếm"
              onClick={() => filters.setQuery("")}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          ) : (
            <kbd className="search__kbd" aria-hidden="true">
              /
            </kbd>
          )}
        </label>

        <label className="sortselect" data-cursor="link">
          <svg className="sortselect__icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 20V5M5 8l3-3 3 3M16 4v15M13 16l3 3 3-3" />
          </svg>
          <span className="sortselect__label">Sắp xếp</span>
          <select
            value={filters.sort}
            aria-label="Sắp xếp kết quả"
            onChange={(e) => filters.setSort(e.target.value as CarSort)}
          >
            {SORT_LABELS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <svg className="sortselect__chev" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </label>

        <button
          type="button"
          className={`chip chip--adv${advOpen ? " is-open" : ""}${filters.advCount > 0 ? " is-on" : ""}`}
          title="Bộ lọc nâng cao"
          aria-expanded={advOpen}
          aria-controls="advPanel"
          onClick={() => setAdvOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 6h16M7 12h10M10 18h4" />
          </svg>
          <span>Bộ lọc</span>
          {filters.advCount > 0 && <i className="chip__badge">{filters.advCount}</i>}
        </button>
      </div>

      {/* ---- Hàng 2: chip thương hiệu ---- */}
      <BrandChips filters={filters} />

      {/* ---- Hàng 3: thẻ điều kiện đang lọc ---- */}
      {filters.activeTags.length > 0 && (
        <div className="ltags">
          <span className="ltags__label">Đang lọc</span>
          {filters.activeTags.map((tag) => (
            <button key={tag.key} type="button" className="ltag" onClick={tag.clear}>
              <span>{tag.label}</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          ))}
          <button type="button" className="ltags__clear" onClick={filters.resetFilters}>
            Xoá tất cả
          </button>
        </div>
      )}

      {advOpen && <AdvancedFilterPanel filters={filters} onClose={() => setAdvOpen(false)} />}
    </div>
  );
}
