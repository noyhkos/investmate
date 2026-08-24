"use client";

import { useEffect, useState } from "react";

import { AccountMenu } from "@/components/domain/account-menu";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/browser";

/**
 * Resolves the session in the browser so the page around it can stay static.
 *
 * The marketing pages are the indexable surface and are prerendered at build
 * time; reading cookies on the server to render one button would make the
 * whole route dynamic and give up the CDN for it. The dashboard has no such
 * constraint and passes the email down from the server instead.
 */
export function SessionAccountMenu() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return <AccountMenu email={email} />;
}
