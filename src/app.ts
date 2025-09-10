// src/server/index.ts
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import fs from "fs";

// ✅ انتبه لمسارات الاستيراد: هذا الملف داخل src/server
import authRoutes from "./routes/authRoutes";
import diaryRoutes from "./routes/diaryRoutes";
import noteRoutes from "./routes/noteRoutes";
import extractionRoutes from "./routes/extractionsRoutes";
import chatRoutes from "./routes/chatRoutes";
import directChatRoutes from "./routes/directChatRoutes";
import usersRoutes from "./routes/usersRoutes";
import microblogRoutes from "./routes/microblogRoutes";
import confessionRoutes from "./routes/confessionRoutes";
import memoryTablesRoutes from "./routes/memoryTablesRoutes";
import matchRoutes from "./routes/matchRoutes";
import mediaRoutes from "./routes/mediaRoutes";
import geoRoutes from "./routes/geoRoutes";
import challengeRoutes from "./routes/challengeRoutes";
import notificationsRoutes from "./routes/notificationsRoutes";
import searchHistoryRoutes from "./routes/searchHistoryRoutes";
import adminRoutes from "./routes/adminRoutes";
import jobsRoutes from "./routes/jobsRoutes";

// ❌ لا تستخدم searchRoutes القديم
// import searchRoutes from "./routes/searchRoutes";

// ✅ استخدم الراوتر الجديد الذي يعرّف /api/search داخله
import search from "./routes/search";

import { requireAuth } from "./middleware/auth";
import { normalizeKeywordsFast, PROMPT_SHA, validateInvariants } from "./services/keywordNormalizerFast";
import { normalizeKeywordsChunked } from "./services/keywordNormalizerChunked";
import rateLimit from "express-rate-limit";

export const app = express();

app.use(express.json({ limit: "2mb" }));
// Configure CORS explicitly to allow Authorization header and preflight for all routes
const corsOptions: cors.CorsOptions = {
  origin: true, // reflect request origin
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  // Allow custom headers used by the frontend (e.g., x-user-id)
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    // Custom app headers
    "x-user-id",
  ],
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
// Use a compatible catch-all path for Express router (avoid '*' which throws in path-to-regexp v6)
app.options(/.*/, cors(corsOptions));
app.use(morgan("dev"));

// Disable ETag to reduce unexpected 304 Not Modified on API responses
app.set('etag', false);

// Ensure uploads directory exists and serve it statically
const uploadsDir = path.resolve(process.cwd(), 'uploads');
try {
  fs.mkdirSync(uploadsDir, { recursive: true });
} catch {}
app.use('/uploads', express.static(uploadsDir));

// Serve public directory for admin pages
const publicDir = path.resolve(process.cwd(), 'public');
try {
  fs.mkdirSync(publicDir, { recursive: true });
} catch {}
app.use('/admin', express.static(publicDir));

app.get("/health", (_req, res) => res.send("ok"));

// Temporary debug endpoint to inspect auth header & decoded token
app.get('/api/debug/auth', (req, res) => {
  const auth = req.headers.authorization || null;
  res.json({
    hasAuthHeader: Boolean(auth),
    authHeaderPrefix: auth ? auth.split(' ')[0] : null,
    user: req.user || null,
  });
});

// Quick test endpoint for the fast keyword normalizer
// Simple per-IP rate limit for test endpoint
const normLimiter = rateLimit({ windowMs: 60_000, max: 30 });
app.post("/api/normalize/fast", normLimiter, async (req, res) => {
  try {
    const text = String(req.body?.text ?? "");
    const maxChars = 16_000; // rough guard for very large inputs
    if (text.length > maxChars) {
      return res.status(413).json({ ok: false, error: `Input too large (${text.length} chars). Limit=${maxChars}` });
    }
    const userId = String(req.user?.sub ?? req.ip ?? "anon");
  const payload = await normalizeKeywordsFast(text, { user: userId });
    const inv = validateInvariants(payload);
    if (inv.length) console.warn("[/api/normalize/fast] invariants:", inv);
  const usage = (payload as any)[Object.getOwnPropertySymbols(payload)[0] as symbol] || {};
  const modelUsed = process.env.LLM_MODEL || process.env.OPENAI_CHAT_MODEL || "gpt-5-preview";
  res.json({ ok: true, promptSha: PROMPT_SHA, modelUsed, usage, payload });
  } catch (e: any) {
    const status = typeof e?.status === "number" ? e.status : 400;
    res.status(status).json({ ok: false, error: String(e?.message || e) });
  }
});

// Chunked keyword normalizer for long texts
app.post("/api/normalize/chunked", normLimiter, async (req, res) => {
  try {
    const text = String(req.body?.text ?? "");
    const maxChars = 50_000; // Allow larger inputs for chunked processing
    if (text.length > maxChars) {
      return res.status(413).json({ ok: false, error: `Input too large (${text.length} chars). Limit=${maxChars}` });
    }
    
    const userId = String(req.user?.sub ?? req.ip ?? "anon");
    const maxTokensPerChunk = Number(req.body?.maxTokensPerChunk) || 1800;
    const mergeStrategy = req.body?.mergeStrategy === 'simple' ? 'simple' : 'intelligent';
    
    const startTime = Date.now();
    const payload = await normalizeKeywordsChunked(text, { 
      user: userId,
      maxTokensPerChunk,
      mergeStrategy
    });
    const processingTime = Date.now() - startTime;
    
    const inv = validateInvariants(payload);
    if (inv.length) console.warn("[/api/normalize/chunked] invariants:", inv);
    
    const modelUsed = process.env.LLM_MODEL || process.env.OPENAI_CHAT_MODEL || "gpt-5-preview";
    res.json({ 
      ok: true, 
      promptSha: PROMPT_SHA, 
      modelUsed, 
      processingTime,
      chunked: text.length > 3000,
      payload 
    });
  } catch (e: any) {
    const status = typeof e?.status === "number" ? e.status : 400;
    res.status(status).json({ ok: false, error: String(e?.message || e) });
  }
});

// =========================
// تثبيت الراوترات تحت /api
// =========================
app.use("/api/auth", authRoutes);
app.use("/api/diary", diaryRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/extractions", extractionRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/direct-chat", directChatRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/microblog", microblogRoutes);
app.use("/api/confession", confessionRoutes);
app.use("/api/memory", memoryTablesRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/geo", geoRoutes);
app.use(challengeRoutes);
app.use(matchRoutes);
app.use(notificationsRoutes);
app.use(searchHistoryRoutes);
app.use(adminRoutes);
app.use("/api/jobs", jobsRoutes);

// ⚠️ مهم: راوتر البحث الجديد يعلن المسارات بنفسه (يتضمن /api/search)
// لذلك لا تُضيف بادئة /api هنا حتى لا تصبح /api/api/search.
app.use(search);

// مثال: هوية المستخدم
app.get("/api/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

// 404 موحّد
app.use((req, res) => {
  res.status(404).json({ error: "Not found", path: req.path });
});

// معالج أخطاء موحّد
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  const status = typeof err?.status === "number" ? err.status : 500;
  res.status(status).json({ error: err?.message ?? "Internal Server Error" });
});

export default app;
