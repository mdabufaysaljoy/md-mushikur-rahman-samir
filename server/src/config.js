import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const config = {
  port: Number(process.env.PORT || 5050),
  env: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || 'dev-only-insecure-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  admin: {
    email: (process.env.ADMIN_EMAIL || 'admin@faysaljoy.dev').toLowerCase(),
    password: process.env.ADMIN_PASSWORD || 'Admin@12345',
  },
  clientOrigins: (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),
  // API-only deploy (front end hosted elsewhere): set SERVE_CLIENT=false.
  serveClient: (process.env.SERVE_CLIENT || 'true') !== 'false',
  dataDir: path.resolve(__dirname, '../data'),
  uploadsDir: path.resolve(__dirname, '../uploads'),
};
