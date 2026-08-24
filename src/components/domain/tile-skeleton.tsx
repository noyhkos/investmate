/**
 * Mirrors AssetTile's geometry rather than being a plain block.
 *
 * A skeleton that is the wrong shape costs more than none: the layout jumps
 * when the real tile lands, and the eye re-reads the whole grid. The three
 * text rows and the plot band are at the same heights as the real thing, so
 * the swap is invisible except for the content appearing.
 */
export function TileSkeleton() {
  return (
    <div className="bg-card border-border/40 flex flex-col gap-2.5 overflow-hidden rounded-[var(--radius)] border-2 pt-3 pb-0">
      <div className="flex items-center justify-between gap-2 px-3.5">
        <Bar className="h-3.5 w-24" />
        <Bar className="h-3 w-8" />
      </div>
      <div className="flex items-baseline justify-between gap-2 px-3.5">
        <Bar className="h-7 w-32" />
        <Bar className="h-3 w-12" />
      </div>
      <div className="flex items-baseline justify-between gap-2 px-3.5">
        <Bar className="h-4 w-16" />
        <Bar className="h-3 w-20" />
      </div>
      <Bar className="mt-1 h-[72px] w-full rounded-none" />
    </div>
  );
}

export function TileGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <TileSkeleton key={i} />
      ))}
    </div>
  );
}

function Bar({ className }: { className?: string }) {
  return <div className={`bg-muted-foreground/15 animate-pulse rounded-[2px] ${className}`} />;
}
