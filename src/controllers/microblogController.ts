import { Request, Response, NextFunction } from "express";
import { countsForPost, createMicroPost, listMicroPosts, toggleMicroLike } from "../services/microblogService";
import { indexMicroPost, attachExtractionToMicroPostInES, MICROBLOG_INDEX, ensureMicroblogIndex } from "../search/microblogIndex";
import { extractKeywords, expandQuery } from "../services/keywordExtractor";
import { query } from "../db";
import { es } from "../lib/es";

// shaped response for frontend
function mapForClient(row: any, meId?: string) {
  return {
    id: String(row.id),
    text: String(row.text),
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    user: { id: String(row.user_id), username: String(row.username ?? row.user_id) },
    likes: Number(row.likes ?? 0),
    replies: Number(row.replies ?? 0),
    liked: !!row.liked,
  };
}

export async function listPosts(req: Request, res: Response, next: NextFunction) {
  try {
    const me = req.user?.sub;
    const limit = Math.min(Math.max(Number(req.query.limit ?? 50), 1), 200);
    const sinceId = (req.query.sinceId as string) || undefined;

    // one query to include user and counts + liked
    const { rows } = await query(
  `SELECT p.id, p.text, p.user_id, p.created_at,
      u.username,
              (SELECT COUNT(*) FROM microblog_likes ml WHERE ml.post_id = p.id)   AS likes,
              (SELECT COUNT(*) FROM microblog_replies mr WHERE mr.post_id = p.id) AS replies,
              EXISTS(SELECT 1 FROM microblog_likes ml2 WHERE ml2.post_id = p.id AND ml2.user_id = $1) AS liked
       FROM microblog_posts p
   LEFT JOIN users u ON u.id::text = p.user_id
   ${sinceId ? 'WHERE p.id < $2::bigint' : ''}
       ORDER BY p.created_at DESC
       LIMIT ${limit}`,
      sinceId ? [me ?? null, sinceId] : [me ?? null]
    );

    return res.json(rows.map((r) => mapForClient(r, me)));
  } catch (err) { next(err); }
}

export async function createPost(req: Request<unknown, unknown, { text?: string }>, res: Response, next: NextFunction) {
  try {
    const me = req.user?.sub;
    if (!me) return res.status(401).json({ error: 'Unauthorized' });
    const text = (req.body?.text ?? '').trim();
    if (!text) return res.status(400).json({ error: 'text is required' });

    const created = await createMicroPost(text, me);
    // ES index + extraction (best-effort)
    indexMicroPost({ id: created.id, userId: created.userId, text: created.text, createdAt: created.createdAt }).catch(()=>{});
  // Use document-time extractor (same as diary/note)
  extractKeywords(created.text).then((graph) =>
      attachExtractionToMicroPostInES({ id: created.id, userId: created.userId, text: created.text, createdAt: created.createdAt }, graph, { refresh: true })
    ).catch(()=>{});

    // hydrate counts and username
    const { rows } = await query(
  `SELECT p.id, p.text, p.user_id, p.created_at,
              u.username,
              0 as likes, 0 as replies,
              FALSE as liked
       FROM microblog_posts p
   LEFT JOIN users u ON u.id::text = p.user_id
   WHERE p.id = $1::bigint`,
      [created.id]
    );

    return res.status(201).json(mapForClient(rows[0] ?? created));
  } catch (err) { next(err); }
}

export async function likePost(req: Request<{ id?: string }>, res: Response, next: NextFunction) {
  try {
    const me = req.user?.sub;
    if (!me) return res.status(401).json({ error: 'Unauthorized' });
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: 'id is required' });

    const { liked } = await toggleMicroLike(id, me);
    return res.json({ liked });
  } catch (err) { next(err); }
}

/**
 * Return ES analysis attached to a microblog post (entities/actions/polarity/time, ...)
 */
export async function getPostAnalysis(req: Request<{ id?: string }>, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: 'id is required' });
    await ensureMicroblogIndex();
    try {
      const r = await es.get({ index: MICROBLOG_INDEX, id: String(id) });
      const src: any = (r as any)?._source ?? {};
      const out = {
        id: String(src.id ?? id),
        entities: src.entities ?? [],
        actions: src.actions ?? [],
        attributes: src.attributes ?? [],
        affirmed_actions_en: src.affirmed_actions_en ?? [],
        negated_actions_en: src.negated_actions_en ?? [],
        polarity: src.polarity ?? 'unspecified',
        time_label: src.time_label ?? 'unspecified',
        phrases_en: src.phrases_en ?? [],
        inquiry_en: src.inquiry_en ?? '',
        updatedAt: src.updatedAt ?? null,
      };
      return res.json(out);
    } catch (e: any) {
      if (e?.meta?.statusCode === 404) {
        // Try to compute analysis on the fly for older posts
        const { rows } = await query(
          `SELECT id, text, user_id, created_at FROM microblog_posts WHERE id = $1::bigint`,
          [id]
        );
        const row = rows[0];
        if (!row) return res.status(404).json({ error: 'not_found' });
        try {
          // Use document-time extractor (same as diary/note)
          const graph = await extractKeywords(String(row.text || ''));
          await attachExtractionToMicroPostInES({ id: row.id, userId: String(row.user_id), text: String(row.text || ''), createdAt: row.created_at }, graph, { refresh: true });
          const r2 = await es.get({ index: MICROBLOG_INDEX, id: String(id) });
          const src2: any = (r2 as any)?._source ?? {};
          const out2 = {
            id: String(src2.id ?? id),
            entities: src2.entities ?? [],
            actions: src2.actions ?? [],
            attributes: src2.attributes ?? [],
            affirmed_actions_en: src2.affirmed_actions_en ?? [],
            negated_actions_en: src2.negated_actions_en ?? [],
            polarity: src2.polarity ?? 'unspecified',
            time_label: src2.time_label ?? 'unspecified',
            phrases_en: src2.phrases_en ?? [],
            inquiry_en: src2.inquiry_en ?? '',
            updatedAt: src2.updatedAt ?? null,
          };
          return res.json(out2);
        } catch (inner) {
          return res.status(500).json({ error: 'analysis_failed' });
        }
      }
      throw e;
    }
  } catch (err) { next(err); }
}
