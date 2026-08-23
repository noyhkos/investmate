"use client";

import Link from "next/link";

import { Sparkline } from "@/components/chart/sparkline";
import { DeltaValue, MetricFigure, MetricLine, Plane } from "@/components/ds";
import { formatCagr, formatPrice, formatTotalReturn, formatYear } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PerformanceSummary } from "@/lib/types/performance";

export interface AssetTileProps {
  symbol: string;
  name: string;
  currency: string;
  closes: number[];
  summary: PerformanceSummary | null;
  className?: string;
  /** Rendered top-right; used by edit mode for the remove control. */
  action?: React.ReactNode;
  interactive?: boolean;
  log?: boolean;
}

/**
 * One asset at a glance. CAGR is the headline rather than total return
 * because listing dates differ — +412% over twenty years and +389% over
 * fifteen are not comparable, 8.4%/yr and 11.2%/yr are.
 *
 * The tile has a fill and no border, and that fill is exactly the chart
 * surface, so the sparkline can bleed to the edges with no visible canvas
 * seam. Separation from the page comes from the ground stepping away.
 */
export function AssetTile({
  symbol,
  name,
  currency,
  closes,
  summary,
  className,
  action,
  interactive = true,
  log = true,
}: AssetTileProps) {
  const body = (
    <Plane
      className={cn(
        "flex flex-col gap-3 overflow-hidden pt-3 pb-0",
        interactive && "hover:bg-accent transition-colors",
        className,
      )}
    >
      <div className="flex items-start gap-2 px-3.5">
        <div className="min-w-0 flex-1">
          <div className="text-foreground truncate text-[0.8125rem] font-medium">{name}</div>
          <div className="text-muted-foreground mt-0.5 text-[0.6875rem] tabular-nums">{symbol}</div>
        </div>
        {action}
      </div>

      <div className="flex items-baseline justify-between gap-2 px-3.5">
        <span className="text-foreground text-[0.9375rem] tabular-nums">
          {summary ? formatPrice(summary.endPrice, currency) : "—"}
        </span>
        {summary ? <DeltaValue change={summary.dayChange} className="text-[0.75rem]" /> : null}
      </div>

      <div className="px-3.5">
        <MetricFigure
          label="연"
          value={summary ? formatCagr(summary.cagr) : "—"}
        />
        <MetricLine
          className="mt-1.5"
          items={
            summary
              ? [
                  { value: `${formatYear(summary.from)}~` },
                  { value: formatTotalReturn(summary.totalReturn) },
                ]
              : [{ value: "데이터 없음" }]
          }
        />
      </div>

      <Sparkline
        values={closes}
        change={summary?.dayChange ?? 0}
        log={log}
        label={`${name} 추이`}
        className="mt-1"
      />
    </Plane>
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
