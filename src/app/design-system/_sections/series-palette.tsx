import { SERIES_DARK, SERIES_LIGHT } from "@/lib/chart-theme";

import { SpecSection } from "../_components/spec-section";

export function SeriesPaletteSection() {
  return (
    <SpecSection
      id="series"
      title="시리즈 팔레트"
      intro="오버레이 전용이다. 그리드 타일의 스파크라인은 전부 같은 잉크로 그린다 — 타일은 공간으로 이미 분리돼 있어 색이 정보를 싣지 않는다. 슬롯 순서는 색각이상 인접 대비로 검증된 배열이라 임의로 바꾸지 않는다. 색은 종목에 고정되며 순위를 따르지 않는다."
    >
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
        {SERIES_LIGHT.map((hex, i) => (
          <div key={hex} className="flex items-center gap-2">
            <span className="text-muted-foreground w-3 text-[0.6875rem] tabular-nums">{i + 1}</span>
            <span className="flex">
              <span className="size-5 rounded-l-[2px]" style={{ backgroundColor: hex }} aria-hidden />
              <span className="size-5 rounded-r-[2px]" style={{ backgroundColor: SERIES_DARK[i] }} aria-hidden />
            </span>
            <code className="text-text-secondary text-[0.6875rem]">{hex}</code>
          </div>
        ))}
      </div>
      <p className="text-muted-foreground mt-4 text-[0.75rem]">
        8개를 넘으면 아홉 번째 색을 만들지 않는다. 표시하지 않고 그 사실을 알린다.
      </p>
    </SpecSection>
  );
}
