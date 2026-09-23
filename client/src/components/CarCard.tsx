/**
 * JDM LEGENDS — Thẻ xe trong thư viện.
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

import { useEffect, useRef } from "react";
import { CarArt } from "./CarArt";
import { useAuth } from "../lib/auth";
import { useReducedMotion } from "../lib/hooks";
import type { Car } from "../types";

interface CarCardProps {
  car: Car;
  index: number;
  onOpen: (car: Car) => void;
  onRequireLogin: () => void;
}

export function CarCard({ car, index, onOpen, onRequireLogin }: CarCardProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const { user, isFavorite, toggleFavorite } = useAuth();
  const saved = isFavorite(car.id);

  /* Hiện dần từng thẻ khi danh sách được render lại */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transitionDelay = `${Math.min(index * 70, 500)}ms`;
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => el.classList.add("is-in")),
    );
    return () => cancelAnimationFrame(raf);
  }, [index]);

  /* Chỉ cho xe "chạy" khi thẻ nằm trong tầm nhìn — tiết kiệm GPU trên mobile */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced || typeof IntersectionObserver === "undefined") {
      el.classList.add("is-live");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => el.classList.toggle("is-live", en.isIntersecting)),
      { rootMargin: "140px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const el = ref.current;
    if (!el || reduced) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    const rx = (y / rect.height - 0.5) * -6;
    const ry = (x / rect.width - 0.5) * 6;
    el.style.transform = `translateY(-6px) perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  }

  function handleEnter() {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform .18s ease-out, border-color .4s, box-shadow .5s";
    el.style.transitionDelay = "0ms";
  }

  function handleLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
    el.style.transition = "";
  }

  async function handleFavorite(e: React.MouseEvent) {
    e.stopPropagation();
    if (!user) {
      onRequireLogin();
      return;
    }
    try {
      await toggleFavorite(car.id);
    } catch {
      /* Lỗi đã được xử lý ở context; giao diện tự hoàn tác */
    }
  }

  return (
    <article
      ref={ref}
      className="card"
      data-id={car.id}
      data-shape={car.shape}
      data-cursor="link"
      tabIndex={0}
      role="button"
      aria-label={`Xem hồ sơ ${car.brand} ${car.name}`}
      onClick={() => onOpen(car)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(car);
        }
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div className="card__inner">
        <CarArt car={car} />

        <button
          type="button"
          className={`card__fav${saved ? " is-saved" : ""}`}
          aria-label={saved ? `Bỏ lưu ${car.name} khỏi garage` : `Lưu ${car.name} vào garage`}
          aria-pressed={saved}
          title={saved ? "Bỏ lưu khỏi garage" : "Lưu vào garage"}
          onClick={handleFavorite}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 20s-7-4.35-7-9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7 3.5C19 15.65 12 20 12 20Z" />
          </svg>
        </button>

        <div className="card__body">
          <div className="card__top">
            <span className="card__brand">
              {car.brand} · {car.brandJp}
            </span>
            <span className="card__year">{car.year}</span>
          </div>
          <h3 className="card__name">{car.name}</h3>
          <p className="card__code">{car.code}</p>
          <div className="card__mini">
            <div>
              <span>Công suất</span>
              <b>{car.power} PS</b>
            </div>
            <div>
              <span>0–100</span>
              <b>{car.accel.toFixed(1)}s</b>
            </div>
            <div>
              <span>Dẫn động</span>
              <b>{car.drivetrain}</b>
            </div>
          </div>
          <span className="card__cta">
            Xem hồ sơ
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
}
