// src/search/diarySearch.ts
import { es } from "../lib/es";
import { DIARY_INDEX } from "./diaryIndex";
import { embedText } from "../services/embeddings";
import { expandQuery } from "../services/keywordExtractor"; // returns ClauseGraphPayload (+ optional en_simple)
import { logQueryExpansion } from "../services/queryLog";   // analysis-only logging

type SearchHit<T = any> = {
  _id: string;
  _score: number;
  _source: T;
  highlight?: Record<string, string[]>;
};

// -------------------- helpers (typed for strings) --------------------
const toStr = (s?: unknown) => (s ?? "").toString().trim();
const low  = (s?: string) => toStr(s).toLowerCase();

const ensureStrArray = (x: unknown): string[] =>
  Array.isArray(x) ? (x as unknown[]).map((v) => toStr(v)).filter(Boolean) : [];

const uniqStr = (arr: ReadonlyArray<string>): string[] => Array.from(new Set(arr));

/** Detect negation (EN; supports curly/straight apostrophes) */
function isNegatedText(q: string): boolean {
  const negEN =
    /\b(?:not|no|never|didn[’']t|don[’']t|doesn[’']t|without|failed?\s+to|avoid(?:ed|ing)?|miss(?:ed|ing)?)\b/i;
  return negEN.test(q);
}

function hasOverlap(a: Set<string>, b: Set<string>): boolean {
  for (const v of a) if (b.has(v)) return true;
  return false;
}

/** Minimal common misspelling normalization for high-impact tokens */
function getNormalizedTokens(q: string): string[] {
  const MAP: Record<string, string> = {
    futbal: "football",
    footbal: "football",
    fotball: "football",
    futbol: "football",
    dont: "don't",
    wont: "won't",
  };
  const toks = (q.toLowerCase().match(/[a-z']+/g) ?? []).filter(Boolean);
  const out = new Set<string>();
  for (const t of toks) {
    const norm = MAP[t];
    if (norm) out.add(norm);
  }
  return Array.from(out);
}

/** Compact fallback text for fuzzy multi_match */
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

/** Surface action tokens (lemma or surface) from event clauses */
function getActionTokensFromClauses(payload: Awaited<ReturnType<typeof expandQuery>>): string[] {
  const out: string[] = [];
  for (const c of (payload as any).clauses ?? []) {
    if (c?.kind !== "event") continue;
    out.push(low((c.verb?.lemma || c.verb?.surface) as string));
  }
  return uniqStr(out).filter(Boolean);
}

/** Extract infinitive verbs from control-verb patterns like "to <verb>" within objects/span */
function getInfinitivesFromControlVerbs(payload: Awaited<ReturnType<typeof expandQuery>>): string[] {
  const CONTROL = new Set([
  "want", "try", "plan", "decide", "hope", "need", "like", "dislike", "avoid", "refuse", "intend", "promise", "agree", "prefer"
  ]);
  const toInf = (s?: string) => (s ?? "").toString().toLowerCase().trim();
  const out = new Set<string>();
  for (const c of (payload as any).clauses ?? []) {
    if (c?.kind !== "event") continue;
    const lemma = toInf(c.verb?.lemma || c.verb?.surface);
    if (!lemma || !CONTROL.has(lemma)) continue;
    // scan objects for "to <verb>"
    for (const o of (c.objects ?? [])) {
      const s = toInf(o);
      const m = s.match(/\bto\s+([a-z]+)\b/);
      if (m && m[1]) out.add(m[1]);
    }
    // scan source span as fallback
    const span = toInf((c as any).source_span);
    const m2 = span.match(/\bto\s+([a-z]+)\b/);
    if (m2 && m2[1]) out.add(m2[1]);
  }
  return Array.from(out);
}

/** Exact source spans from event clauses */
function getEventSpans(payload: Awaited<ReturnType<typeof expandQuery>>): string[] {
  const out: string[] = [];
  for (const c of (payload as any).clauses ?? []) {
    if (c?.kind !== "event") continue;
    const s = toStr((c as any).source_span);
    if (s) out.push(s);
  }
  return uniqStr(out);
}

/** Majority tense across events → coarse payload time */
function selectTimeLabel(payload: Awaited<ReturnType<typeof expandQuery>>):
  "past" | "present" | "future" | "unspecified" {
  const counts: Record<"past" | "present" | "future" | "unspecified", number> =
    { past: 0, present: 0, future: 0, unspecified: 0 };
  for (const c of (payload as any).clauses ?? []) {
    if (c?.kind !== "event") continue;
    const t = (c.verb?.tense || "unspecified") as keyof typeof counts;
    counts[t] = (counts[t] ?? 0) + 1;
  }
  const order: Array<keyof typeof counts> = ["past", "present", "future"];
  let best: keyof typeof counts = "unspecified";
  let bestCnt = 0;
  for (const k of order) {
    if (counts[k] > bestCnt) {
      best = k; bestCnt = counts[k];
    }
  }
  return bestCnt ? best : "unspecified";
}

/** Overall polarity from event-level negation flags (fallback to text) */
function selectPolarity(
  payload: Awaited<ReturnType<typeof expandQuery>>,
  userQuery: string
): "affirmative" | "negative" {
  let neg = 0, pos = 0;
  for (const c of (payload as any).clauses ?? []) {
    if (c?.kind !== "event") continue;
    if (c.verb?.negation) neg++; else pos++;
  }
  if (neg > 0 && pos === 0) return "negative";
  if (pos > 0 && neg === 0) return "affirmative";
  return isNegatedText(userQuery) ? "negative" : "affirmative";
}

/** Pull EN-simple expansions (typed) if available */
function fromEnSimple(payload: any): {
  entities: string[];
  actions: string[];
  phrases: string[];
  entitySynonyms: string[];
  actionSynonyms: string[];
  paraphrases: string[];
} {
  const en = (payload?.en_simple ?? {}) as any;

  const entities = ensureStrArray(en.entities).map(low);
  const actions  = ensureStrArray(en.actions).map(low);
  const phrases  = ensureStrArray(en.phrases_en).map(toStr);
  const paraphrases = ensureStrArray(en.paraphrases).map(toStr);

  const entitySynsSet = new Set<string>();
  if (Array.isArray(en?.synsets?.entity_synsets)) {
    for (const e of en.synsets.entity_synsets) {
      const lemma = low((e?.lemma as string) ?? "");
      if (lemma) entitySynsSet.add(lemma);
      for (const s of ensureStrArray(e?.synonyms)) entitySynsSet.add(low(s));
    }
  }

  const actionSynsSet = new Set<string>();
  if (Array.isArray(en?.synsets?.action_synsets)) {
    for (const a of en.synsets.action_synsets) {
      const lemma = low((a?.lemma as string) ?? "");
      if (lemma) actionSynsSet.add(lemma);
      for (const s of ensureStrArray(a?.synonyms)) actionSynsSet.add(low(s));
    }
  }

  return {
    entities: uniqStr(entities),
    actions: uniqStr(actions),
    phrases: uniqStr(phrases),
    entitySynonyms: Array.from(entitySynsSet),
  actionSynonyms: Array.from(actionSynsSet),
  paraphrases: uniqStr(paraphrases),
  };
}

/** Main ES body (hybrid: kNN + lexical, English-only, w/ fuzziness) */
function buildMainBody(args: {
  qVec: number[];
  entitiesQ: string[];
  actionsQ: string[];
  spansQ: string[];
  paraQ: string[];
  wantPol: "affirmative" | "negative";
  payloadTime: "past" | "present" | "future" | "unspecified";
  knnFilterMust: any[];
  fallbackText: string;
  rawQuery: string;
}) {
  const {
    qVec, entitiesQ, actionsQ, spansQ, paraQ, wantPol, payloadTime, knnFilterMust, fallbackText, rawQuery,
  } = args;

  const must: any[] = [];
  if (entitiesQ.length) {
    must.push({
      bool: {
        should: [
          { terms: { entities: entitiesQ } },
          ...entitiesQ.map((e) => ({ match_phrase: { "content":    { query: e } } })),
          ...entitiesQ.map((e) => ({ match_phrase: { "title":      { query: e } } })),
          ...entitiesQ.map((e) => ({ match_phrase: { "phrases_en": { query: e } } })),
        ],
        minimum_should_match: 1,
      },
    });
  }

  const should: any[] = [];

  if (actionsQ.length) {
    should.push({ terms: { actions: actionsQ,      boost: 2.2 } });
    should.push({ terms: { sensitive_en: actionsQ, boost: 1.8 } });

    for (const a of actionsQ) {
      should.push({ match_phrase: { "content": { query: a, boost: 2.2 } } });
      should.push({ match_phrase: { "title":   { query: a, boost: 1.8 } } });
    }

    if (wantPol === "negative") {
      should.push({ terms: { negated_actions_en: actionsQ,  boost: 2.0 } as any });
    } else {
      should.push({ terms: { affirmed_actions_en: actionsQ, boost: 2.0 } as any });
    }
  }

  for (const p of spansQ) {
    should.push({ match_phrase: { "content":   { query: p, boost: 2.6 } } });
    should.push({ match_phrase: { "phrases_en":{ query: p, boost: 1.6 } } });
  }

  // Add a light-weight paraphrase boost against content/title; keep it modest and capped
  for (const p of paraQ.slice(0, 5)) {
    should.push({ match_phrase: { "content": { query: p, boost: 1.2 } } });
    should.push({ match_phrase: { "title":   { query: p, boost: 0.8 } } });
  }

  if (payloadTime !== "unspecified") {
    should.push({ term: { time_label: { value: payloadTime, boost: 0.2 } } });
  }
  should.push({ term: { polarity: { value: wantPol, boost: 0.3 } } });

  if (fallbackText) {
    should.push({
      multi_match: {
        query: fallbackText,
        fields: [
          "title.std^1.8", "content.std^1.6",
          "title.ascii^1.8","content.ascii^1.6",
          "phrases_en^1.2",
          "inquiry_en^1.2"
        ],
        type: "best_fields",
        operator: "OR",
        fuzziness: "AUTO",
        minimum_should_match: "30%",
      },
    } as any);
  }

  // Direct fuzzy match on the original raw query to catch typos like 'futbal'
  if (rawQuery?.trim()) {
    should.push({ match: { "content.std":  { query: rawQuery, fuzziness: "AUTO", minimum_should_match: "15%", boost: 0.8 } } });
    should.push({ match: { "content.ascii":{ query: rawQuery, fuzziness: "AUTO", minimum_should_match: "15%", boost: 0.6 } } });
  should.push({ match: { "inquiry_en":   { query: rawQuery, fuzziness: "AUTO", minimum_should_match: "15%", boost: 0.6 } } });
    // Common misspelling direct catch
    if (/\bfutbal\b/i.test(rawQuery)) {
      should.push({ match: { "content":  { query: "football", fuzziness: "AUTO", boost: 0.9 } } });
      should.push({ match: { "inquiry_en":  { query: "football", fuzziness: "AUTO", boost: 0.9 } } });
    }
  }

  for (const e of entitiesQ) {
    should.push({ match: { "content.std":  { query: e, fuzziness: "AUTO", boost: 1.6 } } });
    should.push({ match: { "content.ascii":{ query: e, fuzziness: "AUTO", boost: 1.4 } } });
    should.push({ match: { "title.std":    { query: e, fuzziness: "AUTO", boost: 1.4 } } });
  should.push({ match: { "inquiry_en":   { query: e, fuzziness: "AUTO", boost: 1.2 } } });
  }
  for (const a of actionsQ) {
    should.push({ match: { "content.std":  { query: a, fuzziness: "AUTO", boost: 1.6 } } });
    should.push({ match: { "content.ascii":{ query: a, fuzziness: "AUTO", boost: 1.4 } } });
    should.push({ match: { "title.std":    { query: a, fuzziness: "AUTO", boost: 1.4 } } });
  should.push({ match: { "inquiry_en":   { query: a, fuzziness: "AUTO", boost: 1.2 } } });
  }

  return {
    min_score: 0.15,

    knn: {
      field: "vec",
      query_vector: qVec,
      k: 100,
      num_candidates: 1000,
      ...(knnFilterMust.length ? { filter: { bool: { must: knnFilterMust } } } : {}),
    },

    query: {
      bool: {
        must,
        should,
        minimum_should_match: should.length > 0 ? 1 : 0,
      },
    },

    _source: [
      "title",
      "content",
      "entities",
      "actions",
      "sensitive_en",
      "phrases_en",
      "time_label",
      "polarity",
      "updatedAt",
      "negated_actions_en",
      "affirmed_actions_en",
    ],

    highlight: {
      pre_tags: ["<mark>"],
      post_tags: ["</mark>"],
      fields: {
        title: { number_of_fragments: 0 },
        content: { fragment_size: 120, number_of_fragments: 3 },
        phrases_en: { fragment_size: 40, number_of_fragments: 5 },
      },
      require_field_match: false,
    },

    size: 20,
  };
}

/** Pure lexical fallback (no kNN, forgiving, with fuzziness) */
function buildLexicalFallbackBody(args: {
  entitiesQ: string[];
  actionsQ: string[];
  spansQ: string[];
  paraQ: string[];
  wantPol: "affirmative" | "negative";
  payloadTime: "past" | "present" | "future" | "unspecified";
  fallbackText: string;
  rawQuery: string;
}) {
  const { entitiesQ, actionsQ, spansQ, paraQ, wantPol, payloadTime, fallbackText, rawQuery } = args;

  const must: any[] = [];
  if (entitiesQ.length) {
    must.push({
      bool: {
        should: [
          { terms: { entities: entitiesQ } },
          ...entitiesQ.map((e) => ({ match: { "content.std":   { query: e, fuzziness: "AUTO" } } })),
          ...entitiesQ.map((e) => ({ match: { "content.ascii": { query: e, fuzziness: "AUTO" } } })),
          ...entitiesQ.map((e) => ({ match: { "title.std":     { query: e, fuzziness: "AUTO" } } })),
        ],
        minimum_should_match: 1,
      },
    });
  }

  const should: any[] = [];
  if (actionsQ.length) {
    should.push({ terms: { actions: actionsQ,      boost: 2.0 } });
    should.push({ terms: { sensitive_en: actionsQ, boost: 1.6 } });

    for (const a of actionsQ) {
      should.push({ match_phrase: { "content":    { query: a, boost: 2.0 } } });
      should.push({ match:        { "content.std":   { query: a, fuzziness: "AUTO", boost: 1.8 } } });
      should.push({ match:        { "content.ascii": { query: a, fuzziness: "AUTO", boost: 1.6 } } });
      should.push({ match:        { "title.std":     { query: a, fuzziness: "AUTO", boost: 1.4 } } });
    }
  }

  for (const p of spansQ) {
    should.push({ match_phrase: { "content":    { query: p, boost: 2.0 } } });
    should.push({ match_phrase: { "phrases_en": { query: p, boost: 1.4 } } });
  }

  for (const p of paraQ.slice(0, 5)) {
    should.push({ match_phrase: { "content": { query: p, boost: 1.0 } } });
    should.push({ match_phrase: { "title":   { query: p, boost: 0.6 } } });
  }

  if (payloadTime !== "unspecified") {
    should.push({ term: { time_label: { value: payloadTime, boost: 0.2 } } });
  }
  should.push({ term: { polarity: { value: wantPol, boost: 0.3 } } });

  if (fallbackText) {
    should.push({
      multi_match: {
        query: fallbackText,
        fields: [
          "title.std^1.6", "content.std^1.4",
          "title.ascii^1.6","content.ascii^1.4",
          "phrases_en^1.2",
          "inquiry_en^1.2"
        ],
        type: "best_fields",
        operator: "OR",
        fuzziness: "AUTO",
        minimum_should_match: "20%",
      },
    } as any);
  }

  // Direct fuzzy match on the original query as a catch-all in lexical fallback
  if (rawQuery?.trim()) {
    should.push({ match: { "content.std":  { query: rawQuery, fuzziness: "AUTO", minimum_should_match: "10%", boost: 0.8 } } });
    should.push({ match: { "content.ascii":{ query: rawQuery, fuzziness: "AUTO", minimum_should_match: "10%", boost: 0.6 } } });
  should.push({ match: { "inquiry_en":   { query: rawQuery, fuzziness: "AUTO", minimum_should_match: "10%", boost: 0.6 } } });
  }

  return {
    min_score: 0.0,
    query: {
      bool: {
        must,
        should,
        minimum_should_match: 0,
      },
    },
    _source: [
      "title",
      "content",
      "entities",
      "actions",
      "sensitive_en",
      "phrases_en",
      "time_label",
      "polarity",
      "updatedAt",
      "negated_actions_en",
      "affirmed_actions_en",
    ],
    highlight: {
      pre_tags: ["<mark>"],
      post_tags: ["</mark>"],
      fields: {
        title: { number_of_fragments: 0 },
        content: { fragment_size: 120, number_of_fragments: 3 },
        phrases_en: { fragment_size: 40, number_of_fragments: 5 },
      },
      require_field_match: false,
    },
    size: 20,
  };
}

/**
 * Semantic + lexical diary search (English-only) with en_simple expansions + robust fuzziness.
 */
export async function searchDiariesSemantic(
  userQuery: string,
  opts?: {
    mode?: "wide" | "strict";
    logMeta?: { userId?: string | null; ip?: string | null; ua?: string | null } | null;
  }
) {
  const mode = opts?.mode ?? "wide";
  const started = Date.now();

  // 1) Embed the raw query text
  const qVec = await embedText(userQuery);

  // 2) Query-time clause graph (+ optional en_simple)
  // Use default LLM model (GPT-5 preview if available)
  const { DEFAULT_LLM_MODEL } = await import("../services/keywordExtractor");
  const payload = await expandQuery(userQuery, { model: DEFAULT_LLM_MODEL, temperature: 0 });
  const en = fromEnSimple(payload as any);

  // 2.1) Log for analysis (best-effort)
  try {
    await logQueryExpansion({
      rawQuery: userQuery,
      payload: payload as any,
  model: DEFAULT_LLM_MODEL,
      mode,
      userId: opts?.logMeta?.userId ?? null,
      ip: opts?.logMeta?.ip ?? null,
      ua: opts?.logMeta?.ua ?? null,
      latencyMs: Date.now() - started,
    });
  } catch {
    /* ignore logging errors */
  }

  // 3) Query bags (surface + en_simple) — all string[]
  const entitiesQ: string[] = uniqStr([
    ...ensureStrArray((payload as any).entities).map(low),
    ...en.entities,
    ...en.entitySynonyms,
  ]);

  const actionsFromClauses: string[] = getActionTokensFromClauses(payload).map(low);
  const actionsFromInfinitives: string[] = getInfinitivesFromControlVerbs(payload);
  const actionsQ: string[] = uniqStr([
    ...actionsFromClauses,
    ...actionsFromInfinitives,
    ...en.actions,
    ...en.actionSynonyms,
  ]);

  const spansQ: string[] = uniqStr([
    ...getEventSpans(payload),
    ...en.phrases,
  ]);

  const paraQ: string[] = uniqStr([...en.paraphrases]);
  const normQ: string[] = getNormalizedTokens(userQuery);
  const paraAll: string[] = uniqStr([...paraQ, ...normQ]);

  // Sensitive verbs: actions bag
  const sensitiveTerms: string[] = uniqStr([...actionsQ]); // reserved if needed later

  // Time/Polarity (derived from graph; fallback to text negation)
  const payloadTime = selectTimeLabel(payload);
  const wantPol = selectPolarity(payload, userQuery);

  // Optional kNN filter by entities
  const knnFilterMust: any[] = [];
  // Normalize entity tokens to avoid over-filtering on typos/pronouns
  const PRONOUNS = new Set(["i","you","he","she","it","we","they","me","him","her","us","them"]);
  const MAP: Record<string, string> = { futbal: "football", footbal: "football", fotball: "football", futbol: "football" };
  const entsForFilter = entitiesQ
    .map((e) => MAP[e] || e)
    .filter((e) => e && e.length >= 3 && !PRONOUNS.has(e));
  if (mode === "strict" && entsForFilter.length) {
    knnFilterMust.push({
      bool: {
        should: [{ terms: { entities: entsForFilter } }],
        minimum_should_match: 1,
      },
    });
  }

  // 4) Hybrid search (kNN + lexical with fuzziness)
  const fallbackText = buildFallbackQuery(userQuery, spansQ, actionsQ, entitiesQ, [...en.phrases, ...paraAll]);

  const body = buildMainBody({
    qVec,
    entitiesQ,
    actionsQ,
    spansQ,
  paraQ: paraAll,
    wantPol,
    payloadTime,
    knnFilterMust,
  fallbackText,
  rawQuery: userQuery,
  });

  const res = await es.search<{ hits: { hits: SearchHit[] } }>({
    index: DIARY_INDEX,
    ...(body as any),
  });

  let hits = res.hits.hits;

  // 5) Strict post-filter: prefer negation-aware buckets
  if (hits.length && mode === "strict" && actionsQ.length > 0) {
    const qSensitiveAll = new Set<string>(actionsQ.map(low).filter(Boolean));

    hits = hits.filter((h) => {
      const src: any = h._source || {};

      const docPol = low(src.polarity || "");

      const docAffVerbBag = new Set<string>((src.affirmed_actions_en || []).map(low));
      const docNegVerbBag = new Set<string>((src.negated_actions_en  || []).map(low));
      const docVerbBag    = new Set<string>(
        ([...(src.actions || []), ...(src.sensitive_en || [])] as string[])
          .map(low)
          .filter(Boolean)
      );

      if (wantPol === "affirmative" && docAffVerbBag.size && hasOverlap(qSensitiveAll, docAffVerbBag)) {
        return true;
      }
      if (wantPol === "negative" && docNegVerbBag.size && hasOverlap(qSensitiveAll, docNegVerbBag)) {
        return true;
      }

      if (docPol && docPol !== wantPol) return false;
      return docVerbBag.size === 0 ? true : hasOverlap(qSensitiveAll, docVerbBag);
    });
  }

  // 6) Pure lexical fallback (no vector gate)
  if (hits.length === 0) {
    const lexBody = buildLexicalFallbackBody({
      entitiesQ,
      actionsQ,
      spansQ,
  paraQ: paraAll,
      wantPol,
      payloadTime,
  fallbackText,
  rawQuery: userQuery,
    });

    const res2 = await es.search<{ hits: { hits: SearchHit[] } }>({
      index: DIARY_INDEX,
      ...(lexBody as any),
    });

    let hits2 = res2.hits.hits;

    if (mode === "strict" && actionsQ.length > 0) {
      const qSensitiveAll = new Set<string>(actionsQ.map(low).filter(Boolean));

      hits2 = hits2.filter((h) => {
        const src: any = h._source || {};

        const docPol = low(src.polarity || "");

        const docAffVerbBag = new Set<string>((src.affirmed_actions_en || []).map(low));
        const docNegVerbBag = new Set<string>((src.negated_actions_en  || []).map(low));
        const docVerbBag    = new Set<string>(
          ([...(src.actions || []), ...(src.sensitive_en || [])] as string[])
            .map(low)
            .filter(Boolean)
        );

        if (wantPol === "affirmative" && docAffVerbBag.size && hasOverlap(qSensitiveAll, docAffVerbBag)) {
          return true;
        }
        if (wantPol === "negative" && docNegVerbBag.size && hasOverlap(qSensitiveAll, docNegVerbBag)) {
          return true;
        }

        if (docPol && docPol !== wantPol) return false;
        return docVerbBag.size === 0 ? true : hasOverlap(qSensitiveAll, docVerbBag);
      });
    }

    return hits2;
  }

  return hits;
}
