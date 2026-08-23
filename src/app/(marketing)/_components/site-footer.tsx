import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-5 gap-y-2 px-4 py-6 text-xs text-muted-foreground md:px-6">
        <span>© {new Date().getFullYear()} investmate</span>
        <Link href="/terms" className="hover:underline">
          이용약관
        </Link>
        <Link href="/privacy" className="hover:underline">
          개인정보처리방침
        </Link>
        <span className="ml-auto">
          시세는 참고용이며 투자 판단의 근거로 삼을 수 없습니다.
        </span>
      </div>
    </footer>
  );
}
