// src/search/diarySearch.ts
import { es } from "../lib/es";
import { DIARY_INDEX } from "./diaryIndex";
import { embedText } from "../services/embeddings";
import { expandQuery, DEFAULT_LLM_MODEL } from "../services/keywordExtractor"; 
import { logQueryExpansion } from "../services/queryLog";   
import { searchChunkedDiaries } from "../services/diaryChunkedIndexing";

// ------------------------------------------------------------
// Environment / Config Helpers
// ------------------------------------------------------------
const envBool = (name: string, def = false) => {
  const v = process.env[name];
  if (v == null) return def;
  return /^(1|true|yes|on)$/i.test(v.trim());
};
const envInt = (name: string, def: number) => {
  const v = process.env[name];
  const n = v ? parseInt(v, 10) : NaN;
  return Number.isFinite(n) ? n : def;
};

// Feature toggles & tunables (safe defaults)
const CFG_PHASED = envBool("SEARCH_PHASED", true); // enable phased lexical gate
const CFG_LEXICAL_THRESHOLD = envInt("SEARCH_LEXICAL_HIT_THRESHOLD", 3); // hits needed to skip expansion
const CFG_DISABLE_EXP_FOR_SHORT = envBool("SEARCH_DISABLE_EXPANSION_FOR_SHORT", true);
const CFG_SHORT_QUERY_MAX_TOKENS = envInt("SEARCH_SHORT_QUERY_MAX_TOKENS", 3);
const CFG_EMBED_CACHE_SIZE = envInt("SEARCH_EMBED_CACHE_SIZE", 256);
const CFG_EXPAND_CACHE_SIZE = envInt("SEARCH_EXPAND_CACHE_SIZE", 256);
const CFG_CACHE_TTL_MS = envInt("SEARCH_CACHE_TTL_MS", 5 * 60 * 1000); // 5m

// ------------------------------------------------------------
// Simple LRU Cache implementation (time-aware)
// ------------------------------------------------------------
interface LRUEntry<T> { value: T; expires: number; }
class LRUCache<T> {
  private map = new Map<string, LRUEntry<T>>();
  constructor(private capacity: number, private ttlMs: number) {}
  get(key: string): T | undefined {
    const e = this.map.get(key);
    if (!e) return undefined;
    if (e.expires < Date.now()) { this.map.delete(key); return undefined; }
    // refresh recency
    this.map.delete(key); this.map.set(key, e);
    return e.value;
  }
  set(key: string, value: T) {
    if (this.capacity <= 0) return;
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, { value, expires: Date.now() + this.ttlMs });
    if (this.map.size > this.capacity) {
      // delete oldest
      const first = this.map.keys().next();
      if (!first.done) this.map.delete(first.value);
    }
  }
  size() { return this.map.size; }
}

// Caches
const embedCache = new LRUCache<number[]>(CFG_EMBED_CACHE_SIZE, CFG_CACHE_TTL_MS);
const expandCache = new LRUCache<any>(CFG_EXPAND_CACHE_SIZE, CFG_CACHE_TTL_MS);

// Metrics (lightweight, in-memory)
let METRIC_EMBED_CACHE_HIT = 0;
let METRIC_EXPAND_CACHE_HIT = 0;
let METRIC_EXPANSIONS_SKIPPED_SHORT = 0;
let METRIC_PHASED_LEXICAL_BYPASS = 0;
let METRIC_PHASED_LEXICAL_ATTEMPTS = 0;

function maybeLogMetrics() {
  // Log every ~200 queries (heuristic based on sum of events)
  const total = METRIC_EMBED_CACHE_HIT + METRIC_EXPAND_CACHE_HIT + METRIC_PHASED_LEXICAL_ATTEMPTS;
  if (total % 200 === 0 && total !== 0) {
    console.info("[DiarySearch][metrics]", {
      embedCacheHit: METRIC_EMBED_CACHE_HIT,
      expandCacheHit: METRIC_EXPAND_CACHE_HIT,
      expansionsSkippedShort: METRIC_EXPANSIONS_SKIPPED_SHORT,
      phasedLexicalBypass: METRIC_PHASED_LEXICAL_BYPASS,
      embedCacheSize: embedCache.size(),
      expandCacheSize: expandCache.size()
    });
  }
}

