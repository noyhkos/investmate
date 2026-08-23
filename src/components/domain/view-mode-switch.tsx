"use client";

import { Columns2, LayoutGrid } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ViewMode } from "@/lib/types/view";

interface ViewModeSwitchProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}

const MODES: { mode: ViewMode; label: string; Icon: typeof LayoutGrid }[] = [
  { mode: "grid", label: "그리드", Icon: LayoutGrid },
  { mode: "overlay", label: "겹쳐보기", Icon: Columns2 },
];

/** Grid is for scanning, overlay is for comparing. Two jobs, two views. */
export function ViewModeSwitch({ value, onChange }: ViewModeSwitchProps) {
  return (
    <div role="group" aria-label="보기 방식" className="flex items-center gap-0.5">
      {MODES.map(({ mode, label, Icon }) => (
        <button
          key={mode}
          type="button"
          onClick={() => onChange(mode)}
          aria-pressed={value === mode}
          aria-label={label}
          className={cn(
            "focus-visible:ring-ring cursor-pointer rounded-[2px] p-1.5 transition-colors focus-visible:ring-2 focus-visible:outline-none",
            value === mode
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Icon className="size-4" aria-hidden />
        </button>
      ))}
    </div>
  );
}
