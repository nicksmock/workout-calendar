import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { query } from '../db/connection';
import { generateToken } from '../middleware/auth';

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password }: LoginRequest = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }

    // Find user by username
    const result = await query(
      'SELECT id, username, email, password_hash, full_name, is_active FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    const user = result.rows[0];

    // Check if user is active
    if (!user.is_active) {
      res.status(403).json({ error: 'Account is inactive' });
      return;
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    // Update last login
    await query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [
      user.id,
    ]);

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
    });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, fullName }: RegisterRequest = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ error: 'Username, email, and password are required' });
      return;
    }

    // Check if username already exists
    const existingUser = await query('SELECT id FROM users WHERE username = $1 OR email = $2', [
      username,
      email,
    ]);

    if (existingUser.rows.length > 0) {
      res.status(409).json({ error: 'Username or email already exists' });
      return;
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await query(
      `INSERT INTO users (username, email, password_hash, full_name)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, email, full_name`,
      [username, email, passwordHash, fullName || null]
    );

    const newUser = result.rows[0];

    // Create default user preferences
    await query(
      'INSERT INTO user_preferences (user_id) VALUES ($1)',
      [newUser.id]
    );

    // Generate JWT token
    const token = generateToken({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
    });

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.full_name,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    const result = await query(
      `SELECT u.id, u.username, u.email, u.full_name, u.created_at, u.last_login,
              up.theme, up.weight_unit, up.distance_unit, up.timezone
       FROM users u
       LEFT JOIN user_preferences up ON u.id = up.user_id
       WHERE u.id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
