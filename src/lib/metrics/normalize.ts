export interface IndexedPoint {
  date: string;
  /** Rebased value; the window's first close is 100. */
  value: number;
}

/**
 * Overlay charts plot indexed values, never raw prices — 71,200 KRW and
 * $258 on one axis is unreadable, and a second axis is never the answer.
 * The base moves with the window, so changing scope re-bases every series.
 */
export function rebaseTo100(dates: string[], closes: number[]): IndexedPoint[] {
  if (closes.length === 0) return [];
  const base = closes[0];
  if (base <= 0) return [];
  return closes.map((close, i) => ({ date: dates[i], value: (close / base) * 100 }));
}

/**
 * Align series onto one date axis.
 *
 * Two different gaps have to be told apart. Before an asset's first bar there
 * is no value and none may be invented — a flat synthetic line where a stock
 * did not yet exist is the most common lie in this kind of chart. Inside its
 * trading life a gap is only a closed market, and Friday's close IS the
 * value on Sunday; without carrying it forward, adding one 365-day crypto
 * series turns every equity line into dashes.
 */
export function alignByDate(
  seriesById: Record<string, IndexedPoint[]>,
): { date: string; values: Record<string, number | null> }[] {
  const dates = new Set<string>();
  for (const points of Object.values(seriesById)) {
    for (const p of points) dates.add(p.date);
  }

  const tracks = Object.entries(seriesById).map(([id, points]) => ({
    id,
    first: points[0]?.date ?? null,
    last: points[points.length - 1]?.date ?? null,
    byDate: new Map(points.map((p) => [p.date, p.value])),
  }));

  const carried = new Map<string, number>();

  return [...dates].sort().map((date) => {
    const values: Record<string, number | null> = {};
    for (const t of tracks) {
      const exact = t.byDate.get(date);
      if (exact !== undefined) {
        carried.set(t.id, exact);
        values[t.id] = exact;
        continue;
      }
      const withinLife = t.first !== null && date >= t.first && date <= t.last!;
      values[t.id] = withinLife ? (carried.get(t.id) ?? null) : null;
    }
    return { date, values };
  });
}
