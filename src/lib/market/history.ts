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
 * History splits by how likely it is to change.
 *
 * A close from 2020 is settled forever; only the current month has bars that
 * move. Caching the whole series behind one expiry threw both away together,
 * so every hour some unlucky request paid to re-download two decades for the
 * entire watchlist — measured at three seconds and change.
 *
 * The archive is keyed by the first of the month, so it is rewritten once a
 * month and otherwise sits still. The tail covers that boundary to today and
 * expires on a short clock, which costs a few dozen bars to refresh rather
 * than a few thousand.
 */
const getArchive = unstable_cache(
  async (symbol: string, until: string) =>
    fetchDailyCandles(symbol, { from: EPOCH, to: until }),
  ["market-archive"],
  { revalidate: 60 * 60 * 24 * 30, tags: ["market-history"] },
);

const getTail = unstable_cache(
  async (symbol: string, from: string, to: string) =>
    fetchDailyCandles(symbol, { from, to }),
  ["market-tail"],
  { revalidate: 60 * 15, tags: ["market-history"] },
);

/**
 * Full daily history for a symbol.
 *
 * Always fetching the whole range rather than the requested window is
 * deliberate: the provider charges one call either way, and holding the
 * full series makes every later scope change — and the MAX-window
 * resolution that needs each asset's first bar — free.
 *
 * The in-process map on top of that collapses the eight tiles of one render
 * into one call per symbol. It does not survive the request on Vercel, where
 * consecutive requests land on different instances; the shared cache above
 * is what carries across them.
 */
async function load(symbol: string): Promise<Candle[]> {
  const now = new Date();
  const monthStart = `${now.toISOString().slice(0, 7)}-01`;
  const today = now.toISOString().slice(0, 10);

  const [archive, tail] = await Promise.all([
    getArchive(symbol, monthStart),
    getTail(symbol, monthStart, today),
  ]);

  // The tail wins on any date they share — it is the fresher read.
  const seen = new Set(tail.map((c) => c.date));
  return [...archive.filter((c) => !seen.has(c.date)), ...tail];
}

export async function getFullHistory(symbol: string): Promise<Candle[]> {
  const hit = cache.get(symbol);
  if (hit && Date.now() - hit.fetchedAt < TTL_MS) return hit.candles;

  const pending = inflight.get(symbol);
  if (pending) return pending;

  const request = load(symbol)
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
