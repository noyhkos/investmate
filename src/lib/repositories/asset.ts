import { createClient } from "@/lib/supabase/server";
import type { Asset } from "@/lib/types/asset";

export async function findAssetsByIds(ids: string[]): Promise<Asset[]> {
  if (ids.length === 0) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("assets")
    .select("id, symbol, name, type, currency, first_date")
    .in("id", ids);

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    symbol: row.symbol,
    name: row.name,
    type: row.type,
    currency: row.currency,
    firstDate: row.first_date,
  }));
}
