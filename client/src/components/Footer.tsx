/**
 * JDM LEGENDS — Footer + khối ghi công tác giả (bắt buộc khi tái sử dụng).
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

import { Link } from "react-router-dom";
import { SocialIcons } from "./SocialIcons";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <span className="footer__kanji" aria-hidden="true">
        日本
      </span>

      <div className="wrap footer__top">
        <div className="footer__brand">
          <Link to="/" className="brand brand--sm" data-cursor="link">
            <span className="brand__mark" aria-hidden="true">
              <svg viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="11" className="brand__sun" />
                <path
                  d="M6 20h36M6 26h36M9 12h30M9 34h30M12 6v36M18 6v36M30 6v36M36 6v36"
                  className="brand__grid"
                />
              </svg>
            </span>
            <span className="brand__text">
              <b>JDM</b>
              <i>LEGENDS</i>
            </span>
          </Link>
          <p>
            Thư viện số phi lợi nhuận về xe thể thao nội địa Nhật Bản. Dữ liệu mang tính tham khảo,
            hình ảnh minh hoạ bằng SVG/CSS.
          </p>
          <SocialIcons className="footer__social" />
        </div>

        <nav className="footer__col" aria-label="Thư viện">
          <h4>Thư viện</h4>
          <a href="/#library">Tất cả xe</a>
          <a href="/#library">Coupé thể thao</a>
          <a href="/#library">Sedan hiệu suất</a>
          <a href="/#library">Hatchback VTEC</a>
        </nav>

        <nav className="footer__col" aria-label="Kiến thức">
          <h4>Kiến thức</h4>
          <a href="/#heritage">Dòng thời gian</a>
          <a href="/#culture">Thuật ngữ JDM</a>
          <a href="/#garage">Bản tin dyno</a>
          <a href="/#culture">Hướng dẫn độ xe</a>
        </nav>

        <nav className="footer__col" aria-label="Về chúng tôi">
          <h4>Tài khoản</h4>
          <Link to="/login">Đăng nhập</Link>
          <Link to="/register">Đăng ký</Link>
          <Link to="/garage">Garage của tôi</Link>
          <a href="https://www.facebook.com/chaupham2008" target="_blank" rel="noopener noreferrer">
            Liên hệ
          </a>
        </nav>
      </div>

      {/* ==== NGUỒN & GHI CÔNG TÁC GIẢ ==== */}
      <div className="wrap">
        <section className="credit" aria-label="Thông tin tác giả và điều kiện tái sử dụng">
          <span className="credit__kanji" aria-hidden="true">
            作
          </span>

          <div className="credit__who">
            <span className="credit__avatar" aria-hidden="true">
              RM
            </span>
            <div className="credit__who-text">
              <p className="credit__label">Người thực hiện dự án</p>
              <p className="credit__name">Rinka-Mod</p>
              <p className="credit__role">Thiết kế giao diện &amp; phát triển — JDM Legends</p>
            </div>
          </div>

          <div className="credit__license">
            <p className="credit__label">Bản quyền &amp; điều kiện tái sử dụng</p>
            <p className="credit__text">
              Toàn bộ mã nguồn, bố cục và nội dung của trang web này thuộc về <b>Rinka-Mod</b>. Nếu
              bạn tái sử dụng lại <b>toàn bộ hoặc phần lớn</b> dự án, <b>bắt buộc</b> phải ghi rõ tên
              tác giả <b>Rinka-Mod</b> ở cuối trang và trong mã nguồn. Nghiêm cấm xoá, sửa hoặc thay
              thế thông tin tác giả.
            </p>
            <p className="credit__meta">
              <span>© {year} Rinka-Mod</span>
              <span>All rights reserved</span>
              <span>Credit required when reused</span>
            </p>
          </div>
        </section>
      </div>

      <div className="wrap footer__bottom">
        <p>
          © <span>{year}</span> JDM Legends — Designed and developed in Vietnam · Tác giả:{" "}
          <b>Rinka-Mod</b>
        </p>
        <p className="footer__jp">
          頂点を目指せ <span aria-hidden="true">赤</span>
        </p>
      </div>
    </footer>
  );
}
