"use client";

import { useMemo, useState } from "react";

import { AddAssetDialog } from "@/components/domain/add-asset-dialog";
import { AssetGrid } from "@/components/domain/asset-grid";
import { BoardError } from "@/components/domain/board-error";
import { OverlayView } from "@/components/domain/overlay-view";
import { RemoteControl } from "@/components/domain/remote-control";
import { WindowNotice } from "@/components/domain/window-notice";
import { BoardSkeleton } from "@/components/domain/tile-skeleton";
import { useBoard } from "@/lib/use-board";
import type { UserSettings } from "@/lib/types/settings";
import type { WatchedAsset } from "@/lib/watchlist-types";
import { useViewOptions } from "@/lib/use-view-options";
import { useWatchlist } from "@/lib/watchlist-store";
import type { BoardSeries } from "@/lib/market/board";

interface DashboardViewProps {
  /** Null for a guest; the watchlist then lives in this browser only. */
  userId: string | null;
  initialAssets: WatchedAsset[];
  settings: UserSettings;
}

/**
 * Owns the watchlist and the fetched board; every child below is
 * presentational. The board is fetched from a route handler rather than
 * rendered on the server because the guest watchlist only exists in the
 * browser — the server has nothing to render it from.
 */
export function DashboardView({ userId, initialAssets, settings }: DashboardViewProps) {
  const [options, setOptions] = useViewOptions(settings, userId !== null);
  const { items, add, remove, reorder } = useWatchlist(userId, initialAssets);
  const { board, loading, error, reload } = useBoard(items, options);
  const [adding, setAdding] = useState(false);

  const seriesBySymbol = useMemo(() => {
    const map: Record<string, BoardSeries | undefined> = {};
    for (const series of board?.series ?? []) map[series.symbol] = series;
    return map;
  }, [board]);

  return (
    <>
      {/* Bottom padding clears the floating remote so the last tile is
          never trapped underneath it. */}
      {/* Same shape the route skeleton was showing, so the handoff from the
          server wait to the client fetch does not jump. It knows the real
          tile count by now, which the route skeleton could not. */}
      {!error && loading && !board ? (
        <BoardSkeleton count={items.length || undefined} />
      ) : (
      <div className="flex flex-col gap-5 px-4 pt-5 pb-28 md:px-6">
        {board ? (
          <WindowNotice from={board.from} to={board.to} limitedBy={board.limitedBy} />
        ) : null}

        {error ? (
          <BoardError message={error} onRetry={reload} />
        ) : options.mode === "overlay" ? (
          <OverlayView assets={items} seriesBySymbol={seriesBySymbol} log={options.log} />
        ) : (
          <AssetGrid
            assets={items}
            seriesBySymbol={seriesBySymbol}
            log={options.log}
            onRemove={remove}
            onReorder={reorder}
            onAdd={() => setAdding(true)}
          />
        )}
      </div>
      )}

      <RemoteControl
        options={options}
        onChange={setOptions}
      />

      <AddAssetDialog
        open={adding}
        onOpenChange={setAdding}
        onAdd={add}
      />
    </>
  );
}
