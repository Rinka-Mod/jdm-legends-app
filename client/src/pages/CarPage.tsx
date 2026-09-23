/**
 * JDM LEGENDS — Trang riêng cho từng xe.
 * Giúp mỗi mẫu xe có một URL để chia sẻ và cho công cụ tìm kiếm đánh chỉ mục.
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CarArt } from "../components/CarArt";
import { fetchCar, fetchCars } from "../lib/api";
import { useAuth } from "../lib/auth";
import { useReveal } from "../lib/hooks";
import { useToast } from "../lib/toast";
import type { Car } from "../types";

export function CarPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user, isFavorite, toggleFavorite } = useAuth();

  const [car, setCar] = useState<Car | null>(null);
  const [all, setAll] = useState<Car[]>([]);
  const [error, setError] = useState<string | null>(null);

  useReveal([car?.id]);

  useEffect(() => {
    setCar(null);
    setError(null);
    fetchCar(id)
      .then((data) => setCar(data.car))
      .catch((err: Error) => setError(err.message));
  }, [id]);

  useEffect(() => {
    fetchCars()
      .then((data) => setAll(data.cars))
      .catch(() => setAll([]));
  }, []);

  useEffect(() => {
    if (car) document.title = `${car.brand} ${car.name} — JDM LEGENDS`;
    return () => {
      document.title = "JDM LEGENDS 伝説 — Thư viện xe thể thao Nhật Bản";
    };
  }, [car]);

  const index = car ? all.findIndex((c) => c.id === car.id) : -1;
  const prev = index > 0 ? all[index - 1] : all[all.length - 1];
  const next = index >= 0 ? all[(index + 1) % all.length] : undefined;

  if (error) {
    return (
      <main className="section page">
        <div className="wrap">
          <h1 className="section__title">
            Không tìm thấy <em>xe này</em>
          </h1>
          <p className="section__desc">{error}</p>
          <Link className="btn btn--primary" to="/#library">
            <span>Về thư viện</span>
          </Link>
        </div>
      </main>
    );
  }

  if (!car) {
    return (
      <main className="section page">
        <div className="wrap">
          <p className="section__desc">Đang tải hồ sơ xe…</p>
        </div>
      </main>
    );
  }

  const saved = isFavorite(car.id);

  async function handleFavorite() {
    if (!user) {
      toast.show({
        title: "Cần đăng nhập",
        kind: "info",
        text: "Tạo tài khoản để lưu xe vào Garage của bạn.",
      });
      return;
    }
    try {
      await toggleFavorite(car!.id);
    } catch (err) {
      toast.show({ title: "Không lưu được", kind: "error", text: (err as Error).message });
    }
  }

  const specs = [
    { label: "Công suất", value: `${car.power} PS` },
    { label: "Mô-men xoắn", value: `${car.torque} Nm` },
    { label: "0–100 km/h", value: `${car.accel.toFixed(1)}s` },
    { label: "Trọng lượng", value: `${car.weight} kg` },
    { label: "Dẫn động", value: car.drivetrain },
    { label: "Di sản", value: `${car.legacy}/100` },
  ];

  return (
    <main className="section page car-page">
      <div className="wrap">
        <nav className="car-page__crumb" aria-label="Đường dẫn">
          <Link to="/">Trang chủ</Link>
          <span aria-hidden="true">/</span>
          <Link to="/#library">Thư viện</Link>
          <span aria-hidden="true">/</span>
          <b>{car.name}</b>
        </nav>

        <div className="car-page__grid">
          <div className="car-page__art">
            <CarArt car={car} />
          </div>

          <div className="car-page__info">
            <p className="modal__brand">
              {car.brand} · {car.brandJp} · {car.year}
            </p>
            <h1 className="modal__title">{car.name}</h1>
            <p className="modal__tag">{car.tagline}</p>
            <p className="modal__story">{car.story}</p>

            <h2 className="modal__sub">Thông số</h2>
            <ul className="car-page__specs">
              {specs.map((spec) => (
                <li key={spec.label}>
                  <span>{spec.label}</span>
                  <b>{spec.value}</b>
                </li>
              ))}
            </ul>

            <h2 className="modal__sub">Điểm nhấn</h2>
            <ul className="highlights">
              {car.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>

            <div className="modal__actions">
              <button
                type="button"
                className={`btn ${saved ? "btn--ghost" : "btn--primary"}`}
                onClick={handleFavorite}
              >
                <span>{saved ? "Đã lưu trong Garage" : "Lưu vào Garage"}</span>
              </button>
              <Link className="btn btn--ghost" to="/#library">
                <span>Về thư viện</span>
              </Link>
            </div>

            <div className="modal__nav">
              <button
                type="button"
                className="modal__nav-btn"
                disabled={!prev}
                onClick={() => prev && navigate(`/car/${prev.id}`)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 12H5M11 6l-6 6 6 6" />
                </svg>
                <span>{prev ? prev.name : "Xe trước"}</span>
              </button>
              <button
                type="button"
                className="modal__nav-btn"
                disabled={!next}
                onClick={() => next && navigate(`/car/${next.id}`)}
              >
                <span>{next ? next.name : "Xe sau"}</span>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
