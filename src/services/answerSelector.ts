import OpenAI from "openai";
import { ANSWER_SELECTOR_PROMPT } from "../prompts/answerSelector";
import { DEFAULT_LLM_MODEL, FALLBACK_LLM_MODEL } from "./keywordExtractor";

export type MinimalHit = {
  id: string;
  score: number;
  title?: string | null;
  content?: string | null;
  time_label?: "past" | "present" | "future" | "unspecified" | null;
  polarity?: "affirmative" | "negative" | "unspecified" | null;
  entities?: string[];
  actions?: string[];
  phrases_en?: string[];
  affirmed_actions_en?: string[];
  negated_actions_en?: string[];
  highlight?: { content?: string[]; phrases_en?: string[] };
};

export type AnswerSelectionResult = {
  question: string;
  considered_count: number;
  candidates: Array<{
    id: string;
    score: number;
    verdict: "yes" | "maybe" | "no";
    reason: string;
    evidence: { snippets: string[]; fields: string[] };
  }>;
  answers: Array<{
    id: string;
    answer_text: string;
    confidence: number;
  }>;
  final: { type: "direct" | "multi" | "none"; text: string };
};

const apiKey = process.env.OPENAI_API_KEY || process.env.OPEN_AI || "";
const baseURL =
  process.env.OPENAI_BASE_URL ||
  process.env.OPENAI_API_BASE ||
  process.env.OPENAI_BASE ||
  undefined;
if (!apiKey) console.warn("[answerSelector] OPENAI_API_KEY is missing — falling back to 'none' answers");
if (baseURL) console.warn(`[answerSelector] Using custom OpenAI baseURL: ${baseURL}`);
// Prefer custom client when baseURL is provided, keep a default fallback client too
const openaiCustom = apiKey ? new OpenAI({ apiKey, baseURL }) : (null as any);
const openaiDefault = apiKey ? new OpenAI({ apiKey }) : (null as any);

function buildNoneResult(question: string, considered = 0): AnswerSelectionResult {
  return {
    question: String(question || "").trim(),
    considered_count: considered,
    candidates: [],
    answers: [],
    final: { type: "none", text: "" },
  };
}

function toMinimal(h: any): MinimalHit | null {
  if (!h) return null;
  const id = String(h._id ?? h.id ?? "").trim();
  if (!id) return null;
  const scoreRaw = typeof h._score === "number" ? h._score : h.score;
  const score = typeof scoreRaw === "number" ? scoreRaw : 0;
  const src: any = h._source ?? h;
  const title = src.title ?? null;
  const content = src.content ?? null;
  const time_label = src.time_label ?? null;
  const polarity = src.polarity ?? null;
  const entities = Array.isArray(src.entities) ? src.entities : undefined;
  const actions = Array.isArray(src.actions) ? src.actions : undefined;
  const phrases_en = Array.isArray(src.phrases_en) ? src.phrases_en : undefined;
  const affirmed_actions_en = Array.isArray(src.affirmed_actions_en) ? src.affirmed_actions_en : undefined;
  const negated_actions_en = Array.isArray(src.negated_actions_en) ? src.negated_actions_en : undefined;
  const highlight = h.highlight ?? src.highlight ?? undefined;
  return {
    id,
    score,
    title: title != null ? String(title) : null,
    content: content != null ? String(content) : null,
    time_label,
    polarity,
    entities,
    actions,
    phrases_en,
    affirmed_actions_en,
    negated_actions_en,
    highlight,
  };
}

function tryParseJSON(s: string): any {
  try {
    return JSON.parse(s);
  } catch {
    // Try to extract JSON block from possible wrappers
    const m = s.match(/\{[\s\S]*\}$/);
    if (m) {
      try { return JSON.parse(m[0]); } catch {}
    }
    return null;
  }
}

export async function selectAnswer(
  question: string,
  hits: Array<any>,
  opts?: { model?: string; temperature?: number }
): Promise<AnswerSelectionResult> {
  if (!apiKey) {
    // No API key configured; return a safe empty result
    return buildNoneResult(question, Array.isArray(hits) ? Math.min(hits.length, 10) : 0);
  }
  const model = opts?.model ?? DEFAULT_LLM_MODEL;
  const temperature = opts?.temperature ?? 0;

  const trimmed: MinimalHit[] = (hits || [])
    .map(toMinimal)
    .filter((x): x is MinimalHit => !!x)
    .slice(0, 10);

  const payload = {
    question: String(question || "").trim(),
    hits: trimmed,
  };

  if (!payload.question) {
    throw new Error("selectAnswer: question is required");
  }

  // First try with configured/default model, then fall back to a safe model once if needed
  let completion;
  try {
    const client = baseURL ? openaiCustom : openaiDefault;
    completion = await client.chat.completions.create({
      model,
      temperature,
      messages: [
        { role: "system", content: ANSWER_SELECTOR_PROMPT },
        { role: "user", content: JSON.stringify(payload) },
      ],
    });
  } catch (err: any) {
    const msg = String(err?.message || err);
    const code = err?.code || err?.status || err?.name;
    const shouldFallback =
      model !== FALLBACK_LLM_MODEL &&
      (/model|not found|unsupported|invalid_model|invalid url/i.test(msg + " " + code) || Number(code) === 404);
    if (!shouldFallback) {
      // Any other error (network, auth, rate-limit) -> return safe empty result
      return buildNoneResult(question, trimmed.length);
    }
    console.warn(`[answerSelector] Model '${model}' failed (${code ?? ""}). Falling back to '${FALLBACK_LLM_MODEL}'.`);
    // Attempt 1: use same client (custom if provided) with fallback model
    try {
      const client1 = baseURL ? openaiCustom : openaiDefault;
      completion = await client1.chat.completions.create({
        model: FALLBACK_LLM_MODEL,
        temperature,
        messages: [
          { role: "system", content: ANSWER_SELECTOR_PROMPT },
          { role: "user", content: JSON.stringify(payload) },
        ],
      });
    } catch (err2: any) {
      const msg2 = String(err2?.message || err2);
      const code2 = err2?.code || err2?.status || err2?.name;
      console.warn(`[answerSelector] Fallback model failed on current client (${code2 ?? ""}): ${msg2}`);
      // Attempt 2: if a custom baseURL is configured, retry with default client (no baseURL)
      if (baseURL) {
        try {
          completion = await openaiDefault.chat.completions.create({
            model: FALLBACK_LLM_MODEL,
            temperature,
            messages: [
              { role: "system", content: ANSWER_SELECTOR_PROMPT },
              { role: "user", content: JSON.stringify(payload) },
            ],
          });
        } catch (err3: any) {
          console.warn(`[answerSelector] Default client also failed: ${String(err3?.message || err3)}`);
          return buildNoneResult(question, trimmed.length);
        }
      } else {
        return buildNoneResult(question, trimmed.length);
      }
    }
  }

  const content = completion.choices[0]?.message?.content || "";
  const parsed = tryParseJSON(content);
  if (!parsed) {
    return buildNoneResult(question, trimmed.length);
  }
  return parsed as AnswerSelectionResult;
}

export default selectAnswer;
