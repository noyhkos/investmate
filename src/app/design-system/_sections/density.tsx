import { SpecSection } from "../_components/spec-section";

const RULES = [
  ["radius", "5px (--radius). 떠 있는 층은 8px. 매크로 스트립은 0 — 전폭 밴드라 카드로 읽히면 안 된다."],
  ["선 굵기", "1px 고정. 2px는 포커스 링과 활성 스코프 밑줄뿐. 0.5px 없음 — 배율에 따라 사라지거나 번진다."],
  ["타일", "채움 있음, 테두리 없음. 채움이 차트 표면과 같은 값이라 스파크라인이 가장자리까지 흐른다."],
  ["타일 패딩", "14px 좌우 / 12px 상단 / 0 하단. 하단이 0인 건 스파크라인이 전폭으로 붙기 때문."],
  ["그리드 간격", "12px. 열은 3 / 2 / 1 (≥1024 / ≥640 / 그 이하)."],
  ["그룹 간격", "32px. 그룹 구분은 여백으로만 하고 선을 긋지 않는다."],
  ["그림자", "떠 있는 층에만. 타일은 평면 단차가 1.11이라 그림자가 보이지 않는다."],
];

export function DensitySection() {
  return (
    <SpecSection
      id="density"
      title="밀도와 형태"
      intro="그리드 뷰에서 화면에 그어지는 선은 스파크라인뿐이다. 타일 테두리도, 열 구분선도 없다."
    >
      <dl className="flex flex-col gap-3">
        {RULES.map(([term, detail]) => (
          <div key={term} className="grid gap-1 sm:grid-cols-[8rem_1fr] sm:gap-4">
            <dt className="text-foreground text-[0.75rem] font-medium">{term}</dt>
            <dd className="text-text-secondary text-[0.75rem] leading-relaxed">{detail}</dd>
          </div>
        ))}
      </dl>
    </SpecSection>
  );
}
