/**
 * JDM LEGENDS — API nội dung: dòng thời gian, văn hoá, trợ lý hỏi đáp, bản tin
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

import { Router } from "express";
import { z } from "zod";
import { db } from "../db.js";
import { listCulture, listEras, listFaq } from "../repository.js";
import { CHAT_GREETING, CHAT_NOTICE } from "../data/faq.js";

export const contentRouter = Router();

contentRouter.get("/eras", (_req, res) => {
  res.json({ eras: listEras() });
});

contentRouter.get("/culture", (_req, res) => {
  res.json({ culture: listCulture() });
});

/**
 * Trợ lý Chihara Mai.
 * GET  /api/faq      -> lời chào + danh sách câu hỏi có sẵn
 * POST /api/faq/ask  -> khớp câu hỏi gần đúng; không khớp thì trả CHAT_NOTICE
 */
contentRouter.get("/faq", (_req, res) => {
  res.json({ greeting: CHAT_GREETING, notice: CHAT_NOTICE, questions: listFaq() });
});

const askSchema = z.object({ question: z.string().min(1).max(500) });

/** Chuẩn hoá tiếng Việt để so khớp: bỏ dấu, bỏ ký tự lạ. */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function score(query: string, item: { q: string; a: string }): number {
  const q = normalize(query);
  if (!q) return 0;
  const haystack = normalize(`${item.q} ${item.a}`);
  if (haystack.includes(q)) return 1000 + q.length;

  const tokens = q.split(" ").filter((t) => t.length > 2);
  if (!tokens.length) return 0;
  return tokens.reduce((sum, t) => (haystack.includes(t) ? sum + t.length : sum), 0);
}

contentRouter.post("/faq/ask", (req, res) => {
  const parsed = askSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Câu hỏi không hợp lệ." });
    return;
  }

  const question = parsed.data.question.trim();
  const questions = listFaq();

  let best: { q: string; a: string } | null = null;
  let bestScore = 0;
  for (const item of questions) {
    const s = score(question, item);
    if (s > bestScore) {
      bestScore = s;
      best = item;
    }
  }

  // Chỉ coi là khớp khi điểm đủ cao (ít nhất trùng một từ khoá có nghĩa)
  if (best && bestScore >= 4) {
    res.json({ matched: true, question: best.q, answer: best.a, score: bestScore });
    return;
  }

  res.json({ matched: false, answer: CHAT_NOTICE });
});

const subscribeSchema = z.object({ email: z.string().email() });

contentRouter.post("/subscribe", (req, res) => {
  const parsed = subscribeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Email chưa đúng định dạng, bạn kiểm tra lại nhé." });
    return;
  }

  const email = parsed.data.email.trim().toLowerCase();
  try {
    db.prepare("INSERT INTO subscribers (email) VALUES (?)").run(email);
  } catch {
    res.json({ ok: true, alreadySubscribed: true, message: "Email này đã có trong bản tin rồi." });
    return;
  }

  res.status(201).json({
    ok: true,
    alreadySubscribed: false,
    message: "Đã ghi danh vào bản tin Garage. Hẹn gặp bạn ở số tiếp theo!",
  });
});
