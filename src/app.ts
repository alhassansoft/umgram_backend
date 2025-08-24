// src/server/index.ts
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";

// ✅ انتبه لمسارات الاستيراد: هذا الملف داخل src/server
import authRoutes from "./routes/authRoutes";
import diaryRoutes from "./routes/diaryRoutes";
import extractionRoutes from "./routes/extractionsRoutes";

// ❌ لا تستخدم searchRoutes القديم
// import searchRoutes from "./routes/searchRoutes";

// ✅ استخدم الراوتر الجديد الذي يعرّف /api/search داخله
import search from "./routes/search";

import { requireAuth } from "./middleware/auth";

export const app = express();

app.use(express.json({ limit: "2mb" }));
app.use(cors({ origin: true, credentials: true }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.send("ok"));

// =========================
// تثبيت الراوترات تحت /api
// =========================
app.use("/api/auth", authRoutes);
app.use("/api/diary", diaryRoutes);
app.use("/api/extractions", extractionRoutes);

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
