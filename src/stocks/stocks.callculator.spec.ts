import { calculateFluctuation } from './stocks.callculator';

describe('Stocks Calculator', () => {
  describe('calculate fluctuation', () => {
    it('positive fluctuation', () => {
      expect(calculateFluctuation(10, 20)).toEqual(100.0);
    });

    it('negative fluctuation', () => {
      expect(calculateFluctuation(50, 25)).toEqual(-50.0);
    });

    it('sets to two decimals', () => {
      expect(calculateFluctuation(15, 41)).toEqual(173.33);
    });
  });
});
