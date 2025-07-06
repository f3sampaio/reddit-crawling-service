import { Page } from 'puppeteer';

// Description extraction service - Single Responsibility: Description extraction
export class DescriptionExtractionService {
  async extractDescription(page: Page): Promise<string> {
    console.log('📝 Starting description extraction');
    return await page.evaluate(() => {
      console.log('🔍 Looking for description in shadow DOM...');
      try {
        const translatorContent = document.querySelector("#i18n-subreddit-right-rail-translator-content");
        console.log('🔍 Translator content element:', translatorContent ? 'found' : 'not found');
        
        if (translatorContent) {
          const aside = translatorContent.querySelector("aside");
          console.log('🔍 Aside element:', aside ? 'found' : 'not found');
          
          if (aside) {
            const div = aside.querySelector("div");
            console.log('🔍 Div element:', div ? 'found' : 'not found');
            
            if (div) {
              const shredditHeader = div.querySelector("shreddit-subreddit-header");
              console.log('🔍 Shreddit header element:', shredditHeader ? 'found' : 'not found');
              
              if (shredditHeader && shredditHeader.shadowRoot) {
                console.log('🔍 Shadow root:', 'accessible');
                const descriptionElement = shredditHeader.shadowRoot.querySelector("#description");
                console.log('🔍 Description element in shadow DOM:', descriptionElement ? 'found' : 'not found');
                
                if (descriptionElement) {
                  const description = descriptionElement.textContent?.trim() || '';
                  console.log(`✅ Found description in shadow DOM: "${description}"`);
                  return description;
                } else {
                  console.log('❌ Description element not found in shadow DOM');
                }
              } else {
                console.log('❌ Shadow root not accessible');
              }
            }
          }
        }
      } catch (shadowError) {
        console.log('❌ Error accessing shadow DOM for description:', shadowError);
      }
      
      // Fallback to meta description
      console.log('🔄 Trying fallback: meta description');
      const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      console.log(`✅ Using meta description as fallback: "${metaDescription}"`);
      return metaDescription;
    });
  }
} 