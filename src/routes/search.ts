// /Users/alhassanalabdli/Desktop/umgram/backend/src/routes/search.ts
import { Router, Request, Response, NextFunction } from "express";
import { es } from "../lib/es";
import type {
  QueryDslOperator,
  QueryDslQueryContainer,
} from "@elastic/elasticsearch/lib/api/types";
import { searchDiariesSemantic } from "../search/diarySearch";
import { NOTE_INDEX } from "../search/noteIndex";
import { searchNotesSemantic } from "../search/noteSearch";
import { searchChatsSemantic } from "../search/chatSearch";
import { reindexAllChats } from "../search/chatIndex";
import { selectAnswer } from "../services/answerSelector";
import { searchMicroblogSemantic } from "../search/microblogSearch";
import { prisma } from "../lib/prisma";
import { getSnapshotByRequestId, upsertSnapshot } from "../services/resultCache";
import { ensureSearchHistoryTable, insertHistory, updateHistoryByRequestId } from "../services/searchHistory";
import { createNotification, ensureNotificationsTable } from "../services/notifications";
import { requireAuth } from "../middleware/auth";

export const search = Router();

// فهارس البحث
const POSTS_INDEX = "umgram_posts";
const DIARY_INDEX = process.env.ES_DIARY_INDEX || "umgram_diarys";
const NOTE_IDX = NOTE_INDEX;

/**
 * ===============================
 *  البحث الدلالي في اليوميات (umgram_diarys)
 * ===============================
 *
 * GET /api/search?q=...&mode=wide|strict&scope=mine|others|all
 * - يستعمل محرك kNN + توسيعات ديناميكية + إبراز (highlight)
 * - mode=wide  (افتراضي): قبول كل الصيغ بدون استبعاد قطبية
 * - mode=strict: استبعاد القطبية المعاكسة عندما يكون الفعل (مثل buy) واضحًا
 */
search.get(
  "/api/search",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const q = String(req.query.q ?? "").trim();
      const modeParam = String(req.query.mode ?? "").toLowerCase();
      const mode: "wide" | "strict" = modeParam === "strict" ? "strict" : "wide";
  const scopeParam = String(req.query.scope ?? "").toLowerCase();
  const scope: "mine" | "others" | "all" = scopeParam === 'mine' ? 'mine' : scopeParam === 'others' ? 'others' : 'all';
  const userId = (req as any).user?.sub || String(req.query.userId ?? "").trim() || null;
  const matchRequestId = String(req.query.matchRequestId ?? "").trim() || null;

      if (!q) return res.json({ count: 0, hits: [], mode, scope });
      if ((scope === 'mine' || scope === 'others') && !userId) {
        return res.status(400).json({ error: "userId is required for scope=mine|others (authenticate or pass userId)" });
      }

  // Determine approved candidate (if any) for this consent request (used to unredact only that owner's docs)
  let approvedCandidateUserId: string | null = null;
  if (matchRequestId) {
    try {
      const mr = await prisma.matchRequest.findUnique({
        where: { id: matchRequestId },
        select: { id: true, status: true, requesterId: true, approvedCandidateId: true },
      });
      if (mr && mr.status === 'MATCHED' && (!userId || String(mr.requesterId) === String(userId)) && mr.approvedCandidateId) {
        const cand = await prisma.matchCandidate.findUnique({ where: { id: mr.approvedCandidateId }, select: { candidateUserId: true } });
        if (cand?.candidateUserId) approvedCandidateUserId = String(cand.candidateUserId);
      }
    } catch {
      // ignore lookup failures
    }
  }

  const hits = await searchDiariesSemantic(q, { mode, scope, userId, logMeta: { userId: userId ?? null, ip: (req.ip ?? null) as any, ua: req.get('user-agent') || null } });

  // Redact sensitive fields for other users unless consent is matched for the approved candidate
  const redact = (h: any) => ({ _id: h._id, _score: h._score, _source: { redacted: true }, highlight: undefined });
  let safeHits: any[] = hits;
  if (scope === 'others') {
    safeHits = (hits || []).map((h: any) => {
      const ownerId = String(h?._source?.userId || '');
      const unredact = approvedCandidateUserId && ownerId === approvedCandidateUserId;
      return unredact ? h : redact(h);
    });
  } else if (scope === 'all') {
    safeHits = (hits || []).map((h: any) => {
      const ownerId = String(h?._source?.userId || '');
      const isMine = userId && ownerId === String(userId);
      const isApproved = approvedCandidateUserId && ownerId === approvedCandidateUserId;
      return (isMine || isApproved) ? h : redact(h);
    });
  }

  return res.json({ count: (safeHits || []).length, hits: safeHits, mode, scope });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * ===============================
 *  البحث الدلالي في اليوميات (ES-only، بدون إخفاء/موافقة)
 * ===============================
 *
 * GET /api/search/diary?q=...&mode=wide|strict
 */
search.get(
  "/api/search/diary",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const q = String(req.query.q ?? "").trim();
      const modeParam = String(req.query.mode ?? "").toLowerCase();
      const mode: "wide" | "strict" = modeParam === "strict" ? "strict" : "wide";
  const methodParam = String(req.query.method ?? "").toLowerCase();
  const method: "normal" | "investigation" | null = methodParam === 'investigation' ? 'investigation' : methodParam === 'normal' ? 'normal' : null;
      const scopeParam = String(req.query.scope ?? "").toLowerCase();
      const scope: "mine" | "others" | "all" = scopeParam === 'mine' ? 'mine' : scopeParam === 'others' ? 'others' : 'all';
      // Identify caller for scope filtering (no redaction/consent in this ES-only endpoint)
      const authUser = (req as any).user?.sub || null;
      const userIdFromHeader = (req.get('x-user-id') || '').trim() || null;
      const userIdFromQuery = req.query.userId ? String(req.query.userId) : null;
      const userId: string | null = authUser || userIdFromHeader || userIdFromQuery;

      if (!q) return res.json({ count: 0, hits: [], mode, scope });

      // Always query ES across all; then filter client-side per scope
      const hits = await searchDiariesSemantic(q, { mode, scope: 'all', userId: null });

      let filtered = hits || [];
      if ((scope === 'mine' || scope === 'others') && !userId) {
        return res.status(400).json({ error: "userId is required for scope=mine|others (authenticate or pass userId via header/query)", mode, scope });
      }
      if (scope === 'mine' && userId) {
        filtered = filtered.filter((h: any) => String(h?._source?.userId || '') === String(userId));
      } else if (scope === 'others' && userId) {
        filtered = filtered.filter((h: any) => String(h?._source?.userId || '') !== String(userId));
      }

  return res.json({ count: filtered.length, hits: filtered, mode, scope, method });
    } catch (err) { next(err); }
  }
);

/**
 * ===============================
 *  اختيار الجواب من نتائج اليوميات (LLM)
 * ===============================
 *
 * POST /api/search/diary/answer
 * Body: { question: string, mode?: 'wide'|'strict', hits?: any[] }
 * - إن قُدمت hits فسيتم استعمالها مباشرة (يُقصّ إلى أعلى 10).
 * - وإلا سننفّذ بحث اليوميات الدلالي ثم نمرر أعلى النتائج إلى أداة الاختيار.
 *
 * GET /api/search/diary/answer?q=...&mode=wide|strict
 */
