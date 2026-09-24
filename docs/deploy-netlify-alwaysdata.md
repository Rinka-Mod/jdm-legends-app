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
> rồi commit lại. Khi repo đã có `netlify.toml`, Netlify **lấy cấu hình từ chính file đó** và
> phần Build settings trong panel chỉ còn để tham khảo — nên hãy kiểm tra trực tiếp trong
> file: phải có `base = "client"` và `publish = "dist"`.

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

> ⚠️ **Ô Working directory phải là đường dẫn TƯƠNG ĐỐI tính từ thư mục nhà — điền
> `jdm-api`, KHÔNG điền `/home/<tài-khoản>/jdm-api`.** alwaysdata tự ghép thư mục nhà
> (`/home/<tài-khoản>`) vào trước giá trị bạn nhập, nên nếu dán đường dẫn tuyệt đối vào,
> thư mục làm việc sẽ bị **lặp hai lần**:
>
> ```
> cwd: /home/jdmlegends/home/jdmlegends/jdm-api      ← sai, không tồn tại
> cwd: /home/jdmlegends/jdm-api                       ← đúng
> ```
>
> Hậu quả: trong `~/admin/logs/sites/` sẽ có `Upstream starting failed: node
> /home/.../dist/index.js (reason: No such file or directory)`, còn trình duyệt chỉ thấy
> **502 Bad Gateway** ở mọi đường dẫn. Bỏ trắng ô này cũng chạy được, vì `DATABASE_PATH`
> đã là đường dẫn tuyệt đối. Sửa xong nhớ bấm **Restart** site.

> Ứng dụng **phải** nghe đúng IP và cổng mà alwaysdata cấp. Server đã được sửa để đọc
> biến `HOST` / `IP` / `PORT` do alwaysdata truyền vào, nên bạn không cần làm gì thêm.

### A7. Khai báo biến môi trường

Thêm các biến sau (ở phần **Environment** của tài khoản, hoặc điền thẳng vào ô
**Command** phía trước lệnh `node`):

| Biến | Giá trị | Ghi chú |
|---|---|---|
| `JWT_SECRET` | một chuỗi ngẫu nhiên rất dài | **Bắt buộc đổi** — nếu bỏ trống, server dùng khoá mặc định trong mã nguồn, ai đọc code cũng tự ký được token đăng nhập |
| `CLIENT_ORIGIN` | `https://<tên-site>.netlify.app` | Nhiều tên miền thì cách nhau dấu phẩy. **Chỉ cần khi dùng Cách A** (gọi API trực tiếp); dùng proxy ở mục 4 thì đặt hay không cũng được |
| `DATABASE_PATH` | `/home/<tài-khoản>/jdm-api/data/jdm.sqlite` | Để trong thư mục nhà cho chắc chắn không bị mất |
| `NODEJS_VERSION` | `24` | Nếu Node mặc định của tài khoản không phải 24 |

Tạo khoá ngẫu nhiên nhanh:

```bash
node -e "console.log(crypto.randomUUID()+crypto.randomUUID())"
```

### A8. Kiểm tra

```bash
curl https://<tài-khoản>.alwaysdata.net/api/health
# -> {"ok":true,"service":"jdm-legends-api"}

# Đường dẫn file SQLite KHÔNG được trả ra mặc định (tránh lộ cấu trúc máy chủ).
# Khi cần kiểm tra DATABASE_PATH trỏ đúng chỗ, khai báo tạm HEALTH_DETAIL=1 rồi Restart:
# -> {"ok":true,"service":"jdm-legends-api","database":"/home/<tài-khoản>/jdm-api/data/jdm.sqlite"}

curl "https://<tài-khoản>.alwaysdata.net/api/cars?brand=Nissan" | head -c 200
```

### A9. Cập nhật API về sau (không làm mất dữ liệu)

Mỗi lần sửa code back-end, làm đúng 3 bước:

```bash
# 1) Build ở máy bạn
cd server
npm run build

# 2) Đẩy lên máy chủ — CHỈ đẩy dist/, tuyệt đối KHÔNG đẩy data/
scp -r dist <tài-khoản>@ssh-<tài-khoản>.alwaysdata.net:~/jdm-api/
```

```bash
# 3) Trên máy chủ
ssh <tài-khoản>@ssh-<tài-khoản>.alwaysdata.net
cd ~/jdm-api
npm ci --omit=dev      # chỉ cần khi package.json có thay đổi
mkdir -p data          # nơi chứa SQLite — phải còn nguyên
```

Rồi **Web → Sites → Restart** site và kiểm tra lại `/api/health`.

> ⚠️ **Đừng bao giờ đẩy `data/` hay file `.sqlite` từ máy bạn lên máy chủ.** Dữ liệu thật
> (tài khoản, xe đã lưu, email bản tin) nằm trên máy chủ; đẩy đè lên là **mất sạch**. Muốn
> sao lưu thì kéo file *từ máy chủ về*:
>
> ```bash
> scp <tài-khoản>@ssh-<tài-khoản>.alwaysdata.net:~/jdm-api/data/jdm.sqlite ./backup-jdm.sqlite
> ```
>
> Nên sao lưu trước mỗi lần cập nhật có đụng tới database.

