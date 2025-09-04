import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { searchDiariesSemantic } from "../search/diarySearch";
import { searchNotesSemantic } from "../search/noteSearch";
import { selectAnswer } from "../services/answerSelector";

type Mode = "wide" | "strict";
type Source = "diary" | "note";

export async function createSession(
  req: Request<unknown, unknown, { title?: string }>,
  res: Response,
  next: NextFunction
) {
  try {
  const userId = req.user?.sub ?? undefined;
  const titleRaw = (req.body?.title ?? "").trim();
  const data: any = {};
  if (userId) data.userId = userId;
  if (titleRaw) data.title = titleRaw; // omit if empty to avoid undefined/null typing issues
  const conv = await prisma.chatConversation.create({ data });
    res.status(201).json(conv);
  } catch (err) {
    next(err);
  }
}

export async function listSessions(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.sub ?? null;
    const where = userId ? { userId } : {};
    const sessions = await prisma.chatConversation.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      take: 100,
      select: { id: true, title: true, createdAt: true, updatedAt: true },
    });
    res.json(sessions);
  } catch (err) { next(err); }
}

export async function getMessages(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: "id required" });

    // ownership check (if conversation has userId)
    const conv = await prisma.chatConversation.findUnique({ where: { id }, select: { id: true, userId: true } });
    if (!conv) return res.status(404).json({ error: "Not found" });
    const currentUserId = req.user?.sub;
    if (conv.userId && currentUserId && conv.userId !== currentUserId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const messages = await prisma.chatMessage.findMany({
      where: { conversationId: id },
      orderBy: { createdAt: "asc" },
    });
    res.json(messages);
  } catch (err) { next(err); }
}

export async function addMessage(
  req: Request<{ id: string }, unknown, { role?: string; text?: string; source?: Source; mode?: Mode; meta?: any }>,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;
    const { role, text, source, mode, meta } = req.body ?? {};
    if (!id) return res.status(400).json({ error: "id required" });
    if (!role || !text) return res.status(400).json({ error: "role and text are required" });

    const conv = await prisma.chatConversation.findUnique({ where: { id }, select: { id: true, userId: true } });
    if (!conv) return res.status(404).json({ error: "Not found" });
    const currentUserId = req.user?.sub;
    if (conv.userId && currentUserId && conv.userId !== currentUserId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const msg = await prisma.chatMessage.create({
      data: {
        conversationId: id,
        role,
        text,
  source: source ? (source === "note" ? "NOTE" : "DIARY") : null,
  mode: mode ? (mode === "strict" ? "STRICT" : "WIDE") : null,
        meta: meta ?? undefined,
      },
    });

    // bump updatedAt
    await prisma.chatConversation.update({ where: { id }, data: { updatedAt: new Date() } });

    res.status(201).json(msg);
  } catch (err) { next(err); }
}

export async function ask(
  req: Request<{ id: string }, unknown, { question?: string; source?: Source; mode?: Mode }>,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;
    const question = String(req.body?.question ?? "").trim();
    const source: Source = req.body?.source === "note" ? "note" : "diary";
    const mode: Mode = req.body?.mode === "strict" ? "strict" : "wide";
    if (!id) return res.status(400).json({ error: "id required" });
    if (!question) return res.status(400).json({ error: "question is required" });

    const conv = await prisma.chatConversation.findUnique({ where: { id }, select: { id: true, userId: true } });
    if (!conv) return res.status(404).json({ error: "Not found" });
    const currentUserId = req.user?.sub;
    if (conv.userId && currentUserId && conv.userId !== currentUserId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // step 1: search
    const hits = source === "note"
      ? await searchNotesSemantic(question, { mode })
      : await searchDiariesSemantic(question, { mode });

    // step 2: answer selection
    const sel = await selectAnswer(question, hits, { temperature: 0 });
    const answerText = sel?.final?.text || sel?.answers?.[0]?.answer_text || "—";

    // persist both user and assistant messages
    const userMsg = await prisma.chatMessage.create({
      data: {
        conversationId: id,
        role: "user",
        text: question,
        source: source === "note" ? "NOTE" : "DIARY",
        mode: mode === "strict" ? "STRICT" : "WIDE",
      },
    });

    const assistantMsg = await prisma.chatMessage.create({
      data: {
        conversationId: id,
        role: "assistant",
        text: answerText,
        source: source === "note" ? "NOTE" : "DIARY",
        mode: mode === "strict" ? "STRICT" : "WIDE",
        meta: {
          finalType: sel?.final?.type ?? null,
          answersCount: Array.isArray(sel?.answers) ? sel.answers.length : 0,
          considered_count: sel?.considered_count ?? null,
        },
      },
    });

    await prisma.chatConversation.update({ where: { id }, data: { updatedAt: new Date() } });

    res.json({ user: userMsg, assistant: assistantMsg, selection: sel, hits: hits.slice(0, 3) });
  } catch (err) { next(err); }
}
