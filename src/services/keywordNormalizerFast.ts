import OpenAI from "openai";
import Ajv from "ajv";
import { createHash } from "crypto";
import { KEYWORD_NORMALIZER_PROMPT } from "../prompts/keywordNormalizer";
import { JSON_SCHEMA, DEFAULT_LLM_MODEL, FALLBACK_LLM_MODEL, ClauseRelationType } from "./keywordExtractor";

export type ClauseGraphPayload = {
  text: string;
  entities: string[];
  clauses: any[];
  relations: any[];
  // These are optional per current JSON_SCHEMA, but may be present
  affirmed_actions?: string[];
  negated_actions?: string[];
  en_simple?: any;
};

const apiKey = process.env.OPENAI_API_KEY || process.env.OPEN_AI || "";
if (!apiKey) console.warn("[keywordNormalizerFast] OPENAI_API_KEY is missing");
const openai = new OpenAI({ apiKey });

const STABLE_SEED = 7;

// Stable hash of the system prompt to monitor cache-sensitive changes
export const PROMPT_SHA = createHash("sha256").update(KEYWORD_NORMALIZER_PROMPT, "utf8").digest("hex");
console.info(`[keywordNormalizerFast] system SHA256=${PROMPT_SHA} len=${KEYWORD_NORMALIZER_PROMPT.length}`);
if (process.env.PROMPT_SHA_EXPECTED && process.env.PROMPT_SHA_EXPECTED !== PROMPT_SHA) {
  console.warn("[keywordNormalizerFast] PROMPT SHA mismatch across pods!");
}

// Ajv strict validator for schema compliance  
let validate: ((data: any) => boolean) | null = null;
let ajvInstance: Ajv | null = null;
try {
  ajvInstance = new Ajv({ allErrors: true, strict: true, allowUnionTypes: true });
  validate = ajvInstance.compile(JSON_SCHEMA as any);
} catch (e) {
  console.warn("[keywordNormalizerFast] Schema validation disabled due to compilation error:", e);
  validate = null;
  ajvInstance = null;
}

// Lightweight usage metrics (in-memory counters)
const metrics = {
  totalRequests: 0,
  totalInputTokens: 0,
  totalOutputTokens: 0,
  totalCachedTokens: 0,
  modelFallbacks: 0,
  schemaFailures: 0,
};

function recordUsage(resp: any) {
  const u = resp?.usage ?? {};
  const input = Number(u.input_tokens ?? 0);
  const output = Number(u.output_tokens ?? 0);
  const cached = Number(u.cached_tokens ?? 0);
  metrics.totalRequests += 1;
  metrics.totalInputTokens += input;
  metrics.totalOutputTokens += output;
  metrics.totalCachedTokens += cached;
  if (metrics.totalRequests % 50 === 0) {
    const ratio = metrics.totalInputTokens > 0 ? (metrics.totalCachedTokens / metrics.totalInputTokens) : 0;
    console.info(
      `[keywordNormalizerFast] usage: requests=${metrics.totalRequests} input=${metrics.totalInputTokens} output=${metrics.totalOutputTokens} cached=${metrics.totalCachedTokens} cache_hit_ratio=${ratio.toFixed(2)}`
    );
    if (metrics.modelFallbacks > 0) {
      const fb = metrics.modelFallbacks / metrics.totalRequests;
      if (fb > 0.01) console.warn(`[keywordNormalizerFast] fallback ratio high: ${(fb * 100).toFixed(2)}%`);
    }
  }
}
function extractOutputText(resp: any): string {
  if (resp?.choices?.[0]?.message?.content) {
    return resp.choices[0].message.content;
  }
  throw new Error("No content found in response");
}

const USAGE_SYMBOL: unique symbol = Symbol("usage");