search.post(
  "/api/search/diary/answer",
  async (req: Request, res: Response, next: NextFunction) => {
    // Helper: normalize selector result to avoid consent if there's no explicit YES evidence
    function normalizeSelectorResult(r: any) {
      // Do not override LLM decisions. Only normalize formatting for the none case.
      try {
        const f = (r?.final ?? {}) as any;
        const fType = typeof f.type === 'string' ? f.type.toLowerCase() : 'none';
        if (fType === 'none') {
          const fText = typeof f.text === 'string' ? f.text.trim() : '';
          // Ensure consistent "I don't know" text when none
          r = { ...r, final: { type: 'none', text: fText || "I don't know" } };
        }
      } catch {}
      return r;
    }
    try {
      const body = req.body || {};
      const question = String(body.question ?? "").trim();
      const modeParam = String(body.mode ?? "").toLowerCase();
      const mode: "wide" | "strict" = modeParam === "strict" ? "strict" : "wide";
  const methodParam = String(body.method ?? "").toLowerCase();
  const method: "normal" | "investigation" | null = methodParam === 'investigation' ? 'investigation' : methodParam === 'normal' ? 'normal' : null;
  const hits = Array.isArray(body.hits) ? body.hits : undefined;
  const scopeParam = String(body.scope ?? "").toLowerCase();
  const scope: "mine" | "others" | "all" = scopeParam === 'mine' ? 'mine' : scopeParam === 'others' ? 'others' : 'all';
  const authUser = (req as any).user?.sub || null;
  const userIdFromHeader = (req.get('x-user-id') || '').trim() || null;
  const userId: string | null = authUser || userIdFromHeader || (body.userId ? String(body.userId) : null);

      if (!question) return res.status(400).json({ error: "question is required" });

      let topHits: any[];
      if (hits && hits.length) {
        topHits = hits.slice(0, 10);
      } else {
        let all = await searchDiariesSemantic(question, { mode, scope: 'all', userId: null });
        if ((scope === 'mine' || scope === 'others') && !userId) {
          return res.status(400).json({ error: "userId is required for scope=mine|others (authenticate or pass userId)", mode, scope });
        }
        if (scope === 'mine' && userId) {
          all = all.filter((h: any) => String(h?._source?.userId || '') === String(userId));
        } else if (scope === 'others' && userId) {
          all = all.filter((h: any) => String(h?._source?.userId || '') !== String(userId));
        }
        topHits = (all || []).slice(0, 10);
      }

  const resultRaw = await selectAnswer(question, topHits, { temperature: 0 });
  const result = normalizeSelectorResult(resultRaw);

  // Determine gating conditions based solely on the LLM's structured verdict
  // Unknown when:
  // - final.type === 'none' (explicit no-answer), OR
  // - answers is empty AND there is no candidate with verdict 'yes'
  const finalObj: any = (result as any)?.final || {};
  const finalType = typeof finalObj.type === 'string' ? finalObj.type.toLowerCase() : 'none';
  const finalText = typeof finalObj.text === 'string' ? finalObj.text.trim() : '';
  const answersArr: any[] = Array.isArray((result as any)?.answers) ? (result as any).answers : [];
  const candidatesArr: any[] = Array.isArray((result as any)?.candidates) ? (result as any).candidates : [];
  const hasYesCandidate = candidatesArr.some((c: any) => (c?.verdict || '').toLowerCase() === 'yes');
  // Extra safety: treat explicit "I don't know" as unknown even if the type is inconsistent
  const isUnknown = finalType === 'none' || finalText.toLowerCase() === "i don't know";
      const requesterId = userId ? String(userId) : null;
      const hasOthers = (topHits || []).some((h: any) => requesterId && String(h?._source?.userId || '') !== requesterId);

      // If the LLM selected any of the caller's own hits, return a direct answer immediately (no waiting/no consent)
      if (!isUnknown && requesterId && answersArr.length > 0) {
        const idOf = (h: any): string => String((h && (h._id || h?.id || (h?._source?.id))) || '');
        const hitsById = new Map<string, any>((topHits || []).map((h: any) => [idOf(h), h]));
        const ownAnswerIds = new Set<string>(
          answersArr
            .map((a: any) => String(a?.id || ''))
            .filter((aid: string) => {
              const h = hitsById.get(aid);
              return h && String(h?._source?.userId || '') === requesterId;
            })
        );
        if (ownAnswerIds.size > 0) {
          const filteredCandidates = (candidatesArr || []).filter((c: any) => ownAnswerIds.has(String(c?.id || '')));
          const filteredAnswers = (answersArr || []).filter((a: any) => ownAnswerIds.has(String(a?.id || '')));
          const directPayload = { ...result, candidates: filteredCandidates, answers: filteredAnswers, meta: { ...(result as any).meta, method, waiting: false } } as any;
          try {
            await ensureSearchHistoryTable();
            const id = `${Date.now()}-${Math.random().toString(36).slice(2,10)}`;
            await insertHistory({
              id,
              userId: requesterId,
              source: 'diary',
              query: question,
              mode,
              scope,
              method: method ?? null,
              requestId: null,
              status: 'DONE',
              hits: topHits || [],
              answer: directPayload,
            });
          } catch {}
          return res.json(directPayload);
        }
      }

      // Hard stop: if unknown, immediately return with waiting=false and never create consent requests/notifications
      if (isUnknown) {
        const safeResult = { ...result, final: { type: 'none', text: "I don't know" }, meta: { ...(result as any).meta, method, waiting: false } } as any;
        // Log as DONE
        try {
          await ensureSearchHistoryTable();
          const id = `${Date.now()}-${Math.random().toString(36).slice(2,10)}`;
          await insertHistory({
            id,
            userId: String(userId || authUser || 'anon'),
            source: 'diary',
            query: question,
            mode,
            scope,
            method: method ?? null,
            requestId: null,
            status: 'DONE',
            hits: topHits || [],
            answer: safeResult,
          });
        } catch {}
        return res.json(safeResult);
      }

      if (!isUnknown && hasOthers && requesterId) {
        try {
          // Build candidates ONLY from answer-selected hits that belong to other users
          const idOf = (h: any): string => String((h && (h._id || h?.id || (h?._source?.id))) || '');
          const answerIds = new Set<string>(answersArr.map((a: any) => String(a?.id || '')));
          const answerHits = (topHits || []).filter((h: any) => answerIds.has(idOf(h)));
          // Cross-check verdicts: only consider hits marked as verdict='yes' by the selector
          const verdictById = new Map<string, string>(
            candidatesArr.map((c: any) => [String(c?.id || ''), String(c?.verdict || '').toLowerCase()])
          );
          const evidenceById = new Map<string, { fields: string[]; snippets: string[] }>(
            candidatesArr.map((c: any) => {
              const fields = Array.isArray(c?.evidence?.fields) ? c.evidence.fields.map((f: any) => String(f)) : [];
              const snippets = Array.isArray(c?.evidence?.snippets) ? c.evidence.snippets.map((s: any) => String(s)) : [];
              return [String(c?.id || ''), { fields, snippets }];
            })
          );
          const otherAnswerHits = answerHits
            .filter((h: any) => String(h?._source?.userId || '') !== requesterId)
            .filter((h: any) => verdictById.get(idOf(h)) === 'yes');

          const ownersSeen = new Set<string>();
          const prelimCandidates: Array<{ owner: string; sourceDocId?: string | null; snippet?: string | null }> = [];
          for (const h of otherAnswerHits) {
            const owner = String(h?._source?.userId || '');
            if (!owner || owner === requesterId) continue;
            if (ownersSeen.has(owner)) continue;
            ownersSeen.add(owner);
            const diaryId = (idOf(h) || null) as any;
            const hi = (h as any)?.highlight || {};
            const hiContent = Array.isArray((hi as any).content) && (hi as any).content[0] ? (hi as any).content[0] : '';
            const hiPhrase = Array.isArray((hi as any).phrases_en) && (hi as any).phrases_en[0] ? (hi as any).phrases_en[0] : '';
            let snippet = (hiContent || hiPhrase || (h as any)?._source?.content || (h as any)?._source?.title || '').toString();
            snippet = snippet.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300);
            prelimCandidates.push({ owner, sourceDocId: diaryId, snippet });
          }
          // Only ask for consent if the LLM selected specific hits, at least one selected hit is owned by others,
          // AND there is at least one 'yes' verdict supporting the query.
          if (answersArr.length > 0 && prelimCandidates.length && hasYesCandidate) {
            // Create match request and then persist candidates
            const modeForReq: 'WIDE'|'STRICT' = mode === 'strict' ? 'STRICT' : 'WIDE';
            const request = await prisma.matchRequest.create({ data: { requesterId, query: question, mode: modeForReq as any } });
            const candData: Array<{ requestId: string; candidateUserId: string; sourceDocId?: string | null; snippet?: string | null }> = prelimCandidates.map((c) => ({ requestId: request.id, candidateUserId: c.owner, sourceDocId: c.sourceDocId ?? null, snippet: c.snippet ?? null }));
            await ensureNotificationsTable().catch(() => {});
            await prisma.matchCandidate.createMany({ data: candData, skipDuplicates: true }).catch(() => {});
            // Notify candidates asking for consent
            await Promise.allSettled(
              Array.from(ownersSeen).map((ownerId) =>
                createNotification({
                  userId: ownerId,
                  type: 'CONSENT_REQUEST',
                  requestId: request.id,
                  message: 'هناك من يريد الإطلاع على يوميتك ضمن نتائج البحث، هل ترغب بالسماح بذلك؟'
                })
              )
            );
            // Return waiting placeholder; client can poll match status and then fetch snapshot
            const waitingPayload = {
              question,
              considered_count: (topHits || []).length,
              candidates: [],
              answers: [],
              // Do not leak a pseudo-answer string; UI should rely on meta.waiting
              final: { type: 'none', text: '' },
              meta: { ...(result as any).meta, waiting: true, requestId: request.id, method },
            };
            // Log to search history as WAITING
            try {
              await ensureSearchHistoryTable();
              await insertHistory({
                id: request.id,
                userId: requesterId,
                source: 'diary',
                query: question,
                mode,
                scope,
                method: method ?? null,
                requestId: request.id,
                status: 'WAITING',
                // For privacy, store only minimal info and only about selected other-user hits
                hits: otherAnswerHits.map((h:any) => ({ _id: h._id, _score: h._score, _source: { title: h?._source?.title, userId: h?._source?.userId, redacted: !!h?._source?.redacted } })),
                answer: null,
              });
            } catch {}
            return res.json(waitingPayload);
          }
          // No valid candidates found; fall through to return direct result without waiting
        } catch {
          // If consent flow fails, fall back to unknown to avoid leakage
          return res.json({
            question,
            considered_count: (topHits || []).length,
            candidates: [],
            answers: [],
            final: { type: 'none', text: "I don't know" },
            meta: { ...(result as any).meta, method, waiting: false },
          });
        }
      }

      // If unknown OR only own docs OR no valid other-user candidates, return the selector result directly.
      // Explicitly set waiting=false and echo method for client awareness.
      try {
        let finalFixed = (result as any)?.final || { type: 'none', text: '' };
        if ((finalFixed?.type || 'none') !== 'none') {
          const txt = (finalFixed?.text ?? '').trim();
          if (!txt) {
            // Synthesize a short generic confirmation if LLM omitted text but gave a non-none type
            finalFixed = { ...finalFixed, text: 'Yes.' };
          }
        }
        const withMethod = { ...result, final: finalFixed, meta: { ...(result as any).meta, method, waiting: false } };
        // Log as DONE (own docs only or unknown)
        try {
          await ensureSearchHistoryTable();
          const id = `${Date.now()}-${Math.random().toString(36).slice(2,10)}`;
          await insertHistory({
            id,
            userId: String(userId || authUser || 'anon'),
            source: 'diary',
            query: question,
            mode,
            scope,
            method: method ?? null,
            requestId: null,
            status: 'DONE',
            hits: topHits || [],
            answer: withMethod,
          });
        } catch {}
  return res.json(withMethod);
      } catch {
  return res.json({ ...result, meta: { ...(result as any).meta, method, waiting: false } });
      }
    } catch (err) { next(err); }
  }
);

