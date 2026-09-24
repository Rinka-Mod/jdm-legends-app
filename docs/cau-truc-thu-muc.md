# Ghi chú cấu trúc dự án — JDM LEGENDS

> **Tác giả (Author):** [**Rinka-Mod**](https://www.facebook.com/chaupham2008) · © 2026 · All rights reserved.
> Dự án **JDM LEGENDS** — Thư viện số về xe thể thao Nhật Bản.
> Xem [`../LICENSE.md`](../LICENSE.md): nếu dùng lại toàn bộ hoặc phần lớn dự án này,
> **bắt buộc ghi rõ tên tác giả `Rinka-Mod`** ở footer trang web và giữ nguyên thông tin
> tác giả trong mã nguồn.

File này giải thích **từng thư mục và từng file dùng để làm gì**, để người mới đọc mã
nguồn biết ngay cần mở file nào. Bản mô tả tính năng/API đầy đủ nằm ở
[`../README.md`](../README.md).

---

## 1. Sơ đồ tổng quát

```
jdm-legends-app/
├── package.json                  # Script điều phối cả 2 phía: dev, build, typecheck, start
├── LICENSE.md                    # Bản quyền + điều kiện tái sử dụng (phải đọc trước khi dùng lại)
├── README.md                     # Giới thiệu, hướng dẫn cài đặt & chạy, danh sách API
├── docs/                         # Tài liệu
├── server/                       # BACK-END — Node.js + TypeScript + Express + SQLite
└── client/                       # FRONT-END — React + TypeScript + Vite
```

---

## 2. `server/` — Back-End

Express phục vụ API `/api/*`, và khi chạy production thì phục vụ luôn bản build của client.

| File | Tác dụng |
|---|---|
| `src/index.ts` | Điểm khởi động: tạo Express app, gắn middleware (CORS, header bảo mật, giới hạn số lần thử), gắn các nhóm route, phục vụ `client/dist` khi chạy production. Bật `trust proxy` để lấy đúng IP người dùng khi chạy sau proxy. |
| `src/db.ts` | Lớp dữ liệu SQLite: tạo bảng, và **seed** dữ liệu ở lần chạy đầu. Dùng module `node:sqlite` có sẵn của Node ≥ 22.5 nên không cần cài native dependency. |
| `src/repository.ts` | Toàn bộ câu truy vấn: xe, thời kỳ lịch sử, chủ đề văn hoá, FAQ. Route không viết SQL trực tiếp mà gọi qua đây. |
| `src/middleware/auth.ts` | Xác thực JWT: `requireAuth` (bắt buộc đăng nhập) và `optionalAuth` (có thì dùng, không có vẫn chạy). **Từ chối khởi động** ở production nếu thiếu `JWT_SECRET`, và chỉ nhận đúng thuật toán `HS256`. |
| `src/middleware/rateLimit.ts` | Chặn dò mật khẩu: đếm số lần đăng nhập **thất bại** theo từng email (10 lần/15 phút) và theo IP (100 lần/15 phút); đăng nhập đúng thì xoá bộ đếm của tài khoản đó. Giới hạn tạo tài khoản 20 lần/giờ mỗi IP. |
| `src/password.ts` | Chính sách mật khẩu: tối thiểu 8 ký tự, chặn danh sách mật khẩu bị dò nhiều nhất, chuỗi quá dễ đoán (`12345678`, `abcdefgh`) và mật khẩu chứa chính tên/email người đăng ký. |
| `src/data/cars.ts` | Dữ liệu gốc của 12 mẫu xe JDM (thông số, câu chuyện, điểm nhấn). |
| `src/data/content.ts` | Dữ liệu 6 thời kỳ lịch sử và 8 chủ đề văn hoá. |
| `src/data/faq.ts` | Kho tri thức của trợ lý ảo Chihara Mai: lời chào + 20 câu hỏi/đáp. |
| `src/routes/cars.ts` | `GET /api/cars`, `/cars/:id`, `/brands`, `/stats` — lọc, tìm, sắp xếp phía server bằng SQL. |
| `src/routes/content.ts` | `GET /api/eras`, `/culture`, `/faq`; `POST /api/faq/ask` (chuẩn hoá tiếng Việt không dấu rồi so khớp câu trả lời gần nhất); `POST /api/subscribe`. |
| `src/routes/auth.ts` | `POST /api/auth/register`, `/auth/login`, `GET /auth/me`. Mật khẩu băm bằng bcrypt (cost 10), token JWT hạn 7 ngày; mật khẩu phải qua `src/password.ts` trước khi băm. |
| `src/routes/garage.ts` | `GET /api/garage`, `POST /garage/:carId`, `DELETE /garage/:carId` — xe người dùng đã lưu. |
| `.env.example` | Mẫu biến môi trường (cổng, JWT secret). Copy thành `.env` khi cần đổi. |
| `tsconfig.json` · `package.json` | Cấu hình TypeScript và script `dev` / `build` / `start` / `typecheck`. |
| `data/` | Nơi SQLite tạo file `jdm.sqlite` (dữ liệu sinh ra lúc chạy, không sửa tay). |

> **Muốn đổi thông số / thêm xe?** Sửa `src/data/cars.ts`. Nhớ rằng dữ liệu chỉ được
> seed khi database **còn trống** — muốn seed lại thì xoá `server/data/jdm.sqlite`.

---

## 3. `client/` — Front-End

| File / thư mục | Tác dụng |
|---|---|
| `index.html` | Vỏ HTML: thẻ meta/Open Graph, khối preloader (HTML tĩnh + script chạy ngay lúc parse nên hiện ở khung hình đầu), sprite icon mạng xã hội. |
| `src/main.tsx` | Điểm khởi động React: gắn `BrowserRouter`, và **nạp CSS theo đúng thứ tự** `index.css` → `styles/mobile.css`. |
| `src/App.tsx` | Layout + định tuyến (`/`, `/car/:id`, `/login`, `/register`, `/garage`, 404), gắn các provider (Auth, UI, Toast), xử lý header dính và phím tắt `/`. |
| `src/types.ts` | Kiểu dữ liệu dùng chung giữa client và server: `Car`, `Brand`, `Era`, `CultureTopic`, `FaqItem`, `AuthUser`, `CarSort`… |
| `vite.config.ts` | Cấu hình Vite, kèm proxy `/api` → `http://localhost:4000`. |
| `public/` | Ảnh tĩnh: `chihara.jpg` (chân dung trợ lý), `logoChatbot.png`. |

### 3.1 `src/components/` — thành phần giao diện

| File | Tác dụng |
|---|---|
| `Hero.tsx` | Khối mở đầu trang chủ: tiêu đề, nút kêu gọi, ba số liệu đếm lên, hiệu ứng thị sai. |
| `Marquee.tsx` | Dải chữ chạy ngang giữa các phần. |
| `Library.tsx` | **Thư viện xe** — chỉ còn phần bố cục (khoảng 140 dòng); phần lọc và danh sách nằm ở `components/library/`. |
| `CarCard.tsx` | Thẻ xe trong thư viện (kèm nút lưu vào Garage). |
| `CarArt.tsx` | Hình minh hoạ xe bằng SVG/CSS — **không dùng ảnh bitmap**. |
| `CarModal.tsx` | Hồ sơ xe mở ra dạng ngăn kéo/modal, có nút xe trước / xe sau. |
| `Heritage.tsx` | Dòng thời gian lịch sử: trượt ngang theo cuộn dọc. |
| `Culture.tsx` | Tám chủ đề văn hoá JDM. |
| `GarageSection.tsx` | Khu Garage ở trang chủ: bản tin + danh sách xe người dùng đã lưu. |
| `ChatAssistant.tsx` | Trợ lý ảo Chihara Mai (gọi `POST /api/faq/ask`). |
| `Sidebar.tsx` | Sidebar dọc bên trái, chỉ hiện ở PC (≥ 1024px). |
| `Topbar.tsx` | Thanh trên cùng của PC: điều hướng + nút nhảy tới ô tìm kiếm. |
| `SiteHeader.tsx` | Header cho mobile/tablet (kèm nút menu mở menu toàn màn hình). |
| `MobileBar.tsx` | Tab bar dưới cho mobile (6 mục, có badge số xe đã lưu). |
| `Footer.tsx` | Footer + **khối ghi công tác giả** — khối này bắt buộc phải giữ khi tái sử dụng. |
| `Chrome.tsx` | Lớp trang trí: hạt phim, scanline, con trỏ tuỳ biến, thanh tiến trình, nút lên đầu trang. |
| `SocialIcons.tsx` | Sprite icon mạng xã hội (Simple Icons — giấy phép CC0). |
| `NotFound.tsx` | Trang 404. |

### 3.2 `src/components/library/` — chi tiết Thư viện xe

Tách ra từ `Library.tsx` để mỗi file chỉ làm một việc, dễ đọc và dễ sửa:

| File | Tác dụng |
|---|---|
| `constants.ts` | Hằng số dùng chung: nhãn 6 kiểu sắp xếp, danh sách dẫn động (FR/AWD/MR/FF), kiểu hiển thị (`swipe` \| `grid`). |
| `useLibraryFilters.ts` | Hook giữ **toàn bộ state lọc** + gọi API `fetchBrands` / `fetchCars`, và tính sẵn các giá trị dẫn xuất (tổng số xe, số điều kiện đang bật, danh sách thẻ điều kiện để bấm bỏ nhanh). |
| `useCarouselScroll.ts` | Hook cuộn ngang dạng carousel: theo dõi vị trí thẻ để tô sáng chấm chỉ mục, và cuộn tới thẻ khi bấm chấm. |
| `LibraryHeader.tsx` | Tiêu đề mở đầu khu thư viện. |
| `LibraryToolbar.tsx` | Thanh công cụ trên PC: ô tìm kiếm · chọn sắp xếp · nút mở bộ lọc nâng cao, tức là nơi tự quản trạng thái mở/đóng bảng lọc. |
| `BrandChips.tsx` | Dãy chip lọc theo thương hiệu (mỗi chip hiện tên hãng, tên tiếng Nhật và số xe). |
| `AdvancedFilterPanel.tsx` | Bảng lọc nâng cao: dẫn động, khoảng năm, mã lực tối thiểu. |
| `MobileToolsBar.tsx` | Thanh công cụ gọn trên mobile: `[ ô tìm kiếm ] [ lọc ] [ Thẻ | Lưới ]` + dòng thông tin kết quả. |
| `FilterSheet.tsx` | Bottom sheet bọc thanh công cụ cho mobile. Nhận nội dung qua `children` nên **không phải viết lại giao diện lọc lần hai**. |

### 3.3 `src/lib/` — tiện ích dùng chung

| File | Tác dụng |
|---|---|
| `api.ts` | Lớp gọi API: gắn base URL, token (`getToken` / `setToken`), lớp lỗi `ApiError`, và các hàm `fetchCars`, `fetchBrands`, `fetchGarage`, `apiLogin`, `apiRegister`, `askFaq`… |
| `auth.tsx` | Ngữ cảnh tài khoản & Garage: lưu token, người dùng hiện tại, danh sách xe đã lưu. |
| `hooks.ts` | Hook dùng chung: `useMediaQuery`, `useReducedMotion`, `useDebounced`, `useCountUp`, `useSiteReady`, `useReveal`, `useActiveSection`, `useLatest`. |
| `toast.tsx` | Thông báo nổi kèm hiệu ứng tia lửa & than hồng. |
| `ui.tsx` | Ngữ cảnh giao diện: cho topbar PC và phím tắt `/` gọi được vào ô tìm kiếm của Thư viện dù ở trang khác. |

### 3.4 `src/pages/` — các trang theo route

| File | Route | Tác dụng |
|---|---|---|
| `HomePage.tsx` | `/` | Trang chủ: ghép Hero → Thư viện → Lịch sử → Văn hoá → Garage. |
| `CarPage.tsx` | `/car/:id` | Trang riêng của từng xe — mỗi xe có URL để chia sẻ và cho công cụ tìm kiếm đánh chỉ mục. |
| `LoginPage.tsx` | `/login` | Đăng nhập. |
| `RegisterPage.tsx` | `/register` | Đăng ký tài khoản. |
| `MyGaragePage.tsx` | `/garage` | Danh sách xe người dùng đã lưu. |

### 3.5 `src/data/`

| File | Tác dụng |
|---|---|
| `shapes.ts` | Hình dáng xe (SVG) cho 3 kiểu thân (`coupe` / `hatch` / `sedan`), đường tốc độ, danh sách `SECTIONS` cho điều hướng, và icon tab bar mobile. |

### 3.6 `src/styles/` — CSS và thứ tự nạp

CSS chia theo **tầng**, tầng sau đè tầng trước. **Thứ tự nạp là quy tắc cascade — đừng sắp xếp lại.**

```
main.tsx
 ├─ index.css          ← chỉ là danh sách @import
 │   ├─ styles/style.css              Bảng thiết kế GỐC (giữ nguyên, không sửa)
 │   └─ styles/app/*.css              Thành phần MỚI của bản Web App
 └─ styles/mobile.css  ← cũng chỉ là danh sách @import
     └─ styles/mobile/*.css           Lớp làm mới giao diện mobile (chỉ chạy ≤ 860px)
```

| File | Tác dụng |
|---|---|
| `styles/style.css` | Bảng thiết kế gốc, giữ nguyên vẹn (khoảng 3.357 dòng): hai giao diện **mobile app-like** (≤ 860px) và **PC sidebar** (≥ 1024px). Các component React render đúng tên lớp/ID mà file này mong đợi. |
| `index.css` | Chỉ còn danh sách nạp: `style.css` trước, rồi 7 file trong `styles/app/`, theo đúng thứ tự cũ. |

**`styles/app/`** — thành phần mới của bản Web App:

| File | Tác dụng |
|---|---|
| `page.css` | Bố cục chung cho các route phụ. |
| `library-toolbar.css` | Thanh công cụ thư viện, ô tìm kiếm, chọn sắp xếp, chip thương hiệu, thẻ điều kiện đang lọc. |
| `library-advpanel.css` | Bảng bộ lọc nâng cao. |
| `library-desktop.css` | Riêng PC (≥ 1024px): thanh công cụ dính, dãy chip một hàng tự cuộn ngang. |
| `car.css` | Nút lưu xe vào Garage, nút hành động & nút chuyển xe trong hồ sơ, khu Garage ở section 04. |
| `account.css` | Trang tài khoản, trang riêng của từng xe, màu toast theo loại thông báo. |
| `responsive.css` | Điều chỉnh theo bề ngang cho các thành phần mới. |

**`styles/mobile/`** — lớp làm mới mobile, mọi file đều nằm trong `@media (max-width: 860px)` (trừ `narrow.css` dùng ≤ 380px):

| File | Tác dụng |
|---|---|
| `base.css` | Biến và nền chung cho màn hình nhỏ. |
| `header.css` | App bar gọn + menu toàn màn hình (kèm phần sửa lỗi `backdrop-filter` làm bẹp menu). |
| `hero.css` | Hero và dải chữ chạy. |
| `sections.css` | Nhịp section chung: tiêu đề, nhãn nhỏ, chữ Nhật trang trí. |
| `library-tools.css` | Thanh công cụ thư viện trên mobile. |
| `cards.css` | Thẻ xe và carousel + chấm chỉ mục. |
| `sheet.css` | Bottom sheet bộ lọc (nút áp dụng dính đáy). |
| `car-modal.css` | Hồ sơ xe trượt từ đáy. |
| `tabbar.css` | Tab bar dưới dạng viên thuốc nổi. |
| `chrome.css` | Nút nổi: lên đầu trang, bong bóng chat, toast. |
| `sections-content.css` | Lịch sử, văn hoá, garage (section nội dung). |
| `pages.css` | Trang chi tiết xe, trang tài khoản, garage riêng, footer. |
| `narrow.css` | Máy rất nhỏ (≤ 380px): siết cỡ chữ để 6 mục tab bar vẫn gọn một hàng. |

---

## 4. Muốn sửa gì thì mở file nào?

| Việc cần làm | Mở file |
|---|---|
| Thêm / sửa thông số một mẫu xe | `server/src/data/cars.ts` |
| Thêm câu hỏi cho trợ lý Chihara Mai | `server/src/data/faq.ts` |
| Sửa dòng thời gian hoặc chủ đề văn hoá | `server/src/data/content.ts` |
| Thêm API mới | `server/src/routes/` + `server/src/repository.ts` |
| Thêm trang mới | `client/src/pages/` + khai báo route trong `client/src/App.tsx` |
| Sửa bộ lọc / tìm kiếm / sắp xếp | `client/src/components/library/LibraryToolbar.tsx` và `useLibraryFilters.ts` |
| Sửa giao diện thư viện trên điện thoại | `client/src/styles/mobile/library-tools.css` (+ `sheet.css` nếu là trong bottom sheet) |
| Sửa giao diện thư viện trên PC | `client/src/styles/app/library-toolbar.css` (+ `library-desktop.css`) |
| Đổi màu, cỡ chữ, bo góc toàn trang | `client/src/styles/style.css` (phần biến `:root` ở đầu file) |

---

## 5. Quy ước chung của mã nguồn

- **Ngôn ngữ:** tên biến/hàm bằng tiếng Anh, còn **chú thích và nội dung hiển thị bằng tiếng Việt**.
- **Header bắt buộc:** mỗi file đều mở đầu bằng một khối bình luận ghi tên dự án, mô tả ngắn
  và dòng `Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.`
  **Không xoá dòng này.**
- **Chú thích "vì sao", không phải "cái gì":** các đoạn dễ gây nhầm lẫn (ví dụ vì sao
  `.toolbar` phải ghi đè `justify-content`, vì sao chip phải xếp hai dòng) đều có ghi
  lý do ngay tại chỗ để lần sau không ai xoá nhầm.
- **Kiểm tra trước khi commit:** `npm run typecheck` và `npm run build` ở thư mục gốc.

---

> Dùng lại dự án này? Hãy ghi: **“Dựa trên dự án JDM LEGENDS của Rinka-Mod”**.
> ありがとう。
