"use client";

import { useEffect, useRef } from "react";
import {
  ColorType,
  LineSeries,
  PriceScaleMode,
  createChart,
  type IChartApi,
  type ISeriesApi,
  type LineData,
  type Time,
} from "lightweight-charts";

import { useChartTheme } from "@/components/chart/use-chart-theme";

export interface LineSeriesInput {
  key: string;
  color: string;
  data: LineData<Time>[];
}

interface LineChartProps {
  series: LineSeriesInput[];
  log: boolean;
  height?: number;
  /** Percent scale for rebased overlays; plain prices on a detail chart. */
  percentFormat?: boolean;
  /** Formats the price-axis labels. Defaults to the library's own. */
  priceFormatter?: (value: number) => string;
}

/**
 * lightweight-charts wrapper. Colours arrive as props rather than being read
 * from CSS because the library takes them as JS options and never resolves
 * custom properties — a theme flip has to be pushed in imperatively.
 */
export function LineChart({
  series,
  log,
  height = 380,
  percentFormat,
  priceFormatter,
}: LineChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef(new Map<string, ISeriesApi<"Line">>());
  const theme = useChartTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chart = createChart(container, {
      height,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: theme.chrome.label,
        attributionLogo: false,
      },
      grid: {
        horzLines: { color: theme.chrome.grid },
        vertLines: { visible: false },
      },
      rightPriceScale: {
        borderColor: theme.chrome.axis,
        // The scale canvas clips its own overflow, so a label centred on the
        // top edge loses its upper half. Reserving margin keeps the highest
        // gridline — and its label — inside the canvas.
        scaleMargins: { top: 0.12, bottom: 0.08 },
      },
      timeScale: { borderColor: theme.chrome.axis, fixLeftEdge: true, fixRightEdge: true },
      crosshair: {
        vertLine: { color: theme.chrome.axis, labelBackgroundColor: theme.chrome.axis },
        horzLine: { color: theme.chrome.axis, labelBackgroundColor: theme.chrome.axis },
      },
      handleScale: { axisPressedMouseMove: false },
    });

    chartRef.current = chart;
    const live = seriesRef.current;
    const observer = new ResizeObserver(([entry]) =>
      chart.applyOptions({ width: entry.contentRect.width }),
    );
    observer.observe(container);

    return () => {
      observer.disconnect();
      chart.remove();
      chartRef.current = null;
      live.clear();
    };
  }, [height, theme.chrome]);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    chart.priceScale("right").applyOptions({
      mode: log ? PriceScaleMode.Logarithmic : PriceScaleMode.Normal,
    });

    const live = seriesRef.current;
    const wanted = new Set(series.map((s) => s.key));
    for (const [key, api] of live) {
      if (!wanted.has(key)) {
        chart.removeSeries(api);
        live.delete(key);
      }
    }

    for (const input of series) {
      let api = live.get(input.key);
      if (!api) {
        api = chart.addSeries(LineSeries, {
          lineWidth: 2,
          priceLineVisible: false,
          lastValueVisible: false,
          priceFormat: percentFormat
            ? { type: "custom", formatter: (v: number) => v.toFixed(0) }
            : priceFormatter
              ? { type: "custom", formatter: priceFormatter }
              : undefined,
        });
        live.set(input.key, api);
      }
      api.applyOptions({ color: input.color });
      api.setData(input.data);
    }

    chart.timeScale().fitContent();
  }, [series, log, percentFormat, priceFormatter]);

  return <div ref={containerRef} className="w-full" />;
}
