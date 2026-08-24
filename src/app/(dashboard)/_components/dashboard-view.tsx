"use client";

import { useMemo, useState } from "react";

import { AddAssetDialog } from "@/components/domain/add-asset-dialog";
import { AssetGrid } from "@/components/domain/asset-grid";
import { BoardError } from "@/components/domain/board-error";
import { OverlayView } from "@/components/domain/overlay-view";
import { RemoteControl } from "@/components/domain/remote-control";
import { WindowNotice } from "@/components/domain/window-notice";
import { Skeleton } from "@/components/ui/skeleton";
import { useBoard } from "@/lib/use-board";
import { useViewOptions } from "@/lib/use-view-options";
import { useWatchlist } from "@/lib/watchlist-store";
import type { BoardSeries } from "@/lib/market/board";

/**
 * Owns the watchlist and the fetched board; every child below is presentational.
 * The watchlist lives in the browser for now, which is why the board is fetched
 * from a route handler rather than rendered on the server.
 */
export function DashboardView() {
  const [options, setOptions] = useViewOptions();
  const { items, add, remove, reorder } = useWatchlist();
  const { board, loading, error, reload } = useBoard(items, options);
  const [editing, setEditing] = useState(false);
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
      <div className="flex flex-col gap-5 px-4 pt-5 pb-28 md:px-6">
        {board ? (
          <WindowNotice from={board.from} to={board.to} limitedBy={board.limitedBy} />
        ) : null}

        {error ? (
          <BoardError message={error} onRetry={reload} />
        ) : loading && !board ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-46 w-full" />
            ))}
          </div>
        ) : options.mode === "overlay" ? (
          <OverlayView assets={items} seriesBySymbol={seriesBySymbol} log={options.log} />
        ) : (
          <AssetGrid
            assets={items}
            seriesBySymbol={seriesBySymbol}
            editing={editing}
            log={options.log}
            onRemove={remove}
            onReorder={reorder}
            onAdd={() => setAdding(true)}
          />
        )}
      </div>

      <RemoteControl
        options={options}
        onChange={setOptions}
        editing={editing}
        onEditingChange={setEditing}
      />

      <AddAssetDialog
        open={adding}
        onOpenChange={setAdding}
        onAdd={add}
      />
    </>
  );
}
