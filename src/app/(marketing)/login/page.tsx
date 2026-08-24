import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { GoogleSignIn } from "@/components/domain/google-sign-in";
import { getUser } from "@/lib/auth";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "로그인",
  alternates: { canonical: absoluteUrl("/login") },
};

export default async function LoginPage() {
  if (await getUser()) redirect("/dashboard");

  return (
    <section className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center md:px-6">
      <h1 className="font-heading text-[1.375rem] font-semibold">로그인</h1>
      <p className="text-muted-foreground mt-3 text-[0.8125rem] leading-relaxed text-pretty">
        관심종목과 보기 설정이 계정에 저장됩니다. 로그인하지 않아도 대시보드는 쓸 수 있고,
        그때는 이 브라우저에만 남습니다.
      </p>
      <div className="mt-8">
        <GoogleSignIn />
      </div>
    </section>
  );
}
