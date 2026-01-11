import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { ScrapingService } from './scraping/scraping.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      // We must provide a "fake" ScrapingService so the test doesn't actually open a browser
      providers: [
        {
          provide: ScrapingService,
          useValue: {
            scrapeCategory: jest.fn().mockResolvedValue([]), // Return empty list for test
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('scrape', () => {
    it('should be defined', () => {
      expect(appController).toBeDefined();
    });

    it('should return an array when called', async () => {
      const result = await appController.scrape('https://example.com');
      expect(result).toEqual([]);
    });
  });
});
