import { Controller, Get, Query } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { ListAllStocks } from './dto/stocks.list.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('stocks')
@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}
  @Get()
  findAll(@Query() query: ListAllStocks) {
    return this.stocksService.findAll(query);
  }
}
