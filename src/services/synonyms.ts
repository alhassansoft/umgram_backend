// src/services/synonyms.ts
import { pool } from "../db";

/** أبقِها لِمّة/فعل إنجليزي مفرد بدون مسافات */
function sanitizeEnglishVerbList(list?: string[]): string[] {
  const out = new Set<string>();
  for (const raw of list ?? []) {
    if (!raw) continue;
    let t = raw.toString().toLowerCase().trim();
    // خرائط تصحيح شائعة
    if (/\bnot\s+work\b/.test(t) || t === "not_work" || t === "doesnt_work" || t === "doesn't work") {
      t = "malfunction";
    }
    if (t === "broken" || t === "faulty" || t === "not-working" || t === "fail") {
      t = "malfunction";
    }
    // ارفض العبارات متعددة الكلمات/الأحرف الغريبة
    if (!/^[a-z][a-z-]{1,29}$/.test(t)) continue;
    out.add(t);
  }
  return Array.from(out);
}

function sanitizeArabicList(list?: string[]): string[] {
  const out = new Set<string>();
  for (const raw of list ?? []) {
    if (!raw) continue;
    const t = raw.toString().trim();
    if (!t) continue;
    // اترك العربية كما هي (قد تحتوي مسافات) لكن شيل التكرار
    out.add(t);
  }
  return Array.from(out);
}

export async function getActionSynonyms(canonical: string): Promise<{ en: string[]; ar: string[] }> {
  const { rows } = await pool.query<{ en: string[] | null; ar: string[] | null }>(
    `SELECT en, ar FROM action_synonyms WHERE action_canonical = $1 LIMIT 1`,
    [canonical.toLowerCase()]
  );
  const r = rows[0];
  return {
    en: r?.en ?? [],
    ar: r?.ar ?? [],
  };
}

/**
 * أضِف/ادمج المرادفات مع التنظيف، على مفتاح "فعل مرجعي" صحيح.
 * ملاحظة: لا نُنشئ مدخلات غريبة (مثل multi-word) في بنك الأفعال.
 */
export async function upsertActionSynonyms(
  canonical: string,
  enList?: string[],
  arList?: string[]
): Promise<void> {
  const key = canonical.toLowerCase().trim();
  if (!/^[a-z][a-z-]{1,29}$/.test(key)) return; // مفتاح غير صالح
  const enNew = sanitizeEnglishVerbList(enList);
  const arNew = sanitizeArabicList(arList);

  const { rows } = await pool.query<{ en: string[] | null; ar: string[] | null }>(
    `SELECT en, ar FROM action_synonyms WHERE action_canonical = $1 LIMIT 1`,
    [key]
  );
  const oldEn = rows[0]?.en ?? [];
  const oldAr = rows[0]?.ar ?? [];

  const enMerged = Array.from(new Set([...oldEn, ...enNew]));
  const arMerged = Array.from(new Set([...oldAr, ...arNew]));

  await pool.query(
    `
    INSERT INTO action_synonyms (action_canonical, en, ar, updated_at)
    VALUES ($1, $2::text[], $3::text[], now())
    ON CONFLICT (action_canonical)
    DO UPDATE SET
      en = $2::text[],
      ar = $3::text[],
      updated_at = now()
  `,
    [key, enMerged, arMerged]
  );
}

/** أداة إصلاح: نقل مرادفات من فعل قديم إلى فعل جديد (مثلاً own → malfunction) */
export async function reassignActionSynonyms(
  oldCanonical: string,
  newCanonical: string,
  extraEn?: string[],
  extraAr?: string[]
): Promise<void> {
  const oldBank = await getActionSynonyms(oldCanonical);
  const enMerged = Array.from(new Set([...sanitizeEnglishVerbList(oldBank.en), ...sanitizeEnglishVerbList(extraEn)]));
  const arMerged = Array.from(new Set([...sanitizeArabicList(oldBank.ar), ...sanitizeArabicList(extraAr)]));

  await upsertActionSynonyms(newCanonical, enMerged, arMerged);

  // نظّف القديم (اختياري)
  await pool.query(
    `UPDATE action_synonyms
     SET en = '{}', ar = '{}', updated_at = now()
     WHERE action_canonical = $1`,
    [oldCanonical.toLowerCase()]
  );
}

/** اختيار فعل مرجعي ذكي من sensitive_en أولاً ثم من الأفعال */
export function chooseCanonicalSensitiveVerb(
  sensitiveEn?: string[],
  actionsEn?: string[]
): string | null {
  const cand = sanitizeEnglishVerbList([... (sensitiveEn ?? []), ...(actionsEn ?? [])]);
  return cand[0] || null;
}
