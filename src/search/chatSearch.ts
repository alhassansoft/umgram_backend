import { es } from "../lib/es";
import { embedText } from "../services/embeddings";
import { expandQuery, DEFAULT_LLM_MODEL } from "../services/keywordExtractor";
import { CHAT_INDEX } from "./chatIndex";

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
  return (s.toLowerCase().match(/[a-z']+/g) ?? []).filter(Boolean);
}
function getMisspellingsMap(): Record<string, string> {
  const raw = process.env.MISSPELLINGS_MAP;
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      const out: Record<string, string> = {};
      for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
        if (typeof k === "string" && typeof v === "string") out[k.toLowerCase()] = v.toLowerCase();
      }
      return out;
    }
  } catch {}
  return {};
}
function getNormalizedTokens(q: string): string[] {
  const mm = getMisspellingsMap();
  const toks = (q.toLowerCase().match(/[a-z']+/g) ?? []).filter(Boolean);
  const out = new Set<string>();
  for (const t of toks) { const norm = mm[t]; if (norm) out.add(norm); }
  return Array.from(out);
}
function buildFallbackQuery(userQuery: string, spans: string[], actions: string[], entities: string[], extraPhrases: string[]): string {
  const parts = [userQuery?.trim() || "", ...spans, ...actions, ...entities, ...extraPhrases]
    .map((s) => (s || "").trim())
    .filter(Boolean);
  return uniqStr(parts).slice(0, 24).join(" ");
}
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
  } catch {}
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

export async function searchChatsSemantic(userQuery: string, opts?: { mode?: "wide"|"strict" }) {
  const mode = opts?.mode ?? "wide";

  const qVec = await embedText(userQuery);
  const payload: any = await expandQuery(userQuery, { model: DEFAULT_LLM_MODEL, temperature: 0 });
  const en = fromEnSimple(payload as any);

  const entitiesQ = uniqStr([...(payload?.entities ?? []).map(low), ...en.entities, ...en.entitySynonyms]);
  const actionsQ  = uniqStr([ ...collectActionsFromClauses(payload), ...en.actions, ...en.actionSynonyms ]);
  const spansQ    = uniqStr([ ...getEventSpans(payload), ...en.phrases ]);
  const paraQ     = uniqStr([ ...(en.paraphrases ?? []) ]);

  const wantPol = selectPolarity(payload, userQuery);
  const payloadTime = selectTimeLabel(payload);

  const normQ: string[] = getNormalizedTokens(userQuery);
  const paraAll: string[] = uniqStr([...paraQ, ...normQ]);
  const fallbackText = buildFallbackQuery(userQuery, spansQ, actionsQ, entitiesQ, [...en.phrases, ...paraAll]);

  // Optional kNN filter by entities (strict mode only)
  const knnFilterMust: any[] = [];
  const PRONOUNS = new Set(["i","you","he","she","it","we","they","me","him","her","us","them"]);
  const misspellingsMap2 = getMisspellingsMap();
  const entsForFilter = entitiesQ
    .map((e) => (misspellingsMap2[e] || e))
    .filter((e) => e && e.length >= 3 && !PRONOUNS.has(e));
  if (mode === "strict" && entsForFilter.length) {
    knnFilterMust.push({ bool: { should: [{ terms: { entities: entsForFilter } }], minimum_should_match: 1 } });
  }

  // Build hybrid body (kNN + lexical)
  const must: any[] = [];
  if (entitiesQ.length) {
    must.push({
      bool: {
        should: [
          { terms: { entities: entitiesQ } },
          ...entitiesQ.map((e) => ({ match_phrase: { content:    { query: e } } })),
          ...entitiesQ.map((e) => ({ match_phrase: { title:      { query: e } } })),
          ...entitiesQ.map((e) => ({ match_phrase: { phrases_en: { query: e } } })),
        ],
        minimum_should_match: 1,
      },
    });
  }

  const should: any[] = [];
  if (actionsQ.length) {
    should.push({ terms: { actions: actionsQ,      boost: 2.2 } });
    should.push({ terms: { sensitive_en: actionsQ, boost: 1.8 } });
    for (const a of actionsQ) {
      should.push({ match_phrase: { content: { query: a, boost: 2.2 } } });
      should.push({ match_phrase: { title:   { query: a, boost: 1.8 } } });
    }
    if (wantPol === "negative") should.push({ terms: { negated_actions_en: actionsQ,  boost: 2.0 } as any });
    else                          should.push({ terms: { affirmed_actions_en: actionsQ, boost: 2.0 } as any });
  }
  for (const p of spansQ) {
    should.push({ match_phrase: { content:   { query: p, boost: 2.6 } } });
    should.push({ match_phrase: { phrases_en:{ query: p, boost: 1.6 } } });
  }
  for (const p of paraAll.slice(0,5)) {
    should.push({ match_phrase: { content: { query: p, boost: 1.2 } } });
    should.push({ match_phrase: { title:   { query: p, boost: 0.8 } } });
  }
  if (payloadTime !== "unspecified") should.push({ term: { time_label: { value: payloadTime, boost: 0.2 } } });
  should.push({ term: { polarity: { value: wantPol, boost: 0.3 } } });
  if (fallbackText) {
    should.push({ multi_match: { query: fallbackText, fields: ["title.std^1.8","content.std^1.6","title.ascii^1.8","content.ascii^1.6","phrases_en^1.2","inquiry_en^1.2"], type: "best_fields", operator: "OR", fuzziness: "AUTO", minimum_should_match: "30%" } as any });
  }
  if (userQuery?.trim()) {
    should.push({ match: { "content.std":  { query: userQuery, fuzziness: "AUTO", minimum_should_match: "15%", boost: 0.8 } } });
    should.push({ match: { "content.ascii":{ query: userQuery, fuzziness: "AUTO", minimum_should_match: "15%", boost: 0.6 } } });
    should.push({ match: { "inquiry_en":   { query: userQuery, fuzziness: "AUTO", minimum_should_match: "15%", boost: 0.6 } } });
  }

  const body: any = {
    min_score: 0.15,
    knn: {
      field: "vec",
      query_vector: qVec,
      k: 100,
      num_candidates: 1000,
      ...(knnFilterMust.length ? { filter: { bool: { must: knnFilterMust } } } : {}),
    },
    query: { bool: { must, should, minimum_should_match: should.length > 0 ? 1 : 0 } },
    _source: [
      "title","content","entities","actions","sensitive_en",
      "phrases_en","time_label","polarity","updatedAt",
      "negated_actions_en","affirmed_actions_en"
    ],
    highlight: { pre_tags: ["<mark>"], post_tags: ["</mark>"], fields: { title: { number_of_fragments: 0 }, content: { fragment_size: 120, number_of_fragments: 3 }, phrases_en: { fragment_size: 40, number_of_fragments: 5 } }, require_field_match: false },
    size: 20,
  };

  const res = await es.search({ index: CHAT_INDEX, ...(body as any) });
  let hits: any[] = (res as any).hits?.hits ?? [];

  if (hits.length && mode === 'strict') {
    const qVerb = new Set(actionsQ.map(low));
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

  const hasAff = qVerb.size > 0 && docAff.size && hasOverlap(qVerb, docAff);
  const hasNeg = qVerb.size > 0 && docNeg.size && hasOverlap(qVerb, docNeg);
  const hasAny = qVerb.size > 0 && docAny.size && hasOverlap(qVerb, docAny);

      const docText = toStr((src.content as string) || (src.title as string) || '').toLowerCase();
      // Attribute negation gating: if query is negative and includes attribute tokens near entities without negation → exclude
      const qAttrTokens = new Set<string>(Array.from(qTokens));
      let attrNeg = false; // negation tokens near entity window
      let attrHit = false; // attribute tokens near entity window
      if (qEntities.size > 0 && qAttrTokens.size) {
        for (const e of Array.from(qEntities)) {
          if (!docText.includes(e)) continue;
          const idx = docText.indexOf(e);
          const start = Math.max(0, idx - 64);
          const end = Math.min(docText.length, idx + e.length + 64);
          const win = docText.slice(start, end);
          for (const t of Array.from(qAttrTokens)) {
            if (t.length < 3) continue;
            if (win.includes(t)) { attrHit = true; break; }
          }
          if (/\b(?:not|no|never|without|don['’]?t|didn['’]?t|doesn['’]?t)\b/.test(win)) attrNeg = true;
          if (attrHit && attrNeg) break;
        }
      }
      if (wantPol === 'negative' && attrHit && !attrNeg) {
        return false; // attribute present near entity without negation → exclude in strict negative
      }

      if (qEntities.size > 0) {
        const phrases: string[] = ensureStrArray(src.phrases_en).map((s) => s.toLowerCase());
        const hasVerbIn = (s: string) => qVerb.size > 0 && Array.from(qVerb).some((v) => s.includes(v));

        let anyAffWithEntity = false;
        let anyNegWithEntity = false;

        for (const e of Array.from(qEntities)) {
          for (const p of phrases) {
            if (!p.includes(e)) continue;
            // If no explicit verbs in query, rely on negation tokens near entity.
            if (!hasVerbIn(p)) {
              const isNegOnly = negRe.test(p);
              if (isNegOnly) anyNegWithEntity = true; else anyAffWithEntity = true;
            } else {
              const isNeg = negRe.test(p);
              if (isNeg) anyNegWithEntity = true; else anyAffWithEntity = true;
            }
          }

          if (!anyAffWithEntity && !anyNegWithEntity && docText.includes(e)) {
            const idx = docText.indexOf(e);
            const start = Math.max(0, idx - 64);
            const end = Math.min(docText.length, idx + e.length + 64);
            const window = docText.slice(start, end);
            const isNeg = negRe.test(window);
            if (!hasVerbIn(window)) {
              if (isNeg) anyNegWithEntity = true; else anyAffWithEntity = true;
            } else {
              if (isNeg) anyNegWithEntity = true; else anyAffWithEntity = true;
            }
          }
        }

        if (wantPol === 'affirmative') {
          if (anyAffWithEntity) return true;
          if (anyNegWithEntity) return false;
          return false;
        } else {
          if (anyNegWithEntity) return true;
          if (anyAffWithEntity) return false;
          return false;
        }
      }

      // Require stronger evidence when query includes explicit actions
      if (qVerb.size > 0) {
        if (wantPol === 'affirmative') {
          // Keep only if we see the queried verb(s) in any action bag; prefer affirmed overlap
          if (hasAff || hasAny) return true;
          return false;
        } else { // negative intent
          // Keep only if negated overlap exists OR negation is near entity and any verb overlaps
          // Recompute quick negation-near-entity window
          let negNearEntity = false;
          if (qEntities.size > 0) {
            for (const e of Array.from(qEntities)) {
              if (!docText.includes(e)) continue;
              const idx = docText.indexOf(e);
              const start = Math.max(0, idx - 64);
              const end = Math.min(docText.length, idx + e.length + 64);
              if (/\b(?:not|no|never|without|don['’]?t|didn['’]?t|doesn['’]?t)\b/.test(docText.slice(start, end))) { negNearEntity = true; break; }
            }
          }
          if (hasNeg || (negNearEntity && hasAny)) return true;
          return false;
        }
      }

      // No explicit verbs in query: rely on polarity consistency and entity-level negation already handled above
      if ((docPol === 'affirmative' || docPol === 'negative') && docPol !== wantPol) return false;
      if (wantPol === 'negative') {
        // Require at least some negation token presence in the text when no verbs are specified
        if (!/\b(?:not|no|never|without|don['’]?t|didn['’]?t|doesn['’]?t)\b/.test(docText)) return false;
      }
      return true;
    });
  }

  // Lexical fallback if no hits
  if (!hits.length) {
    const must2: any[] = [];
    if (entitiesQ.length) {
      must2.push({
        bool: {
          should: [
            { terms: { entities: entitiesQ } },
            ...entitiesQ.map((e) => ({ match: { "content.std":   { query: e, fuzziness: "AUTO" } } })),
            ...entitiesQ.map((e) => ({ match: { "content.ascii": { query: e, fuzziness: "AUTO" } } })),
            ...entitiesQ.map((e) => ({ match: { "title.std":     { query: e, fuzziness: "AUTO" } } })),
          ],
          minimum_should_match: 1,
        },
      });
    }

    const should2: any[] = [];
    if (actionsQ.length) {
      should2.push({ terms: { actions: actionsQ,      boost: 2.0 } });
      should2.push({ terms: { sensitive_en: actionsQ, boost: 1.6 } });
      for (const a of actionsQ) {
        should2.push({ match_phrase: { content:    { query: a, boost: 2.0 } } });
        should2.push({ match:        { "content.std":   { query: a, fuzziness: "AUTO", boost: 1.8 } } });
        should2.push({ match:        { "content.ascii": { query: a, fuzziness: "AUTO", boost: 1.6 } } });
        should2.push({ match:        { "title.std":     { query: a, fuzziness: "AUTO", boost: 1.4 } } });
      }
    }
    for (const p of spansQ) {
      should2.push({ match_phrase: { content:    { query: p, boost: 2.0 } } });
      should2.push({ match_phrase: { phrases_en: { query: p, boost: 1.4 } } });
    }
    for (const p of paraAll.slice(0,5)) {
      should2.push({ match_phrase: { content: { query: p, boost: 1.0 } } });
      should2.push({ match_phrase: { title:   { query: p, boost: 0.6 } } });
    }
    if (payloadTime !== "unspecified") should2.push({ term: { time_label: { value: payloadTime, boost: 0.2 } } });
    should2.push({ term: { polarity: { value: wantPol, boost: 0.3 } } });
    if (fallbackText) {
      should2.push({ multi_match: { query: fallbackText, fields: ["title.std^1.6","content.std^1.4","title.ascii^1.6","content.ascii^1.4","phrases_en^1.2","inquiry_en^1.2"], type: "best_fields", operator: "OR", fuzziness: "AUTO", minimum_should_match: "20%" } as any });
    }
    if (userQuery?.trim()) {
      should2.push({ match: { "content.std":  { query: userQuery, fuzziness: "AUTO", minimum_should_match: "10%", boost: 0.8 } } });
      should2.push({ match: { "content.ascii":{ query: userQuery, fuzziness: "AUTO", minimum_should_match: "10%", boost: 0.6 } } });
      should2.push({ match: { "inquiry_en":   { query: userQuery, fuzziness: "AUTO", minimum_should_match: "10%", boost: 0.6 } } });
    }

    const lexBody: any = {
      min_score: 0.0,
      query: { bool: { must: must2, should: should2, minimum_should_match: 0 } },
      _source: [
        "title","content","entities","actions","sensitive_en",
        "phrases_en","time_label","polarity","updatedAt",
        "negated_actions_en","affirmed_actions_en"
      ],
      highlight: { pre_tags: ["<mark>"], post_tags: ["</mark>"], fields: { title: { number_of_fragments: 0 }, content: { fragment_size: 120, number_of_fragments: 3 }, phrases_en: { fragment_size: 40, number_of_fragments: 5 } }, require_field_match: false },
      size: 20,
    };

    const res2 = await es.search({ index: CHAT_INDEX, ...(lexBody as any) });
    let hits2: any[] = (res2 as any).hits?.hits ?? [];

    if (mode === 'strict') {
      const qVerb = new Set(actionsQ.map(low));
      const qTokens = new Set(getWordTokens(userQuery));
      for (const a of actionsQ) qTokens.delete(low(a));
      for (const e of entitiesQ) qTokens.delete(low(e));
      const stopset = getStopwordSet();
      if (stopset.size) for (const w of Array.from(qTokens)) if (stopset.has(w)) qTokens.delete(w);
      const qEntities = new Set<string>(entitiesQ.map(low).filter(Boolean));
      const negRe = /\b(?:not|no|never|don['’]?t|didn['’]?t|doesn['’]?t|without)\b/;

      hits2 = hits2.filter((h) => {
        const src: any = h._source || {};
        const docPol = low(src.polarity || "");
        const docAff = new Set<string>((src.affirmed_actions_en || []).map(low));
        const docNeg = new Set<string>((src.negated_actions_en  || []).map(low));
        const docAny = new Set<string>([...(src.actions||[]), ...(src.sensitive_en||[])].map(low).filter(Boolean));
        const hasAff = docAff.size && hasOverlap(qVerb, docAff);
        const hasNeg = docNeg.size && hasOverlap(qVerb, docNeg);
        const hasAny = docAny.size && hasOverlap(qVerb, docAny);
        const docText = toStr((src.content as string) || (src.title as string) || '').toLowerCase();
        // Attribute gating near entities: exclude positive attribute-only windows for negative queries
        const qAttrTokens = new Set<string>(Array.from(qTokens));
        let attrNeg = false;
        let attrHit = false;
        if (qEntities.size > 0 && qAttrTokens.size) {
          for (const e of Array.from(qEntities)) {
            if (!docText.includes(e)) continue;
            const idx = docText.indexOf(e);
            const start = Math.max(0, idx - 64);
            const end = Math.min(docText.length, idx + e.length + 64);
            const win = docText.slice(start, end);
            for (const t of Array.from(qAttrTokens)) {
              if (t.length < 3) continue;
              if (win.includes(t)) { attrHit = true; break; }
            }
            if (/\b(?:not|no|never|without|don['’]?t|didn['’]?t|doesn['’]?t)\b/.test(win)) attrNeg = true;
            if (attrHit && attrNeg) break;
          }
        }
        if (wantPol === 'negative' && attrHit && !attrNeg) return false;

        // If explicit verbs in query, prefer polarity-aligned verb overlap
        if (qVerb.size > 0) {
          if (wantPol === 'affirmative') {
            if (hasAff || hasAny) return true;
            return false;
          } else {
            // negative intent: require negated overlap or neg near entity + any verb overlap
            let negNearEntity = false;
            if (qEntities.size > 0) {
              for (const e of Array.from(qEntities)) {
                if (!docText.includes(e)) continue;
                const idx = docText.indexOf(e);
                const start = Math.max(0, idx - 64);
                const end = Math.min(docText.length, idx + e.length + 64);
                if (/\b(?:not|no|never|without|don['’]?t|didn['’]?t|doesn['’]?t)\b/.test(docText.slice(start, end))) { negNearEntity = true; break; }
              }
            }
            if (hasNeg || (negNearEntity && hasAny)) return true;
            return false;
          }
        }

        // No explicit verbs: rely on doc polarity and presence of negation tokens
        if ((docPol === 'affirmative' || docPol === 'negative') && docPol !== wantPol) return false;
        if (wantPol === 'negative' && !negRe.test(docText)) return false;
        return true;
      });
    }

    return hits2;
  }

  return hits;
}
