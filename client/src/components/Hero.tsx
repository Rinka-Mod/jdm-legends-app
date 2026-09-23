/**
 * JDM LEGENDS — Hero
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

import { useEffect, useRef } from "react";
import { useCountUp, useReducedMotion, useSiteReady } from "../lib/hooks";

function Stat({
  target,
  suffix,
  label,
  active,
}: {
  target: number;
  suffix?: string;
  label: string;
  active: boolean;
}) {
  const text = useCountUp(target, suffix ?? "", active);
  return (
    <div>
      <dt>{text}</dt>
      <dd>{label}</dd>
    </div>
  );
}

export function Hero() {
  const reduced = useReducedMotion();
  // Số liệu chỉ bắt đầu đếm sau khi preloader mở trang — giống bản gốc
  const ready = useSiteReady();
  const layersRef = useRef<HTMLDivElement | null>(null);

  /* Parallax nhẹ cho các lớp nền hero */
  useEffect(() => {
    if (reduced) return;
    const layers = layersRef.current;
    if (!layers) return;
    const nodes = Array.from(layers.querySelectorAll<HTMLElement>("[data-par]"));

    const onScroll = () => {
      const y = window.scrollY;
      if (y > window.innerHeight * 1.2) return;
      nodes.forEach((el) => {
        el.style.transform = `translate3d(0, ${y * parseFloat(el.dataset.par ?? "0")}px, 0)`;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced]);

  return (
    <section className="hero" id="hero">
      <div className="hero__layers" aria-hidden="true" ref={layersRef}>
        <span className="hero__sky" data-par="0.06" />
        <span className="hero__sun" data-par="0.14" />
        <span className="hero__glow" data-par="0.2" />
        <svg
          className="hero__mountains"
          data-par="0.1"
          viewBox="0 0 1440 420"
          preserveAspectRatio="none"
        >
          <path
            d="M0 420 L0 300 L180 170 L320 260 L470 120 L640 250 L800 150 L960 265 L1120 165 L1290 270 L1440 190 L1440 420 Z"
            fill="rgba(8,9,13,.85)"
          />
          <path
            d="M0 420 L0 350 L200 260 L380 330 L560 230 L760 330 L940 240 L1140 335 L1320 260 L1440 320 L1440 420 Z"
            fill="rgba(4,5,8,.95)"
          />
        </svg>
        <span className="hero__grid" data-par="0.05" />
        <span className="hero__speed" />
      </div>

      <div className="wrap hero__inner">
        <div className="hero__side hero__side--left" aria-hidden="true">
          <span className="vtext">日本国産スポーツカー図鑑</span>
        </div>

        <div className="hero__content">
          <p className="hero__kicker reveal" data-delay="80">
            <span className="dot" /> Thư viện xe thể thao Nhật Bản · 1990 — 2005
          </p>

          <h1 className="hero__title">
            <span className="hero__title-jp reveal" data-delay="160">
              伝説
            </span>
            <span className="hero__title-en">
              <span className="line">
                <i className="reveal-mask" data-delay="260">
                  JDM
                </i>
              </span>
              <span className="line">
                <i className="reveal-mask" data-delay="380">
                  LEGEND<span className="spark">S</span>
                </i>
              </span>
            </span>
          </h1>

          <p className="hero__lead reveal" data-delay="520">
            Từ những cung đèo <b>tōge</b> sương mù đến đường cao tốc <b>Wangan</b> giữa đêm Tokyo —
            đây là nơi lưu giữ 12 huyền thoại đã định hình nên toàn bộ văn hoá xe đường phố Nhật
            Bản.
          </p>

          <div className="hero__cta reveal" data-delay="640">
            <a href="#library" className="btn btn--primary" data-cursor="link">
              <span>Khám phá thư viện</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <a href="#heritage" className="btn btn--ghost" data-cursor="link">
              <span>Lịch sử JDM</span>
            </a>
          </div>

          <dl className="hero__stats reveal is-in" data-delay="760">
            <Stat target={12} label="Huyền thoại" active={ready} />
            <Stat target={6} label="Thương hiệu" active={ready} />
            <Stat target={280} suffix=" PS" label='Giới hạn "quý ông"' active={ready} />
          </dl>
        </div>

        <div className="hero__side hero__side--right" aria-hidden="true">
          <span className="vtext">走り屋 · 湾岸 · 峠</span>
        </div>
      </div>

      <a href="#library" className="hero__scroll" data-cursor="link" aria-label="Cuộn xuống">
        <span>SCROLL</span>
        <i />
      </a>
    </section>
  );
}
