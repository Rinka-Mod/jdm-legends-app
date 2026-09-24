# Deploy web full-stack miễn phí — Netlify (giao diện) + alwaysdata (API)

> **Tác giả (Author):** [**Rinka-Mod**](https://www.facebook.com/chaupham2008) · © 2026 · All rights reserved.
> Dùng lại tài liệu này? Hãy ghi: **“Dựa trên dự án JDM LEGENDS của Rinka-Mod”**.
> Xem [`../LICENSE.md`](../LICENSE.md).

> Hướng dẫn **chung**, không gắn với dự án nào: thay mọi chỗ `<...>` bằng giá trị của bạn.
> Nội dung là **những lỗi thực tế đã gặp khi deploy** và cách sửa, kèm cách chẩn đoán để tự
> tìm ra nguyên nhân thay vì đoán.
>
> Điều kiện áp dụng: giao diện là web tĩnh (React/Vue/Svelte… đã build) và back-end là
> tiến trình Node.js chạy liên tục, có ghi file xuống đĩa (SQLite, upload…).

---

## 1. Vì sao phải chia làm hai nơi?

| | Netlify | alwaysdata |
|---|---|---|
| Chạy được | file tĩnh (HTML/CSS/JS đã build) | tiến trình Node.js chạy liên tục |
| Chạy được Express? | **Không** | **Có** |
| Giữ được file ghi ra đĩa (SQLite, upload)? | **Không** (ổ đĩa tạm) | **Có** (thư mục nhà, không mất khi restart) |
| Deploy | nối GitHub, tự build | panel + SSH/SFTP |
| Chi phí | gói Free đủ dùng | gói Free: 1 GB đĩa, 256 MB RAM, không cần thẻ |

Hệ quả quan trọng: **deploy Netlify xong web vẫn có thể "hỏng"** — trang chủ hiện ra nhưng
thư viện, đăng nhập, dữ liệu đều trắng vì không có API trả về.

---

## 2. Sơ đồ gọi API

```
Trình duyệt ──► Netlify (giao diện đã build)
                     │
                     └── /api/... ──► alwaysdata (API Node.js) ──► file SQLite
                        (đi qua proxy của Netlify)
```

Hai nơi **không tự biết nhau**. alwaysdata không biết Netlify tồn tại, Netlify không biết
API tồn tại — nên luôn phải "nối" bằng tay ở đúng **một trong hai** cách ở mục 3.2.

---

## 3. Cấu hình chuẩn — làm đúng ngay từ đầu thì không phải sửa

### 3.1. alwaysdata (phía API)

1. **Environment → Node.js**: đặt phiên bản **24**.
   > Nếu back-end dùng module `node:sqlite` (có sẵn trong Node, không cần cài), phiên bản
   > Node quá cũ sẽ chết ngay lúc khởi động với `Cannot find module 'node:sqlite'`.
   > Cứ dùng Node 24 cho chắc.
2. Upload code đã build (thường chỉ cần `dist/`, `package.json`, `package-lock.json` —
   **không** upload `node_modules`), rồi cài thư viện trên máy chủ:
   ```bash
   ssh <tài-khoản>@ssh-<tài-khoản>.alwaysdata.net
   cd <thư-mục-ứng-dụng>
   npm ci --omit=dev
   ```
3. **Web → Sites → Add a site** → loại **Node.js**:

   | Ô | Điền gì | Ghi chú |
   |---|---|---|
   | Command | `node /home/<tài-khoản>/<thư-mục-ứng-dụng>/dist/index.js` | đường dẫn **tuyệt đối** |
   | Working directory | `<thư-mục-ứng-dụng>` | **tương đối từ thư mục nhà** ← bẫy số 1 |

4. **Environment** — khai báo biến môi trường (đừng dựa vào file `.env`: Node **không** tự
   đọc `.env`, trừ khi bạn chạy kèm `--env-file`):

   | Biến | Ghi chú |
   |---|---|
   | `DATABASE_PATH` | **đường dẫn tuyệt đối**, ví dụ `/home/<tài-khoản>/<thư-mục>/data/app.sqlite` |
   | `JWT_SECRET` (hoặc khoá bí mật tương đương) | bắt buộc đổi, đừng để khoá mặc định trong code |
   | `CLIENT_ORIGIN` | tên miền Netlify — **chỉ cần nếu không dùng proxy** (xem 3.2) |

   > `HOST` / `IP` / `PORT` do alwaysdata **tự cấp**; ứng dụng chỉ cần đọc đúng các biến này
   > để listen. Đừng hard-code cổng.
   >
   > Riêng `DATABASE_PATH` nên khai báo hẳn: nếu để mặc định theo `process.cwd()`, chỉ cần ô
   > Working directory sai là ứng dụng chết ngay khi mở database.

### 3.2. Netlify (phía giao diện)

Chọn **một** trong hai cách nối. **Cách B gọn hơn và an toàn hơn**, nên dùng nó trừ khi bạn
có lý do riêng.

**Cách B — để Netlify làm proxy** (khuyên dùng)

Thêm vào `netlify.toml`, **đặt TRƯỚC** rule `/*` → `index.html`:

```toml
[[redirects]]
  from = "/api/*"
  to = "https://<tài-khoản>.alwaysdata.net/api/:splat"
  status = 200
  force = true
```

Rồi commit + push. Không cần đặt biến môi trường nào.

- Trình duyệt chỉ gọi **cùng tên miền** Netlify → **lỗi CORS vĩnh viễn không xảy ra**, và
  `CLIENT_ORIGIN` bên API trở thành không cần thiết.
- Đổi địa chỉ API chỉ cần sửa dòng `to` rồi deploy lại — không phải build lại vì biến.
- `status = 200` (proxy im lặng). **Đừng dùng 301/302**: trình duyệt sẽ tự đổi địa chỉ sang
  tên miền API và lỗi CORS quay lại.
- Nếu trong Netlify còn sót biến `VITE_API_BASE` thì **phải xoá** — biến đó thắng proxy và
  lỗi CORS quay lại.

**Cách A — biến môi trường `VITE_API_BASE`** (tên biến tuỳ framework)

```
VITE_API_BASE = https://<tài-khoản>.alwaysdata.net/api
```

- Biến `VITE_*` chỉ áp dụng **lúc build** → đổi biến **phải deploy lại**, không tự áp dụng.
- Bắt buộc `CLIENT_ORIGIN` trên alwaysdata phải khớp tên miền Netlify, nếu không sẽ lỗi CORS.
- Đây là cách dễ quên cấu hình nhất và cũng dễ phát sinh lỗi CORS nhất.

---

## 4. Bảng tra lỗi nhanh

| Bạn thấy | Nguyên nhân | Đi tới |
|---|---|---|
| **502 Bad Gateway** ở **mọi** đường dẫn | Tiến trình API chưa từng chạy được (sai Working directory, sai Command, thiếu thư viện, Node quá cũ, hết dung lượng) | [Lỗi 1](#lỗi-1--502-bad-gateway-ở-mọi-đường-dẫn) |
| Giao diện báo "không kết nối được máy chủ" nhưng API vẫn khoẻ | Request `/api/*` bị rule SPA (`/*` → `index.html`) bắt trước, trả về **HTML kèm status 200** | [Lỗi 2](#lỗi-2--không-kết-nối-được-máy-chủ-dù-api-vẫn-khoẻ) |
| Console trình duyệt ghi `has been blocked by CORS policy` | `CLIENT_ORIGIN` bên API không khớp tên miền giao diện | [Lỗi 3](#lỗi-3--cors) |
| `Cannot find module 'express'` / `'node:sqlite'` trong log | Chưa `npm ci` trên máy chủ / Node quá cũ | [Lỗi 4](#lỗi-4--thiếu-thư-viện-hoặc-sai-phiên-bản-node) |
| `git push` xong mà GitHub vẫn không có commit mới | Lệnh **chưa thực sự chạy** (dấu nhắc `>>` của PowerShell) | [Lỗi 5](#lỗi-5--git-push-không-chạy-dù-không-báo-lỗi) |

---

## 5. Chi tiết từng lỗi

### Lỗi 1 — 502 Bad Gateway ở mọi đường dẫn

**Triệu chứng.** Mở tên miền API ra bất kỳ đường dẫn nào cũng chỉ thấy 502, không có JSON.
Đây **không phải** lỗi API: 502 nghĩa là máy chủ trước (proxy của host) không kết nối được
tiến trình ứng dụng — tức ứng dụng **chưa chạy**, chứ không phải chạy rồi trả lỗi.

**Cách chẩn đoán.** Log của alwaysdata nằm ở một trong hai chỗ:

```bash
ssh <tài-khoản>@ssh-<tài-khoản>.alwaysdata.net
tail -n 60 ~/admin/logs/sites/*
```

hoặc trong panel: **Web → Sites → bấm vào site → Logs**.

Log mẫu của ca sai Working directory:

```
[upstream] Upstream starting: node /home/<account>/<app>/dist/index.js
           (env: {...}, cwd: /home/<account>/home/<account>/<app>)
[upstream] Upstream starting failed: node /home/<account>/<app>/dist/index.js
           (return code: - | reason: No such file or directory)
```

**Nguyên nhân.** Ô **Working directory** là đường dẫn **tương đối tính từ thư mục nhà**,
không phải đường dẫn tuyệt đối. Nhập `/home/<account>/<app>` vào đó sẽ bị ghép thành
`/home/<account>` + `/home/<account>/<app>` → **lặp hai lần** → thư mục không tồn tại
(chính là dòng `cwd:` bị lặp trong log ở trên).

**Cách sửa.** Trong **Web → Sites → (site) → Working directory**, đổi thành
**`<app>`** (tên thư mục, không có `/home/<account>/` ở đầu) hoặc để trắng, rồi **Restart**
site. Ô **Command** thì ngược lại — phải là đường dẫn **tuyệt đối**, và nó vốn đã đúng.

**Kiểm tra.** `https://<tài-khoản>.alwaysdata.net/api/health` phải trả `{"ok":true,...}`.
Sau khi Restart phải chờ vài chục giây; log sẽ ghi `will not start again until ...` nếu bạn
Restart quá nhanh nhiều lần.

**Các nguyên nhân khác của cùng lỗi 502** — đọc log, log nói thẳng:

| Log ghi | Sửa |
|---|---|
| `Cannot find module '<tên-thư-viện>'` | Chưa cài thư viện: `cd <app> && npm ci --omit=dev` |
| `Cannot find module 'node:sqlite'` | Node quá cũ → Environment → Node.js = **24**, rồi Restart |
| `reason: No such file or directory` + `cwd:` bị lặp | Sai Working directory (chính là ca ở trên) |
| `Error: Cannot find module '/home/.../dist/index.js'` | File chưa upload hoặc chưa build → upload lại `dist/` |
| `Disk quota exceeded` | Hết dung lượng 1 GB → xoá file rác hoặc nâng gói |
| `EACCES` / `SQLITE_CANTOPEN` | `DATABASE_PATH` trỏ vào chỗ không ghi được → trỏ vào thư mục nhà |

### Lỗi 2 — "Không kết nối được máy chủ" dù API vẫn khoẻ

**Triệu chứng.** API gọi trực tiếp (bằng `curl` hoặc mở trên trình duyệt) trả JSON bình
thường, nhưng giao diện trên Netlify vẫn báo không kết nối được.

**Nguyên nhân.** Giao diện gọi đường dẫn **tương đối** `/api/...` trên chính tên miền
Netlify. Netlify không có API, nên request rơi vào rule SPA bắt mọi đường dẫn:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Rule này trả về **`index.html` kèm status 200** — tức giao diện nhận **HTML** trong khi chờ
**JSON**. Status 200 nên không báo lỗi HTTP, nhưng bước `JSON.parse` vỡ, và người dùng chỉ
thấy thông báo chung chung.

**Cách nhận biết nhanh** (không cần mở trình duyệt):

```bash
curl -i https://<tên-site>.netlify.app/api/cars
```

- `Content-Type: text/html` → đang bị dính bẫy này ❌
- `Content-Type: application/json` → đã nối đúng ✅

**Cách sửa.** Thêm rule proxy ở **Cách B** mục 3.2 vào `netlify.toml`, **đặt TRƯỚC** rule
`/*` → `index.html`, rồi push lên GitHub để Netlify build lại.

> **Thứ tự là quy tắc, không phải gợi ý.** Netlify duyệt rule từ trên xuống, rule nào khớp
> trước thì thắng. Đặt `/api/*` xuống dưới `/*` là hỏng lại y như chưa sửa.

Nếu bạn chọn **Cách A** thay vì proxy: khai báo biến ở **Project configuration →
Environment variables**, rồi **build lại** (biến `VITE_*` chỉ có tác dụng lúc build). Nếu
vẫn còn cả biến *và* proxy, giao diện sẽ đi thẳng sang API (biến thắng) — vẫn chạy được,
nhưng lỗi CORS quay lại, nên chọn một cách thôi.

### Lỗi 3 — CORS

**Triệu chứng.** Trình duyệt chặn request; tab **Console** ghi
`... has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header...`.
Giao diện cũng chỉ hiện thông báo "không kết nối được máy chủ" nên **rất dễ nhầm** với lỗi
mạng thật. Trong khi đó `curl` gọi trực tiếp lại chạy tốt — vì `curl` **không** bị CORS.

Cách phân biệt dứt khoát: mở **F12 → Network**, bấm vào request:

| Request | Nghĩa là |
|---|---|
| `502` / `failed` + Console có chữ `CORS` | Lỗi CORS |
| `502` + không có chữ CORS | Tiến trình API chết (Lỗi 1) |
| `200` + `Content-Type: text/html` | Bị rule SPA bắt (Lỗi 2) |
| `500` + body JSON | API đang chạy, lỗi xử lý bên trong |

**Cách sửa.** Khai báo `CLIENT_ORIGIN` đúng **đủ** tên miền giao diện (kể cả `www.` nếu có,
nhiều miền thì cách nhau dấu phẩy) rồi **Restart** site. Nhớ thêm cả miền deploy preview
nếu bạn dùng (`https://<id>--<tên-site>.netlify.app`).

**Cách tránh vĩnh viễn.** Dùng **proxy của Netlify** (Cách B mục 3.2): trình duyệt chỉ gọi
cùng tên miền nên chuyện CORS không còn tồn tại. Đây là lý do chính nên chọn Cách B.

### Lỗi 4 — Thiếu thư viện hoặc sai phiên bản Node

**Triệu chứng.** Log site có `Cannot find module '<tên-thư-viện>'`.

**Nguyên nhân & cách sửa.**

- **Chưa cài thư viện trên máy chủ.** `node_modules` **không** upload lên (nặng, và có
  thư viện build theo hệ điều hành). Phải chạy `npm ci --omit=dev` trong thư mục ứng dụng
  trên máy chủ.
- **Node quá cũ.** Ứng dụng dùng module có sẵn của Node (ví dụ `node:sqlite`) sẽ báo
  `Cannot find module` dù không thiếu thư viện nào. Đặt phiên bản ở
  **Environment → Node.js** (chọn **24**), rồi Restart. Kiểm tra bằng
  `NODEJS_VERSION=24 node -v`.
- **Chạy tay để thấy lỗi ngay trên màn hình** — nhanh hơn đọc log:
  ```bash
  cd <app>
  NODEJS_VERSION=24 node dist/index.js
  ```
  Nếu lệnh này in ra `đang chạy tại http://<ip>:<port>` thì code và cấu hình đều ổn — vấn
  đề nằm ở phần **site** (Command / Working directory), không phải ở code.

### Lỗi 5 — `git push` không chạy dù không báo lỗi

**Triệu chứng.** Bạn đã chạy `git add` / `git commit` / `git push`, terminal không báo lỗi
gì, nhưng GitHub vẫn không có commit mới và web không đổi.

**Cách nhận biết.** Chạy:

```bash
git status -sb
```

- `## main...origin/main [ahead 1]` → commit **chưa lên** GitHub
- `## main...origin/main` → đã đồng bộ, xong

**Nguyên nhân.** Trong PowerShell, dấu nhắc **`>>`** nghĩa là *"còn đang nhập tiếp"* — dòng
lệnh trước chưa kết thúc (thường do thiếu một dấu `"`). Lúc đó các lệnh bạn gõ tiếp bị coi
là phần nối vào lệnh cũ và **không được thực thi**. Dấu nhắc đúng phải là `PS C:\...>`.

**Cách sửa.** Mở **terminal mới**, chạy riêng từng lệnh — đặc biệt `git push` nên chạy một
mình — và chờ tới khi thấy dòng:

```
To https://github.com/<user>/<repo>.git
   <hash-cũ>..<hash-mới>  main -> main
```

Không thấy dòng này thì push **chưa xong**. Nếu hiện popup đăng nhập GitHub thì đăng nhập.

> Lỗi này chỉ tốn thời gian chứ không phá gì: commit vẫn nằm an toàn ở máy bạn, chạy lại
> `git push` là xong.

---

## 6. Bộ công cụ chẩn đoán — dùng theo thứ tự này

1. **API có sống không?**
   ```bash
   curl -i https://<api-domain>/api/health
   ```
   502 → Lỗi 1 · 500 → lỗi trong code · 200 JSON → API ổn.
2. **Ứng dụng khởi động được không?** Chạy tay `NODEJS_VERSION=24 node dist/index.js` trên
   máy chủ. Lỗi hiện thẳng ra màn hình, kèm stack trace đầy đủ.
3. **Log host nói gì?** `~/admin/logs/sites/*` (alwaysdata) — nơi ghi lý do tiến trình
   không lên được.
4. **Giao diện gọi đi đâu?** F12 → Network → xem tên miền của request `/api/...`:
   - tên miền Netlify + `Content-Type: application/json` → proxy chạy ✅
   - tên miền Netlify + `Content-Type: text/html` → Lỗi 2
   - tên miền API → đang dùng Cách A (biến môi trường)
5. **Bị CORS không?** F12 → Console, tìm chữ `CORS`. `curl` chạy được mà trình duyệt không
   chạy được thì gần như chắc chắn là CORS.

---

## 7. Checklist trước khi đổ lỗi cho code

- [ ] `https://<api-domain>/api/health` trả `{"ok":true,...}`
- [ ] `https://<tên-site>.netlify.app/api/health` cũng trả `{"ok":true,...}` (proxy đã nối)
- [ ] Mở thẳng tên miền API ra `Cannot GET /` → **bình thường**, đó là máy chủ API chứ
      không phải giao diện
- [ ] Giao diện hiện đủ dữ liệu, lọc/tìm/sắp xếp chạy
- [ ] Đăng ký tài khoản → lưu dữ liệu → **F5** vẫn còn
- [ ] **Restart site API → chờ vài giây → tải lại web: dữ liệu vẫn còn**
      (phép thử quan trọng nhất: chứng minh `DATABASE_PATH` trỏ vào thư mục nhà, không phải
      ổ đĩa tạm)
- [ ] Mở thẳng một URL con rồi F5 (ví dụ `/car/abc`) → vẫn vào đúng trang, không ra 404
      (nhờ rule SPA `/*` → `index.html`)

---

## 8. Bảo mật — kiểm tra trước khi coi là "xong"

### Bắt buộc

- [ ] **Khoá bí mật không được dùng giá trị mặc định trong mã nguồn.** Repo công khai nghĩa
      là ai cũng biết khoá mặc định, và ai cũng tự ký được token đăng nhập của bất kỳ tài
      khoản nào. Ứng dụng nên **từ chối khởi động** ở production khi thiếu khoá, chứ đừng
      âm thầm dùng khoá mặc định.
- [ ] **`.gitignore` chặn mọi biến thể**: `.env`, `.env.*`, kèm ngoại lệ `!.env.example`.
      Chỉ cần lọt một file `.env.production` là lộ khoá. Kiểm tra lại bằng
      `git check-ignore -v <file>`.
- [ ] **Kiểm tra lịch sử Git, không chỉ file hiện tại** — xoá file ở commit mới **không**
      làm nó biến mất khỏi commit cũ:
      ```bash
      git log --all --full-history --name-only -- '*.env' '*.sqlite' '*secret*'
      ```
- [ ] **Sao lưu database** trước mỗi lần cập nhật đụng tới schema, và tuyệt đối không đẩy file
      database từ máy cá nhân lên máy chủ.

### Điểm rất dễ bỏ sót

- **Log của host có thể in ra biến môi trường.** Log site của alwaysdata in cả khoá ký JWT.
  Đừng đăng log thô lên GitHub/chat/issue — che phần `env` trước. Lỡ lộ rồi thì **đổi khoá**
  (đổi xong mọi người phải đăng nhập lại).
- **`/health` chỉ nên trả `ok`.** Đừng trả đường dẫn tuyệt đối của database, phiên bản thư
  viện hay tên máy chủ — đó là thông tin giúp kẻ tấn công dò hệ thống.
- **Chặn brute-force cho `/login`.** Không giới hạn số lần thử thì một script đơn giản cũng
  dò ra mật khẩu yếu. Cách đã kiểm chứng: đếm số lần **thất bại** theo **cả email và IP**,
  tạm khoá khi vượt ngưỡng, và **xoá bộ đếm khi đăng nhập đúng** để không khoá oan người gõ
  nhầm. Dùng **cửa sổ cố định** (không trượt theo từng lần thử) để tài khoản tự mở khoá sau
  tối đa một khoảng thời gian, tránh bị giữ khoá vĩnh viễn.
  Hai điều dễ làm sai: **phải bật `trust proxy`** nếu chạy sau proxy (không thì mọi request
  mang cùng một IP, bộ đếm theo IP thành bộ đếm chung cho cả thế giới), và **đừng đặt ngưỡng
  theo IP quá chặt** vì nhiều người có thể dùng chung một IP.
- **Đặt luật cho mật khẩu, đừng chỉ đặt độ dài.** Bcrypt chỉ cứu được tới mức mật khẩu đủ khó
  đoán. Tối thiểu nên chặn: mật khẩu trong danh sách bị dò nhiều nhất, chuỗi leo thang
  (`12345678`, `abcdefgh`, `qwertyui`), một ký tự lặp lại, và mật khẩu chứa chính tên/email
  của người đăng ký (nhớ so cả bản bỏ dấu cách: `Nguoi Test` → `nguoitest123`).
- **Giới hạn kích thước request** (`express.json({ limit: "200kb" })`). Gói Free chỉ có 256 MB
  RAM — một payload khổng lồ là đủ làm tiến trình chết.
- **Đừng trả mật khẩu hay hash trong phản hồi.** Kiểm tra bằng mắt một lần: gọi `/login` rồi
  xem JSON trả về có trường `password` / `password_hash` không.
- **Thông báo lỗi nên chung chung**: “email hoặc mật khẩu không đúng” thì tốt; còn “email này
  chưa đăng ký” là đang giúp người khác dò xem ai đã có tài khoản.
- **Token lưu ở `localStorage`** thì mọi lỗ hổng XSS đều lấy được token. Vì vậy **đừng bao giờ**
  render HTML từ dữ liệu người dùng (`dangerouslySetInnerHTML`) — chỉ dùng cho hằng số trong mã.
- **Ảnh đưa lên repo công khai**: kiểm tra EXIF/GPS trước, ảnh chụp điện thoại thường nhúng vị trí:
  ```bash
  grep -aq Exif anh.jpg && echo "CÓ metadata - cần xoá" || echo "sạch"
  ```
- **Thư viện lỗi thời**: chạy `npm audit --omit=dev`. Cảnh báo ở thư viện phía **máy chủ**
  nghiêm trọng hơn nhiều so với phía giao diện — nhưng đọc kỹ mô tả, nhiều cảnh báo (như lỗi
  SSR hydration) không áp dụng cho app của bạn.
- **Một lỗi 502 không phải là lỗi bảo mật** — nhưng một lỗi 502 kéo dài cũng có nghĩa là bạn
  không biết API còn sống hay không. Đặt cách kiểm tra `/health` định kỳ.

---

## 9. Ba cạm bẫy đáng nhớ nhất

1. **Working directory của alwaysdata là đường dẫn tương đối** từ thư mục nhà, còn Command
   là đường dẫn tuyệt đối. Nhập sai một trong hai là 502 ở mọi đường dẫn.
2. **Rule redirect của Netlify xét theo thứ tự.** Rule SPA `/*` → `index.html` sẽ nuốt luôn
   `/api/*` và trả về HTML kèm status 200 — lỗi này không hề xuất hiện trong log của API.
3. **Đừng tin terminal "không báo lỗi".** Kiểm tra bằng `git status -sb`: dòng `[ahead 1]`
   nghĩa là việc bạn tưởng đã xong thì chưa xong.
