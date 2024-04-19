export interface StocksDto {
  id: string;
  date_created: string;
  name: string;
  ticker_symbol: string; // AMZ TSLA
  exchange_symbol: string; // ASX NYSE
  unique_symbol: string; // NasdaqGS:TSLA
  country: string;
  currency: string;
  security_name: string;
  price: number;
  company_score: CompanyScore;
  fluctuations: Fluctuation[];
  price_history?: StockPrice[];
}

export interface StockPrice {
  price: number;
  date_created: string;
}

export interface Fluctuation {
  terms: number;
  percentage: number;
}

export interface CompanyScore {
  dividend: number;
  future: number;
  health: number;
  management: number;
  past: number;
  value: number;
  misc: number;
  total: number;
  sentence: string;
  date_created: string;
}

export interface CompanyStockFluctuation {
  company_id: string;
  fluctuations: Fluctuation[];
}
