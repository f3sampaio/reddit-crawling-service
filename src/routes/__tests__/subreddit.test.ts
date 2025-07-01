import request from 'supertest';
import { createApp } from '../../app';

jest.mock('../../services/subredditService', () => ({
  getSubredditInfoService: jest.fn().mockResolvedValue({
    name: 'test',
    title: 'Mock Title',
    description: 'Mock Description',
    members: 123,
    online: 45
  })
}));

describe('/subreddit-info route', () => {
  const app = createApp();

  it('should return 400 for missing subreddit', async () => {
    const res = await request(app).post('/subreddit-info').send({});
    expect(res.status).toBe(400);
  });

  it('should return 200 and info for valid subreddit', async () => {
    const res = await request(app).post('/subreddit-info').send({ subreddit: 'test' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      name: 'test',
      title: 'Mock Title',
      description: 'Mock Description',
      members: 123,
      online: 45
    });
  });
}); 