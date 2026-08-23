import { X } from "lucide-react";

import { SpecSection } from "../_components/spec-section";

const FORBIDDEN = [
  "이중 축(y축 2개). 두 축이 있으면 어떤 두 선도 원하는 지점에서 교차시킬 수 있다.",
  "타일 스파크라인에 시리즈 색 쓰기. 색은 오버레이에서만 일한다.",
  "순위에 따라 시리즈 색 재배정하기. 하나를 끄면 나머지가 다시 칠해진다.",
  "채도 높은 숫자를 그리드에 깔기. 색 예산 전부를 '오늘 움직임'이 가져간다.",
  "색만으로 방향 표시하기. 화살표 없는 빨강/파랑은 금지.",
  "다크모드를 라이트의 반전으로 만들기.",
  "상장 전 구간을 0이나 직전 값으로 채우기. 없던 자산에 선을 그리는 건 거짓말이다.",
  "잘린 구간을 이유 없이 보여주기. 왜 잘렸는지 항상 밝힌다.",
  "무지개 그라디언트, 네온 글로우, 배경 그라디언트.",
];

export function ForbiddenSection() {
  return (
    <SpecSection id="forbidden" title="금지" intro="이 시스템이 명시적으로 허용하지 않는 것들.">
      <ul className="flex flex-col gap-2">
        {FORBIDDEN.map((rule) => (
          <li key={rule} className="text-text-secondary flex gap-2 text-[0.75rem] leading-relaxed">
            <X className="text-rise-text mt-0.5 size-3.5 shrink-0" aria-hidden />
            {rule}
          </li>
        ))}
      </ul>
    </SpecSection>
  );
}
