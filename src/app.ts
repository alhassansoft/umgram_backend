// src/app.ts
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import { search } from "./routes/search";
import authRoutes from "./routes/authRoutes";       // ⬅️ NEW
import { requireAuth } from "./middleware/auth";    // ⬅️ (for /api/me example)

export const app = express();

// Middlewares
app.use(express.json({ limit: "2mb" }));
app.use(cors({ origin: true, credentials: true }));
app.use(morgan("dev"));

// Health check
app.get("/health", (_req, res) => res.send("ok"));

// Routes
app.use(search);
app.use("/api/auth", authRoutes);                   // ⬅️ NEW

// Example protected route (optional)
app.get("/api/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found", path: req.path });
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  const status = typeof err?.status === "number" ? err.status : 500;
  res.status(status).json({ error: err?.message ?? "Internal Server Error" });
});
