/**
 * JDM LEGENDS — Garage cá nhân: danh sách xe người dùng đã lưu.
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CarCard } from "../components/CarCard";
import { CarModal } from "../components/CarModal";
import { fetchGarage } from "../lib/api";
import { useAuth } from "../lib/auth";
import { useReveal } from "../lib/hooks";
import type { Car } from "../types";

export function MyGaragePage() {
  const { user, ready, favorites, logout } = useAuth();
  const navigate = useNavigate();

  const [cars, setCars] = useState<Car[]>([]);
  const [selected, setSelected] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  useReveal([cars.length]);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      navigate("/login", { replace: true, state: { from: "/garage" } });
      return;
    }
    setLoading(true);
    fetchGarage()
      .then((data) => setCars(data.cars))
      .catch(() => setCars([]))
      .finally(() => setLoading(false));
  }, [ready, user, favorites, navigate]);

  const index = selected ? cars.findIndex((c) => c.id === selected.id) : -1;
  const goPrev = useCallback(() => {
    if (index < 0 || cars.length === 0) return;
    setSelected(cars[(index - 1 + cars.length) % cars.length] ?? null);
  }, [index, cars]);
  const goNext = useCallback(() => {
    if (index < 0 || cars.length === 0) return;
    setSelected(cars[(index + 1) % cars.length] ?? null);
  }, [index, cars]);

  if (!ready || !user) {
    return (
      <main className="section page">
        <div className="wrap">
          <p className="section__desc">Đang tải Garage…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="section page">
      <div className="wrap">
        <header className="section__head">
          <p className="eyebrow reveal">
            <span>車庫</span> Garage của bạn
          </p>
          <h1 className="section__title reveal" data-delay="80">
            Xin chào <em>{user.name}</em>
          </h1>
          <p className="section__desc reveal" data-delay="160">
            {cars.length > 0
              ? `Bạn đang lưu ${cars.length} xe trong Garage.`
              : "Bạn chưa lưu chiếc xe nào. Bấm biểu tượng trái tim trên thẻ xe để thêm vào đây."}
          </p>

          <div className="garage-page__actions">
            <Link className="btn btn--ghost" to="/#library">
              <span>Về thư viện</span>
            </Link>
            <button className="btn btn--ghost" type="button" onClick={logout}>
              <span>Đăng xuất</span>
            </button>
          </div>
        </header>

        {loading && <p className="grid__empty">Đang tải…</p>}

        {!loading && cars.length === 0 && (
          <p className="grid__empty">
            Garage đang trống. Hãy chọn vài huyền thoại bạn thích nhé.
          </p>
        )}

        <div className="grid">
          {cars.map((car, i) => (
            <CarCard
              key={car.id}
              car={car}
              index={i}
              onOpen={setSelected}
              onRequireLogin={() => undefined}
            />
          ))}
        </div>
      </div>

      <CarModal car={selected} onClose={() => setSelected(null)} onPrev={goPrev} onNext={goNext} />
    </main>
  );
}
