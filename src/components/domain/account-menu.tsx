"use client";

import Link from "next/link";
import { LogIn, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Signed out this is an invitation, not a wall — the dashboard works either
 * way, and the only thing an account buys is that the list survives the
 * browser.
 */
export function AccountMenu({ email }: { email: string | null }) {
  if (!email) {
    return (
      <Button asChild variant="ghost" size="sm" className="cursor-pointer gap-1.5">
        <Link href="/login">
          <LogIn className="size-3.5" aria-hidden />
          로그인
        </Link>
      </Button>
    );
  }

  return (
    <form action="/auth/signout" method="post" className="flex items-center gap-2">
      <span className="text-muted-foreground hidden max-w-40 truncate text-[0.6875rem] sm:block">
        {email}
      </span>
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        aria-label="로그아웃"
        className="cursor-pointer"
      >
        <LogOut className="size-3.5" aria-hidden />
      </Button>
    </form>
  );
}
