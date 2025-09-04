import { es } from "../lib/es";
import { NOTE_INDEX } from "./noteIndex";
import { embedText } from "../services/embeddings";
import { expandQuery, DEFAULT_LLM_MODEL } from "../services/keywordExtractor";

const low = (s?: string) => (s ?? "").toString().toLowerCase().trim();
const toStr = (s?: unknown) => (s ?? "").toString();
const uniqStr = (arr?: string[]) => Array.from(new Set((arr ?? []).map(toStr).filter(Boolean)));

function ensureStrArray(v: any): string[] {
  if (Array.isArray(v)) return v.map(toStr);
  if (typeof v === "string") return [v];
  return [];
}

function hasOverlap(a: Set<string>, b: Set<string>): boolean {
  for (const x of a) if (b.has(x)) return true;
  return false;
}

function getWordTokens(s: string): string[] {
  return (s.toLowerCase().match(/[a-z]+/g) ?? []).filter(Boolean);
}

// Load English stopwords from env STOPWORDS_EN (JSON array of strings)
function getStopwordSet(): Set<string> {
  const raw = process.env.STOPWORDS_EN;
  if (!raw) return new Set<string>();
  try {
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) {
      const out = new Set<string>();
      for (const v of arr) if (typeof v === "string") out.add(v.toLowerCase());
      return out;
    }
  } catch {
    // ignore invalid JSON
  }
  return new Set<string>();
}

function fromEnSimple(payload: any): {
  entities: string[]; actions: string[]; phrases: string[]; entitySynonyms: string[]; actionSynonyms: string[]; paraphrases: string[];
} {
  const en = (payload?.en_simple ?? {}) as any;
  const entities = ensureStrArray(en.entities).map(low);
  const actions  = ensureStrArray(en.actions).map(low);
  const phrases  = ensureStrArray(en.phrases_en).map(toStr);
  const paraphrases = ensureStrArray(en.paraphrases).map(toStr);
  const entitySyns = new Set<string>();
  if (Array.isArray(en?.synsets?.entity_synsets)) {
    for (const e of en.synsets.entity_synsets) for (const s of ensureStrArray(e?.synonyms)) entitySyns.add(low(s));
  }
  const actionSyns = new Set<string>();
  if (Array.isArray(en?.synsets?.action_synsets)) {
    for (const a of en.synsets.action_synsets) for (const s of ensureStrArray(a?.synonyms)) actionSyns.add(low(s));
  }
  return { entities: uniqStr(entities), actions: uniqStr(actions), phrases: uniqStr(phrases), entitySynonyms: Array.from(entitySyns), actionSynonyms: Array.from(actionSyns), paraphrases: uniqStr(paraphrases) };
}

function collectActionsFromClauses(payload: any): string[] {
  const out: string[] = [];
  for (const c of (payload?.clauses ?? [])) {
    if (c?.kind !== "event") continue;
    const v = toStr(c?.verb?.lemma || c?.verb?.surface).toLowerCase();
    if (v) out.push(v);
  }
  return uniqStr(out);
}

function getEventSpans(payload: any): string[] {
  const out: string[] = [];
  for (const c of (payload?.clauses ?? [])) {
    if (c?.kind !== "event") continue;
    const s = toStr(c?.source_span);
    if (s) out.push(s);
  }
  return uniqStr(out);
}

function selectTimeLabel(payload: any): "past"|"present"|"future"|"unspecified" {
  const counts: Record<string, number> = { past:0, present:0, future:0, unspecified:0 };
  for (const c of (payload?.clauses ?? [])) {
    if (c?.kind !== "event") continue;
    const t = (c?.verb?.tense ?? "unspecified") as string;
    counts[t] = (counts[t] ?? 0) + 1;
  }
  let best: any = "unspecified", bestCnt = 0;
  for (const k of ["past","present","future"]) {
    const v = counts[k] ?? 0; if (v > bestCnt) { best = k; bestCnt = v; }
  }
  return bestCnt ? best : "unspecified";
}

