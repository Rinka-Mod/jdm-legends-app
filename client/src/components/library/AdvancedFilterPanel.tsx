/**
 * JDM LEGENDS — Bảng lọc nâng cao (dẫn động · khoảng năm · mã lực tối thiểu).
 *
 * Luôn nằm TRONG `.toolbar` để trên PC nó bung ra ngay dưới thanh công cụ đang
 * dính, mà không làm vỡ bo tròn của thẻ. Trên mobile bảng nằm trong bottom
 * sheet nên chỉ cần xếp dọc theo luồng.
 *
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

import { DRIVETRAINS } from "./constants";
import type { LibraryFilters } from "./useLibraryFilters";

export function AdvancedFilterPanel({
  filters,
  onClose,
}: {
  filters: LibraryFilters;
  onClose: () => void;
}) {
  return (
    <div className="advpanel" id="advPanel" aria-label="Bộ lọc nâng cao">
      <div className="advpanel__head">
        <h4>
          Bộ lọc nâng cao <em>絞り込み</em>
        </h4>
        <button type="button" className="advpanel__close" aria-label="Đóng bộ lọc nâng cao" onClick={onClose}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <div className="advpanel__grid">
        <label className="advpanel__field">
          <span>Dẫn động</span>
          <select value={filters.drivetrain} onChange={(e) => filters.setDrivetrain(e.target.value)}>
            {DRIVETRAINS.map((d) => (
              <option key={d} value={d}>
                {d === "all" ? "Tất cả" : d}
              </option>
            ))}
          </select>
        </label>

        <label className="advpanel__field">
          <span>Từ năm</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder="1969"
            min={1960}
            max={2030}
            value={filters.yearFrom}
            onChange={(e) => filters.setYearFrom(e.target.value)}
          />
        </label>

        <label className="advpanel__field">
          <span>Đến năm</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder="2005"
            min={1960}
            max={2030}
            value={filters.yearTo}
            onChange={(e) => filters.setYearTo(e.target.value)}
          />
        </label>

        <label className="advpanel__field">
          <span>Mã lực tối thiểu</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder="130"
            min={0}
            max={1000}
            step={10}
            value={filters.minPower}
            onChange={(e) => filters.setMinPower(e.target.value)}
          />
        </label>
      </div>

      <div className="advpanel__foot">
        <button
          type="button"
          className="advpanel__reset"
          onClick={filters.resetFilters}
          disabled={filters.activeCount === 0}
        >
          Xoá bộ lọc
        </button>
        <button type="button" className="btn btn--primary advpanel__done" onClick={onClose}>
          <span>Xong</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
