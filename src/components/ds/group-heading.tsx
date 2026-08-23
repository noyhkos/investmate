import { cn } from "@/lib/utils";

interface GroupHeadingProps {
  children: React.ReactNode;
  count?: number;
  action?: React.ReactNode;
  className?: string;
}

/** Group labels are user-authored, so they are never uppercased. */
export function GroupHeading({ children, count, action, className }: GroupHeadingProps) {
  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <h2 className="text-text-secondary text-[0.8125rem] font-medium">{children}</h2>
      {count !== undefined ? (
        <span className="text-muted-foreground text-[0.6875rem] tabular-nums">{count}</span>
      ) : null}
      {action ? <div className="ml-auto">{action}</div> : null}
    </div>
  );
}
