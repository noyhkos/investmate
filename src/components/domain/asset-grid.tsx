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
import { AssetTile } from "@/components/domain/asset-tile";
import { SortableAssetTile } from "@/components/domain/sortable-asset-tile";
import type { WatchedAsset } from "@/lib/watchlist-store";
import type { BoardSeries } from "@/lib/market/board";

interface AssetGridProps {
  assets: WatchedAsset[];
  seriesBySymbol: Record<string, BoardSeries | undefined>;
  editing: boolean;
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
  editing,
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

  if (editing) {
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
                currency={asset.currency}
                closes={closesOf(seriesBySymbol[asset.symbol])}
                summary={seriesBySymbol[asset.symbol]?.summary ?? null}
                log={log}
                onRemove={onRemove}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    );
  }

  return (
    <div className={COLUMNS}>
      {assets.map((asset) => (
        <AssetTile
          key={asset.symbol}
          symbol={asset.symbol}
          name={asset.name}
          type={asset.type}
          currency={asset.currency}
          closes={closesOf(seriesBySymbol[asset.symbol])}
          summary={seriesBySymbol[asset.symbol]?.summary ?? null}
          log={log}
        />
      ))}
      <AddAssetTile onClick={onAdd} />
    </div>
  );
}

function closesOf(series: BoardSeries | undefined): number[] {
  return series ? series.candles.map((c) => c.close) : [];
}