search.get(
  "/api/search/diary/answer",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const q = String(req.query.q ?? "").trim();
      const modeParam = String(req.query.mode ?? "").toLowerCase();
      const mode: "wide" | "strict" = modeParam === "strict" ? "strict" : "wide";
      if (!q) return res.status(400).json({ error: "q is required" });

  const hits = await searchDiariesSemantic(q, { mode, scope: 'all', userId: null });
      const result = await selectAnswer(q, hits, { temperature: 0 });
      return res.json(result);
    } catch (err) { next(err); }
  }
);

// Combined search + answer selection in one call
search.post(
  "/api/search/with-answer",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body || {};
      const q = String(body.q ?? "").trim();
  const modeParam = String(body.mode ?? "").toLowerCase();
      const mode: "wide" | "strict" = modeParam === "strict" ? "strict" : "wide";
      const scopeParam = String(body.scope ?? "").toLowerCase();
      const scope: "mine" | "others" | "all" = scopeParam === 'mine' ? 'mine' : scopeParam === 'others' ? 'others' : 'all';
  const authUser = (req as any).user?.sub || null;
  // Accept userId from auth, body, header, or query to enable safe own-docs selection
  const userIdFromHeader = (req.get('x-user-id') || '').trim() || null;
  const userIdFromQuery = req.query.userId ? String(req.query.userId) : null;
  const userId: string | null = authUser || (body.userId ? String(body.userId) : null) || userIdFromHeader || userIdFromQuery;
      const matchRequestId: string | null = body.matchRequestId ? String(body.matchRequestId) : null;

      if (!q) return res.json({ count: 0, hits: [], mode, scope, selection: null });
      if ((scope === 'mine' || scope === 'others') && !userId) {
        return res.status(400).json({ error: "userId is required for scope=mine|others (authenticate or pass userId)" });
      }

      // Determine approved candidate (if any) for this consent request (used to unredact only that owner's docs)
      let approvedCandidateUserId: string | null = null;
      if (matchRequestId) {
        try {
          const mr = await prisma.matchRequest.findUnique({
            where: { id: matchRequestId },
            select: { id: true, status: true, requesterId: true, approvedCandidateId: true },
          });
          if (mr && mr.status === 'MATCHED' && (!userId || String(mr.requesterId) === String(userId)) && mr.approvedCandidateId) {
            const cand = await prisma.matchCandidate.findUnique({ where: { id: mr.approvedCandidateId }, select: { candidateUserId: true } });
            if (cand?.candidateUserId) approvedCandidateUserId = String(cand.candidateUserId);
          }
        } catch {}
      }

  const hits = await searchDiariesSemantic(q, { mode, scope, userId, logMeta: { userId: userId ?? null, ip: (req.ip ?? null) as any, ua: req.get('user-agent') || null } });

      const redact = (h: any) => ({ _id: h._id, _score: h._score, _source: { redacted: true }, highlight: undefined });
      let safeHits: any[] = hits;
      if (scope === 'others') {
        safeHits = (hits || []).map((h: any) => {
          const ownerId = String(h?._source?.userId || '');
          const unredact = approvedCandidateUserId && ownerId === approvedCandidateUserId;
          return unredact ? h : redact(h);
        });
      } else if (scope === 'all') {
        safeHits = (hits || []).map((h: any) => {
          const ownerId = String(h?._source?.userId || '');
          const isMine = userId && ownerId === String(userId);
          const isApproved = approvedCandidateUserId && ownerId === approvedCandidateUserId;
          return (isMine || isApproved) ? h : redact(h);
        });
      }

  // Run answer selector on non-redacted hits only (up to 10)
      let evalHits = (safeHits || []).filter((h: any) => !(h?._source?.redacted)).slice(0, 10);
      let selection: any = null;
      let selectionUsingOwnOnly = false;

      // If all hits are redacted (scope=all/others) but we know the requester (userId),
      // compute selection from the requester's own documents as a safe fallback.
      if ((!evalHits || evalHits.length === 0) && userId) {
        try {
          // Try leveraging the already-fetched unredacted hits (pre-redaction) filtered to the requester first
          const ownFromBatch = (hits || []).filter((h: any) => String(h?._source?.userId || '') === String(userId)).slice(0, 10);
          let ownEval = ownFromBatch;
          if (!ownEval.length) {
            // If own docs did not appear in the top results for 'all', do a focused 'mine' search
            const ownHits = await searchDiariesSemantic(q, { mode, scope: 'mine', userId });
            ownEval = (ownHits || []).slice(0, 10);
          }
          if (ownEval.length) {
            selection = await selectAnswer(q, ownEval, { temperature: 0 });
            selectionUsingOwnOnly = true;
          }
        } catch {}
      }

      // Otherwise, if we have visible (non-redacted) hits, select from them
      if (!selection && evalHits.length) {
        try {
          selection = await selectAnswer(q, evalHits, { temperature: 0 });
        } catch {}
      }

      // Ensure selection is not null
      if (!selection) {
        selection = {
          question: q,
          considered_count: evalHits?.length ?? 0,
          candidates: [],
          answers: [],
          final: { type: 'none', text: '' },
          meta: { reason: (!evalHits || evalHits.length === 0) ? 'no_visible_hits' : 'llm_error' },
        };
      }

      // Mark meta when selection was derived solely from the requester's own documents
      if (selection && selectionUsingOwnOnly) {
        try {
          selection = { ...selection, meta: { ...(selection.meta || {}), usingOwnOnly: true } };
        } catch {}
      }

      // Backend-only verification: do we have matching diaries from OTHER users?
      // Use raw pre-redaction hits to evaluate "others" without exposing content to the client.
      const ownerIsRequester = (h: any) => String(h?._source?.userId || '') === String(userId || '');
      const ownerIsApproved = (h: any) => !!approvedCandidateUserId && String(h?._source?.userId || '') === String(approvedCandidateUserId);
      const othersRaw = (hits || []).filter((h: any) => !ownerIsRequester(h) && !ownerIsApproved(h));

      // Sanitize the other-users hits that we send to LLM: drop full content, keep structure and small highlights
      const othersEvalSanitized = othersRaw.slice(0, 8).map((h: any) => {
        const hi = h?.highlight || undefined;
        const takeArr = (arr: any, n: number) => (Array.isArray(arr) ? arr.slice(0, n) : undefined);
        return {
          _id: h._id,
          _score: h._score,
          _source: {
            // Intentionally omit content to limit exposure; keep signals
            title: h?._source?.title ?? null,
            content: null,
            time_label: h?._source?.time_label ?? null,
            polarity: h?._source?.polarity ?? null,
            entities: Array.isArray(h?._source?.entities) ? h._source.entities : [],
            actions: Array.isArray(h?._source?.actions) ? h._source.actions : [],
            phrases_en: Array.isArray(h?._source?.phrases_en) ? h._source.phrases_en : [],
            affirmed_actions_en: Array.isArray(h?._source?.affirmed_actions_en) ? h._source.affirmed_actions_en : [],
            negated_actions_en: Array.isArray(h?._source?.negated_actions_en) ? h._source.negated_actions_en : [],
          },
          highlight: hi
            ? {
                content: takeArr((hi as any).content, 2),
                phrases_en: takeArr((hi as any).phrases_en, 3),
              }
            : undefined,
        };
      });

      let othersSelection: any = null;
      let othersVerdict: 'match' | 'no_match' = 'no_match';
      if (othersEvalSanitized.length) {
        try {
          othersSelection = await selectAnswer(q, othersEvalSanitized, { temperature: 0 });
          const oType = othersSelection?.final?.type ?? 'none';
          const oText = (othersSelection?.final?.text ?? '').trim();
          othersVerdict = oType !== 'none' && !!oText ? 'match' : 'no_match';
        } catch {
          // fall back to ES evidence only
          othersVerdict = othersEvalSanitized.length > 0 ? 'match' : 'no_match';
        }
      }

      // Compute decision in backend so frontend has a clear verdict
      const hasRedactedOthers = (safeHits || []).some((h: any) => !!(h?._source?.redacted));
      const finalType = selection?.final?.type ?? 'none';
      const finalText = (selection?.final?.text ?? '').trim();
      // Overall verdict for the current visible context (mine + approved) remains based on selection
      const verdict: 'match' | 'no_match' = (finalType !== 'none' && !!finalText) ? 'match' : 'no_match';
      // Consent/privacy is driven by whether OTHER users appear to match
      const canRequestConsent = othersVerdict === 'match' && hasRedactedOthers;
      const showPrivacyNotice = canRequestConsent;
      const decision = {
        verdict,
        othersVerdict,
        canRequestConsent,
        showPrivacyNotice,
        hasRedactedOthers,
        reason: q
          ? (othersVerdict === 'match'
              ? 'others_match'
              : (hasRedactedOthers ? 'others_no_match' : 'no_visible_hits'))
          : 'empty_query',
      } as const;

      // Simple Arabic proposed answer about presence of other users' matching diaries
      const proposedAnswer = othersVerdict === 'match' ? 'نعم، هناك.' : 'لا، لا توجد.';

      return res.json({
        count: (safeHits || []).length,
        hits: safeHits,
        mode,
        scope,
        selection,
        decision,
        proposedAnswer,
      });
    } catch (err) {
      next(err);
    }
  }
);

