import OpenAI from "openai";
import type { ChatCompletionMessageToolCall } from "openai/resources/chat/completions";
import { KEYWORD_NORMALIZER_PROMPT } from "../prompts/keywordNormalizer";
import { QUERY_EXPANDER_PROMPT } from "../prompts/queryExpander";

/* ============================
 * Types – Clause Graph
 * ============================ */
export type VerbTense = "past" | "present" | "future" | "unspecified";
export type ClauseRelationType =
  | "and" | "or" | "then" | "but" | "because" | "so" | "despite"
  | "if" | "when" | "where" | "while" | "before" | "after" | "until" | "unless";

export type ContextClause = {
  id: string;
  kind: "context";
  phrase: string;
  state: {
    noun: string;
    polarity: "affirmative" | "negative";
  };
};

export type EventClause = {
  id: string;
  kind: "event";
  subject: string;
  verb: {
    surface: string;
    lemma: string;
    tense: VerbTense;
    negation: boolean;
  };
  objects: string[];
  modifiers: {
    time?: string | null;
    place?: string | null;
    manner?: string | null;
    degree?: string | null;
    reason?: string | null;
    instrument?: string | null;
    recipient?: string | null;
  };
  source_span: string;
};

export type Clause = ContextClause | EventClause;

export type ClauseRelation = {
  from: string;
  to: string;
  type: ClauseRelationType;
  connector: string | null;
};

export type ClauseGraphPayload = {
  text: string;
  entities: string[];
  clauses: Clause[];
  relations: ClauseRelation[];
  affirmed_actions?: string[]; // NEW
  negated_actions?: string[];  // NEW
};

/* ============================
 * OpenAI client
 * ============================ */
const apiKey = process.env.OPENAI_API_KEY || process.env.OPEN_AI || "";
const baseURL =
  process.env.OPENAI_BASE_URL ||
  process.env.OPENAI_API_BASE ||
  process.env.OPENAI_BASE ||
  undefined;
if (!apiKey) console.warn("[keywordExtractor] OPENAI_API_KEY is missing");
if (baseURL) console.warn(`[keywordExtractor] Using custom OpenAI baseURL: ${baseURL}`);
const openai = new OpenAI({ apiKey, baseURL });

// Default LLM model (enable GPT-5 Preview for all callers unless overridden)
// Use env LLM_MODEL or OPENAI_CHAT_MODEL to override. Safe fallback is gpt-4o-mini.
export const FALLBACK_LLM_MODEL = "gpt-4o-mini" as const;
export const DEFAULT_LLM_MODEL =
  process.env.LLM_MODEL ||
  process.env.OPENAI_CHAT_MODEL ||
  // Prefer a preview GPT-5 name if present in the account; will fall back automatically if unavailable.
  "gpt-5-preview";

/* ============================
 * JSON Schema for tool calling
 * ============================ */
const STR_ARR_UNIQ = {
  type: "array",
  items: { type: "string" },
  uniqueItems: true,
} as const;

const CONTEXT_CLAUSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["id", "kind", "phrase", "state"],
  properties: {
    id: { type: "string" },
    kind: { type: "string", enum: ["context"] },
    phrase: { type: "string" },
    state: {
      type: "object",
      additionalProperties: false,
      required: ["noun", "polarity"],
      properties: {
        noun: { type: "string" },
        polarity: { type: "string", enum: ["affirmative", "negative"] },
      },
    },
  },
} as const;

const EVENT_CLAUSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["id", "kind", "subject", "verb", "objects", "modifiers", "source_span"],
  properties: {
    id: { type: "string" },
    kind: { type: "string", enum: ["event"] },
    subject: { type: "string" },
    verb: {
      type: "object",
      additionalProperties: false,
      required: ["surface", "lemma", "tense", "negation"],
      properties: {
        surface: { type: "string" },
        lemma: { type: "string" },
        tense: { type: "string", enum: ["past", "present", "future", "unspecified"] },
        negation: { type: "boolean" },
      },
    },
    objects: STR_ARR_UNIQ,
    modifiers: {
      type: "object",
      additionalProperties: false,
      properties: {
        time: { anyOf: [{ type: "string" }, { type: "null" }] },
        place: { anyOf: [{ type: "string" }, { type: "null" }] },
        manner: { anyOf: [{ type: "string" }, { type: "null" }] },
        degree: { anyOf: [{ type: "string" }, { type: "null" }] },
        reason: { anyOf: [{ type: "string" }, { type: "null" }] },
        instrument: { anyOf: [{ type: "string" }, { type: "null" }] },
        recipient: { anyOf: [{ type: "string" }, { type: "null" }] },
      },
    },
    source_span: { type: "string" },
  },
} as const;

const RELATION_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["from", "to", "type", "connector"],
  properties: {
    from: { type: "string" },
    to: { type: "string" },
    type: {
      type: "string",
      enum: [
        "and", "or", "then", "but", "because", "so", "despite",
        "if", "when", "where", "while", "before", "after", "until", "unless",
      ],
    },
    connector: { anyOf: [{ type: "string" }, { type: "null" }] },
  },
} as const;

const EN_SIMPLE_ENTITY_SYNSET_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["lemma", "synonyms", "type"],
  properties: {
    lemma: { type: "string" },
    synonyms: { type: "array", items: { type: "string" }, uniqueItems: true },
    type: { type: "string" },
  },
} as const;

const EN_SIMPLE_ACTION_SYNSET_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["lemma", "synonyms"],
  properties: {
    lemma: { type: "string" },
    synonyms: { type: "array", items: { type: "string" }, uniqueItems: true },
  },
} as const;

