import { Suspense } from "react";
import type { Metadata } from "next";

import { DashboardView } from "@/app/(dashboard)/_components/dashboard-view";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "대시보드" };

export default function DashboardPage() {
  return (
    // useSearchParams needs a boundary; the control row is the first thing
    // that reads the view state out of the URL.
    <Suspense fallback={<Skeleton className="m-4 h-12 md:m-6" />}>
      <DashboardView />
    </Suspense>
  );
}
