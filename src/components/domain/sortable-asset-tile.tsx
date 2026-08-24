"use client";

import { useEffect, useRef } from "react";

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
 * Dragging is bound to the grip rather than the whole cell, because the cell
 * is a link and one set of pixels cannot be both a drag target and a click
 * target without one of them feeling broken.
 *
 * Two separate paths have to be stopped from reaching that link, and each
 * needs its own handler:
 *
 * `swallow` covers a press that never moved. The sensor does not activate
 * under 4px, so nothing else intervenes and the click must be cancelled
 * where it lands.
 *
 * `guardClick` covers the click that trails a real drag. When the drop
 * lands outside the tile's own slot the list reorders and the tile's DOM
 * moves, and the trailing click then reaches the link rather than being
 * handled by the button it started on. Dropping in place reorders nothing
 * and does not show the bug, which is what made it look intermittent.
 * Catching it in the capture phase, above the link, works regardless of
 * which element ends up receiving it.
 */
export function SortableAssetTile({ onRemove, ...tile }: SortableAssetTileProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: tile.symbol });

  const draggedRef = useRef(false);

  useEffect(() => {
    if (isDragging) {
      draggedRef.current = true;
      return;
    }
    if (!draggedRef.current) return;
    // A drag can end without any click — dropped outside, cancelled with
    // Escape. Clearing on a timer keeps the flag from swallowing the next
    // real click; a click that does arrive clears it first.
    const timer = setTimeout(() => {
      draggedRef.current = false;
    }, 250);
    return () => clearTimeout(timer);
  }, [isDragging]);

  function swallow(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  function guardClick(event: React.MouseEvent) {
    if (!draggedRef.current) return;
    draggedRef.current = false;
    swallow(event);
  }

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      onClickCapture={guardClick}
      className={cn("relative", isDragging && "z-10 opacity-80")}
    >
      <AssetTile
        {...tile}
        controls={
          <span className="-mr-1 flex shrink-0 items-center gap-0.5">
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
