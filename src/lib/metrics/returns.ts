import type { Candle } from "@/lib/types/asset";
import type { PerformanceSummary } from "@/lib/types/performance";

const DAYS_PER_YEAR = 365.25;

export function totalReturn(start: number, end: number): number {
  if (start <= 0) return 0;
  return end / start - 1;
}

/**
 * Compound annual growth rate. Tiles show this rather than total return
 * because listing dates differ — +412% over 20 years and +389% over 15
 * are not comparable, 8.4%/yr and 11.2%/yr are.
 */
export function cagr(start: number, end: number, days: number): number {
  if (start <= 0 || days <= 0) return 0;
  return (end / start) ** (DAYS_PER_YEAR / days) - 1;
}

export function summarize(candles: Candle[]): PerformanceSummary | null {
  if (candles.length < 2) return null;

  const first = candles[0];
  const last = candles[candles.length - 1];
  const prev = candles[candles.length - 2];
  const days = daysBetween(first.date, last.date);

  return {
    from: first.date,
    to: last.date,
    startPrice: first.close,
    endPrice: last.close,
    totalReturn: totalReturn(first.close, last.close),
    cagr: cagr(first.close, last.close, days),
    dayChange: totalReturn(prev.close, last.close),
  };
}

function daysBetween(from: string, to: string): number {
  return (Date.parse(to) - Date.parse(from)) / 86_400_000;
}
