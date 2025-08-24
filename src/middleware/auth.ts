// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { type Secret, type JwtPayload } from 'jsonwebtoken';

const SECRET_ENV = process.env.JWT_ACCESS_SECRET;
if (!SECRET_ENV) {
  throw new Error('JWT_ACCESS_SECRET is required in .env');
}
// ✅ Narrow to the correct type for jsonwebtoken overloads
const SECRET: Secret = SECRET_ENV;

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    // jsonwebtoken.verify returns string | JwtPayload
    const decoded = jwt.verify(token, SECRET) as string | JwtPayload;

    // Normalize to the shape you augmented on Request (sub/email/username/role)
    const payload =
      typeof decoded === 'string'
        ? ({ sub: decoded } as any)
        : (decoded as any);

    req.user = payload; // matches your express.d.ts augmentation
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
