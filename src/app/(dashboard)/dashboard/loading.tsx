import { TileGridSkeleton } from "@/components/domain/tile-skeleton";

/**
 * Shown the instant a navigation to the board starts, instead of leaving the
 * previous page on screen while the server works. Without this the click has
 * no visible effect for the length of the round trip, which reads as the app
 * having ignored it.
 */
export default function Loading() {
  return (
    <div className="flex flex-col gap-5 px-4 pt-5 pb-28 md:px-6">
      <div className="bg-muted-foreground/15 h-3 w-56 animate-pulse rounded-[2px]" />
      <TileGridSkeleton />
    </div>
  );
}