// Fast path: get cached snapshot for a match request; if empty, compute once and cache
search.get(
  "/api/search/snapshot",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestId = String(req.query.requestId ?? "").trim();
      if (!requestId) return res.status(400).json({ error: "requestId is required" });
      const userId = (req as any).user?.sub || null;
      if (!userId) return res.status(401).json({ error: 'unauthorized' });
      const snap = await getSnapshotByRequestId(requestId);
  if (snap) {
        // Allow only requester to read snapshot
        const reqOwner = (snap as any).requesterid ?? (snap as any).requesterId;
        if (reqOwner && String(reqOwner) !== String(userId)) {
          return res.status(403).json({ error: 'forbidden' });
        }
        // If existing snapshot has no hits, compute them now for instant UX
        const existingHits = typeof (snap as any).hits === 'string' ? JSON.parse((snap as any).hits) : ((snap as any).hits || []);
  if (!existingHits || existingHits.length === 0) {
          const r = await prisma.matchRequest.findUnique({ where: { id: requestId } });
          if (!r) return res.status(404).json({ error: 'not_found' });
          if (String(r.requesterId) !== String(userId)) return res.status(403).json({ error: 'forbidden' });
          if (r.status !== ('MATCHED' as any)) return res.status(409).json({ error: 'not_ready' });
          const approved = r.approvedCandidateId ? await prisma.matchCandidate.findUnique({ where: { id: r.approvedCandidateId } }) : null;
          const approvedUserId = approved?.candidateUserId || null;
          const mode: 'wide'|'strict' = ((r as any).mode?.toString().toLowerCase() === 'strict') ? 'strict' : 'wide';
          const baseHits = await searchDiariesSemantic(r.query, { mode, scope: 'all', userId: r.requesterId });
          const filtered = (baseHits || []).filter((h: any) => {
            const ownerId = String(h?._source?.userId || '');
            return ownerId === String(r.requesterId) || (approvedUserId && ownerId === approvedUserId);
          });
          // Compute answer now if possible
          let computedAnswer: any = null;
          try {
            const top = filtered.slice(0, 10);
            if (top.length) computedAnswer = await selectAnswer(r.query, top, { temperature: 0 });
          } catch {}
          await upsertSnapshot({
            id: r.id,
            requestId: r.id,
            requesterId: r.requesterId,
            query: r.query,
            mode,
            scope: 'all',
            approvedCandidateUserId: approvedUserId,
            isApproved: true,
            hits: filtered,
            answer: computedAnswer ?? ((snap as any).answer ? (typeof (snap as any).answer === 'string' ? JSON.parse((snap as any).answer) : (snap as any).answer) : null),
          });
          // Update search history (WAITING -> DONE) by requestId
          try {
            await updateHistoryByRequestId(r.id, { status: 'DONE', hits: filtered, answer: computedAnswer ?? ((snap as any).answer ?? null) });
          } catch {}
          return res.json({ requestId: r.id, query: r.query, mode, scope: 'all', isApproved: true, approvedCandidateUserId: approvedUserId, hits: filtered, answer: computedAnswer ?? ((snap as any).answer ?? null) });
        }
        // If snapshot has hits but answer is missing, compute it now
        let answerVal = typeof (snap as any).answer === 'string' ? JSON.parse((snap as any).answer) : ((snap as any).answer || null);
  if (!answerVal) {
          try {
            const top = (existingHits || []).slice(0, 10);
            if (top.length) {
              answerVal = await selectAnswer(((snap as any).query || ''), top, { temperature: 0 });
              await upsertSnapshot({
                id: (snap as any).id || (snap as any).requestId,
                requestId: (snap as any).requestid || (snap as any).requestId,
                requesterId: (snap as any).requesterid || (snap as any).requesterId,
                query: (snap as any).query,
                mode: (((snap as any).mode || 'wide').toLowerCase() === 'strict' ? 'strict' : 'wide') as any,
                scope: (((snap as any).scope || 'all').toLowerCase() as any),
                approvedCandidateUserId: (snap as any).approvedcandidateuserid || (snap as any).approvedCandidateUserId || null,
                isApproved: !!(((snap as any).isapproved) ?? (snap as any).isApproved),
                hits: existingHits,
                answer: answerVal,
              });
              try { await updateHistoryByRequestId(((snap as any).requestid || (snap as any).requestId), { status: 'DONE', hits: existingHits, answer: answerVal }); } catch {}
            }
          } catch {}
        }
        // return snapshot (DB may lowercase some keys)
        return res.json({
          requestId: (snap as any).requestid || (snap as any).requestId,
          query: (snap as any).query,
          mode: ((snap as any).mode || 'wide').toLowerCase(),
          scope: ((snap as any).scope || 'all').toLowerCase(),
          isApproved: !!(((snap as any).isapproved) ?? (snap as any).isApproved),
          approvedCandidateUserId: (snap as any).approvedcandidateuserid || (snap as any).approvedCandidateUserId || null,
          hits: existingHits,
          answer: answerVal,
          createdAt: (snap as any).createdat || (snap as any).createdAt,
        });
      }

      // No snapshot: compute once if matched and cache
  const r = await prisma.matchRequest.findUnique({ where: { id: requestId } });
      if (!r) return res.status(404).json({ error: 'not_found' });
  if (String(r.requesterId) !== String(userId)) return res.status(403).json({ error: 'forbidden' });
      if (r.status !== ('MATCHED' as any)) return res.status(409).json({ error: 'not_ready' });
      const approved = r.approvedCandidateId ? await prisma.matchCandidate.findUnique({ where: { id: r.approvedCandidateId } }) : null;
      const approvedUserId = approved?.candidateUserId || null;

      // Perform a one-off search limited to mine + approved user
      const q = r.query;
      const mode: 'wide'|'strict' = ((r as any).mode?.toString().toLowerCase() === 'strict') ? 'strict' : 'wide';
      const baseHits = await searchDiariesSemantic(q, { mode, scope: 'all', userId: r.requesterId });
      const filtered = (baseHits || []).filter((h: any) => {
        const ownerId = String(h?._source?.userId || '');
        return ownerId === String(r.requesterId) || (approvedUserId && ownerId === approvedUserId);
      });

  const payload = {
        id: r.id,
        requestId: r.id,
        requesterId: r.requesterId,
        query: r.query,
        mode,
        scope: 'all' as const,
        approvedCandidateUserId: approvedUserId,
        isApproved: true,
        hits: filtered,
        answer: null,
      };
      await upsertSnapshot(payload);
  try { await updateHistoryByRequestId(r.id, { status: 'DONE', hits: filtered, answer: null }); } catch {}
      return res.json({ requestId: r.id, query: r.query, mode, scope: 'all', isApproved: true, approvedCandidateUserId: approvedUserId, hits: filtered, answer: null });
    } catch (err) { next(err); }
  }
);

