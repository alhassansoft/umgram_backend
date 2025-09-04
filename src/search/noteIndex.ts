import { es } from "../lib/es";
import type { Note } from "../models/noteModel";
import type { ClauseGraphPayload } from "../services/keywordExtractor";
import { embedText } from "../services/embeddings";

export const NOTE_INDEX = process.env.ES_NOTE_INDEX || "umgram_notes";
const VECTOR_DIMS = 1536;

let indexEnsured = false;

export async function ensureNoteIndex() {
  if (!es || indexEnsured) return;
  const exists = await es.indices.exists({ index: NOTE_INDEX });
  if (!exists) {
    await es.indices.create({
      index: NOTE_INDEX,
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
          title: {
            type: "text",
            analyzer: "english",
            fields: {
              raw:  { type: "keyword" },
              std:  { type: "text", analyzer: "standard" },
              ascii:{ type: "text", analyzer: "en_ascii" },
            },
          },
          content: {
            type: "text",
            analyzer: "english",
            fields: {
              std:  { type: "text", analyzer: "standard" },
              ascii:{ type: "text", analyzer: "en_ascii" },
            },
          },
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
  }
  indexEnsured = true;
}

function toDoc(n: Note) {
  return {
    id: String(n.id),
    userId: n.userId,
    title: n.title,
    content: n.content ?? "",
    createdAt: new Date(n.createdAt).toISOString(),
    updatedAt: new Date(n.updatedAt).toISOString(),
  };
}

export async function indexNote(note: Note, opts: { refresh?: boolean } = {}) {
  if (!es) return;
  await ensureNoteIndex();
  await es.index({ index: NOTE_INDEX, id: String(note.id), document: toDoc(note), refresh: opts.refresh ? "wait_for" : false });
}

const toStr = (s?: unknown) => (s ?? "").toString().trim();
const uniqLower = (arr?: string[]) =>
  Array.from(new Set((arr ?? []).map((s) => toStr(s).toLowerCase()).filter(Boolean)));

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
  const counts: Record<string, number> = { past: 0, present: 0, future: 0, unspecified: 0 };
  for (const c of p.clauses ?? []) {
    if (c.kind !== "event") continue;
    const t = (c.verb.tense || "unspecified") as keyof typeof counts;
    counts[t as string] = (counts[t as string] ?? 0) + 1;
  }
  const order: Array<keyof typeof counts> = ["past", "present", "future"]; // skip unspecified in tie-break
  let best: keyof typeof counts = "unspecified" as any;
  let bestCnt = 0;
  for (const k of order) {
    const val = counts[k as string] ?? 0;
    if (val > bestCnt) { best = k; bestCnt = val; }
  }
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

export async function attachExtractionToNoteInES(
  note: Note,
  graph: ClauseGraphPayload,
  opts: { refresh?: boolean } = {}
) {
  if (!es) return;
  await ensureNoteIndex();

  const vec = await embedText(`${note.title}\n${note.content ?? ""}`);

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

  const time_label = selectTimeLabel(graph);
  const polarity   = selectPolarity(graph);

  await es.update({
    index: NOTE_INDEX,
    id: String(note.id),
    doc_as_upsert: true,
    refresh: opts.refresh ? "wait_for" : false,
    doc: {
      ...toDoc(note),
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
