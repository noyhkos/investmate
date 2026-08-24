"use server";

import { revalidatePath } from "next/cache";

import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types/action-result";
import type { WatchedAsset } from "@/lib/watchlist-types";

export async function addToWatchlist(asset: WatchedAsset): Promise<ActionResult> {
  const user = await getUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };

  const supabase = await createClient();
  // Appending means the new row sorts after everything already there.
  const { data: last } = await supabase
    .from("watchlist")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("watchlist").upsert(
    { ...asset, user_id: user.id, sort_order: (last?.sort_order ?? -1) + 1 },
    { onConflict: "user_id,symbol" },
  );

  if (error) return { ok: false, error: "종목을 추가하지 못했습니다." };
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function removeFromWatchlist(symbol: string): Promise<ActionResult> {
  const user = await getUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };

  const supabase = await createClient();
  const { error } = await supabase.from("watchlist").delete().eq("symbol", symbol);

  if (error) return { ok: false, error: "종목을 제거하지 못했습니다." };
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function reorderWatchlist(symbols: string[]): Promise<ActionResult> {
  const user = await getUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };

  const supabase = await createClient();
  // The whole order is rewritten rather than patched: a drag can move every
  // row after the drop point, and one round trip beats N.
  const { error } = await supabase.from("watchlist").upsert(
    symbols.map((symbol, sort_order) => ({ user_id: user.id, symbol, sort_order })),
    { onConflict: "user_id,symbol" },
  );

  if (error) return { ok: false, error: "순서를 저장하지 못했습니다." };
  return { ok: true };
}

/**
 * Copies a guest's local list up on first sign-in, and only then — an empty
 * server list is the signal. Merging into a list the user has already
 * curated would resurrect tickers they removed on another device.
 */
export async function seedWatchlist(assets: WatchedAsset[]): Promise<ActionResult> {
  const user = await getUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };
  if (assets.length === 0) return { ok: true };

  const supabase = await createClient();
  const { count } = await supabase
    .from("watchlist")
    .select("symbol", { count: "exact", head: true });

  if ((count ?? 0) > 0) return { ok: true };

  const { error } = await supabase.from("watchlist").insert(
    assets.map((asset, sort_order) => ({ ...asset, user_id: user.id, sort_order })),
  );

  if (error) return { ok: false, error: "관심종목을 옮기지 못했습니다." };
  revalidatePath("/dashboard");
  return { ok: true };
}
