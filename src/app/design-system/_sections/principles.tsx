import { SpecSection } from "../_components/spec-section";

const PRINCIPLES = [
  "숫자가 화면에서 가장 강한 요소다. 다른 무엇도 숫자보다 먼저 눈에 들어오면 안 된다.",
  "UI 선은 차트 크롬에서 값을 그대로 빌린다. 같은 값이면 경쟁할 수 없다.",
  "액센트 컬러는 없다. 색은 전부 데이터가 쓴다.",
  "색은 단독으로 의미를 전달하지 않는다. 방향은 언제나 화살표를 동반한다.",
  "라이트와 다크는 서로의 반전이 아니라 각각 선택된 값이다.",
  "밀도는 읽기를 위한 것이다. 여백은 그룹 사이에만 쓴다.",
];

export function PrinciplesSection() {
  return (
    <SpecSection
      id="principles"
      title="원칙"
      intro="이후의 모든 판단은 이 여섯 줄로 결정한다. 새 화면에서 다툼이 생기면 여기로 돌아온다."
    >
      <ol className="flex flex-col gap-2">
        {PRINCIPLES.map((rule, i) => (
          <li key={i} className="flex gap-3 text-[0.8125rem] leading-relaxed">
            <span className="text-muted-foreground shrink-0 tabular-nums">{i + 1}</span>
            <span className="text-text-secondary">{rule}</span>
          </li>
        ))}
      </ol>
    </SpecSection>
  );
}
