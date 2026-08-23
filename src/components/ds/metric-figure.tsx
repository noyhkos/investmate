import { cn } from "@/lib/utils";

interface MetricFigureProps {
  value: string;
  label: string;
  className?: string;
}

/**
 * The headline figure on a tile, and deliberately the highest-contrast thing
 * on it. It cannot win on area — a sparkline outweighs it some forty times —
 * so it wins on contrast: full ink against a plot drawn in muted ink.
 */
export function MetricFigure({ value, label, className }: MetricFigureProps) {
  return (
    <div className={cn("flex items-baseline gap-1.5", className)}>
      <span className="text-muted-foreground text-[0.6875rem]">{label}</span>
      <span className="text-foreground text-[1.75rem] leading-none font-medium tracking-tight tabular-nums">
        {value}
      </span>
    </div>
  );
}
