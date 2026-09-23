/**
 * ==========================================================================
 * JDM LEGENDS — Chihara Mai, trợ lý hỏi đáp JDM.
 *
 * Bản web tĩnh cũ trả lời bằng dữ liệu nằm trong main.js. Bản Web App này hỏi
 * Back-End qua `POST /api/faq/ask`: server chuẩn hoá tiếng Việt (bỏ dấu), so
 * khớp với kho tri thức trong SQLite rồi trả câu trả lời gần nhất.
 *
 * Về cách cuộn khung hội thoại — giữ đúng hành vi bản gốc:
 *   • mở lần đầu      → giữ khung ở ĐẦU để lời chào hiện ra trước danh sách câu hỏi
 *   • bấm một câu hỏi → cuộn tới DÒNG CÂU HỎI vừa in, để đọc được câu trả lời
 *   • bấm "Câu hỏi khác" → cuộn tới ĐẦU DANH SÁCH câu hỏi vừa dựng
 *   • tự gõ rồi gửi   → bám theo chữ đang hiện ra (cuộn xuống đáy)
 *
 * Tác giả / Author : Rinka-Mod — © 2026. All rights reserved.
 * ==========================================================================
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { askFaq, fetchFaq } from "../lib/api";
import { useReducedMotion } from "../lib/hooks";
import type { FaqItem } from "../types";

type Role = "user" | "bot";

interface Bubble {
  id: number;
  role: Role;
  text: string;
  typing?: boolean;
}

/** Chỉ dẫn cuộn cho lần render kế tiếp. */
type ScrollIntent =
  | { type: "top" }
  | { type: "bottom" }
  | { type: "row"; id: number }
  | { type: "questions" };

let bubbleSeq = 0;