Sau khi Restart, đăng nhập thử một tài khoản cũ để chắc chắn database vẫn nguyên.

---

## 4. Phần B — Nối Netlify vào API

Giao diện gọi API bằng đường dẫn **tương đối** `/api` (xem `client/src/lib/api.ts`), còn
Netlify thì không có API. Vậy phải chuyển tiếp `/api/*` sang alwaysdata. Có 2 cách — **chọn
một, đừng dùng cả hai**.

### Cách B — để Netlify làm proxy (**khuyên dùng**, dự án đã cấu hình sẵn)

[`../netlify.toml`](../netlify.toml) đã có sẵn quy tắc này; bạn chỉ cần thay địa chỉ API bằng
đúng tên miền của mình:

```toml
[[redirects]]
  from = "/api/*"
  to = "https://<tài-khoản>.alwaysdata.net/api/:splat"
  status = 200
  force = true
```

Rồi commit + push để Netlify build lại. **Không cần** đặt biến môi trường nào.

Vì sao nên chọn cách này:

- Trình duyệt chỉ gọi **cùng tên miền** Netlify → **không bao giờ gặp lỗi CORS**, kể cả
  `CLIENT_ORIGIN` bên alwaysdata có sai.
- Đổi địa chỉ API chỉ cần sửa dòng `to` rồi deploy lại — không phải deploy lại vì biến môi
  trường (biến `VITE_*` chỉ áp dụng lúc build nên rất dễ quên).

Hai điều kiện bắt buộc:

1. Quy tắc `/api/*` phải nằm **TRƯỚC** quy tắc `/*` → `/index.html` ở cuối file. Netlify duyệt
   từ trên xuống, quy tắc nào khớp trước thì thắng. Đặt sai thứ tự thì `/api/*` bị trả về
   `index.html` **kèm status 200** → giao diện nhận HTML trong khi chờ JSON nên vỡ ở
   `JSON.parse`, mà **log của API không ghi gì cả** vì request không hề tới API.
2. Netlify → **Project configuration → Environment variables**: nếu có biến `VITE_API_BASE`
   thì **XOÁ**. Còn biến đó thì giao diện gọi thẳng sang alwaysdata (biến thắng proxy) và lỗi
   CORS quay lại.

### Cách A — dùng biến `VITE_API_BASE` (chỉ khi không dùng được proxy)

1. Netlify → **Project configuration → Environment variables** → thêm:

   | Key | Value |
   |---|---|
   | `VITE_API_BASE` | `https://<tài-khoản>.alwaysdata.net/api` |

   (nhớ có `/api` ở cuối, không có dấu `/` thừa ở cuối cùng)

2. Bắt buộc khai báo `CLIENT_ORIGIN` trên alwaysdata cho khớp tên miền Netlify (xem A7) — kể
   cả tên miền deploy preview `https://<id>--<tên-site>.netlify.app` nếu bạn dùng.

3. **Deploys → Trigger deploy → Clear cache and deploy site.**
   Biến `VITE_*` là biến **lúc build** — đổi biến mà không deploy lại thì web cũ vẫn giữ
   địa chỉ API cũ.

---

## 5. Kiểm tra sau khi xong

- [ ] `https://<tài-khoản>.alwaysdata.net/api/health` trả `{"ok":true,...}`
- [ ] `https://<tên-site>.netlify.app/api/health` **cũng** trả `{"ok":true,...}` — chứng minh
      Netlify đã chuyển tiếp đúng sang API (nếu ra **HTML** thì xem mục 6)
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
| Web báo *“Không kết nối được máy chủ”* | Dùng **Cách B**: quy tắc `/api/*` thiếu hoặc nằm **sau** quy tắc `/*`, hoặc Netlify chưa build lại. Dùng **Cách A**: chưa đặt `VITE_API_BASE`, đặt rồi mà không deploy lại, hoặc còn sót biến đó nên proxy bị vô hiệu |
| `https://<tên-site>.netlify.app/api/...` trả về **HTML** kèm status 200 thay vì JSON | Quy tắc `/api/*` chưa có hoặc bị đặt **sau** `/*` → `/index.html`. Kiểm tra thứ tự trong `netlify.toml`. Dấu hiệu nhận biết: request **không hề xuất hiện** trong log của API |
| Mọi đường dẫn của `*.alwaysdata.net` trả **502 Bad Gateway**, log site có `Upstream starting failed ... (reason: No such file or directory)` | Ô **Working directory** của site đang ghi đường dẫn tuyệt đối nên bị lặp (`cwd: /home/x/home/x/jdm-api`). Sửa thành `jdm-api` (tương đối từ thư mục nhà) hoặc để trắng, rồi **Restart** site |
| Mở `https://<tài-khoản>.alwaysdata.net/` ra `Cannot GET /` | **Bình thường** — đây là máy chủ API, không phải giao diện. Giao diện nằm ở Netlify; chỉ cần kiểm tra `/api/health` |
| Console báo lỗi **CORS** | Đang dùng **Cách A** mà `CLIENT_ORIGIN` trên alwaysdata không khớp tên miền Netlify. Thêm đúng tên miền (kể cả `www`) và **restart site**. Dùng **Cách B** (proxy) thì lỗi này không thể xảy ra |
| `Cannot find module 'node:sqlite'` | Node trên alwaysdata < 22.13. Đặt `NODEJS_VERSION=24` rồi restart |
| Web deploy xong vẫn lỗi build `tsc: not found` | Repo vẫn còn `netlify.toml` cũ. Thay bằng bản trong dự án này |
| Mở `/car/supra-a80` ra trang 404 của Netlify | Thiếu mục `[[redirects]]` trong `netlify.toml` |
| Tài khoản/garage biến mất sau khi restart | `DATABASE_PATH` trỏ ra ngoài thư mục nhà, hoặc chưa khai báo nên ghi vào thư mục tạm |
| Lần đầu mở web rất chậm rồi mới chạy | Bình thường với host miễn phí — tiến trình có thể “ngủ” khi lâu không ai truy cập |

