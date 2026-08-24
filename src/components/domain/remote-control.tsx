"use client";

import { Check, Pencil } from "lucide-react";

import { ScopePicker } from "@/components/domain/scope-picker";
import { ViewModeSwitch } from "@/components/domain/view-mode-switch";
import { ViewToggles } from "@/components/domain/view-toggles";
import { cn } from "@/lib/utils";
import type { ViewOptions } from "@/lib/types/view";

interface RemoteControlProps {
  options: ViewOptions;
  onChange: (patch: Partial<ViewOptions>) => void;
  /** Grid-only controls; omitted on the detail page. */
  editing?: boolean;
  onEditingChange?: (editing: boolean) => void;
  showViewMode?: boolean;
}

/**
 * The controls float over the board rather than sitting in a header band.
 *
 * Scope and the four corrections are things the reader operates while
 * looking at the plots, so they belong within reach of the eye that is
 * already on the data — not at the top of a page they have scrolled past.
 * This is a floating layer, which is the only place the system allows a
 * shadow.
 */
export function RemoteControl({
  options,
  onChange,
  editing,
  onEditingChange,
  showViewMode = true,
}: RemoteControlProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-3 pb-3">
      <div className="bg-popover border-border pointer-events-auto flex max-w-full flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-[0.5rem] border px-3 py-2 shadow-lg">
        <ScopePicker value={options.scope} onChange={(scope) => onChange({ scope })} />

        <span className="bg-rule hidden h-5 w-px sm:block" aria-hidden />

        <ViewToggles value={options} onChange={onChange} />

        {showViewMode || onEditingChange ? (
          <>
            <span className="bg-rule hidden h-5 w-px sm:block" aria-hidden />
            <div className="flex items-center gap-1.5">
              {showViewMode ? (
                <ViewModeSwitch value={options.mode} onChange={(mode) => onChange({ mode })} />
              ) : null}
              {onEditingChange ? (
                <button
                  type="button"
                  onClick={() => onEditingChange(!editing)}
                  aria-pressed={editing}
                  aria-label={editing ? "편집 완료" : "편집"}
                  className={cn(
                    "focus-visible:ring-ring cursor-pointer rounded-[2px] p-1.5 transition-colors focus-visible:ring-2 focus-visible:outline-none",
                    editing
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {editing ? (
                    <Check className="size-4" aria-hidden />
                  ) : (
                    <Pencil className="size-4" aria-hidden />
                  )}
                </button>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
