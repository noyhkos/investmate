import { Info } from "lucide-react";

interface WindowNoticeProps {
  from: string;
  to: string;
  limitedBy: string | null;
}

/**
 * MAX means the widest window every selected asset covers, so the chart is
 * often shorter than the oldest asset's history. Saying why is not optional:
 * an unexplained truncated chart reads as a bug, not as a decision.
 */
export function WindowNotice({ from, to, limitedBy }: WindowNoticeProps) {
  return (
    <p className="text-muted-foreground flex items-center gap-1.5 text-[0.6875rem]">
      <Info className="size-3 shrink-0" aria-hidden />
      <span className="tabular-nums">
        {from} ~ {to}
      </span>
      {limitedBy ? <span>· {limitedBy} 상장일 기준으로 맞춤</span> : null}
    </p>
  );
}
