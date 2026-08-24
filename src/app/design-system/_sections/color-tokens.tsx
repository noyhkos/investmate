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

      <h3 className="text-foreground mt-8 text-[0.8125rem] font-medium">종목 성격 테두리</h3>
      <p className="text-muted-foreground mt-1.5 mb-4 max-w-2xl text-[0.75rem] leading-relaxed">
        타일 테두리에만 쓰는 유일한 유채색이다. 규칙은 하나 — <b>테두리는 감싸는 그래프보다 항상 약해야
        한다.</b> 스파크라인 잉크가 라이트 4.30 / 다크 3.94이므로 테두리는 그 아래인 2.5~2.7 / 3.1~3.7에
        둔다. 두 번 틀렸다: 1px에 2:1은 선은 보여도 색을 이름 부를 수 없었고, 3.5:1은 그래프를 덮었다.
        색이 단독으로 의미를 지지 않도록 타일마다 성격을 글자로도 적는다.
      </p>
      <SwatchTable>
        <SwatchRow token="--type-stock" role="주식" light="#7ba0c4" dark="#4d6b8a" note="2.67 / 3.14" />
        <SwatchRow token="--type-etf" role="ETF" light="#6fa895" dark="#417a68" note="2.65 / 3.49" />
        <SwatchRow token="--type-crypto" role="코인" light="#c69a72" dark="#8f6746" note="2.47 / 3.48" />
        <SwatchRow token="--type-metal" role="귀금속" light="#b8a066" dark="#877044" note="2.48 / 3.68" />
        <SwatchRow token="--type-fx" role="환율" light="#9d94c6" dark="#6b6494" note="2.73 / 3.21" />
        <SwatchRow token="--type-index" role="지수" light="#a8a69d" dark="#6a6862" note="2.15 / 3.13" />
      </SwatchTable>
    </SpecSection>
  );
}