async function getEmbedding(q: string): Promise<number[]> {
  const key = q.trim();
  const cached = embedCache.get(key);
  if (cached) { METRIC_EMBED_CACHE_HIT++; maybeLogMetrics(); return cached; }
  const vec = await embedText(q);
  if (Array.isArray(vec)) embedCache.set(key, vec);
  maybeLogMetrics();
  return vec;
}

async function getExpanded(q: string): Promise<any> {
  const model = DEFAULT_LLM_MODEL;
  const key = model + "|" + q.trim().toLowerCase();
  const cached = expandCache.get(key);
  if (cached) { METRIC_EXPAND_CACHE_HIT++; maybeLogMetrics(); return cached; }
  const expanded = await expandQuery(q, { model, temperature: 0.1 });
  expandCache.set(key, expanded);
  maybeLogMetrics();
  return expanded;
}

// Cheap lexical token counter (split by whitespace)
function countQueryTokens(q: string): number { return q.trim().split(/\s+/).filter(Boolean).length; }

// Lightweight lexical multi_match for phased gate or short-query path
function buildSimpleLexicalQuery(userQuery: string) {
  return {
    bool: {
      must: [
        {
          multi_match: {
            query: userQuery,
            fields: ["title^3", "content^2", "phrases_en", "inquiry_en"],
            type: "best_fields",
            fuzziness: "AUTO"
          }
        }
      ]
    }
  };
}

type SearchHit<T = any> = {
  _id: string;
  _score: number;
  _source: T;
  highlight?: Record<string, string[]>;
};

// Helper functions
const toStr = (s?: unknown) => (s ?? "").toString().trim();
const low = (s?: string) => toStr(s).toLowerCase();
const ensureStrArray = (x: unknown): string[] =>
  Array.isArray(x) ? (x as unknown[]).map((v) => toStr(v)).filter(Boolean) : [];
const uniqStr = (arr: ReadonlyArray<string>): string[] => Array.from(new Set(arr));

function buildFallbackQuery(
  userQuery: string,
  spans: string[],
  actions: string[],
  entities: string[],
  extraPhrases: string[]
): string {
  const parts = [
    userQuery?.trim() || "",
    ...spans,
    ...actions,
    ...entities,
    ...extraPhrases,
  ]
    .map((s) => (s || "").trim())
    .filter(Boolean);
  return uniqStr(parts).slice(0, 24).join(" ");
}

function getActionTokensFromClauses(payload: Awaited<ReturnType<typeof expandQuery>>): string[] {
  const out: string[] = [];
  for (const c of (payload as any).clauses ?? []) {
    if (c?.kind !== "event") continue;
    out.push(low((c.verb?.lemma || c.verb?.surface) as string));
  }
  return uniqStr(out).filter(Boolean);
}

function getEventSpans(payload: Awaited<ReturnType<typeof expandQuery>>): string[] {
  const out: string[] = [];
  for (const c of (payload as any).clauses ?? []) {
    if (c?.kind !== "event") continue;
    const s = toStr((c as any).source_span);
    if (s) out.push(s);
  }
  return uniqStr(out);
}

/**
 * Primary search function using chunked indexing
 */