/**
 * ===============================
 *  البحث الدلالي في الميكروبلاق (umgram_microblog)
 * ===============================
 *
 * GET /api/search/microblog?q=...&mode=wide|strict
 */
search.get(
  "/api/search/microblog",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const q = String(req.query.q ?? "").trim();
      const modeParam = String(req.query.mode ?? "").toLowerCase();
      const mode: "wide" | "strict" = modeParam === "strict" ? "strict" : "wide";
      if (!q) return res.json({ count: 0, hits: [], mode });
      const hits = await searchMicroblogSemantic(q, { mode });
      return res.json({ count: hits.length, hits, mode });
    } catch (err) { next(err); }
  }
);

/**
 * اختيار جواب من نتائج الميكروبلاق
 * POST /api/search/microblog/answer
 */
search.post(
  "/api/search/microblog/answer",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body || {};
      const question = String(body.question ?? "").trim();
      const modeParam = String(body.mode ?? "").toLowerCase();
      const mode: "wide" | "strict" = modeParam === "strict" ? "strict" : "wide";
      const hitsIn = Array.isArray(body.hits) ? body.hits : undefined;
      if (!question) return res.status(400).json({ error: "question is required" });
      const hits = hitsIn?.length ? hitsIn.slice(0, 10) : await searchMicroblogSemantic(question, { mode });
      const result = await selectAnswer(question, hits, { temperature: 0 });
      // Log history (DONE)
      try {
        await ensureSearchHistoryTable();
        const id = `${Date.now()}-${Math.random().toString(36).slice(2,10)}`;
        const userId = (req as any).user?.sub || (req.get('x-user-id') || null) || 'anon';
        await insertHistory({
          id,
          userId: String(userId),
          source: 'microblog',
          query: question,
          mode,
          scope: 'all',
          method: null,
          requestId: null,
          status: 'DONE',
          hits,
          answer: result,
        });
      } catch {}
      return res.json(result);
    } catch (err) { next(err); }
  }
);
/**
 * ===============================
 *  البحث الدلالي في الدردشات (umgram_chats)
 * ===============================
 *
 * GET /api/search/chat?q=...&mode=wide|strict
 */
search.get(
  "/api/search/chat",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const q = String(req.query.q ?? "").trim();
      const modeParam = String(req.query.mode ?? "").toLowerCase();
      const mode: "wide" | "strict" = modeParam === "strict" ? "strict" : "wide";
      if (!q) return res.json({ count: 0, hits: [], mode });
      const hits = await searchChatsSemantic(q, { mode });
      return res.json({ count: hits.length, hits, mode });
    } catch (err) { next(err); }
  }
);

// إدارة الفهرس: إعادة فهرسة جميع محادثات الدردشة (للاستخدام التطويري)
search.post(
  "/api/search/chat/reindex",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      await reindexAllChats({ refresh: true });
      return res.json({ ok: true });
    } catch (err) { next(err); }
  }
);

// إدارة الفهرس: عدّ المستندات في فهرس الدردشة
search.get(
  "/api/search/chat/_count",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const DI = process.env.ES_CHAT_INDEX || "umgram_chats";
      const cnt = await es.count({ index: DI });
      return res.json(cnt);
    } catch (err) { next(err); }
  }
);

/**
 * ===============================
 *  اختيار الجواب من نتائج الدردشات (LLM)
 * ===============================
 * POST /api/search/chat/answer
 */
search.post(
  "/api/search/chat/answer",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body || {};
      const question = String(body.question ?? "").trim();
      const modeParam = String(body.mode ?? "").toLowerCase();
      const mode: "wide" | "strict" = modeParam === "strict" ? "strict" : "wide";
      const hitsIn = Array.isArray(body.hits) ? body.hits : undefined;
      if (!question) return res.status(400).json({ error: "question is required" });
      const hits = hitsIn?.length ? hitsIn.slice(0, 10) : await searchChatsSemantic(question, { mode });
      const result = await selectAnswer(question, hits, { temperature: 0 });
      // Log history (DONE)
      try {
        await ensureSearchHistoryTable();
        const id = `${Date.now()}-${Math.random().toString(36).slice(2,10)}`;
        const userId = (req as any).user?.sub || (req.get('x-user-id') || null) || 'anon';
        await insertHistory({
          id,
          userId: String(userId),
          source: 'chat',
          query: question,
          mode,
          scope: 'all',
          method: null,
          requestId: null,
          status: 'DONE',
          hits,
          answer: result,
        });
      } catch {}
      return res.json(result);
    } catch (err) { next(err); }
  }
);

