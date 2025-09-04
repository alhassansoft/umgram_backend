import { es } from "../lib/es";
import type { ClauseGraphPayload } from "../services/keywordExtractor";
import { embedText } from "../services/embeddings";

export const MICROBLOG_INDEX = process.env.ES_MICROBLOG_INDEX || "umgram_microblog";
const VECTOR_DIMS = 1536;

let indexEnsured = false;

export type MicroPostDoc = {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
};

/** Ensure the Elasticsearch index for microblog exists with expected mappings. */
export async function ensureMicroblogIndex() {
  if (!es || indexEnsured) return;
  const exists = await es.indices.exists({ index: MICROBLOG_INDEX });
  if (!exists) {
    await es.indices.create({
      index: MICROBLOG_INDEX,
      settings: {
        analysis: {
          analyzer: {
            en_ascii: {
              type: "custom",
              tokenizer: "standard",
              filter: ["lowercase", "asciifolding"],
            },
          },
        },
      },
      mappings: {
        properties: {
          id:        { type: "keyword" },
          userId:    { type: "keyword" },
          content:   { type: "text", analyzer: "english", fields: { std: { type: "text", analyzer: "standard" }, ascii: { type: "text", analyzer: "en_ascii" } } },
          createdAt: { type: "date" },
          updatedAt: { type: "date" },
          entities:   { type: "keyword" },
          actions:    { type: "keyword" },
          attributes: { type: "keyword" },
          inquiry_en: { type: "text", analyzer: "english" },
          time_label: { type: "keyword" },
          polarity:   { type: "keyword" },
          entities_syn_en:   { type: "keyword" },
          actions_syn_en:    { type: "keyword" },
          attributes_syn_en: { type: "keyword" },
          phrases_en: { type: "text", analyzer: "english" },
          sensitive_en: { type: "keyword" },
          negated_actions_en:  { type: "keyword" },
          affirmed_actions_en: { type: "keyword" },
          vec: { type: "dense_vector", dims: VECTOR_DIMS, index: true, similarity: "cosine" },
        },
      },
    });
  } else {
    await es.indices.putMapping({
      index: MICROBLOG_INDEX,
      properties: {
        content:   { type: "text", analyzer: "english", fields: { std: { type: "text", analyzer: "standard" }, ascii: { type: "text", analyzer: "en_ascii" } } },
        entities:   { type: "keyword" },
        actions:    { type: "keyword" },
        attributes: { type: "keyword" },
        inquiry_en: { type: "text", analyzer: "english" },
        time_label: { type: "keyword" },
        polarity:   { type: "keyword" },
        entities_syn_en:   { type: "keyword" },
        actions_syn_en:    { type: "keyword" },
        attributes_syn_en: { type: "keyword" },
        phrases_en:        { type: "text", analyzer: "english" },
        sensitive_en:      { type: "keyword" },
        negated_actions_en:  { type: "keyword" },
        affirmed_actions_en: { type: "keyword" },
        vec: { type: "dense_vector", dims: VECTOR_DIMS, index: true, similarity: "cosine" },
      },
    });
  }
  indexEnsured = true;
}

function toDoc(p: { id: string|number; userId: string; text: string; createdAt: Date|string }) : MicroPostDoc {
  return {
    id: String(p.id),
    userId: p.userId,
    content: p.text ?? "",
    createdAt: new Date(p.createdAt).toISOString(),
  };
}

export async function indexMicroPost(post: { id: string|number; userId: string; text: string; createdAt: Date|string }, opts: { refresh?: boolean } = {}) {
  if (!es) return;
  await ensureMicroblogIndex();
  await es.index({
    index: MICROBLOG_INDEX,
    id: String(post.id),
    document: toDoc(post),
    refresh: opts.refresh ? "wait_for" : false,
  });
}

// Helpers for ClauseGraphPayload → ES fields (mirroring diary)
const toStr = (s?: unknown) => (s ?? "").toString().trim();
const uniqLower = (arr?: string[]) => Array.from(new Set((arr ?? []).map((s) => toStr(s).toLowerCase()).filter(Boolean)));

function collectActions(p: ClauseGraphPayload): string[] {
  const set = new Set<string>();
  for (const c of p.clauses ?? []) {
    if (c.kind !== "event") continue;
    const v = toStr(c.verb.lemma || c.verb.surface).toLowerCase();
    if (v) set.add(v);
  }
  return Array.from(set);
}

function collectEventSpans(p: ClauseGraphPayload): string[] {
  const set = new Set<string>();
  for (const c of p.clauses ?? []) {
    if (c.kind !== "event") continue;
    const s = toStr(c.source_span);
    if (s) set.add(s);
  }
  return Array.from(set);
}

