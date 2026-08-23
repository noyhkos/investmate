/** Derived numbers shown on a tile and under the detail chart. */
export interface PerformanceSummary {
  from: string;
  to: string;
  startPrice: number;
  endPrice: number;
  /** Total return over the window, as a ratio (0.15 === +15%). */
  totalReturn: number;
  /**
   * Compound annual growth rate. This is the headline number, not
   * totalReturn — assets have different listing dates, so only a
   * period-normalised figure compares across tiles.
   */
  cagr: number;
  /** Latest session change, as a ratio. */
  dayChange: number;
}
