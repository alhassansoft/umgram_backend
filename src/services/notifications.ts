import { prisma } from "../lib/prisma";

// Simple id generator: timestamp + random base36
function genId(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
  );
}

// Detect Postgres "relation does not exist" (undefined_table) to auto-create on demand
function isUndefinedTableError(e: any): boolean {
  // Postgres error code 42P01 -> undefined_table
  return !!(e && (e.code === "42P01" || /relation .* does not exist/i.test(String(e.message || e))));
}

/** Ensure the Notification table exists (id, userId, type, requestId, message, createdAt, readAt) */
export async function ensureNotificationsTable(): Promise<void> {
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Notification" (
        id TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL,
        type TEXT NOT NULL,
        "requestId" TEXT,
        message TEXT,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "readAt" TIMESTAMPTZ
      );
    `);
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Notification_userId_createdAt_idx"
      ON "Notification" ("userId", "createdAt" DESC);
    `);
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Notification_userId_readAt_idx"
      ON "Notification" ("userId", "readAt");
    `);
  } catch (e) {
    // swallow; table may not be creatable due to permissions. Routes will still function if table exists.
    console.warn("[notifications] ensure table failed:", e);
  }
}

export type NotificationRow = {
  id: string;
  userId: string;
  type: string;
  requestId?: string | null;
  message?: string | null;
  createdAt: string;
  readAt?: string | null;
};

export async function createNotification(input: {
  userId: string;
  type: string; // e.g., CONSENT_MATCHED
  requestId?: string | null;
  message?: string | null;
}): Promise<string | null> {
  const id = genId();
  try {
    await prisma.$executeRawUnsafe(
      `INSERT INTO "Notification" (id, "userId", type, "requestId", message) VALUES ($1, $2, $3, $4, $5)`,
      id,
      input.userId,
      input.type,
      input.requestId ?? null,
      input.message ?? null
    );
    return id;
  } catch (e) {
    // If table is missing, try to create it and retry once
    if (isUndefinedTableError(e)) {
      try {
        await ensureNotificationsTable();
        await prisma.$executeRawUnsafe(
          `INSERT INTO "Notification" (id, "userId", type, "requestId", message) VALUES ($1, $2, $3, $4, $5)`,
          id,
          input.userId,
          input.type,
          input.requestId ?? null,
          input.message ?? null
        );
        return id;
      } catch (e2) {
        console.warn("[notifications] insert retry failed:", e2);
        return null;
      }
    }
    console.warn("[notifications] insert failed:", e);
    return null;
  }
}

export async function getUnreadCount(userId: string): Promise<number> {
  try {
    const rows = await prisma.$queryRawUnsafe<Array<{ count: string }>>(
      `SELECT COUNT(1)::text as count FROM "Notification" WHERE "userId" = $1 AND "readAt" IS NULL`,
      userId
    );
    const c = rows?.[0]?.count ? parseInt(rows[0].count, 10) : 0;
    return Number.isNaN(c) ? 0 : c;
  } catch {
    return 0;
  }
}

export async function listNotifications(userId: string, limit = 50): Promise<NotificationRow[]> {
  try {
    const rows = await prisma.$queryRawUnsafe<any[]>(
      `SELECT id, "userId", type, "requestId", message, "createdAt", "readAt" FROM "Notification"
       WHERE "userId" = $1
       ORDER BY "createdAt" DESC
       LIMIT ${Number(limit) || 50}`,
      userId
    );
    return (rows || []).map((r) => ({
      id: String(r.id),
      userId: String(r.userId ?? r.user_id ?? r.userId),
      type: String(r.type),
      requestId: r.requestId ? String(r.requestId) : null,
      message: r.message != null ? String(r.message) : null,
      createdAt: new Date(r.createdAt || r.created_at || Date.now()).toISOString(),
      readAt: r.readAt ? new Date(r.readAt).toISOString() : null,
    }));
  } catch (e) {
    if (isUndefinedTableError(e)) {
      await ensureNotificationsTable().catch(() => {});
      return [];
    }
    return [];
  }
}

export async function markRead(userId: string, ids?: string[] | null): Promise<number> {
  try {
    if (ids && ids.length) {
      const placeholders = ids.map((_, i) => `$${i + 2}`).join(", ");
      const sql = `UPDATE "Notification" SET "readAt" = now() WHERE "userId" = $1 AND id IN (${placeholders}) AND "readAt" IS NULL`;
      const res: any = await prisma.$executeRawUnsafe(sql, userId, ...ids);
      return typeof res === "number" ? res : 0;
    }
    const res: any = await prisma.$executeRawUnsafe(
      `UPDATE "Notification" SET "readAt" = now() WHERE "userId" = $1 AND "readAt" IS NULL`,
      userId
    );
    return typeof res === "number" ? res : 0;
  } catch (e) {
    if (isUndefinedTableError(e)) {
      await ensureNotificationsTable().catch(() => {});
      return 0;
    }
    return 0;
  }
}

/** Delete notifications for a user; if ids provided, delete only those, otherwise delete all for the user. */
export async function deleteNotifications(userId: string, ids?: string[] | null): Promise<number> {
  try {
    if (ids && ids.length) {
      const placeholders = ids.map((_, i) => `$${i + 2}`).join(", ");
      const sql = `DELETE FROM "Notification" WHERE "userId" = $1 AND id IN (${placeholders})`;
      const res: any = await prisma.$executeRawUnsafe(sql, userId, ...ids);
      return typeof res === "number" ? res : 0;
    }
    const res: any = await prisma.$executeRawUnsafe(
      `DELETE FROM "Notification" WHERE "userId" = $1`,
      userId
    );
    return typeof res === "number" ? res : 0;
  } catch (e) {
    if (isUndefinedTableError(e)) {
      await ensureNotificationsTable().catch(() => {});
      return 0;
    }
    return 0;
  }
}
