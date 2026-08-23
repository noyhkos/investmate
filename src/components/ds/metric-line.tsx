import { cn } from "@/lib/utils";

interface MetricLineProps {
  items: { label?: string; value: string }[];
  className?: string;
}

/** Secondary figures: always subordinate to the MetricFigure above them. */
export function MetricLine({ items, className }: MetricLineProps) {
  return (
    <div
      className={cn(
        "text-muted-foreground flex items-baseline gap-2 text-[0.6875rem] tabular-nums",
        className,
      )}
    >
      {items.map((item, i) => (
        <span key={i}>
          {item.label ? <span className="mr-1">{item.label}</span> : null}
          {item.value}
        </span>
      ))}
    </div>
  );
}
