"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";

import { AssetTile, type AssetTileProps } from "@/components/domain/asset-tile";
import { cn } from "@/lib/utils";

interface SortableAssetTileProps extends Omit<AssetTileProps, "controls"> {
  onRemove: (symbol: string) => void;
}

/**
 * The grid is always editable — there is no mode to enter.
 *
 * A mode was buying nothing here: the two controls are small, they sit in
 * space the header row already had, and a reader who wants to drop a ticker
 * should not have to declare an intention first. The tile stays a link to
 * its detail page, so both controls stop the click from reaching it.
 *
 * Dragging is bound to the grip rather than the whole cell, precisely
 * because the cell is a link: a full-cell drag target and a click target
 * cannot share the same pixels without one of them feeling broken.
 */
export function SortableAssetTile({ onRemove, ...tile }: SortableAssetTileProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: tile.symbol });

  function swallow(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn("relative", isDragging && "z-10 opacity-80")}
    >
      <AssetTile
        {...tile}
        controls={
          <span className="-my-1 flex shrink-0 items-center gap-0.5">
            <button
              type="button"
              {...attributes}
              {...listeners}
              onClick={swallow}
              aria-label={`${tile.name} 순서 변경`}
              className="text-muted-foreground hover:text-foreground focus-visible:ring-ring cursor-grab touch-none rounded-[2px] p-0.5 focus-visible:ring-2 focus-visible:outline-none active:cursor-grabbing"
            >
              <GripVertical className="size-3.5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={(event) => {
                swallow(event);
                onRemove(tile.symbol);
              }}
              aria-label={`${tile.name} 제거`}
              className="text-muted-foreground hover:text-rise-text focus-visible:ring-ring cursor-pointer rounded-[2px] p-0.5 focus-visible:ring-2 focus-visible:outline-none"
            >
              <X className="size-3.5" aria-hidden />
            </button>
          </span>
        }
      />
    </div>
  );
}
