import { Suspense } from "react";
import type { Metadata } from "next";

import { DashboardView } from "@/app/(dashboard)/_components/dashboard-view";
import { getSessionData } from "@/lib/session";
import { BoardSkeleton } from "@/components/domain/tile-skeleton";

export const metadata: Metadata = { title: "대시보드" };

export default async function DashboardPage() {
  const { userId, assets, settings } = await getSessionData();

  return (
    // useSearchParams needs a boundary. The fallback is the board skeleton
    // rather than a bar: three waits stack here — the route, this boundary,
    // then the client fetch — and anything that is not the same shape shows
    // up as the page collapsing and springing back between them. On a signed
    // in load the tile count is known, so only the last step moves.
    <Suspense fallback={<BoardSkeleton count={assets.length || undefined} />}>
      <DashboardView userId={userId} initialAssets={assets} settings={settings} />
    </Suspense>
  );
}
