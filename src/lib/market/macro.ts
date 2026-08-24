import "server-only";

import { unstable_cache } from "next/cache";

import { MACRO_SYMBOLS } from "@/lib/market/symbols";
import { fetchDailyCandles } from "@/lib/market/yahoo";
import { summarize } from "@/lib/metrics/returns";
import type { AssetType } from "@/lib/types/asset";

export interface MacroReading {
  name: string;
  price: number;
  change: number;
  currency: string;
  type: AssetType;
}

/**
 * The macro strip's readings, cached the same way the board's history is.
 *
 * These were being fetched straight from the provider on every render — six
 * calls before the layout could emit a byte. A `revalidate` export sat on
 * the component file and did nothing, because that only means anything in a
 * route segment.
 *
 * Only the last two bars matter here, so this fetches a short window rather
 * than reusing the full-history cache: a fortnight of dailies deserialises
 * in a fraction of the time twenty years does.
 */
export const getMacroReadings = unstable_cache(
  async (): Promise<MacroReading[]> => {
    const to = new Date();
    const from = new Date(to);
    from.setDate(from.getDate() - 14);

    const readings = await Promise.all(
      MACRO_SYMBOLS.map(async ({ symbol, name, currency, type }) => {
        try {
          const candles = await fetchDailyCandles(symbol, {
            from: from.toISOString().slice(0, 10),
            to: to.toISOString().slice(0, 10),
          });
          const summary = summarize(candles);
          if (!summary) return null;
          return { name, price: summary.endPrice, change: summary.dayChange, currency, type };
        } catch {
          // One unavailable symbol must not blank the whole strip.
          return null;
        }
      }),
    );

    return readings.filter((r): r is MacroReading => r !== null);
  },
  ["macro-readings"],
  { revalidate: 60 * 10, tags: ["macro-readings"] },
);
