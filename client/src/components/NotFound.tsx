/** JDM LEGENDS — Trang 404. © 2026 Rinka-Mod */

import { Link } from "react-router-dom";
import { useReveal } from "../lib/hooks";

export function NotFound() {
  useReveal([]);

  return (
    <main className="section page">
      <div className="wrap">
        <p className="eyebrow reveal">
          <span>404</span> Không tìm thấy
        </p>
        <h1 className="section__title reveal" data-delay="80">
          Đường dẫn này <em>không tồn tại</em>
        </h1>
        <p className="section__desc reveal" data-delay="160">
          Có thể bạn gõ nhầm địa chỉ, hoặc trang đã được chuyển đi nơi khác.
        </p>
        <div className="hero__cta reveal" data-delay="240">
          <Link className="btn btn--primary" to="/">
            <span>Về trang chủ</span>
          </Link>
          <Link className="btn btn--ghost" to="/#library">
            <span>Mở thư viện</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
