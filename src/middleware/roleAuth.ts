// Role-based access control middleware
import { Request, Response, NextFunction } from 'express';
import { findUserById } from '../models/userModel';

// Check if user has specific role
export const requireRole = (allowedRoles: Array<'user' | 'admin' | 'supervisor'>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.sub) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Get fresh user data to ensure role is up to date
      const user = await findUserById(req.user.sub);
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ 
          error: 'Insufficient permissions',
          required: allowedRoles,
          current: user.role
        });
      }

      // Update req.user with fresh data
      req.user = {
        sub: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      };

      next();
    } catch (error) {
      console.error('Role check error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};

// Shorthand helpers for common role checks
export const requireAdmin = requireRole(['admin']);
export const requireSupervisorOrAdmin = requireRole(['supervisor', 'admin']);
export const requireAnyRole = requireRole(['user', 'supervisor', 'admin']);

// Check if user has admin privileges
export const isAdmin = (role: string): boolean => role === 'admin';

// Check if user has supervisor or admin privileges  
export const isSupervisorOrAdmin = (role: string): boolean => 
  role === 'supervisor' || role === 'admin';

// Get role hierarchy level (higher number = more permissions)
export const getRoleLevel = (role: 'user' | 'admin' | 'supervisor'): number => {
  switch (role) {
    case 'user': return 1;
    case 'supervisor': return 2;
    case 'admin': return 3;
    default: return 0;
  }
};

// Check if role1 has higher or equal privileges than role2
export const hasHigherOrEqualRole = (role1: string, role2: string): boolean => {
  return getRoleLevel(role1 as any) >= getRoleLevel(role2 as any);
};
