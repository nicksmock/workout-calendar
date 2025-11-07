import { Request, Response, NextFunction } from 'express';

// Single-user application - hardcoded user ID from seed data
const DEFAULT_USER = {
  id: '550e8400-e29b-41d4-a716-446655440001',
  username: 'sarah',
  email: 'sarah@example.com',
};

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

// Simple middleware that sets the default user for all requests
export const authenticateToken = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  req.user = DEFAULT_USER;
  next();
};

// Deprecated: No longer generates tokens (kept for backward compatibility)
export const generateToken = (_user: {
  id: string;
  username: string;
  email: string;
}): string => {
  return '';
};
