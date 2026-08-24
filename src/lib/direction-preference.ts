import type { UpColor } from "@/lib/chart-theme";

/** Tailwind text colour for a direction, given the user's convention. */
export function directionTextClass(change: number, upColor: UpColor): string {
  const rising = change >= 0;
  if (upColor === "red") return rising ? "text-rise-text" : "text-fall-text";
  return rising ? "text-gain-text" : "text-rise-text";
}
