import { pool } from '../../src/db';

const tables = [
  'users','diaries','notes','entity_extractions','extraction_terms',
  'memory_tables','memory_columns','memory_rows',
  'direct_conversations','direct_conversation_participants','direct_messages',
  'user_circles','user_circle_messages','query_expansions','action_synonyms'
];

async function exists(table: string) {
  const { rows } = await pool.query<{ exists: boolean }>(
    `SELECT EXISTS (
       SELECT FROM information_schema.tables
       WHERE table_schema='public' AND table_name=$1
     ) AS exists`, [table]
  );
  return rows[0]?.exists ?? false;
}

async function main() {
  for (const t of tables) {
    try {
      const ok = await exists(t);
      process.stdout.write(`${t}: ${ok ? 'OK' : 'MISSING'}\n`);
    } catch (e: any) {
      process.stdout.write(`${t}: ERR ${e.message}\n`);
    }
  }
  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
