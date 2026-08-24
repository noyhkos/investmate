"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useUpColor } from "@/components/layout/settings-provider";
import type { UpColor } from "@/lib/chart-theme";

const OPTIONS: { value: UpColor; label: string; hint: string; className: string }[] = [
  {
    value: "red",
    label: "상승 빨강",
    hint: "한국 관례 — 상승 빨강, 하락 파랑",
    className: "text-rise-text",
  },
  {
    value: "green",
    label: "상승 초록",
    hint: "미국 관례 — 상승 초록, 하락 빨강",
    className: "text-gain-text",
  },
];

/**
 * Korea paints a rising price red and the US paints it green, so someone
 * reading both markets has to be able to say which habit is theirs. It sits
 * beside the theme toggle because both answer "how do I want to see this",
 * not "what am I looking at".
 */
export function UpColorToggle() {
  const [upColor, setUpColor] = useUpColor();

  return (
    <ToggleGroup
      type="single"
      size="sm"
      value={upColor}
      onValueChange={(next) => next && setUpColor(next as UpColor)}
      aria-label="상승·하락 색"
    >
      {OPTIONS.map(({ value, label, hint, className }) => (
        <Tooltip key={value}>
          <TooltipTrigger asChild>
            <ToggleGroupItem value={value} aria-label={label} className="cursor-pointer">
              <span className={className} aria-hidden>
                ▲
              </span>
            </ToggleGroupItem>
          </TooltipTrigger>
          <TooltipContent>{hint}</TooltipContent>
        </Tooltip>
      ))}
    </ToggleGroup>
  );
}
