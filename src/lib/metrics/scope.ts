import type { Asset, Candle } from "@/lib/types/asset";
import type { Bucket, Scope } from "@/lib/types/view";

const MONTHS_BY_SCOPE: Record<Exclude<Scope, "MAX">, number> = {
  "1M": 1,
  "6M": 6,
  "1Y": 12,
  "3Y": 36,
  "5Y": 60,
  "10Y": 120,
};

/**
 * Bar size follows the window, not a user setting. Past a few thousand
 * points the extra detail costs render time and buys nothing the eye
 * can resolve.
 */
export function bucketFor(scope: Scope): Bucket {
  switch (scope) {
    case "1M":
    case "6M":
    case "1Y":
    case "3Y":
      return "day";
    case "5Y":
    case "10Y":
      return "week";
    case "MAX":
      return "month";
  }
}

export interface ResolvedWindow {
  from: string;
  to: string;
  bucket: Bucket;
  /**
   * The asset whose listing date clipped the window, if any. The UI must
   * surface this — an unexplained truncated chart reads as a bug.
   */
  limitedBy: Asset | null;
}

/**
 * MAX resolves to the widest window *all* assets cover. Overlaying series
 * that begin at different dates makes the comparison a lie, so the shared
 * span wins and the clipping asset is named.
 */
export function resolveWindow(
  scope: Scope,
  assets: Asset[],
  today: Date,
): ResolvedWindow {
  const to = toIsoDate(today);
  const bucket = bucketFor(scope);

  const dated = assets.filter((a) => a.firstDate !== null);
  const latestStart = dated.reduce<Asset | null>((acc, a) => {
    if (!acc || a.firstDate! > acc.firstDate!) return a;
    return acc;
  }, null);

  if (scope === "MAX") {
    return {
      from: latestStart?.firstDate ?? to,
      to,
      bucket,
      limitedBy: dated.length > 1 ? latestStart : null,
    };
  }

  const start = new Date(today);
  start.setMonth(start.getMonth() - MONTHS_BY_SCOPE[scope]);
  const requested = toIsoDate(start);

  // A preset window can still outrun a young asset.
  const clipped = latestStart && latestStart.firstDate! > requested;
  return {
    from: clipped ? latestStart.firstDate! : requested,
    to,
    bucket,
    limitedBy: clipped ? latestStart : null,
  };
}

export function sliceToWindow(candles: Candle[], from: string, to: string): Candle[] {
  return candles.filter((c) => c.date >= from && c.date <= to);
}

function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}
