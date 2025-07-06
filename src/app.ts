import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { subredditRouter } from './routes/subreddit';
import { healthRouter } from './routes/health';
import { specs } from './config/swagger';

export function createApp() {
  const app = express();
  app.use(express.json());
  
  // Swagger documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  
  // Health check endpoint
  app.use('/health', healthRouter);
  
  // Subreddit API endpoints
  app.use('/api/subreddit', subredditRouter);
  return app;
} 