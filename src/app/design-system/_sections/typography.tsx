import { SpecSection } from "../_components/spec-section";

const SCALE = [
  { role: "타일 헤드라인 (CAGR)", size: "1.75rem / 28px", weight: "500", tabular: true, sample: "15.5%" },
  { role: "상세 현재가", size: "1.25rem / 20px", weight: "400", tabular: true, sample: "281,500원" },
  { role: "타일 현재가", size: "0.9375rem / 15px", weight: "400", tabular: true, sample: "703.71" },
  { role: "종목명 · 그룹", size: "0.8125rem / 13px", weight: "500", tabular: false, sample: "삼성전자" },
  { role: "본문", size: "0.8125rem / 13px", weight: "400", tabular: false, sample: "원화 기준으로 봅니다" },
  { role: "라벨 · 부가 숫자", size: "0.6875rem / 11px", weight: "400", tabular: true, sample: "2000~ +4507%" },
];

export function TypographySection() {
  return (
    <SpecSection
      id="type"
      title="타이포"
      intro="Geist Sans에 한글이 없어 Pretendard를 스택에 넣는다. 없으면 맥은 Apple SD Gothic Neo, 윈도우는 맑은 고딕으로 떨어져 OS마다 다르게 렌더된다. 세로로 정렬되는 숫자는 전부 tabular-nums."
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] text-left">
          <thead>
            <tr className="text-muted-foreground border-rule border-b text-[0.6875rem]">
              <th className="pb-2 font-normal">역할</th>
              <th className="pb-2 font-normal">크기</th>
              <th className="pb-2 font-normal">굵기</th>
              <th className="pb-2 font-normal">tabular</th>
              <th className="pb-2 font-normal">예</th>
            </tr>
          </thead>
          <tbody>
            {SCALE.map((row) => (
              <tr key={row.role} className="border-rule border-b last:border-b-0">
                <td className="text-text-secondary py-2.5 pr-3 text-[0.75rem]">{row.role}</td>
                <td className="text-muted-foreground py-2.5 pr-3 text-[0.6875rem] tabular-nums">{row.size}</td>
                <td className="text-muted-foreground py-2.5 pr-3 text-[0.6875rem] tabular-nums">{row.weight}</td>
                <td className="text-muted-foreground py-2.5 pr-3 text-[0.6875rem]">{row.tabular ? "○" : "—"}</td>
                <td
                  className="text-foreground py-2.5"
                  style={{
                    fontSize: row.size.split(" / ")[0],
                    fontWeight: Number(row.weight),
                    fontVariantNumeric: row.tabular ? "tabular-nums" : undefined,
                  }}
                >
                  {row.sample}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SpecSection>
  );
}