export async function searchDiariesSemanticChunked(
  userQuery: string,
  opts: {
    userId?: string;
    mode?: "wide" | "strict";
    scope?: "mine" | "others" | "all";
    method?: "normal" | "vector" | "hybrid";
    size?: number;
    from?: number;
  } = {}
): Promise<SearchHit[]> {
  if (!es) return [];

  const { 
    userId = "", 
    mode = "wide", 
    scope = "all", 
    method = "normal",
    size = 20,
    from = 0
  } = opts;

  if (!userQuery.trim()) return [];

  try {
    // Build base query filters
    const filters: any[] = [];
    
    if (scope === "mine" && userId) {
      filters.push({ term: { userId } });
    } else if (scope === "others" && userId) {
      filters.push({
        bool: {
          must_not: [{ term: { userId } }]
        }
      });
    }

    let query: any;

    if (method === "vector") {
      // Pure vector search (embedding cached)
      const vec = await getEmbedding(userQuery);
      query = {
        bool: {
          must: [
            {
              knn: {
                field: "vec",
                query_vector: vec,
                k: size * 2,
                num_candidates: 100,
              }
            }
          ],
          filter: filters
        }
      };
    } else if (method === "hybrid") {
      // Hybrid approach combining text and vector
      const vec = await getEmbedding(userQuery);
      query = {
        bool: {
          should: [
            {
              multi_match: {
                query: userQuery,
                fields: ["title^3", "content^2", "phrases_en", "inquiry_en"],
                type: "best_fields",
                fuzziness: "AUTO",
              }
            },
            {
              knn: {
                field: "vec",
                query_vector: vec,
                k: size,
                num_candidates: 50,
                boost: 0.8
              }
            }
          ],
          minimum_should_match: 1,
          filter: filters
        }
      };
    } else {
      // Normal text search with phased lexical gate + optional expansion
      let skipExpansion = false;
      const tokenCount = countQueryTokens(userQuery);
      if (CFG_DISABLE_EXP_FOR_SHORT && tokenCount <= CFG_SHORT_QUERY_MAX_TOKENS) {
        skipExpansion = true;
        METRIC_EXPANSIONS_SKIPPED_SHORT++;
      }

      // Phased lexical pre-check: cheap lexical query first; if it already yields >= threshold hits, skip expensive expansion
      if (!skipExpansion && CFG_PHASED) {
        METRIC_PHASED_LEXICAL_ATTEMPTS++;
        try {
          const lexicalGateQuery = buildSimpleLexicalQuery(userQuery);
          const gateResult = await searchChunkedDiaries(lexicalGateQuery, {
            size: CFG_LEXICAL_THRESHOLD,
            from: 0,
            aggregateChunks: true
          });
            if ((gateResult.hits?.length || 0) >= CFG_LEXICAL_THRESHOLD) {
              skipExpansion = true;
              METRIC_PHASED_LEXICAL_BYPASS++;
              query = lexicalGateQuery; // reuse gate query (already good enough)
            }
        } catch (e) {
          // Non-fatal
          console.warn("[DiarySearch] lexical gate failed", e);
        }
      }

      if (!skipExpansion) {
        try {
          const expanded = await getExpanded(userQuery);
          await logQueryExpansion({ rawQuery: userQuery, payload: expanded, userId, mode });
          const actions = getActionTokensFromClauses(expanded);
          const entities = ensureStrArray((expanded as any).entities);
          const spans = getEventSpans(expanded);

          const textQuery = {
            bool: {
              should: [
                {
                  multi_match: {
                    query: userQuery,
                    fields: ["title^3", "content^2"],
                    type: "best_fields",
                    fuzziness: "AUTO",
                    boost: 2.0
                  }
                },
                ...(entities.length > 0 ? [{ terms: { entities, boost: 1.5 } }] : []),
                ...(actions.length > 0 ? [{ terms: { actions, boost: 1.8 } }] : []),
                ...(spans.length > 0 ? [{
                  multi_match: {
                    query: spans.join(" "),
                    fields: ["phrases_en", "inquiry_en"],
                    type: "phrase",
                    boost: 1.3
                  }
                }] : []),
                {
                  multi_match: {
                    query: buildFallbackQuery(userQuery, spans, actions, entities, []),
                    fields: ["content", "title", "phrases_en"],
                    type: "cross_fields",
                    fuzziness: "AUTO",
                    boost: 0.8
                  }
                }
              ],
              minimum_should_match: 1,
              filter: filters
            }
          };
          query = textQuery;
        } catch (err) {
          console.warn("[DiarySearch] Query expansion failed, falling back to simple search:", err);
        }
      }

      if (!query) {
        // Fallback simple lexical query (no expansion)
        query = {
          bool: {
            must: [
              {
                multi_match: {
                  query: userQuery,
                  fields: ["title^3", "content^2", "phrases_en"],
                  type: "best_fields",
                  fuzziness: "AUTO"
                }
              }
            ],
            filter: filters
          }
        };
      }
    }

    // Use chunked search function from diaryChunkedIndexing service
  const result = await searchChunkedDiaries(query, {
      size,
      from,
      aggregateChunks: true // Group chunks back into diaries
    });

    return result.hits;

  } catch (err) {
  console.error("[DiarySearch] Search failed:", err);
    return [];
  }
}

