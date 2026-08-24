import Link from "next/link";
import { AccountMenu } from "@/components/domain/account-menu";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/seo";

export function SiteHeader({ email }: { email: string | null }) {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="font-heading text-sm font-semibold">
          {SITE.name}
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <AccountMenu email={email} />
          <Button asChild size="sm">
            <Link href="/dashboard">대시보드</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
