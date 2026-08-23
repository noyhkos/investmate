import { cn } from "@/lib/utils";

interface PlaneProps extends React.ComponentProps<"div"> {
  /** Raised planes are floating layers only (popover, dialog). */
  raised?: boolean;
}

/**
 * A surface. `surface` is exactly the fixed chart surface, which is what lets
 * an inline plot bleed to the element's edge with no visible canvas seam —
 * the separation from the page comes from the ground stepping away, not from
 * a border.
 */
export function Plane({ raised, className, ...props }: PlaneProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius)]",
        raised ? "bg-popover border-border border shadow-lg" : "bg-card",
        className,
      )}
      {...props}
    />
  );
}
