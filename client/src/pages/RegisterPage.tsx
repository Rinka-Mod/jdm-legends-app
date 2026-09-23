/**
 * JDM LEGENDS — Đăng ký tài khoản.
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { useReveal } from "../lib/hooks";

export function RegisterPage() {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useReveal([]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      setError("Mật khẩu cần ít nhất 6 ký tự.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await register(name.trim(), email.trim(), password);
      navigate("/garage", { replace: true });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (user) {
    return (
      <main className="section page">
        <div className="wrap auth">
          <div className="auth__card reveal">
            <h1 className="section__title">
              Bạn đã <em>có tài khoản</em>
            </h1>
            <Link className="btn btn--primary" to="/garage">
              <span>Mở Garage của tôi</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="section page">
      <div className="wrap auth">
        <form className="auth__card reveal" onSubmit={handleSubmit} noValidate>
          <p className="eyebrow">
            <span>+</span> Đăng ký
          </p>
          <h1 className="section__title">
            Tạo <em>Garage</em> riêng
          </h1>
          <p className="auth__sub">
            Lưu xe yêu thích, so sánh thông số và nhận bản tin hằng tháng.
          </p>

          <label className="auth__field">
            <span>Tên hiển thị</span>
            <input
              type="text"
              value={name}
              required
              minLength={2}
              maxLength={60}
              autoComplete="nickname"
              placeholder="Rinka"
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className="auth__field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              required
              autoComplete="email"
              placeholder="email@cuaban.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="auth__field">
            <span>Mật khẩu</span>
            <input
              type="password"
              value={password}
              required
              minLength={6}
              autoComplete="new-password"
              placeholder="Ít nhất 6 ký tự"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {error && (
            <p className="auth__error" role="alert">
              {error}
            </p>
          )}

          <button className="btn btn--primary auth__submit" type="submit" disabled={busy}>
            <span>{busy ? "Đang tạo…" : "Tạo tài khoản"}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>

          <p className="auth__alt">
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
