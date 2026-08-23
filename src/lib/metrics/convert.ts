import type { Candle } from "@/lib/types/asset";

/**
 * Restate a USD-quoted series in KRW.
 *
 * For a Korean holder of a US asset the exchange rate is roughly half the
 * realised return, so a dollar chart answers a question nobody asked. FX
 * closes are carried forward across days the currency market did not print,
 * which is correct: the rate did not change, it just was not quoted.
 */
export function convertCurrency(candles: Candle[], fx: Candle[]): Candle[] {
  if (fx.length === 0) return candles;

  const rates = new Map(fx.map((c) => [c.date, c.close]));
  let carried = fx[0].close;
  const out: Candle[] = [];

  for (const candle of candles) {
    const rate = rates.get(candle.date);
    if (rate !== undefined) carried = rate;
    // Before the FX series begins there is no honest rate; skip the bar
    // rather than invent one out of a later quote.
    if (candle.date < fx[0].date) continue;

    out.push({
      date: candle.date,
      open: candle.open * carried,
      high: candle.high * carried,
      low: candle.low * carried,
      close: candle.close * carried,
      adjClose: candle.adjClose === null ? null : candle.adjClose * carried,
      volume: candle.volume,
    });
  }
  return out;
}

/**
 * Swap the close for the dividend-reinvested close. Price-only charts
 * understate dividend payers over a twenty-year window, which is exactly
 * the window this tool is for. FX and futures carry no adjusted close.
 */
export function toTotalReturn(candles: Candle[]): Candle[] {
  if (!candles.some((c) => c.adjClose !== null)) return candles;
  return candles.map((c) => ({ ...c, close: c.adjClose ?? c.close }));
}
