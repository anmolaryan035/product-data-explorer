import { Injectable, Logger } from '@nestjs/common';
import { PlaywrightCrawler, Dataset } from 'crawlee';

// 1. Define what a Book looks like so TypeScript doesn't complain
interface ScrapedBook {
  title: string;
  price: string;
  image: string;
  url: string;
}

@Injectable()
export class ScrapingService {
  private readonly logger = new Logger(ScrapingService.name);

  async scrapeCategory(url: string) {
    this.logger.log(`Starting Robust Scrape for: ${url}`);

    const crawler = new PlaywrightCrawler({
      headless: false,
      requestHandler: async ({ page, request, log }) => {
        log.info(`Processing ${request.url}...`);

        await page.waitForSelector('img', { timeout: 15000 });

        // 2. Type the result variable
        const products: ScrapedBook[] = await page.$$eval(
          'div, li',
          (items) => {
            return items
              .filter((item) => {
                // 3. Fix: Cast item to HTMLElement so we can read .innerText
                const el = item as HTMLElement;
                const text = el.innerText || '';
                const hasPrice =
                  text.includes('£') ||
                  text.includes('$') ||
                  /\d+\.\d{2}/.test(text);
                const hasLink = el.querySelector('a');
                return hasPrice && !!hasLink;
              })
              .map((item) => {
                const el = item as HTMLElement;
                const imgElement = el.querySelector('img');
                const titleEl = el.querySelector(
                  'h3, h4, span[class*="title"], div[class*="title"]',
                );
                const linkEl = el.querySelector('a');

                return {
                  title: titleEl?.textContent?.trim() || '',
                  // Fix: Use regex safely inside the browser context
                  price: el.innerText.match(/[£$€]\d+\.\d{2}/)?.[0] || '£?.??',
                  image:
                    imgElement?.getAttribute('src') ||
                    imgElement?.getAttribute('data-src') ||
                    '',
                  url: linkEl?.href || '',
                } as ScrapedBook;
              })
              .filter((p) => p.title && p.title.length > 3 && p.url);
          },
        );

        // 4. Fix: Initialize array with the correct Type
        const uniqueProducts: ScrapedBook[] = [];
        const seenUrls = new Set<string>();

        for (const p of products) {
          if (!seenUrls.has(p.url)) {
            seenUrls.add(p.url);
            uniqueProducts.push(p);
          }
        }

        console.log(`✅ SUCCESS: Found ${uniqueProducts.length} books!`);
        await Dataset.pushData(uniqueProducts);
      },
      failedRequestHandler: ({ request, log }) => {
        log.error(`❌ FAILED: Could not scrape ${request.url}`);
      },
    });

    await crawler.run([url]);
    return await Dataset.getData();
  }
}
