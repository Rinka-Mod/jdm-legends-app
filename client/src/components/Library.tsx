/**
 * JDM LEGENDS — Thư viện xe: lắp ghép phần lọc, tìm kiếm, sắp xếp và danh sách.
 *
 * File này cố tình chỉ còn phần bố cục. Mọi thứ cồng kềnh đã được tách sang
 * thư mục `./library/`:
 *   • `constants.ts`         — nhãn sắp xếp, danh sách dẫn động, kiểu hiển thị
 *   • `useLibraryFilters.ts` — tải dữ liệu + toàn bộ state lọc
 *   • `useCarouselScroll.ts` — cuộn ngang dạng carousel và chấm chỉ mục
 *   • `LibraryHeader.tsx`    — tiêu đề khu thư viện
 *   • `LibraryToolbar.tsx`   — thanh công cụ trên PC (gồm chip hãng, thẻ lọc)
 *   • `MobileToolsBar.tsx`   — một hàng công cụ gọn trên mobile
 *   • `FilterSheet.tsx`      — bottom sheet bọc thanh công cụ trên mobile
 *
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { CarCard } from "./CarCard";
import { FilterSheet } from "./library/FilterSheet";
import { LibraryHeader } from "./library/LibraryHeader";
import { LibraryToolbar } from "./library/LibraryToolbar";
import { MobileToolsBar } from "./library/MobileToolsBar";
import type { LibraryView } from "./library/constants";
import { useCarouselScroll } from "./library/useCarouselScroll";
import { useLibraryFilters } from "./library/useLibraryFilters";
import { useMediaQuery, useReducedMotion } from "../lib/hooks";
import { useUi } from "../lib/ui";
import type { Car } from "../types";

interface LibraryProps {
  onOpenCar: (car: Car) => void;
  onRequireLogin: () => void;
  /** Báo danh sách xe hiện tại ra ngoài (topbar PC + điều hướng trước/sau). */
  onCarsChange: (cars: Car[]) => void;
}

export function Library({ onOpenCar, onRequireLogin, onCarsChange }: LibraryProps) {
  const isMobile = useMediaQuery("(max-width: 860px)");
  const reduced = useReducedMotion();
  const { registerSearchFocus } = useUi();

  const filters = useLibraryFilters({ onCarsChange });
  const { gridRef, dotIndex, handleGridScroll, scrollToCard } = useCarouselScroll({
    cars: filters.cars,
    reduced,
  });

  const [view, setView] = useState<LibraryView>("swipe");
  const [sheetOpen, setSheetOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement | null>(null);

  /* -------------------- Đăng ký hàm focus ô tìm kiếm --------------------
     Trên mobile ô tìm kiếm nằm trong bottom sheet nên phải mở sheet trước,
     chờ panel trượt lên rồi mới focus (focus sớm sẽ bị cuộn trang theo). */
  const focusSearch = useCallback(() => {
    setSheetOpen(isMobile);
    const el = searchRef.current;
    if (!el) return;
    el.scrollIntoView({ block: "center", behavior: reduced ? "auto" : "smooth" });
    setTimeout(() => el.focus({ preventScroll: true }), reduced ? 0 : 340);
  }, [isMobile, reduced]);

  useEffect(() => {
    registerSearchFocus(focusSearch);
    return () => registerSearchFocus(null);
  }, [focusSearch, registerSearchFocus]);

  const showDots = isMobile && view === "swipe" && filters.cars.length > 1;

  return (
    <section className="section library" id="library">
      <span className="section__kanji" aria-hidden="true">
        図鑑
      </span>

      <div className="wrap">
        <LibraryHeader />

        {isMobile && (
          <MobileToolsBar
            filters={filters}
            view={view}
            onViewChange={setView}
            onOpenSheet={() => setSheetOpen(true)}
            onFocusSearch={focusSearch}
          />
        )}

        {/* PC: thanh công cụ nằm trong luồng trang. Mobile: nằm trong bottom sheet. */}
        {!isMobile && <LibraryToolbar filters={filters} searchRef={searchRef} />}

        {filters.loading && <p className="grid__empty">Đang tải thư viện…</p>}
        {filters.error && <p className="grid__empty">{filters.error}</p>}

        <div
          ref={gridRef}
          className={`grid${isMobile && view === "swipe" ? " is-swipe" : ""}`}
          aria-live="polite"
          onScroll={handleGridScroll}
        >
          {filters.cars.map((car, i) => (
            <CarCard
              key={car.id}
              car={car}
              index={i}
              onOpen={onOpenCar}
              onRequireLogin={onRequireLogin}
            />
          ))}
        </div>

        {showDots && (
          <div className="dots" aria-hidden="true">
            {filters.cars.map((car, i) => (
              <button
                key={car.id}
                type="button"
                className={i === dotIndex ? "is-active" : ""}
                aria-label={`Xe thứ ${i + 1}`}
                onClick={() => scrollToCard(i)}
              />
            ))}
          </div>
        )}

        {!filters.loading && !filters.error && filters.cars.length === 0 && (
          <p className="grid__empty">Không tìm thấy chiếc xe nào phù hợp. Thử từ khoá khác nhé.</p>
        )}
      </div>

      <FilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        carCount={filters.cars.length}
      >
        {isMobile && <LibraryToolbar filters={filters} searchRef={searchRef} />}
      </FilterSheet>
    </section>
  );
}
