import "server-only";

import { unstable_cache } from "next/cache";

import { fetchDailyCandles } from "@/lib/market/yahoo";
import type { Candle } from "@/lib/types/asset";

const TTL_MS = 60 * 60 * 1000;
const EPOCH = "1970-01-01";

interface Entry {
  candles: Candle[];
  fetchedAt: number;
}

const cache = new Map<string, Entry>();
const inflight = new Map<string, Promise<Candle[]>>();

/**
 * Full daily history for a symbol.
 *
 * Always fetching the whole range rather than the requested window is
 * deliberate: the provider charges one call either way, and holding the
 * full series makes every later scope change — and the MAX-window
 * resolution that needs each asset's first bar — free.
 *
 * Two caches, because they solve different problems. The in-process map
 * collapses the eight tiles of one render into one request per symbol.
 * `unstable_cache` is what survives past the request: a module-level map
 * lives and dies with a serverless instance, so on its own every cold start
 * would re-download decades of bars for the whole watchlist.
 */
const fetchAndCache = unstable_cache(
  async (symbol: string) =>
    fetchDailyCandles(symbol, {
      from: EPOCH,
      to: new Date().toISOString().slice(0, 10),
    }),
  ["market-history"],
  { revalidate: 60 * 60, tags: ["market-history"] },
);

export async function getFullHistory(symbol: string): Promise<Candle[]> {
  const hit = cache.get(symbol);
  if (hit && Date.now() - hit.fetchedAt < TTL_MS) return hit.candles;

  // Concurrent tiles asking for the same symbol share one request.
  const pending = inflight.get(symbol);
  if (pending) return pending;

  const request = fetchAndCache(symbol)
    .then((candles) => {
      cache.set(symbol, { candles, fetchedAt: Date.now() });
      return candles;
    })
    .finally(() => inflight.delete(symbol));

  inflight.set(symbol, request);
  return request;
}

export async function getHistories(
  symbols: string[],
): Promise<Record<string, Candle[]>> {
  const entries = await Promise.all(
    symbols.map(async (symbol) => {
      try {
        return [symbol, await getFullHistory(symbol)] as const;
      } catch {
        // One dead symbol must not blank the whole board.
        return [symbol, [] as Candle[]] as const;
      }
    }),
  );
  return Object.fromEntries(entries);
}
