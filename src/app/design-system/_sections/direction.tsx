"use client";

import { DeltaValue } from "@/components/ds";
import { useUpColor } from "@/lib/direction-preference";
import { cn } from "@/lib/utils";

import { SpecSection } from "../_components/spec-section";

const SAMPLES = [0.0387, -0.0063, 0.0212, -0.0035];

export function DirectionSection() {
  const [upColor, setUpColor] = useUpColor();

  return (
    <SpecSection
      id="direction"
      title="상승과 하락"
      intro="한국은 상승이 빨강, 미국은 상승이 초록이다. 정반대라 국내 종목을 보다 미국 종목으로 넘어가면 순간적으로 오독한다. 그래서 관례는 상수가 아니라 설정이다. 그리고 색을 입히는 건 숫자가 아니라 화살표뿐이다 — 타일 아홉 개면 채도 높은 표식이 열여덟 개가 되고, 시선은 매번 거기부터 간다."
    >
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-1">
          {(["red", "green"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setUpColor(option)}
              aria-pressed={upColor === option}
              className={cn(
                "focus-visible:ring-ring cursor-pointer rounded-[2px] px-2 py-1 text-[0.75rem] transition-colors focus-visible:ring-2 focus-visible:outline-none",
                upColor === option
                  ? "bg-foreground text-background font-medium"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {option === "red" ? "상승 = 빨강 (한국)" : "상승 = 초록 (미국)"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          {SAMPLES.map((change) => (
            <DeltaValue key={change} change={change} className="text-[0.8125rem]" />
          ))}
        </div>
      </div>
    </SpecSection>
  );
}
