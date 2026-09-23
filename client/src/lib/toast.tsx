/**
 * JDM LEGENDS — Thông báo nổi (kèm hiệu ứng tia lửa & than hồng).
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";

export type ToastKind = "info" | "success" | "error";

interface ToastState {
  title: string;
  text: string;
  note: string;
  kind: ToastKind;
}

interface ToastContextValue {
  show: (toast: Partial<ToastState> & { title: string }) => void;
  hide: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/** Đợt tia lửa bùng lên một lần lúc thông báo xuất hiện. */
function sparkMarkup(): { style: string }[] {
  return Array.from({ length: 22 }, () => {
    const sx = (3 + Math.random() * 94).toFixed(1);
    const tx = ((Math.random() - 0.5) * 110).toFixed(0);
    const ty = -(58 + Math.random() * 96).toFixed(0);
    const sd = (Math.random() * 260).toFixed(0);
    const sr = ((Math.random() - 0.5) * 70).toFixed(0);
    const sc = (0.6 + Math.random() * 1).toFixed(2);
    return {
      style: `--sx:${sx}%;--tx:${tx}px;--ty:${ty}px;--sd:${sd}ms;--sr:${sr}deg;--sc:${sc}`,
    };
  });
}

/** Than hồng cháy liên tục trong suốt thời gian thông báo hiện. */
const EMBERS = Array.from({ length: 14 }, () => {
  const ex = (6 + Math.random() * 88).toFixed(1);
  const ew = (2 + Math.random() * 2.4).toFixed(1);
  const ed = (2.6 + Math.random() * 2).toFixed(2);
  const edelay = (-Math.random() * 4.6).toFixed(2);
  const edrift = ((Math.random() - 0.5) * 54).toFixed(0);
  const erise = -(104 + Math.random() * 88).toFixed(0);
  return `--ex:${ex}%;--ew:${ew}px;--ed:${ed}s;--edelay:${edelay}s;--edrift:${edrift}px;--erise:${erise}px`;
});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const [sparks, setSparks] = useState<{ style: string }[]>([]);
  const timer = useRef<number>(0);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const hide = useCallback(() => {
    clearTimeout(timer.current);
    setToast(null);
  }, []);

  const show = useCallback<ToastContextValue["show"]>((input) => {
    setSparks(sparkMarkup());
    setToast({
      title: input.title,
      text: input.text ?? "",
      note: input.note ?? "",
      kind: input.kind ?? "info",
    });
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 6500);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  const value = useMemo(() => ({ show, hide }), [show, hide]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className={`toast${toast ? " is-show" : ""}`} role="status" aria-live="polite">
        <span className="toast__glow" aria-hidden="true" />
        <span className="toast__heat" aria-hidden="true" />
        <span className="toast__sparks" aria-hidden="true">
          {toast && sparks.map((s, i) => <i key={i} style={parseStyle(s.style)} />)}
        </span>
        <span className="toast__embers" aria-hidden="true">
          {EMBERS.map((style, i) => (
            <i key={i} style={parseStyle(style)} />
          ))}
        </span>

        <span className="toast__thumb">
          <img src="/chihara.jpg" alt="Ảnh minh hoạ kèm thông báo" width={900} height={1274} />
          <span className="toast__thumb-badge" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <defs>
                <clipPath id="vnFlagRound">
                  <circle cx="12" cy="12" r="12" />
                </clipPath>
              </defs>
              <g clipPath="url(#vnFlagRound)">
                <rect width="24" height="24" fill="#da251d" />
                <path
                  fill="#ffff00"
                  d="M12 4.8 L13.62 9.78 L18.85 9.78 L14.62 12.85 L16.23 17.82 L12 14.75 L7.77 17.82 L9.38 12.85 L5.15 9.78 L10.38 9.78 Z"
                />
              </g>
            </svg>
          </span>
        </span>

        <div className="toast__body">
          <p className={`toast__title toast__title--${toast?.kind ?? "info"}`}>
            {toast?.title ?? ""}
            <em />
          </p>
          <p className="toast__text">{toast?.text ?? ""}</p>
          <p className="toast__mail">{toast?.note ?? ""}</p>
        </div>

        <button
          ref={closeRef}
          className="toast__close"
          type="button"
          aria-label="Đóng thông báo"
          onClick={hide}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </ToastContext.Provider>
  );
}

/** Đổi chuỗi "--a:1;--b:2" thành object style inline. */
function parseStyle(input: string): React.CSSProperties {
  const style: Record<string, string> = {};
  input.split(";").forEach((pair) => {
    const [key, value] = pair.split(":");
    if (key && value) style[key.trim()] = value.trim();
  });
  return style as React.CSSProperties;
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast phải được dùng bên trong <ToastProvider>.");
  return ctx;
}
