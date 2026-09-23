/**
 * JDM LEGENDS — Garage: bản tin + xe đã lưu của người dùng.
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchGarage, subscribeNewsletter } from "../lib/api";
import { useAuth } from "../lib/auth";
import { useToast } from "../lib/toast";
import type { Car } from "../types";

export function GarageSection() {
  const { user, favorites } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [savedCars, setSavedCars] = useState<Car[]>([]);

  useEffect(() => {
    if (!user) {
      setSavedCars([]);
      return;
    }
    fetchGarage()
      .then((data) => setSavedCars(data.cars))
      .catch(() => setSavedCars([]));
  }, [user, favorites]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    setEmailError(!valid);
    if (!valid) {
      setMessage("Email chưa đúng định dạng, bạn kiểm tra lại nhé.");
      return;
    }

    setSending(true);
    try {
      const data = await subscribeNewsletter(value);
      setMessage("");
      setEmail("");
      toast.show({
        title: data.alreadySubscribed ? "Thông Báo" : "Đã ghi danh",
        kind: "success",
        text: data.message,
        note: data.alreadySubscribed
          ? `Email ${value} đã có trong danh sách.`
          : `Email ${value} đã được lưu vào bản tin Garage.`,
      });
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="section garage" id="garage">
      <div className="wrap garage__inner">
        <div className="garage__left">
          <p className="eyebrow reveal">
            <span>04</span> Garage
          </p>
          <h2 className="section__title reveal" data-delay="80">
            Lưu chiếc xe <em>của bạn</em> vào thư viện
          </h2>
          <p className="section__desc reveal" data-delay="160">
            Nhận bản tin hằng tháng: hồ sơ xe mới, tài liệu kỹ thuật, và những câu chuyện chưa kể từ
            các garage Nhật Bản.
          </p>

          <form
            className="subscribe reveal"
            data-delay="240"
            onSubmit={handleSubmit}
            noValidate
          >
            <input
              type="email"
              value={email}
              placeholder="email@cuaban.com"
              aria-label="Email"
              required
              className={emailError ? "is-error" : ""}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(false);
                setMessage("");
              }}
            />
            <button className="btn btn--primary" type="submit" data-cursor="link" disabled={sending}>
              <span>{sending ? "Đang gửi…" : "Tham gia"}</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
            <p className="subscribe__msg" role="status">
              {message}
            </p>
          </form>

          <div className="garage__saved reveal" data-delay="300">
            {user ? (
              <>
                <p className="garage__saved-label">
                  Garage của <b>{user.name}</b> · <b>{favorites.length}</b> xe đã lưu
                </p>
                {savedCars.length > 0 ? (
                  <ul className="garage__saved-list">
                    {savedCars.slice(0, 4).map((car) => (
                      <li key={car.id}>
                        <Link to={`/car/${car.id}`}>
                          <b>{car.name}</b>
                          <span>{car.code}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="garage__saved-empty">
                    Chưa có xe nào. Bấm biểu tượng trái tim trên thẻ xe để lưu lại nhé.
                  </p>
                )}
                <Link className="btn btn--ghost" to="/garage">
                  <span>Mở Garage của tôi</span>
                </Link>
              </>
            ) : (
              <>
                <p className="garage__saved-label">Chưa đăng nhập</p>
                <p className="garage__saved-empty">
                  Tạo tài khoản để lưu xe yêu thích và đồng bộ giữa các thiết bị.
                </p>
                <div className="garage__saved-actions">
                  <Link className="btn btn--primary" to="/register">
                    <span>Tạo tài khoản</span>
                  </Link>
                  <Link className="btn btn--ghost" to="/login">
                    <span>Đăng nhập</span>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="garage__card reveal" data-delay="200">
          <div className="garage__card-top">
            <span className="tag">Dyno sheet</span>
            <span className="tag tag--ghost">JZX100 · 1JZ-GTE</span>
          </div>
          <div className="dyno" aria-hidden="true">
            <svg viewBox="0 0 320 160" preserveAspectRatio="none">
              <defs>
                <linearGradient id="dynoFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--red-2)" stopOpacity=".55" />
                  <stop offset="100%" stopColor="var(--red-2)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <g className="dyno__grid">
                <path d="M0 40h320M0 80h320M0 120h320M80 0v160M160 0v160M240 0v160" />
              </g>
              <path
                className="dyno__area"
                d="M0 150 C60 145 110 120 160 90 C210 60 250 40 320 30 L320 160 L0 160 Z"
                fill="url(#dynoFill)"
              />
              <path
                className="dyno__line"
                d="M0 150 C60 145 110 120 160 90 C210 60 250 40 320 30"
              />
            </svg>
          </div>
          <ul className="garage__specs">
            <li>
              <span>Công suất</span>
              <b>280 PS</b>
            </li>
            <li>
              <span>Mô-men</span>
              <b>378 Nm</b>
            </li>
            <li>
              <span>Dẫn động</span>
              <b>FR</b>
            </li>
            <li>
              <span>Vòng tua</span>
              <b>7 200 rpm</b>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
