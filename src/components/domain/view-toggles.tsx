"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { ViewOptions } from "@/lib/types/view";

interface ViewTogglesProps {
  value: ViewOptions;
  onChange: (patch: Partial<ViewOptions>) => void;
}

type ToggleKey = "log" | "dividends" | "krw" | "inflation";

const TOGGLES: { key: ToggleKey; label: string; hint: string; ready: boolean }[] = [
  { key: "log", label: "로그", hint: "선형 축은 20년 차트의 초반 구간을 뭉갭니다.", ready: true },
  { key: "dividends", label: "배당", hint: "배당 재투자 기준. 주가만 보면 배당주가 과소평가됩니다.", ready: true },
  { key: "krw", label: "원화", hint: "원화로 환산해 수익률을 다시 계산합니다.", ready: true },
  { key: "inflation", label: "물가", hint: "실질 수익률. FRED 연결이 필요합니다.", ready: false },
];

/** The four corrections that decide whether a long-horizon chart tells the truth. */
export function ViewToggles({ value, onChange }: ViewTogglesProps) {
  return (
    <div role="group" aria-label="보정" className="flex items-center gap-1">
      {TOGGLES.map(({ key, label, hint, ready }) => {
        const active = value[key];
        return (
          <Tooltip key={key}>
            <TooltipTrigger asChild>
              <button
                type="button"
                disabled={!ready}
                onClick={() => onChange({ [key]: !active } as Partial<ViewOptions>)}
                aria-pressed={active}
                className={cn(
                  "focus-visible:ring-ring rounded-[2px] px-2 py-1 text-[0.75rem] transition-colors focus-visible:ring-2 focus-visible:outline-none",
                  ready ? "cursor-pointer" : "cursor-not-allowed opacity-40",
                  active
                    ? "bg-foreground text-background font-medium"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </button>
            </TooltipTrigger>
            <TooltipContent>{hint}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
