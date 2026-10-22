import { Request, Response, NextFunction } from 'express';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient.js';
import { UserRole } from '../types/index.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role: UserRole;
  };
}

export async function authMiddleware(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const demoRole = (req.headers['x-demo-role'] as UserRole) || 'coordinator';

  // 1. If Supabase is configured and Bearer token is provided
  if (isSupabaseConfigured && supabase && authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) {
        req.user = {
          id: user.id,
          email: user.email,
          role: (user.user_metadata?.role as UserRole) || 'coordinator',
        };
        return next();
      }
    } catch {
      // Fallback to demo mode if token expired or invalid
    }
  }

  // 2. Demo mode / local evaluation fallback
  req.user = {
    id: 'demo-user-id',
    email: 'coordinator@gramsetu.org',
    role: demoRole,
  };

  next();
}

export function requireRole(allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: `Access Denied: Requires one of [${allowedRoles.join(', ')}] role. Current role is "${req.user?.role || 'anonymous'}".`,
      });
      return;
    }
    next();
  };
}
