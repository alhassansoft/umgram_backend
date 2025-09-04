import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { createNotification, ensureNotificationsTable } from "../services/notifications";
import { upsertSnapshot } from "../services/resultCache";
import { requireAuth } from "../middleware/auth";
import { searchDiariesSemantic } from "../search/diarySearch";
import { selectAnswer } from "../services/answerSelector";

export const matchRoutes = Router();

// Lightweight DB fallback when Elasticsearch is disabled or unavailable
async function searchDiariesFallbackDB(
  q: string,
  opts: { scope: 'mine' | 'others' | 'all'; userId: string; limit?: number }
) {
  const limit = Math.max(1, Math.min(50, Number(opts.limit ?? 20)));
  const like = `%${q}%`;
  let where = `WHERE (title ILIKE $1 OR content ILIKE $1)`;
  const params: any[] = [like];
  if (opts.scope === 'mine') {
    where += ` AND user_id = $2`;
    params.push(opts.userId);
  } else if (opts.scope === 'others') {
    where += ` AND user_id <> $2`;
    params.push(opts.userId);
  }
  const rows: Array<{ id: string; user_id: string; title: string; content: string; updated_at: string }>
    = await (prisma as any).$queryRawUnsafe(
      `SELECT id, user_id, title, content, updated_at FROM diaries ${where} ORDER BY updated_at DESC LIMIT ${limit}`,
      ...params
    );
  return (rows || []).map((r) => ({
    _id: String(r.id),
    _score: 1.0,
    _source: {
      userId: String(r.user_id),
      title: String(r.title ?? ''),
      content: String(r.content ?? ''),
      updatedAt: new Date(r.updated_at || Date.now()).toISOString(),
      redacted: true, // treat as others by default; frontend hides content until approval
    },
  }));
}

async function getCandidateHits(q: string, opts: { mode: 'wide'|'strict'; scope: 'mine'|'others'|'all'; userId: string; limit?: number }) {
  const esDisabled = process.env.ENABLE_ELASTIC === 'false';
  let hits: any[] = [];
  if (!esDisabled) {
    try {
      hits = await searchDiariesSemantic(q, { mode: opts.mode, scope: opts.scope, userId: opts.userId });
    } catch (e) {
      // fall through to DB
      hits = [];
    }
  }
  if (esDisabled || hits.length === 0) {
    try {
      const dbHits = await searchDiariesFallbackDB(q, { scope: opts.scope, userId: opts.userId, limit: opts.limit ?? 20 });
      if (dbHits.length) return dbHits;
    } catch {}
  }
  return hits;
}

