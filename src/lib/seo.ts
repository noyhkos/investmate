/**
 * Canonical site metadata. The marketing routes are the only indexable
 * surface — everything under /dashboard is private and noindex.
 */
export const SITE = {
  name: "investmate",
  title: "investmate — 원화 기준으로 보는 장기 시세 대시보드",
  description:
    "주식·금·은·환율을 한 화면에서 장기 관점으로 봅니다. 배당 재투자, 원화 환산, 인플레이션 조정을 켜고 끄며 20년치 실질 수익률을 확인하세요.",
  locale: "ko_KR",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

export function absoluteUrl(path: string): string {
  return new URL(path, SITE.url).toString();
}
