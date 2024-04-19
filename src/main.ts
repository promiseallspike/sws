import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { StocksModule } from './stocks/stocks.module';
import * as cache from './infrastructures/cache';

async function bootstrap() {
  await Promise.all([cache.init()]);

  const config = new DocumentBuilder()
    .setTitle('Stock API')
    .setDescription('The Stocks API description')
    .setVersion('1.0')
    .build();

  const app = await NestFactory.create(StocksModule);

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}
bootstrap();
