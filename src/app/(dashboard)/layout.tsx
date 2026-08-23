import type { Metadata } from "next";
import { MacroStrip } from "./_components/macro-strip";

// Per-user surface: never indexed, and no canonical to advertise.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col">
      <MacroStrip />
      <main className="flex-1">{children}</main>
    </div>
  );
}
