import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { config } from './config.js';
import { connectDatabase, state } from './lib/db.js';
import router from './routes/index.js';
import { notFound, errorHandler } from './middleware/error.js';
import { ensureSeed } from './seed.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(compression());
const allowAnyOrigin = !config.clientOrigins.length || config.clientOrigins.includes('*');
app.use(cors({ origin: allowAnyOrigin ? true : config.clientOrigins, credentials: true }));
app.use(express.json({ limit: '1mb' }));
if (config.env !== 'test') app.use(morgan('dev'));

app.get('/api/health', (_req, res) => res.json({ data: { ok: true, driver: state.driver, env: config.env } }));
app.use('/api/v1', router);
app.use('/uploads', express.static(config.uploadsDir, { maxAge: '7d' }));

// Serve the built SPA in production (single-service deploy). When the front end is
// hosted separately, SERVE_CLIENT=false keeps this an API-only service.
const clientDist = path.resolve(__dirname, '../../client/dist');
if (config.serveClient && fs.existsSync(clientDist)) {
  app.use(express.static(clientDist, { maxAge: '1h' }));
  app.get(/^(?!\/api|\/uploads).*/, (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

// API-only mode: a plain root response beats a 404 for uptime checks and curl.
if (!(config.serveClient && fs.existsSync(clientDist))) {
  app.get('/', (_req, res) =>
    res.json({ data: { name: 'faysal-portfolio-api', health: '/api/health', api: '/api/v1' } }),
  );
}

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  await connectDatabase();
  await ensureSeed();
  app.listen(config.port, () => console.log(`[api] http://localhost:${config.port}  (store: ${state.driver})`));
};

start();

export default app;
