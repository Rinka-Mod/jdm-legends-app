/**
 * JDM LEGENDS — Cuộn ngang dạng carousel cho danh sách xe trên mobile.
 *
 * Vì sao tách riêng: đây là logic thuần đọc hình học DOM (vị trí từng thẻ so
 * với tâm khung nhìn) chứ không dính gì tới bộ lọc hay bố cục trang. Tách ra
 * thì `Library.tsx` chỉ còn lo việc lắp ghép giao diện.
 *
 * Cách hoạt động: theo dõi sự kiện `scroll` của khung, tìm thẻ có tâm gần tâm
 * khung nhìn nhất để tô sáng chấm chỉ mục tương ứng; bấm một chấm thì cuộn thẻ
 * đó vào giữa khung.
 *
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

import { useEffect, useRef, useState } from "react";
import type { Car } from "../../types";

export function useCarouselScroll({
  cars,
  reduced,
}: {
  /** Danh sách xe đang hiển thị — đổi thì cuộn về đầu và đặt lại chấm. */
  cars: Car[];
  /** Người dùng bật "giảm chuyển động" → cuộn tức thì thay vì cuộn mượt. */
  reduced: boolean;
}) {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [dotIndex, setDotIndex] = useState(0);

  /* Đổi bộ lọc là danh sách mới → trả khung về đầu và đặt lại chấm đầu tiên. */
  useEffect(() => {
    const el = gridRef.current;
    if (el) el.scrollTo({ left: 0, behavior: "auto" });
    setDotIndex(0);
  }, [cars]);

  function handleGridScroll() {
    const el = gridRef.current;
    if (!el || !el.classList.contains("is-swipe")) return;
    const cards = Array.from(el.querySelectorAll<HTMLElement>(".card"));
    const mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bestDistance = Infinity;
    cards.forEach((card, i) => {
      const d = Math.abs(card.offsetLeft + card.clientWidth / 2 - mid);
      if (d < bestDistance) {
        bestDistance = d;
        best = i;
      }
    });
    setDotIndex(best);
  }

  function scrollToCard(index: number) {
    const el = gridRef.current;
    if (!el) return;
    const card = el.querySelectorAll<HTMLElement>(".card")[index];
    if (!card) return;
    el.scrollTo({
      left: card.offsetLeft - el.clientWidth / 2 + card.clientWidth / 2,
      behavior: reduced ? "auto" : "smooth",
    });
  }

  return { gridRef, dotIndex, handleGridScroll, scrollToCard };
}
