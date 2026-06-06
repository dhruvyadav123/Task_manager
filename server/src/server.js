import 'dotenv/config';
import app from './app.js';
import { connectDatabase } from './config/db.js';

const port = process.env.PORT || 5000;

if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  console.error('Missing required environment variables: MONGODB_URI or JWT_SECRET');
  process.exit(1);
}

await connectDatabase();

const server = app.listen(port, () => {
  console.log(`TaskFlow API running on http://localhost:${port}`);
});

const shutdown = (signal) => {
  console.log(`${signal} received. Closing server...`);
  server.close(() => process.exit(0));
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
