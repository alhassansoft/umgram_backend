// src/routes/search.ts
import { Router, Request, Response, NextFunction } from "express";
import { es } from "../lib/es";
import type {
  QueryDslOperator,
  QueryDslQueryContainer,
} from "@elastic/elasticsearch/lib/api/types";

export const search = Router();

const INDEX = "umgram_posts";

/**
 * GET /search?q=...&op=and|or&size=&from=&lang=ar|en
 * عربي/إنجليزي + AND/OR
 * - إنجليزي: multi_match مع fuzziness ديناميكي (AUTO أو 1 للكلمات القصيرة)
 * - عربي: multi_match + Fallback wildcard داخلي (*token*) لكل كلمة
 * - رموز متقدمة (~"^|()+-*) => simple_query_string كما هو
 */
search.get(
  "/search",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const qRaw = String(req.query.q ?? "");
      const size = clampInt(req.query.size as string | undefined, 20, 1, 100);
      const from = clampInt(req.query.from as string | undefined, 0, 0, 10_000);
      const op: QueryDslOperator =
        String(req.query.op ?? "or").toLowerCase() === "and" ? "and" : "or";
      const langParam = String(req.query.lang ?? "").toLowerCase();

      if (!qRaw.trim()) return res.json({ hits: [], total: 0 });

      const hasAdvancedOps = /[~"^|()+\-*]/.test(qRaw);
      const q = hasAdvancedOps ? qRaw.trim() : normalizeQuery(qRaw);

      const isArabic =
        langParam === "ar" ? true : langParam === "en" ? false : /[\u0600-\u06FF]/.test(q);

      const arFields = ["title.ar^5", "body.ar^3", "title.s^6"];
      const enFields = ["title.en^5", "body.en^3", "title.s^6", "title^2", "body"];

      let query: QueryDslQueryContainer;

      if (hasAdvancedOps) {
        // دعم schol~, العبارات... إلخ (نمرّر q كما هو)
        query = {
          simple_query_string: {
            query: q,
            fields: (isArabic ? arFields : enFields) as string[],
            default_operator: op,
          },
        };
      } else if (isArabic) {
        // ===== العربي: multi_match + fallback wildcards لكل كلمة =====
        const base: QueryDslQueryContainer = {
          multi_match: {
            query: q,
            fields: arFields as string[],
            operator: op,
            type: "best_fields",
          },
        };

        // نجزّئ الكلمات العربية (بسيطًا بالمسافات) ونبني MUST من *token*
        const tokens = q.split(/\s+/).filter(Boolean);
        const wildcardMust: QueryDslQueryContainer[] = tokens.map((t) => ({
          // query_string مع wildcards داخلية; نفعّل AND داخل هذا المسار
          // ملاحظة: analyze_wildcard قد لا تظهر في التايبنج، فنستخدم as any
          query_string: {
            query: `*${t}*`,
            fields: arFields as string[],
            default_operator: "and",
            analyze_wildcard: true as any,
          } as any,
        }));

        const wildcardPath: QueryDslQueryContainer =
          wildcardMust.length > 0
            ? { bool: { must: wildcardMust } }
            : base;

        query = {
          bool: {
            should: [base, wildcardPath],
            minimum_should_match: 1,
          },
        };
      } else {
        // ===== الإنجليزي: multi_match دائماً مع fuzziness ديناميكي =====
        const engTokens = q.toLowerCase().match(/[a-z]+/g) ?? [];
        const hasShortToken = engTokens.some((t) => t.length < 3);

        query = {
          multi_match: {
            query: q,
            fields: enFields as string[],
            operator: op,
            type: "best_fields",
            fuzziness: (hasShortToken ? 1 : ("AUTO" as any)),
          },
        };
      }

      const result = await es.search({
        index: INDEX,
        from,
        size,
        query,
      });

      const hits = (result.hits.hits ?? []).map((h) => ({
        id: h._id,
        score: h._score,
        ...(h._source ?? {}),
      }));
      const total =
        typeof result.hits.total === "number"
          ? result.hits.total
          : (result.hits.total as any)?.value ?? hits.length;

      res.json({ hits, total });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /search/suggest?q=Um
 * إكمال تلقائي على العنوان باستخدام search_as_you_type.
 */
search.get(
  "/search/suggest",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const q = String(req.query.q ?? "").trim();
      const size = clampInt(req.query.size as string | undefined, 10, 1, 50);
      if (!q) return res.json({ suggestions: [] });

      const result = await es.search<{ title?: string }>({
        index: INDEX,
        size,
        query: {
          multi_match: {
            query: q,
            type: "bool_prefix",
            fields: ["title.s", "title.s._2gram", "title.s._3gram"],
          },
        },
        _source: ["title"],
      });

      const suggestions = (result.hits.hits ?? [])
        .map((h) => h._source?.title)
        .filter(Boolean);

      res.json({ suggestions });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /search/index
 * فهرسة مستند يدويًا (اختبار/أدوات).
 */
search.post(
  "/search/index",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, title, body, authorId, createdAt } = req.body ?? {};
      if (!title || !body) {
        return res.status(400).json({ error: "title and body are required" });
      }

      const doc = {
        title: String(title),
        body: String(body),
        authorId:
          typeof authorId === "number"
            ? authorId
            : parseInt(authorId, 10) || undefined,
        createdAt: createdAt
          ? new Date(createdAt).toISOString()
          : new Date().toISOString(),
      };

      await es.index({
        index: INDEX,
        ...(id ? { id: String(id) } : {}),
        document: doc,
        refresh: "wait_for",
      });

      return res.status(201).json({ ok: true, id: id ?? "(auto)" });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /search/:id
 * حذف مستند من الفهرس.
 */
search.delete(
  "/search/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      await es.delete({ index: INDEX, id, refresh: "wait_for" });
      res.json({ ok: true });
    } catch (err: any) {
      if (err?.meta?.statusCode === 404)
        return res.json({ ok: true, deleted: false });
      next(err);
    }
  }
);

// ===== Helpers =====
function normalizeQuery(q: string): string {
  return q.replace(/\b(AND|OR|&&|\|\|)\b/gi, " ").replace(/\s+/g, " ").trim();
}
function clampInt(
  v: string | undefined,
  def: number,
  min: number,
  max: number
): number {
  const n = v ? parseInt(v, 10) : def;
  if (Number.isNaN(n)) return def;
  return Math.max(min, Math.min(max, n));
}
