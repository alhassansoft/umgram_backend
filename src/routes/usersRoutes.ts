import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { query } from '../db';

const usersRoutes = Router();

// Get current user profile
usersRoutes.get('/me', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const result = await query(
      `SELECT id, username, display_name, email, profile_image, created_at
       FROM users
       WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) { next(err); }
});

// Update user profile
usersRoutes.put('/me', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { display_name, profile_image } = req.body;
    
    // Build update query dynamically based on provided fields
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (display_name !== undefined) {
      updates.push(`display_name = $${paramCount}`);
      values.push(display_name);
      paramCount++;
    }

    if (profile_image !== undefined) {
      updates.push(`profile_image = $${paramCount}`);
      values.push(profile_image);
      paramCount++;
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push(`updated_at = now()`);
    values.push(userId);

    const updateQuery = `
      UPDATE users 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, username, display_name, email, profile_image, created_at, updated_at
    `;

    const result = await query(updateQuery, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) { next(err); }
});

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
        `SELECT id, username, display_name, profile_image, created_at
         FROM users
         WHERE id <> $1 AND (username ILIKE $2 OR display_name ILIKE $2)
         ORDER BY COALESCE(display_name, username) ASC
         LIMIT $3`,
        [me, like, limit]
      );
      return res.json(result.rows);
    }

    const result = await query(
      `SELECT id, username, display_name, profile_image, created_at
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