> Danh sách lỗi trên — viết theo dạng **chung cho mọi dự án**, kèm cách chẩn đoán (log của
> host, `curl -i`, F12 Network) — nằm ở
> [`../huong-dan-deploy/README.md`](../huong-dan-deploy/README.md).

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

## 8. Bảo mật — đã kiểm tra gì và cần làm gì

Mục này là kết quả **kiểm thử thật** trên bản đang chạy (dựng server cục bộ với database tạm
rồi gọi thử), không phải chỉ đọc code.

### Đã chắc chắn an toàn

| Hạng mục | Kết quả kiểm tra |
|---|---|
| **SQL injection** | Mọi truy vấn đều dùng tham số `?`. Thử `q=' OR 1=1--` và `brand=Honda' DROP TABLE cars--` → trả về rỗng, bảng `cars` vẫn nguyên **12 dòng** |
| **Mật khẩu** | Băm bcrypt (cost 10), `password_hash` **không bao giờ** nằm trong phản hồi API. Đăng nhập sai trả thông báo chung *“Email hoặc mật khẩu không đúng”* |
| **Token giả mạo** | Token `alg:none`, token bị sửa 1 ký tự, token ký bằng khoá mặc định công khai → **đều bị 401** |
| **API cần đăng nhập** | `/api/garage` và `/api/auth/me` không có token → 401. `user_id` lấy **từ token**, không lấy từ tham số gửi lên → không xem được garage của người khác |
| **Lộ thông tin qua lỗi** | Lỗi không mong đợi trả câu chung; stack trace chỉ ghi ở log máy chủ |
| **`/api/health`** | Không còn trả đường dẫn tuyệt đối của file SQLite (chỉ hiện khi bật `HEALTH_DETAIL=1`) |
| **Header bảo mật** | Có `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`; `/api/auth` trả `Cache-Control: no-store` |
| **`.env`** | Bị `.gitignore` chặn. Kiểm tra **cả lịch sử Git**: **chưa từng** có file `.env` thật hay `.sqlite` nào được commit |
| **Thông tin cá nhân trong repo** | Không có email thật, số điện thoại, IP hay đường dẫn máy cá nhân nào. Ảnh `chihara.jpg` / `logoChatbot.png` **không** nhúng EXIF/GPS |
| **Thư viện** | Phía server: **0 lỗ hổng**. Phía giao diện: 2 cảnh báo *moderate* ở `react-router-dom` 6.x — **không khai thác được** ở dự án này vì không dùng SSR và không điều hướng tới địa chỉ do người dùng nhập |

### Bạn cần tự làm

1. **Đổi `JWT_SECRET`** nếu khoá hiện tại từng bị dán ở đâu đó công khai. Lưu ý quan trọng:
   **log site của alwaysdata in ra TOÀN BỘ biến môi trường, gồm cả `JWT_SECRET`** — đừng bao
   giờ đăng log thô lên GitHub/chat/issue. Đổi khoá rồi thì mọi người phải đăng nhập lại.
2. **Chưa có chặn brute-force** cho `/api/auth/login` — ai cũng thử được mật khẩu không giới
   hạn số lần. Cách xử lý ở [`../huong-dan-deploy/README.md`](../huong-dan-deploy/README.md),
   mục *Bảo mật*.
3. **Repo GitHub đang ở chế độ công khai.** Đó là lựa chọn hợp lệ (LICENSE yêu cầu ghi công),
   nhưng nghĩa là mọi thứ đã commit là công khai **vĩnh viễn, kể cả sau khi xoá**. Cân nhắc kỹ
   trước khi commit ảnh chụp panel, file log hay database.

---

> Dùng lại dự án này? Hãy ghi: **“Dựa trên dự án JDM LEGENDS của Rinka-Mod”**.
> ありがとう。
