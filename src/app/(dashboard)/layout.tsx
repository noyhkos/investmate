import type { Metadata } from "next";

import { MacroStrip } from "./_components/macro-strip";
import { SettingsProvider } from "@/components/layout/settings-provider";
import { getUser } from "@/lib/auth";
import { getSessionData } from "@/lib/session";

// Per-user surface: never indexed, and no canonical to advertise.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [{ userId, settings }, user] = await Promise.all([getSessionData(), getUser()]);

  return (
    <SettingsProvider userId={userId} settings={settings}>
      <div className="flex min-h-full flex-col">
        <MacroStrip email={user?.email ?? null} />
        <main className="flex-1">{children}</main>
      </div>
    </SettingsProvider>
  );
}
