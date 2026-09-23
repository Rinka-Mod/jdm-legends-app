/**
 * JDM LEGENDS — Hook dùng chung
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

import { useEffect, useRef, useState } from "react";

/** Người dùng có bật "giảm chuyển động" trong hệ điều hành không. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/** Theo dõi một media query, ví dụ `useMediaQuery("(max-width: 860px)")`. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** Trì hoãn giá trị — dùng cho ô tìm kiếm để không gọi API mỗi ký tự. */
export function useDebounced<T>(value: T, delay = 250): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

/**
 * Đếm số từ 0 lên giá trị mục tiêu.
 * `active = false` thì giữ nguyên số 0 — dùng để chờ hiệu ứng tải xong
 * (bản tĩnh gốc chỉ bắt đầu đếm sau sự kiện `site:ready`).
 */
export function useCountUp(
  target: number,
  suffix = "",
  active = true,
  duration = 1400,
): string {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) {
      setValue(0);
      return;
    }
    if (reduced) {
      setValue(target);
      return;
    }
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, reduced, active]);

  if (!active) return "0";
  return value.toLocaleString("vi-VN") + suffix;
}

/**
 * Trạng thái "trang đã mở xong": true khi preloader kết thúc.
 * Nghe sự kiện `site:ready` do script trong index.html bắn ra; nếu sự kiện
 * đã xảy ra trước khi React mount thì đọc thẳng class `is-ready` trên body —
 * cùng cách xử lý với hàm heroStats() của bản gốc.
 */
export function useSiteReady(): boolean {
  const [ready, setReady] = useState(
    () => typeof document !== "undefined" && document.body.classList.contains("is-ready"),
  );

  useEffect(() => {
    if (document.body.classList.contains("is-ready")) {
      setReady(true);
      return;
    }
    const onReady = () => setReady(true);
    document.addEventListener("site:ready", onReady);
    return () => document.removeEventListener("site:ready", onReady);
  }, []);

  return ready;
}

/**
 * Quan sát các phần tử `.reveal`, `.reveal-mask`, `.garage__card` để thêm
 * lớp `is-in` khi cuộn tới — giữ nguyên hành vi của bản web tĩnh gốc.
 * Truyền `deps` để chạy lại khi danh sách nội dung thay đổi.
 */
export function useReveal(deps: unknown[] = []): void {
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal, .reveal-mask, .garage__card"),
    ).filter((el) => !el.classList.contains("is-in"));

    nodes.forEach((el) => {
      const delay = el.dataset.delay;
      if (delay) el.style.setProperty("--d", `${delay}ms`);
    });

    if (typeof IntersectionObserver === "undefined") {
      nodes.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );

    nodes.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Theo dõi section đang xem để tô sáng điều hướng (sidebar PC, tab bar mobile).
 */
export function useActiveSection(ids: readonly string[]): string {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      let current = ids[0] ?? "";
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el && y >= el.offsetTop - window.innerHeight * 0.35) current = id;
      });
      setActive((prev) => (prev === current ? prev : current));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids]);

  return active;
}

/** Tìm phần tử cha gần nhất khớp selector (an toàn cho sự kiện chuột). */
export function closestFromEvent(event: Event, selector: string): HTMLElement | null {
  const target = event.target;
  if (!(target instanceof Element)) return null;
  return target.closest<HTMLElement>(selector);
}

/** Giữ tham chiếu mới nhất của một giá trị, tránh stale closure. */
export function useLatest<T>(value: T) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
}
