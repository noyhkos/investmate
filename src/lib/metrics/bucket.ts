import type { Candle } from "@/lib/types/asset";
import type { Bucket } from "@/lib/types/view";

/**
 * Roll daily bars up to weeks or months. Storing only days and aggregating
 * on read keeps one source of truth; parallel week/month tables would
 * double the reconciliation surface for a GROUP BY.
 */
export function bucketCandles(candles: Candle[], bucket: Bucket): Candle[] {
  if (bucket === "day" || candles.length === 0) return candles;

  const out: Candle[] = [];
  let current: Candle | null = null;
  let currentKey = "";

  for (const candle of candles) {
    const key = bucketKey(candle.date, bucket);
    if (key !== currentKey) {
      if (current) out.push(current);
      currentKey = key;
      current = { ...candle };
      continue;
    }
    // Open and the bucket's date come from its first bar, close from its last.
    current = {
      date: current!.date,
      open: current!.open,
      high: Math.max(current!.high, candle.high),
      low: Math.min(current!.low, candle.low),
      close: candle.close,
      adjClose: candle.adjClose ?? current!.adjClose,
      volume: current!.volume + candle.volume,
    };
  }
  if (current) out.push(current);
  return out;
}

function bucketKey(date: string, bucket: Bucket): string {
  if (bucket === "month") return date.slice(0, 7);
  // ISO week: shift to the Thursday of the same week so year boundaries agree.
  const d = new Date(date);
  const day = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - day + 3);
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const week =
    1 + Math.round((d.getTime() - firstThursday.getTime()) / (7 * 86_400_000));
  return `${d.getUTCFullYear()}-W${week}`;
}
