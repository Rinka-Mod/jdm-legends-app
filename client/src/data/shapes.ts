/**
 * JDM LEGENDS — Hình dáng xe (SVG) — 3 kiểu thân xe.
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

import type { BodyShape } from "../types";

export interface ShapeDef {
  body: string;
  glass: string;
  wheels: [number, number];
  light: string;
}

export const SHAPES: Record<BodyShape, ShapeDef> = {
  coupe: {
    body: "M16,84 C16,72 21,66 34,63 L104,56 L132,33 C136,29 142,26 150,26 L196,25 C206,25 214,28 220,34 L244,55 L300,59 C316,61 324,69 324,79 L324,84 Z",
    glass: "M110,55 L136,35 C139,32 143,30 148,30 L192,29 C200,29 206,32 211,37 L232,55 Z",
    wheels: [84, 258],
    light: "M302,63 h15 l5,10 h-19 z",
  },
  hatch: {
    body: "M22,84 C22,72 27,65 40,62 L96,54 L120,30 C124,26 130,23 138,23 L206,22 C216,22 224,26 229,32 L246,52 L300,58 C316,60 324,68 324,78 L324,84 Z",
    glass: "M124,52 L144,32 C147,29 151,27 156,27 L202,26 C209,26 214,29 218,34 L234,52 Z",
    wheels: [80, 256],
    light: "M302,62 h15 l5,11 h-19 z",
  },
  sedan: {
    body: "M14,84 C14,74 19,68 32,65 L88,58 L118,36 C122,32 128,29 136,29 L188,28 C198,28 206,31 212,37 L238,58 L300,62 C318,64 326,72 326,81 L326,84 Z",
    glass: "M124,57 L140,38 C143,34 147,32 152,32 L186,31 C193,31 198,34 202,38 L224,57 Z",
    wheels: [82, 260],
    light: "M304,66 h15 l5,10 h-19 z",
  },
};

/** Vệt tốc độ: mỗi vệt một độ cao, bề rộng và độ trễ khác nhau. */
export const SPEED_LINES: { top: number; w: number; d: number }[] = [
  { top: 26, w: 34, d: 0 },
  { top: 42, w: 54, d: 0.16 },
  { top: 58, w: 28, d: 0.34 },
  { top: 70, w: 46, d: 0.52 },
  { top: 84, w: 38, d: 0.68 },
];

/** Danh sách điều hướng dùng chung cho sidebar PC, header mobile, tab bar dưới. */
export const SECTIONS = [
  { id: "hero", label: "Trang chủ", jp: "ホーム", no: "00" },
  { id: "library", label: "Thư viện", jp: "図鑑", no: "01" },
  { id: "heritage", label: "Lịch sử", jp: "歴史", no: "02" },
  { id: "culture", label: "Văn hoá", jp: "文化", no: "03" },
  { id: "garage", label: "Garage", jp: "車庫", no: "04" },
] as const;

export const MOBILE_NAV_ICONS: Record<string, string> = {
  hero: '<path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/>',
  library: '<path d="M5 5h5v14H5zM14 5h5v14h-5z"/>',
  heritage: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
  culture: '<path d="M4 7h16M6 7l1 13M18 7l-1 13M8 12h8"/>',
  garage: '<path d="M4 20V9l8-5 8 5v11"/><path d="M9 20v-6h6v6"/>',
};
