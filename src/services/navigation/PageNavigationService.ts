import { Page } from 'puppeteer';

// Interface for page navigation options
export interface NavigationOptions {
  waitUntil: 'networkidle2' | 'domcontentloaded' | 'load';
  timeout: number;
}

// Page navigation service - Single Responsibility: Page navigation
export class PageNavigationService {
  async navigateToPage(page: Page, url: string, options: NavigationOptions): Promise<void> {
    console.log('🌐 Navigating to:', url);
    console.log('🌐 Navigation options:', JSON.stringify(options, null, 2));
    await page.goto(url, options);
    console.log('✅ Navigation completed');
  }

  async waitForElement(page: Page, selector: string, timeout: number): Promise<boolean> {
    try {
      console.log(`⏳ Waiting for element: ${selector} (timeout: ${timeout}ms)`);
      await page.waitForSelector(selector, { timeout });
      console.log(`✅ Element found: ${selector}`);
      return true;
    } catch (error) {
      console.log(`❌ Element not found: ${selector}`, error instanceof Error ? error.message : String(error));
      return false;
    }
  }

  async waitForShadowDOMElements(page: Page): Promise<void> {
    console.log('⏳ Waiting for shadow DOM elements...');
    try {
      await this.waitForElement(page, '#i18n-subreddit-right-rail-translator-content', 10000);
      console.log('✅ Found translator content element');
      
      // Wait a bit more for dynamic content to load
      console.log('⏳ Waiting for dynamic content to load...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Try to wait for rules section
      try {
        await page.waitForSelector('div[class*="rules"], div[class*="community"], div[class*="guidelines"]', { timeout: 5000 });
        console.log('✅ Found rules-related elements');
      } catch (rulesError) {
        console.log('⚠️ Rules elements not found, continuing...');
      }
    } catch (selectorError) {
      console.log('⚠️ Translator content element not found, continuing...');
    }
  }
} 