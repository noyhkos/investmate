/** Holds the detail page's shape — back link, heading, price, chart. */
export default function Loading() {
  return (
    <div className="flex flex-col gap-5 px-4 pt-5 pb-28 md:px-6">
      <Bar className="h-3 w-20" />
      <div className="flex flex-col gap-2">
        <Bar className="h-5 w-40" />
        <Bar className="h-6 w-56" />
      </div>
      <div className="bg-card rounded-[var(--radius)] p-2">
        <Bar className="h-[380px] w-full" />
      </div>
    </div>
  );
}

function Bar({ className }: { className?: string }) {
  return <div className={`bg-muted-foreground/15 animate-pulse rounded-[2px] ${className}`} />;
}
