/**
 * JDM LEGENDS — Header cho mobile / tablet.
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { SECTIONS } from "../data/shapes";

export function SiteHeader({ active, stuck }: { active: string; stuck: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <header className={`site-header${stuck ? " is-stuck" : ""}`}>
      <div className="wrap header__inner">
        <Link to="/" className="brand" data-cursor="link" onClick={() => setOpen(false)}>
          <span className="brand__mark" aria-hidden="true">
            <svg viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="11" className="brand__sun" />
              <path
                d="M6 20h36M6 26h36M9 12h30M9 34h30M12 6v36M18 6v36M30 6v36M36 6v36"
                className="brand__grid"
              />
            </svg>
          </span>
          <span className="brand__text">
            <b>JDM</b>
            <i>LEGENDS</i>
          </span>
        </Link>

        <nav className={`nav${open ? " is-open" : ""}`} aria-label="Điều hướng chính">
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`/#${section.id}`}
              className={`nav__link${active === section.id ? " is-active" : ""}`}
              onClick={() => setOpen(false)}
            >
              {section.label}
            </a>
          ))}
          <Link to="/garage" className="nav__link" onClick={() => setOpen(false)}>
            Garage của tôi
          </Link>
        </nav>

        <div className="header__actions">
          <span className="header__kanji" aria-hidden="true">
            日本車
          </span>
          <button
            className={`burger${open ? " is-open" : ""}`}
            type="button"
            aria-label={open ? "Đóng menu" : "Mở menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <i />
            <i />
            <i />
          </button>
        </div>
      </div>
    </header>
  );
}
