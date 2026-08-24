import "server-only";

import listings from "@/lib/market/krx-listings.json";

export interface KrxHit {
  symbol: string;
  name: string;
  exchange: string;
}

const LISTINGS = listings as [string, string][];

/**
 * KIND publishes legal names, but people search for what they say out loud.
 * Substring matching covers most of the gap ("하이닉스" finds SK하이닉스);
 * these are the cases where the common name shares no substring with the
 * registered one.
 */
const ALIASES: Record<string, string> = {
  현대차: "현대자동차",
  네이버: "NAVER",
  엘지: "LG",
  에스케이: "SK",
  삼전: "삼성전자",
  하닉: "SK하이닉스",
  현차: "현대자동차",
};

const HANGUL = /[가-힣ㄱ-ㅎㅏ-ㅣ]/;

export function hasHangul(text: string): boolean {
  return HANGUL.test(text);
}

/**
 * Local name-to-ticker lookup for Korean listings.
 *
 * Yahoo's search rejects Hangul with "Invalid Search Query", so domestic
 * names have to resolve here or not at all.
 */
export function searchKrx(query: string, limit = 8): KrxHit[] {
  const term = query.trim();
  if (!term) return [];

  const expanded = ALIASES[term] ?? term;
  const needle = expanded.toLowerCase().replace(/\s+/g, "");
  const code = term.toUpperCase();

  // Ranked so an exact name beats a prefix, and a prefix beats a substring —
  // otherwise "카카오" surfaces 카카오게임즈 above 카카오.
  const ranked: { hit: KrxHit; rank: number }[] = [];

  for (const [name, symbol] of LISTINGS) {
    const flat = name.toLowerCase().replace(/\s+/g, "");
    let rank = -1;

    if (symbol.startsWith(code)) rank = 0;
    else if (flat === needle) rank = 1;
    else if (flat.startsWith(needle)) rank = 2;
    else if (flat.includes(needle)) rank = 3;

    if (rank < 0) continue;
    ranked.push({
      hit: { symbol, name, exchange: symbol.endsWith(".KS") ? "KOSPI" : "KOSDAQ" },
      rank,
    });
  }

  // Within a rank, KOSPI first: the larger companies list there, and it is
  // the only size signal available without a second data source.
  ranked.sort(
    (a, b) =>
      a.rank - b.rank ||
      Number(b.hit.exchange === "KOSPI") - Number(a.hit.exchange === "KOSPI") ||
      a.hit.name.length - b.hit.name.length,
  );
  return ranked.slice(0, limit).map((r) => r.hit);
}
