import { Router, RequestHandler } from 'express';
import { getSubredditInfoController } from '../controllers/subredditController';

export const subredditRouter = Router();

subredditRouter.post('/', getSubredditInfoController as RequestHandler); 