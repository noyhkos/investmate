import { SpecSection } from "../_components/spec-section";
import { SwatchRow, SwatchTable } from "../_components/swatch";

export function ColorTokensSection() {
  return (
    <SpecSection
      id="color"
      title="색 토큰"
      intro="면과 글자는 완전 중성이다. 선만 웜 계열인데, 그 값이 차트 axis·gridline에서 그대로 온 것이기 때문이다. 모든 잉크 단계는 세 평면(ground·surface·popover) 전부에서 4.5:1 이상을 확인했다."
    >
      <SwatchTable>
        <SwatchRow token="--ground" role="페이지 바탕" light="#f0f0f0" dark="#0a0a0a" note="타일과 1.11 / 1.14 단차" />
        <SwatchRow token="--surface" role="타일·차트 면" light="#fcfcfb" dark="#1a1a19" note="차트 표면과 동일해야 스파크라인 캔버스가 안 보인다" />
        <SwatchRow token="--popover" role="떠 있는 층" light="#ffffff" dark="#262626" note="그림자는 여기에만" />
        <SwatchRow token="--border" role="외곽선" light="#c3c2b7" dark="#383835" note="차트 axis에서 차용" />
        <SwatchRow token="--rule" role="구분선" light="#e1e0d9" dark="#2c2c2a" note="차트 gridline에서 차용" />
        <SwatchRow token="--foreground" role="주 잉크" light="#0b0b0b" dark="#ffffff" note="CAGR 등 헤드라인 숫자" />
        <SwatchRow token="--text-secondary" role="보조 잉크" light="#484848" dark="#b2b2b2" note="8.0 / 7.1 이상" />
        <SwatchRow token="--muted-foreground" role="라벨" light="#676767" dark="#999999" note="4.96 / 5.31 이상" />
        <SwatchRow token="--ink-plot" role="스파크라인" light="#787878" dark="#787878" note="면적으로 못 이기니 대비를 눌러 숫자에 양보" />
      </SwatchTable>

      <h3 className="text-foreground mt-8 text-[0.8125rem] font-medium">종목 성격 헤어라인</h3>
      <p className="text-muted-foreground mt-1.5 mb-4 max-w-2xl text-[0.75rem] leading-relaxed">
        타일 테두리에만 쓰는 유일한 유채색이다. 채도를 낮게 눌러 그리드의 색 예산(등락 화살표)과
        스파크라인을 침범하지 않게 했다. 타일 대비 1.8~2.4:1 — 선으로는 읽히고 면으로는 안 읽히는 구간.
        색이 단독으로 의미를 지지 않도록 타일마다 성격을 글자로도 적는다.
      </p>
      <SwatchTable>
        <SwatchRow token="--type-stock" role="주식" light="#9db6d4" dark="#3f5470" note="2.03 / 2.25" />
        <SwatchRow token="--type-etf" role="ETF" light="#94c4b2" dark="#33574a" note="1.89 / 2.16" />
        <SwatchRow token="--type-crypto" role="코인" light="#dfb08e" dark="#6b4a33" note="1.90 / 2.20" />
        <SwatchRow token="--type-metal" role="귀금속" light="#d3bd85" dark="#635530" note="1.80 / 2.38" />
        <SwatchRow token="--type-fx" role="환율" light="#b4aad8" dark="#4a4270" note="2.11 / 1.91" />
        <SwatchRow token="--type-index" role="지수" light="#c3c2b7" dark="#383835" note="기본 border와 동일" />
      </SwatchTable>
    </SpecSection>
  );
}