/**
 * ===============================
 *  اختيار الجواب من نتائج الملاحظات (LLM)
 * ===============================
 *
 * POST /api/search/note/answer
 * Body: { question: string, mode?: 'wide'|'strict', hits?: any[] }
 * - إن قُدمت hits فسيتم استعمالها مباشرة (يُقصّ إلى أعلى 10).
 * - وإلا سننفّذ بحث الملاحظات الدلالي ثم نمرر أعلى النتائج إلى أداة الاختيار.
 *
 * GET /api/search/note/answer?q=...&mode=wide|strict
 */
search.post(
  "/api/search/note/answer",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body || {};
      const question = String(body.question ?? "").trim();
      const modeParam = String(body.mode ?? "").toLowerCase();
      const mode: "wide" | "strict" = modeParam === "strict" ? "strict" : "wide";
      const hits = Array.isArray(body.hits) ? body.hits : undefined;

      if (!question) return res.status(400).json({ error: "question is required" });

      let topHits: any[];
      if (hits && hits.length) {
        topHits = hits.slice(0, 10);
      } else {
        topHits = await searchNotesSemantic(question, { mode });
      }

      const result = await selectAnswer(question, topHits, { temperature: 0 });
      // Log history (DONE)
      try {
        await ensureSearchHistoryTable();
        const id = `${Date.now()}-${Math.random().toString(36).slice(2,10)}`;
        const userId = (req as any).user?.sub || (req.get('x-user-id') || null) || 'anon';
        await insertHistory({
          id,
          userId: String(userId),
          source: 'note',
          query: question,
          mode,
          scope: 'all',
          method: null,
          requestId: null,
          status: 'DONE',
          hits: topHits,
          answer: result,
        });
      } catch {}
      return res.json(result);
    } catch (err) { next(err); }
  }
);

search.get(
  "/api/search/note/answer",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const q = String(req.query.q ?? "").trim();
      const modeParam = String(req.query.mode ?? "").toLowerCase();
      const mode: "wide" | "strict" = modeParam === "strict" ? "strict" : "wide";
      if (!q) return res.status(400).json({ error: "q is required" });

      const hits = await searchNotesSemantic(q, { mode });
      const result = await selectAnswer(q, hits, { temperature: 0 });
      return res.json(result);
    } catch (err) { next(err); }
  }
);

/**
 * ===============================
 *  البحث الدلالي في الملاحظات (umgram_notes)
 * ===============================
 *
 * GET /api/search/note?q=...&mode=wide|strict
 */
search.get(
  "/api/search/note",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const q = String(req.query.q ?? "").trim();
      const modeParam = String(req.query.mode ?? "").toLowerCase();
      const mode: "wide" | "strict" = modeParam === "strict" ? "strict" : "wide";
      if (!q) return res.json({ count: 0, hits: [], mode });
      const hits = await searchNotesSemantic(q, { mode });
      return res.json({ count: hits.length, hits, mode });
    } catch (err) { next(err); }
  }
);

/**
 * ===============================
 *  اختيار الجواب من النتائج (LLM)
 * ===============================
 *
 * POST /api/search/answer
 * Body: { question: string, mode?: 'wide'|'strict', hits?: any[] }
 * - إن قُدمت hits فسيتم استعمالها مباشرة (يُقصّ إلى أعلى 10).
 * - وإلا سننفّذ البحث الدلالي ثم نمرر أعلى النتائج إلى أداة الاختيار.
 *
 * GET /api/search/answer?q=...&mode=wide|strict&scope=mine|others|all
 * - بديل بسيط عبر الاستعلام.
 */
search.post(
  "/api/search/answer",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body || {};
      const question = String(body.question ?? "").trim();
      const modeParam = String(body.mode ?? "").toLowerCase();
      const mode: "wide" | "strict" = modeParam === "strict" ? "strict" : "wide";
  const hits = Array.isArray(body.hits) ? body.hits : undefined;
  const hitsProvided = Array.isArray(hits) && hits.length > 0;
      // honor scope/userId if provided (align with GET variant)
      const scopeParam = String(body.scope ?? "").toLowerCase();
      const scope: "mine" | "others" | "all" = scopeParam === 'mine' ? 'mine' : scopeParam === 'others' ? 'others' : 'all';
  const userId = (req as any).user?.sub || String(body.userId ?? "").trim() || null;
      const matchRequestId = String(body.matchRequestId ?? "").trim() || null;

      if (!question) return res.status(400).json({ error: "question is required" });

      // Determine approved candidate for this request (if any)
      let approvedCandidateUserId: string | null = null;
      if (matchRequestId) {
        try {
          const mr = await prisma.matchRequest.findUnique({
            where: { id: matchRequestId },
            select: { id: true, status: true, requesterId: true, approvedCandidateId: true },
          });
          if (mr && mr.status === 'MATCHED' && (!userId || String(mr.requesterId) === String(userId)) && mr.approvedCandidateId) {
            const cand = await prisma.matchCandidate.findUnique({ where: { id: mr.approvedCandidateId }, select: { candidateUserId: true } });
            if (cand?.candidateUserId) approvedCandidateUserId = String(cand.candidateUserId);
          }
        } catch {
          // ignore
        }
      }

      // If client did NOT provide hits, enforce consent restrictions strictly.
      // If hits ARE provided, we will only evaluate on the provided non-redacted hits,
      // which are already safe to process (own or previously unredacted content).
      if (!hitsProvided && scope === 'others') {
        // Block answer selection unless consent is MATCHED and we know the approved candidate owner
        if (!matchRequestId || !approvedCandidateUserId) {
          return res.status(403).json({ error: 'consent_required' });
        }
      }

      // If client explicitly passed hits array but it's empty, we will fallback to a fresh search
      // to preserve the legacy behavior of this endpoint (useful for manual testing/tools).
      // When scope is invalid for fallback (mine/others without userId), default to 'all'.

      let topHits: any[];
      if (hitsProvided) {
        // Use only non-redacted hits to avoid leaking private content
        topHits = (hits as any[]).filter((h: any) => !(h?._source?.redacted)).slice(0, 10);
      } else {
        // When re-querying, respect scope and userId like GET variants
        const effectiveScope = (scope === 'mine' || scope === 'others') && !userId ? 'all' : scope;
        topHits = await searchDiariesSemantic(question, { mode, scope: effectiveScope as any, userId });
      }

      // Enforce ownership filtering for answer selection to avoid leaking others' content
      if (!hitsProvided && scope === 'all') {
        if (approvedCandidateUserId && userId) {
          topHits = (topHits || []).filter((h: any) => {
            const ownerId = String(h?._source?.userId || '');
            return ownerId === String(userId) || ownerId === approvedCandidateUserId;
          });
        } else if (userId) {
          // No consent yet: only allow own docs
          topHits = (topHits || []).filter((h: any) => String(h?._source?.userId || '') === String(userId));
          // If no hits left and we re-queried with 'all', try a mine-only search fallback
          if ((!topHits || topHits.length === 0) && (!hits || hits.length === 0)) {
            const mineHits = await searchDiariesSemantic(question, { mode, scope: 'mine', userId });
            topHits = mineHits.slice(0, 10);
          }
        }
      } else if (!hitsProvided && scope === 'others') {
        // Only approved candidate's docs are allowed
        if (approvedCandidateUserId) {
          topHits = (topHits || []).filter((h: any) => String(h?._source?.userId || '') === approvedCandidateUserId);
        }
      }

      if (!topHits || topHits.length === 0) {
        return res.json({
          question,
          considered_count: 0,
          candidates: [],
          answers: [],
          final: { type: 'none', text: '' },
        });
      }

      const result = await selectAnswer(question, topHits, { temperature: 0 });
      return res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * ==================================
 *  البحث التقليدي في الملاحظات (umgram_notes)
 * ==================================
 *
 * GET /search/note?q=...&op=and|or&size=&from=&lang=ar|en&userId=<uuid>
 */
search.get(
  "/search/note",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const qRaw = String(req.query.q ?? "");
      const size = clampInt(req.query.size as string | undefined, 20, 1, 100);
      const from = clampInt(req.query.from as string | undefined, 0, 0, 10_000);
      const op: QueryDslOperator =
        String(req.query.op ?? "or").toLowerCase() === "and" ? "and" : "or";
      const langParam = String(req.query.lang ?? "").toLowerCase();
      const userId = (req.query.userId ? String(req.query.userId) : "").trim();

      if (!qRaw.trim()) return res.json({ hits: [], total: 0 });

      const hasAdvancedOps = /[~"^|()+\-*]/.test(qRaw);
      const q = hasAdvancedOps ? qRaw.trim() : normalizeQuery(qRaw);

      const isArabic =
        langParam === "ar" ? true : langParam === "en" ? false : /[\u0600-\u06FF]/.test(q);

      const noteFields = ["title^2", "content"]; 

      let baseQuery: QueryDslQueryContainer;
      if (hasAdvancedOps) {
        baseQuery = {
          simple_query_string: { query: q, fields: noteFields as string[], default_operator: op },
        };
      } else if (isArabic) {
        const tokens = q.split(/\s+/).filter(Boolean);
        const mm: QueryDslQueryContainer = {
          multi_match: { query: q, fields: noteFields as string[], operator: op, type: "best_fields" },
        };
        const wildcardMust: QueryDslQueryContainer[] = tokens.map((t) => ({
          query_string: {
            query: `*${t}*`,
            fields: noteFields as string[],
            default_operator: "and",
            analyze_wildcard: true as any,
          } as any,
        }));
        baseQuery = wildcardMust.length ? { bool: { should: [mm, { bool: { must: wildcardMust } }], minimum_should_match: 1 } } : mm;
      } else {
        const engTokens = q.toLowerCase().match(/[a-z]+/g) ?? [];
        const hasShortToken = engTokens.some((t) => t.length < 3);
        baseQuery = {
          multi_match: {
            query: q,
            fields: noteFields as string[],
            operator: op,
            type: "best_fields",
            fuzziness: (hasShortToken ? 1 : ("AUTO" as any)),
          },
        };
      }

      const query: QueryDslQueryContainer = userId
        ? { bool: { must: [baseQuery, { term: { userId } }] } }
        : baseQuery;

      const result = await es.search({ index: NOTE_IDX, from, size, query, highlight: { fields: { title: {}, content: {} } } });
      const hits = (result.hits.hits ?? []).map((h: any) => ({ id: h._id, score: h._score, ...(h._source ?? {}), highlight: h.highlight }));
      const total = typeof result.hits.total === "number" ? result.hits.total : (result.hits.total as any)?.value ?? hits.length;
      res.json({ hits, total });
    } catch (err) { next(err); }
  }
);

