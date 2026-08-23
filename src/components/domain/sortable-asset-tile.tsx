"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";

import { AssetTile, type AssetTileProps } from "@/components/domain/asset-tile";
import { cn } from "@/lib/utils";

interface SortableAssetTileProps extends Omit<AssetTileProps, "action" | "interactive"> {
  onRemove: (symbol: string) => void;
}

/**
 * Edit affordances live in a mode rather than on hover: hover does not exist
 * on touch, and one mode means one code path for both.
 */
export function SortableAssetTile({ onRemove, ...tile }: SortableAssetTileProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: tile.symbol });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn("relative", isDragging && "z-10 opacity-80")}
    >
      <AssetTile
        {...tile}
        interactive={false}
        className="border-border border border-dashed"
        action={
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              {...attributes}
              {...listeners}
              aria-label={`${tile.name} 순서 변경`}
              className="text-muted-foreground hover:text-foreground focus-visible:ring-ring cursor-grab touch-none rounded-[2px] p-1 focus-visible:ring-2 focus-visible:outline-none active:cursor-grabbing"
            >
              <GripVertical className="size-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => onRemove(tile.symbol)}
              aria-label={`${tile.name} 제거`}
              className="text-muted-foreground hover:text-rise-text focus-visible:ring-ring cursor-pointer rounded-[2px] p-1 focus-visible:ring-2 focus-visible:outline-none"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
        }
      />
    </div>
  );
}
