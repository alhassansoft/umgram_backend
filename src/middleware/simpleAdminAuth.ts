// Simple admin middleware for testing
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function simpleAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.slice(7);
  
  try {
    // Try with JWT_ACCESS_SECRET first
    let secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
      secret = process.env.JWT_SECRET;
    }
    
    if (!secret) {
      return res.status(500).json({ error: 'JWT secret not configured' });
    }

    const decoded = jwt.verify(token, secret) as any;
    
    // Check if user has admin role
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    req.user = decoded;
    next();
  } catch (error: any) {
    console.log('JWT verification error:', error?.message || String(error));
    return res.status(401).json({ error: 'Invalid token' });
  }
}
