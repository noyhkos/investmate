import "server-only";

import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

/**
 * The signed-in user, or null.
 *
 * Returns null rather than throwing when the project is not connected, so
 * the app degrades to guest mode instead of failing to render.
 */
export async function getUser(): Promise<User | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;

  try {
    const supabase = await createClient();
    // getUser revalidates the token with the auth server; getSession would
    // trust a cookie the client could have written.
    const { data } = await supabase.auth.getUser();
    return data.user;
  } catch {
    return null;
  }
}
