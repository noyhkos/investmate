"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";
import { useUpColor } from "@/components/layout/settings-provider";
import { directionTextClass } from "@/lib/direction-preference";

interface SparklineProps {
  values: number[];
  /** Session change, used only to tint the last-value dot. */
  change: number;
  /** Matches the board's log toggle; linear flattens a decade into the floor. */
  log?: boolean;
  width?: number;
  height?: number;
  className?: string;
  label: string;
}

/**
 * Tile plots are inline SVG rather than a chart library instance: nine
 * lightweight-charts canvases on one screen buys interaction the tile does
 * not offer and costs real render time. Axes, grid and labels are all absent —
 * the shape is the whole message, and the numbers beside it carry the values.
 *
 * Stroke is muted ink on purpose. The plot outweighs the CAGR figure roughly
 * forty times in area, so holding it low is the only way the figure reads as
 * the primary element.
 */
export function Sparkline({
  values,
  change,
  log = false,
  width = 320,
  height = 44,
  className,
  label,
}: SparklineProps) {
  const [upColor] = useUpColor();
  const clipId = useId();

  // Holds the same height it would draw at. A shorter placeholder collapses
  // the tile by the difference and springs back when the series arrives.
  if (values.length < 2) {
    return <div className={className} style={{ height }} aria-hidden />;
  }

  // On a linear axis a twenty-year series pins every early year to the floor
  // and the shape degenerates into a spike at the right edge. Log restores the
  // proportional reading the whole tool is built on. Non-positive values (a
  // rebased or spread series) cannot be logged, so those fall back to linear.
  const loggable = log && values.every((v) => v > 0);
  const scaled = loggable ? values.map(Math.log) : values;

  const min = Math.min(...scaled);
  const max = Math.max(...scaled);
  // A flat series would divide by zero; centre it instead.
  const span = max - min || 1;
  const stepX = width / (values.length - 1);
  const pad = 3;
  const plotH = height - pad * 2;

  const points = scaled.map((v, i) => {
    const x = i * stepX;
    const y = pad + plotH - ((v - min) / span) * plotH;
    return [x, y] as const;
  });

  const d = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");
  const [lastX, lastY] = points[points.length - 1];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={cn("block w-full", className)}
      style={{ height }}
      role="img"
      aria-label={label}
    >
      {/* preserveAspectRatio="none" stretches the path; the dot must not
          stretch with it, so it is drawn in a non-scaling overlay. */}
      <clipPath id={clipId}>
        <rect x="0" y="0" width={width} height={height} />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>
        <path
          d={d}
          fill="none"
          stroke="var(--ink-plot)"
          strokeWidth={1.25}
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <circle
          cx={lastX}
          cy={lastY}
          r={2.5}
          className={directionTextClass(change, upColor)}
          fill="currentColor"
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  );
}
