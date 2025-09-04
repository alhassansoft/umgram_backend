import { Request, Response, NextFunction } from 'express';
import { query } from '../db';

// Create or get a 1:1 conversation between current user and peer
export async function openConversation(
  req: Request<unknown, unknown, { peerId?: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const me = req.user?.sub;
    const peerId = String(req.body?.peerId || '').trim();
    if (!me) return res.status(401).json({ error: 'Unauthorized' });
    if (!peerId) return res.status(400).json({ error: 'peerId is required' });

    // Try to find existing convo with exactly these two participants
    const existing = await query<{ id: string }>(
      `SELECT dc.id
       FROM direct_conversations dc
       JOIN direct_conversation_participants p1 ON p1.conversation_id = dc.id AND p1.user_id = $1
       JOIN direct_conversation_participants p2 ON p2.conversation_id = dc.id AND p2.user_id = $2
       GROUP BY dc.id`,
      [me, peerId]
    );
    if (existing.rowCount && existing.rows[0]?.id) {
      return res.status(200).json({ id: existing.rows[0].id });
    }

    // Create new
  const created = await query<{ id: string }>(
      `INSERT INTO direct_conversations DEFAULT VALUES RETURNING id`
    );
  const convId = created.rows[0]?.id;
  if (!convId) return res.status(500).json({ error: 'Failed creating conversation' });
    await query(`INSERT INTO direct_conversation_participants(conversation_id, user_id) VALUES ($1, $2), ($1, $3)`, [convId, me, peerId]);
    res.status(201).json({ id: convId });
  } catch (err) { next(err); }
}

export async function listMyConversations(req: Request, res: Response, next: NextFunction) {
  try {
    const me = req.user?.sub;
    if (!me) return res.status(401).json({ error: 'Unauthorized' });
    const result = await query<{ id: string; updated_at: string }>(
      `SELECT dc.id, dc.updated_at
       FROM direct_conversations dc
       JOIN direct_conversation_participants p ON p.conversation_id = dc.id
       WHERE p.user_id = $1
       ORDER BY dc.updated_at DESC
       LIMIT 100`,
      [me]
    );
    res.json(result.rows);
  } catch (err) { next(err); }
}

export async function getMessages(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const me = req.user?.sub;
    if (!me) return res.status(401).json({ error: 'Unauthorized' });
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: 'id required' });

    // membership check
    const member = await query(`SELECT 1 FROM direct_conversation_participants WHERE conversation_id = $1 AND user_id = $2`, [id, me]);
    if (!member.rowCount) return res.status(403).json({ error: 'Forbidden' });

    const msgs = await query(
      `SELECT id, sender_id, text, created_at, delivered_at, read_at
       FROM direct_messages
       WHERE conversation_id = $1
       ORDER BY created_at ASC
       LIMIT 500`,
      [id]
    );
    res.json(msgs.rows);
  } catch (err) { next(err); }
}

export async function sendMessage(
  req: Request<{ id: string }, unknown, { text?: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const me = req.user?.sub;
    if (!me) return res.status(401).json({ error: 'Unauthorized' });
    const id = req.params.id;
    const text = String(req.body?.text || '').trim();
    if (!id) return res.status(400).json({ error: 'id required' });
    if (!text) return res.status(400).json({ error: 'text required' });

    // membership check
    const member = await query(`SELECT 1 FROM direct_conversation_participants WHERE conversation_id = $1 AND user_id = $2`, [id, me]);
    if (!member.rowCount) return res.status(403).json({ error: 'Forbidden' });

  const inserted = await query<{ id: string }>(
      `INSERT INTO direct_messages(conversation_id, sender_id, text)
       VALUES ($1, $2, $3) RETURNING id`,
      [id, me, text]
    );
  if (!inserted.rowCount || !inserted.rows[0]?.id) return res.status(500).json({ error: 'Failed sending message' });
  // bump updated_at
    await query(`UPDATE direct_conversations SET updated_at = now() WHERE id = $1`, [id]);
  res.status(201).json({ id: inserted.rows[0].id });
  } catch (err) { next(err); }
}
