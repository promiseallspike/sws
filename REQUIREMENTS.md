
## Description

Given the supplied SQLlite database, build an API solution that can
- return an array of company entities,
- along with each company’s past share prices as an **optional** query parameter.

When your API is built, construct a frontend page that allows a user to see the companies returned from the API.

The page should allow users to see each company returned in the results with the following data:
- The company name
- The unique symbol code
- The last known share price
- The company’s overall snowflake score

The results page should allow you to sort the page results by the following:
- By overall company ‘score’
- By price fluctuations or volatility in price within the last 90 days

The results page should have the ability to filter the results by:
- Exchange symbols
- Overall score

Non Functional Requirements:
- Assume that the page will be frequently visited and needs to be highly performant.
- Although you are only required to implement the strategy above, keep in mind that it should be easy enough to extend the ability of the page to show a mini share price chart for each company returned in the results.
- Write what you consider to be production-quality code, with commands and tests if and when you consider them necessary.~~

