"use client";

import { cn } from "@/lib/utils";
import { useUpColor } from "@/components/layout/settings-provider";
import { directionTextClass } from "@/lib/direction-preference";
import { formatPercent } from "@/lib/format";

interface DeltaValueProps {
  /** Session change as a ratio. 0.0142 renders as 1.42%. */
  change: number;
  className?: string;
}

/**
 * Only the arrow carries the direction colour; the numeral stays ink.
 *
 * Saturation is pre-attentive and size is not, so a grid of nine tiles with
 * fully coloured deltas puts eighteen saturated marks against nine dark
 * figures — the eye lands on today's move every time, in a tool whose window
 * is measured in years. Tinting the glyph alone keeps the signal and cuts the
 * saturated area by roughly five times. The arrow is also why colour is never
 * the sole carrier of meaning here.
 */
export function DeltaValue({ change, className }: DeltaValueProps) {
  const [upColor] = useUpColor();
  const rising = change >= 0;

  return (
    <span className={cn("text-text-secondary tabular-nums", className)}>
      <span className={directionTextClass(change, upColor)} aria-hidden>
        {rising ? "▲" : "▼"}
      </span>
      <span className="sr-only">{rising ? "상승" : "하락"} </span>
      {formatPercent(change)}
    </span>
  );
}
