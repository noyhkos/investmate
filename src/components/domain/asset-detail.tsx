"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Time } from "lightweight-charts";

import { LineChart } from "@/components/chart/line-chart";
import { useChartTheme } from "@/components/chart/use-chart-theme";
import { RemoteControl } from "@/components/domain/remote-control";
import { AssetDetailSkeleton } from "@/components/domain/asset-detail-skeleton";
import { BoardError } from "@/components/domain/board-error";
import { DeltaValue, MetricLine } from "@/components/ds";
import { formatAxisPrice, formatCagr, formatPrice, formatTotalReturn } from "@/lib/format";
import { guessCurrency } from "@/lib/market/currency";
import { guessType } from "@/lib/market/symbols";
import { useBoard } from "@/lib/use-board";
import { useViewOptions } from "@/lib/use-view-options";
import { useWatchlist } from "@/lib/watchlist-store";
import type { UserSettings } from "@/lib/types/settings";
import type { WatchedAsset } from "@/lib/watchlist-types";

/**
 * One asset, full width. Same controls as the board so a reading carries over
 * from the grid rather than resetting.
 */
interface AssetDetailProps {
  symbol: string;
  userId: string | null;
  watchlist: WatchedAsset[];
  settings: UserSettings;
}

export function AssetDetail({ symbol, userId, watchlist, settings }: AssetDetailProps) {
  const [options, setOptions] = useViewOptions(settings, userId !== null);
  const { items } = useWatchlist(userId, watchlist);
  const theme = useChartTheme();

  const asset = useMemo(
    () =>
      items.find((i) => i.symbol === symbol) ?? {
        symbol,
        name: symbol,
        type: guessType(symbol),
        currency: guessCurrency(symbol),
      },
    [items, symbol],
  );

  const { board, loading, error, reload } = useBoard([asset], options);
  const series = board?.series[0];

  // A KRW price has no meaningful decimals; the library's default renders
  // 415,000 as "415000.00" and eats axis width doing it.
  const priceFormatter = useMemo(
    () => (value: number) => formatAxisPrice(value, series?.currency ?? "USD"),
    [series?.currency],
  );

  const chartSeries = useMemo(() => {
    if (!series) return [];
    return [
      {
        key: series.symbol,
        color: theme.series[0],
        data: series.closes.map((close, i) => ({ time: series.dates[i] as Time, value: close })),
      },
    ];
  }, [series, theme.series]);

  // Same shape the route skeleton was showing a moment ago, so the handoff
  // from the server wait to the client fetch does not flash.
  if (!error && loading && !series) return <AssetDetailSkeleton />;

  return (
    <div className="flex flex-col gap-5 px-4 pt-5 pb-28 md:px-6">
      <Link
        href="/dashboard"
        className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-1.5 text-[0.75rem]"
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        대시보드
      </Link>

      <div>
        <h1 className="text-foreground text-[1.125rem] font-medium">{asset.name}</h1>
        <div className="mt-1 flex items-baseline gap-3">
          <span className="text-foreground text-[1.25rem] tabular-nums">
            {series?.summary ? formatPrice(series.summary.endPrice, series.currency, asset.type) : "—"}
          </span>
          {series?.summary ? <DeltaValue change={series.summary.dayChange} /> : null}
        </div>
      </div>

      <div className="bg-card rounded-[var(--radius)] p-2">
        {error ? (
          <BoardError message={error} onRetry={reload} />
        ) : (
          <LineChart
            series={chartSeries}
            log={options.log}
            height={380}
            priceFormatter={priceFormatter}
          />
        )}
      </div>

      {series?.summary ? (
        <MetricLine
          className="text-[0.75rem]"
          items={[
            { value: `${series.summary.from} ~ ${series.summary.to}` },
            { label: "총", value: formatTotalReturn(series.summary.totalReturn) },
            { label: "연평균", value: formatCagr(series.summary.cagr) },
          ]}
        />
      ) : null}

      <RemoteControl options={options} onChange={setOptions} showViewMode={false} />
    </div>
  );
}
