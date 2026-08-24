"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  addToWatchlist,
  removeFromWatchlist,
  reorderWatchlist,
  seedWatchlist,
} from "@/lib/actions/watchlist";
import { SEED_WATCHLIST } from "@/lib/fixtures/watchlist";
import { useStoredState } from "@/lib/use-stored-state";
import type { WatchedAsset } from "@/lib/watchlist-types";

export type { WatchedAsset };

const STORAGE_KEY = "investmate:watchlist:v2";

/**
 * The watchlist, from whichever store owns it.
 *
 * Signed out, the list lives in this browser so the dashboard is usable
 * without an account. Signed in, the server owns it and edits are applied
 * optimistically — a reorder should not wait on a round trip to look like it
 * happened.
 */
export function useWatchlist(userId: string | null, initial: WatchedAsset[]) {
  const [guest, writeGuest] = useStoredState<WatchedAsset[]>(STORAGE_KEY, SEED_WATCHLIST);
  const [server, setServer] = useState<WatchedAsset[]>(initial);
  const seeded = useRef(false);

  const signedIn = userId !== null;
  const items = signedIn ? server : guest;

  // First sign-in carries the guest list up. The action ignores the request
  // if the account already has rows, so this cannot overwrite another
  // device's list.
  useEffect(() => {
    if (!signedIn || seeded.current || initial.length > 0) return;
    seeded.current = true;
    const local = guest;
    if (local.length === 0) return;
    void seedWatchlist(local).then((result) => {
      if (result.ok) setServer(local);
    });
  }, [signedIn, initial.length, guest]);

  const add = useCallback(
    (asset: WatchedAsset) => {
      if (items.some((a) => a.symbol === asset.symbol)) return;
      const next = [...items, asset];
      if (signedIn) {
        setServer(next);
        void addToWatchlist(asset);
      } else {
        writeGuest(next);
      }
    },
    [items, signedIn, writeGuest],
  );

  const remove = useCallback(
    (symbol: string) => {
      const next = items.filter((a) => a.symbol !== symbol);
      if (signedIn) {
        setServer(next);
        void removeFromWatchlist(symbol);
      } else {
        writeGuest(next);
      }
    },
    [items, signedIn, writeGuest],
  );

  const reorder = useCallback(
    (next: WatchedAsset[]) => {
      if (signedIn) {
        setServer(next);
        void reorderWatchlist(next.map((a) => a.symbol));
      } else {
        writeGuest(next);
      }
    },
    [signedIn, writeGuest],
  );

  return { items, add, remove, reorder };
}
