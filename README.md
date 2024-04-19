## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Usage

Usage with Swagger Documentation
```shell
http://localhost:3000/swagger
```

Testing with Curl Command
```shell
$ curl 'http://localhost:3000/stocks' | jq
$ curl 'http://localhost:3000/stocks?filter_exchange_symbol=ASX' | jq
```

## Comments
- I haven't implemented volatility and sort, the current code can be extended to easily (but takes time) to facilitate this feature.
- Generate latest stock price and fluctuation/volatility so system does not need to query price history and it will save computation and network transfer between BE -> DB and improve read performance
- Switch the memory cache to redis
- the price history is stored as part of getList response, this could be omitted to make the cache more memory friendly and it could be retrieved on demand from `price_history` cache.