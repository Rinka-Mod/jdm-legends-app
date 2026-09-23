/**
 * JDM LEGENDS — Hình minh hoạ xe bằng SVG/CSS (không dùng ảnh bitmap).
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

import type { CSSProperties } from "react";
import { SHAPES, SPEED_LINES } from "../data/shapes";
import type { Car } from "../types";

function Wheel({ cx }: { cx: number }) {
  return (
    <g className="art__wheel" style={{ transformOrigin: `${cx}px 84px` }}>
      <circle className="art__tyre" cx={cx} cy={84} r={19} />
      <circle className="art__rim" cx={cx} cy={84} r={8.5} />
      <path
        className="art__spokes"
        d={`M${cx} 70.5v27M${cx - 13.5} 84h27M${cx - 9.5} 74.5l19 19M${cx + 9.5} 74.5l-19 19`}
      />
      <circle className="art__hub" cx={cx} cy={84} r={2.6} />
    </g>
  );
}

export function CarArt({ car, className = "" }: { car: Car; className?: string }) {
  const shape = SHAPES[car.shape] ?? SHAPES.coupe;
  const style = { "--c1": car.c1, "--c2": car.c2 } as CSSProperties;

  return (
    <div className={`art ${className}`.trim()} style={style}>
      <span className="art__sun" />
      <span className="art__kanji">{car.kanji}</span>
      <span className="art__grid" />
      <span className="art__streaks">
        {SPEED_LINES.map((line, i) => (
          <i key={i} style={{ top: `${line.top}%`, width: `${line.w}%`, animationDelay: `${line.d}s` }} />
        ))}
      </span>
      <span className="art__road" />
      <span className="art__shadow" />
      <span className="art__smoke" />
      <span className="art__smoke art__smoke--b" style={{ animationDelay: ".85s" }} />
      <span className="art__drive">
        <svg className="art__car" viewBox="0 0 340 110" aria-hidden="true">
          <path className="art__body" d={shape.body} />
          <path className="art__glass" d={shape.glass} />
          <path className="art__light" d={shape.light} />
          <Wheel cx={shape.wheels[0]} />
          <Wheel cx={shape.wheels[1]} />
        </svg>
      </span>
    </div>
  );
}