// Create a match request from a search query (scope=others)
matchRoutes.post("/api/match/request", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
  const userId = (req as any).user?.sub as string;
    const q = String(req.body?.q ?? "").trim();
    const modeParam = String(req.body?.mode ?? "").toLowerCase();
    const mode: "wide" | "strict" = modeParam === "strict" ? "strict" : "wide";
    const fast: boolean = Boolean(req.body?.fast);
    if (!q) return res.status(400).json({ error: "q is required" });

    // If fast mode requested, immediately create request and seed candidates async in the background
    if (fast) {
      const request = await prisma.matchRequest.create({ data: { requesterId: userId, query: q, mode: mode.toUpperCase() as any } });

      // Return quickly to the client
      res.json({ ok: true, requestId: request.id, candidatesSeeded: null, queued: true });

      // Fire-and-forget seeding (no blocking the response)
      setImmediate(async () => {
        try {
          // Ensure notifications table before we attempt to create any notifications
          await ensureNotificationsTable().catch(() => {});
          const t0 = Date.now();
          const hits = await getCandidateHits(q, { mode, scope: 'others', userId, limit: 20 });
          const top = hits.slice(0, 20);
          const data = top
            .map((h: any) => {
              const cid = String(h?._source?.userId || "");
              if (!cid || cid === userId) return null;
              return {
                requestId: request.id,
                candidateUserId: cid,
                sourceDocId: String(h?._id || ""),
                snippet: String(h?._source?.content || "").slice(0, 300),
              };
            })
            .filter(Boolean) as Array<{ requestId: string; candidateUserId: string; sourceDocId?: string | null; snippet?: string | null }>;
          if (data.length) {
            await prisma.matchCandidate.createMany({ data, skipDuplicates: true }).catch(() => {});
            // Notify each candidate user that there is a pending consent request
            try {
              const uniqCands = Array.from(new Set(data.map(d => d.candidateUserId)));
              await Promise.allSettled(
                uniqCands.map((uid) =>
                  createNotification({
                    userId: uid,
                    type: 'CONSENT_REQUEST',
                    requestId: request.id,
                    message: 'لديك طلب موافقة لعرض مذكرات قد تكون ذات صلة ببحث مستخدم آخر.'
                  })
                )
              );
            } catch {}
          }
          const dt = Date.now() - t0;
          // Best-effort: update request status to PENDING if we seeded anything
          if (data.length) {
            await prisma.matchRequest.update({ where: { id: request.id }, data: { status: 'PENDING' as any } }).catch(() => {});
          }
          console.log(`[match/request][fast] Seeded ${data.length} candidates in ${dt}ms for request ${request.id}`);
        } catch (e) {
          console.warn(`[match/request][fast] Background seeding failed:`, (e as any)?.message ?? e);
        }
      });
      return; // already responded
    }

    // Early verification on requester's own notes: if we can answer from own content, skip consent flow
    try {
      const ownHits = await searchDiariesSemantic(q, { mode, scope: 'mine', userId });
      const evalHits = (ownHits || []).slice(0, 10);
      if (evalHits.length) {
        // Negation-aware contradiction: if question is negated but own hits affirm the opposite, short-circuit
        if (isNegatedQuestion(q) && hasAffirmativeOwnEvidence(evalHits, q)) {
          return res.json({
            ok: true,
            shortCircuit: true,
            answer: { question: q, considered_count: evalHits.length, candidates: [], answers: [], final: { type: 'none', text: "I don't know" } }
          });
        }
        const result = await selectAnswer(q, evalHits, { temperature: 0 });
        const maxConf = Array.isArray((result as any).answers) && (result as any).answers.length
          ? Math.max(...(result as any).answers.map((a: any) => Number(a.confidence || 0)))
          : 0;
        const hasDirect = !!(result as any).final?.text && (result as any).final?.type !== 'none';
        if (hasDirect && maxConf >= 0.45) {
          return res.json({ ok: true, shortCircuit: true, answer: result });
        }
      }
    } catch {
      // ignore early verification failures and continue with consent path
    }

    // create request
    const request = await prisma.matchRequest.create({ data: { requesterId: userId, query: q, mode: mode.toUpperCase() as any } });

    // fetch candidates from others scope
    const t0 = Date.now();
  const hits = await getCandidateHits(q, { mode, scope: 'others', userId, limit: 20 });
    const top = hits.slice(0, 20);
    const data = top
      .map((h: any) => {
        const cid = String(h?._source?.userId || "");
        if (!cid || cid === userId) return null;
        return {
          requestId: request.id,
          candidateUserId: cid,
          sourceDocId: String(h?._id || ""),
          snippet: String(h?._source?.content || "").slice(0, 300),
        };
      })
      .filter(Boolean) as Array<{ requestId: string; candidateUserId: string; sourceDocId?: string | null; snippet?: string | null }>;
    if (data.length) {
      // Ensure notifications table before we attempt to create any notifications
      await ensureNotificationsTable().catch(() => {});
      await prisma.matchCandidate.createMany({ data, skipDuplicates: true }).catch(() => {});
      // Notify each candidate user that there is a pending consent request
      try {
        const uniqCands = Array.from(new Set(data.map(d => d.candidateUserId)));
        await Promise.allSettled(
          uniqCands.map((uid) =>
            createNotification({
              userId: uid,
              type: 'CONSENT_REQUEST',
              requestId: request.id,
              message: 'لديك طلب موافقة لعرض مذكرات قد تكون ذات صلة ببحث مستخدم آخر.'
            })
          )
        );
      } catch {}
    }
    const dt = Date.now() - t0;
    res.json({ ok: true, requestId: request.id, candidatesSeeded: data.length, tookMs: dt });
  } catch (err) { next(err); }
});

