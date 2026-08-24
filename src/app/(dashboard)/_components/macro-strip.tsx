import { Suspense } from "react";

import { AccountMenu } from "@/components/domain/account-menu";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UpColorToggle } from "@/components/layout/up-color-toggle";
import { getMacroReadings } from "@/lib/market/macro";
import { formatPrice } from "@/lib/format";

/**
 * The strip splits in two on purpose.
 *
 * The chrome — wordmark, toggles, account — needs no data and renders
 * immediately. The readings need six quotes, and before this split that
 * fetch sat in the layout's critical path: nothing at all reached the
 * browser, not even a skeleton, until it finished. Behind a Suspense
 * boundary the shell streams first and the numbers arrive when they arrive.
 */
export function MacroStrip({ email }: { email: string | null }) {
  return (
    <header className="border-rule border-b">
      <div className="flex items-baseline gap-3 px-4 py-2 md:px-6">
        <span className="font-heading text-sm font-semibold">investmate</span>
        <div className="ml-auto flex items-center gap-2">
          <UpColorToggle />
          <ThemeToggle />
          <AccountMenu email={email} />
        </div>
      </div>
      <Suspense fallback={<MacroReadingsSkeleton />}>
        <MacroReadings />
      </Suspense>
    </header>
  );
}

async function MacroReadings() {
  const readings = await getMacroReadings();

  return (
    <div className="flex gap-5 overflow-x-auto px-4 pb-2 text-xs md:px-6">
      {readings.map((r) => (
        <div key={r.name} className="flex shrink-0 items-baseline gap-1.5">
          <span className="text-muted-foreground">{r.name}</span>
          <span className="text-foreground tabular-nums">
            {formatPrice(r.price, r.currency, r.type)}
          </span>
          <span className="text-text-secondary tabular-nums">
            {/* Only the glyph is tinted — the colour budget belongs to the
                grid, not to the ticker tape above it. */}
            <span className={r.change >= 0 ? "text-rise-text" : "text-fall-text"}>
              {r.change >= 0 ? "▲" : "▼"}
            </span>
            {Math.abs(r.change * 100).toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  );
}

/** Holds the strip's exact height so the page does not jump when it fills. */
function MacroReadingsSkeleton() {
  return (
    <div className="flex gap-5 px-4 pb-2 md:px-6" aria-hidden>
      {[64, 60, 44, 48, 56, 72].map((w, i) => (
        <div
          key={i}
          className="bg-muted-foreground/15 h-4 shrink-0 animate-pulse rounded-[2px]"
          style={{ width: w }}
        />
      ))}
    </div>
  );
}
