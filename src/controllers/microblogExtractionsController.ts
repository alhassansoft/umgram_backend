import { Request, Response, NextFunction } from "express";
import { es } from "../lib/es";
import { MICROBLOG_INDEX, ensureMicroblogIndex, attachExtractionToMicroPostInES } from "../search/microblogIndex";
import { query } from "../db";
import { extractKeywords } from "../services/keywordExtractor";

/** GET /api/extractions/microblog/:id */
export async function getMicroblogExtraction(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    await ensureMicroblogIndex();
    try {
      const r = await es.get({ index: MICROBLOG_INDEX, id: String(id) });
      const src: any = (r as any)?._source ?? {};
      return res.json({
        entities: src.entities ?? [],
        actions: src.actions ?? [],
        attributes: src.attributes ?? [],
        inquiry: src.inquiry_en ?? "",
        time: src.time_label ?? "unspecified",
        polarity: src.polarity ?? "unspecified",
      });
    } catch (e: any) {
      if (e?.meta?.statusCode !== 404) throw e;
      // compute on demand
      const { rows } = await query(`SELECT id, text, user_id, created_at FROM microblog_posts WHERE id = $1::bigint`, [id]);
      const row = rows[0];
      if (!row) return res.status(404).json({ error: "not_found" });
      const graph = await extractKeywords(String(row.text || ""));
      await attachExtractionToMicroPostInES({ id: row.id, userId: String(row.user_id), text: String(row.text || ""), createdAt: row.created_at }, graph, { refresh: true });
      // re-read
      const r2 = await es.get({ index: MICROBLOG_INDEX, id: String(id) });
      const src2: any = (r2 as any)?._source ?? {};
      return res.json({
        entities: src2.entities ?? [],
        actions: src2.actions ?? [],
        attributes: src2.attributes ?? [],
        inquiry: src2.inquiry_en ?? "",
        time: src2.time_label ?? "unspecified",
        polarity: src2.polarity ?? "unspecified",
      });
    }
  } catch (err) { next(err); }
}

/** POST /api/extractions/microblog/:id/rebuild */
export async function rebuildMicroblogExtraction(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const { rows } = await query(`SELECT id, text, user_id, created_at FROM microblog_posts WHERE id = $1::bigint`, [id]);
    const row = rows[0];
    if (!row) return res.status(404).json({ error: "not_found" });
    const graph = await extractKeywords(String(row.text || ""));
    await attachExtractionToMicroPostInES({ id: row.id, userId: String(row.user_id), text: String(row.text || ""), createdAt: row.created_at }, graph, { refresh: true });
    return res.status(204).end();
  } catch (err) { next(err); }
}

/** POST /api/extractions/microblog/:id/sync-es (alias of rebuild for now) */
export async function syncMicroblogExtractionToES(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  return rebuildMicroblogExtraction(req, res, next);
}
