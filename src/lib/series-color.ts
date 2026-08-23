import { MAX_OVERLAY_SERIES, SERIES_DARK, SERIES_LIGHT } from "@/lib/chart-theme";

/**
 * Colour binds to the asset, never to its rank.
 *
 * If hue followed position, hiding one series would repaint the survivors and
 * the reader would have to relearn the chart on every filter change. Slots are
 * assigned from the watchlist's own order and stay put.
 */
export function buildColorMap(symbols: string[], mode: "light" | "dark"): Map<string, string> {
  const palette = mode === "dark" ? SERIES_DARK : SERIES_LIGHT;
  const map = new Map<string, string>();
  symbols.forEach((symbol, i) => {
    // Past the palette there is no ninth hue to generate; those series are
    // not drawn, and the UI says so rather than inventing a colour.
    if (i < MAX_OVERLAY_SERIES) map.set(symbol, palette[i]);
  });
  return map;
}
