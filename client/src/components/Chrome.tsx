/**
 * JDM LEGENDS — Lớp trang trí: hạt phim, scanline, con trỏ tuỳ biến, thanh tiến trình.
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../lib/hooks";

export function Grain() {
  return (
    <>
      <div className="grain" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />
    </>
  );
}

/** Thanh tiến trình đọc trang ở mép trên. */
export function ScrollProgress() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = Math.min(100, Math.max(0, (y / (max || 1)) * 100));
      if (ref.current) ref.current.style.width = `${p}%`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <i ref={ref} />
    </div>
  );
}

/** Con trỏ tuỳ biến — chỉ bật khi có chuột thật (hover + pointer: fine). */
export function CustomCursor() {
  const dotRef = useRef<HTMLSpanElement | null>(null);
  const ringRef = useRef<HTMLSpanElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(
      !reduced &&
        typeof window !== "undefined" &&
        window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    );
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const root = rootRef.current;
    if (!dot || !ring || !root) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
      root.classList.remove("is-hidden");
    };
    const onOut = () => root.classList.add("is-hidden");
    const onOver = (e: MouseEvent) => {
      const target = e.target;
      const hot =
        target instanceof Element &&
        target.closest("a, button, input, label, .card, [data-cursor]");
      root.classList.toggle("is-hover", Boolean(hot));
    };

    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onOut);
    document.addEventListener("mouseover", onOver);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onOut);
      document.removeEventListener("mouseover", onOver);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="cursor" ref={rootRef} aria-hidden="true">
      <span className="cursor__dot" ref={dotRef} />
      <span className="cursor__ring" ref={ringRef} />
    </div>
  );
}

/** Nút lên đầu trang. */
export function ToTop() {
  const [show, setShow] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      className={`to-top${show ? " is-show" : ""}`}
      type="button"
      aria-label="Lên đầu trang"
      data-cursor="link"
      onClick={() =>
        window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })
      }
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 19V5M6 11l6-6 6 6" />
      </svg>
    </button>
  );
}
