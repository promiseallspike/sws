import {
  CompanyStockFluctuation,
  Fluctuation,
  StockPrice,
  StocksDto,
} from './dto/stocks.dto';
import { StockSearchResult } from './stocks.repository';
import { StockPriceCloseEntity } from './entities/stocks.entity';
import { calculateFluctuation } from './stocks.callculator';

function buildSearchItemDto(options: {
  search_result: StockSearchResult;
  fluctuation: Fluctuation[];
  price_history?: StockPrice[];
}): StocksDto {
  const { search_result, fluctuation, price_history } = options;
  return {
    id: search_result.id,
    name: search_result.name,
    ticker_symbol: search_result.ticker_symbol,
    exchange_symbol: search_result.exchange_symbol,
    unique_symbol: search_result.unique_symbol,
    date_created: search_result.date_generated,
    country: search_result.exchange_country_iso,
    currency: search_result.listing_currency_iso,
    security_name: search_result.security_name,
    fluctuations: fluctuation,
    price: search_result.price,
    company_score: {
      dividend: search_result.dividend,
      future: search_result.future,
      health: search_result.health,
      management: search_result.management,
      past: search_result.past,
      value: search_result.value,
      misc: search_result.misc,
      total: search_result.total,
      sentence: search_result.sentence,
      date_created: search_result.date_generated,
    },
    ...(price_history && { price_history: price_history }),
  };
}

function mapPrice(price: StockPriceCloseEntity): StockPrice {
  return {
    price: price.price,
    date_created: price.date_created,
  };
}

export function buildSearchResultDto(options: {
  stocks: StockSearchResult[];
  fluctuations: CompanyStockFluctuation[];
  price_history?: StockPriceCloseEntity[];
}): StocksDto[] {
  const { stocks, fluctuations, price_history } = options;
  return stocks.map((stock) => {
    const fluctuation = fluctuations.find(
      (f) => f.company_id === stock.company_id,
    );

    let price_history_dtos: StockPrice[];
    if (price_history) {
      price_history_dtos = price_history
        .filter((p) => p.company_id === stock.company_id)
        .map(mapPrice);
    }
    return buildSearchItemDto({
      search_result: stock,
      fluctuation: fluctuation.fluctuations,
      ...(price_history_dtos && { price_history: price_history_dtos }),
    });
  });
}

export function buildFluctuations(options: {
  company_id: string;
  prices: StockPriceCloseEntity[];
  terms: number;
}): CompanyStockFluctuation {
  const start: number = options.prices[0].price;
  const latest: number = options.prices[options.prices.length - 1].price;
  const fluctuationPercentage = calculateFluctuation(start, latest);
  return {
    company_id: options.company_id,
    fluctuations: [
      {
        terms: options.terms,
        percentage: fluctuationPercentage,
      },
    ],
  };
}
