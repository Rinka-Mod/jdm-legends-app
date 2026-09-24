/**
 * ==========================================================================
 * JDM LEGENDS — Giới hạn số lần thử (chống dò mật khẩu và spam tài khoản).
 *
 * Vì sao cần: không giới hạn thì một script vài dòng cũng thử được hàng nghìn
 * mật khẩu cho một email. Bcrypt làm mỗi lần thử chậm hơn, nhưng chậm không
 * phải là chặn — và gói Free (256 MB RAM) rất dễ bị làm nghẽn vì CPU.
 *
 * Không thêm thư viện nào: đếm trong bộ nhớ là đủ cho quy mô này. Hạn chế đã
 * biết: nhiều tiến trình hoặc restart thì bộ đếm mất sạch — chấp nhận được, vì
 * đây là lớp chặn tạm thời chứ không phải cơ chế phân quyền.
 *
 * CHỈ đếm các lần THẤT BẠI. Đăng nhập đúng thì xoá bộ đếm của tài khoản đó, nên
 * người dùng thật gõ nhầm vài lần không bị khoá oan.
 *
 * Khoá theo hai chiều:
 *   • theo email → không thể giả mạo, đây là lớp bảo vệ chính;
 *   • theo IP    → lớp chặn phụ, cố ý để rộng tay vì rất nhiều người có thể
 *                  dùng chung một IP (mạng trường, quán net, proxy của Netlify).
 *                  Đặt chặt quá là tự khoá hết người dùng thật.
 *
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 * ==========================================================================
 */

import type { NextFunction, Request, Response } from "express";

interface Bucket {
  count: number;
  resetAt: number;
}

interface Limit {
  /** Số lần sai tối đa trong một cửa sổ. */
  max: number;
  windowMs: number;
}

const buckets = new Map<string, Bucket>();

/**
 * Một tài khoản: 10 lần sai trong 15 phút là tạm khoá tài khoản đó.
 *
 * Vì sao là 10 mà không phải 5: khoá theo tài khoản có mặt trái — kẻ xấu cứ cố
 * tình gõ sai để chặn chính chủ. 10 lần vẫn quá ít để dò mật khẩu (bcrypt tốn
 * ~100ms/lần, nên trần thực tế là vài chục lần/giờ), mà người gõ nhầm cũng khó
 * chạm tới.
 *
 * Cửa sổ đếm là **cửa sổ cố định** tính từ lần sai đầu tiên, không trượt theo
 * từng lần thử. Nhờ vậy tài khoản **tự mở khoá sau tối đa 15 phút**, kể cả khi
 * kẻ tấn công vẫn đang gõ sai liên tục.
 */
const EMAIL_LIMIT: Limit = { max: 10, windowMs: 15 * 60 * 1000 };

/** Một địa chỉ IP: 100 lần sai trong 15 phút — chỉ để chặn dò diện rộng. */
const IP_LIMIT: Limit = { max: 100, windowMs: 15 * 60 * 1000 };

/** Tạo tài khoản: 20 lần trong 1 giờ cho mỗi IP. */
const REGISTER_LIMIT: Limit = { max: 20, windowMs: 60 * 60 * 1000 };

/** Trần số khoá giữ trong bộ nhớ. Vượt trần thì xoá hết (thà mở còn hơn chết RAM). */
const MAX_KEYS = 5000;

/* Bộ dọn rác chạy nền. `unref()` để nó không giữ tiến trình sống khi tắt máy chủ. */
const sweeper = setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}, 10 * 60 * 1000);
sweeper.unref();

/** Số giây còn phải chờ nếu khoá này đã vượt ngưỡng; 0 nghĩa là chưa bị khoá. */
function waitingSeconds(key: string, limit: Limit): number {
  const bucket = buckets.get(key);
  const now = Date.now();
  if (!bucket || bucket.resetAt <= now || bucket.count < limit.max) return 0;
  return Math.ceil((bucket.resetAt - now) / 1000);
}

/** Ghi nhận một lần thất bại. */
function bump(key: string, limit: Limit): void {
  if (buckets.size >= MAX_KEYS) buckets.clear();

  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + limit.windowMs });
    return;
  }
  bucket.count += 1;
}

function refuse(res: Response, retryAfter: number, message: string): void {
  res.setHeader("Retry-After", String(retryAfter));
  res.status(429).json({ error: message });
}

function minutes(seconds: number): number {
  return Math.max(1, Math.ceil(seconds / 60));
}

/**
 * Dùng cho `POST /api/auth/login`.
 * Chỉ tính khi server trả 401 (sai email hoặc mật khẩu).
 */
export function loginRateLimit(req: Request, res: Response, next: NextFunction): void {
  const email =
    typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const emailKey = email ? `login:email:${email}` : null;
  const ipKey = `login:ip:${req.ip ?? "khong-ro"}`;

  if (emailKey) {
    const wait = waitingSeconds(emailKey, EMAIL_LIMIT);
    if (wait) {
      refuse(
        res,
        wait,
        `Tài khoản này vừa bị thử sai quá nhiều lần. Bạn chờ khoảng ${minutes(wait)} phút rồi thử lại nhé.`,
      );
      return;
    }
  }

  const ipWait = waitingSeconds(ipKey, IP_LIMIT);
  if (ipWait) {
    refuse(
      res,
      ipWait,
      `Có quá nhiều lần đăng nhập thất bại từ kết nối này. Bạn chờ khoảng ${minutes(ipWait)} phút rồi thử lại nhé.`,
    );
    return;
  }

  res.on("finish", () => {
    if (res.statusCode === 401) {
      bump(ipKey, IP_LIMIT);
      if (emailKey) bump(emailKey, EMAIL_LIMIT);
      return;
    }
    /* Đăng nhập đúng → xoá bộ đếm của tài khoản đó, không để lần gõ nhầm trước
       đó ảnh hưởng về sau. Bộ đếm theo IP giữ nguyên để vẫn chặn được kẻ dò
       nhiều tài khoản khác nhau từ cùng một máy. */
    if (res.statusCode < 400 && emailKey) buckets.delete(emailKey);
  });

  next();
}

/**
 * Dùng cho `POST /api/auth/register`.
 * Đếm ngay mọi lần gọi, vì mục đích ở đây là chặn tạo tài khoản hàng loạt.
 */
export function registerRateLimit(req: Request, res: Response, next: NextFunction): void {
  const ipKey = `register:ip:${req.ip ?? "khong-ro"}`;

  const wait = waitingSeconds(ipKey, REGISTER_LIMIT);
  if (wait) {
    refuse(
      res,
      wait,
      `Có quá nhiều yêu cầu tạo tài khoản từ kết nối này. Bạn thử lại sau khoảng ${minutes(wait)} phút nhé.`,
    );
    return;
  }

  bump(ipKey, REGISTER_LIMIT);
  next();
}
