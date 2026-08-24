import { Suspense } from "react";
import type { Metadata } from "next";

import { AssetDetail } from "@/components/domain/asset-detail";
import { getSessionData } from "@/lib/session";
import { getUser } from "@/lib/auth";
import { SettingsProvider } from "@/components/layout/settings-provider";
import { MacroStrip } from "@/app/(dashboard)/_components/macro-strip";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AssetPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;
  const { userId, assets, settings } = await getSessionData();
  const user = await getUser();

  return (
    <SettingsProvider userId={userId} settings={settings}>
      <div className="flex min-h-full flex-col">
      <MacroStrip email={user?.email ?? null} />
      <main className="flex-1">
        <Suspense fallback={<Skeleton className="m-4 h-96 md:m-6" />}>
          <AssetDetail
            symbol={decodeURIComponent(symbol)}
            userId={userId}
            watchlist={assets}
            settings={settings}
          />
        </Suspense>
      </main>
      </div>
    </SettingsProvider>
  );
}
