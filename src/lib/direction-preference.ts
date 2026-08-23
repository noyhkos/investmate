"use client";

import type { UpColor } from "@/lib/chart-theme";
import { useStoredState } from "@/lib/use-stored-state";

const STORAGE_KEY = "investmate:up-color:v1";

/**
 * Korea paints a rising price red; the US paints it green. Reading a KR
 * screen with US habits inverts the meaning, so the convention is a setting
 * rather than a constant. Default follows the Korean market.
 */
export function useUpColor(): [UpColor, (next: UpColor) => void] {
  return useStoredState<UpColor>(STORAGE_KEY, "red");
}

/** Tailwind text colour for a direction, given the user's convention. */
export function directionTextClass(change: number, upColor: UpColor): string {
  const rising = change >= 0;
  if (upColor === "red") return rising ? "text-rise-text" : "text-fall-text";
  return rising ? "text-gain-text" : "text-rise-text";
}
