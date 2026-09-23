/**
 * JDM LEGENDS — Trang chủ.
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Hero } from "../components/Hero";
import { Marquee } from "../components/Marquee";
import { Library } from "../components/Library";
import { Heritage } from "../components/Heritage";
import { Culture } from "../components/Culture";
import { GarageSection } from "../components/GarageSection";
import { CarModal } from "../components/CarModal";
import { useAuth } from "../lib/auth";
import { useReveal } from "../lib/hooks";
import { useToast } from "../lib/toast";
import type { Car } from "../types";

export function HomePage({ onCarsLoaded }: { onCarsLoaded?: (cars: Car[]) => void }) {
  const [cars, setCars] = useState<Car[]>([]);
  const [selected, setSelected] = useState<Car | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const toast = useToast();

  useReveal([cars.length]);

  const handleCarsChange = useCallback(
    (next: Car[]) => {
      setCars(next);
      onCarsLoaded?.(next);
    },
    [onCarsLoaded],
  );

  /* Deep link: /?car=supra-a80 mở thẳng hồ sơ xe đó */
  useEffect(() => {
    const id = searchParams.get("car");
    if (!id || cars.length === 0) return;
    const found = cars.find((c) => c.id === id);
    if (found) {
      setSelected(found);
      return;
    }
    // Xe không nằm trong bộ lọc hiện tại thì bỏ tham số để không mở nhầm
    setSearchParams({}, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cars, searchParams]);

  const openCar = useCallback(
    (car: Car) => {
      setSelected(car);
      setSearchParams({ car: car.id }, { replace: false });
    },
    [setSearchParams],
  );

  const closeCar = useCallback(() => {
    setSelected(null);
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const index = selected ? cars.findIndex((c) => c.id === selected.id) : -1;

  const goPrev = useCallback(() => {
    if (index < 0 || cars.length === 0) return;
    const next = cars[(index - 1 + cars.length) % cars.length];
    if (next) openCar(next);
  }, [index, cars, openCar]);

  const goNext = useCallback(() => {
    if (index < 0 || cars.length === 0) return;
    const next = cars[(index + 1) % cars.length];
    if (next) openCar(next);
  }, [index, cars, openCar]);

  const requireLogin = useCallback(() => {
    toast.show({
      title: "Cần đăng nhập",
      kind: "info",
      text: "Tạo tài khoản để lưu xe yêu thích vào Garage của bạn.",
      note: user ? "" : "Miễn phí và chỉ mất vài giây.",
    });
  }, [toast, user]);

  return (
    <main>
      <Hero />
      <Marquee />

      <Library onOpenCar={openCar} onRequireLogin={requireLogin} onCarsChange={handleCarsChange} />

      <Heritage />
      <Culture />
      <GarageSection />

      <CarModal car={selected} onClose={closeCar} onPrev={goPrev} onNext={goNext} />
    </main>
  );
}
