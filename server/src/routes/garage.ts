/**
 * JDM LEGENDS — API Garage (xe yêu thích của người dùng)
 * GET    /api/garage            danh sách xe đã lưu
 * POST   /api/garage/:carId     lưu một xe
 * DELETE /api/garage/:carId     bỏ lưu
 *
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

import { Router } from "express";
import { db } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { getCar } from "../repository.js";

export const garageRouter = Router();

garageRouter.use("/garage", requireAuth);

garageRouter.get("/garage", (req, res) => {
  const rows = db
    .prepare("SELECT car_id FROM favorites WHERE user_id = ? ORDER BY created_at DESC")
    .all(req.user!.id) as unknown as { car_id: string }[];

  const cars = rows
    .map((r) => getCar(r.car_id))
    .filter((c): c is NonNullable<typeof c> => c !== null);

  res.json({ count: cars.length, cars, carIds: cars.map((c) => c.id) });
});

garageRouter.post("/garage/:carId", (req, res) => {
  const car = getCar(req.params.carId);
  if (!car) {
    res.status(404).json({ error: "Không tìm thấy xe này trong thư viện." });
    return;
  }

  db.prepare("INSERT OR IGNORE INTO favorites (user_id, car_id) VALUES (?, ?)").run(
    req.user!.id,
    car.id,
  );

  const ids = listCarIds(req.user!.id);
  res.status(201).json({ ok: true, carIds: ids });
});

garageRouter.delete("/garage/:carId", (req, res) => {
  db.prepare("DELETE FROM favorites WHERE user_id = ? AND car_id = ?").run(
    req.user!.id,
    req.params.carId,
  );
  res.json({ ok: true, carIds: listCarIds(req.user!.id) });
});

function listCarIds(userId: number): string[] {
  const rows = db
    .prepare("SELECT car_id FROM favorites WHERE user_id = ? ORDER BY created_at DESC")
    .all(userId) as unknown as { car_id: string }[];
  return rows.map((r) => r.car_id);
}