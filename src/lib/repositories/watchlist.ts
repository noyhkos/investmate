import { createClient } from "@/lib/supabase/server";
import type { WatchlistItem } from "@/lib/types/watchlist";

export async function listWatchlist(userId: string): Promise<WatchlistItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("watchlist")
    .select("asset_id, group, sort_order, note")
    .eq("user_id", userId)
    .order("group")
    .order("sort_order");

  if (error) throw error;

  return (data ?? []).map((row) => ({
    assetId: row.asset_id,
    group: row.group,
    sortOrder: row.sort_order,
    note: row.note,
  }));
}
