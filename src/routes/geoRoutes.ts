import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { query } from '../db';
import { createNotification } from '../services/notifications';

const router = Router();

async function ensureTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS user_circles (
      id BIGSERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT,
      lat DOUBLE PRECISION NOT NULL,
      lng DOUBLE PRECISION NOT NULL,
      radius INTEGER NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS idx_user_circles_user ON user_circles(user_id);

    CREATE TABLE IF NOT EXISTS user_circle_messages (
      id BIGSERIAL PRIMARY KEY,
      circle_id BIGINT NOT NULL REFERENCES user_circles(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL,
      text TEXT NOT NULL,
      lat DOUBLE PRECISION,
      lng DOUBLE PRECISION,
      created_at TIMESTAMPTZ DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS idx_circle_messages_circle ON user_circle_messages(circle_id);
    CREATE INDEX IF NOT EXISTS idx_circle_messages_created ON user_circle_messages(created_at);
  `);
}

// Ensure table on first import
ensureTable().catch(() => {});

// List current user's circles
router.get('/circles', requireAuth, async (req, res, next) => {
  try {
    const userId = String(req.user?.sub || '');
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const r = await query(
      `SELECT id, user_id, name, lat, lng, radius, created_at, updated_at
       FROM user_circles WHERE user_id = $1 ORDER BY id ASC`,
      [userId]
    );
    res.json(r.rows);
  } catch (err) { next(err); }
});

// Nearby circles that CONTAIN the given lat/lng (distance to center <= circle.radius)
router.get('/circles/nearby', requireAuth, async (req, res, next) => {
  try {
    const lat0 = Number(req.query.lat as string);
    const lng0 = Number(req.query.lng as string);
    if (!Number.isFinite(lat0) || !Number.isFinite(lng0)) {
      return res.status(400).json({ error: 'lat and lng are required' });
    }
    const limit = Math.max(1, Math.min(100, Number(req.query.limit ?? 50)));
    const r = await query(
      `SELECT c.id, c.user_id, c.name, c.lat, c.lng, c.radius,
              u.username AS owner_username, u.display_name AS owner_display_name,
              2 * 6371000 * asin(sqrt(
                power(sin((radians(c.lat) - radians($1)) / 2), 2) +
                cos(radians($1)) * cos(radians(c.lat)) * power(sin((radians(c.lng) - radians($2)) / 2), 2)
              )) AS dist
       FROM user_circles c
       LEFT JOIN users u ON u.id::text = c.user_id
       WHERE (
         2 * 6371000 * asin(sqrt(
           power(sin((radians(c.lat) - radians($1)) / 2), 2) +
           cos(radians($1)) * cos(radians(c.lat)) * power(sin((radians(c.lng) - radians($2)) / 2), 2)
         ))
       ) <= c.radius
       ORDER BY dist ASC
       LIMIT $3`,
      [lat0, lng0, limit]
    );
    res.json(r.rows);
  } catch (err) { next(err); }
});

// Circle details with owner info
router.get('/circles/:id', requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'invalid id' });
    const r = await query(
      `SELECT c.id, c.user_id, u.username AS owner_username, u.display_name AS owner_display_name,
              c.name, c.lat, c.lng, c.radius, c.created_at, c.updated_at
       FROM user_circles c
       LEFT JOIN users u ON u.id::text = c.user_id
       WHERE c.id = $1`,
      [id]
    );
    if (!r.rows[0]) return res.status(404).json({ error: 'not found' });
    res.json(r.rows[0]);
  } catch (err) { next(err); }
});

// Create circle
router.post('/circles', requireAuth, async (req, res, next) => {
  try {
    const userId = String(req.user?.sub || '');
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const { name = '', lat, lng, radius } = req.body || {};
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || !Number.isFinite(radius)) {
      return res.status(400).json({ error: 'lat, lng, radius are required' });
    }
    const r = await query(
      `INSERT INTO user_circles (user_id, name, lat, lng, radius)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, user_id, name, lat, lng, radius, created_at, updated_at`,
      [userId, String(name || ''), lat, lng, Math.round(radius)]
    );
    res.status(201).json(r.rows[0]);
  } catch (err) { next(err); }
});

// Nearby circles that CONTAIN the given lat/lng (distance to center <= circle.radius)
router.get('/circles/nearby', requireAuth, async (req, res, next) => {
  try {
    const lat0 = Number(req.query.lat as string);
    const lng0 = Number(req.query.lng as string);
    if (!Number.isFinite(lat0) || !Number.isFinite(lng0)) {
      return res.status(400).json({ error: 'lat and lng are required' });
    }
    const limit = Math.max(1, Math.min(100, Number(req.query.limit ?? 50)));
    // Haversine in SQL without PostGIS
    const r = await query(
      `SELECT c.id, c.user_id, c.name, c.lat, c.lng, c.radius,
              u.username AS owner_username, u.display_name AS owner_display_name,
              2 * 6371000 * asin(sqrt(
                power(sin((radians(c.lat) - radians($1)) / 2), 2) +
                cos(radians($1)) * cos(radians(c.lat)) * power(sin((radians(c.lng) - radians($2)) / 2), 2)
              )) AS dist
       FROM user_circles c
       LEFT JOIN users u ON u.id::text = c.user_id
       WHERE (
         2 * 6371000 * asin(sqrt(
           power(sin((radians(c.lat) - radians($1)) / 2), 2) +
           cos(radians($1)) * cos(radians(c.lat)) * power(sin((radians(c.lng) - radians($2)) / 2), 2)
         ))
       ) <= c.radius
       ORDER BY dist ASC
       LIMIT $3`,
      [lat0, lng0, limit]
    );
    res.json(r.rows);
  } catch (err) { next(err); }
});

// Update circle (name/lat/lng/radius)
router.patch('/circles/:id', requireAuth, async (req, res, next) => {
  try {
    const userId = String(req.user?.sub || '');
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'invalid id' });
  const { name, lat, lng, radius } = req.body || {};
  const fields: string[] = [];
  const values: any[] = [];
  // $1 => id, $2 => user_id (used in WHERE). Start SET placeholders from $3
  let idx = 2;
  if (name !== undefined) { fields.push(`name = $${++idx}`); values.push(String(name)); }
  if (Number.isFinite(lat)) { fields.push(`lat = $${++idx}`); values.push(Number(lat)); }
  if (Number.isFinite(lng)) { fields.push(`lng = $${++idx}`); values.push(Number(lng)); }
  if (Number.isFinite(radius)) { fields.push(`radius = $${++idx}`); values.push(Math.round(Number(radius))); }
    if (!fields.length) return res.status(400).json({ error: 'no fields to update' });
    const sql = `
      UPDATE user_circles SET ${fields.join(', ')}, updated_at = now()
      WHERE id = $1 AND user_id = $2
      RETURNING id, user_id, name, lat, lng, radius, created_at, updated_at`;
    const r = await query(sql, [id, userId, ...values]);
    if (!r.rows[0]) return res.status(404).json({ error: 'not found' });
    res.json(r.rows[0]);
  } catch (err) { next(err); }
});

// Delete circle
router.delete('/circles/:id', requireAuth, async (req, res, next) => {
  try {
    const userId = String(req.user?.sub || '');
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'invalid id' });
    await query(`DELETE FROM user_circles WHERE id = $1 AND user_id = $2`, [id, userId]);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

export default router;

// Helper: haversine distance in meters
function haversineMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371000; // meters
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

// Circle chat: list messages (requires location to validate access)
router.get('/circles/:id/chat/messages', requireAuth, async (req, res, next) => {
  try {
    const userId = String(req.user?.sub || '');
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'invalid id' });
    const lat = Number((req.query.lat as string) ?? '');
    const lng = Number((req.query.lng as string) ?? '');
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.status(400).json({ error: 'lat and lng are required to access circle chat' });
    }
    const limit = Math.max(1, Math.min(200, Number(req.query.limit ?? 100)));

    const cr = await query('SELECT id, user_id, lat, lng, radius FROM user_circles WHERE id = $1', [id]);
    const circle = cr.rows[0];
    if (!circle) return res.status(404).json({ error: 'circle not found' });
    const d = haversineMeters({ lat, lng }, { lat: Number(circle.lat), lng: Number(circle.lng) });
    // Allow the circle owner to bypass the geofence constraint
    if (d > Number(circle.radius) && String(circle.user_id) !== userId) {
      return res.status(403).json({ error: 'outside circle' });
    }

    const r = await query(
      `SELECT m.id, m.circle_id, m.user_id, u.username, u.display_name, m.text, m.lat, m.lng, m.created_at, m.anonymous
       FROM user_circle_messages m
       LEFT JOIN users u ON u.id::text = m.user_id
       WHERE m.circle_id = $1
       ORDER BY m.created_at ASC
       LIMIT $2`,
      [id, limit]
    );
    res.json(r.rows);
  } catch (err) { next(err); }
});

// Circle chat: add message (requires location inside circle)
router.post('/circles/:id/chat/messages', requireAuth, async (req, res, next) => {
  try {
    const userId = String(req.user?.sub || '');
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'invalid id' });
    const text = String(req.body?.text ?? '').trim();
    const lat = Number(req.body?.lat);
    const lng = Number(req.body?.lng);
    const anonymous = Boolean(req.body?.anonymous ?? false);
    if (!text) return res.status(400).json({ error: 'text required' });
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return res.status(400).json({ error: 'lat,lng required' });

    const cr = await query('SELECT id, user_id, lat, lng, radius FROM user_circles WHERE id = $1', [id]);
    const circle = cr.rows[0];
    if (!circle) return res.status(404).json({ error: 'circle not found' });
    const d = haversineMeters({ lat, lng }, { lat: Number(circle.lat), lng: Number(circle.lng) });
    // Allow the circle owner to bypass the geofence constraint
    if (d > Number(circle.radius) && String(circle.user_id) !== userId) {
      return res.status(403).json({ error: 'outside circle' });
    }

    const r = await query(
      `INSERT INTO user_circle_messages (circle_id, user_id, text, lat, lng, anonymous)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [id, userId, text, lat, lng, anonymous]
    );
    const mid = r.rows[0]?.id;
    const rr = await query(
      `SELECT m.id, m.circle_id, m.user_id, u.username, u.display_name, m.text, m.lat, m.lng, m.created_at, m.anonymous
       FROM user_circle_messages m LEFT JOIN users u ON u.id::text = m.user_id
       WHERE m.id = $1`,
      [mid]
    );
    
    // Create notifications for circle owner and other users who have sent messages in this circle
    try {
      console.log(`🔔 Creating notifications for circle ${id}, sender: ${userId}`);
      
      // Get circle owner info
      const circleOwnerQuery = await query(
        `SELECT c.user_id, u.display_name, u.username, c.name
         FROM user_circles c 
         LEFT JOIN users u ON u.id::text = c.user_id
         WHERE c.id = $1`,
        [id]
      );
      
      // Get other users who have sent messages in this circle (excluding current sender)
      const otherUsersQuery = await query(
        `SELECT DISTINCT m.user_id, u.display_name, u.username
         FROM user_circle_messages m 
         LEFT JOIN users u ON u.id::text = m.user_id
         WHERE m.circle_id = $1 AND m.user_id != $2`,
        [id, userId]
      );
      
      const senderInfo = await query(
        `SELECT display_name, username FROM users WHERE id::text = $1`,
        [userId]
      );
      
      const actualSenderName = senderInfo.rows[0]?.display_name || senderInfo.rows[0]?.username || 'مستخدم';
      const senderName = anonymous ? 'مجهول' : actualSenderName;
      const circleOwner = circleOwnerQuery.rows[0];
      const circleName = circleOwner?.name || 'دائرة';
      
      console.log(`🔔 Circle owner: ${circleOwner?.user_id}, sender: ${userId}, anonymous: ${anonymous}`);
      
      // Send notification to circle owner if they're not the sender
      if (circleOwner && circleOwner.user_id !== userId) {
        console.log(`🔔 Sending notification to circle owner: ${circleOwner.user_id}`);
        await createNotification({
          userId: circleOwner.user_id,
          type: 'circle_message',
          message: `رسالة جديدة من ${senderName} في دائرتك "${circleName}": ${text.slice(0, 50)}${text.length > 50 ? '...' : ''}`,
          requestId: String(id) // Store circle ID as requestId
        });
      } else {
        console.log(`🔔 Skipping owner notification (owner is sender or not found)`);
      }
      
      // Send notifications to other users who have participated in the circle
      console.log(`🔔 Other participants: ${otherUsersQuery.rows.length}`);
      for (const otherUser of otherUsersQuery.rows) {
        // Skip if this user is the circle owner (already notified above)
        if (otherUser.user_id === circleOwner?.user_id) {
          console.log(`🔔 Skipping ${otherUser.user_id} (is circle owner)`);
          continue;
        }
        
        console.log(`🔔 Sending notification to participant: ${otherUser.user_id}`);
        await createNotification({
          userId: otherUser.user_id,
          type: 'circle_message',
          message: `رسالة جديدة من ${senderName} في ${circleName}: ${text.slice(0, 50)}${text.length > 50 ? '...' : ''}`,
          requestId: String(id) // Store circle ID as requestId
        });
      }
      
      console.log(`🔔 Notification creation completed for circle ${id}`);
    } catch (notifError) {
      // Don't fail the main request if notification creation fails
      console.warn('Failed to create circle message notifications:', notifError);
    }
    
    res.status(201).json(rr.rows[0]);
  } catch (err) { next(err); }
});
