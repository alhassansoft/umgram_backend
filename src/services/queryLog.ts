// src/services/queryLog.ts (updated for Clause-Graph payload)
import crypto from "crypto";
import { pool } from "../db";
import type { ClauseGraphPayload, Clause } from "./keywordExtractor";

/* ============================
 * Types
 * ============================ */
export type TimeLabel = "past" | "present" | "future" | "unspecified";
export type PolarityLabel = "affirmative" | "negative" | "unspecified";

export type LogQueryArgs = {
  rawQuery: string;
  payload: ClauseGraphPayload; // ← clause/event graph
  userId?: string | null;
  model?: string | null;
  mode?: string | null;          // "wide" | "strict" | etc.
  ip?: string | null;
  ua?: string | null;
  latencyMs?: number | null;
};

/* ============================
 * Helpers
 * ============================ */
const toStr = (s?: unknown) => (s ?? "").toString().trim();

/** Deduplicate while preserving original script/casing. */
function uniqSurface(a?: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const x of a ?? []) {
    const v = toStr(x);
    if (!v || seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out;
}

/** Collect verb lemmas (fallback to surface) from event clauses. */
function collectVerbLemmas(payload: ClauseGraphPayload): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const c of payload.clauses) {
    if (c.kind !== "event") continue;
    const lemma = toStr(c.verb.lemma || c.verb.surface);
    if (!lemma || seen.has(lemma)) continue;
    seen.add(lemma);
    out.push(lemma);
  }
  return out;
}

/** Count helper for coarse time label from events. */
function selectTimeLabel(payload: ClauseGraphPayload): TimeLabel {
  const counts: Record<TimeLabel, number> = {
    past: 0, present: 0, future: 0, unspecified: 0,
  };
  for (const c of payload.clauses) {
    if (c.kind !== "event") continue;
    const t = (c.verb.tense ?? "unspecified") as TimeLabel;
    counts[t] = (counts[t] ?? 0) + 1;
  }
  // prefer a non-unspecified mode
  const ordered: TimeLabel[] = ["past", "present", "future", "unspecified"];
  let best: TimeLabel = "unspecified";
  let bestCnt = 0;
  for (const k of ordered) {
    if (counts[k] > bestCnt && k !== "unspecified") {
      best = k; bestCnt = counts[k];
    }
  }
  return bestCnt > 0 ? best : "unspecified";
}

/** Coarse overall polarity from presence of negated vs non-negated events. */
function selectPolarity(payload: ClauseGraphPayload): PolarityLabel {
  let negated = 0;
  let affirmed = 0;
  for (const c of payload.clauses) {
    if (c.kind !== "event") continue;
    if (c.verb.negation) negated++;
    else affirmed++;
  }
  if (negated > 0 && affirmed === 0) return "negative";
  if (affirmed > 0 && negated === 0) return "affirmative";
  return "unspecified";
}

/* ============================
 * Main
 * ============================ */
export async function logQueryExpansion(args: LogQueryArgs): Promise<{ id: number }> {
  const {
    rawQuery,
    payload,
    userId = null,
    model = null,
    mode = null,
    ip = null,
    ua = null,
    latencyMs = null,
  } = args;

  const queryHash = crypto.createHash("sha256").update(rawQuery || "").digest("hex");

  // Arrays to persist (now surface-based; keep original script)
  const entities   = uniqSurface(payload.entities);
  const actions    = collectVerbLemmas(payload); // verb lemmas from events (same language as input)
  const attributes: string[] = [];               // not present in clause graph; keep empty for compatibility

  // Coarse labels (optional; derived from events)
  const timeLabel: TimeLabel     = selectTimeLabel(payload);
  const polarityLabel: PolarityLabel = selectPolarity(payload);

  // Store the full graph under "graph"
  const ex = {
    graph: payload,
  };

  const sql = `
    INSERT INTO query_expansions
      (user_id, raw_query, entities, actions, attributes, time_label, polarity, expansions,
       model, mode, query_hash, client_ip, user_agent, latency_ms)
    VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9,$10,$11,$12,$13,$14)
    RETURNING id
  `;

  const vals = [
    userId,
    rawQuery,
    entities,
    actions,
    attributes,
    timeLabel,
    polarityLabel,
    JSON.stringify(ex), // stores the full clause/event graph
    model,
    mode,
    queryHash,
    ip,
    ua,
    latencyMs ?? null,
  ];

  const result = await pool.query<{ id: number }>(sql, vals);
  const row = result.rows?.[0];
  if (!row) {
    throw new Error("Failed to insert query_expansions row (no row returned).");
  }
  return { id: row.id };
}
