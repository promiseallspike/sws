## Comments and Improvements
- I haven't implemented volatility and sort, the current code can be extended to easily (but takes time) to facilitate this feature.
- Next Improvement: Generate latest stock price and fluctuation/volatility so system does not need to query price history and it will save computation and network transfer between BE -> DB and improve read performance
- Next Improvement: Switch the memory cache to redis
- Next Improvement: the price history is stored as part of getList response, this could be omitted to make the cache more memory friendly and it could be retrieved on demand from `price_history` cache.


## Demo Usage
Follow Running the app guide and run demo via Swagger Docs or Curl. 

Usage with Swagger Documentation
```shell
http://localhost:3000/swagger
```

![Swagger](swagger-demo.png?raw=true "Swagger")


Testing with Curl Command
```shell
$ curl 'http://localhost:3000/stocks' | jq
$ curl 'http://localhost:3000/stocks?filter_exchange_symbol=ASX' | jq
```

## Tech Stack
- Node 20, Typescript 5
- Nest Framework, REST API
- Jest

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