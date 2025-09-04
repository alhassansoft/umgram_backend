// src/search/microblogSearch.ts
import { es } from "../lib/es";
import { MICROBLOG_INDEX } from "./microblogIndex";
import { expandQuery } from "../services/keywordExtractor";
import { embedText } from "../services/embeddings";

type SearchHit<T = any> = { _id: string; _score: number; _source: T; highlight?: Record<string, string[]> };
const toStr = (s?: unknown) => (s ?? "").toString().trim();
const uniq = (arr: string[]) => Array.from(new Set(arr));

export async function searchMicroblogSemantic(
  userQuery: string,
  opts?: { mode?: "wide" | "strict" }
) {
  if (!es) return [] as any[];
  const mode: "wide" | "strict" = opts?.mode === "strict" ? "strict" : "wide";

  const payload = await expandQuery(userQuery);
  const qVec = await embedText(toStr(payload.text || userQuery));

  const en: any = (payload as any)?.en_simple ?? {};
  const entitiesQ = uniq(((en.entities ?? []) as string[]).map((s: string) => s.toLowerCase().trim()).filter(Boolean));
  const actionsQ  = uniq(((en.actions ?? []) as string[]).map((s: string) => s.toLowerCase().trim()).filter(Boolean));
  const spansQ    = uniq(((en.phrases_en ?? []) as string[]).map(toStr).filter(Boolean));
  const paraQ     = uniq(((en.paraphrases ?? []) as string[]).map(toStr).filter(Boolean));

  const wantPol: "affirmative" | "negative" = (() => {
    let neg = 0, pos = 0;
    for (const c of payload.clauses ?? []) {
      if (c.kind !== "event") continue;
      if (c.verb.negation) neg++; else pos++;
    }
    if (mode === "wide") return "affirmative"; // neutral bias
    return neg > 0 && pos === 0 ? "negative" : "affirmative";
  })();

  const knn: any = {
    field: "vec",
    query_vector: qVec,
    k: 64,
    num_candidates: 256,
    filter: { match_all: {} },
  };

  const should: any[] = [];
  for (const e of entitiesQ) should.push({ term: { entities: e } });
  for (const a of actionsQ)  should.push({ term: { actions: a } });
  for (const p of spansQ)    should.push({ match_phrase: { phrases_en: { query: p, boost: 2.0 } } });
  for (const p of paraQ.slice(0, 5)) should.push({ multi_match: { query: p, fields: ["content^2"], type: "best_fields" } });
  should.push({ term: { polarity: { value: wantPol, boost: 0.3 } } });

  const fallbackText = uniq([userQuery, ...spansQ, ...actionsQ, ...entitiesQ, ...paraQ]).slice(0, 24).join(" ");
  if (fallbackText) should.push({ multi_match: { query: fallbackText, fields: ["content^2"], fuzziness: "AUTO" as any } });
  if (userQuery?.trim()) should.push({ multi_match: { query: userQuery, fields: ["content^2"], fuzziness: "AUTO" as any } });

  const body: any = {
    knn,
    query: { bool: { should, minimum_should_match: 1 } },
    size: 30,
    highlight: { fields: { content: {}, phrases_en: {} } },
    _source: [
      "id", "userId", "content", "createdAt", "entities", "actions", "phrases_en", "polarity", "time_label",
      "affirmed_actions_en", "negated_actions_en",
    ],
  };

  const result = await es.search({ index: MICROBLOG_INDEX, ...body });
  let hits = (result.hits.hits as SearchHit[]).map((h) => ({
    id: h._id,
    score: h._score,
    title: null,
    content: (h._source as any)?.content ?? null,
    time_label: (h._source as any)?.time_label ?? null,
    polarity: (h._source as any)?.polarity ?? null,
    entities: (h._source as any)?.entities ?? [],
    actions: (h._source as any)?.actions ?? [],
    phrases_en: (h._source as any)?.phrases_en ?? [],
    affirmed_actions_en: (h._source as any)?.affirmed_actions_en ?? [],
    negated_actions_en: (h._source as any)?.negated_actions_en ?? [],
    highlight: h.highlight ?? {},
  }));

  if (mode === "strict" && actionsQ.length) {
    const acts = new Set(actionsQ);
    hits = hits.filter((hit) => {
      const hasAff = (hit.affirmed_actions_en ?? []).some((a: string) => acts.has(String(a).toLowerCase()));
      const hasNeg = (hit.negated_actions_en ?? []).some((a: string) => acts.has(String(a).toLowerCase()));
      if (wantPol === "affirmative") {
        return hasAff && !hasNeg;
      } else {
        return hasNeg && !hasAff;
      }
    });
  }

  return hits;
}
