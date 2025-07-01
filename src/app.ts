import express from 'express';
import { subredditRouter } from './routes/subreddit';

export function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/subreddit-info', subredditRouter);
  return app;
} 