/**
 * JDM LEGENDS — Middleware xác thực JWT
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

/* Khoá ký JWT.
   KHÔNG bao giờ dùng khoá mặc định ở môi trường thật: mã nguồn này là công khai,
   ai đọc được cũng tự ký được token đăng nhập của BẤT KỲ tài khoản nào. Vì vậy:
     • production mà thiếu JWT_SECRET  → dừng ngay, không chạy nửa vời;
     • máy cá nhân mà thiếu           → vẫn chạy nhưng cảnh báo rõ ở log. */
const DEV_SECRET = "jdm-legends-dev-secret-change-me";

const JWT_SECRET = (process.env.JWT_SECRET ?? "").trim();

if (!JWT_SECRET) {
  if (process.env.NODE_ENV === "production") {
    console.error(
      "[JDM] Thiếu biến môi trường JWT_SECRET nên TỪ CHỐI khởi động ở production.\n" +
        "      Tạo khoá ngẫu nhiên rồi khai báo lại (panel host → Environment):\n" +
        '      node -e "console.log(crypto.randomUUID()+crypto.randomUUID())"',
    );
    process.exit(1);
  }
  console.warn(
    "[JDM] CẢNH BÁO: chưa có JWT_SECRET nên đang dùng khoá phát triển công khai.\n" +
      "      Không được dùng cấu hình này khi triển khai thật.",
  );
}

const SECRET = JWT_SECRET || DEV_SECRET;

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
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: "HS256",
  } as jwt.SignOptions);
}

function readToken(req: Request): AuthUser | null {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) return null;
  const token = header.slice("Bearer ".length).trim();
  try {
    /* Chỉ chấp nhận đúng thuật toán mình đã ký — chặn trò đổi `alg` trong token. */
    const payload = jwt.verify(token, SECRET, { algorithms: ["HS256"] }) as jwt.JwtPayload;
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
