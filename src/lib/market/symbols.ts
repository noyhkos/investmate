import type { AssetType } from "@/lib/types/asset";

/**
 * One provider covers every asset class we need, so v0 stays in a single
 * language. Korean tickers carry a .KS / .KQ suffix; FX and futures use
 * Yahoo's own conventions.
 */
export const MACRO_SYMBOLS = [
  { symbol: "KRW=X", name: "USD/KRW", type: "fx" as AssetType, currency: "KRW" },
  { symbol: "JPYKRW=X", name: "JPY/KRW", type: "fx" as AssetType, currency: "KRW" },
  { symbol: "GC=F", name: "금", type: "metal" as AssetType, currency: "USD" },
  { symbol: "SI=F", name: "은", type: "metal" as AssetType, currency: "USD" },
  { symbol: "^KS11", name: "KOSPI", type: "index" as AssetType, currency: "KRW" },
  { symbol: "BTC-KRW", name: "비트코인", type: "crypto" as AssetType, currency: "KRW" },
];

/** Symbol used to convert USD-denominated series into KRW. */
export const USD_KRW = "KRW=X";

/** Yahoo quotes crypto against a fiat pair, including KRW directly. */
const CRYPTO_PAIR = /-(USD|KRW|EUR|JPY)$/;

export function guessType(symbol: string): AssetType {
  if (symbol.endsWith("=X")) return "fx";
  if (symbol.endsWith("=F")) return "metal";
  if (symbol.startsWith("^")) return "index";
  if (CRYPTO_PAIR.test(symbol)) return "crypto";
  return "stock";
}

/**
 * Crypto trades every day; exchanges close on weekends and holidays. Mixing
 * them on one axis is what forces the carry-forward in `alignByDate`.
 */
export function tradesEveryDay(type: AssetType): boolean {
  return type === "crypto";
}
