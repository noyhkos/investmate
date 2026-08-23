"use client";

import { Plus } from "lucide-react";

interface AddAssetTileProps {
  onClick: () => void;
}

/** Always present as the last cell — adding is not hidden behind a menu. */
export function AddAssetTile({ onClick }: AddAssetTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 focus-visible:ring-ring flex min-h-[11.5rem] cursor-pointer flex-col items-center justify-center gap-2 rounded-[var(--radius)] border border-dashed text-[0.75rem] transition-colors focus-visible:ring-2 focus-visible:outline-none"
    >
      <Plus className="size-5" aria-hidden />
      종목 추가
    </button>
  );
}
