"use client";

import { cn } from "@/lib/utils";
import { formatTotalReturn } from "@/lib/format";

export interface LegendEntry {
  symbol: string;
  name: string;
  color: string | undefined;
  totalReturn: number | null;
  visible: boolean;
}

interface OverlayLegendProps {
  entries: LegendEntry[];
  onToggle: (symbol: string) => void;
}

/**
 * Identity is never colour alone: every row carries the name and its return,
 * so the chart stays readable without distinguishing eight hues. Entries past
 * the palette are shown as unavailable rather than given an invented colour.
 */
export function OverlayLegend({ entries, onToggle }: OverlayLegendProps) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2">
      {entries.map((entry) => {
        const plottable = entry.color !== undefined;
        return (
          <li key={entry.symbol}>
            <button
              type="button"
              disabled={!plottable}
              onClick={() => onToggle(entry.symbol)}
              aria-pressed={entry.visible}
              className={cn(
                "focus-visible:ring-ring flex items-baseline gap-2 rounded-[2px] text-[0.75rem] transition-opacity focus-visible:ring-2 focus-visible:outline-none",
                plottable ? "cursor-pointer" : "cursor-not-allowed",
                entry.visible && plottable ? "opacity-100" : "opacity-40",
              )}
            >
              <span
                aria-hidden
                className="size-2 shrink-0 translate-y-[-1px] rounded-[1px]"
                style={{ backgroundColor: entry.color ?? "var(--muted-foreground)" }}
              />
              <span className="text-text-secondary">{entry.name}</span>
              <span className="text-foreground tabular-nums">
                {plottable
                  ? entry.totalReturn !== null
                    ? formatTotalReturn(entry.totalReturn)
                    : "—"
                  : "8개 초과"}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
