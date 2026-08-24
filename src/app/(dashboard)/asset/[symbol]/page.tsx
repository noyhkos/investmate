import { Suspense } from "react";
import type { Metadata } from "next";

import { AssetDetail } from "@/components/domain/asset-detail";
import { AssetDetailSkeleton } from "@/components/domain/asset-detail-skeleton";
import { getSessionData } from "@/lib/session";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * Lives inside the (dashboard) group so it shares that layout. The macro
 * strip, the settings provider and the session all persist across a move
 * between the board and a detail page; before this the page rebuilt its own
 * copy of the shell, which meant re-fetching the strip on every navigation.
 * The route group does not appear in the URL — this is still /asset/AAPL.
 */
export default async function AssetPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;
  const { userId, assets, settings } = await getSessionData();

  return (
    <Suspense fallback={<AssetDetailSkeleton />}>
      <AssetDetail
        symbol={decodeURIComponent(symbol)}
        userId={userId}
        watchlist={assets}
        settings={settings}
      />
    </Suspense>
  );
}
