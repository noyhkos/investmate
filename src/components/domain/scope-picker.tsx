"use client";

import { cn } from "@/lib/utils";
import { SCOPES, type Scope } from "@/lib/types/view";

interface ScopePickerProps {
  value: Scope;
  onChange: (scope: Scope) => void;
}

/**
 * The single most consequential control in the app, so it is always visible
 * as a full row rather than folded into a dropdown. Active state is ink and
 * an underline — the system has no accent hue, because the fixed series
 * palette and the direction colours already spend the wheel.
 */
export function ScopePicker({ value, onChange }: ScopePickerProps) {
  return (
    <div role="group" aria-label="기간" className="flex items-center gap-0.5">
      {SCOPES.map((scope) => {
        const active = scope === value;
        return (
          <button
            key={scope}
            type="button"
            onClick={() => onChange(scope)}
            aria-pressed={active}
            className={cn(
              "focus-visible:ring-ring cursor-pointer rounded-[2px] px-2 py-1.5 text-[0.75rem] tabular-nums transition-colors focus-visible:ring-2 focus-visible:outline-none",
              active
                ? "text-foreground border-foreground border-b-2 font-medium"
                : "text-muted-foreground hover:text-foreground border-b-2 border-transparent",
            )}
          >
            {scope}
          </button>
        );
      })}
    </div>
  );
}
