import { Page } from 'puppeteer';

// Online users extraction service - Single Responsibility: Online users extraction
export class OnlineUsersExtractionService {
  async extractOnlineUsers(page: Page): Promise<number> {
    console.log('👤 Starting online users extraction');
    return await page.evaluate(() => {
      console.log('🔍 Looking for online users in shadow DOM...');
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
                
                // Try the new specific selector
                const onlineElement = shredditHeader.shadowRoot.querySelector("#online");
                console.log('🔍 Online element with #online selector:', onlineElement ? 'found' : 'not found');
                
                if (onlineElement && onlineElement.textContent) {
                  const onlineText = onlineElement.textContent.trim();
                  console.log(`🔍 Raw online text: "${onlineText}"`);
                  
                  // Handle different formats (1.5K, 2.3M, etc.)
                  let onlineNumber = 0;
                  if (onlineText.includes('K')) {
                    onlineNumber = Number(onlineText.replace('K', '')) * 1000;
                  } else if (onlineText.includes('M')) {
                    onlineNumber = Number(onlineText.replace('M', '')) * 1000000;
                  } else {
                    onlineNumber = Number(onlineText.replace(/,/g, ''));
                  }
                  
                  console.log(`🔍 Parsed online number: ${onlineNumber}`);
                  
                  if (!isNaN(onlineNumber)) {
                    console.log(`✅ Found online users in shadow DOM: ${onlineNumber}`);
                    return onlineNumber;
                  } else {
                    console.log('❌ Failed to parse online number');
                  }
                } else {
                  console.log('❌ Online element not found or has no text content');
                  
                  // Log all elements with id for debugging
                  console.log('🔍 All elements with id in shadow DOM:');
                  const allElementsWithId = shredditHeader.shadowRoot.querySelectorAll('[id]');
                  allElementsWithId.forEach((element, index) => {
                    console.log(`  Element ${index}: id="${element.id}" text="${element.textContent?.trim()}"`);
                  });
                }
              } else {
                console.log('❌ Shadow root not accessible');
              }
            }
          }
        }
      } catch (shadowError) {
        console.log('❌ Error accessing shadow DOM for online users:', shadowError);
      }
      
      // Fallback method
      console.log('🔄 Trying fallback method for online users...');
      const spans = Array.from(document.querySelectorAll('span'));
      console.log(`🔍 Checking ${spans.length} spans for online users`);
      
      for (let i = 0; i < spans.length; i++) {
        const span = spans[i];
        const text = span.textContent?.trim();
        
        if (text?.includes('online')) {
          console.log(`✅ Found span with "online": "${text}"`);
          const prev = span.previousElementSibling as HTMLElement | null;
          console.log(`🔍 Previous element:`, prev ? `"${prev.textContent?.trim()}"` : 'null');
          
          if (prev && !isNaN(Number(prev.textContent?.replace(/,/g, '')))) {
            const online = Number(prev.textContent?.replace(/,/g, ''));
            console.log(`✅ Found online users with fallback method: ${online}`);
            return online;
          }
        }
      }
      
      console.log('❌ No online users found with any method');
      return 0;
    });
  }
} 