import { Request, Response } from 'express';
import { getSubredditInfoService } from '../services/subredditService';

export async function getSubredditInfoController(req: Request, res: Response) {
  const { subreddit } = req.body;
  if (!subreddit || typeof subreddit !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid subreddit name.' });
  }
  try {
    const info = await getSubredditInfoService(subreddit);
    res.json(info);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subreddit info.' });
  }
} 