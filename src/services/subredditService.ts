import { SubredditInfo } from '../interfaces/SubredditInfo';
import puppeteer from 'puppeteer';

export async function getSubredditInfoService(subreddit: string): Promise<SubredditInfo> {
  const url = `https://www.reddit.com/r/${subreddit}/`;
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Wait for the subreddit title to appear
    await page.waitForSelector('h1');

    const data = await page.evaluate(() => {
      const title = document.querySelector('h1')?.textContent?.trim() || '';
      const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      // Members and online users are in span elements with specific data-testid attributes
      let members = 0;
      let online = 0;
      const spans = Array.from(document.querySelectorAll('span'));
      for (const span of spans) {
        if (span.textContent?.includes('members')) {
          const prev = span.previousElementSibling as HTMLElement | null;
          if (prev && !isNaN(Number(prev.textContent?.replace(/,/g, '')))) {
            members = Number(prev.textContent?.replace(/,/g, ''));
          }
        }
        if (span.textContent?.includes('online')) {
          const prev = span.previousElementSibling as HTMLElement | null;
          if (prev && !isNaN(Number(prev.textContent?.replace(/,/g, '')))) {
            online = Number(prev.textContent?.replace(/,/g, ''));
          }
        }
      }
      return { title, description, members, online };
    });

    return {
      name: subreddit,
      ...data
    };
  } finally {
    await browser.close();
  }
} 