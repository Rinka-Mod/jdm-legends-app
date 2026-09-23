/**
 * JDM LEGENDS — Lớp gọi API
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

import type { AuthUser, Brand, Car, CarSort, CultureTopic, Era, FaqItem, Stats } from "../types";

const TOKEN_KEY = "jdm-token";

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* localStorage bị chặn — bỏ qua */
  }
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const API_BASE = (import.meta.env.VITE_API_BASE ?? "/api").replace(/\/$/, "");

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  } catch {
    throw new ApiError("Không kết nối được máy chủ. Bạn kiểm tra lại kết nối nhé.", 0);
  }

  const text = await res.text();
  const data = text ? (JSON.parse(text) as unknown) : {};

  if (!res.ok) {
    const message =
      (data as { error?: string }).error ?? "Máy chủ trả về lỗi, bạn thử lại sau nhé.";
    throw new ApiError(message, res.status);
  }

  return data as T;
}

/* ------------------------------ Xe ------------------------------ */

export interface CarQueryParams {
  brand?: string;
  q?: string;
  drivetrain?: string;
  yearFrom?: number;
  yearTo?: number;
  minPower?: number;
  maxPower?: number;
  sort?: CarSort;
}

export function fetchCars(params: CarQueryParams = {}): Promise<{ count: number; cars: Car[] }> {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === "" || value === "all") return;
    search.set(key, String(value));
  });
  const qs = search.toString();
  return request(`/cars${qs ? `?${qs}` : ""}`);
}

export function fetchCar(id: string): Promise<{ car: Car }> {
  return request(`/cars/${encodeURIComponent(id)}`);
}

export function fetchBrands(): Promise<{ brands: Brand[] }> {
  return request("/brands");
}

export function fetchStats(): Promise<{ stats: Stats }> {
  return request("/stats");
}

/* --------------------------- Nội dung --------------------------- */

export function fetchEras(): Promise<{ eras: Era[] }> {
  return request("/eras");
}

export function fetchCulture(): Promise<{ culture: CultureTopic[] }> {
  return request("/culture");
}

export function fetchFaq(): Promise<{
  greeting: string;
  notice: string;
  questions: FaqItem[];
}> {
  return request("/faq");
}

export function askFaq(
  question: string,
): Promise<{ matched: boolean; answer: string; question?: string }> {
  return request("/faq/ask", { method: "POST", body: JSON.stringify({ question }) });
}

export function subscribeNewsletter(
  email: string,
): Promise<{ ok: boolean; alreadySubscribed: boolean; message: string }> {
  return request("/subscribe", { method: "POST", body: JSON.stringify({ email }) });
}

/* ---------------------------- Tài khoản ---------------------------- */

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export function apiRegister(name: string, email: string, password: string): Promise<AuthResponse> {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export function apiLogin(email: string, password: string): Promise<AuthResponse> {
  return request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
}

export function apiMe(): Promise<{ user: AuthUser }> {
  return request("/auth/me");
}

/* ----------------------------- Garage ----------------------------- */

export function fetchGarage(): Promise<{ count: number; cars: Car[]; carIds: string[] }> {
  return request("/garage");
}

export function addToGarage(carId: string): Promise<{ ok: true; carIds: string[] }> {
  return request(`/garage/${encodeURIComponent(carId)}`, { method: "POST" });
}

export function removeFromGarage(carId: string): Promise<{ ok: true; carIds: string[] }> {
  return request(`/garage/${encodeURIComponent(carId)}`, { method: "DELETE" });
}
