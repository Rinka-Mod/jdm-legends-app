/**
 * JDM LEGENDS — Lớp dữ liệu SQLite
 * Dùng module `node:sqlite` có sẵn trong Node.js (>= 22.5) nên không cần
 * cài native dependency nào.
 *
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { CARS } from "./data/cars.js";
import { CULTURE, ERAS } from "./data/content.js";
import { CHAT_FAQ } from "./data/faq.js";

const DB_PATH = process.env.DATABASE_PATH
  ? resolve(process.env.DATABASE_PATH)
  : resolve(process.cwd(), "data", "jdm.sqlite");

mkdirSync(dirname(DB_PATH), { recursive: true });

export const db = new DatabaseSync(DB_PATH);

db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA foreign_keys = ON;");

/* ------------------------------------------------------------------
   Schema
   ------------------------------------------------------------------ */
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    email         TEXT    NOT NULL UNIQUE,
    name          TEXT    NOT NULL,
    password_hash TEXT    NOT NULL,
    created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS favorites (
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    car_id     TEXT    NOT NULL,
    created_at TEXT    NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, car_id)
  );

  CREATE TABLE IF NOT EXISTS subscribers (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    email      TEXT    NOT NULL UNIQUE,
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS cars (
    id           TEXT PRIMARY KEY,
    brand        TEXT NOT NULL,
    brand_jp     TEXT NOT NULL,
    name         TEXT NOT NULL,
    code         TEXT NOT NULL,
    year         INTEGER NOT NULL,
    kanji        TEXT NOT NULL,
    shape        TEXT NOT NULL,
    c1           TEXT NOT NULL,
    c2           TEXT NOT NULL,
    tagline      TEXT NOT NULL,
    story        TEXT NOT NULL,
    power        INTEGER NOT NULL,
    torque       INTEGER NOT NULL,
    accel        REAL NOT NULL,
    weight       INTEGER NOT NULL,
    drivetrain   TEXT NOT NULL,
    legacy       INTEGER NOT NULL,
    highlights   TEXT NOT NULL,
    sort_order   INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS eras (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    year     TEXT NOT NULL,
    kanji    TEXT NOT NULL,
    title    TEXT NOT NULL,
    desc     TEXT NOT NULL,
    cars     TEXT NOT NULL,
    position INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS culture (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    en       TEXT NOT NULL,
    jp       TEXT NOT NULL,
    desc     TEXT NOT NULL,
    position INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS faq (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    answer   TEXT NOT NULL,
    position INTEGER NOT NULL
  );
`);

/* ------------------------------------------------------------------
   Seed — chạy một lần, có thể chạy lại an toàn
   ------------------------------------------------------------------ */
export function seedDatabase(): void {
  const carCount = (db.prepare("SELECT COUNT(*) AS n FROM cars").get() as { n: number }).n;
  if (carCount === 0) {
    const insertCar = db.prepare(`
      INSERT INTO cars (id, brand, brand_jp, name, code, year, kanji, shape, c1, c2,
                        tagline, story, power, torque, accel, weight, drivetrain, legacy,
                        highlights, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    db.exec("BEGIN");
    try {
      CARS.forEach((car, i) => {
        insertCar.run(
          car.id,
          car.brand,
          car.brandJp,
          car.name,
          car.code,
          car.year,
          car.kanji,
          car.shape,
          car.c1,
          car.c2,
          car.tagline,
          car.story,
          car.power,
          car.torque,
          car.accel,
          car.weight,
          car.drivetrain,
          car.legacy,
          JSON.stringify(car.highlights),
          i,
        );
      });
      db.exec("COMMIT");
    } catch (err) {
      db.exec("ROLLBACK");
      throw err;
    }
  }

  const eraCount = (db.prepare("SELECT COUNT(*) AS n FROM eras").get() as { n: number }).n;
  if (eraCount === 0) {
    const insertEra = db.prepare(
      "INSERT INTO eras (year, kanji, title, desc, cars, position) VALUES (?, ?, ?, ?, ?, ?)",
    );
    ERAS.forEach((era, i) =>
      insertEra.run(era.year, era.k, era.title, era.desc, JSON.stringify(era.cars), i),
    );
  }

  const cultureCount = (db.prepare("SELECT COUNT(*) AS n FROM culture").get() as { n: number }).n;
  if (cultureCount === 0) {
    const insertTopic = db.prepare(
      "INSERT INTO culture (en, jp, desc, position) VALUES (?, ?, ?, ?)",
    );
    CULTURE.forEach((topic, i) => insertTopic.run(topic.en, topic.jp, topic.desc, i));
  }

  const faqCount = (db.prepare("SELECT COUNT(*) AS n FROM faq").get() as { n: number }).n;
  if (faqCount === 0) {
    const insertFaq = db.prepare(
      "INSERT INTO faq (question, answer, position) VALUES (?, ?, ?)",
    );
    CHAT_FAQ.forEach((item, i) => insertFaq.run(item.q, item.a, i));
  }
}

export { DB_PATH };
