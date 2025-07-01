import { getSubredditInfoController } from '../subredditController';
import * as service from '../../services/subredditService';
import { Request, Response } from 'express';

describe('getSubredditInfoController', () => {
  it('should return 400 if subreddit is missing', async () => {
    const req = { body: {} } as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any as Response;
    await getSubredditInfoController(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing or invalid subreddit name.' });
  });

  it('should call service and return info', async () => {
    const req = { body: { subreddit: 'test' } } as Request;
    const res = { json: jest.fn() } as any as Response;
    jest.spyOn(service, 'getSubredditInfoService').mockResolvedValue({
      name: 'test', title: 'Test', description: 'desc', members: 1, online: 1
    });
    await getSubredditInfoController(req, res);
    expect(res.json).toHaveBeenCalledWith({
      name: 'test', title: 'Test', description: 'desc', members: 1, online: 1
    });
  });
}); 