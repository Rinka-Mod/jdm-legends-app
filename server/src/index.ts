/**
 * ==========================================================================
 * JDM LEGENDS — Back-End
 * Thư viện số về xe thể thao Nhật Bản.
 *
 * Tác giả / Author : Rinka-Mod
 * © 2026 Rinka-Mod. All rights reserved.
 *
 * ĐIỀU KIỆN TÁI SỬ DỤNG:
 * Nếu bạn dùng lại toàn bộ hoặc phần lớn dự án này, BẮT BUỘC phải ghi rõ tên
 * tác giả "Rinka-Mod" ở cuối trang (footer) và trong mã nguồn. Không được xoá
 * hoặc thay thế thông tin tác giả.
 * ==========================================================================
 */

import { existsSync } from "node:fs";
import { resolve } from "node:path";
import express from "express";
import cors from "cors";

import { DB_PATH, seedDatabase } from "./db.js";
import { listCars, listCulture, listEras, listFaq } from "./repository.js";
import { carsRouter } from "./routes/cars.js";
import { contentRouter } from "./routes/content.js";
import { authRouter } from "./routes/auth.js";
import { garageRouter } from "./routes/garage.js";

const PORT = Number(process.env.PORT ?? 4000);

/* Ở host dạng shared như alwaysdata, ứng dụng phải nghe đúng IP và cổng mà họ
   cấp, và cả hai đều được truyền vào qua biến môi trường. Mặc định 0.0.0.0 để
   vẫn chạy được ở máy cá nhân và trên mọi host khác. */
const HOST = process.env.HOST || process.env.IP || "0.0.0.0";

/* Danh sách tên miền được phép gọi API, cách nhau bằng dấu phẩy — cần thiết vì
   front-end nằm ở Netlify còn API nằm ở nơi khác:
     CLIENT_ORIGIN=https://jdm-legends.netlify.app,https://jdm.ten-mien.net
   Giá trị "*" là cho phép mọi tên miền (tiện lúc thử, đừng dùng lâu dài vì
   API có gửi kèm token đăng nhập). */
const CLIENT_ORIGINS = (process.env.CLIENT_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

seedDatabase();

const app = express();
app.use(
  cors({
    origin(origin, callback) {
      // Không có `Origin` (curl, health check, hoặc gọi cùng tên miền) → cho qua
      if (!origin) return callback(null, true);
      if (CLIENT_ORIGINS.includes("*")) return callback(null, true);
      return callback(null, CLIENT_ORIGINS.includes(origin) || origin === `http://localhost:${PORT}`);
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "200kb" }));

/* ------------------------------------------------------------------
   Header bảo mật tối thiểu — không cần thêm thư viện nào.

   Cố tình KHÔNG đặt Content-Security-Policy: giao diện có script inline cho
   màn hình chờ (xem client/index.html), CSP đặt sai một chút là trang trắng.
   Nếu muốn dùng CSP thì phải kèm hash/nonce cho đúng script đó.
   ------------------------------------------------------------------ */
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  next();
});

/* Token đăng nhập không được để trình duyệt hay proxy trung gian lưu lại. */
app.use("/api/auth", (_req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

app.get("/api/health", (_req, res) => {
  /* Chỉ trả thông tin tối thiểu. Đường dẫn tuyệt đối của file SQLite (lộ tên tài
     khoản và cấu trúc thư mục trên máy chủ) chỉ hiện khi bật HEALTH_DETAIL=1. */
  res.json({
    ok: true,
    service: "jdm-legends-api",
    ...(process.env.HEALTH_DETAIL === "1" ? { database: DB_PATH } : {}),
  });
});

/** Số liệu tổng quan dùng cho sidebar/topbar. */
app.get("/api/stats", (_req, res) => {
  const cars = listCars();
  const brands = new Set(cars.map((c) => c.brand));
  res.json({
    stats: {
      cars: cars.length,
      brands: brands.size,
      eras: listEras().length,
      culture: listCulture().length,
      faq: listFaq().length,
      since: Math.min(...cars.map((c) => c.year)),
    },
  });
});

app.use("/api", carsRouter);
app.use("/api", contentRouter);
app.use("/api", authRouter);
app.use("/api", garageRouter);

app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Endpoint không tồn tại." });
});

/* ------------------------------------------------------------------
   Phục vụ bản build của front-end khi chạy production.
   Chạy `npm run build` ở client trước, rồi `npm start` ở server.
   ------------------------------------------------------------------ */
const clientDist = resolve(process.cwd(), "..", "client", "dist");
if (existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get("*", (_req, res) => {
    res.sendFile(resolve(clientDist, "index.html"));
  });
}

app.use(((err, _req, res, _next) => {
  console.error("[JDM] Lỗi không mong đợi:", err);
  res.status(500).json({ error: "Máy chủ gặp lỗi, bạn thử lại sau nhé." });
}) as express.ErrorRequestHandler);

app.listen(PORT, HOST, () => {
  const shown = HOST === "0.0.0.0" ? "localhost" : HOST;
  console.log(`\n  🏁 JDM LEGENDS API đang chạy tại http://${shown}:${PORT}`);
  console.log(`  📚 Thư viện: ${listCars().length} xe · DB: ${DB_PATH}`);
  console.log(`  © 2026 Rinka-Mod — Credit required when reused\n`);
});