function selectTimeLabel(p: ClauseGraphPayload): "past" | "present" | "future" | "unspecified" {
  const counts = { past: 0, present: 0, future: 0, unspecified: 0 } as Record<string, number>;
  for (const c of p.clauses ?? []) {
    if (c.kind !== "event") continue;
    const t = (c.verb.tense || "unspecified");
    counts[t] = (counts[t] ?? 0) + 1;
  }
  const order: Array<keyof typeof counts> = ["past", "present", "future"] as any;
  let best: keyof typeof counts = "unspecified" as any;
  let bestCnt = 0;
  for (const k of order) { if ((counts as any)[k] > bestCnt) { best = k as any; bestCnt = (counts as any)[k]; } }
  return bestCnt ? (best as any) : "unspecified";
}

function selectPolarity(p: ClauseGraphPayload): "affirmative" | "negative" | "unspecified" {
  let neg = 0, pos = 0;
  for (const c of p.clauses ?? []) {
    if (c.kind !== "event") continue;
    if (c.verb.negation) neg++; else pos++;
  }
  if (neg > 0 && pos === 0) return "negative";
  if (pos > 0 && neg === 0) return "affirmative";
  return "unspecified";
}

export async function attachExtractionToMicroPostInES(
  post: { id: string|number; userId: string; text: string; createdAt: Date|string },
  graph: ClauseGraphPayload,
  opts: { refresh?: boolean } = {}
) {
  if (!es) return;
  await ensureMicroblogIndex();

  const vec = await embedText(`${post.text ?? ""}`);

  const entities   = uniqLower(graph.entities);
  const actions    = collectActions(graph);
  const attributes: string[] = [];
  const inquiry_en = toStr(graph.text);

  const phrases_en = collectEventSpans(graph);
  const sensitive_en = Array.from(new Set(actions));

  let affirmed_actions_en = uniqLower(graph.affirmed_actions);
  let negated_actions_en  = uniqLower(graph.negated_actions);

  if ((!affirmed_actions_en.length && !negated_actions_en.length) ||
      (affirmed_actions_en.length + negated_actions_en.length) < actions.length) {
    const tmpAff: string[] = [];
    const tmpNeg: string[] = [];
    for (const c of graph.clauses ?? []) {
      if (c.kind !== "event") continue;
      const lemma = toStr(c.verb.lemma || c.verb.surface).toLowerCase();
      if (!lemma) continue;
      if (c.verb.negation) tmpNeg.push(lemma); else tmpAff.push(lemma);
    }
    if (!affirmed_actions_en.length) affirmed_actions_en = uniqLower(tmpAff);
    if (!negated_actions_en.length)  negated_actions_en  = uniqLower(tmpNeg);
  }

  // control-verb expansion like diary
  const CONTROL_VERBS = new Set(["want", "try", "plan", "decide", "hope", "need", "like", "dislike", "avoid", "refuse", "intend", "prefer"]);
  function extractInfinitivesFromClause(c: any): string[] {
    const out: string[] = [];
    for (const o of (c.objects ?? [])) {
      const s = toStr(o).toLowerCase();
      const m = s.match(/\bto\s+([a-z]+)\b/);
      if (m && m[1]) out.push(m[1]);
    }
    const span = toStr((c as any).source_span).toLowerCase();
    const m2 = span.match(/\bto\s+([a-z]+)\b/);
    if (m2 && m2[1]) out.push(m2[1]);
    return Array.from(new Set(out));
  }
  for (const c of graph.clauses ?? []) {
    if (c.kind !== "event") continue;
    const lemma = toStr(c.verb.lemma || c.verb.surface).toLowerCase();
    if (!CONTROL_VERBS.has(lemma)) continue;
    const infs = extractInfinitivesFromClause(c);
    if (!infs.length) continue;
    if (c.verb.negation) { negated_actions_en = uniqLower([...(negated_actions_en || []), ...infs]); }
    else { affirmed_actions_en = uniqLower([...(affirmed_actions_en || []), ...infs]); }
  }

  const time_label = selectTimeLabel(graph);
  const polarity   = selectPolarity(graph);

  await es.update({
    index: MICROBLOG_INDEX,
    id: String(post.id),
    doc_as_upsert: true,
    refresh: opts.refresh ? "wait_for" : false,
    doc: {
      ...toDoc(post),
      entities,
      actions,
      attributes,
      inquiry_en,
      time_label,
      polarity,
      entities_syn_en:   [],
      actions_syn_en:    [],
      attributes_syn_en: [],
      phrases_en,
      sensitive_en,
      negated_actions_en,
      affirmed_actions_en,
      vec,
      updatedAt: new Date().toISOString(),
    },
  });
}
