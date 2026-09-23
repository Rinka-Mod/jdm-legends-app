/**
 * JDM LEGENDS — Đăng nhập.
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { useReveal } from "../lib/hooks";

export function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useReveal([]);

  const from = (location.state as { from?: string } | null)?.from ?? "/garage";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
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
            <p className="eyebrow">
              <span>✓</span> Tài khoản
            </p>
            <h1 className="section__title">
              Bạn đã <em>đăng nhập</em>
            </h1>
            <p className="auth__sub">Xin chào {user.name}.</p>
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
            <span>→</span> Đăng nhập
          </p>
          <h1 className="section__title">
            Vào <em>Garage</em> của bạn
          </h1>
          <p className="auth__sub">
            Đăng nhập để đồng bộ danh sách xe yêu thích giữa các thiết bị.
          </p>

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
              autoComplete="current-password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {error && (
            <p className="auth__error" role="alert">
              {error}
            </p>
          )}

          <button className="btn btn--primary auth__submit" type="submit" disabled={busy}>
            <span>{busy ? "Đang xử lý…" : "Đăng nhập"}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>

          <p className="auth__alt">
            Chưa có tài khoản? <Link to="/register">Tạo tài khoản mới</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
