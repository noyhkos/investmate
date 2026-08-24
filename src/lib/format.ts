/**
 * Every number the user reads goes through here. Formatting lives in one
 * place because a price, a percentage and a CAGR must never disagree about
 * digits or locale.
 */

export function formatPrice(value: number, currency = "USD"): string {
  const digits = pickDigits(value);
  const formatted = value.toLocaleString("ko-KR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
  return currency === "KRW" ? `${formatted}원` : formatted;
}

/** Ratio in, signed percentage out. 0.0142 -> "1.42%" */
export function formatPercent(ratio: number, digits = 2): string {
  return `${Math.abs(ratio * 100).toFixed(digits)}%`;
}

/** Total return over a long window runs to four digits; two decimals is noise. */
export function formatTotalReturn(ratio: number): string {
  const pct = ratio * 100;
  const digits = Math.abs(pct) >= 100 ? 0 : 1;
  return `${pct >= 0 ? "+" : "−"}${Math.abs(pct).toFixed(digits)}%`;
}

export function formatCagr(ratio: number): string {
  return `${ratio >= 0 ? "" : "−"}${Math.abs(ratio * 100).toFixed(1)}%`;
}

/**
 * Axis labels are read as a column, so they trade precision for width:
 * thousands separators, no currency mark, and decimals only where the scale
 * actually needs them.
 */
export function formatAxisPrice(value: number, currency: string): string {
  const digits = currency === "KRW" ? 0 : pickDigits(value);
  return value.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatYear(isoDate: string): string {
  return isoDate.slice(0, 4);
}

function pickDigits(value: number): number {
  const abs = Math.abs(value);
  if (abs >= 1000) return 0;
  if (abs >= 10) return 2;
  if (abs >= 1) return 3;
  return 4;
}
