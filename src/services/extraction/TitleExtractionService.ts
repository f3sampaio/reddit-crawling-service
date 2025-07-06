import { Page } from 'puppeteer';

// Interface for selector strategy
export interface SelectorStrategy {
  selectors: string[];
  timeout: number;
}

// Title extraction service - Single Responsibility: Title extraction
export class TitleExtractionService {
  async extractTitle(page: Page, strategy: SelectorStrategy): Promise<string> {
    console.log('📝 Starting title extraction with strategy:', JSON.stringify(strategy, null, 2));
    
    for (const selector of strategy.selectors) {
      const found = await this.waitForElement(page, selector, strategy.timeout);
      if (found) {
        const title = await page.$eval(selector, (el) => el.textContent?.trim() || '');
        if (title) {
          console.log(`✅ Found title: "${title}" with selector: ${selector}`);
          return title;
        } else {
          console.log(`⚠️ Element found but no text content: ${selector}`);
        }
      }
    }
    
    // Fallback to page title
    console.log('🔄 Trying fallback: page title');
    const pageTitle = await page.title();
    const fallbackTitle = pageTitle.replace(' - Reddit', '').replace(' : ', ' - ');
    console.log(`✅ Using page title as fallback: "${fallbackTitle}"`);
    return fallbackTitle;
  }

  private async waitForElement(page: Page, selector: string, timeout: number): Promise<boolean> {
    try {
      await page.waitForSelector(selector, { timeout });
      return true;
    } catch {
      return false;
    }
  }

  getTitleStrategy(): SelectorStrategy {
    return {
      selectors: [
        'h1',
        '[data-testid="subreddit-title"]',
        '.subreddit-title',
        'h1[class*="title"]',
        'h1[class*="Title"]',
        '[class*="title"] h1',
        '[class*="Title"] h1'
      ],
      timeout: 5000
    };
  }
} 