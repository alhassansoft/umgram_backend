import { prisma } from "../lib/prisma";

// Ensure the snapshots table exists (raw SQL to avoid Prisma migration during dev)
export async function ensureResultSnapshotsTable() {
  // Postgres syntax assumed
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "SearchResultSnapshot" (
      id TEXT PRIMARY KEY,
      requestId TEXT NOT NULL,
      requesterId TEXT NOT NULL,
      query TEXT NOT NULL,
      mode TEXT NOT NULL,
      scope TEXT NOT NULL,
      approvedCandidateUserId TEXT,
      isApproved BOOLEAN NOT NULL DEFAULT FALSE,
      hits JSONB,
      answer JSONB,
      createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_snapshot_req ON "SearchResultSnapshot"(requestId)`);
}

export type SnapshotPayload = {
  id: string; // requestId for convenience as snapshot id to be stable
  requestId: string;
  requesterId: string;
  query: string;
  mode: "wide" | "strict";
  scope: "mine" | "others" | "all";
  approvedCandidateUserId?: string | null;
  isApproved: boolean;
  hits: any[];
  answer?: any | null;
};

export async function upsertSnapshot(p: SnapshotPayload) {
  await ensureResultSnapshotsTable();
  const id = p.id || p.requestId;
  // Use parameterized query to avoid SQL injection and ensure proper binding
  await prisma.$executeRaw`
    INSERT INTO "SearchResultSnapshot" (id, requestId, requesterId, query, mode, scope, approvedCandidateUserId, isApproved, hits, answer)
    VALUES (${id}, ${p.requestId}, ${p.requesterId}, ${p.query}, ${p.mode}, ${p.scope}, ${p.approvedCandidateUserId ?? null}, ${!!p.isApproved}, ${JSON.stringify(p.hits ?? [])}::jsonb, ${p.answer ? JSON.stringify(p.answer) : null}::jsonb)
    ON CONFLICT (id) DO UPDATE SET
      requesterId = EXCLUDED.requesterId,
      query = EXCLUDED.query,
      mode = EXCLUDED.mode,
      scope = EXCLUDED.scope,
      approvedCandidateUserId = EXCLUDED.approvedCandidateUserId,
      isApproved = EXCLUDED.isApproved,
      hits = EXCLUDED.hits,
      answer = EXCLUDED.answer
  `;
}

export async function getSnapshotByRequestId(requestId: string) {
  await ensureResultSnapshotsTable();
  const rows = await prisma.$queryRaw<any[]>`
    SELECT * FROM "SearchResultSnapshot" WHERE requestId = ${requestId} ORDER BY createdAt DESC LIMIT 1
  `;
  return rows?.[0] || null;
}
