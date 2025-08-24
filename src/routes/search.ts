// /Users/alhassanalabdli/Desktop/umgram/backend/src/routes/search.ts
import { Router, Request, Response, NextFunction } from "express";
import { es } from "../lib/es";
import type {
  QueryDslOperator,
  QueryDslQueryContainer,
} from "@elastic/elasticsearch/lib/api/types";
import { searchDiariesSemantic } from "../search/diarySearch";
import { selectAnswer } from "../services/answerSelector";

export const search = Router();

// فهارس البحث
const POSTS_INDEX = "umgram_posts";
const DIARY_INDEX = process.env.ES_DIARY_INDEX || "umgram_diarys";

/**
 * ===============================
 *  البحث الدلالي في اليوميات (umgram_diarys)
 * ===============================
 *
 * GET /api/search?q=...&mode=wide|strict
 * - يستعمل محرك kNN + توسيعات ديناميكية + إبراز (highlight)
 * - mode=wide  (افتراضي): قبول كل الصيغ بدون استبعاد قطبية
 * - mode=strict: استبعاد القطبية المعاكسة عندما يكون الفعل (مثل buy) واضحًا
 */
search.get(
  "/api/search",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const q = String(req.query.q ?? "").trim();
      const modeParam = String(req.query.mode ?? "").toLowerCase();
      const mode: "wide" | "strict" = modeParam === "strict" ? "strict" : "wide";

      if (!q) return res.json({ count: 0, hits: [], mode });

      const hits = await searchDiariesSemantic(q, { mode });
      return res.json({ count: hits.length, hits, mode });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * ===============================
 *  اختيار الجواب من النتائج (LLM)
 * ===============================
 *
 * POST /api/search/answer
 * Body: { question: string, mode?: 'wide'|'strict', hits?: any[] }
 * - إن قُدمت hits فسيتم استعمالها مباشرة (يُقصّ إلى أعلى 10).
 * - وإلا سننفّذ البحث الدلالي ثم نمرر أعلى النتائج إلى أداة الاختيار.
 *
 * GET /api/search/answer?q=...&mode=wide|strict
 * - بديل بسيط عبر الاستعلام.
 */
search.post(
  "/api/search/answer",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body || {};
      const question = String(body.question ?? "").trim();
      const modeParam = String(body.mode ?? "").toLowerCase();
      const mode: "wide" | "strict" = modeParam === "strict" ? "strict" : "wide";
      const hits = Array.isArray(body.hits) ? body.hits : undefined;

      if (!question) return res.status(400).json({ error: "question is required" });

      let topHits: any[];
      if (hits && hits.length) {
        topHits = hits.slice(0, 10);
      } else {
        topHits = await searchDiariesSemantic(question, { mode });
      }

      const result = await selectAnswer(question, topHits, { temperature: 0 });
      return res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

search.get(
  "/api/search/answer",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const q = String(req.query.q ?? "").trim();
      const modeParam = String(req.query.mode ?? "").toLowerCase();
      const mode: "wide" | "strict" = modeParam === "strict" ? "strict" : "wide";
      if (!q) return res.status(400).json({ error: "q is required" });

      const hits = await searchDiariesSemantic(q, { mode });
      const result = await selectAnswer(q, hits, { temperature: 0 });
      return res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * ===============================
 *  البحث في المنشورات (umgram_posts)
 * ===============================
 *
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
        // دعم العبارات/المعاملات (~ " ^ | ( ) + - * )
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

        // نجزّئ الكلمات العربية ونبني MUST من *token*
        const tokens = q.split(/\s+/).filter(Boolean);
        const wildcardMust: QueryDslQueryContainer[] = tokens.map((t) => ({
          // query_string مع wildcards؛ نفعّل AND داخل هذا المسار
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
        index: POSTS_INDEX,
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
 * إكمال تلقائي على عناوين المنشورات باستخدام search_as_you_type.
 * GET /search/suggest?q=Um
 */
search.get(
  "/search/suggest",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const q = String(req.query.q ?? "").trim();
      const size = clampInt(req.query.size as string | undefined, 10, 1, 50);
      if (!q) return res.json({ suggestions: [] });

      const result = await es.search<{ title?: string }>({
        index: POSTS_INDEX,
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
 * فهرسة/حذف مستند منشور يدويًا (اختبار/أدوات).
 * POST /search/index
 * DELETE /search/:id
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
        index: POSTS_INDEX,
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

search.delete(
  "/search/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      await es.delete({ index: POSTS_INDEX, id, refresh: "wait_for" });
      res.json({ ok: true });
    } catch (err: any) {
      if (err?.meta?.statusCode === 404)
        return res.json({ ok: true, deleted: false });
      next(err);
    }
  }
);

/**
 * ==================================
 *  البحث التقليدي في اليوميات (umgram_diarys)
 * ==================================
 *
 * GET /search/diary?q=...&op=and|or&size=&from=&lang=ar|en&userId=<uuid>
 * - نفس منطق العربي/الإنجليزي، لكن الحقول: title, content فقط.
 * - يمكن تقييد النتائج بـ userId (كلمة مفتاحية في المابّينغ).
 */
search.get(
  "/search/diary",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const qRaw = String(req.query.q ?? "");
      const size = clampInt(req.query.size as string | undefined, 20, 1, 100);
      const from = clampInt(req.query.from as string | undefined, 0, 0, 10_000);
      const op: QueryDslOperator =
        String(req.query.op ?? "or").toLowerCase() === "and" ? "and" : "or";
      const langParam = String(req.query.lang ?? "").toLowerCase();
      const userId = (req.query.userId ? String(req.query.userId) : "").trim();

      if (!qRaw.trim()) return res.json({ hits: [], total: 0 });

      const hasAdvancedOps = /[~"^|()+\-*]/.test(qRaw);
      const q = hasAdvancedOps ? qRaw.trim() : normalizeQuery(qRaw);

      const isArabic =
        langParam === "ar" ? true : langParam === "en" ? false : /[\u0600-\u06FF]/.test(q);

      // حقول اليوميات (كما في المابّينغ المقترح)
      const diaryFields = ["title^2", "content"];

      let baseQuery: QueryDslQueryContainer;

      if (hasAdvancedOps) {
        baseQuery = {
          simple_query_string: {
            query: q,
            fields: diaryFields as string[],
            default_operator: op,
          },
        };
      } else if (isArabic) {
        const tokens = q.split(/\s+/).filter(Boolean);

        const mm: QueryDslQueryContainer = {
          multi_match: {
            query: q,
            fields: diaryFields as string[],
            operator: op,
            type: "best_fields",
          },
        };

        const wildcardMust: QueryDslQueryContainer[] = tokens.map((t) => ({
          query_string: {
            query: `*${t}*`,
            fields: diaryFields as string[],
            default_operator: "and",
            analyze_wildcard: true as any,
          } as any,
        }));

        baseQuery =
          wildcardMust.length > 0
            ? { bool: { should: [mm, { bool: { must: wildcardMust } }], minimum_should_match: 1 } }
            : mm;
      } else {
        const engTokens = q.toLowerCase().match(/[a-z]+/g) ?? [];
        const hasShortToken = engTokens.some((t) => t.length < 3);

        baseQuery = {
          multi_match: {
            query: q,
            fields: diaryFields as string[],
            operator: op,
            type: "best_fields",
            fuzziness: (hasShortToken ? 1 : ("AUTO" as any)),
          },
        };
      }

      // فلتر userId إن وُجد
      const query: QueryDslQueryContainer = userId
        ? { bool: { must: [baseQuery, { term: { userId } }] } }
        : baseQuery;

      const result = await es.search({
        index: DIARY_INDEX,
        from,
        size,
        query,
        highlight: { fields: { title: {}, content: {} } },
      });

      const hits = (result.hits.hits ?? []).map((h: any) => ({
        id: h._id,
        score: h._score,
        ...(h._source ?? {}),
        highlight: h.highlight,
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
 * فهرسة/حذف مستند يومية يدويًا (اختبار/أدوات).
 * POST /search/diary/index
 * DELETE /search/diary/:id
 */
search.post(
  "/search/diary/index",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, title, content, userId, createdAt, updatedAt } = req.body ?? {};
      if (!title) return res.status(400).json({ error: "title is required" });

      const doc = {
        title: String(title),
        content: content != null ? String(content) : "",
        userId: userId ? String(userId) : undefined,
        createdAt: createdAt
          ? new Date(createdAt).toISOString()
          : new Date().toISOString(),
        updatedAt: updatedAt
          ? new Date(updatedAt).toISOString()
          : new Date().toISOString(),
      };

      await es.index({
        index: DIARY_INDEX,
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

search.delete(
  "/search/diary/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      await es.delete({ index: DIARY_INDEX, id, refresh: "wait_for" });
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

export default search;
