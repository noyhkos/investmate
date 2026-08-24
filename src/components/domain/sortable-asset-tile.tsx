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
 * Dragging is bound to the grip rather than the whole cell, precisely
 * because the cell is a link: a full-cell drag target and a click target
 * cannot share the same pixels without one of them feeling broken.
 */
export function SortableAssetTile({ onRemove, ...tile }: SortableAssetTileProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: tile.symbol });

  // A drag moves the tile out from under the cursor, so the browser dispatches
  // the trailing click to the nearest common ancestor of pointerdown and
  // pointerup — the link, not the grip. Handlers on the grip never see it.
  // This flag catches that click in the capture phase instead.
  const draggedRef = useRef(false);

  useEffect(() => {
    if (isDragging) {
      draggedRef.current = true;
      return;
    }
    if (!draggedRef.current) return;
    // A drag can end without any click at all — dropped outside, cancelled
    // with Escape. Clearing on a timer keeps the flag from swallowing the
    // next real click; a click that does arrive clears it first.
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
