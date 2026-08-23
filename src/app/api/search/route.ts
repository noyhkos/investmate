import { NextResponse } from "next/server";

import { guessType } from "@/lib/market/symbols";
import { searchSymbols } from "@/lib/market/yahoo";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim();
  if (!query) return NextResponse.json({ results: [] });

  try {
    const hits = await searchSymbols(query);
    return NextResponse.json({
      results: hits.map((hit) => ({ ...hit, type: guessType(hit.symbol) })),
    });
  } catch {
    return NextResponse.json({ error: "검색에 실패했습니다." }, { status: 502 });
  }
}
