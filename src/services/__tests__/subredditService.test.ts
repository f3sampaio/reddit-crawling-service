import { getSubredditInfoService } from '../SubredditService';

jest.mock('puppeteer', () => ({
  launch: jest.fn().mockResolvedValue({
    newPage: jest.fn().mockResolvedValue({
      goto: jest.fn().mockResolvedValue(undefined),
      waitForSelector: jest.fn().mockResolvedValue(undefined),
      setUserAgent: jest.fn().mockResolvedValue(undefined),
      setViewport: jest.fn().mockResolvedValue(undefined),
      title: jest.fn().mockResolvedValue('Mock Title'),
      $eval: jest.fn().mockResolvedValue('Mock Title'),
      evaluate: jest.fn().mockResolvedValue({
        title: 'Mock Title',
        description: 'Mock Description',
        members: 123,
        online: 45,
        rules: []
      })
    }),
    close: jest.fn().mockResolvedValue(undefined),
    pages: jest.fn().mockResolvedValue([])
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
      online: 45,
      rules: []
    });
  });
}); 