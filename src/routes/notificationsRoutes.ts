import { Router, Request, Response, NextFunction } from "express";
import { requireAuth } from "../middleware/auth";
import { ensureNotificationsTable, getUnreadCount, listNotifications, markRead, deleteNotifications } from "../services/notifications";

export const notificationsRoutes = Router();

// Ensure table on first import
ensureNotificationsTable().catch(() => {});

// GET /api/notifications -> list latest notifications for current user
notificationsRoutes.get("/api/notifications", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.sub as string;
    const limit = Math.min(200, Math.max(1, Number(req.query.limit) || 50));
    const items = await listNotifications(userId, limit);
    res.json({ items });
  } catch (err) { next(err); }
});

// GET /api/notifications/count -> unread count
notificationsRoutes.get("/api/notifications/count", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.sub as string;
    const count = await getUnreadCount(userId);
    res.json({ count });
  } catch (err) { next(err); }
});

// POST /api/notifications/read -> mark all or specific ids
notificationsRoutes.post("/api/notifications/read", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.sub as string;
    const ids = Array.isArray(req.body?.ids) ? req.body.ids.map((x: any) => String(x)) : undefined;
    const updated = await markRead(userId, ids);
    res.json({ ok: true, updated });
  } catch (err) { next(err); }
});

// DELETE /api/notifications -> delete by ids or all for user
notificationsRoutes.delete("/api/notifications", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.sub as string;
    const ids = Array.isArray(req.body?.ids) ? req.body.ids.map((x: any) => String(x)) : undefined;
    const count = await deleteNotifications(userId, ids);
    res.json({ ok: true, deleted: count });
  } catch (err) { next(err); }
});

// DELETE /api/notifications/:id -> delete a single notification by id for current user
notificationsRoutes.delete("/api/notifications/:id", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.sub as string;
    const id = String(req.params.id);
    const count = await deleteNotifications(userId, [id]);
    if (count > 0) return res.status(204).end();
    res.status(404).json({ ok: false, error: "Not found" });
  } catch (err) { next(err); }
});

export default notificationsRoutes;
