// src/services/authService.ts
import argon2 from 'argon2';
import jwt, { type Secret, type SignOptions, type JwtPayload } from 'jsonwebtoken';
import { createUser, findUserByEmail, findUserByUsername, updateLastLogin } from '../models/userModel';
import { SafeUser } from '../types';

const ACCESS_SECRET_ENV  = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET_ENV = process.env.JWT_REFRESH_SECRET;

if (!ACCESS_SECRET_ENV || !REFRESH_SECRET_ENV) {
  throw new Error('JWT_ACCESS_SECRET and JWT_REFRESH_SECRET are required in .env');
}

const ACCESS_SECRET: Secret  = ACCESS_SECRET_ENV as Secret;
const REFRESH_SECRET: Secret = REFRESH_SECRET_ENV as Secret;

// Type options so sign() picks the right overload
const ACCESS_OPTS: SignOptions  = { expiresIn: (process.env.JWT_ACCESS_EXPIRES ?? '15m') as any };
const REFRESH_OPTS: SignOptions = { expiresIn: (process.env.JWT_REFRESH_EXPIRES ?? '30d') as any };

type Payload = { sub: string; email?: string; username?: string; role?: string };

const signAccess  = (p: Payload) => jwt.sign(p, ACCESS_SECRET,  ACCESS_OPTS);
const signRefresh = (p: Payload) => jwt.sign(p, REFRESH_SECRET, REFRESH_OPTS);

export async function register(params: { email: string; username: string; password: string; displayName?: string | null; }) {
  if (await findUserByEmail(params.email))      { const e = new Error('Email already in use');    (e as any).status = 409; throw e; }
  if (await findUserByUsername(params.username)){ const e = new Error('Username already in use'); (e as any).status = 409; throw e; }

  const passwordHash = await argon2.hash(params.password, { type: argon2.argon2id });

  // normalize displayName to never be undefined (only string | null)
  const user = await createUser({
    email: params.email,
    username: params.username,
    passwordHash,
    displayName: params.displayName ?? null,
  });

  const payload: Payload = { sub: user.id, email: user.email, username: user.username, role: user.role };
  const accessToken  = signAccess(payload);
  const refreshToken = signRefresh({ sub: user.id });

  const safeUser: SafeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
    display_name: user.display_name,
    profile_image: user.profile_image,
    role: user.role,
    status: user.status,
    created_at: user.created_at,
  };

  return { user: safeUser, accessToken, refreshToken };
}

export async function login(params: { identifier: string; password: string; }) {
  // 1) Fetch user
  const user = params.identifier.includes('@')
    ? await findUserByEmail(params.identifier)
    : await findUserByUsername(params.identifier);

  // 2) Separate guards so TS can narrow `user`
  if (!user) {
    const e = new Error('Invalid credentials'); (e as any).status = 401; throw e;
  }

  const ok = await argon2.verify(user.password_hash, params.password);
  if (!ok) {
    const e = new Error('Invalid credentials'); (e as any).status = 401; throw e;
  }

  await updateLastLogin(user.id);

  const payload: Payload = { sub: user.id, email: user.email, username: user.username, role: user.role };

  const safeUser: SafeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
    display_name: user.display_name,
    profile_image: user.profile_image,
    role: user.role,
    status: user.status,
    created_at: user.created_at,
  };

  return {
    user: safeUser,
    accessToken:  signAccess(payload),
    refreshToken: signRefresh({ sub: user.id }),
  };
}

export function rotateTokens(oldRefreshToken: string) {
  try {
    const decoded = jwt.verify(oldRefreshToken, REFRESH_SECRET) as JwtPayload;
    const sub = decoded.sub as string;
    return { accessToken: signAccess({ sub }), refreshToken: signRefresh({ sub }) };
  } catch {
    const e = new Error('Invalid refresh token'); (e as any).status = 401; throw e;
  }
}
