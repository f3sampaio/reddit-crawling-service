import { Router, RequestHandler } from 'express';

export const subredditRouter = Router();

// GET endpoint with subreddit name as URL parameter (RESTful)
subredditRouter.get('/:subreddit', (async (req, res) => {
  const { subreddit } = req.params;
  if (!subreddit || typeof subreddit !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid subreddit name.' });
  }
  try {
    const { getSubredditInfoService } = await import('../services/SubredditService');
    const info = await getSubredditInfoService(subreddit);
    res.json(info);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subreddit info.' });
  }
}) as RequestHandler); 