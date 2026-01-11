// src/app.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { ScrapingService } from './scraping/scraping.service';

@Controller('products') // This sets the route to http://localhost:3000/products
export class AppController {
  constructor(private readonly scrapingService: ScrapingService) {}

  @Get('scrape') // This creates a sub-route: /products/scrape
  async scrape(@Query('url') url: string) {
    if (!url) {
      return { error: 'Please provide a URL query parameter' };
    }
    // Calls the scraping service we created in Part 1
    const data = await this.scrapingService.scrapeCategory(url);
    return data;
  }
}
