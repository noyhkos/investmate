import { AccountMenu } from "@/components/domain/account-menu";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UpColorToggle } from "@/components/layout/up-color-toggle";
import { fetchDailyCandles } from "@/lib/market/yahoo";
import { MACRO_SYMBOLS } from "@/lib/market/symbols";
import type { AssetType } from "@/lib/types/asset";
import { summarize } from "@/lib/metrics/returns";
import { formatPrice } from "@/lib/format";

// Daily bars change once a session; a hot cache keeps the strip off the
// provider's rate limit and out of the page's critical path.
export const revalidate = 3600;

interface MacroReading {
  name: string;
  price: number;
  change: number;
  currency: string;
  type: AssetType;
}

async function readMacro(): Promise<MacroReading[]> {
  const to = new Date();
  const from = new Date(to);
  from.setDate(from.getDate() - 14);

  const readings = await Promise.all(
    MACRO_SYMBOLS.map(async ({ symbol, name, currency, type }) => {
      try {
        const candles = await fetchDailyCandles(symbol, {
          from: from.toISOString().slice(0, 10),
          to: to.toISOString().slice(0, 10),
        });
        const summary = summarize(candles);
        if (!summary) return null;
        return { name, price: summary.endPrice, change: summary.dayChange, currency, type };
      } catch {
        // One unavailable symbol must not blank the whole strip.
        return null;
      }
    }),
  );

  return readings.filter((r): r is MacroReading => r !== null);
}

export async function MacroStrip({ email }: { email: string | null }) {
  const readings = await readMacro();

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
      <div className="flex gap-5 overflow-x-auto px-4 pb-2 text-xs md:px-6">
        {readings.map((r) => (
          <div key={r.name} className="flex shrink-0 items-baseline gap-1.5">
            <span className="text-muted-foreground">{r.name}</span>
            <span className="tabular-nums text-foreground">
              {formatPrice(r.price, r.currency, r.type)}
            </span>
            <span className="text-text-secondary tabular-nums">
              {/* Only the glyph is tinted. Nine tiles of saturated numerals would
                  spend the whole colour budget on today's move, in a tool whose
                  window is measured in years. */}
              <span className={r.change >= 0 ? "text-rise-text" : "text-fall-text"}>
                {r.change >= 0 ? "▲" : "▼"}
              </span>
              {Math.abs(r.change * 100).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </header>
  );
}
