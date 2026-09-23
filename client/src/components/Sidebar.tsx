/**
 * JDM LEGENDS — Sidebar dọc cho PC (≥1024px).
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SocialIcons } from "./SocialIcons";
import { useAuth } from "../lib/auth";
import { SECTIONS } from "../data/shapes";

const RAIL_KEY = "jdm-sidebar-rail";

export function Sidebar({ active }: { active: string }) {
  const { user, favorites } = useAuth();
  const [rail, setRail] = useState(false);

  useEffect(() => {
    let saved = false;
    try {
      saved = localStorage.getItem(RAIL_KEY) === "1";
    } catch {
      saved = false;
    }
    setRail(saved);
    document.documentElement.classList.toggle("is-rail", saved);
  }, []);

  function toggleRail() {
    const next = !rail;
    setRail(next);
    document.documentElement.classList.toggle("is-rail", next);
    try {
      localStorage.setItem(RAIL_KEY, next ? "1" : "0");
    } catch {
      /* bỏ qua */
    }
  }

  return (
    <aside className="sidebar" aria-label="Điều hướng máy tính">
      <div className="sidebar__head">
        <Link to="/" className="brand" data-cursor="link">
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

        <button
          className="sidebar__toggle"
          type="button"
          aria-label={rail ? "Mở rộng thanh điều hướng" : "Thu gọn thanh điều hướng"}
          aria-expanded={!rail}
          onClick={toggleRail}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 6h16M4 12h10M4 18h16" />
            <path d="M20 9l-3 3 3 3" />
          </svg>
        </button>
      </div>

      <nav className="pc-nav" aria-label="Mục chính">
        {SECTIONS.map((section) => (
          <a
            key={section.id}
            className={`pc-nav__link${active === section.id ? " is-active" : ""}`}
            href={`/#${section.id}`}
            title={section.label}
            aria-current={active === section.id ? "true" : undefined}
          >
            <span className="pc-nav__no">{section.no}</span>
            <span className="pc-nav__label">{section.label}</span>
            <span className="pc-nav__jp">{section.jp}</span>
          </a>
        ))}
        <Link className="pc-nav__link" to="/garage" title="Garage của tôi">
          <span className="pc-nav__no">{String(favorites.length).padStart(2, "0")}</span>
          <span className="pc-nav__label">Của tôi</span>
          <span className="pc-nav__jp">車庫</span>
        </Link>
      </nav>

      <div className="sidebar__stats">
        <p className="sidebar__label">Thư viện</p>
        <ul>
          <li>
            <b>12</b>
            <span>Huyền thoại</span>
          </li>
          <li>
            <b>06</b>
            <span>Thương hiệu</span>
          </li>
          <li>
            <b>1969</b>
            <span>Khởi đầu</span>
          </li>
        </ul>
      </div>

      <div className="sidebar__foot">
        <SocialIcons className="sidebar__social" />
        <p className="sidebar__credit">
          <span>Thiết kế &amp; phát triển</span>
          <b>Rinka-Mod</b>
          <em>© {new Date().getFullYear()} · All rights reserved</em>
        </p>
        {user ? (
          <Link className="sidebar__acct" to="/garage">
            {user.name}
          </Link>
        ) : (
          <Link className="sidebar__acct" to="/login">
            Đăng nhập
          </Link>
        )}
      </div>
    </aside>
  );
}
