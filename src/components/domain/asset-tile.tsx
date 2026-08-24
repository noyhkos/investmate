"use client";

import Link from "next/link";

import { Sparkline } from "@/components/chart/sparkline";
import { DeltaValue } from "@/components/ds";
import { ASSET_TYPE_LABEL, assetTypeBorder } from "@/lib/asset-type";
import { formatCagr, formatPrice, formatTotalReturn, formatYear } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AssetType } from "@/lib/types/asset";
import type { PerformanceSummary } from "@/lib/types/performance";

export interface AssetTileProps {
  symbol: string;
  name: string;
  type: AssetType;
  currency: string;
  closes: number[];
  summary: PerformanceSummary | null;
  className?: string;
  /** Reorder and remove controls, rendered after the type label. */
  controls?: React.ReactNode;
  interactive?: boolean;
  log?: boolean;
}

/**
 * One asset at a glance, in three lines of text and a plot.
 *
 * CAGR is the headline rather than total return because listing dates
 * differ — +412% over twenty years and +389% over fifteen are not
 * comparable, 8.4%/yr and 11.2%/yr are. The ticker, start year and total
 * return all sit at label size beside the figures they qualify, so the plot
 * gets the height instead of a fourth and fifth line of text.
 *
 * The tile has a fill and its only border is the type hairline, and that
 * fill is exactly the chart surface, so the sparkline bleeds to the edges
 * with no visible canvas seam.
 */
export function AssetTile({
  symbol,
  name,
  type,
  currency,
  closes,
  summary,
  className,
  controls,
  interactive = true,
  log = false,
}: AssetTileProps) {
  const body = (
    <div
      style={{ borderColor: assetTypeBorder(type) }}
      className={cn(
        "bg-card flex flex-col gap-2.5 overflow-hidden rounded-[var(--radius)] border-2 pt-3 pb-0",
        interactive && "hover:bg-accent transition-colors",
        className,
      )}
    >
      {/* Two layers on purpose: the name and the type share a baseline, which
          icon buttons cannot join — an icon has no baseline, so a single
          items-baseline row hangs them below the text. The text group is
          centred against the controls instead. */}
      <div className="flex items-center gap-2 px-3.5">
        <span className="flex min-w-0 flex-1 items-baseline gap-2">
          <span className="text-foreground truncate text-[0.8125rem] font-medium">{name}</span>
          <span className="text-muted-foreground shrink-0 text-[0.6875rem]">
            {ASSET_TYPE_LABEL[type]}
          </span>
        </span>
        {controls}
      </div>

      <div className="flex items-baseline justify-between gap-2 px-3.5">
        <span className="text-foreground text-[0.9375rem] tabular-nums">
          {summary ? formatPrice(summary.endPrice, currency) : "—"}
        </span>
        {summary ? <DeltaValue change={summary.dayChange} className="text-[0.75rem]" /> : null}
      </div>

      <div className="flex items-baseline justify-between gap-2 px-3.5">
        <span className="flex items-baseline gap-1.5">
          <span className="text-muted-foreground text-[0.6875rem]">연</span>
          <span className="text-foreground text-[1.75rem] leading-none font-medium tracking-tight tabular-nums">
            {summary ? formatCagr(summary.cagr) : "—"}
          </span>
        </span>
        <span className="text-muted-foreground shrink-0 text-[0.6875rem] tabular-nums">
          {summary ? `${formatYear(summary.from)}~ ${formatTotalReturn(summary.totalReturn)}` : symbol}
        </span>
      </div>

      <Sparkline
        values={closes}
        change={summary?.dayChange ?? 0}
        log={log}
        height={72}
        label={`${name} 추이`}
      />
    </div>
  );

  if (!interactive) return body;

  return (
    <Link
      href={`/asset/${encodeURIComponent(symbol)}`}
      className="focus-visible:ring-ring cursor-pointer rounded-[var(--radius)] focus-visible:ring-2 focus-visible:outline-none"
    >
      {body}
    </Link>
  );
}
