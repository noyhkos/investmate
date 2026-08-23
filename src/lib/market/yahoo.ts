import YahooFinance from "yahoo-finance2";

import type { Candle } from "@/lib/types/asset";

export { guessType } from "./symbols";

// v4 exports a class; one shared instance keeps the cookie/crumb handshake warm.
const yahoo = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

export interface QuoteHit {
  symbol: string;
  name: string;
  exchange: string;
}

export interface HistoryRange {
  from: string;
  to: string;
}

/**
 * Daily candles only. We store days and roll them up on read — separate
 * week/month tables would double the reconciliation surface for data that
 * is a GROUP BY away.
 *
 * `adjClose` carries the dividend-reinvested series that the total-return
 * toggle needs; it is null for FX and futures.
 */
export async function fetchDailyCandles(
  symbol: string,
  range: HistoryRange,
): Promise<Candle[]> {
  const result = await yahoo.chart(symbol, {
    period1: range.from,
    period2: range.to,
    interval: "1d",
  });

  const candles: Candle[] = [];
  for (const q of result.quotes) {
    if (q.close === null || q.close === undefined) continue;
    candles.push({
      date: q.date.toISOString().slice(0, 10),
      open: q.open ?? q.close,
      high: q.high ?? q.close,
      low: q.low ?? q.close,
      close: q.close,
      adjClose: q.adjclose ?? null,
      volume: q.volume ?? 0,
    });
  }
  return candles;
}

export async function searchSymbols(query: string): Promise<QuoteHit[]> {
  const result = await yahoo.search(query, { quotesCount: 10, newsCount: 0 });

  const hits: QuoteHit[] = [];
  for (const q of result.quotes) {
    if (!("symbol" in q) || typeof q.symbol !== "string") continue;
    const name =
      ("longname" in q && typeof q.longname === "string" && q.longname) ||
      ("shortname" in q && typeof q.shortname === "string" && q.shortname) ||
      q.symbol;
    const exchange =
      "exchange" in q && typeof q.exchange === "string" ? q.exchange : "";
    hits.push({ symbol: q.symbol, name, exchange });
  }
  return hits;
}
