/**
 * JDM LEGENDS — Hằng số dùng chung cho khu thư viện xe.
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

import type { CarSort, Drivetrain } from "../../types";

/** Nhãn hiển thị của từng kiểu sắp xếp, dùng cho cả select và thẻ lọc. */
export const SORT_LABELS: { value: CarSort; label: string }[] = [
  { value: "default", label: "Mặc định" },
  { value: "power", label: "Mạnh nhất" },
  { value: "legacy", label: "Di sản cao nhất" },
  { value: "accel", label: "Tăng tốc nhanh nhất" },
  { value: "weight", label: "Nhẹ nhất" },
  { value: "year", label: "Mới nhất" },
];

/** Các kiểu dẫn động trong bảng lọc nâng cao ("all" = không lọc). */
export const DRIVETRAINS: (Drivetrain | "all")[] = ["all", "FR", "AWD", "MR", "FF"];

/** Kiểu hiển thị danh sách xe trên mobile. */
export type LibraryView = "swipe" | "grid";
