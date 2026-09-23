/**
 * JDM LEGENDS — Thanh điều hướng dưới (mobile).
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

import { useAuth } from "../lib/auth";
import { MOBILE_NAV_ICONS, SECTIONS } from "../data/shapes";

export function MobileBar({ active }: { active: string }) {
  const { favorites } = useAuth();

  return (
    <nav className="mobile-bar" aria-label="Điều hướng di động">
      {SECTIONS.map((section) => (
        <a
          key={section.id}
          className={`mobile-bar__item${active === section.id ? " is-active" : ""}`}
          href={`/#${section.id}`}
          data-target={section.id}
        >
          <i />
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: MOBILE_NAV_ICONS[section.id] ?? "" }}
          />
          <span>{section.label}</span>
        </a>
      ))}
      <a className="mobile-bar__item" href="/garage" data-target="mygarage">
        <i />
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 20s-7-4.35-7-9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7 3.5C19 15.65 12 20 12 20Z" />
        </svg>
        <span>Đã lưu</span>
        {favorites.length > 0 && (
          <b className="mobile-bar__badge" title={`${favorites.length} xe đã lưu`}>
            {favorites.length}
          </b>
        )}
      </a>
    </nav>
  );
}
