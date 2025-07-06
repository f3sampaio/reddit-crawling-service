import { SubredditInfo } from '../interfaces/SubredditInfo';
import { BrowserService, BrowserConfig } from './browser/BrowserService';
import { PageNavigationService, NavigationOptions } from './navigation/PageNavigationService';
import { TitleExtractionService } from './extraction/TitleExtractionService';
import { DescriptionExtractionService } from './extraction/DescriptionExtractionService';
import { MembersExtractionService } from './extraction/MembersExtractionService';
import { OnlineUsersExtractionService } from './extraction/OnlineUsersExtractionService';
import { RulesExtractionService } from './extraction/RulesExtractionService';
import { ErrorHandlingService } from './error/ErrorHandlingService';

// Main subreddit service - Orchestrates all services
export class SubredditService {
  private browserService: BrowserService;
  private navigationService: PageNavigationService;
  private titleExtractionService: TitleExtractionService;
  private descriptionExtractionService: DescriptionExtractionService;
  private membersExtractionService: MembersExtractionService;
  private onlineUsersExtractionService: OnlineUsersExtractionService;
  private rulesExtractionService: RulesExtractionService;
  private errorHandlingService: ErrorHandlingService;

  constructor() {
    const browserConfig: BrowserConfig = {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      ],
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 }
    };

    this.browserService = new BrowserService(browserConfig);
    this.navigationService = new PageNavigationService();
    this.titleExtractionService = new TitleExtractionService();
    this.descriptionExtractionService = new DescriptionExtractionService();
    this.membersExtractionService = new MembersExtractionService();
    this.onlineUsersExtractionService = new OnlineUsersExtractionService();
    this.rulesExtractionService = new RulesExtractionService();
    this.errorHandlingService = new ErrorHandlingService();
  }

  async getSubredditInfo(subreddit: string): Promise<SubredditInfo> {
    const url = `https://www.reddit.com/r/${subreddit}/`;
    console.log('🚀 Starting subreddit info extraction for:', subreddit);
    console.log('🌐 Target URL:', url);
    
    const browser = await this.browserService.createBrowser();
    
    try {
      const page = await browser.newPage();
      console.log('📄 Created new page');
      
      await this.browserService.setupPage(page);
      
      const navigationOptions: NavigationOptions = {
        waitUntil: 'networkidle2',
        timeout: 30000
      };
      
      await this.navigationService.navigateToPage(page, url, navigationOptions);
      
      // Wait for shadow DOM elements
      await this.navigationService.waitForShadowDOMElements(page);
      
      // Extract data
      console.log('📊 Starting data extraction...');
      const title = await this.extractTitleWithFallback(page);
      const description = await this.descriptionExtractionService.extractDescription(page);
      const members = await this.membersExtractionService.extractMembers(page);
      const online = await this.onlineUsersExtractionService.extractOnlineUsers(page);
      const rules = await this.rulesExtractionService.extractRules(page);

      console.log('📊 Extraction results:');
      console.log(`  Title: "${title}"`);
      console.log(`  Description: "${description}"`);
      console.log(`  Members: ${members}`);
      console.log(`  Online: ${online}`);
      console.log(`  Rules: ${rules.length} rules found`);

      return {
        name: subreddit,
        title,
        description,
        members,
        online,
        rules
      };
      
    } catch (error: unknown) {
      this.errorHandlingService.logError(error, { subreddit, url, browser });
      await this.errorHandlingService.logBrowserState(browser);
      throw error;
    } finally {
      await this.browserService.closeBrowser(browser);
    }
  }

  private async extractTitleWithFallback(page: any): Promise<string> {
    const titleStrategy = this.titleExtractionService.getTitleStrategy();
    return await this.titleExtractionService.extractTitle(page, titleStrategy);
  }
}

// Legacy function for backward compatibility
export async function getSubredditInfoService(subreddit: string): Promise<SubredditInfo> {
  const service = new SubredditService();
  return await service.getSubredditInfo(subreddit);
} 