function selectPolarity(payload: any, userQuery: string): "affirmative"|"negative" {
  let neg=0, pos=0;
  for (const c of (payload?.clauses ?? [])) {
    if (c?.kind !== "event") continue;
    if (c?.verb?.negation) neg++; else pos++;
  }
  if (neg>0 && pos===0) return "negative";
  if (pos>0 && neg===0) return "affirmative";
  return /\b(not|don't|dont|never|no)\b/i.test(userQuery) ? "negative" : "affirmative";
}

export async function searchNotesSemantic(userQuery: string, opts?: { mode?: "wide"|"strict" }) {
  const mode = opts?.mode ?? "wide";

  const qVec = await embedText(userQuery);
  const payload = await expandQuery(userQuery, { model: DEFAULT_LLM_MODEL, temperature: 0 });
  const en = fromEnSimple(payload as any);

  const entitiesQ = uniqStr([...(payload?.entities ?? []).map(low), ...en.entities, ...en.entitySynonyms]);
  const actionsQ  = uniqStr([ ...collectActionsFromClauses(payload), ...en.actions, ...en.actionSynonyms ]);
  const spansQ    = uniqStr([ ...getEventSpans(payload), ...en.phrases ]);
  const paraQ     = uniqStr([ ...(en.paraphrases ?? []) ]);

  const wantPol = selectPolarity(payload, userQuery);
  const payloadTime = selectTimeLabel(payload);

  const should: any[] = [];
  if (entitiesQ.length) should.push({ terms: { entities: entitiesQ, boost: 1.0 } });
  if (actionsQ.length) {
    should.push({ terms: { actions: actionsQ, boost: 2.0 } });
    should.push({ terms: { affirmed_actions_en: actionsQ, boost: wantPol === 'affirmative' ? 2.0 : 0.5 } as any });
    should.push({ terms: { negated_actions_en:  actionsQ, boost: wantPol === 'negative'   ? 2.0 : 0.5 } as any });
  }
  for (const p of spansQ) {
    should.push({ match_phrase: { content: { query: p, boost: 2.0 } } });
    should.push({ match_phrase: { phrases_en: { query: p, boost: 1.2 } } });
  }
  for (const p of paraQ.slice(0,5)) {
    should.push({ match_phrase: { content: { query: p, boost: 0.8 } } });
    should.push({ match_phrase: { title:   { query: p, boost: 0.6 } } });
  }
  if (payloadTime !== "unspecified") should.push({ term: { time_label: { value: payloadTime, boost: 0.2 } } });
  should.push({ term: { polarity: { value: wantPol, boost: 0.3 } } });
  should.push({ multi_match: { query: userQuery, fields: ["title.std^1.8","content.std^1.6","title.ascii^1.6","content.ascii^1.4","phrases_en^1.2","inquiry_en^1.2"], type: "best_fields", operator: "OR", fuzziness: "AUTO", minimum_should_match: "30%" } as any });

  const body: any = {
    min_score: 0.1,
    knn: { field: "vec", query_vector: qVec, k: 100, num_candidates: 1000 },
    query: { bool: { must: [], should, minimum_should_match: 1 } },
    _source: [
      "title","content","entities","actions","sensitive_en",
      "phrases_en","time_label","polarity","updatedAt",
      "negated_actions_en","affirmed_actions_en"
    ],
    highlight: { pre_tags: ["<mark>"], post_tags: ["</mark>"], fields: { title: { number_of_fragments: 0 }, content: { fragment_size: 120, number_of_fragments: 3 }, phrases_en: { fragment_size: 40, number_of_fragments: 5 } }, require_field_match: false },
    size: 20,
  };

  const res = await es.search({ index: NOTE_INDEX, ...(body as any) });
  let hits: any[] = (res as any).hits?.hits ?? [];

  if (hits.length && mode === 'strict' && actionsQ.length) {
    const qVerb = new Set(actionsQ.map(low));
    // Attribute-like tokens from query; drop action/entity terms and stopwords
    const qTokens = new Set(getWordTokens(userQuery));
    for (const a of actionsQ) qTokens.delete(low(a));
    for (const e of entitiesQ) qTokens.delete(low(e));
    const stopset = getStopwordSet();
    if (stopset.size) for (const w of Array.from(qTokens)) if (stopset.has(w)) qTokens.delete(w);
    const qEntities = new Set<string>(entitiesQ.map(low).filter(Boolean));
    const negRe = /\b(?:not|no|never|don['’]?t|didn['’]?t|doesn['’]?t|without)\b/;

    hits = hits.filter((h) => {
      const src: any = h._source || {};
      const docPol = low(src.polarity || "");

      const docAff = new Set<string>((src.affirmed_actions_en || []).map(low));
      const docNeg = new Set<string>((src.negated_actions_en  || []).map(low));
      const docAny = new Set<string>(
        ([...(src.actions||[]), ...(src.sensitive_en||[])] as string[]).map(low).filter(Boolean)
      );

      const hasAff = docAff.size && hasOverlap(qVerb, docAff);
      const hasNeg = docNeg.size && hasOverlap(qVerb, docNeg);
      const hasAny = docAny.size && hasOverlap(qVerb, docAny);

      // Attribute negation detection like "wasn't scary"
      const docText = toStr((src.content as string) || (src.title as string) || '').toLowerCase();
      let attrNeg = false;
      if (docNeg.has('be') && qTokens.size) {
        for (const t of qTokens) {
          if (t.length < 3) continue;
          if (docText.includes(t)) { attrNeg = true; break; }
        }
      }

      // Attribute-negation precedence
      if (attrNeg) {
        if (wantPol === 'negative') return true;   // e.g., "not scary" satisfies negative intent
        if (wantPol === 'affirmative') return false; // exclude for positive "scary" intent
      }

      // Entity-aware polarity for verb-object pairs (use phrases_en primarily)
      if (qEntities.size > 0) {
        const phrases: string[] = ensureStrArray(src.phrases_en).map((s) => s.toLowerCase());
        const hasVerbIn = (s: string) => Array.from(qVerb).some((v) => s.includes(v));

        let anyAffWithEntity = false;
        let anyNegWithEntity = false;

        for (const e of Array.from(qEntities)) {
          // Scan phrases_en first
          for (const p of phrases) {
            if (!p.includes(e)) continue;
            if (!hasVerbIn(p)) continue;
            const isNeg = negRe.test(p);
            if (isNeg) anyNegWithEntity = true; else anyAffWithEntity = true;
          }

          // Fallback: scan content with a small window around the entity
          if (!anyAffWithEntity && !anyNegWithEntity && docText.includes(e)) {
            const idx = docText.indexOf(e);
            const start = Math.max(0, idx - 64);
            const end = Math.min(docText.length, idx + e.length + 64);
            const window = docText.slice(start, end);
            if (hasVerbIn(window)) {
              const isNeg = negRe.test(window);
              if (isNeg) anyNegWithEntity = true; else anyAffWithEntity = true;
            }
          }
        }

        if (wantPol === 'affirmative') {
          if (anyAffWithEntity) return true;     // explicit affirmative verb+entity evidence
          if (anyNegWithEntity) return false;    // explicit negated verb+entity → reject
          return false;                           // be strict: require entity-aligned evidence
        } else { // negative intent
          if (anyNegWithEntity) return true;     // explicit negated verb+entity evidence
          if (anyAffWithEntity) return false;    // explicit affirmative verb+entity contradicts
          return false;                           // strict: require entity-aligned evidence
        }
      }

      // Prefer polarity-aligned verb evidence
      if (wantPol === 'affirmative' && hasAff) return true;
      if (wantPol === 'negative'   && hasNeg) return true;

      // Keep if any verb overlap exists; selector can refine
      if (hasAny) return true;

      // Only reject on explicit conflicting doc polarity
      if ((docPol === 'affirmative' || docPol === 'negative') && docPol !== wantPol) return false;

      // Otherwise keep neutral/unspecified
      return true;
    });
  }

  return hits;
}
