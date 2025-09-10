#!/usr/bin/env node
require('dotenv').config();
const argon2 = require('argon2');
const { Pool, types } = require('pg');

(async () => {
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) throw new Error('Set DATABASE_URL in .env');
    types.setTypeParser(20, val => Number(val));
    const pool = new Pool({ connectionString: dbUrl, application_name: 'seed-admin2' });

    const username = 'admin2';
    const email = 'admin2@local';
    const password = 'admin2';

    const { rows: exist } = await pool.query('SELECT id, role FROM users WHERE username=$1 OR email=$2 LIMIT 1', [username, email]);
    if (exist[0]) {
      if (exist[0].role !== 'admin') {
        await pool.query('UPDATE users SET role=\'admin\', status=\'active\' WHERE id=$1', [exist[0].id]);
        console.log('Existing user upgraded to admin:', exist[0].id);
      } else {
        console.log('admin2 already exists:', exist[0].id);
      }
      await pool.end();
      process.exit(0);
    }

    const hash = await argon2.hash(password, { type: argon2.argon2id });
    const insertSql = `
      INSERT INTO users (email, username, display_name, password_hash, role, status, email_verified_at, last_login_at, meta)
      VALUES ($1,$2,$3,$4,$5,$6, now(), null, '{}')
      RETURNING id, email, username, role, status, created_at
    `;
    const vals = [email, username, 'Admin Two', hash, 'admin', 'active'];
    const { rows } = await pool.query(insertSql, vals);
    console.log('admin2 created:', rows[0]);
    await pool.end();
  } catch (e) {
    console.error('Seed admin2 failed:', e);
    process.exit(1);
  }
})();
