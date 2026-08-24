import { SkeletonBar } from "@/components/domain/tile-skeleton";

/**
 * One skeleton, used by both loading states on the detail page.
 *
 * There are two waits in a row: the route's server component, then the
 * client fetch for the prices. They used to look different — a grey
 * skeleton, then the real heading with an em dash where the price goes and
 * an empty box where the chart goes. The second state reads as broken
 * rather than as loading, and the swap between them is the flicker.
 *
 * Sharing one shape makes the handoff invisible.
 */
export function AssetDetailSkeleton() {
  return (
    <div className="flex flex-col gap-5 px-4 pt-5 pb-28 md:px-6">
      <SkeletonBar className="h-3 w-20" />
      <div className="flex flex-col gap-2">
        <SkeletonBar className="h-5 w-40" />
        <SkeletonBar className="h-6 w-56" />
      </div>
      <div className="bg-card rounded-[var(--radius)] p-2">
        <SkeletonBar className="h-[380px] w-full" />
      </div>
    </div>
  );
}
