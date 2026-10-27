import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export function signToken(user) {
  return jwt.sign({ sub: String(user._id), email: user.email, role: user.role }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: { code: 'unauthorized', message: 'Sign in required' } });
  try {
    req.user = jwt.verify(token, config.jwtSecret);
    next();
  } catch {
    res.status(401).json({ error: { code: 'invalid_token', message: 'Session expired, sign in again' } });
  }
}
