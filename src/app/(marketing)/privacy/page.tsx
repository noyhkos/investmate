import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  alternates: { canonical: absoluteUrl("/privacy") },
};

export default function Page() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <h1 className="font-heading text-2xl font-semibold">개인정보처리방침</h1>
      <p className="text-muted-foreground mt-4 text-sm">작성 예정입니다.</p>
    </article>
  );
}
