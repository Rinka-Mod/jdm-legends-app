/** JDM LEGENDS — Kiểu dữ liệu dùng chung ở front-end. © 2026 Rinka-Mod */

export type BodyShape = "coupe" | "hatch" | "sedan";
export type Drivetrain = "FR" | "AWD" | "MR" | "FF";

export interface Car {
  id: string;
  brand: string;
  brandJp: string;
  name: string;
  code: string;
  year: number;
  kanji: string;
  shape: BodyShape;
  c1: string;
  c2: string;
  tagline: string;
  story: string;
  power: number;
  torque: number;
  accel: number;
  weight: number;
  drivetrain: Drivetrain;
  legacy: number;
  highlights: string[];
}

export interface Era {
  year: string;
  k: string;
  title: string;
  desc: string;
  cars: string[];
}

export interface CultureTopic {
  en: string;
  jp: string;
  desc: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface Brand {
  brand: string;
  brandJp: string;
  count: number;
}

export interface Stats {
  cars: number;
  brands: number;
  eras: number;
  culture: number;
  faq: number;
  since: number;
}

export interface AuthUser {
  id: number;
  email: string;
  name: string;
}

export type CarSort = "default" | "power" | "weight" | "year" | "accel" | "legacy";