const EN_SIMPLE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["paraphrase", "entities", "actions", "phrases_en", "synsets"],
  properties: {
    paraphrase: { type: "string" },
    paraphrases: { type: "array", items: { type: "string" }, uniqueItems: true },
    entities: { type: "array", items: { type: "string" }, uniqueItems: true },
    actions: { type: "array", items: { type: "string" }, uniqueItems: true },
    phrases_en: { type: "array", items: { type: "string" }, uniqueItems: true },
    synsets: {
      type: "object",
      additionalProperties: false,
      required: ["entity_synsets", "action_synsets"],
      properties: {
        entity_synsets: { type: "array", items: EN_SIMPLE_ENTITY_SYNSET_SCHEMA },
        action_synsets: { type: "array", items: EN_SIMPLE_ACTION_SYNSET_SCHEMA },
      },
    },
  },
} as const;

const JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["text", "entities", "clauses", "relations"],
  properties: {
    text: { type: "string" },
    entities: STR_ARR_UNIQ,
    clauses: {
      type: "array",
      items: { oneOf: [CONTEXT_CLAUSE_SCHEMA, EVENT_CLAUSE_SCHEMA] },
    },
    relations: { type: "array", items: RELATION_SCHEMA },
    affirmed_actions: STR_ARR_UNIQ, // NEW
    negated_actions: STR_ARR_UNIQ,  // NEW
    en_simple: EN_SIMPLE_SCHEMA,
  },
} as const;

export { JSON_SCHEMA };

/* ============================
 * Helpers
 * ============================ */
const trimStr = (s?: string) => (s ?? "").toString().trim();

/** Deduplicate preserving order */
function uniqSurface(arr?: string[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const raw of arr ?? []) {
    const v = trimStr(raw);
    if (!v || seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out;
}

/** Post-normalization with fallback for affirmed/negated actions */
function postNormalizeGraph(o: ClauseGraphPayload): ClauseGraphPayload {
  const uniqLower = (arr?: string[]) =>
    Array.from(new Set((arr ?? []).map((s) => (s ?? "").toString().toLowerCase()).filter(Boolean)));

  // fallback if missing
  const affirmed: string[] = [];
  const negated: string[] = [];
  for (const c of o.clauses ?? []) {
    if (c.kind !== "event") continue;
    const lemma = (c.verb.lemma || c.verb.surface || "").toString().toLowerCase();
    if (!lemma) continue;
    if (c.verb.negation) negated.push(lemma);
    else affirmed.push(lemma);
  }

  return {
    text: trimStr(o.text),
    entities: uniqSurface(o.entities),
    clauses: Array.isArray(o.clauses) ? o.clauses : [],
    relations: Array.isArray(o.relations) ? o.relations : [],
    affirmed_actions: uniqLower(o.affirmed_actions?.length ? o.affirmed_actions : affirmed),
    negated_actions: uniqLower(o.negated_actions?.length ? o.negated_actions : negated),
  };
}

/** Tool-call type guard */
function isFunctionToolCall(
  call: ChatCompletionMessageToolCall | undefined
): call is ChatCompletionMessageToolCall & {
  type: "function";
  function: { name: string; arguments: string };
} {
  return !!call && (call as any).type === "function" && !!(call as any).function;
}

/* ============================
 * Core OpenAI call
 * ============================ */
async function runClauseGraph(
  prompt: string,
  text: string,
  opts?: { model?: string; temperature?: number }
): Promise<ClauseGraphPayload> {
  const model = opts?.model ?? DEFAULT_LLM_MODEL;
  const temperature = opts?.temperature ?? 0;

  // Try the configured/default model first, then fall back once if needed.
  let completion;
  try {
    completion = await openai.chat.completions.create({
      model,
      temperature,
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: text },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "emit_graph",
            description: "Return the clause/event graph JSON",
            parameters: JSON_SCHEMA as any,
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "emit_graph" } },
    });
  } catch (err: any) {
    const msg = String(err?.message || err);
    const code = err?.code || err?.status || err?.name;
    const shouldFallback = model !== FALLBACK_LLM_MODEL && (/model|not found|unsupported|invalid_model|invalid url/i.test(msg + " " + code) || Number(code) === 404);
    if (shouldFallback) {
      console.warn(`[keywordExtractor] Model '${model}' failed (${code ?? ""}). Falling back to '${FALLBACK_LLM_MODEL}'.`);
      completion = await openai.chat.completions.create({
        model: FALLBACK_LLM_MODEL,
        temperature,
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: text },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "emit_graph",
              description: "Return the clause/event graph JSON",
              parameters: JSON_SCHEMA as any,
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "emit_graph" } },
      });
    } else {
      throw err;
    }
  }

  const msg = completion.choices[0]?.message;
  const call = (msg?.tool_calls ?? []).find((c) => isFunctionToolCall(c));
  const args = call?.function.arguments ?? msg?.content ?? "{}";
  const parsed = JSON.parse(String(args)) as ClauseGraphPayload;

  return postNormalizeGraph(parsed);
}

/* ============================
 * Public APIs
 * ============================ */

/** Diary-time clause extractor */
export async function extractKeywords(
  text: string,
  opts?: { model?: string; temperature?: number }
): Promise<ClauseGraphPayload> {
  return runClauseGraph(KEYWORD_NORMALIZER_PROMPT, text, opts);
}

/** Query-time clause expander */
export async function expandQuery(
  text: string,
  opts?: { model?: string; temperature?: number }
): Promise<ClauseGraphPayload> {
  return runClauseGraph(QUERY_EXPANDER_PROMPT, text, opts);
}
