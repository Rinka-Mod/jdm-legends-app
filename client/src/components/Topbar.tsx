/**
 * JDM LEGENDS — Topbar chỉ hiện trên PC.
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

import { SECTIONS } from "../data/shapes";

interface TopbarProps {
  active: string;
  count: number;
  onSearchJump: () => void;
}

export function Topbar({ active, count, onSearchJump }: TopbarProps) {
  const section = SECTIONS.find((s) => s.id === active) ?? SECTIONS[0];

  return (
    <div className="topbar">
      <p className="topbar__crumb">
        <span>{section.no}</span>
        <b>{section.label}</b>
        <i>{section.jp}</i>
      </p>

      <div className="topbar__actions">
        <button
          className="topbar__search"
          type="button"
          aria-label="Tìm kiếm xe, mã khung"
          onClick={onSearchJump}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <span>Tìm xe, mã khung…</span>
          <kbd>/</kbd>
        </button>

        <p className="topbar__count">
          <b>{count}</b> xe
        </p>
      </div>
    </div>
  );
}
