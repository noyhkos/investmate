import "server-only";

import { cache } from "react";
import type { User } from "@supabase/supabase-js";

import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

/**
 * The signed-in user, or null.
 *
 * Returns null rather than throwing when the project is not connected, so
 * the app degrades to guest mode instead of failing to render.
 *
 * Wrapped in `cache` so a layout and the page inside it share one call.
 * Without it every server component that needs the user pays its own round
 * trip to the auth server on the same request.
 */
export const getUser = cache(async (): Promise<User | null> => {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = await createClient();
    // getUser revalidates the token with the auth server; getSession would
    // trust a cookie the client could have written.
    const { data } = await supabase.auth.getUser();
    return data.user;
  } catch {
    return null;
  }
});
