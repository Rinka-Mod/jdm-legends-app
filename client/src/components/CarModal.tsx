/**
 * JDM LEGENDS — Hồ sơ xe (ngăn kéo/modal).
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CarArt } from "./CarArt";
import { useAuth } from "../lib/auth";
import { useReducedMotion } from "../lib/hooks";
import { useToast } from "../lib/toast";
import type { Car } from "../types";

const clamp = (v: number) => Math.min(100, Math.max(0, Math.round(v)));

interface CarModalProps {
  car: Car | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function CarModal({ car, onClose, onPrev, onNext }: CarModalProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const { user, isFavorite, toggleFavorite } = useAuth();
  const toast = useToast();
  const [barWidths, setBarWidths] = useState<number[]>([]);

  const open = car !== null;
  const saved = car ? isFavorite(car.id) : false;

  /* Khoá cuộn nền + quản lý focus khi mở/đóng */
  useEffect(() => {
    if (open) {
      lastFocused.current = document.activeElement as HTMLElement | null;
      document.body.classList.add("is-locked");
      const id = window.setTimeout(() => closeRef.current?.focus({ preventScroll: true }), 60);
      return () => clearTimeout(id);
    }
    document.body.classList.remove("is-locked");
    lastFocused.current?.focus({ preventScroll: true });
    return undefined;
  }, [open]);

  /* Reset vị trí cuộn và chạy thanh thông số khi mở hồ sơ mới */
  useEffect(() => {
    if (!car) return;
    if (panelRef.current) panelRef.current.scrollTop = 0;
    setBarWidths([]);
    const widths = specsOf(car).map((s) => s.v);
    const timers = widths.map((w, i) =>
      window.setTimeout(() => {
        setBarWidths((prev) => {
          const next = [...prev];
          next[i] = w;
          return next;
        });
      }, 120 + i * 90),
    );
    return () => timers.forEach(clearTimeout);
  }, [car]);

  /* Phím tắt: Esc đóng, mũi tên chuyển xe */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, onPrev, onNext]);

  async function handleFavorite() {
    if (!car) return;
    if (!user) {
      toast.show({
        title: "Cần đăng nhập",
        kind: "info",
        text: "Tạo tài khoản để lưu xe vào Garage của bạn.",
        note: "Garage đồng bộ giữa các thiết bị.",
      });
      return;
    }
    try {
      await toggleFavorite(car.id);
    } catch (err) {
      toast.show({ title: "Không lưu được", kind: "error", text: (err as Error).message });
    }
  }

  const specs = car ? specsOf(car) : [];

  return (
    <div className={`modal${open ? " is-open" : ""}`} aria-hidden={!open}>
      <div className="modal__backdrop" onClick={onClose} />
      <div
        className="modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalTitle"
        ref={panelRef}
      >
        <span className="sheet__handle modal__grab" aria-hidden="true" />
        <button
          className="modal__close"
          aria-label="Đóng hồ sơ"
          onClick={onClose}
          ref={closeRef}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="modal__art">{car && <CarArt car={car} />}</div>

        <div className="modal__body">
          <p className="modal__brand">
            {car ? `${car.brand} · ${car.brandJp} · ${car.year}` : ""}
          </p>
          <h3 className="modal__title" id="modalTitle">
            {car ? `${car.name} — ${car.code.split("·")[0]?.trim() ?? ""}` : ""}
          </h3>
          <p className="modal__tag">{car?.tagline ?? ""}</p>
          <p className="modal__story">{car?.story ?? ""}</p>

          <h4 className="modal__sub">Thông số</h4>
          <div className="specs">
            {specs.map((spec, i) => (
              <div className="spec__row" key={spec.label}>
                <div className="spec__label">
                  <span>{spec.label}</span>
                  <b>{spec.text}</b>
                </div>
                <div className="spec__bar">
                  <i style={{ width: `${barWidths[i] ?? 0}%` }} />
                </div>
              </div>
            ))}
          </div>

          <h4 className="modal__sub">Điểm nhấn</h4>
          <ul className="highlights">
            {car?.highlights.map((h) => <li key={h}>{h}</li>)}
          </ul>

          {car && (
            <div className="modal__actions">
              <button
                type="button"
                className={`btn ${saved ? "btn--ghost" : "btn--primary"}`}
                onClick={handleFavorite}
              >
                <span>{saved ? "Đã lưu trong Garage" : "Lưu vào Garage"}</span>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 20s-7-4.35-7-9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7 3.5C19 15.65 12 20 12 20Z" />
                </svg>
              </button>

              <Link className="btn btn--ghost" to={`/car/${car.id}`} onClick={onClose}>
                <span>Trang riêng của xe</span>
              </Link>
            </div>
          )}

          <div className="modal__nav">
            <button type="button" className="modal__nav-btn" onClick={onPrev} aria-label="Xe trước">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 12H5M11 6l-6 6 6 6" />
              </svg>
              <span>Xe trước</span>
            </button>
            <button type="button" className="modal__nav-btn" onClick={onNext} aria-label="Xe sau">
              <span>Xe sau</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>

          {!reduced && <p className="modal__hint">Dùng ← → để chuyển xe</p>}
        </div>
      </div>
    </div>
  );
}

function specsOf(car: Car) {
  return [
    { label: "Công suất", text: `${car.power} PS`, v: clamp((car.power / 340) * 100) },
    { label: "Mô-men xoắn", text: `${car.torque} Nm`, v: clamp((car.torque / 450) * 100) },
    { label: "0–100 km/h", text: `${car.accel.toFixed(1)}s`, v: clamp(100 - (car.accel - 3.9) * 11) },
    { label: "Trọng lượng", text: `${car.weight} kg`, v: clamp((1650 - car.weight) / 7) },
    { label: "Di sản", text: `${car.legacy}/100`, v: car.legacy },
  ];
}
