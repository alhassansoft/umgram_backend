import { prisma } from "../lib/prisma";

export async function ensureSearchHistoryTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "SearchHistory" (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'diary',
      query TEXT NOT NULL,
      mode TEXT NOT NULL,
      scope TEXT NOT NULL,
      method TEXT,
      requestId TEXT,
      status TEXT NOT NULL, -- WAITING | DONE
      hits JSONB,
      answer JSONB,
      createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_searchhistory_user_created ON "SearchHistory"(userId, createdAt DESC)`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_searchhistory_request ON "SearchHistory"(requestId)`);
}

export type HistoryItem = {
  id: string;
  userId: string;
  source: 'diary' | 'note' | 'chat' | 'microblog';
  query: string;
  mode: 'wide' | 'strict';
  scope: 'mine' | 'others' | 'all';
  method?: 'normal' | 'investigation' | null;
  requestId?: string | null;
  status: 'WAITING' | 'DONE';
  hits?: any[] | null;
  answer?: any | null;
  createdAt?: string;
};

export async function insertHistory(item: HistoryItem) {
  await ensureSearchHistoryTable();
  await prisma.$executeRaw`
    INSERT INTO "SearchHistory" (id, userId, source, query, mode, scope, method, requestId, status, hits, answer)
    VALUES (
      ${item.id}, ${item.userId}, ${item.source}, ${item.query}, ${item.mode}, ${item.scope}, ${item.method ?? null},
      ${item.requestId ?? null}, ${item.status}, ${item.hits ? JSON.stringify(item.hits) : null}::jsonb,
      ${item.answer ? JSON.stringify(item.answer) : null}::jsonb
    )
    ON CONFLICT (id) DO UPDATE SET
      userId = EXCLUDED.userId,
      source = EXCLUDED.source,
      query = EXCLUDED.query,
      mode = EXCLUDED.mode,
      scope = EXCLUDED.scope,
      method = EXCLUDED.method,
      requestId = EXCLUDED.requestId,
      status = EXCLUDED.status,
      hits = EXCLUDED.hits,
      answer = EXCLUDED.answer
  `;
}

export async function updateHistoryByRequestId(requestId: string, patch: Partial<HistoryItem>) {
  await ensureSearchHistoryTable();
  const sets: string[] = [];
  const params: any[] = [];
  if (patch.status) { sets.push(`status = $${sets.length + 1}`); params.push(patch.status); }
  if (patch.hits !== undefined) { sets.push(`hits = $${sets.length + 1}::jsonb`); params.push(patch.hits ? JSON.stringify(patch.hits) : null); }
  if (patch.answer !== undefined) { sets.push(`answer = $${sets.length + 1}::jsonb`); params.push(patch.answer ? JSON.stringify(patch.answer) : null); }
  if (!sets.length) return;
  const sql = `UPDATE "SearchHistory" SET ${sets.join(', ')} WHERE requestId = $${sets.length + 1}`;
  await prisma.$executeRawUnsafe(sql, ...params, requestId);
}

export async function listHistoryByUser(userId: string, source: string | undefined, limit = 50, offset = 0) {
  await ensureSearchHistoryTable();
  const src = source || 'diary';
  const rows = await prisma.$queryRaw<any[]>`
    SELECT * FROM "SearchHistory"
    WHERE userId = ${userId} AND source = ${src}
    ORDER BY createdAt DESC
    LIMIT ${Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 200) : 50}
    OFFSET ${Number.isFinite(offset) ? Math.max(offset, 0) : 0}
  `;
  return rows;
}

export async function deleteHistoryByUser(userId: string) {
  await ensureSearchHistoryTable();
  await prisma.$executeRaw`DELETE FROM "SearchHistory" WHERE userId = ${userId}`;
}

export async function deleteHistoryItem(userId: string, id: string) {
  await ensureSearchHistoryTable();
  await prisma.$executeRaw`DELETE FROM "SearchHistory" WHERE userId = ${userId} AND id = ${id}`;
}
