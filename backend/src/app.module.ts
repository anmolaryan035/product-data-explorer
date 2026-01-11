// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScrapingService } from './scraping/scraping.service'; // Import created here

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    ScrapingService, // Plugged in here
  ],
})
export class AppModule {}
