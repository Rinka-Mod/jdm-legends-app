# Hướng dẫn đưa web lên mạng — Netlify (giao diện) + alwaysdata (API)

> **Tác giả (Author):** [**Rinka-Mod**](https://www.facebook.com/chaupham2008) · © 2026 · All rights reserved.
> Dùng lại dự án này? Hãy ghi: **“Dựa trên dự án JDM LEGENDS của Rinka-Mod”**.
> Xem [`../LICENSE.md`](../LICENSE.md).

Hướng dẫn này dành cho cách deploy **miễn phí**: giao diện React nằm ở **Netlify**, còn
API Express + file SQLite nằm ở **alwaysdata**. Cả hai đều không cần thẻ thanh toán.

---

## 1. Vì sao phải chia hai nơi?

| | Netlify | alwaysdata |
|---|---|---|
| Chạy được | file tĩnh (HTML/CSS/JS đã build) | tiến trình Node.js chạy liên tục |
| Chạy được Express? | **Không** | **Có** |
| Giữ được file SQLite? | **Không** (ổ đĩa tạm) | **Có** (1 GB, không mất khi restart) |
| Giao diện admin | rất dễ, deploy từ GitHub | web panel + SSH/SFTP |

Nói ngắn: Netlify mở web lên là xong nhưng **không có máy chủ**. Nếu chỉ deploy Netlify,
trang chủ vẫn hiện nhưng phần **Thư viện xe, đăng nhập và Garage sẽ báo lỗi** vì không có
API trả dữ liệu.

---

## 2. Vì sao lần build trên Netlify bị lỗi `tsc: not found`

Netlify cài dependency **chỉ ở thư mục gốc** (`/opt/build/repo`), mà `package.json` ở gốc
chỉ có duy nhất `concurrently`. Trong khi lệnh build ở gốc lại gọi
`npm --prefix server run build` → `tsc -p tsconfig.json` → **`tsc` không tồn tại**
(exit code 127), nên build dừng.

**Đã sửa** bằng file [`../netlify.toml`](../netlify.toml): build **chỉ trong thư mục
`client/`** (nơi có `typescript` trong `devDependencies`), và thêm quy tắc chuyển hướng
cho React Router.

> Nếu repo của bạn đang có một `netlify.toml` khác, hãy **thay bằng bản trong dự án này**
> rồi commit lại. Kiểm tra lại trong Netlify: **Site configuration → Build & deploy →
> Build settings** phải hiện `base: client`, `publish: dist`.

---

## 3. Phần A — Đưa API lên alwaysdata

### A1. Tạo tài khoản

1. Vào **alwaysdata.com** → đăng ký gói **Free** (1 GB đĩa, 256 MB RAM, **không cần thẻ**,
   không giới hạn thời gian).
2. Bạn sẽ có địa chỉ dạng `https://<tên-tài-khoản>.alwaysdata.net`.
   Gói Free **không gắn được tên miền riêng** và chỉ dùng cho mục đích cá nhân.
3. Vào **Remote access → SSH/SFTP**, tạo một user SSH nếu chưa có (dùng chính tên tài khoản
   cũng thường được cấp sẵn).

### A2. Chọn Node.js phiên bản 24

Vào **Advanced (Environment) → Node.js** và đặt phiên bản mặc định là **24**.

> **Bắt buộc phải là 22.13 trở lên hoặc 24.** Module `node:sqlite` mà server dùng chỉ
> được bật sẵn (không cần cờ `--experimental-sqlite`) từ **Node 22.13**. Dùng Node 20
> hoặc 22.5–22.12 sẽ chết ngay với lỗi kiểu `Cannot find module 'node:sqlite'`.

### A3. Build ở máy bạn

```bash
cd server
npm ci
npm run build          # tạo ra server/dist
```

### A4. Upload lên alwaysdata

Chỉ cần 3 thứ: `dist/`, `package.json`, `package-lock.json` (không upload `node_modules`,
không cần `src/` vì đã build thành `dist/`).

```bash
# chạy từ thư mục gốc dự án
scp -r server/dist server/package.json server/package-lock.json \
    <tài-khoản>@ssh-<tài-khoản>.alwaysdata.net:~/jdm-api/
```

Không có SSH client? Dùng SFTP tới `ssh-<tài-khoản>.alwaysdata.net` cổng 22, hoặc dùng
trình SSH trên web tại `https://ssh-<tài-khoản>.alwaysdata.net`.

### A5. Cài dependency production trên máy chủ

```bash
ssh <tài-khoản>@ssh-<tài-khoản>.alwaysdata.net
cd ~/jdm-api
npm ci --omit=dev          # chỉ cài thư viện chạy thật, bỏ typescript/tsx
mkdir -p data              # nơi đặt file SQLite
```

> Cài được như vậy vì server **không dùng thư viện native nào**: `bcryptjs` là JavaScript
> thuần và SQLite nằm sẵn trong Node — không cần trình biên dịch C++.

### A6. Tạo site Node.js

**Web → Sites → Add a site** → chọn loại **Node.js**. Ô **Command** điền:

```
node /home/<tài-khoản>/jdm-api/dist/index.js
```

> Ứng dụng **phải** nghe đúng IP và cổng mà alwaysdata cấp. Server đã được sửa để đọc
> biến `HOST` / `IP` / `PORT` do alwaysdata truyền vào, nên bạn không cần làm gì thêm.

### A7. Khai báo biến môi trường

Thêm các biến sau (ở phần **Environment** của tài khoản, hoặc điền thẳng vào ô
**Command** phía trước lệnh `node`):

| Biến | Giá trị | Ghi chú |
|---|---|---|
| `JWT_SECRET` | một chuỗi ngẫu nhiên rất dài | **Bắt buộc đổi** — nếu bỏ trống, server dùng khoá mặc định trong mã nguồn, ai đọc code cũng tự ký được token đăng nhập |
| `CLIENT_ORIGIN` | `https://<tên-site>.netlify.app` | Nhiều tên miền thì cách nhau dấu phẩy. Sai giá trị này sẽ báo lỗi CORS |
| `DATABASE_PATH` | `/home/<tài-khoản>/jdm-api/data/jdm.sqlite` | Để trong thư mục nhà cho chắc chắn không bị mất |
| `NODEJS_VERSION` | `24` | Nếu Node mặc định của tài khoản không phải 24 |

Tạo khoá ngẫu nhiên nhanh:

```bash
node -e "console.log(crypto.randomUUID()+crypto.randomUUID())"
```

### A8. Kiểm tra

```bash
curl https://<tài-khoản>.alwaysdata.net/api/health
# -> {"ok":true,"service":"jdm-legends-api","database":"/home/.../jdm.sqlite"}

curl "https://<tài-khoản>.alwaysdata.net/api/cars?brand=Nissan" | head -c 200
```

---

## 4. Phần B — Nối Netlify vào API

1. Netlify → **Site configuration → Environment variables** → thêm:

   | Key | Value |
   |---|---|
   | `VITE_API_BASE` | `https://<tài-khoản>.alwaysdata.net/api` |

   (nhớ có `/api` ở cuối, không có dấu `/` thừa ở cuối cùng)

2. **Deploys → Trigger deploy → Clear cache and deploy site.**
   Biến `VITE_*` là biến **lúc build** — đổi biến mà không deploy lại thì web cũ vẫn giữ
   địa chỉ API cũ.

---

## 5. Kiểm tra sau khi xong

- [ ] `https://<tài-khoản>.alwaysdata.net/api/health` trả `{"ok":true,...}`
- [ ] Mở web Netlify: phần **Thư viện** hiện đủ xe (không còn dòng báo lỗi kết nối)
- [ ] Bấm lọc theo thương hiệu, tìm kiếm, sắp xếp — đều chạy
- [ ] Đăng ký một tài khoản → lưu 1–2 xe vào Garage → **F5** vẫn còn
- [ ] Mở thẳng `https://<tên-site>.netlify.app/car/supra-a80` rồi F5 → vẫn vào đúng
      trang (nhờ quy tắc `redirects` trong `netlify.toml`)
- [ ] Vào alwaysdata bấm **Restart** site, chờ vài giây, tải lại web → tài khoản vẫn còn
      (nếu mất, `DATABASE_PATH` đang trỏ sai chỗ)

---

## 6. Lỗi thường gặp

| Hiện tượng | Nguyên nhân & cách sửa |
|---|---|
| Web báo *“Không kết nối được máy chủ”* | Chưa đặt `VITE_API_BASE`, hoặc đặt rồi nhưng **không deploy lại** |
| Console báo lỗi **CORS** | `CLIENT_ORIGIN` trên alwaysdata không khớp tên miền Netlify. Thêm đúng tên miền (kể cả `www`) và **restart site** |
| `Cannot find module 'node:sqlite'` | Node trên alwaysdata < 22.13. Đặt `NODEJS_VERSION=24` rồi restart |
| Web deploy xong vẫn lỗi build `tsc: not found` | Repo vẫn còn `netlify.toml` cũ. Thay bằng bản trong dự án này |
| Mở `/car/supra-a80` ra trang 404 của Netlify | Thiếu mục `[[redirects]]` trong `netlify.toml` |
| Tài khoản/garage biến mất sau khi restart | `DATABASE_PATH` trỏ ra ngoài thư mục nhà, hoặc chưa khai báo nên ghi vào thư mục tạm |
| Lần đầu mở web rất chậm rồi mới chạy | Bình thường với host miễn phí — tiến trình có thể “ngủ” khi lâu không ai truy cập |

---

## 7. Điều cần biết trước khi chọn cách này

- Gói **Free của alwaysdata**: 1 GB đĩa, 256 MB RAM, không cần thẻ, không giới hạn thời
  gian, **nhưng** không gắn được tên miền riêng (chỉ dùng địa chỉ `*.alwaysdata.net`) và
  không dùng cho mục đích thương mại. Trang giá của họ cũng ghi gói Free *“không dùng để
  chạy service”* — theo tài liệu chính thức thì một **site loại Node.js** vẫn là cách
  deploy được hỗ trợ, nhưng nếu lúc tạo site bạn bị từ chối, đây là các phương án dự phòng:
  - **Render** (gói Free): deploy thẳng từ GitHub, không cần sửa code, nhưng **không có ổ
    đĩa bền** → tài khoản và xe đã lưu sẽ mất mỗi lần restart/deploy, và web tự “ngủ” sau
    15 phút không truy cập.
  - **VPS miễn phí** (Oracle Cloud *Always Free*, hoặc Google Cloud `e2-micro` free tier):
    bền nhất, chạy 24/7, nhưng cần thẻ để xác minh và phải tự cài Node rồi cho chạy nền.
- Giao diện **vẫn nên để ở Netlify** kể cả khi API nằm ở VPS — Netlify có CDN và deploy
  tự động từ GitHub, cập nhật giao diện nhanh hơn nhiều.

---

> Dùng lại dự án này? Hãy ghi: **“Dựa trên dự án JDM LEGENDS của Rinka-Mod”**.
> ありがとう。
