import { Request, Response, NextFunction } from 'express';
import { pool } from '../db';
import { runChatExtractionOnce } from '../jobs/chatExtractionJob';
import { extractKeywords, DEFAULT_LLM_MODEL } from '../services/keywordExtractor';
import { saveExtraction, getExtractionByContent } from '../services/extractions';
import { indexChatConversation } from '../search/chatIndex';

// Simple search over chat extractions by token prefix
export async function searchChatExtractions(req: Request, res: Response, next: NextFunction) {
  try {
    const q = String(req.query.q ?? '').trim();
    if (!q) return res.status(400).json({ error: 'q is required' });

  // Disable caching for dynamic search to avoid 304 Not Modified responses on repeated queries
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.removeHeader('ETag');
  res.set('Last-Modified', new Date().toUTCString());

    // Search in extraction_terms by matching the QUERY against the token (reverse LIKE),
    // and also match against entities/actions arrays and inquiry text.
    const sql = `
      SELECT e.id, e.content_id, e.user_id, e.entities, e.actions, e.time_label, e.polarity, e.created_at
      FROM entity_extractions e
      WHERE e.content_type = 'chat'
        AND (
          EXISTS (
            SELECT 1 FROM extraction_terms t
            WHERE t.extraction_id = e.id
              AND $1 ILIKE ('%' || t.token || '%')
          )
          OR e.inquiry_ar ILIKE $2
          OR EXISTS (
            SELECT 1 FROM unnest(e.entities) AS en
            WHERE $1 ILIKE ('%' || en || '%')
          )
          OR EXISTS (
            SELECT 1 FROM unnest(e.actions) AS ac
            WHERE $1 ILIKE ('%' || ac || '%')
          )
        )
      ORDER BY e.created_at DESC
      LIMIT 100
    `;
    const { rows } = await pool.query(sql, [q, `%${q}%`]);
  res.status(200).json(rows);
  } catch (err) { next(err); }
}

// Trigger the scheduled job immediately (admin/test helper)
export async function runChatExtractionNow(req: Request, res: Response, next: NextFunction) {
  try {
    // Fire-and-forget to avoid client timeouts for large batches
    runChatExtractionOnce()
      .then(() => console.log('[chatExtraction] run-now completed'))
      .catch((e) => console.warn('[chatExtraction] run-now failed:', e?.message || e));
    res.status(202).json({ ok: true, status: 'accepted' });
  } catch (err) { next(err); }
}

// Get extraction summary for a specific direct conversation
export async function getChatExtractionByConversation(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'id required' });
    const payload = await getExtractionByContent('chat', id);
    if (!payload) return res.status(404).json({ error: 'not found' });
    // Return a compact view similar to search output
    const time_label = (payload as any)?.time_label ?? null;
    const polarity = (payload as any)?.polarity ?? null;
    const entities = (payload as any)?.entities ?? [];
    const actions = (payload as any)?.actions ?? [];
    res.json({ content_id: id, entities, actions, time_label, polarity, raw: payload });
  } catch (err) { next(err); }
}

// Rebuild extraction for a specific direct conversation now
export async function rebuildChatExtractionForConversation(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'id required' });

    // Collect conversation text from direct_messages
    const sql = `
      SELECT text
      FROM direct_messages
      WHERE conversation_id = $1
      ORDER BY created_at ASC
    `;
    const { rows } = await pool.query<{ text: string | null }>(sql, [id]);
    const text = rows.map(r => (r.text || '').toString().trim()).filter(Boolean).join('\n\n');

    // If empty, still mark as processed with empty payload
    let payload: any;
    if (!text.trim()) {
      payload = { text: '', entities: [], clauses: [], relations: [], affirmed_actions: [], negated_actions: [] } as any;
    } else {
      payload = await extractKeywords(text, { model: DEFAULT_LLM_MODEL, temperature: 0 });
    }

    await saveExtraction({
      contentType: 'chat',
      contentId: id,
      userId: null,
      payload,
      model: DEFAULT_LLM_MODEL,
      promptVersion: 'v1',
      inputTextForHash: text,
    });

    // Reindex this conversation so /api/search/chat reflects the latest extraction and content
    try {
      await indexChatConversation(id, { refresh: true });
    } catch (e) {
      console.warn('[chatExtraction] reindex after rebuild failed:', (e as any)?.message || e);
    }

    // Return fresh summary
  const fresh = await getExtractionByContent('chat', id);
  res.status(200).json({ ok: true, content_id: id, extraction: fresh });
  } catch (err) { next(err); }
}
