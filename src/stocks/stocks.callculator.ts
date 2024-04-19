export function calculateFluctuation(open: number, close: number): number {
  const result = ((close - open) / open) * 100;
  return Number(result.toFixed(2));
}
