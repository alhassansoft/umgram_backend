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
  role?: 'user' | 'admin' | 'supervisor';
}): Promise<DBUser> {
  const { email, username, passwordHash, displayName = null, role = 'user' } = params;
  const { rows } = await query<DBUser>(
    `INSERT INTO users (email, username, display_name, password_hash, role)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [email, username, displayName, passwordHash, role]
  );
  if (!rows[0]) {
    throw new Error('Failed to create user');
  }
  return rows[0];
}

export async function updateLastLogin(userId: string): Promise<void> {
  await query('UPDATE users SET last_login_at=now() WHERE id=$1', [userId]);
}

export async function findUserById(userId: string): Promise<DBUser | null> {
  const { rows } = await query<DBUser>('SELECT * FROM users WHERE id=$1 LIMIT 1', [userId]);
  return rows[0] ?? null;
}

export async function updateUserRole(userId: string, role: 'user' | 'admin' | 'supervisor'): Promise<DBUser | null> {
  const { rows } = await query<DBUser>(
    'UPDATE users SET role=$2, updated_at=now() WHERE id=$1 RETURNING *',
    [userId, role]
  );
  return rows[0] ?? null;
}

export async function getUsersByRole(role: 'user' | 'admin' | 'supervisor'): Promise<DBUser[]> {
  const { rows } = await query<DBUser>('SELECT * FROM users WHERE role=$1 ORDER BY created_at DESC', [role]);
  return rows;
}

export async function getAllUsers(): Promise<DBUser[]> {
  const { rows } = await query<DBUser>('SELECT * FROM users ORDER BY created_at DESC');
  return rows;
}
