import { query } from '../db';
import { DBUser } from '../types';

export async function findUserByEmail(email: string): Promise<DBUser | null> {
  const { rows } = await query<DBUser>('SELECT * FROM users WHERE email=$1 LIMIT 1', [email]);
  return rows[0] ?? null;
}

export async function findUserByUsername(username: string): Promise<DBUser | null> {
  const { rows } = await query<DBUser>('SELECT * FROM users WHERE lower(username)=lower($1) LIMIT 1', [username]);
  return rows[0] ?? null;
}

export async function createUser(params: {
  email: string;
  username: string;
  passwordHash: string;
  displayName?: string | null;
}): Promise<DBUser> {
  const { email, username, passwordHash, displayName = null } = params;
  const { rows } = await query<DBUser>(
    `INSERT INTO users (email, username, display_name, password_hash)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [email, username, displayName, passwordHash]
  );
  if (!rows[0]) {
    throw new Error('Failed to create user');
  }
  return rows[0];
}

export async function updateLastLogin(userId: string): Promise<void> {
  await query('UPDATE users SET last_login_at=now() WHERE id=$1', [userId]);
}