search.get(
  "/api/search/answer",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const q = String(req.query.q ?? "").trim();
      const modeParam = String(req.query.mode ?? "").toLowerCase();
      const mode: "wide" | "strict" = modeParam === "strict" ? "strict" : "wide";
  const scopeParam = String(req.query.scope ?? "").toLowerCase();
  const scope: "mine" | "others" | "all" = scopeParam === 'mine' ? 'mine' : scopeParam === 'others' ? 'others' : 'all';
  const userId = (req as any).user?.sub || String(req.query.userId ?? "").trim() || null;
  const matchRequestId = String(req.query.matchRequestId ?? "").trim() || null;
      if (!q) return res.status(400).json({ error: "q is required" });
      if ((scope === 'mine' || scope === 'others') && !userId) {
        return res.status(400).json({ error: "userId is required for scope=mine|others (authenticate or pass userId)" });
      }

      // Determine approved candidate for this request (if any)
      let approvedCandidateUserId: string | null = null;
      if (matchRequestId) {
        try {
          const mr = await prisma.matchRequest.findUnique({
            where: { id: matchRequestId },
            select: { id: true, status: true, requesterId: true, approvedCandidateId: true },
          });
          if (mr && mr.status === 'MATCHED' && (!userId || String(mr.requesterId) === String(userId)) && mr.approvedCandidateId) {
            const cand = await prisma.matchCandidate.findUnique({ where: { id: mr.approvedCandidateId }, select: { candidateUserId: true } });
            if (cand?.candidateUserId) approvedCandidateUserId = String(cand.candidateUserId);
          }
        } catch {
          // ignore
        }
      }

      if (scope === 'others') {
        if (!matchRequestId || !approvedCandidateUserId) return res.status(403).json({ error: 'consent_required' });
      }

  let hits = await searchDiariesSemantic(q, { mode, scope, userId });
      // Restrict answer selection to allowed owners only
      if (scope === 'all') {
        if (approvedCandidateUserId && userId) {
          hits = (hits || []).filter((h: any) => {
            const ownerId = String(h?._source?.userId || '');
            return ownerId === String(userId) || ownerId === approvedCandidateUserId;
          });
        } else if (userId) {
          hits = (hits || []).filter((h: any) => String(h?._source?.userId || '') === String(userId));
        }
      } else if (scope === 'others') {
        // Only approved candidate's docs
        if (approvedCandidateUserId) {
          hits = (hits || []).filter((h: any) => String(h?._source?.userId || '') === approvedCandidateUserId);
        } else {
          hits = [] as any;
        }
      }
      if (!hits || hits.length === 0) {
        return res.json({
          question: q,
          considered_count: 0,
          candidates: [],
          answers: [],
          final: { type: 'none', text: '' },
        });
      }
      const result = await selectAnswer(q, hits, { temperature: 0 });
      return res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * ===============================
 *  البحث في المنشورات (umgram_posts)
 * ===============================
 *
 * GET /search?q=...&op=and|or&size=&from=&lang=ar|en
 * عربي/إنجليزي + AND/OR
 * - إنجليزي: multi_match مع fuzziness ديناميكي (AUTO أو 1 للكلمات القصيرة)
 * - عربي: multi_match + Fallback wildcard داخلي (*token*) لكل كلمة
 * - رموز متقدمة (~"^|()+-*) => simple_query_string كما هو
 */
search.get(
  "/search",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const qRaw = String(req.query.q ?? "");
      const size = clampInt(req.query.size as string | undefined, 20, 1, 100);
      const from = clampInt(req.query.from as string | undefined, 0, 0, 10_000);
      const op: QueryDslOperator =
        String(req.query.op ?? "or").toLowerCase() === "and" ? "and" : "or";
      const langParam = String(req.query.lang ?? "").toLowerCase();

      if (!qRaw.trim()) return res.json({ hits: [], total: 0 });

      const hasAdvancedOps = /[~"^|()+\-*]/.test(qRaw);
      const q = hasAdvancedOps ? qRaw.trim() : normalizeQuery(qRaw);

      const isArabic =
        langParam === "ar" ? true : langParam === "en" ? false : /[\u0600-\u06FF]/.test(q);

      const arFields = ["title.ar^5", "body.ar^3", "title.s^6"];
      const enFields = ["title.en^5", "body.en^3", "title.s^6", "title^2", "body"];

      let query: QueryDslQueryContainer;

      if (hasAdvancedOps) {
        // دعم العبارات/المعاملات (~ " ^ | ( ) + - * )
        query = {
          simple_query_string: {
            query: q,
            fields: (isArabic ? arFields : enFields) as string[],
            default_operator: op,
          },
        };
      } else if (isArabic) {
        // ===== العربي: multi_match + fallback wildcards لكل كلمة =====
        const base: QueryDslQueryContainer = {
          multi_match: {
            query: q,
            fields: arFields as string[],
            operator: op,
            type: "best_fields",
          },
        };

        // نجزّئ الكلمات العربية ونبني MUST من *token*
        const tokens = q.split(/\s+/).filter(Boolean);
        const wildcardMust: QueryDslQueryContainer[] = tokens.map((t) => ({
          // query_string مع wildcards؛ نفعّل AND داخل هذا المسار
          query_string: {
            query: `*${t}*`,
            fields: arFields as string[],
            default_operator: "and",
            analyze_wildcard: true as any,
          } as any,
        }));

        const wildcardPath: QueryDslQueryContainer =
          wildcardMust.length > 0
            ? { bool: { must: wildcardMust } }
            : base;

        query = {
          bool: {
            should: [base, wildcardPath],
            minimum_should_match: 1,
          },
        };
      } else {
        // ===== الإنجليزي: multi_match دائماً مع fuzziness ديناميكي =====
        const engTokens = q.toLowerCase().match(/[a-z]+/g) ?? [];
        const hasShortToken = engTokens.some((t) => t.length < 3);

        query = {
          multi_match: {
            query: q,
            fields: enFields as string[],
            operator: op,
            type: "best_fields",
            fuzziness: (hasShortToken ? 1 : ("AUTO" as any)),
          },
        };
      }

      const result = await es.search({
        index: POSTS_INDEX,
        from,
        size,
        query,
      });

      const hits = (result.hits.hits ?? []).map((h) => ({
        id: h._id,
        score: h._score,
        ...(h._source ?? {}),
      }));
      const total =
        typeof result.hits.total === "number"
          ? result.hits.total
          : (result.hits.total as any)?.value ?? hits.length;

      res.json({ hits, total });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * إكمال تلقائي على عناوين المنشورات باستخدام search_as_you_type.
 * GET /search/suggest?q=Um
 */
search.get(
  "/search/suggest",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const q = String(req.query.q ?? "").trim();
      const size = clampInt(req.query.size as string | undefined, 10, 1, 50);
      if (!q) return res.json({ suggestions: [] });

      const result = await es.search<{ title?: string }>({
        index: POSTS_INDEX,
        size,
        query: {
          multi_match: {
            query: q,
            type: "bool_prefix",
            fields: ["title.s", "title.s._2gram", "title.s._3gram"],
          },
        },
        _source: ["title"],
      });

      const suggestions = (result.hits.hits ?? [])
        .map((h) => h._source?.title)
        .filter(Boolean);

      res.json({ suggestions });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * فهرسة/حذف مستند منشور يدويًا (اختبار/أدوات).
 * POST /search/index
 * DELETE /search/:id
 */
search.post(
  "/search/index",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, title, body, authorId, createdAt } = req.body ?? {};
      if (!title || !body) {
        return res.status(400).json({ error: "title and body are required" });
      }

      const doc = {
        title: String(title),
        body: String(body),
        authorId:
          typeof authorId === "number"
            ? authorId
            : parseInt(authorId, 10) || undefined,
        createdAt: createdAt
          ? new Date(createdAt).toISOString()
          : new Date().toISOString(),
      };

      await es.index({
        index: POSTS_INDEX,
        ...(id ? { id: String(id) } : {}),
        document: doc,
        refresh: "wait_for",
      });

      return res.status(201).json({ ok: true, id: id ?? "(auto)" });
    } catch (err) {
      next(err);
    }
  }
);

search.delete(
  "/search/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      await es.delete({ index: POSTS_INDEX, id, refresh: "wait_for" });
      res.json({ ok: true });
    } catch (err: any) {
      if (err?.meta?.statusCode === 404)
        return res.json({ ok: true, deleted: false });
      next(err);
    }
  }
);