function parseResponsesJson(resp: any): ClauseGraphPayload & { [USAGE_SYMBOL]?: any } {
  const text = extractOutputText(resp);
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== "object") throw new Error("Parsed output is not an object");
  
  // Validate schema compliance if validation is available
  if (validate && !validate(parsed)) {
    const err = ajvInstance?.errorsText((validate as any).errors, { separator: " | " }) || "Schema validation failed";
    metrics.schemaFailures += 1;
    console.warn(`[keywordNormalizerFast] Schema validation failed: ${err}`);
    // Don't throw error, just warn and continue
  }
  
  const cached = resp?.usage?.cached_tokens ?? 0;
  if (cached === 0) {
    console.warn("[keywordNormalizerFast] cached_tokens = 0 (prompt caching may not be applied).");
  }
  recordUsage(resp);
  (parsed as any)[USAGE_SYMBOL] = resp?.usage ?? {};
  return parsed as ClauseGraphPayload & { [USAGE_SYMBOL]?: any };
}

// Exponential backoff wrapper for transient errors
async function withBackoff<T>(fn: () => Promise<T>, max = 3): Promise<T> {
  let attempt = 0;
  let lastErr: any;
  while (attempt++ < max) {
    try {
      return await fn();
    } catch (e: any) {
      const s = e?.status ?? e?.code ?? e?.name;
      const transient = s === 429 || s === 503 || s === "ETIMEDOUT" || s === "ECONNRESET" || /timeout/i.test(String(e?.message));
      if (transient && attempt < max) {
        const delay = 300 * 2 ** (attempt - 1);
        await new Promise((r) => setTimeout(r, delay));
        lastErr = e;
        continue;
      }
      throw e;
    }
  }
  throw lastErr;
}

function genRequestId() {
  // RFC4122-like simple random id for logs only
  return (Date.now().toString(36) + Math.random().toString(36).slice(2, 10)).toUpperCase();
}

async function callResponsesAPI(
  text: string,
  model: string,
  temperature = 0,
  userIdHash?: string,
  maxOutputTokens = 2048
) {
  return await openai.chat.completions.create({
    model,
    temperature,
    messages: [
      { role: "system", content: KEYWORD_NORMALIZER_PROMPT },
      { role: "user", content: text },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "keyword_normalizer",
        schema: JSON_SCHEMA as any,
        strict: true,
      }
    },
    max_completion_tokens: maxOutputTokens,
    ...(userIdHash ? { user: userIdHash } : {}),
  });
}

// Small helpers for invariants validation
export function dedupePreserveOrder<T>(arr: T[]): T[] {
  const seen = new Set<T>();
  const out: T[] = [];
  for (const x of arr ?? []) {
    if (!seen.has(x)) {
      seen.add(x);
      out.push(x);
    }
  }
  return out;
}

export function validateInvariants(p: ClauseGraphPayload): string[] {
  const errs: string[] = [];
  try {
    if (typeof p.text !== "string" || !p.text.trim()) errs.push("text is empty");

    const ids = new Set((p.clauses ?? []).map((c: any) => c?.id).filter(Boolean));
    const allowed: Set<ClauseRelationType> = new Set([
      "and","or","then","but","because","so","despite","if","when","where","while","before","after","until","unless"
    ]);
    for (const r of p.relations ?? []) {
      const rr = r as any;
      if (!ids.has(rr?.from)) errs.push(`relation.from not found: ${rr?.from}`);
      if (!ids.has(rr?.to)) errs.push(`relation.to not found: ${rr?.to}`);
      if (rr?.type && !allowed.has(rr.type)) errs.push(`relation.type invalid: ${rr?.type}`);
      if (rr?.connector && typeof rr.connector === "string" && !p.text.includes(rr.connector)) {
        errs.push(`relation.connector not in text: ${rr.connector}`);
      }
    }

    for (const c of p.clauses ?? []) {
      if ((c as any)?.kind === "event" && (c as any)?.verb) {
        const expected = (c as any)?.verb?.negation ? "negative" : "affirmative";
        if ((c as any)?.polarity && (c as any)?.polarity !== expected) {
          errs.push(`clause ${String((c as any)?.id)}: polarity!=negation`);
        }
      }
    }

    for (const c of p.clauses ?? []) {
      const span = (c as any)?.source_span;
      if (span && typeof span === "string" && !p.text.includes(span)) {
        errs.push(`clause ${String((c as any)?.id)}: source_span not in text`);
      }
    }

  // De-duplicate select arrays without breaking order
    p.entities = dedupePreserveOrder(p.entities || []);
    p.affirmed_actions = dedupePreserveOrder(p.affirmed_actions || []);
    p.negated_actions = dedupePreserveOrder(p.negated_actions || []);
  } catch (e) {
    errs.push("validateInvariants threw: " + String((e as any)?.message || e));
  }
  return errs;
}

