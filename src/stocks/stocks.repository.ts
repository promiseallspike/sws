import {
  StocksEntity,
  CompanyScoreEntity,
  StockPriceCloseEntity,
  Database,
} from './entities/stocks.entity';
import { Injectable } from '@nestjs/common';
import * as SQLite from 'better-sqlite3';

import { Kysely, SqliteDialect, sql } from 'kysely';
import { ListAllStocks } from './dto/stocks.list.dto';
const dialect = new SqliteDialect({
  database: new SQLite('db.sqlite3'),
});
const db = new Kysely<Database>({
  dialect,
});

export type StockSearchResult = StocksEntity &
  CompanyScoreEntity &
  StockPriceCloseEntity;
export interface StockSearchQuery {}

@Injectable()
export class StocksRepository {
  async queryPriceHistory(
    start_date: string,
  ): Promise<StockPriceCloseEntity[]> {
    const result: StockPriceCloseEntity[] = await db
      .selectFrom('swsCompanyPriceClose')
      .where('date', '>=', start_date)
      .orderBy(['company_id', 'date'])
      .selectAll()
      .execute();
    return result;
  }

  async searchStock(options: ListAllStocks): Promise<StockSearchResult[]> {
    let query = db
      .with('companies', (db) =>
        db
          .selectFrom('swsCompany as company')
          .innerJoin(
            'swsCompanyScore as score',
            'company.id',
            'score.company_id',
          )
          .selectAll(),
      )
      .with('stockPriceAll', (db) =>
        db
          .selectFrom('swsCompanyPriceClose')
          .select([
            'company_id',
            'price',
            sql<number>`RANK() OVER (PARTITION BY company_id ORDER BY date DESC)`.as(
              'rank',
            ),
          ]),
      )
      .with('stockPriceLatest', (db) =>
        db.selectFrom('stockPriceAll').where('rank', '=', 1).selectAll(),
      )
      .selectFrom('companies')
      .innerJoin(
        'stockPriceLatest',
        'companies.company_id',
        'stockPriceLatest.company_id',
      );

    if (options.filter_exchange_symbol) {
      query = query.where(
        'exchange_symbol',
        '=',
        options.filter_exchange_symbol,
      );
    }
    if (options?.filter_overall_score) {
      query = query.where(
        'companies.total',
        '>=',
        options.filter_overall_score,
      );
    }
    const result = await query.selectAll().execute();
    return result as any;
  }
}