/**
 * ==================================
 *  البحث التقليدي في اليوميات (umgram_diarys)
 * ==================================
 *
 * GET /search/diary?q=...&op=and|or&size=&from=&lang=ar|en&userId=<uuid>
 * - نفس منطق العربي/الإنجليزي، لكن الحقول: title, content فقط.
 * - يمكن تقييد النتائج بـ userId (كلمة مفتاحية في المابّينغ).
 */
search.get(
  "/search/diary",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const qRaw = String(req.query.q ?? "");
      const size = clampInt(req.query.size as string | undefined, 20, 1, 100);
      const from = clampInt(req.query.from as string | undefined, 0, 0, 10_000);
      const op: QueryDslOperator =
        String(req.query.op ?? "or").toLowerCase() === "and" ? "and" : "or";
      const langParam = String(req.query.lang ?? "").toLowerCase();
      const userId = (req.query.userId ? String(req.query.userId) : "").trim();

      if (!qRaw.trim()) return res.json({ hits: [], total: 0 });

      const hasAdvancedOps = /[~"^|()+\-*]/.test(qRaw);
      const q = hasAdvancedOps ? qRaw.trim() : normalizeQuery(qRaw);

      const isArabic =
        langParam === "ar" ? true : langParam === "en" ? false : /[\u0600-\u06FF]/.test(q);

      // حقول اليوميات (كما في المابّينغ المقترح)
      const diaryFields = ["title^2", "content"];

      let baseQuery: QueryDslQueryContainer;

      if (hasAdvancedOps) {
        baseQuery = {
          simple_query_string: {
            query: q,
            fields: diaryFields as string[],
            default_operator: op,
          },
        };
      } else if (isArabic) {
        const tokens = q.split(/\s+/).filter(Boolean);

        const mm: QueryDslQueryContainer = {
          multi_match: {
            query: q,
            fields: diaryFields as string[],
            operator: op,
            type: "best_fields",
          },
        };

        const wildcardMust: QueryDslQueryContainer[] = tokens.map((t) => ({
          query_string: {
            query: `*${t}*`,
            fields: diaryFields as string[],
            default_operator: "and",
            analyze_wildcard: true as any,
          } as any,
        }));

        baseQuery =
          wildcardMust.length > 0
            ? { bool: { should: [mm, { bool: { must: wildcardMust } }], minimum_should_match: 1 } }
            : mm;
      } else {
        const engTokens = q.toLowerCase().match(/[a-z]+/g) ?? [];
        const hasShortToken = engTokens.some((t) => t.length < 3);

        baseQuery = {
          multi_match: {
            query: q,
            fields: diaryFields as string[],
            operator: op,
            type: "best_fields",
            fuzziness: (hasShortToken ? 1 : ("AUTO" as any)),
          },
        };
      }

      // فلتر userId إن وُجد
      const query: QueryDslQueryContainer = userId
        ? { bool: { must: [baseQuery, { term: { userId } }] } }
        : baseQuery;

      const result = await es.search({
        index: DIARY_INDEX,
        from,
        size,
        query,
        highlight: { fields: { title: {}, content: {} } },
      });

      const hits = (result.hits.hits ?? []).map((h: any) => ({
        id: h._id,
        score: h._score,
        ...(h._source ?? {}),
        highlight: h.highlight,
      }));
      const total =
        typeof result.hits.total === "number"
          ? result.hits.total
          : (result.hits.total as any)?.value ?? hits.length;

      res.json({ hits, total });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * فهرسة/حذف مستند يومية يدويًا (اختبار/أدوات).
 * POST /search/diary/index
 * DELETE /search/diary/:id
 */
search.post(
  "/search/diary/index",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, title, content, userId, createdAt, updatedAt } = req.body ?? {};
      if (!title) return res.status(400).json({ error: "title is required" });

      const doc = {
        title: String(title),
        content: content != null ? String(content) : "",
        userId: userId ? String(userId) : undefined,
        createdAt: createdAt
          ? new Date(createdAt).toISOString()
          : new Date().toISOString(),
        updatedAt: updatedAt
          ? new Date(updatedAt).toISOString()
          : new Date().toISOString(),
      };

      await es.index({
        index: DIARY_INDEX,
        ...(id ? { id: String(id) } : {}),
        document: doc,
        refresh: "wait_for",
      });

      return res.status(201).json({ ok: true, id: id ?? "(auto)" });
    } catch (err) {
      next(err);
    }
  }
);

search.delete(
  "/search/diary/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      await es.delete({ index: DIARY_INDEX, id, refresh: "wait_for" });
      res.json({ ok: true });
    } catch (err: any) {
      if (err?.meta?.statusCode === 404)
        return res.json({ ok: true, deleted: false });
      next(err);
    }
  }
);

// ===== Helpers =====
function normalizeQuery(q: string): string {
  return q.replace(/\b(AND|OR|&&|\|\|)\b/gi, " ").replace(/\s+/g, " ").trim();
}
function clampInt(
  v: string | undefined,
  def: number,
  min: number,
  max: number
): number {
  const n = v ? parseInt(v, 10) : def;
  if (Number.isNaN(n)) return def;
  return Math.max(min, Math.min(max, n));
}

export default search;
