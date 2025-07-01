import { getSubredditInfoService } from '../subredditService';

jest.mock('puppeteer', () => ({
  launch: jest.fn().mockResolvedValue({
    newPage: jest.fn().mockResolvedValue({
      goto: jest.fn().mockResolvedValue(undefined),
      waitForSelector: jest.fn().mockResolvedValue(undefined),
      evaluate: jest.fn().mockResolvedValue({
        title: 'Mock Title',
        description: 'Mock Description',
        members: 123,
        online: 45
      })
    }),
    close: jest.fn().mockResolvedValue(undefined)
  })
}));

describe('getSubredditInfoService', () => {
  it('should return subreddit info (mocked)', async () => {
    const result = await getSubredditInfoService('testsub');
    expect(result).toEqual({
      name: 'testsub',
      title: 'Mock Title',
      description: 'Mock Description',
      members: 123,
      online: 45
    });
  });
}); 