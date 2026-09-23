/**
 * JDM LEGENDS — Tiêu đề mở đầu khu thư viện xe.
 *
 * Tách riêng vì đây thuần là chữ nghĩa, sửa nội dung không cần đụng tới phần
 * lọc hay danh sách xe.
 *
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

export function LibraryHeader() {
  return (
    <header className="section__head">
      <p className="eyebrow reveal">
        <span>01</span> Thư viện
      </p>
      <h2 className="section__title reveal" data-delay="80">
        Bộ sưu tập <em>huyền thoại</em>
      </h2>
      <p className="section__desc reveal" data-delay="160">
        Mỗi chiếc xe là một chương truyện: động cơ, hệ dẫn động, những lần lên bàn độ và cả di sản
        để lại trong làng xe thế giới. Chọn một chiếc để xem hồ sơ đầy đủ.
      </p>
    </header>
  );
}
