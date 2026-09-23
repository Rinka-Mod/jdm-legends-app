/**
 * JDM LEGENDS — API xe
 * GET /api/cars        lọc / tìm / sắp xếp phía server
 * GET /api/cars/:id    hồ sơ một xe
 * GET /api/brands      danh sách thương hiệu kèm số lượng
 *
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

import { Router } from "express";
import { getCar, listBrands, listCars, type CarQuery, type CarSort } from "../repository.js";

export const carsRouter = Router();

const SORTS: CarSort[] = ["default", "power", "weight", "year", "accel", "legacy"];

function num(value: unknown): number | undefined {
  if (typeof value !== "string" || value.trim() === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

carsRouter.get("/cars", (req, res) => {
  const sortParam = typeof req.query.sort === "string" ? req.query.sort : "default";

  const query: CarQuery = {
    brand: typeof req.query.brand === "string" ? req.query.brand : undefined,
    q: typeof req.query.q === "string" ? req.query.q : undefined,
    drivetrain: typeof req.query.drivetrain === "string" ? req.query.drivetrain : undefined,
    yearFrom: num(req.query.yearFrom),
    yearTo: num(req.query.yearTo),
    minPower: num(req.query.minPower),
    maxPower: num(req.query.maxPower),
    sort: SORTS.includes(sortParam as CarSort) ? (sortParam as CarSort) : "default",
    limit: num(req.query.limit),
    offset: num(req.query.offset),
  };

  const cars = listCars(query);
  res.json({ count: cars.length, cars });
});

carsRouter.get("/cars/:id", (req, res) => {
  const car = getCar(req.params.id);
  if (!car) {
    res.status(404).json({ error: "Không tìm thấy xe này trong thư viện." });
    return;
  }
  res.json({ car });
});

carsRouter.get("/brands", (_req, res) => {
  res.json({ brands: listBrands() });
});