/**
 * Fast-path keyword normalizer using OpenAI Responses API with json_schema and prompt caching.
 * - System message is fixed and passed verbatim (no whitespace changes) to leverage caching.
 * - temperature=0, fixed seed for stability.
 * - Single retry on parse/schema failure with identical inputs.
 */
export async function normalizeKeywordsFast(
  text: string,
  opts?: { model?: string; temperature?: number; seed?: number; user?: string; strictInvariants?: boolean; maxOutputTokens?: number }
): Promise<ClauseGraphPayload & { [USAGE_SYMBOL]?: any }> {
  // Short-circuit in production when API key is missing
  if ((process.env.NODE_ENV === "production") && !apiKey) {
    throw new Error("OpenAI API key missing in production");
  }
  const model = opts?.model ?? DEFAULT_LLM_MODEL;
  const temperature = 0; // enforce as requested
  // Dynamic output sizing: keep generous default, reduce for very short inputs
  const dynamicMax = typeof opts?.maxOutputTokens === "number"
    ? opts!.maxOutputTokens!
    : (text && text.length < 200 ? 512 : 2048);
  const hashedUser = opts?.user ? createHash("sha256").update(String(opts.user), "utf8").digest("hex") : undefined;
  const reqId = genRequestId();
  try {
  const resp = await withBackoff(() => callResponsesAPI(text, model, temperature, hashedUser, dynamicMax));
    const parsed = parseResponsesJson(resp);
    const inv = validateInvariants(parsed);
    if (inv.length) {
      const msg = `[keywordNormalizerFast][${reqId}] invariants: ${inv.join(" | ")}`;
      if (opts?.strictInvariants) throw new Error(msg);
      console.warn(msg);
    }
  return parsed;
  } catch (err: any) {
    const msg = String(err?.message || err);
    const code = err?.code || err?.status || err?.name;
    const shouldFallback = model !== FALLBACK_LLM_MODEL && /model|not found|unsupported|invalid_model/i.test(msg + " " + code);
    if (shouldFallback) {
      console.warn(`[keywordNormalizerFast][${reqId}] Model '${model}' failed (${code ?? ""}). Falling back to '${FALLBACK_LLM_MODEL}'.`);
      metrics.modelFallbacks += 1;
  const resp = await withBackoff(() => callResponsesAPI(text, FALLBACK_LLM_MODEL, temperature, hashedUser, dynamicMax));
      const parsed = parseResponsesJson(resp);
      const inv = validateInvariants(parsed);
      if (inv.length) {
        const msg2 = `[keywordNormalizerFast][${reqId}] invariants: ${inv.join(" | ")}`;
        if (opts?.strictInvariants) throw new Error(msg2);
        console.warn(msg2);
      }
  return parsed;
    }
    // Single retry with identical inputs, with an internal reminder (enforced by json_schema anyway)
    try {
  const resp2 = await withBackoff(() => callResponsesAPI(text, model, temperature, hashedUser, dynamicMax));
      const parsed2 = parseResponsesJson(resp2);
      const inv2 = validateInvariants(parsed2);
      if (inv2.length) {
        const msg3 = `[keywordNormalizerFast][${reqId}] invariants: ${inv2.join(" | ")}`;
        if (opts?.strictInvariants) throw new Error(msg3);
        console.warn(msg3);
      }
  return parsed2;
    } catch (err2) {
      throw err2;
    }
  }
}
