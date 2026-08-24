import "server-only";

import { USD_KRW } from "@/lib/market/symbols";
import { getHistories } from "@/lib/market/history";
import { bucketCandles } from "@/lib/metrics/bucket";
import { convertCurrency, toTotalReturn } from "@/lib/metrics/convert";
import { summarize } from "@/lib/metrics/returns";
import { resolveWindow, sliceToWindow } from "@/lib/metrics/scope";
import type { Asset, Candle } from "@/lib/types/asset";
import type { PerformanceSummary } from "@/lib/types/performance";
import type { Bucket, Scope } from "@/lib/types/view";

export interface BoardRequest {
  assets: Pick<Asset, "symbol" | "name" | "type" | "currency">[];
  scope: Scope;
  dividends: boolean;
  krw: boolean;
  /**
   * "common" clips every series to the window they all cover — required for
   * an overlay, where series starting on different dates make the comparison
   * a lie. "independent" lets each tile use its own full history, which is
   * right for a grid: tiles are read one at a time, and CAGR already
   * normalises for unequal windows.
   */
  align: "common" | "independent";
}

/**
 * What actually crosses the wire.
 *
 * The client reads two things off a candle — the date and the close — and
 * never touches open, high, low, adjClose or volume. Sending the whole bar
 * meant roughly 25,000 numbers per board that were parsed and thrown away.
 *
 * Parallel arrays rather than an array of objects: the field names repeat
 * once per bar otherwise, and at four thousand bars that is most of the
 * payload. Closes are rounded to two places — the extra digits are float
 * noise from the provider, not precision anyone can act on.
 *
 * 615KB -> 84KB raw, 125KB -> 15KB over the wire.
 */
export interface BoardSeries {
  symbol: string;
  currency: string;
  dates: string[];
  closes: number[];
  summary: PerformanceSummary | null;
  firstDate: string | null;
  /** The window this series was actually sliced to. */
  from: string;
  to: string;
}

export interface Board {
  from: string;
  to: string;
  bucket: Bucket;
  /** Name of the asset whose listing date clipped the window, if any. */
  limitedBy: string | null;
  series: BoardSeries[];
}

/**
 * Assembles everything one dashboard render needs.
 *
 * Order matters: corrections are applied to the full daily series, then the
 * window is resolved from the corrected first dates, then bars are rolled up.
 * Bucketing first would round the window boundaries; converting after
 * slicing would drop the FX-clipped head silently.
 */
export async function buildBoard(request: BoardRequest): Promise<Board> {
  const { assets, scope, dividends, krw, align } = request;

  const symbols = assets.map((a) => a.symbol);
  const needsFx = krw && assets.some((a) => a.currency !== "KRW");
  const histories = await getHistories(needsFx ? [...symbols, USD_KRW] : symbols);
  const fx = needsFx ? (histories[USD_KRW] ?? []) : [];

  const corrected = new Map<string, Candle[]>();
  for (const asset of assets) {
    let candles = histories[asset.symbol] ?? [];
    if (dividends) candles = toTotalReturn(candles);
    if (krw && asset.currency !== "KRW") candles = convertCurrency(candles, fx);
    corrected.set(asset.symbol, candles);
  }

  const resolvable: Asset[] = assets.map((a) => ({
    id: a.symbol,
    symbol: a.symbol,
    name: a.name,
    type: a.type,
    currency: krw ? "KRW" : a.currency,
    firstDate: corrected.get(a.symbol)?.[0]?.date ?? null,
  }));

  const now = new Date();
  const common = resolveWindow(scope, resolvable, now);

  const series = resolvable.map((asset) => {
    const full = corrected.get(asset.symbol) ?? [];
    const own = align === "common" ? common : resolveWindow(scope, [asset], now);
    const sliced = sliceToWindow(full, own.from, own.to);
    const bucketed = bucketCandles(sliced, own.bucket);
    return {
      symbol: asset.symbol,
      currency: asset.currency,
      dates: bucketed.map((c) => c.date),
      closes: bucketed.map((c) => round2(c.close)),
      // Summarised on the daily slice: rolling up first would move the
      // window's first and last close and quietly change the return.
      summary: summarize(sliced),
      firstDate: asset.firstDate,
      from: own.from,
      to: own.to,
    };
  });

  // In independent mode the header states the span actually on screen, which
  // is the union of the per-tile windows rather than any single one.
  const from =
    align === "common"
      ? common.from
      : (series.map((s) => s.from).sort()[0] ?? common.from);

  return {
    from,
    to: common.to,
    bucket: common.bucket,
    limitedBy: align === "common" ? (common.limitedBy?.name ?? null) : null,
    series,
  };
}

/** Two places is past anything a reader acts on, and it halves the digits. */
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