// List pending approvals for the authenticated user (they are potential candidates)
matchRoutes.get("/api/match/pending", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
  const userId = (req as any).user?.sub as string;
    const pend = await prisma.matchCandidate.findMany({
      where: { candidateUserId: userId, status: "PENDING" as any },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    res.json({ items: pend });
  } catch (err) { next(err); }
});

// Pending approvals count (for badge)
matchRoutes.get("/api/match/pending/count", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.sub as string;
    const count = await prisma.matchCandidate.count({ where: { candidateUserId: userId, status: "PENDING" as any } });
    res.json({ count });
  } catch (err) { next(err); }
});

// Approve or deny a candidate request
matchRoutes.post("/api/match/decide", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
  const userId = (req as any).user?.sub as string;
    const candidateId = String(req.body?.candidateId ?? "");
    const decision = String(req.body?.decision ?? "").toLowerCase(); // 'approve' | 'deny'
    if (!candidateId) return res.status(400).json({ error: "candidateId is required" });
    if (!['approve','deny'].includes(decision)) return res.status(400).json({ error: "decision must be approve|deny" });

    const cand = await prisma.matchCandidate.findUnique({ where: { id: candidateId } });
    if (!cand || cand.candidateUserId !== userId) return res.status(404).json({ error: "not found" });

    const status = decision === 'approve' ? 'APPROVED' : 'DENIED';
    await prisma.matchCandidate.update({ where: { id: candidateId }, data: { status: status as any, decidedAt: new Date() } });

  if (status === 'APPROVED') {
      // set request status MATCHED if not already; store approvedCandidateId
      const updated = await prisma.matchRequest.update({ where: { id: cand.requestId }, data: { status: 'MATCHED' as any, approvedCandidateId: candidateId } }).catch(() => null);
      // Optional: close all other candidates for this request to stop further prompts
      await prisma.matchCandidate.updateMany({ where: { requestId: cand.requestId, id: { not: candidateId }, status: 'PENDING' as any }, data: { status: 'DENIED' as any, decidedAt: new Date() } }).catch(() => {});
      // Create a notification to the requester that a match was approved
      try {
        const request = updated ?? (await prisma.matchRequest.findUnique({ where: { id: cand.requestId } }));
        if (request) {
          await createNotification({
            userId: request.requesterId,
            type: 'CONSENT_MATCHED',
            requestId: request.id,
            message: 'تمت الموافقة على طلب المطابقة وتم العثور على نتائج متاحة.'
          });
          // Seed a minimal snapshot record; actual hits/answer will be filled on first fetch
          await upsertSnapshot({
            id: request.id,
            requestId: request.id,
            requesterId: request.requesterId,
            query: request.query,
            mode: ((request as any).mode?.toString().toLowerCase() === 'strict' ? 'strict' : 'wide') as any,
            scope: 'all',
            approvedCandidateUserId: cand.candidateUserId,
            isApproved: true,
            hits: [],
            answer: null,
          });
          // Precompute snapshot (hits + optional answer) in background for instant open from notification
          setImmediate(async () => {
            try {
              const mode: 'wide'|'strict' = ((request as any).mode?.toString().toLowerCase() === 'strict') ? 'strict' : 'wide';
              const baseHits = await searchDiariesSemantic(request.query, { mode, scope: 'all', userId: request.requesterId });
              const filtered = (baseHits || []).filter((h: any) => {
                const ownerId = String(h?._source?.userId || '');
                return ownerId === String(request.requesterId) || ownerId === String(cand.candidateUserId);
              });
              // Best-effort answer selection from top hits
              let computedAnswer: any = null;
              try {
                const top = filtered.slice(0, 10);
                if (top.length) {
                  computedAnswer = await selectAnswer(request.query, top, { temperature: 0 });
                }
              } catch {}
              await upsertSnapshot({
                id: request.id,
                requestId: request.id,
                requesterId: request.requesterId,
                query: request.query,
                mode,
                scope: 'all',
                approvedCandidateUserId: cand.candidateUserId,
                isApproved: true,
                hits: filtered,
                answer: computedAnswer ?? null,
              });
              console.log(`[match/decide][approve] Precomputed snapshot for request ${request.id} with ${filtered.length} hits`);
            } catch (e) {
              console.warn(`[match/decide][approve] Snapshot precompute failed for request ${cand.requestId}:`, (e as any)?.message ?? e);
            }
          });
        }
      } catch {}
    } else {
      // On denial, auto-advance by checking remaining candidates
      const remaining = await prisma.matchCandidate.count({ where: { requestId: cand.requestId, status: 'PENDING' as any } });
      if (remaining > 0) {
        await prisma.matchRequest.update({ where: { id: cand.requestId }, data: { status: 'PENDING' as any } }).catch(() => {});
      } else {
        // if none left and no approved, mark NOT_FOUND
        const anyApproved = await prisma.matchCandidate.count({ where: { requestId: cand.requestId, status: 'APPROVED' as any } });
        if (anyApproved === 0) {
          await prisma.matchRequest.update({ where: { id: cand.requestId }, data: { status: 'NOT_FOUND' as any } }).catch(() => {});
        }
      }
    }

    res.json({ ok: true });
  } catch (err) { next(err); }
});

