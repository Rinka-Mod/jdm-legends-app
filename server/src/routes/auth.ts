/**
 * JDM LEGENDS — API tài khoản
 * POST /api/auth/register
 * POST /api/auth/login
 * GET  /api/auth/me
 *
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "../db.js";
import { requireAuth, signToken, type AuthUser } from "../middleware/auth.js";
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH, passwordProblem } from "../password.js";

export const authRouter = Router();

interface UserRow {
  id: number;
  email: string;
  name: string;
  password_hash: string;
}

const registerSchema = z.object({
  name: z.string().min(2, "Tên cần ít nhất 2 ký tự.").max(60),
  email: z.string().email("Email chưa đúng định dạng."),
  password: z
    .string()
    .min(MIN_PASSWORD_LENGTH, `Mật khẩu cần ít nhất ${MIN_PASSWORD_LENGTH} ký tự.`)
    .max(MAX_PASSWORD_LENGTH, `Mật khẩu tối đa ${MAX_PASSWORD_LENGTH} ký tự.`),
});

const loginSchema = z.object({
  email: z.string().email("Email chưa đúng định dạng."),
  password: z.string().min(1, "Vui lòng nhập mật khẩu."),
});

authRouter.post("/auth/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ." });
    return;
  }

  const { name, password } = parsed.data;
  const email = parsed.data.email.trim().toLowerCase();

  /* Độ dài đã được zod kiểm. Ở đây kiểm thêm chất lượng mật khẩu: có nằm trong
     danh sách bị dò nhiều nhất không, có phải chuỗi quá dễ đoán không, có chứa
     chính email/tên của người đăng ký không. */
  const weak = passwordProblem(password, { email, name });
  if (weak) {
    res.status(400).json({ error: weak });
    return;
  }

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    res.status(409).json({ error: "Email này đã được đăng ký." });
    return;
  }

  const hash = await bcrypt.hash(password, 10);
  const result = db
    .prepare("INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)")
    .run(email, name.trim(), hash);

  const user: AuthUser = { id: Number(result.lastInsertRowid), email, name: name.trim() };
  res.status(201).json({ user, token: signToken(user) });
});

authRouter.post("/auth/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ." });
    return;
  }

  const email = parsed.data.email.trim().toLowerCase();
  const row = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as unknown as
    | UserRow
    | undefined;

  if (!row || !(await bcrypt.compare(parsed.data.password, row.password_hash))) {
    res.status(401).json({ error: "Email hoặc mật khẩu không đúng." });
    return;
  }

  const user: AuthUser = { id: row.id, email: row.email, name: row.name };
  res.json({ user, token: signToken(user) });
});

authRouter.get("/auth/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});
