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
if (!apiKey) console.warn("[answerSelector] OPENAI_API_KEY is missing");
const openai = new OpenAI({ apiKey });

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
    completion = await openai.chat.completions.create({
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
    const shouldFallback = model !== FALLBACK_LLM_MODEL && /model|not found|unsupported|invalid_model/i.test(msg + " " + code);
    if (!shouldFallback) throw err;
    console.warn(`[answerSelector] Model '${model}' failed (${code ?? ""}). Falling back to '${FALLBACK_LLM_MODEL}'.`);
    completion = await openai.chat.completions.create({
      model: FALLBACK_LLM_MODEL,
      temperature,
      messages: [
        { role: "system", content: ANSWER_SELECTOR_PROMPT },
        { role: "user", content: JSON.stringify(payload) },
      ],
    });
  }

  const content = completion.choices[0]?.message?.content || "";
  const parsed = tryParseJSON(content);
  if (!parsed) {
    throw new Error("Failed to parse answer selector JSON");
  }
  return parsed as AnswerSelectionResult;
}

export default selectAnswer;
