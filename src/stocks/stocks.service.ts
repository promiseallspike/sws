import * as _ from 'lodash';

import { Injectable } from '@nestjs/common';
import { CompanyStockFluctuation, StocksDto } from './dto/stocks.dto';
import { StocksRepository } from './stocks.repository';
import { buildFluctuations, buildSearchResultDto } from './stocks.mapper';
import * as cache from '../infrastructures/cache';
import { Constants } from './stocks.constants';
import { StockPriceCloseEntity } from './entities/stocks.entity';
import { ListAllStocks } from './dto/stocks.list.dto';

@Injectable()
export class StocksService {
  constructor(private stocksRepository: StocksRepository) {}

  private async getCacheOrQuery<T>(options: {
    partition: string;
    key_params?: Record<string, string | number | boolean>;
    query: () => Promise<T>;
  }): Promise<T> {
    const { partition, key_params } = options;
    const items = await cache.get<T>({
      partition: options.partition,
      key_params: options.key_params,
    });
    if (items != null) {
      return items;
    }
    const result = await options.query();
    await cache.set<T>({ partition, key_params, value: result });
    return result;
  }

  private async getPriceHistory(): Promise<StockPriceCloseEntity[]> {
    const queryFn = async () => {
      const priceHistory = await this.stocksRepository.queryPriceHistory(
        Constants.query.fluctuation_date,
      );
      return priceHistory;
    };
    return this.getCacheOrQuery({
      partition: Constants.cache.price_history,
      query: queryFn,
    });
  }

  private async getFluctuations(): Promise<CompanyStockFluctuation[]> {
    const queryFn = async () => {
      const priceHistory = await this.getPriceHistory();
      const result = _.chain(priceHistory)
        .groupBy('company_id')
        .map((prices, company_id) =>
          buildFluctuations({
            company_id,
            prices,
            terms: Constants.query.fluctuation_term,
          }),
        )
        .value();
      return result;
    };

    return this.getCacheOrQuery({
      partition: Constants.cache.fluctuation,
      query: queryFn,
    });
  }

  public async findAll(query?: ListAllStocks): Promise<StocksDto[]> {
    const param = (query ?? {}) as Required<ListAllStocks>;
    const queryFn = async () => {
      const stocks = await this.stocksRepository.searchStock(query);
      const fluctuations = await this.getFluctuations();

      let price_history: StockPriceCloseEntity[];
      if (param.include_price_history) {
        price_history = await this.getPriceHistory();
      }
      const result = buildSearchResultDto({
        stocks: stocks,
        fluctuations,
        ...(price_history && { price_history }),
      });
      return result;
    };

    return this.getCacheOrQuery({
      partition: Constants.cache.stock_search,
      key_params: param,
      query: queryFn,
    });
  }
}
