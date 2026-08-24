import { NextResponse } from "next/server";

import { hasHangul, searchKrx } from "@/lib/market/krx-search";
import { guessCurrency } from "@/lib/market/currency";
import { guessType } from "@/lib/market/symbols";
import { searchSymbols } from "@/lib/market/yahoo";
import type { AssetType } from "@/lib/types/asset";

interface Hit {
  symbol: string;
  name: string;
  exchange: string;
  type: AssetType;
  currency: string;
}

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim();
  if (!query) return NextResponse.json({ results: [] });

  // Domestic listings resolve locally because Yahoo's search rejects Hangul
  // outright; a Hangul query would otherwise return nothing at all.
  const local = searchKrx(query).map(decorate);

  // A Hangul query has no meaning to Yahoo, so it is not worth the round trip.
  const remote = hasHangul(query) ? [] : await searchYahoo(query);

  const seen = new Set<string>();
  const results: Hit[] = [];
  for (const hit of [...local, ...remote]) {
    if (seen.has(hit.symbol)) continue;
    seen.add(hit.symbol);
    results.push(hit);
  }

  return NextResponse.json({ results: results.slice(0, 12) });
}

async function searchYahoo(query: string): Promise<Hit[]> {
  try {
    return (await searchSymbols(query)).map(decorate);
  } catch {
    // A dead provider must not take the local results down with it.
    return [];
  }
}

function decorate(hit: { symbol: string; name: string; exchange: string }): Hit {
  return {
    ...hit,
    type: guessType(hit.symbol),
    currency: guessCurrency(hit.symbol),
  };
}
