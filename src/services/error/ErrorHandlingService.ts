import { Browser } from 'puppeteer';

// Error handling service - Single Responsibility: Error handling
export class ErrorHandlingService {
  logError(error: unknown, context: { subreddit: string; url: string; browser?: Browser }): void {
    console.error('=== SUBREDDIT SERVICE ERROR ===');
    console.error('Subreddit:', context.subreddit);
    console.error('URL:', context.url);
    console.error('Error Type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error Message:', error instanceof Error ? error.message : String(error));
    console.error('Error Stack:', error instanceof Error ? error.stack : 'No stack trace available');
    
    if (error instanceof Error) {
      console.error('Error Name:', error.name);
    }
    
    console.error('=== END ERROR LOG ===');
  }

  async logBrowserState(browser: Browser): Promise<void> {
    try {
      const pages = await browser.pages();
      console.error('Number of open pages:', pages.length);
      
      if (pages.length > 0) {
        const currentUrl = await pages[0].url();
        console.error('Current page URL:', currentUrl);
        
        const pageTitle = await pages[0].title();
        console.error('Current page title:', pageTitle);
      }
    } catch (browserError: unknown) {
      console.error('Could not get browser state:', browserError instanceof Error ? browserError.message : String(browserError));
    }
  }
} 