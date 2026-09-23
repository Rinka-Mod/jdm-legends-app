/**
 * JDM LEGENDS — Hook quản lý dữ liệu và bộ lọc của thư viện xe.
 *
 * Tách khỏi `Library.tsx` để phần bố cục không phải gánh logic:
 *   • tải danh sách thương hiệu một lần, tải lại danh sách xe mỗi khi lọc đổi
 *   • giữ giá trị của từng điều kiện lọc (thương hiệu, từ khoá, dẫn động, năm,
 *     mã lực, kiểu sắp xếp)
 *   • tính sẵn các giá trị dẫn xuất cho giao diện (số xe mỗi hãng, số điều
 *     kiện đang bật, danh sách thẻ điều kiện để bấm bỏ nhanh)
 *
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

import { useEffect, useMemo, useState } from "react";
import { fetchBrands, fetchCars } from "../../lib/api";
import { useDebounced } from "../../lib/hooks";
import type { Brand, Car, CarSort } from "../../types";
import { SORT_LABELS } from "./constants";

/** Một điều kiện đang lọc, hiện thành thẻ bấm để bỏ. */
export interface FilterTag {
  key: string;
  label: string;
  clear: () => void;
}

export interface LibraryFilters {
  /* ---- Dữ liệu ---- */
  brands: Brand[];
  cars: Car[];
  loading: boolean;
  error: string | null;

  /* ---- Giá trị đang lọc ---- */
  brand: string;
  query: string;
  drivetrain: string;
  yearFrom: string;
  yearTo: string;
  minPower: string;
  sort: CarSort;

  /* ---- Hàm đổi giá trị ---- */
  setBrand: (value: string) => void;
  setQuery: (value: string) => void;
  setDrivetrain: (value: string) => void;
  setYearFrom: (value: string) => void;
  setYearTo: (value: string) => void;
  setMinPower: (value: string) => void;
  setSort: (value: CarSort) => void;

  /* ---- Giá trị dẫn xuất ---- */
  /** Tổng số xe trong thư viện — hiện trên chip "Tất cả". */
  totalCars: number;
  /** Số điều kiện trong bảng lọc nâng cao đang bật. */
  advCount: number;
  /** Tổng số điều kiện đang lọc — dùng cho nhãn ở thanh công cụ mobile. */
  activeCount: number;
  /** Các điều kiện nâng cao đang bật (không gồm thương hiệu). */
  activeTags: FilterTag[];

  /* ---- Hành động ---- */
  resetFilters: () => void;
}

export function useLibraryFilters({
  onCarsChange,
}: {
  /** Báo danh sách xe hiện tại ra ngoài (topbar PC + điều hướng trước/sau). */
  onCarsChange: (cars: Car[]) => void;
}): LibraryFilters {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [brand, setBrand] = useState("all");
  const [query, setQuery] = useState("");
  const [drivetrain, setDrivetrain] = useState<string>("all");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [minPower, setMinPower] = useState("");
  const [sort, setSort] = useState<CarSort>("default");

  const debouncedQuery = useDebounced(query, 250);

  /* ------------------------- Tải thương hiệu ------------------------- */
  useEffect(() => {
    fetchBrands()
      .then((data) => setBrands(data.brands))
      .catch(() => setBrands([]));
  }, []);

  /* ---------------------------- Tải xe ---------------------------- */
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchCars({
      brand,
      q: debouncedQuery,
      drivetrain,
      yearFrom: yearFrom ? Number(yearFrom) : undefined,
      yearTo: yearTo ? Number(yearTo) : undefined,
      minPower: minPower ? Number(minPower) : undefined,
      sort,
    })
      .then((data) => {
        if (cancelled) return;
        setCars(data.cars);
        setError(null);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err.message);
        setCars([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [brand, debouncedQuery, drivetrain, yearFrom, yearTo, minPower, sort]);

  /* Báo danh sách xe ra ngoài mỗi khi kết quả đổi */
  useEffect(() => {
    onCarsChange(cars);
  }, [cars, onCarsChange]);

  /* ------------------------- Giá trị dẫn xuất ------------------------- */
  const totalCars = useMemo(() => brands.reduce((sum, b) => sum + b.count, 0), [brands]);

  const advCount = useMemo(() => {
    let n = 0;
    if (drivetrain !== "all") n += 1;
    if (yearFrom) n += 1;
    if (yearTo) n += 1;
    if (minPower) n += 1;
    return n;
  }, [drivetrain, yearFrom, yearTo, minPower]);

  const activeCount = advCount + (brand !== "all" ? 1 : 0) + (sort !== "default" ? 1 : 0);

  /**
   * Thương hiệu không nằm trong danh sách này vì đã thấy rõ ngay trên dãy chip.
   */
  const activeTags = useMemo<FilterTag[]>(() => {
    const tags: FilterTag[] = [];
    if (drivetrain !== "all") {
      tags.push({ key: "dt", label: `Dẫn động ${drivetrain}`, clear: () => setDrivetrain("all") });
    }
    if (yearFrom) tags.push({ key: "yf", label: `Từ năm ${yearFrom}`, clear: () => setYearFrom("") });
    if (yearTo) tags.push({ key: "yt", label: `Đến năm ${yearTo}`, clear: () => setYearTo("") });
    if (minPower) {
      tags.push({ key: "mp", label: `Từ ${minPower} PS`, clear: () => setMinPower("") });
    }
    if (sort !== "default") {
      const label = SORT_LABELS.find((s) => s.value === sort)?.label ?? sort;
      tags.push({ key: "sort", label, clear: () => setSort("default") });
    }
    return tags;
  }, [drivetrain, yearFrom, yearTo, minPower, sort]);

  function resetFilters() {
    setBrand("all");
    setQuery("");
    setDrivetrain("all");
    setYearFrom("");
    setYearTo("");
    setMinPower("");
    setSort("default");
  }

  return {
    brands,
    cars,
    loading,
    error,
    brand,
    query,
    drivetrain,
    yearFrom,
    yearTo,
    minPower,
    sort,
    setBrand,
    setQuery,
    setDrivetrain,
    setYearFrom,
    setYearTo,
    setMinPower,
    setSort,
    totalCars,
    advCount,
    activeCount,
    activeTags,
    resetFilters,
  };
}