export function ChatAssistant() {
  const reduced = useReducedMotion();

  const [open, setOpen] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [questions, setQuestions] = useState<FaqItem[]>([]);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [asked, setAsked] = useState<Set<number>>(new Set());
  const [showList, setShowList] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  const logRef = useRef<HTMLDivElement | null>(null);
  const intentRef = useRef<ScrollIntent>({ type: "bottom" });
  const typingTimer = useRef<number>(0);
  const seeded = useRef(false);

  /* ------------------------------ Tải tri thức ------------------------------ */
  useEffect(() => {
    fetchFaq()
      .then((data) => {
        setGreeting(data.greeting);
        setQuestions(data.questions);
      })
      .catch(() => {
        setGreeting("Chào bạn 👋 Máy chủ đang bận, bạn thử lại sau nhé.");
        setQuestions([]);
      });
  }, []);

  const addBubble = useCallback((role: Role, text: string): number => {
    const id = ++bubbleSeq;
    setBubbles((prev) => [...prev, { id, role, text }]);
    return id;
  }, []);

  /* ----------------------- Áp dụng chỉ dẫn cuộn sau render ----------------------- */
  useEffect(() => {
    const log = logRef.current;
    if (!log) return;
    const intent = intentRef.current;

    if (intent.type === "top") {
      log.scrollTop = 0;
      return;
    }
    if (intent.type === "questions") {
      const list = log.querySelector<HTMLElement>(".chat__questions");
      if (list) log.scrollTop = Math.max(0, list.offsetTop - 10);
      return;
    }
    if (intent.type === "row") {
      const row = log.querySelector<HTMLElement>(`[data-bubble="${intent.id}"]`);
      if (row) {
        const top = Math.max(0, row.offsetTop - 10);
        if (reduced) log.scrollTop = top;
        else log.scrollTo({ top, behavior: "smooth" });
        return;
      }
    }
    log.scrollTop = log.scrollHeight;
  }, [bubbles, showList, reduced]);

  /* --- Hiệu ứng gõ chữ: bám theo chữ đang hiện ra, giống bản gốc --- */
  const typeInto = useCallback(
    (id: number, text: string, onDone?: () => void) => {
      if (reduced) {
        setBubbles((prev) => prev.map((b) => (b.id === id ? { ...b, text, typing: false } : b)));
        onDone?.();
        return;
      }

      clearInterval(typingTimer.current);
      setBubbles((prev) => prev.map((b) => (b.id === id ? { ...b, text: "", typing: true } : b)));

      let i = 0;
      typingTimer.current = window.setInterval(() => {
        i = Math.min(text.length, i + 2);
        // Trong lúc gõ thì luôn bám xuống đáy
        intentRef.current = { type: "bottom" };
        setBubbles((prev) =>
          prev.map((b) => (b.id === id ? { ...b, text: text.slice(0, i) } : b)),
        );
        if (i >= text.length) {
          clearInterval(typingTimer.current);
          setBubbles((prev) => prev.map((b) => (b.id === id ? { ...b, typing: false } : b)));
          onDone?.();
        }
      }, 18);
    },
    [reduced],
  );

  useEffect(() => () => clearInterval(typingTimer.current), []);

  /* --------------------------- Khởi tạo hội thoại --------------------------- */
  /* Lời chào hiện TRƯỚC, danh sách câu hỏi nằm dưới — nên khung phải đứng ở đầu. */
  useEffect(() => {
    if (!open || !greeting || seeded.current) return;
    seeded.current = true;
    intentRef.current = { type: "top" };
    addBubble("bot", greeting);
    setShowList(true);
  }, [open, greeting, addBubble]);

  function resetChat() {
    clearInterval(typingTimer.current);
    intentRef.current = { type: "top" };
    setBubbles([]);
    setAsked(new Set());
    setShowList(false);
    seeded.current = false;
    if (greeting) {
      addBubble("bot", greeting);
      setShowList(true);
    }
  }

  /* ------------------------- Bấm một câu hỏi có sẵn ------------------------- */
  function answerQuestion(index: number) {
    const item = questions[index];
    if (!item) return;

    clearInterval(typingTimer.current);
    setAsked((prev) => new Set(prev).add(index));
    setShowList(false);

    addBubble("user", item.q);
    // Câu trả lời có sẵn hiện ngay (không gõ chữ), giống bản gốc
    const answerId = addBubble("bot", item.a);
    // Cuộn tới đúng dòng câu hỏi để đọc được câu trả lời ngay bên dưới
    intentRef.current = { type: "row", id: answerId };
  }

  /* --------------------- Bấm "Câu hỏi khác" để mở danh sách --------------------- */
  function openQuestionList() {
    intentRef.current = { type: "questions" };
    setShowList(true);
  }

  /* --------------------------- Người dùng tự gõ --------------------------- */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const typed = input.trim();
    if (!typed || busy) return;

    setBusy(true);
    setShowList(false);
    setInput("");
    intentRef.current = { type: "bottom" };
    addBubble("user", typed);
    const answerId = addBubble("bot", "");

    try {
      const data = await askFaq(typed);
      typeInto(answerId, data.answer, () => setBusy(false));
    } catch (err) {
      typeInto(answerId, (err as Error).message, () => setBusy(false));
    }
  }

  const remaining = questions.map((_, i) => i).filter((i) => !asked.has(i));
  const listTitle = remaining.length
    ? asked.size
      ? "Câu hỏi khác"
      : "Chọn một câu hỏi"
    : "Bạn đã xem hết câu hỏi — bấm nút làm mới để xem lại";

  return (
    <>
      <section
        className={`chat${open ? " is-open" : ""}`}
        aria-hidden={!open}
        aria-label="Chihara Mai — trợ lý JDM"
      >
        <header className="chat__head">
          <span />
          <div className="chat__who">
            <p className="chat__name">Chihara Mai Chat Bot</p>
            <p className="chat__status">
              <i aria-hidden="true" /> Người bạn cùng bàn bên
            </p>
          </div>
          <button
            className="chat__reset"
            type="button"
            aria-label="Làm mới hội thoại"
            onClick={resetChat}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3" />
              <path d="M19.5 4.4v4.3h-4.3" />
            </svg>
          </button>
          <button
            className="chat__close"
            type="button"
            aria-label="Đóng khung chat"
            onClick={() => setOpen(false)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 7l10 10M17 7L7 17" />
            </svg>
          </button>
        </header>

        <div
          className="chat__log"
          ref={logRef}
          role="log"
          aria-live="polite"
          aria-label="Nội dung hội thoại"
        >
          {bubbles.map((bubble) => (
            <div
              key={bubble.id}
              data-bubble={bubble.id}
              className={`chat__msg chat__msg--${bubble.role === "user" ? "user" : "bot"}`}
            >
              {bubble.role === "bot" && (
                <span className="chat__msg-avatar" aria-hidden="true">
                  <img src="/logoChatbot.png" alt="" width={262} height={450} />
                </span>
              )}
              <p className={`chat__bubble${bubble.typing ? " is-typing" : ""}`}>{bubble.text}</p>
            </div>
          ))}

          {showList && (
            <div className="chat__questions">
              <p className="chat__questions-title">{listTitle}</p>
              {remaining.map((i) => (
                <button key={i} type="button" className="chat__q" onClick={() => answerQuestion(i)}>
                  <span>{questions[i]?.q}</span>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              ))}
            </div>
          )}

          {!showList && bubbles.length > 0 && (
            <button type="button" className="chat__more" onClick={openQuestionList}>
              <span>Câu hỏi khác</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          )}
        </div>

        <form className="chat__form" onSubmit={handleSubmit} noValidate>
          <input
            className="chat__input"
            type="text"
            maxLength={500}
            value={input}
            placeholder="Hỏi về Supra, GT-R, RX-7…"
            autoComplete="off"
            aria-label="Nhập câu hỏi"
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="chat__send" type="submit" aria-label="Gửi" disabled={busy}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 11.5 20 5l-6 15-3-6-7-2.5Z" />
            </svg>
          </button>
        </form>
      </section>

      <button
        className={`chat-fab${open ? " is-open" : ""}`}
        type="button"
        aria-label="Mở trợ lý JDM AI"
        aria-expanded={open}
        aria-controls="chatPanel"
        data-cursor="link"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="chat-fab__pulse" aria-hidden="true" />
        <svg className="chat-fab__icon--chat" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 4H4a1.6 1.6 0 0 0-1.6 1.6v9A1.6 1.6 0 0 0 4 16.2h3v4.1l5.1-4.1H20a1.6 1.6 0 0 0 1.6-1.6v-9A1.6 1.6 0 0 0 20 4Z" />
        </svg>
        <svg className="chat-fab__icon--close" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 7l10 10M17 7L7 17" />
        </svg>
      </button>
    </>
  );
}
