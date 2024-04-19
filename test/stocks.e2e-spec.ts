import * as cache from '../src/infrastructures/cache';
import * as request from 'supertest';
import * as _ from 'lodash';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { StocksModule } from './../src/stocks/stocks.module';
import { StocksDto } from '../src/stocks/dto/stocks.dto';

describe('Stocks API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    await Promise.all([cache.init()]);
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [StocksModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  function verifyStockItem(stock_item: StocksDto) {
    expect(stock_item).toEqual({
      id: '46B285BC-B25F-4814-985C-390A4BFA2023',
      name: 'Afterpay',
      ticker_symbol: 'APT',
      exchange_symbol: 'ASX',
      unique_symbol: 'ASX:APT',
      security_name: 'Ordinary Shares',
      date_created: '2020-05-24 11:01:59.000000',
      currency: 'AUD',
      country: 'AU',
      price: 44.51,
      fluctuations: [
        {
          terms: 90,
          percentage: 196.73,
        },
      ],
      company_score: {
        dividend: 0,
        future: 5,
        health: 4,
        management: 0,
        past: 0,
        value: 0,
        misc: 0,
        total: 9,
        sentence: 'High growth potential with adequate balance sheet.',
        date_created: '2020-05-24 11:01:59.000000',
      },
    });
  }

  function verifyPriceHistory(stock_item: StocksDto) {
    expect(stock_item.price_history).not.toBeUndefined();

    const price_history = stock_item.price_history;
    expect(price_history.length).toEqual(41);
    expect(price_history[0].price).toEqual(15);
    expect(price_history[0].date_created).toEqual(
      '2020-03-25 01:01:16.7966667',
    );
    expect(price_history[price_history.length - 1].price).toEqual(44.51);
    expect(price_history[price_history.length - 1].date_created).toEqual(
      '2020-05-22 02:00:54.2566667',
    );
  }

  it('/stocks', async () => {
    const res = await request(app.getHttpServer()).get('/stocks');
    expect(res.status).toEqual(200);
    expect(res.body.length).toEqual(12);
    verifyStockItem(res.body[0]);
    expect(res.body[0].price_history).toBeUndefined();
  });

  it('/stocks with price history', async () => {
    const res = await request(app.getHttpServer()).get('/stocks').query({
      include_price_history: true,
    });
    verifyStockItem(_.omit(res.body[0] as StocksDto, 'price_history'));
    verifyPriceHistory(res.body[0]);
  });

  it('/stocks filter by exchange symbol', async () => {
    const res = await request(app.getHttpServer()).get('/stocks').query({
      filter_exchange_symbol: 'ASX',
    });
    expect(res.body.length).toEqual(3);
    expect(res.body[0].exchange_symbol).toEqual('ASX');
  });

  it('/stocks filter by unknown exchange symbol', async () => {
    const res = await request(app.getHttpServer()).get('/stocks').query({
      filter_exchange_symbol: 'XAS',
    });
    expect(res.body.length).toEqual(0);
  });

  it('/stocks filter by overall score', async () => {
    const res = await request(app.getHttpServer()).get('/stocks').query({
      filter_overall_score: 10,
    });
    expect(res.body.length).toEqual(9);
  });
});
