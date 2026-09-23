/**
 * JDM LEGENDS — Dãy chip lọc theo thương hiệu.
 *
 * Cấu trúc hai lớp có chủ đích (giữ nguyên như bản gốc):
 *   • `.filters`       — khung ngoài, trên PC đóng vai vùng cuộn ngang
 *   • `.filters__inner` — flex container thật sự, lo việc căn giữa
 * Gộp làm một thì trình duyệt luôn lùi về sát trái khi phần tử vừa căn giữa
 * vừa cuộn được (kể cả khi dùng từ khoá `safe`).
 *
 * Mỗi chip hiển thị tên hãng và tên tiếng Nhật trên hai dòng, kèm số xe của
 * hãng. Chi tiết vì sao xếp hai dòng: xem chú thích ở `.chip__txt` trong
 * `src/index.css`.
 *
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

import type { LibraryFilters } from "./useLibraryFilters";

function BrandChip({
  label,
  jp,
  count,
  active,
  onSelect,
}: {
  label: string;
  jp: string;
  count: number;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={`chip${active ? " is-active" : ""}`}
      role="tab"
      aria-selected={active}
      onClick={onSelect}
    >
      <span className="chip__txt">
        {label}
        <em>{jp}</em>
      </span>
      <span className="chip__n">{count}</span>
    </button>
  );
}

export function BrandChips({ filters }: { filters: LibraryFilters }) {
  return (
    <div className="filters">
      <div className="filters__inner" role="tablist" aria-label="Lọc theo thương hiệu">
        <BrandChip
          label="Tất cả"
          jp="全て"
          count={filters.totalCars}
          active={filters.brand === "all"}
          onSelect={() => filters.setBrand("all")}
        />
        {filters.brands.map((b) => (
          <BrandChip
            key={b.brand}
            label={b.brand}
            jp={b.brandJp}
            count={b.count}
            active={filters.brand === b.brand}
            onSelect={() => filters.setBrand(b.brand)}
          />
        ))}
      </div>
    </div>
  );
}
