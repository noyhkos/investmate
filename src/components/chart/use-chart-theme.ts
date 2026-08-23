"use client";

import { useTheme } from "next-themes";

import { CHART_CHROME, SERIES_DARK, SERIES_LIGHT } from "@/lib/chart-theme";
import { useHydrated } from "@/lib/use-hydrated";

export interface ChartTheme {
  mode: "light" | "dark";
  chrome: Record<keyof (typeof CHART_CHROME)["light"], string>;
  series: readonly string[];
}

/**
 * lightweight-charts takes colours as JS options and never reads CSS custom
 * properties, so a theme flip has to be pushed into the chart imperatively.
 * Consumers apply the returned tokens in an effect keyed on `mode`.
 */
export function useChartTheme(): ChartTheme {
  const { resolvedTheme } = useTheme();
  const hydrated = useHydrated();

  // Before hydration the resolved theme is unknown; light avoids a dark
  // flash on the server-rendered markup.
  const mode = hydrated && resolvedTheme === "dark" ? "dark" : "light";

  return {
    mode,
    chrome: CHART_CHROME[mode],
    series: mode === "dark" ? SERIES_DARK : SERIES_LIGHT,
  };
}
