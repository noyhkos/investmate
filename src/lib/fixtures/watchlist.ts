import type { AssetType } from "@/lib/types/asset";

export interface SeedEntry {
  symbol: string;
  name: string;
  type: AssetType;
  currency: string;
}

/**
 * Seed watchlist. Stands in for the `watchlist` table until Supabase is
 * connected; the store persists user edits over the top of it.
 */
export const SEED_WATCHLIST: SeedEntry[] = [
  { symbol: "005930.KS", name: "삼성전자", type: "stock", currency: "KRW" },
  { symbol: "VOO", name: "S&P 500 (VOO)", type: "etf", currency: "USD" },
  { symbol: "AAPL", name: "Apple", type: "stock", currency: "USD" },
  { symbol: "000660.KS", name: "SK하이닉스", type: "stock", currency: "KRW" },
  { symbol: "GLD", name: "금 (GLD)", type: "metal", currency: "USD" },
  { symbol: "SLV", name: "은 (SLV)", type: "metal", currency: "USD" },
  { symbol: "BTC-KRW", name: "비트코인", type: "crypto", currency: "KRW" },
  { symbol: "KRW=X", name: "USD/KRW", type: "fx", currency: "KRW" },
];
