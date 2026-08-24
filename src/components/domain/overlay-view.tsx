"use client";

import { useMemo, useState } from "react";
import type { Time } from "lightweight-charts";

import { LineChart, type LineSeriesInput } from "@/components/chart/line-chart";
import { useChartTheme } from "@/components/chart/use-chart-theme";
import { OverlayLegend, type LegendEntry } from "@/components/domain/overlay-legend";
import { rebaseTo100 } from "@/lib/metrics/normalize";
import { buildColorMap } from "@/lib/series-color";
import type { BoardSeries } from "@/lib/market/board";
import type { WatchedAsset } from "@/lib/watchlist-store";

interface OverlayViewProps {
  assets: WatchedAsset[];
  seriesBySymbol: Record<string, BoardSeries | undefined>;
  log: boolean;
}

/**
 * All series share one axis, rebased so the window's first close is 100.
 *
 * Plotting raw prices would put 71,200 KRW beside $258 and show nothing, and
 * the usual escape — a second y-scale — is never the answer: two scales let
 * any two lines be made to cross wherever the author likes. Rebasing keeps
 * one honest axis, and the base moves with the window.
 */
export function OverlayView({ assets, seriesBySymbol, log }: OverlayViewProps) {
  const theme = useChartTheme();
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  const colors = useMemo(
    () => buildColorMap(assets.map((a) => a.symbol), theme.mode),
    [assets, theme.mode],
  );

  const chartSeries: LineSeriesInput[] = useMemo(() => {
    return assets.flatMap((asset) => {
      const color = colors.get(asset.symbol);
      if (!color || hidden.has(asset.symbol)) return [];
      const series = seriesBySymbol[asset.symbol];
      const points = rebaseTo100(series?.dates ?? [], series?.closes ?? []);
      if (points.length === 0) return [];
      return [
        {
          key: asset.symbol,
          color,
          data: points.map((p) => ({ time: p.date as Time, value: p.value })),
        },
      ];
    });
  }, [assets, colors, hidden, seriesBySymbol]);

  const legend: LegendEntry[] = assets.map((asset) => ({
    symbol: asset.symbol,
    name: asset.name,
    color: colors.get(asset.symbol),
    totalReturn: seriesBySymbol[asset.symbol]?.summary?.totalReturn ?? null,
    visible: !hidden.has(asset.symbol),
  }));

  function toggle(symbol: string) {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(symbol)) next.delete(symbol);
      else next.add(symbol);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-card rounded-[var(--radius)] p-2">
        <LineChart series={chartSeries} log={log} percentFormat height={420} />
      </div>
      <OverlayLegend entries={legend} onToggle={toggle} />
    </div>
  );
}
