// src/services/embeddings.ts
import OpenAI from "openai";

const apiKey =
  process.env.OPENAI_API_KEY ||
  process.env.OPEN_AI ||
  "";

if (!apiKey) {
  console.warn("[embeddings] OPENAI_API_KEY is missing");
}

const openai = new OpenAI({ apiKey });

/** نموذج متوافق متعدد اللغات. غيّره إن أردت */
export const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || "text-embedding-3-small"; // dims = 1536 غالباً
/** استخدمه فقط لو أردت متجهًا صفريًا للنص الفارغ */
export const EMBEDDING_DIMS = 1536;

function zeroVector(n = EMBEDDING_DIMS): number[] {
  return Array.from({ length: n }, () => 0);
}

/**
 * يحسب embedding لنص واحد.
 * - عند النص الفارغ: يُرجِّع متجهًا صفريًا (للاستمرار في الأنابيب دون أخطاء).
 * - يحتوي على حراسة صارمة لمنع "Object is possibly 'undefined'".
 */
export async function embedText(text: string): Promise<number[]> {
  const input = (text ?? "").toString();
  if (!input.trim()) {
    // اختر: إمّا متجه صفري أو ارمي خطأ
    return zeroVector();
    // throw new Error("[embeddings] Cannot embed empty text");
  }

  const out = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input,
  });

  const first = out?.data?.[0];
  if (!first || !first.embedding) {
    throw new Error(`[embeddings] API returned no embedding (len=${out?.data?.length ?? 0})`);
  }

  return first.embedding as number[];
}

/**
 * (اختياري) دفعة متعددة. تُرجع مصفوفة بنفس ترتيب الإدخال.
 */
export async function embedMany(texts: string[]): Promise<number[][]> {
  const inputs = (texts ?? []).map((t) => (t ?? "").toString());
  if (inputs.length === 0) return [];

  const out = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: inputs,
  });

  const data = out?.data ?? [];
  if (data.length !== inputs.length) {
    throw new Error(
      `[embeddings] Mismatch: requested ${inputs.length}, got ${data.length}`
    );
  }

  return data.map((d, i) => {
    const emb = d?.embedding;
    if (!emb) {
      throw new Error(`[embeddings] Missing embedding at index ${i}`);
    }
    return emb as number[];
  });
}
