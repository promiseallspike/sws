import { Selectable } from 'kysely';

export interface Database {
  swsCompany: StocksTable;
  swsCompanyScore: CompanyScoreTable;
  swsCompanyPriceClose: StockPriceCloseTable;
}

export interface StocksTable {
  id: string;
  date_generated: string;
  name: string;
  ticker_symbol: string;
  exchange_symbol: string;
  unique_symbol: string;
  listing_currency_iso: string;
  exchange_country_iso: string;
  security_name: string;
  currency: string;
  score_id: number;
}
export type StocksEntity = Selectable<StocksTable>;

export interface CompanyScoreTable {
  score_id: number;
  company_id: string;
  dividend: number;
  future: number;
  health: number;
  management: number;
  past: number;
  value: number;
  misc: number;
  total: number;
  sentence: string;
  date_generated: string;
}
export type CompanyScoreEntity = Selectable<CompanyScoreTable>;

export interface StockPriceCloseTable {
  date: string;
  company_id: string;
  price: number;
  date_created: string;
}
export type StockPriceCloseEntity = Selectable<StockPriceCloseTable>;
