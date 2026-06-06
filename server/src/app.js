import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';

const app = express();
const exactAllowedOrigins = new Set(
  process.env.CLIENT_URL
  ?.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)
);

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const wildcardToRegExp = (pattern) =>
  new RegExp(`^${escapeRegExp(pattern).replace(/\\\*/g, '.*')}$`);

const allowedOriginPatterns = [
  /^http:\/\/localhost(?::\d+)?$/,
  /^http:\/\/127\.0\.0\.1(?::\d+)?$/,
  /^https:\/\/(?:.+\.)?vercel\.app$/
];

const extraOriginPatterns = process.env.CLIENT_URL_PATTERNS
  ?.split(',')
  .map((pattern) => pattern.trim())
  .filter(Boolean)
  .map(wildcardToRegExp);

if (extraOriginPatterns?.length) {
  allowedOriginPatterns.push(...extraOriginPatterns);
}

const isOriginAllowed = (origin) => {
  if (!origin) {
    return true;
  }

  if (exactAllowedOrigins.has(origin)) {
    return true;
  }

  return allowedOriginPatterns.some((pattern) => pattern.test(origin));
};

const corsOptions = {
  origin(origin, callback) {
    return callback(null, isOriginAllowed(origin));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type']
};

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true }));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true }));

app.get('/api/health', (_req, res) => res.json({ success: true, status: 'healthy' }));
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
