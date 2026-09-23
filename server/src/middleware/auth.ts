/**
 * JDM LEGENDS — Middleware xác thực JWT
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "jdm-legends-dev-secret-change-me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export interface AuthUser {
  id: number;
  email: string;
  name: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function signToken(user: AuthUser): string {
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

function readToken(req: Request): AuthUser | null {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) return null;
  const token = header.slice("Bearer ".length).trim();
  try {
    const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    return { id: Number(payload.id), email: String(payload.email), name: String(payload.name) };
  } catch {
    return null;
  }
}

/** Bắt buộc đăng nhập — trả 401 nếu thiếu/sai token. */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const user = readToken(req);
  if (!user) {
    res.status(401).json({ error: "Bạn cần đăng nhập để dùng tính năng này." });
    return;
  }
  req.user = user;
  next();
}

/** Gắn user nếu có token hợp lệ, nhưng không chặn khi thiếu. */
export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const user = readToken(req);
  if (user) req.user = user;
  next();
}
