import puppeteer, { Browser, Page } from 'puppeteer';

// Interface for browser configuration
export interface BrowserConfig {
  headless: boolean;
  args: string[];
  userAgent: string;
  viewport: { width: number; height: number };
}

// Browser service class - Single Responsibility: Browser management
export class BrowserService {
  private config: BrowserConfig;

  constructor(config: BrowserConfig) {
    this.config = config;
  }

  async createBrowser(): Promise<Browser> {
    console.log('🔧 Creating browser with config:', JSON.stringify(this.config, null, 2));
    return await puppeteer.launch({
      headless: this.config.headless,
      args: this.config.args
    });
  }

  async setupPage(page: Page): Promise<void> {
    console.log('🔧 Setting up page with user agent and viewport');
    await page.setUserAgent(this.config.userAgent);
    await page.setViewport(this.config.viewport);
    console.log('✅ Page setup completed');
  }

  async closeBrowser(browser: Browser): Promise<void> {
    console.log('🔧 Closing browser');
    await browser.close();
    console.log('✅ Browser closed');
  }
} 