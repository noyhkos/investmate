"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useHydrated } from "@/lib/use-hydrated";

const OPTIONS = [
  { value: "light", label: "라이트", Icon: Sun },
  { value: "dark", label: "다크", Icon: Moon },
  { value: "system", label: "시스템", Icon: Monitor },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // The resolved theme is unknown on the server; rendering the real state
  // before hydration would flag the wrong option for a frame.
  const hydrated = useHydrated();

  return (
    <ToggleGroup
      type="single"
      size="sm"
      value={hydrated ? theme : undefined}
      onValueChange={(next) => next && setTheme(next)}
      aria-label="테마"
    >
      {OPTIONS.map(({ value, label, Icon }) => (
        <ToggleGroupItem key={value} value={value} aria-label={label} className="cursor-pointer">
          <Icon className="size-4" aria-hidden />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
