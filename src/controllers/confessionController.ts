import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { buildConfessionMessages, generateConfessionReply } from "../services/confessionAssistant";
import { extractKeywords, extractKeywordsChunked, DEFAULT_LLM_MODEL } from "../services/keywordExtractor";
import { getExtractionByContent, saveExtraction } from "../services/extractions";

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
    if (titleRaw) data.title = titleRaw;
  const conv = await prisma.confessionConversation.create({ data });
    res.status(201).json(conv);
  } catch (err) { next(err); }
}

export async function listSessions(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.sub ?? null;
    const where = userId ? { userId } : {};
    const sessions = await prisma.confessionConversation.findMany({
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
  const conv = await prisma.confessionConversation.findUnique({ where: { id }, select: { id: true, userId: true } });
    if (!conv) return res.status(404).json({ error: "Not found" });
    const currentUserId = req.user?.sub;
    if (conv.userId && currentUserId && conv.userId !== currentUserId) {
      return res.status(403).json({ error: "Forbidden" });
    }
  const messages = await prisma.confessionMessage.findMany({ where: { conversationId: id }, orderBy: { createdAt: "asc" } });
    res.json(messages);
  } catch (err) { next(err); }
}

export async function addMessage(
  req: Request<{ id: string }, unknown, { role?: string; text?: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;
    const { role, text } = req.body ?? {};
    if (!id) return res.status(400).json({ error: "id required" });
    if (!role || !text) return res.status(400).json({ error: "role and text are required" });

  const conv = await prisma.confessionConversation.findUnique({ where: { id }, select: { id: true, userId: true } });
    if (!conv) return res.status(404).json({ error: "Not found" });
    const currentUserId = req.user?.sub;
    if (conv.userId && currentUserId && conv.userId !== currentUserId) {
      return res.status(403).json({ error: "Forbidden" });
    }

  const msg = await prisma.confessionMessage.create({ data: { conversationId: id, role, text } });
  await prisma.confessionConversation.update({ where: { id }, data: { updatedAt: new Date() } });
    res.status(201).json(msg);
  } catch (err) { next(err); }
}

export async function ask(
  req: Request<{ id: string }, unknown, { message?: string; temperature?: number }>,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;
    const userText = String(req.body?.message ?? "").trim();
    const temperature = typeof req.body?.temperature === "number" ? req.body.temperature : 0.3;
    if (!id) return res.status(400).json({ error: "id required" });
    if (!userText) return res.status(400).json({ error: "message is required" });

  const conv = await prisma.confessionConversation.findUnique({ where: { id }, select: { id: true, userId: true } });
    if (!conv) return res.status(404).json({ error: "Not found" });
    const currentUserId = req.user?.sub;
    if (conv.userId && currentUserId && conv.userId !== currentUserId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Persist user message
  const userMsg = await prisma.confessionMessage.create({ data: { conversationId: id, role: "user", text: userText } });

    // Load recent history to give the model context
  const history = await prisma.confessionMessage.findMany({
      where: { conversationId: id },
      orderBy: { createdAt: "asc" },
      take: 30,
      select: { role: true, text: true },
    });

    const messages = buildConfessionMessages(
      history.map((m) => ({ role: m.role as "user" | "assistant", content: m.text }))
    );
    const content = await generateConfessionReply(messages, temperature);

  const assistantMsg = await prisma.confessionMessage.create({
      data: { conversationId: id, role: "assistant", text: content },
    });
  await prisma.confessionConversation.update({ where: { id }, data: { updatedAt: new Date() } });

    res.json({ user: userMsg, assistant: assistantMsg });
  } catch (err) { next(err); }
}

export async function replyAll(
  req: Request<{ id: string }, unknown, { temperature?: number }>,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;
    const temperature = typeof req.body?.temperature === "number" ? req.body.temperature : 0.3;
    if (!id) return res.status(400).json({ error: "id required" });

    const conv = await prisma.confessionConversation.findUnique({ where: { id }, select: { id: true, userId: true } });
    if (!conv) return res.status(404).json({ error: "Not found" });
    const currentUserId = req.user?.sub;
    if (conv.userId && currentUserId && conv.userId !== currentUserId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Load full history
    const history = await prisma.confessionMessage.findMany({
      where: { conversationId: id },
      orderBy: { createdAt: "asc" },
      take: 200,
      select: { role: true, text: true },
    });

    // Find pending user messages since last assistant
    let lastAssistantIdx = -1;
    for (let i = history.length - 1; i >= 0; i--) {
      const h = history[i];
      if (h && h.role === "assistant") { lastAssistantIdx = i; break; }
    }
    const pending = history.slice(lastAssistantIdx + 1).filter(m => m.role === "user");
    if (pending.length === 0) return res.status(400).json({ error: "no pending messages" });

    // Build synthetic user prompt (not persisted) to instruct model
    const pendingText = pending.map((m, idx) => `${idx + 1}. ${m.text}`).join("\n");
    const syntheticUser = { role: "user" as const, content: `أجب على جميع الرسائل التالية برد واحد متماسك وواضح:\n\n${pendingText}` };

    const modelMessages = buildConfessionMessages(
      history.map(m => ({ role: m.role as "user" | "assistant", content: m.text }))
    );
    modelMessages.push(syntheticUser);
    const content = await generateConfessionReply(modelMessages, temperature);

    const assistantMsg = await prisma.confessionMessage.create({
      data: { conversationId: id, role: "assistant", text: content },
    });
    await prisma.confessionConversation.update({ where: { id }, data: { updatedAt: new Date() } });

    res.json({ assistant: assistantMsg });
  } catch (err) { next(err); }
}

// =============== Extra: Entity extraction for a confession session ===============
export async function getConfessionExtraction(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: "id required" });
    const conv = await prisma.confessionConversation.findUnique({ where: { id }, select: { id: true, userId: true } });
    if (!conv) return res.status(404).json({ error: "Not found" });
    const currentUserId = req.user?.sub;
    if (conv.userId && currentUserId && conv.userId !== currentUserId) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const payload = await getExtractionByContent("chat", id);
    if (!payload) return res.status(404).json({ error: "no extraction" });
    res.json(payload);
  } catch (err) { next(err); }
}

