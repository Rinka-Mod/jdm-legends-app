/**
 * JDM LEGENDS — Dòng thời gian lịch sử (timeline ngang theo cuộn dọc).
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

import { useEffect, useRef, useState } from "react";
import { fetchEras } from "../lib/api";
import { useReducedMotion } from "../lib/hooks";
import type { Era } from "../types";

export function Heritage() {
  const reduced = useReducedMotion();
  const [eras, setEras] = useState<Era[]>([]);
  const [error, setError] = useState<string | null>(null);

  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    fetchEras()
      .then((data) => setEras(data.eras))
      .catch((err: Error) => setError(err.message));
  }, []);

  useEffect(() => {
    if (reduced || eras.length === 0) return;
    const clamp = (v: number) => Math.min(1, Math.max(0, v));

    const onScroll = () => {
      if (window.innerWidth <= 860) return;
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      const p = clamp(-rect.top / (total || 1));
      const shift = Math.max(0, track.scrollWidth - section.clientWidth + 40);
      track.style.transform = `translate3d(${-p * shift}px, 0, 0)`;
      if (barRef.current) barRef.current.style.width = `${p * 100}%`;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced, eras.length]);

  return (
    <section className="heritage" id="heritage" ref={sectionRef}>
      <div className="heritage__sticky">
        <span className="heritage__kanji" aria-hidden="true">
          歴史
        </span>

        <header className="heritage__head wrap">
          <p className="eyebrow">
            <span>02</span> Lịch sử
          </p>
          <h2 className="section__title">
            Sáu thập kỷ <em>tốc độ</em>
          </h2>
          <p className="heritage__hint">
            Cuộn chuột để tua dòng thời gian <i>⟶</i>
          </p>
        </header>

        <div className="heritage__track" ref={trackRef}>
          {eras.map((era) => (
            <article className="era" key={era.year}>
              <div className="era__year">{era.year}</div>
              <div className="era__k">{era.k}</div>
              <h3 className="era__title">{era.title}</h3>
              <p className="era__desc">{era.desc}</p>
              <div className="era__cars">
                {era.cars.map((car) => (
                  <b key={car}>{car}</b>
                ))}
              </div>
            </article>
          ))}
        </div>

        {error && (
          <p className="wrap" role="status">
            {error}
          </p>
        )}

        <div className="heritage__progress">
          <i ref={barRef} />
        </div>
      </div>
    </section>
  );
}
