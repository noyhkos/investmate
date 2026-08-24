import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { WatchedAsset } from "@/lib/watchlist-types";

export async function listWatchlist(): Promise<WatchedAsset[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("watchlist")
    .select("symbol, name, type, currency")
    .order("sort_order");

  // RLS scopes the rows to the caller, so no user filter is needed here.
  if (error) throw error;
  return data ?? [];
}