export async function rebuildConfessionExtraction(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: "id required" });
    const conv = await prisma.confessionConversation.findUnique({ where: { id }, select: { id: true, userId: true } });
    if (!conv) return res.status(404).json({ error: "Not found" });
    const currentUserId = req.user?.sub;
    if (conv.userId && currentUserId && conv.userId !== currentUserId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Concatenate all messages as a single text block (preserving order)
    const msgs = await prisma.confessionMessage.findMany({
      where: { conversationId: id },
      orderBy: { createdAt: "asc" },
      take: 500,
      select: { role: true, text: true },
    });
    if (msgs.length === 0) return res.status(400).json({ error: "no messages" });
    const combined = msgs.map(m => `${m.role === "assistant" ? "المساعد" : "المستخدم"}: ${m.text}`).join("\n");

    // Use chunked extraction for long conversation histories to avoid timeouts
    const payload = combined.length > 3000 
      ? await extractKeywordsChunked(combined, { 
          model: DEFAULT_LLM_MODEL, 
          temperature: 0,
          maxTokensPerChunk: 1800,
          mergeStrategy: 'intelligent'
        })
      : await extractKeywords(combined, { model: DEFAULT_LLM_MODEL, temperature: 0 });
    await saveExtraction({
      contentType: "chat",
      contentId: id,
      userId: conv.userId ?? null,
      payload,
      model: DEFAULT_LLM_MODEL,
      promptVersion: "confession:v1",
      inputTextForHash: combined,
    });
    res.status(204).end();
  } catch (err) { next(err); }
}
