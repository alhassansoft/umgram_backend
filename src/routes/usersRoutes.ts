import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { query } from '../db';

const usersRoutes = Router();

// List users you can chat with (exclude current user). Optional search by q.
usersRoutes.get('/', requireAuth, async (req, res, next) => {
  try {
    const me = req.user?.sub;
    if (!me) return res.status(401).json({ error: 'Unauthorized' });

    const q = ((req.query.q as string) || '').trim();
    const limitRaw = Number(req.query.limit ?? 50);
    const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 200) : 50;

    if (q) {
      const like = `%${q}%`;
      const result = await query(
        `SELECT id, username, display_name, created_at
         FROM users
         WHERE id <> $1 AND (username ILIKE $2 OR display_name ILIKE $2)
         ORDER BY COALESCE(display_name, username) ASC
         LIMIT $3`,
        [me, like, limit]
      );
      return res.json(result.rows);
    }

    const result = await query(
      `SELECT id, username, display_name, created_at
       FROM users
       WHERE id <> $1
       ORDER BY COALESCE(display_name, username) ASC
       LIMIT $2`,
      [me, limit]
    );
    res.json(result.rows);
  } catch (err) { next(err); }
});

export default usersRoutes;
