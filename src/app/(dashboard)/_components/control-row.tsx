"use client";

import { Check, Pencil } from "lucide-react";

import { ScopePicker } from "@/components/domain/scope-picker";
import { ViewModeSwitch } from "@/components/domain/view-mode-switch";
import { ViewToggles } from "@/components/domain/view-toggles";
import { cn } from "@/lib/utils";
import type { ViewOptions } from "@/lib/types/view";

interface ControlRowProps {
  options: ViewOptions;
  onChange: (patch: Partial<ViewOptions>) => void;
  editing: boolean;
  onEditingChange: (editing: boolean) => void;
}

/**
 * Scope and the corrections apply to every tile at once. Per-tile controls
 * would let two tiles show different windows, and then nothing on the grid
 * is comparable to anything else.
 */
export function ControlRow({ options, onChange, editing, onEditingChange }: ControlRowProps) {
  return (
    <div className="border-rule flex flex-wrap items-center gap-x-6 gap-y-3 border-b px-4 py-2.5 md:px-6">
      <ScopePicker value={options.scope} onChange={(scope) => onChange({ scope })} />
      <ViewToggles value={options} onChange={onChange} />

      <div className="ml-auto flex items-center gap-2">
        <ViewModeSwitch value={options.mode} onChange={(mode) => onChange({ mode })} />
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
          {editing ? <Check className="size-4" aria-hidden /> : <Pencil className="size-4" aria-hidden />}
        </button>
      </div>
    </div>
  );
}