/**
 * Semantic + lexical diary search with chunking support
 */
export async function searchDiariesSemantic(
  userQuery: string,
  opts?: {
    mode?: "wide" | "strict";
    scope?: "mine" | "others" | "all";
    userId?: string | null;
    method?: "normal" | "vector" | "hybrid";
    size?: number;
    from?: number;
    logMeta?: { userId?: string | null; ip?: string | null; ua?: string | null } | null;
  }
): Promise<SearchHit[]> {
  // Use new chunked search system
  const primary = await searchDiariesSemanticChunked(userQuery, {
    userId: opts?.userId || "",
    mode: opts?.mode || "wide",
    scope: opts?.scope || "all",
    method: opts?.method || "normal",
    size: opts?.size || 20,
    from: opts?.from || 0,
  });

  // If we already have hits, return them
  if (primary.length) return primary;

  // Fallback: simple lexical search (broad) for Arabic queries that failed semantically
  const looksArabic = /[\u0600-\u06FF]/.test(userQuery);
  if (!looksArabic) return primary; // only apply fallback for Arabic

  try {
    const simplified = normalizeArabic(userQuery).split(/\s+/).filter(Boolean);
    if (!simplified.length) return primary;

    // Build a should query with wildcards & match_phrases
    const should: any[] = [];
    for (const token of simplified) {
      // Skip very short tokens
      if (token.length < 2) continue;
      should.push({ wildcard: { content: `*${escapeWildcard(token)}*` } });
      should.push({ wildcard: { title: `*${escapeWildcard(token)}*` } });
      should.push({ match_phrase: { content: { query: token, slop: 2 } } });
    }
    // Also attempt full simplified string as phrase
    const fullSimple = simplified.join(" ");
    if (fullSimple.length > 2) {
      should.push({ match_phrase: { content: { query: fullSimple, slop: 3 } } });
    }

    if (!should.length) return primary;

    // Direct ES search bypassing chunk aggregation for speed
  // Use require to avoid ESM extension issues under node16 resolution
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { es } = require("../lib/es");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { DIARY_INDEX } = require("./diaryIndex");
    if (!es) return primary;

    const resp = await es.search({
      index: DIARY_INDEX,
      size: opts?.size || 20,
      query: {
        bool: {
          should,
          minimum_should_match: 1,
        },
      },
      highlight: { fields: { content: {}, title: {} } },
    });

    const fallbackHits = resp.hits?.hits || [];
    if (!fallbackHits.length) return primary;

    // Tag these as fallback for frontend logic (add marker in _source)
    return fallbackHits.map((h: any) => ({
      ...h,
      _source: { ...(h._source || {}), _fallback: true },
    }));
  } catch (e) {
    console.warn("[DiarySearch] fallback Arabic lexical search failed", e);
    return primary;
  }
}

// Normalize Arabic text: remove diacritics, unify alef forms, etc.
function normalizeArabic(input: string): string {
  return input
    // remove tashkeel
    .replace(/[\u0610-\u061A\u064B-\u065F\u06D6-\u06ED]/g, "")
    // various alef forms -> ا
    .replace(/[\u0622\u0623\u0625\u0671]/g, "ا")
    // ya & alef maqsura unify
    .replace(/[\u0649\u064A]/g, "ي")
    // taa marbuta -> ه (or can map to ة; choose consistency)
    .replace(/ة/g, "ه")
    // remove tatweel
    .replace(/ـ/g, "")
    .trim();
}

function escapeWildcard(token: string): string {
  return token.replace(/[?*]/g, "");
}
