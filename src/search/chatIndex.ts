import { es } from "../lib/es";
import { pool } from "../db";
import { embedText } from "../services/embeddings";
import type { ClauseGraphPayload } from "../services/keywordExtractor";
import { getExtractionByContent } from "../services/extractions";

export const CHAT_INDEX = process.env.ES_CHAT_INDEX || "umgram_chats";
const VECTOR_DIMS = 1536;

let indexEnsured = false;

export async function ensureChatIndex() {
  if (!es || indexEnsured) return;
  const exists = await es.indices.exists({ index: CHAT_INDEX });
  if (!exists) {
    await es.indices.create({
      index: CHAT_INDEX,
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
          id:         { type: "keyword" },
          participants: { type: "keyword" },
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

const toStr = (s?: unknown) => (s ?? "").toString().trim();
const uniqLower = (arr?: string[]) =>
  Array.from(new Set((arr ?? []).map((s) => toStr(s).toLowerCase()).filter(Boolean)));

function collectActions(p: ClauseGraphPayload): string[] {
  const set = new Set<string>();
  for (const c of p.clauses ?? []) {
    // @ts-ignore
    if (c.kind !== "event") continue;
    // @ts-ignore
    const v = toStr(c.verb?.lemma || c.verb?.surface).toLowerCase();
    if (v) set.add(v);
  }
  return Array.from(set);
}

function collectEventSpans(p: ClauseGraphPayload): string[] {
  const set = new Set<string>();
  for (const c of p.clauses ?? []) {
    // @ts-ignore
    if (c.kind !== "event") continue;
    // @ts-ignore
    const s = toStr(c.source_span);
    if (s) set.add(s);
  }
  return Array.from(set);
}

function selectTimeLabel(p: ClauseGraphPayload): "past" | "present" | "future" | "unspecified" {
  const counts: Record<string, number> = { past: 0, present: 0, future: 0, unspecified: 0 };
  for (const c of p.clauses ?? []) {
    // @ts-ignore
    if (c.kind !== "event") continue;
    // @ts-ignore
    const t = (c.verb?.tense || "unspecified") as keyof typeof counts;
    counts[t as string] = (counts[t as string] ?? 0) + 1;
  }
  const order: Array<keyof typeof counts> = ["past", "present", "future"];
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
    // @ts-ignore
    if (c.kind !== "event") continue;
    // @ts-ignore
    if (c.verb?.negation) neg++; else pos++;
  }
  if (neg > 0 && pos === 0) return "negative";
  if (pos > 0 && neg === 0) return "affirmative";
  return "unspecified";
}

export async function indexChatConversation(conversationId: string, opts: { refresh?: boolean } = {}) {
  if (!es) return;
  await ensureChatIndex();

  const convSql = `SELECT id::text as id, created_at FROM direct_conversations WHERE id = $1`;
  const conv = await pool.query<{ id: string; created_at: Date }>(convSql, [conversationId]);
  if (!conv.rowCount) return;

  const partsSql = `SELECT user_id::text as user_id FROM direct_conversation_participants WHERE conversation_id = $1 ORDER BY user_id`;
  const partsRes = await pool.query<{ user_id: string }>(partsSql, [conversationId]);
  const participants = partsRes.rows.map(r => r.user_id);

  const msgsSql = `SELECT text, created_at FROM direct_messages WHERE conversation_id = $1 ORDER BY created_at ASC`;
  const msgsRes = await pool.query<{ text: string | null; created_at: Date }>(msgsSql, [conversationId]);
  const content = msgsRes.rows.map(r => toStr(r.text)).filter(Boolean).join('\n\n');
  const convCreated = conv.rows[0]?.created_at ?? new Date();
  const lastMsgCreated = msgsRes.rows.length ? (msgsRes.rows[msgsRes.rows.length - 1]?.created_at ?? convCreated) : convCreated;
  const updatedAt = lastMsgCreated;

  const title = `Chat ${conversationId}`;

  const vec = await embedText(`${title}\n${content}`);

  const payload = (await getExtractionByContent('chat', conversationId)) as any as ClauseGraphPayload | null;

  const entities   = payload ? uniqLower((payload as any).entities) : [];
  const actions    = payload ? collectActions(payload) : [];
  const attributes: string[] = [];
  const inquiry_en = payload ? toStr((payload as any).text) : '';
  const phrases_en = payload ? collectEventSpans(payload) : [];
  const sensitive_en = Array.from(new Set(actions));
  let affirmed_actions_en: string[] = payload ? uniqLower((payload as any).affirmed_actions) : [];
  let negated_actions_en:  string[] = payload ? uniqLower((payload as any).negated_actions) : [];

  if (payload && ((!affirmed_actions_en.length && !negated_actions_en.length) ||
      (affirmed_actions_en.length + negated_actions_en.length) < actions.length)) {
    const tmpAff: string[] = [];
    const tmpNeg: string[] = [];
    for (const c of (payload.clauses ?? []) as any[]) {
      // @ts-ignore
      if (c.kind !== 'event') continue;
      // @ts-ignore
      const lemma = toStr(c.verb?.lemma || c.verb?.surface).toLowerCase();
      if (!lemma) continue;
      // @ts-ignore
      if (c.verb?.negation) tmpNeg.push(lemma); else tmpAff.push(lemma);
    }
    if (!affirmed_actions_en.length) affirmed_actions_en = uniqLower(tmpAff);
    if (!negated_actions_en.length)  negated_actions_en  = uniqLower(tmpNeg);
  }

  const time_label = payload ? selectTimeLabel(payload) : 'unspecified';
  const polarity   = payload ? selectPolarity(payload)   : 'unspecified';

  await es.index({
    index: CHAT_INDEX,
    id: String(conversationId),
    document: {
      id: String(conversationId),
      participants,
      title,
      content,
  createdAt: new Date(convCreated).toISOString(),
      updatedAt: new Date(updatedAt).toISOString(),
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
    },
    refresh: opts.refresh ? 'wait_for' : false,
  });
}

export async function reindexAllChats(opts: { refresh?: boolean } = {}) {
  const { rows } = await pool.query<{ id: string }>(`SELECT id::text as id FROM direct_conversations ORDER BY id`);
  for (const r of rows) {
    await indexChatConversation(r.id, opts);
  }
}
