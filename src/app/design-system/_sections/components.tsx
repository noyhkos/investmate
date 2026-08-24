"use client";

import { useState } from "react";

import { Sparkline } from "@/components/chart/sparkline";
import { AssetTile } from "@/components/domain/asset-tile";
import { ScopePicker } from "@/components/domain/scope-picker";
import { ViewModeSwitch } from "@/components/domain/view-mode-switch";
import { ViewToggles } from "@/components/domain/view-toggles";
import { WindowNotice } from "@/components/domain/window-notice";
import { MetricFigure, MetricLine } from "@/components/ds";
import { ASSET_TYPE_LABEL } from "@/lib/asset-type";
import type { AssetType } from "@/lib/types/asset";
import { DEFAULT_VIEW_OPTIONS, type ViewOptions } from "@/lib/types/view";

import { SpecSection } from "../_components/spec-section";

// A gently compounding series, so the log-scale demo shows a real shape.
const DEMO = Array.from({ length: 120 }, (_, i) => 100 * Math.exp(i / 55) * (1 + Math.sin(i / 7) * 0.05));

const TILE_TYPES: AssetType[] = ["stock", "etf", "crypto", "metal", "fx", "index"];

const DEMO_SUMMARY = {
  from: "2005-03-14",
  to: "2026-08-24",
  startPrice: 100,
  endPrice: 703.71,
  totalReturn: 6.0371,
  cagr: 0.155,
  dayChange: 0.0387,
};

export function ComponentsSection() {
  const [options, setOptions] = useState<ViewOptions>(DEFAULT_VIEW_OPTIONS);

  return (
    <SpecSection
      id="components"
      title="컴포넌트"
      intro="규칙은 프리미티브 안에 들어 있다. DeltaValue는 화살표만 칠하고, MetricFigure는 항상 타일에서 가장 강한 요소이며, Sparkline은 축을 그리지 않는다. 조합하는 쪽에서 규칙을 어길 방법이 없다."
    >
      <div className="flex flex-col gap-8">
        <Demo label="ScopePicker · ViewToggles · ViewModeSwitch">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <ScopePicker value={options.scope} onChange={(scope) => setOptions({ ...options, scope })} />
            <ViewToggles value={options} onChange={(patch) => setOptions({ ...options, ...patch })} />
            <ViewModeSwitch value={options.mode} onChange={(mode) => setOptions({ ...options, mode })} />
          </div>
        </Demo>

        <Demo label="MetricFigure · MetricLine">
          <MetricFigure label="연" value="15.5%" />
          <MetricLine className="mt-1.5" items={[{ value: "2000~" }, { value: "+4507%" }]} />
        </Demo>

        <Demo label="Sparkline — 같은 데이터, 로그 켜고 끔">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-muted-foreground mb-1 text-[0.6875rem]">로그 (기본)</p>
              <Sparkline values={DEMO} change={0.0387} log label="로그 스케일 예시" />
            </div>
            <div>
              <p className="text-muted-foreground mb-1 text-[0.6875rem]">선형 — 초반 구간이 뭉갠다</p>
              <Sparkline values={DEMO} change={0.0387} log={false} label="선형 스케일 예시" />
            </div>
          </div>
        </Demo>

        <Demo label="WindowNotice">
          <WindowNotice from="2014-09-17" to="2026-08-23" limitedBy="비트코인" />
        </Demo>

        <Demo label="AssetTile — 테두리는 종목 성격, 색만으로 의미를 지지 않도록 라벨을 함께 단다">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TILE_TYPES.map((type) => (
              <AssetTile
                key={type}
                symbol="VOO"
                name={ASSET_TYPE_LABEL[type]}
                type={type}
                currency="USD"
                closes={DEMO}
                summary={DEMO_SUMMARY}
                interactive={false}
                log={options.log}
              />
            ))}
          </div>
        </Demo>
      </div>
    </SpecSection>
  );
}

function Demo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-muted-foreground mb-3 text-[0.6875rem]">{label}</p>
      {children}
    </div>
  );
}
