/** Scope presets. MAX means "the widest window every selected asset covers". */
export const SCOPES = ["1M", "6M", "1Y", "3Y", "5Y", "10Y", "MAX"] as const;
export type Scope = (typeof SCOPES)[number];

/** Bar size. Derived from scope, never picked by the user. */
export type Bucket = "day" | "week" | "month";

export type ViewMode = "grid" | "overlay";

/**
 * The four corrections. Without these a 20-year chart lies:
 * price-only understates dividend payers, and a USD chart hides
 * the half of a Korean investor's return that is exchange rate.
 */
export interface ViewOptions {
  scope: Scope;
  mode: ViewMode;
  /** Log scale. On by default — linear hides early years. */
  log: boolean;
  /** Total return: reinvest dividends. */
  dividends: boolean;
  /** Convert to KRW before computing returns. */
  krw: boolean;
  /** Deflate by CPI to show real return. */
  inflation: boolean;
}

export const DEFAULT_VIEW_OPTIONS: ViewOptions = {
  scope: "MAX",
  mode: "grid",
  log: true,
  dividends: false,
  krw: false,
  inflation: false,
};
