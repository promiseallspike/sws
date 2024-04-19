import { ApiPropertyOptional } from '@nestjs/swagger';

export class ListAllStocks {
  @ApiPropertyOptional()
  filter_exchange_symbol?: string;

  @ApiPropertyOptional()
  filter_overall_score?: number;

  @ApiPropertyOptional()
  include_price_history?: boolean;

  @ApiPropertyOptional()
  sort_score?: boolean;

  @ApiPropertyOptional()
  sort_fluctuation?: boolean;
}
