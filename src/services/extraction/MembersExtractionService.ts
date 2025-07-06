import { Page } from 'puppeteer';

// Members extraction service - Single Responsibility: Members count extraction
export class MembersExtractionService {
  async extractMembers(page: Page): Promise<number> {
    console.log('👥 Starting members count extraction');
    return await page.evaluate(() => {
      console.log('🔍 Looking for members count in shadow DOM...');
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
                const subscribersElement = shredditHeader.shadowRoot.querySelector("#subscribers");
                console.log('🔍 Subscribers element with #subscribers selector:', subscribersElement ? 'found' : 'not found');
                
                if (subscribersElement && subscribersElement.textContent) {
                  const subscribersText = subscribersElement.textContent.trim();
                  console.log(`🔍 Raw subscribers text: "${subscribersText}"`);
                  
                  // Handle different formats (179K, 1.2M, etc.)
                  let subscribersNumber = 0;
                  if (subscribersText.includes('K')) {
                    subscribersNumber = Number(subscribersText.replace('K', '')) * 1000;
                  } else if (subscribersText.includes('M')) {
                    subscribersNumber = Number(subscribersText.replace('M', '')) * 1000000;
                  } else {
                    subscribersNumber = Number(subscribersText.replace(/,/g, ''));
                  }
                  
                  console.log(`🔍 Parsed subscribers number: ${subscribersNumber}`);
                  
                  if (!isNaN(subscribersNumber)) {
                    console.log(`✅ Found members count in shadow DOM: ${subscribersNumber}`);
                    return subscribersNumber;
                  } else {
                    console.log('❌ Failed to parse subscribers number');
                  }
                } else {
                  console.log('❌ Subscribers element not found or has no text content');
                  
                  // Try the old specific selector as fallback
                  console.log('🔄 Trying old selector as fallback...');
                  const membersSelector = "div > div.flex.flex-wrap.text-left.subscribers.mt-xs.gap-2xs > div:nth-child(1) > span.text-neutral-content-strong";
                  const membersElement = shredditHeader.shadowRoot.querySelector(membersSelector);
                  console.log('🔍 Members element with old selector:', membersElement ? 'found' : 'not found');
                  
                  if (membersElement && membersElement.textContent) {
                    const membersText = membersElement.textContent.trim();
                    console.log(`🔍 Raw members text: "${membersText}"`);
                    const membersNumber = Number(membersText.replace(/,/g, ''));
                    console.log(`🔍 Parsed members number: ${membersNumber}`);
                    
                    if (!isNaN(membersNumber)) {
                      console.log(`✅ Found members count with old selector: ${membersNumber}`);
                      return membersNumber;
                    } else {
                      console.log('❌ Failed to parse members number');
                    }
                  } else {
                    console.log('❌ Members element not found with old selector');
                    
                    // Try alternative selectors
                    console.log('🔄 Trying alternative selectors...');
                    const alternativeSelectors = [
                      "span.text-neutral-content-strong",
                      "div.flex.flex-wrap.text-left.subscribers span",
                      "span[class*='text-neutral-content-strong']",
                      "div[class*='subscribers'] span"
                    ];
                    
                    for (const altSelector of alternativeSelectors) {
                      console.log(`🔍 Trying alternative selector: ${altSelector}`);
                      const altElement = shredditHeader.shadowRoot.querySelector(altSelector);
                      if (altElement && altElement.textContent) {
                        const altText = altElement.textContent.trim();
                        console.log(`🔍 Alternative element text: "${altText}"`);
                        const altNumber = Number(altText.replace(/,/g, ''));
                        if (!isNaN(altNumber)) {
                          console.log(`✅ Found members count with alternative selector: ${altNumber}`);
                          return altNumber;
                        }
                      }
                    }
                    
                    // Log all spans in shadow DOM for debugging
                    console.log('🔍 All spans in shadow DOM:');
                    const allSpans = shredditHeader.shadowRoot.querySelectorAll('span');
                    allSpans.forEach((span, index) => {
                      console.log(`  Span ${index}: "${span.textContent?.trim()}" (classes: ${span.className})`);
                    });
                    
                    // Log all elements with id for debugging
                    console.log('🔍 All elements with id in shadow DOM:');
                    const allElementsWithId = shredditHeader.shadowRoot.querySelectorAll('[id]');
                    allElementsWithId.forEach((element, index) => {
                      console.log(`  Element ${index}: id="${element.id}" text="${element.textContent?.trim()}"`);
                    });
                  }
                }
              } else {
                console.log('❌ Shadow root not accessible');
              }
            }
          }
        }
      } catch (shadowError) {
        console.log('❌ Error accessing shadow DOM for members:', shadowError);
      }
      
      // Fallback method
      console.log('🔄 Trying fallback method for members count...');
      const spans = Array.from(document.querySelectorAll('span'));
      console.log(`🔍 Found ${spans.length} spans on page`);
      
      for (let i = 0; i < spans.length; i++) {
        const span = spans[i];
        const text = span.textContent?.trim();
        console.log(`🔍 Span ${i}: "${text}"`);
        
        if (text?.includes('members')) {
          console.log(`✅ Found span with "members": "${text}"`);
          const prev = span.previousElementSibling as HTMLElement | null;
          console.log(`🔍 Previous element:`, prev ? `"${prev.textContent?.trim()}"` : 'null');
          
          if (prev && !isNaN(Number(prev.textContent?.replace(/,/g, '')))) {
            const members = Number(prev.textContent?.replace(/,/g, ''));
            console.log(`✅ Found members count with fallback method: ${members}`);
            return members;
          }
        }
      }
      
      console.log('❌ No members count found with any method');
      return 0;
    });
  }
} 