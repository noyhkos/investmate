import { TriangleAlert } from "lucide-react";

/** One shared failure surface, so a dead provider never renders as empty data. */
export function BoardError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="text-muted-foreground flex flex-col items-center gap-3 py-16 text-[0.8125rem]">
      <TriangleAlert className="size-5" aria-hidden />
      <p>{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="text-foreground focus-visible:ring-ring cursor-pointer underline underline-offset-4 focus-visible:ring-2 focus-visible:outline-none"
      >
        다시 시도
      </button>
    </div>
  );
}
