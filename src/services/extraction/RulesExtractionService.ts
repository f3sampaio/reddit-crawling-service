import { Page } from 'puppeteer';
import fs from 'fs';

// Rules extraction service - Single Responsibility: Rules extraction
export class RulesExtractionService {
  async extractRules(page: Page): Promise<string[]> {
    console.log('📋 Starting rules extraction');

    // Wait for rules to load
    await page.waitForSelector('faceplate-expandable-section-helper', { timeout: 10000 });

    // Dump the full HTML content for debugging
    const html = await page.content();
    try {
      fs.writeFileSync('debug-golpe.html', html);
      console.log('✅ Dumped full HTML to debug-golpe.html');
    } catch (err) {
      console.error('❌ Failed to write debug-golpe.html:', err);
    }

    // Robust extraction logic for rules
    return await page.evaluate(() => {
       return Array.from(document.querySelectorAll('faceplate-expandable-section-helper')).map(helper => {
        // Title
        const title = helper.querySelector('h2.i18n-translatable-text')?.textContent?.trim();
        // Description
        const descDiv = helper.querySelector('div[faceplate-auto-height-animator-content]');
        let description = '';
        if (descDiv) {
          description = Array.from(descDiv.querySelectorAll('p'))
            .map(p => p.textContent?.trim())
            .filter(Boolean)
            .join(' ');
        }
        if (title) {
          return description ? `${title}: ${description}` : title;
        }
        return null;
      }).filter((x): x is string => Boolean(x));
    });
  }
} 