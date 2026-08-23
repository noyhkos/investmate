import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SITE, absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  // `absolute` bypasses the root title template — SITE.title already names the app.
  title: { absolute: SITE.title },
  description: SITE.description,
  alternates: { canonical: absoluteUrl("/") },
};

// Placeholder copy — the section skeleton is what is being reserved here.
const FEATURES = [
  {
    title: "원화 기준 실질 수익률",
    body: "달러로 +50%인데 환율이 빠졌다면 실제로는 얼마인지. 배당·환율·인플레이션을 켜고 끄며 확인합니다.",
  },
  {
    title: "주식·금·은·환율을 한 그리드에",
    body: "자산군마다 다른 사이트를 열 필요 없이, 관심 자산을 한 화면에서 같은 기간으로 비교합니다.",
  },
  {
    title: "20년을 하루처럼",
    body: "로그 스케일과 기간 자동 집계로 장기 구간이 뭉개지지 않습니다. 연평균 수익률로 상장 시점이 다른 자산도 비교됩니다.",
  },
];

export default function LandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    inLanguage: "ko-KR",
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Structured data must reach the HTML source for crawlers to read it.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="mx-auto max-w-5xl px-4 py-20 md:px-6 md:py-28">
        <h1 className="font-heading max-w-2xl text-3xl font-semibold tracking-tight text-balance md:text-5xl">
          원화 기준으로 보는 장기 시세 대시보드
        </h1>
        <p className="text-muted-foreground mt-5 max-w-xl text-base text-pretty md:text-lg">
          {SITE.description}
        </p>
        <div className="mt-8">
          <Button asChild size="lg">
            <Link href="/dashboard">대시보드 열기</Link>
          </Button>
        </div>
      </section>

      <section className="border-t">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 py-16 md:grid-cols-3 md:px-6">
          {FEATURES.map((f) => (
            <div key={f.title}>
              <h2 className="font-heading text-base font-semibold">{f.title}</h2>
              <p className="text-muted-foreground mt-2 text-sm text-pretty">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
