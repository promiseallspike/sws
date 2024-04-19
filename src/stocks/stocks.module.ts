import { Module } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { StocksController } from './stocks.controller';
import { StocksRepository } from './stocks.repository';

@Module({
  controllers: [StocksController],
  providers: [StocksService, StocksRepository],
})
export class StocksModule {}
