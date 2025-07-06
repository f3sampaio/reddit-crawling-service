import { Page } from 'puppeteer';
import fs from 'fs';

// Rules extraction service - Single Responsibility: Rules extraction
export class RulesExtractionService {
  async extractRules(page: Page): Promise<string[]> {
    console.log('📋 Starting rules extraction');

    // Dump the full HTML content for debugging
    const html = await page.content();
    try {
      fs.writeFileSync('debug-golpe.html', html);
      console.log('✅ Dumped full HTML to debug-golpe.html');
    } catch (err) {
      console.error('❌ Failed to write debug-golpe.html:', err);
    }

    return await page.evaluate(() => {
      console.log('🔍 Looking for subreddit rules...');
      try {
        // Based on the HTML structure provided, look for the rules section
        const rulesSelectors = [
          'div.px-md.text-neutral-content-weak',
          'div[class*="px-md"][class*="text-neutral-content-weak"]',
          'div[class*="rules"]',
          'div[class*="rule"]'
        ];

        let rulesSection = null;
        let usedSelector = '';

        for (const selector of rulesSelectors) {
          console.log(`🔍 Trying selector: ${selector}`);
          const element = document.querySelector(selector);
          if (element) {
            console.log(`✅ Found element with selector: ${selector}`);
            console.log(`🔍 Element text preview: "${element.textContent?.trim().substring(0, 200)}..."`);
            rulesSection = element;
            usedSelector = selector;
            break;
          }
        }

        if (!rulesSection) {
          console.log('❌ No rules section found with any selector');
          
          // Debug: Log all divs with classes that might contain rules
          const allDivs = document.querySelectorAll('div');
          console.log('🔍 All divs with potential rule classes:');
          allDivs.forEach((div, index) => {
            const className = div.className;
            const text = div.textContent?.trim();
            if (className && (className.includes('rule') || className.includes('community') || className.includes('px-md'))) {
              console.log(`  Div ${index}: class="${className}" text="${text?.substring(0, 100)}..."`);
            }
          });
          
          return [];
        }

        console.log(`✅ Found rules section using selector: ${usedSelector}`);

        // Find all faceplate-expandable-section-helper elements (these contain individual rules)
        const ruleHelpers = rulesSection.querySelectorAll('faceplate-expandable-section-helper');
        console.log(`🔍 Found ${ruleHelpers.length} rule helper elements`);

        if (ruleHelpers.length === 0) {
          console.log('⚠️ No faceplate-expandable-section-helper elements found');
          
          // Try alternative selectors for rules
          const alternativeSelectors = [
            'details',
            'li',
            'div[class*="rule"]',
            'div[class*="guideline"]'
          ];
          
          for (const altSelector of alternativeSelectors) {
            console.log(`🔍 Trying alternative selector: ${altSelector}`);
            const elements = rulesSection.querySelectorAll(altSelector);
            console.log(`🔍 Found ${elements.length} elements with ${altSelector}`);
            
            if (elements.length > 0) {
              console.log(`✅ Found ${elements.length} potential rule elements with ${altSelector}`);
              // Log the first few elements for debugging
              for (let i = 0; i < Math.min(3, elements.length); i++) {
                const text = elements[i].textContent?.trim();
                console.log(`  Element ${i}: "${text?.substring(0, 100)}..."`);
              }
            }
          }
          
          return [];
        }

        const rules: string[] = [];

        ruleHelpers.forEach((helper, index) => {
          console.log(`🔍 Processing rule helper ${index + 1}`);
          
          // Get the rule title from the h2 element with i18n-translatable-text class
          const titleElement = helper.querySelector('h2.i18n-translatable-text');
          if (!titleElement) {
            console.log(`⚠️ No h2.i18n-translatable-text found in helper ${index + 1}`);
            // Try alternative title selectors
            const altTitleSelectors = ['h2', 'h3', '.text-14', '[class*="title"]'];
            for (const selector of altTitleSelectors) {
              const altTitle = helper.querySelector(selector);
              if (altTitle) {
                console.log(`✅ Found title with alternative selector: ${selector}`);
                break;
              }
            }
            return;
          }

          const title = titleElement.textContent?.trim();
          console.log(`🔍 Title for rule ${index + 1}: "${title}"`);

          if (!title || title.length === 0) {
            console.log(`⚠️ Skipping rule ${index + 1} - no title found`);
            return;
          }

          // Get the rule description from the content div
          const contentDiv = helper.querySelector('[faceplate-auto-height-animator-content]');
          if (!contentDiv) {
            console.log(`⚠️ Skipping rule ${index + 1} - no content div found`);
            return;
          }

          // Get all p elements within the content div
          const descriptionElements = contentDiv.querySelectorAll('p');
          const descriptions: string[] = [];

          descriptionElements.forEach((p, pIndex) => {
            const text = p.textContent?.trim();
            if (text && text.length > 0) {
              console.log(`🔍 Description ${pIndex + 1} for rule ${index + 1}: "${text}"`);
              descriptions.push(text);
            }
          });

          // Combine title and descriptions
          let ruleText = title;
          if (descriptions.length > 0) {
            ruleText += ': ' + descriptions.join(' ');
          }

          // Clean up the rule text
          ruleText = ruleText
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .trim();

          // Only add if it's a valid rule (not empty and not just a number)
          if (ruleText.length > 0 && !/^\d+$/.test(ruleText.trim())) {
            console.log(`✅ Rule ${index + 1}: "${ruleText}"`);
            rules.push(ruleText);
          } else {
            console.log(`⚠️ Skipping rule ${index + 1} - invalid content: "${ruleText}"`);
          }
        });

        // Remove duplicates and filter out any remaining invalid content
        const cleanedRules = rules
          .filter((rule, index, array) => array.indexOf(rule) === index) // Remove duplicates
          .filter(rule => rule.length > 5) // Filter out very short text
          .filter(rule => !rule.includes('r/')) // Remove subreddit links
          .filter(rule => !rule.includes('members')) // Remove member count text
          .filter(rule => !/^\d+$/.test(rule.trim())) // Remove pure numbers
          .filter(rule => rule.trim().length > 0); // Remove empty strings

        console.log(`✅ Extracted ${cleanedRules.length} rules:`, cleanedRules);
        return cleanedRules;

      } catch (error) {
        console.log('❌ Error extracting rules:', error);
        return [];
      }
    });
  }
} 