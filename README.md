# JDM LEGENDS — Web App (Full-Stack)

> Chuyển thể từ trang web tĩnh **JDM LEGENDS** (HTML/CSS/JS thuần) thành một ứng dụng web
> đầy đủ **Back-End + Front-End**.
>
> **Tác giả (Author):** [**Rinka-Mod**](https://www.facebook.com/chaupham2008) · © 2026 · All rights reserved.
> Xem [`LICENSE.md`](./LICENSE.md) — bắt buộc ghi rõ tên tác giả khi tái sử dụng.

---

## 1. Tổng quan

| | Công nghệ |
|---|---|
| **Back-End** | Node.js · TypeScript · Express · SQLite (`node:sqlite` built-in) · JWT · bcrypt |
| **Front-End** | TypeScript · React 18 · React Router · Vite |
| **Dữ liệu** | SQLite (file `server/data/jdm.sqlite`), tự seed ở lần chạy đầu |
| **Xác thực** | Đăng ký / đăng nhập bằng email + mật khẩu, token JWT (7 ngày) |

Front-End tái sử dụng **nguyên vẹn** `assets/css/style.css` của bản gốc (3 357 dòng) làm nền
tảng thiết kế, nên giữ đúng hai giao diện đặc trưng: **mobile app-like** (≤ 860px) và
**PC sidebar** (≥ 1024px). Toàn bộ hình minh hoạ xe vẫn là **SVG/CSS**, không dùng ảnh bitmap.

---

## 2. Cấu trúc thư mục

```
jdm-legends-app/
├── server/                      # Back-End
│   ├── src/
│   │   ├── index.ts             # Express app + phục vụ bản build client
│   │   ├── db.ts                # Schema + seed SQLite
│   │   ├── repository.ts        # Truy vấn xe / timeline / văn hoá / FAQ
│   │   ├── data/                # Dữ liệu gốc (cars, content, faq)
│   │   ├── middleware/auth.ts   # JWT: requireAuth / optionalAuth
│   │   └── routes/              # cars, content, auth, garage
│   └── .env.example
├── client/                      # Front-End
│   ├── src/
│   │   ├── App.tsx              # Layout + định tuyến
│   │   ├── components/          # Hero, Card, Modal, Heritage, Culture, Garage, Chat…
│   │   │   └── library/         # Chi tiết Thư viện xe (bộ lọc, chip hãng, sheet, hook)
│   │   ├── pages/               # Home, CarPage, Login, Register, MyGarage, 404
│   │   ├── lib/                 # api, auth (context), hooks, toast, ui
│   │   ├── data/shapes.ts       # Hình dáng xe SVG + điều hướng
│   │   ├── index.css            # Danh sách @import (không chứa rule)
│   │   └── styles/
│   │       ├── style.css        # CSS gốc, giữ nguyên
│   │       ├── app/             # CSS thành phần mới của bản Web App
│   │       └── mobile/          # Lớp làm mới giao diện mobile (≤ 860px)
│   └── public/                  # chihara.jpg, logoChatbot.png
├── netlify.toml                 # Cấu hình deploy giao diện lên Netlify (kèm proxy /api → API)
├── docs/
│   ├── cau-truc-thu-muc.md      # Giải thích từng thư mục / file dùng để làm gì
│   ├── deploy-netlify-alwaysdata.md   # Hướng dẫn đưa web lên mạng miễn phí
│   └── tong-hop-thong-tin-jdm-car.txt   # Tài liệu về xe JDM (từ bản gốc)
├── huong-dan-deploy/            # Hướng dẫn deploy dạng CHUNG: 5 lỗi thực tế đã gặp + cách sửa
│   └── README.md
└── LICENSE.md
```

> Giải thích chi tiết từng file và mục "muốn sửa gì thì mở file nào": xem
> [`docs/cau-truc-thu-muc.md`](./docs/cau-truc-thu-muc.md).

---

## 3. Cài đặt & chạy

Yêu cầu: **Node.js ≥ 22.5** (vì dùng module `node:sqlite` có sẵn, không cần cài native dependency).

```bash
cd jdm-legends-app

# 1) Cài dependency cho cả hai phía
npm run install:all
npm install                     # cài `concurrently` cho script dev ở gốc

# 2) (tuỳ chọn) tạo file .env cho server
cp server/.env.example server/.env

# 3) Chạy song song API + web trong lúc phát triển
npm run dev
```

| Dịch vụ | Địa chỉ |
|---|---|
| Front-End (Vite) | http://localhost:5173 |
| Back-End (API) | http://localhost:4000 |
| Kiểm tra API | http://localhost:4000/api/health |

Vite được cấu hình proxy `/api` → `http://localhost:4000`, nên front-end không cần biết
địa chỉ tuyệt đối của máy chủ.

### Chạy chế độ production

```bash
npm run build     # build server (tsc) + client (vite build)
npm start         # server phục vụ luôn client/dist tại http://localhost:4000
```

---

## 4. API

Base URL: `/api`

### Xe

| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/cars` | Danh sách xe. Query: `brand`, `q`, `drivetrain`, `yearFrom`, `yearTo`, `minPower`, `maxPower`, `sort`, `limit`, `offset` |
| `GET` | `/cars/:id` | Hồ sơ một xe |
| `GET` | `/brands` | Danh sách thương hiệu kèm số lượng |
| `GET` | `/stats` | Số liệu tổng quan (12 xe, 6 thương hiệu, 6 thời kỳ, 8 chủ đề, 20 câu hỏi) |

`sort` nhận: `default` · `power` · `weight` · `year` · `accel` · `legacy`.

```bash
curl "http://localhost:4000/api/cars?brand=Nissan&sort=power"
curl "http://localhost:4000/api/cars?q=sr20&drivetrain=FR"
```

### Nội dung

| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/eras` | 6 thời kỳ lịch sử |
| `GET` | `/culture` | 8 chủ đề văn hoá JDM |
| `GET` | `/faq` | Lời chào + 20 câu hỏi có sẵn cho trợ lý |
| `POST` | `/faq/ask` | Hỏi tự do — server bỏ dấu tiếng Việt rồi khớp câu trả lời gần nhất |
| `POST` | `/subscribe` | Đăng ký bản tin (email lưu vào bảng `subscribers`) |

```bash
curl -X POST http://localhost:4000/api/faq/ask \
  -H "Content-Type: application/json" \
  -d '{"question":"xe nao manh nhat"}'
```

### Tài khoản & Garage

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| `POST` | `/auth/register` | — | `{ name, email, password }` → `{ user, token }` |
| `POST` | `/auth/login` | — | `{ email, password }` → `{ user, token }` |
| `GET` | `/auth/me` | ✅ | Thông tin người dùng hiện tại |
| `GET` | `/garage` | ✅ | Danh sách xe đã lưu |
| `POST` | `/garage/:carId` | ✅ | Lưu một xe |
| `DELETE` | `/garage/:carId` | ✅ | Bỏ lưu |

Gửi token qua header: `Authorization: Bearer <token>`.

---

## 5. Tính năng so với bản tĩnh

### Đã có ở bản gốc (giữ nguyên hành vi)
Hero parallax + đếm số, thư viện 12 xe, lọc theo thương hiệu, tìm kiếm, hồ sơ xe (modal/ngăn kéo),
dòng thời gian ngang theo cuộn, 8 chủ đề văn hoá, form bản tin, trợ lý Chihara Mai,
preloader, con trỏ tuỳ biến, sidebar PC thu gọn được, tab bar mobile, bottom sheet bộ lọc,
thẻ xe trượt ngang + chấm chỉ mục.

### Nâng cấp ở bản Web App
- **Back-End thật**: dữ liệu nằm trong SQLite, lọc/tìm/sắp xếp xử lý phía server bằng SQL.
- **Tài khoản người dùng**: đăng ký/đăng nhập JWT, mật khẩu băm bằng bcrypt.
- **Garage thật**: lưu/bỏ lưu xe yêu thích, đồng bộ theo tài khoản, có trang `/garage` riêng.
- **Bản tin thật**: email đăng ký được lưu vào database, có kiểm tra trùng.
- **Trợ lý hỏi đáp có API**: `POST /faq/ask` chuẩn hoá tiếng Việt không dấu để so khớp.
- **Bộ lọc nâng cao**: theo năm, dẫn động (FR/AWD/MR/FF), mã lực tối thiểu và 6 kiểu sắp xếp.
- **Deep link**: URL phản ánh trạng thái (`/?car=supra-a80`), có nút Back của trình duyệt hoạt động.
- **Trang riêng cho từng xe**: `/car/:id` kèm nút xe trước / xe sau.
- **Preloader bỏ qua được**: bấm vào bất kỳ đâu để vào thẳng, ghi nhớ trong `sessionStorage`.
- **Sửa lỗi nhỏ**: `href="#"` nay trỏ tới đích thật; thêm thẻ Open Graph;
  nút `/` focus ô tìm kiếm; phím `←/→` chuyển xe trong hồ sơ; `Esc` đóng mọi lớp phủ.

---

## 6. Ghi chú kỹ thuật

- **Ranking câu trả lời trợ lý** (`server/src/routes/content.ts`): chuẩn hoá NFD → bỏ dấu →
  bỏ ký tự đặc biệt, sau đó cộng điểm theo độ dài từ khoá trùng. Ngưỡng khớp là `>= 4`
  để tránh trả lời sai khi câu hỏi quá ngắn.
- **Không dùng thư viện native**: `node:sqlite` là module có sẵn của Node ≥ 22.5, nên
  `npm install` không cần trình biên dịch C++.
- **CSS tái sử dụng**: các component React render đúng tên lớp/ID mà `style.css` gốc
  mong đợi. Phần CSS **mới** (bộ lọc nâng cao, nút Garage, trang tài khoản, trang xe)
  nằm ở `client/src/styles/app/`, còn lớp làm mới mobile nằm ở `client/src/styles/mobile/`;
  hai thư mục đó được nạp qua danh sách `@import` trong `index.css` và `styles/mobile.css`.
  **Thứ tự nạp là quy tắc cascade — đừng sắp xếp lại.**
- **Truy cập**: `Esc` đóng modal/sheet/chat; `/` (PC) focus ô tìm kiếm; `←` `→` chuyển xe.

---

## 7. Việc nên làm tiếp

Xem [`ROADMAP.md`](../Model%20AI/ROADMAP.md) của bản gốc để chọn tiếp. Một số mục còn lại:
thêm test tự động, `robots.txt` + `sitemap.xml`, PWA (manifest + service worker),
so sánh 2–3 xe cạnh nhau, theme sáng/tối, đa ngôn ngữ VI/EN, phân trang khi thư viện lớn hơn.

---

> Dùng lại dự án này? Hãy ghi: **“Dựa trên dự án JDM LEGENDS của Rinka-Mod”**.
> ありがとう。
