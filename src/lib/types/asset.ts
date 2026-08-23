export type AssetType = "stock" | "etf" | "fx" | "metal" | "index" | "crypto";

export interface Asset {
  id: string;
  /** Yahoo Finance symbol — "005930.KS", "AAPL", "KRW=X", "GC=F" */
  symbol: string;
  name: string;
  type: AssetType;
  /** Currency the quotes are denominated in. Drives the KRW conversion toggle. */
  currency: string;
  /** Earliest date with price data. Cached so scope math avoids MIN(date) scans. */
  firstDate: string | null;
}

export interface Candle {
  /** ISO date, YYYY-MM-DD */
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  /** Dividend-reinvested close. Null for FX and futures. */
  adjClose: number | null;
  volume: number;
}

export interface Series {
  asset: Asset;
  candles: Candle[];
}
