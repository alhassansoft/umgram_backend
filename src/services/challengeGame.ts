import OpenAI from "openai";
import Ajv from "ajv";
import { createHmac, randomBytes } from "crypto";

const apiKey = process.env.OPENAI_API_KEY || process.env.OPEN_AI || "";
const openai = new OpenAI({ apiKey });

const ajv = new Ajv({ allErrors: true, strict: true, allowUnionTypes: true, removeAdditional: false });

function resolveChallengeModel(): string {
  return (
    process.env.CHALLENGE_MODEL ||
    process.env.OPENAI_FINETUNED_CHALLENGE_MODEL ||
    process.env.LLM_MODEL ||
    process.env.OPENAI_CHAT_MODEL ||
    "gpt-4o-mini"
  );
}

// HMAC for session tokens (do NOT expose secret)
const SESSION_KEY = process.env.CHALLENGE_SECRET_KEY || randomBytes(32).toString("hex");

type StartOutput = { secret: string; first_clue: string };
type ClueOutput = { next_clue: string };
type GuessOutput = { verdict: "correct" | "incorrect" | "close"; feedback: string };

const START_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["secret", "first_clue"],
  properties: {
    secret: { type: "string" },
    first_clue: { type: "string" },
  },
} as const;
const CLUE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["next_clue"],
  properties: { next_clue: { type: "string" } },
} as const;
const GUESS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["verdict", "feedback"],
  properties: {
    verdict: { type: "string", enum: ["correct", "incorrect", "close"] },
    feedback: { type: "string" },
  },
} as const;

const validateStart = ajv.compile(START_SCHEMA as any);
const validateClue = ajv.compile(CLUE_SCHEMA as any);
const validateGuess = ajv.compile(GUESS_SCHEMA as any);

function sign(data: string) {
  return createHmac("sha256", SESSION_KEY).update(data).digest("base64url");
}

export function createSessionToken(payload: { secret: string; topic?: string; ts?: number }) {
  const ts = payload.ts ?? Date.now();
  const obj = { secret: payload.secret, topic: payload.topic ?? null, ts };
  const data = Buffer.from(JSON.stringify(obj), "utf8").toString("base64url");
  const sig = sign(data);
  return `${data}.${sig}`;
}

export function verifySessionToken(token: string): { secret: string; topic?: string | null; ts: number } | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [data, sig] = parts as [string, string];
  if (!data || !sig) return null;
  if (sign(data) !== sig) return null;
  try {
    const obj = JSON.parse(Buffer.from(data as string, "base64url").toString("utf8"));
    return obj;
  } catch {
    return null;
  }
}

const SYSTEM = `You are a game master for a "Guess What I Mean" game. Keep secrets hidden. Give short, high-signal clues that don't reveal the secret directly.`;

export async function startChallenge(topic?: string): Promise<StartOutput> {
  if (process.env.NODE_ENV === "production" && !apiKey) {
    throw new Error("OpenAI API key missing in production");
  }
  const userTopic = topic?.toString().trim() || "any general topic";
  const model = resolveChallengeModel();
  const req = {
    model,
    temperature: 0.5,
    response_format: {
      type: "json_schema",
      json_schema: { name: "start", schema: START_SCHEMA as any, strict: true },
    },
    messages: [
      { role: "system", content: SYSTEM },
      { role: "user", content: `Pick one concise secret noun phrase (entity/object/concept) related to: "${userTopic}". Then produce the first clue (in Arabic if topic is Arabic, else same language).` },
    ],
    stream: false,
  } as OpenAI.Chat.ChatCompletionCreateParams;
  try {
    console.info("[challengeGame.start] chat request keys:", Object.keys(req as any));
    const resp = await openai.chat.completions.create(req) as OpenAI.Chat.Completions.ChatCompletion;
    const text = resp.choices?.[0]?.message?.content || "{}";
  const parsed = JSON.parse(text);
    if (!validateStart(parsed)) {
      throw new Error("Challenge start schema invalid: " + ajv.errorsText(validateStart.errors));
    }
  (parsed as any).modelUsed = model;
  return parsed as StartOutput;
  } catch (e: any) {
    console.error("[challengeGame.start] error:", { message: e?.message, status: e?.status, code: e?.code });
    throw e;
  }
}

export async function nextClue(secret: string, previousClues: string[] = [], languageHint?: string): Promise<ClueOutput> {
  const langHint = languageHint ? `Language hint: ${languageHint}` : "";
  const model = resolveChallengeModel();
  const req = {
    model,
    temperature: 0.4,
    response_format: {
      type: "json_schema",
      json_schema: { name: "clue", schema: CLUE_SCHEMA as any, strict: true },
    },
    messages: [
      { role: "system", content: SYSTEM },
      { role: "user", content: `Secret: "${secret}". Previous clues: ${JSON.stringify(previousClues)}. ${langHint}\nReturn a new short clue that narrows down the guess without naming the secret.` },
    ],
    stream: false,
  } as OpenAI.Chat.ChatCompletionCreateParams;
  try {
    console.info("[challengeGame.clue] chat request keys:", Object.keys(req as any));
    const resp = await openai.chat.completions.create(req) as OpenAI.Chat.Completions.ChatCompletion;
    const text = resp.choices?.[0]?.message?.content || "{}";
  const parsed = JSON.parse(text);
    if (!validateClue(parsed)) {
      throw new Error("Challenge clue schema invalid: " + ajv.errorsText(validateClue.errors));
    }
  (parsed as any).modelUsed = model;
  return parsed as ClueOutput;
  } catch (e: any) {
    console.error("[challengeGame.clue] error:", { message: e?.message, status: e?.status, code: e?.code });
    throw e;
  }
}

export async function checkGuess(secret: string, guess: string): Promise<GuessOutput> {
  const model = resolveChallengeModel();
  const req = {
    model,
    temperature: 0,
    response_format: {
      type: "json_schema",
      json_schema: { name: "guess", schema: GUESS_SCHEMA as any, strict: true },
    },
    messages: [
      { role: "system", content: SYSTEM },
      { role: "user", content: `Secret: "${secret}"\nGuess: "${guess}"\nReturn verdict: correct if exact or equivalent, close if semantically near, else incorrect. Provide brief feedback (Arabic if guess was Arabic).` },
    ],
    stream: false,
  } as OpenAI.Chat.ChatCompletionCreateParams;
  try {
    console.info("[challengeGame.guess] chat request keys:", Object.keys(req as any));
    const resp = await openai.chat.completions.create(req) as OpenAI.Chat.Completions.ChatCompletion;
    const text = resp.choices?.[0]?.message?.content || "{}";
  const parsed = JSON.parse(text);
    if (!validateGuess(parsed)) {
      throw new Error("Challenge guess schema invalid: " + ajv.errorsText(validateGuess.errors));
    }
  (parsed as any).modelUsed = model;
  return parsed as GuessOutput;
  } catch (e: any) {
    console.error("[challengeGame.guess] error:", { message: e?.message, status: e?.status, code: e?.code });
    throw e;
  }
}
