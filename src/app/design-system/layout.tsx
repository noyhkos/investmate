import type { Metadata } from "next";

import { ThemeToggle } from "@/components/layout/theme-toggle";

export const metadata: Metadata = {
  title: "디자인 시스템",
  robots: { index: false, follow: false },
};

export default function DesignSystemLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-rule flex items-center gap-3 border-b px-4 py-3 md:px-6">
        <span className="font-heading text-sm font-semibold">investmate</span>
        <span className="text-muted-foreground text-[0.75rem]">디자인 시스템</span>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </header>
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 md:px-6">{children}</main>
    </div>
  );
}
