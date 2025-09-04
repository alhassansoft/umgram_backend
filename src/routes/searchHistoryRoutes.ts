import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../middleware/auth';
import { deleteHistoryByUser, deleteHistoryItem, listHistoryByUser } from '../services/searchHistory';

const router = Router();

// GET /api/search/history?source=diary|note|chat|microblog&limit=&offset=
router.get('/api/search/history', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.sub as string;
    const source = (req.query.source ? String(req.query.source) : 'diary').toLowerCase();
    const limit = req.query.limit ? Number(req.query.limit) : 50;
    const offset = req.query.offset ? Number(req.query.offset) : 0;
    const items = await listHistoryByUser(userId, source, limit, offset);
    // Normalize json columns if driver returns strings
    const norm = (items || []).map((r: any) => ({
      ...r,
      hits: typeof r.hits === 'string' ? JSON.parse(r.hits) : r.hits,
      answer: typeof r.answer === 'string' ? JSON.parse(r.answer) : r.answer,
    }));
    res.json({ items: norm });
  } catch (e) { next(e); }
});

// DELETE /api/search/history  (clear all for user)
router.delete('/api/search/history', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.sub as string;
    await deleteHistoryByUser(userId);
    res.status(204).end();
  } catch (e) { next(e); }
});

// DELETE /api/search/history/:id (single)
router.delete('/api/search/history/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.sub as string;
    const id = String(req.params.id);
    await deleteHistoryItem(userId, id);
    res.status(204).end();
  } catch (e) { next(e); }
});

export default router;
