import 'dotenv/config';
import { Pool, QueryResult, types as pgTypes } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL is required in .env');

// (اختياري) تعامل مع BIGINT كرقم لو أرقامك صغيرة
pgTypes.setTypeParser(20, val => Number(val));

export const pool = new Pool({
  connectionString: DATABASE_URL,
  // production on Render/Neon/Heroku قد تحتاج:
  // ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  application_name: 'umgram-backend',
});

export function query<
  T extends import('pg').QueryResultRow = any
>(text: string, params?: any[]): Promise<QueryResult<T>> {
  if (process.env.NODE_ENV !== 'production') {
    // لوج خفيف وقت التطوير
    // console.log('SQL:', text, params ?? []);
  }
  return pool.query<T>(text, params);
}

// إغلاق أنيق (انتاج فقط): تجنب إغلاق الـ pool في التطوير لتفادي مشاكل ts-node-dev أثناء إعادة التحميل
if (process.env.NODE_ENV === 'production') {
  async function gracefulShutdown() {
    try {
      await pool.end();
      // console.log('PG pool closed');
    } finally {
      process.exit(0);
    }
  }
  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);
}

// اختياري: فحص اتصال سريع عند التشغيل
(async () => {
  try { await query('SELECT 1'); } catch (e) { console.error('DB connect fail:', e); }
})();
