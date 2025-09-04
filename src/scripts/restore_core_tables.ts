import { readFileSync } from 'fs';
import path from 'path';
import { pool } from '../../src/db';

async function main() {
  const sqlPath = path.resolve(__dirname, '../../prisma/migrations/002_restore_core_tables/migration.sql');
  const sql = readFileSync(sqlPath, 'utf8');
  console.log('Applying restore_core_tables migration...');
  // Split by semicolon while preserving statements; here we execute as a single query to keep it simple.
  await pool.query(sql);
  console.log('Done.');
}

main().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
