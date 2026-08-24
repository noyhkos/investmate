"use client";

import { useCallback } from "react";

import { SEED_WATCHLIST, type SeedEntry } from "@/lib/fixtures/watchlist";
import { useStoredState } from "@/lib/use-stored-state";

// v2 dropped the group field; a stale v1 payload would carry it back in.
const STORAGE_KEY = "investmate:watchlist:v2";

export type WatchedAsset = SeedEntry;

/**
 * Local stand-in for the `watchlist` table. Every mutation the UI needs is
 * defined here, so swapping in Supabase later means replacing this module
 * rather than touching the components that call it.
 */
export function useWatchlist() {
  const [items, write] = useStoredState<WatchedAsset[]>(STORAGE_KEY, SEED_WATCHLIST);

  const add = useCallback(
    (asset: WatchedAsset) => {
      if (items.some((a) => a.symbol === asset.symbol)) return;
      write([...items, asset]);
    },
    [items, write],
  );

  const remove = useCallback(
    (symbol: string) => write(items.filter((a) => a.symbol !== symbol)),
    [items, write],
  );

  const reset = useCallback(() => write(SEED_WATCHLIST), [write]);

  return { items, add, remove, reorder: write, reset };
}
