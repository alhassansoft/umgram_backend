// src/services/extractions.ts
import crypto from "crypto";
import type { PoolClient } from "pg";
import { pool } from "../db";

import type { ClauseGraphPayload } from "./keywordExtractor";

/* ============================
 * Types (derived/aggregated labels)
 * ============================ */
export type TimeLabel = "past" | "present" | "future" | "unspecified";
export type PolarityLabel = "affirmative" | "negative" | "unspecified";

/** مدخلات الحفظ */
export type SaveExtractionArgs = {
  contentType: "diary" | "note" | "post" | "comment" | "other" | "chat";
  contentId: string | number;
  userId?: string | null;
  payload: ClauseGraphPayload;   // ← full clause/event graph
  model?: string | null;
  promptVersion?: string | null;
  inputTextForHash?: string;
};

/* ============================
 * Helpers
 * ============================ */
const toStr = (s?: unknown) => (s ?? "").toString().trim();

/** Preserve original script/casing; remove empties; dedupe while keeping order. */
const uniqSurface = (arr?: string[]) => {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const raw of arr ?? []) {
    const v = toStr(raw);
    if (!v || seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out;
};

/** Collect verb lemmas (fallback to surface) from event clauses (same language as input). */
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

/** Choose a coarse time label from event tenses. */
function selectTimeLabel(payload: ClauseGraphPayload): TimeLabel {
  const counts: Record<TimeLabel, number> = { past: 0, present: 0, future: 0, unspecified: 0 };
  for (const c of payload.clauses) {
    if (c.kind !== "event") continue;
    const t = (c.verb.tense ?? "unspecified") as TimeLabel;
    counts[t] = (counts[t] ?? 0) + 1;
  }
  const order: TimeLabel[] = ["past", "present", "future", "unspecified"];
  let best: TimeLabel = "unspecified";
  let bestCnt = 0;
  for (const k of order) {
    if (k !== "unspecified" && counts[k] > bestCnt) {
      best = k; bestCnt = counts[k];
    }
  }
  return bestCnt > 0 ? best : "unspecified";
}

/** Choose a coarse polarity from negation flags across events. */
function selectPolarity(payload: ClauseGraphPayload): PolarityLabel {
  let neg = 0, pos = 0;
  for (const c of payload.clauses) {
    if (c.kind !== "event") continue;
    if (c.verb.negation) neg++; else pos++;
  }
  if (neg > 0 && pos === 0) return "negative";
  if (pos > 0 && neg === 0) return "affirmative";
  return "unspecified";
}

/* ============================
 * حفظ/تحديث الاستخراج
 * ============================ */
export async function saveExtraction(args: SaveExtractionArgs): Promise<{ id: number }> {
  const {
    contentType,
    contentId,
    userId = null,
    payload,
    model = null,
    promptVersion = null,
    inputTextForHash = "",
  } = args;

  const idStr = String(contentId);
  const inputHash = crypto.createHash("sha256").update(inputTextForHash || "").digest("hex");

  // أساسيات للفهرسة السريعة (سطحية):
  const entities = uniqSurface(payload.entities);       // أسطح أصلية
  const actions  = collectVerbLemmas(payload);          // لِمّات الأفعال (لغة النص)
  const attributes: string[] = [];                      // لم تعد موجودة في المخطط الجديد

  // inquiry_ar كان سابقًا "سطر قصير" — الآن نحفظ النص الأصلي نفسه للحفاظ على التوافق
  const inquiry_ar = toStr(payload.text);

  // تصنيفات مشتقة من الرسوم البيانية
  const time_label: TimeLabel = selectTimeLabel(payload);
  const polarity:   PolarityLabel = selectPolarity(payload);

  // نخزن الرسم البياني كاملًا داخل raw.graph
  const rawJson = {
    graph: payload,
    // نحفظ أيضًا ملخصات حتى لو توفر الرسم البياني (تسهّل الاستهلاك لاحقًا)
    summary: {
      entities,
      actions,
      time_label,
      polarity,
      text: payload.text,
    },
  };

  let client: PoolClient | null = null;
  try {
    client = await pool.connect();
    await client.query("BEGIN");

    const upsertSql = `
      INSERT INTO entity_extractions
        (content_type, content_id, user_id,
         entities, actions, attributes, inquiry_ar,
         time_label, polarity, raw, model, prompt_version, input_hash)
      VALUES
        ($1,$2,$3,
         $4,$5,$6,$7,
         $8,$9,$10::jsonb,$11,$12,$13)
      ON CONFLICT (content_type, content_id)
      DO UPDATE SET
        user_id        = EXCLUDED.user_id,
        entities       = EXCLUDED.entities,
        actions        = EXCLUDED.actions,
        attributes     = EXCLUDED.attributes,
        inquiry_ar     = EXCLUDED.inquiry_ar,
        time_label     = EXCLUDED.time_label,
        polarity       = EXCLUDED.polarity,
        raw            = EXCLUDED.raw,
        model          = EXCLUDED.model,
        prompt_version = EXCLUDED.prompt_version,
        input_hash     = EXCLUDED.input_hash,
        updated_at     = now()
      RETURNING id
    `;

    const up = await client.query<{ id: number }>(upsertSql, [
      contentType,
      idStr,
      userId,
      entities,
      actions,
      attributes,
      inquiry_ar,
      time_label,
      polarity,
      JSON.stringify(rawJson),
      model,
      promptVersion,
      inputHash,
    ]);

    const row = up.rows?.[0];
    if (!row) throw new Error("Extraction upsert failed: no row returned");
    const extractionId = row.id;

    // فهرسة مصطلحات أساسية فقط
    await client.query(`DELETE FROM extraction_terms WHERE extraction_id = $1`, [extractionId]);

    const insertTerms = `
      INSERT INTO extraction_terms (extraction_id, kind, token)
      SELECT $1, kind, token
      FROM (
        SELECT 'entity'::text   AS kind, UNNEST($2::text[]) AS token
        UNION ALL
        SELECT 'action'::text,      UNNEST($3::text[])
        UNION ALL
        SELECT 'attribute'::text,   UNNEST($4::text[])
        UNION ALL
        SELECT 'time'::text,        UNNEST($5::text[])
        UNION ALL
        SELECT 'polarity'::text,    UNNEST($6::text[])
      ) t
      WHERE token IS NOT NULL AND token <> ''
      ON CONFLICT DO NOTHING
    `;

    const timeArr = time_label !== "unspecified" ? [time_label] : [];
    const polArr  = polarity   !== "unspecified" ? [polarity]   : [];

    await client.query(insertTerms, [extractionId, entities, actions, attributes, timeArr, polArr]);

    await client.query("COMMIT");
    return { id: extractionId };
  } catch (e) {
    if (client) await client.query("ROLLBACK");
    throw e;
  } finally {
    client?.release();
  }
}

/* ============================
 * الاسترجاع
 * ============================ */
export async function getExtractionByContent(
  contentType: "diary" | "note" | "post" | "comment" | "other" | "chat",
  contentId: string | number
): Promise<ClauseGraphPayload | null> {
  const idStr = String(contentId);
  const sql = `
    SELECT entities, actions, attributes, inquiry_ar, time_label, polarity, raw
    FROM entity_extractions
    WHERE content_type = $1 AND content_id = $2
    LIMIT 1
  `;
  const { rows } = await pool.query<{
    entities: string[] | null;
    actions: string[] | null;
    attributes: string[] | null;
    inquiry_ar: string | null;
    time_label: TimeLabel | null;
    polarity: PolarityLabel | null;
    raw: any | null; // JSONB
  }>(sql, [contentType, idStr]);

  const r = rows?.[0];
  if (!r) return null;

  // إذا كان التخزين الحديث موجودًا
  const raw = (r.raw ?? {}) as any;
  const graph = raw.graph as ClauseGraphPayload | undefined;
  if (graph && Array.isArray(graph.clauses) && Array.isArray(graph.relations)) {
    // تأكد من الحقول الأساسية + اشتق الأفعال المؤكدة/المنفية إن لم تكن موجودة
    const affirmed: string[] = [];
    const negated: string[] = [];
    for (const c of graph.clauses ?? []) {
      if ((c as any)?.kind !== "event") continue;
      const v = ((c as any).verb?.lemma || (c as any).verb?.surface || "").toString().toLowerCase();
      if (!v) continue;
      if ((c as any).verb?.negation) negated.push(v); else affirmed.push(v);
    }
    const uniqLower = (arr?: string[]) =>
      Array.from(new Set((arr ?? []).map((s) => (s ?? "").toString().toLowerCase()).filter(Boolean)));

    return {
      text: toStr(graph.text || r.inquiry_ar || ""),
      entities: uniqSurface(graph.entities ?? r.entities ?? []),
      clauses: graph.clauses,
      relations: graph.relations,
      affirmed_actions: uniqLower((graph as any).affirmed_actions?.length ? (graph as any).affirmed_actions : affirmed),
      negated_actions: uniqLower((graph as any).negated_actions?.length ? (graph as any).negated_actions : negated),
    };
  }

  // توافق رجعي: نبني مخططًا بسيطًا من الأعمدة المتاحة فقط
  const fallback: ClauseGraphPayload = {
    text: toStr(r.inquiry_ar || ""),
    entities: uniqSurface(r.entities ?? []),
    clauses: [],
    relations: [],
    affirmed_actions: [],
    negated_actions: [],
  };
  return fallback;
}
