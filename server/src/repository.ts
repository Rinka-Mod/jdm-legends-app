/**
 * JDM LEGENDS — Truy vấn dữ liệu
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

import { db } from "./db.js";
import type { Car, BodyShape, Drivetrain } from "./data/cars.js";
import type { Era, CultureTopic } from "./data/content.js";
import type { FaqItem } from "./data/faq.js";

interface CarRow {
  id: string;
  brand: string;
  brand_jp: string;
  name: string;
  code: string;
  year: number;
  kanji: string;
  shape: string;
  c1: string;
  c2: string;
  tagline: string;
  story: string;
  power: number;
  torque: number;
  accel: number;
  weight: number;
  drivetrain: string;
  legacy: number;
  highlights: string;
}

function mapCar(row: CarRow): Car {
  return {
    id: row.id,
    brand: row.brand,
    brandJp: row.brand_jp,
    name: row.name,
    code: row.code,
    year: row.year,
    kanji: row.kanji,
    shape: row.shape as BodyShape,
    c1: row.c1,
    c2: row.c2,
    tagline: row.tagline,
    story: row.story,
    power: row.power,
    torque: row.torque,
    accel: row.accel,
    weight: row.weight,
    drivetrain: row.drivetrain as Drivetrain,
    legacy: row.legacy,
    highlights: JSON.parse(row.highlights) as string[],
  };
}

export type CarSort = "default" | "power" | "weight" | "year" | "accel" | "legacy";

export interface CarQuery {
  brand?: string;
  q?: string;
  drivetrain?: string;
  yearFrom?: number;
  yearTo?: number;
  minPower?: number;
  maxPower?: number;
  sort?: CarSort;
  limit?: number;
  offset?: number;
}

const SORT_SQL: Record<CarSort, string> = {
  default: "sort_order ASC",
  power: "power DESC, sort_order ASC",
  weight: "weight ASC, sort_order ASC",
  year: "year DESC, sort_order ASC",
  accel: "accel ASC, sort_order ASC",
  legacy: "legacy DESC, sort_order ASC",
};

export function listCars(query: CarQuery = {}): Car[] {
  const where: string[] = [];
  const params: (string | number)[] = [];

  if (query.brand && query.brand !== "all") {
    where.push("LOWER(brand) = LOWER(?)");
    params.push(query.brand);
  }
  if (query.drivetrain && query.drivetrain !== "all") {
    where.push("LOWER(drivetrain) = LOWER(?)");
    params.push(query.drivetrain);
  }
  if (typeof query.yearFrom === "number") {
    where.push("year >= ?");
    params.push(query.yearFrom);
  }
  if (typeof query.yearTo === "number") {
    where.push("year <= ?");
    params.push(query.yearTo);
  }
  if (typeof query.minPower === "number") {
    where.push("power >= ?");
    params.push(query.minPower);
  }
  if (typeof query.maxPower === "number") {
    where.push("power <= ?");
    params.push(query.maxPower);
  }
  if (query.q && query.q.trim()) {
    const term = `%${query.q.trim().toLowerCase()}%`;
    where.push(
      "(LOWER(brand) LIKE ? OR LOWER(name) LIKE ? OR LOWER(code) LIKE ? OR LOWER(kanji) LIKE ? OR LOWER(drivetrain) LIKE ? OR CAST(year AS TEXT) LIKE ?)",
    );
    params.push(term, term, term, term, term, term);
  }

  const order = SORT_SQL[query.sort ?? "default"] ?? SORT_SQL.default;
  let sql = `SELECT * FROM cars ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY ${order}`;

  if (typeof query.limit === "number") {
    sql += " LIMIT ?";
    params.push(query.limit);
    if (typeof query.offset === "number") {
      sql += " OFFSET ?";
      params.push(query.offset);
    }
  }

  const rows = db.prepare(sql).all(...params) as unknown as CarRow[];
  return rows.map(mapCar);
}

export function getCar(id: string): Car | null {
  const row = db.prepare("SELECT * FROM cars WHERE id = ?").get(id) as unknown as
    | CarRow
    | undefined;
  return row ? mapCar(row) : null;
}

export function listBrands(): { brand: string; brandJp: string; count: number }[] {
  const rows = db
    .prepare(
      `SELECT brand, brand_jp AS brandJp, COUNT(*) AS count
       FROM cars GROUP BY brand ORDER BY brand ASC`,
    )
    .all() as unknown as { brand: string; brandJp: string; count: number }[];
  return rows;
}

export function listEras(): Era[] {
  const rows = db
    .prepare("SELECT * FROM eras ORDER BY position ASC")
    .all() as unknown as { year: string; kanji: string; title: string; desc: string; cars: string }[];
  return rows.map((r) => ({
    year: r.year,
    k: r.kanji,
    title: r.title,
    desc: r.desc,
    cars: JSON.parse(r.cars) as string[],
  }));
}

export function listCulture(): CultureTopic[] {
  const rows = db
    .prepare("SELECT * FROM culture ORDER BY position ASC")
    .all() as unknown as { en: string; jp: string; desc: string }[];
  return rows.map((r) => ({ en: r.en, jp: r.jp, desc: r.desc }));
}

export function listFaq(): FaqItem[] {
  const rows = db
    .prepare("SELECT question, answer FROM faq ORDER BY position ASC")
    .all() as unknown as { question: string; answer: string }[];
  return rows.map((r) => ({ q: r.question, a: r.answer }));
}
