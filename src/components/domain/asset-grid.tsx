"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import { AddAssetTile } from "@/components/domain/add-asset-tile";
import { SortableAssetTile } from "@/components/domain/sortable-asset-tile";
import type { WatchedAsset } from "@/lib/watchlist-store";
import type { BoardSeries } from "@/lib/market/board";

interface AssetGridProps {
  assets: WatchedAsset[];
  seriesBySymbol: Record<string, BoardSeries | undefined>;
  log: boolean;
  onRemove: (symbol: string) => void;
  onReorder: (next: WatchedAsset[]) => void;
  onAdd: () => void;
}

/**
 * Three columns is the density the tile's type scale was sized for; below
 * that the sparkline stops resolving a decade of shape.
 */
const COLUMNS = "grid gap-3 sm:grid-cols-2 lg:grid-cols-3";

export function AssetGrid({
  assets,
  seriesBySymbol,
  log,
  onRemove,
  onReorder,
  onAdd,
}: AssetGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = assets.findIndex((a) => a.symbol === active.id);
    const to = assets.findIndex((a) => a.symbol === over.id);
    if (from < 0 || to < 0) return;
    onReorder(arrayMove(assets, from, to));
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={assets.map((a) => a.symbol)} strategy={rectSortingStrategy}>
        <div className={COLUMNS}>
          {assets.map((asset) => (
            <SortableAssetTile
              key={asset.symbol}
              symbol={asset.symbol}
              name={asset.name}
              type={asset.type}
              currency={currencyOf(seriesBySymbol[asset.symbol], asset)}
              closes={closesOf(seriesBySymbol[asset.symbol])}
              summary={seriesBySymbol[asset.symbol]?.summary ?? null}
              log={log}
              onRemove={onRemove}
            />
          ))}
          <AddAssetTile onClick={onAdd} />
        </div>
      </SortableContext>
    </DndContext>
  );
}

function closesOf(series: BoardSeries | undefined): number[] {
  return series?.closes ?? [];
}

/**
 * The board's currency, not the watchlist's.
 *
 * With the KRW toggle on the server restates a US holding in won, and the
 * response says so. Reading the currency off the watchlist entry instead
 * left the figure converted and the mark unchanged — $309.35 became 430,241
 * still labelled in dollars. Falls back to the asset while the board is
 * still loading.
 */
function currencyOf(series: BoardSeries | undefined, asset: WatchedAsset): string {
  return series?.currency ?? asset.currency;
}
