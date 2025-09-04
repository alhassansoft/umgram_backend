import 'dotenv/config';
import { query } from '../db';

async function run() {
  console.log('[microblog] creating tables if not exist...');

  // posts
  await query(`
    CREATE TABLE IF NOT EXISTS microblog_posts (
      id BIGSERIAL PRIMARY KEY,
      text TEXT NOT NULL,
      user_id TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
  await query(`CREATE INDEX IF NOT EXISTS idx_microblog_posts_created_at ON microblog_posts (created_at DESC);`);

  // likes
  await query(`
    CREATE TABLE IF NOT EXISTS microblog_likes (
      post_id BIGINT NOT NULL REFERENCES microblog_posts(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (post_id, user_id)
    );
  `);

  // replies (basic, future use)
  await query(`
    CREATE TABLE IF NOT EXISTS microblog_replies (
      id BIGSERIAL PRIMARY KEY,
      post_id BIGINT NOT NULL REFERENCES microblog_posts(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL,
      text TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  console.log('[microblog] done');
}

run().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
