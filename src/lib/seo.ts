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
  url: resolveSiteUrl(),
} as const;

export function absoluteUrl(path: string): string {
  return new URL(path, SITE.url).toString();
}

/**
 * The origin this deployment answers on.
 *
 * An unset variable and one set to "" have to be treated the same — `??`
 * only falls back on null, so an empty value from a dashboard field reached
 * `new URL("")` and failed the build rather than falling back.
 *
 * Preview deployments get a different host every time, so there is nothing
 * to type into a settings field for them; Vercel's own variables fill that
 * in. They carry no protocol, hence the prefix.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit;

  // Stable across every production deployment of the project.
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) return `https://${production}`;

  // This specific deployment — the only thing a preview build can know.
  const deployment = process.env.VERCEL_URL?.trim();
  if (deployment) return `https://${deployment}`;

  return "http://localhost:3000";
}