// Get request status (for requester to poll)
matchRoutes.get("/api/match/request/:id", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
  const userId = (req as any).user?.sub as string;
    const id = String(req.params.id);
    const r = await prisma.matchRequest.findUnique({ where: { id }, include: { candidates: true } });
    if (!r || r.requesterId !== userId) return res.status(404).json({ error: "not found" });

    let status = r.status;
    if (r.approvedCandidateId) {
      status = 'MATCHED' as any;
    } else {
      const anyPending = r.candidates.some(c => c.status === ('PENDING' as any));
      const anyApproved = r.candidates.some(c => c.status === ('APPROVED' as any));
      if (anyApproved) status = 'MATCHED' as any;
      else if (anyPending) status = 'PENDING' as any;
      else status = 'NOT_FOUND' as any;
    }

    if (status !== r.status) {
      await prisma.matchRequest.update({ where: { id: r.id }, data: { status } }).catch(() => {});
    }

    res.json({ ...r, status });
  } catch (err) { next(err); }
});

export default matchRoutes;

// --- Local helpers (lightweight heuristics) ---------------------------------
function isNegatedQuestion(text: string) {
  const t = (text || '').toLowerCase();
  return /(\bdon't\b|\bdo not\b|\bnot\b|\bno\b|\bnever\b|\bما\s+أريد\b|\bلا\s+أريد\b|\bلا\s+أُريد\b|\bلا\b)/.test(t);
}

function hasAffirmativeOwnEvidence(hits: any[], q: string) {
  const qTokens = (q || '').toLowerCase().split(/\s+/).filter(Boolean);
  const affirmWords = ['finish', 'finished', 'complete', 'completed', 'affirmative', 'yes', 'ended', 'i finish', 'i finished'];
  for (const h of (hits || [])) {
    const s = String(h?._source?.content || h?._source?.title || '').toLowerCase();
    if (!s) continue;
    const hasAffirm = affirmWords.some(w => s.includes(w));
    if (!hasAffirm) continue;
    if (qTokens.some(tok => tok.length > 2 && s.includes(tok))) return true;
  }
  return false;
}
