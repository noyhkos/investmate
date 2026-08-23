import { NextResponse } from "next/server";

import { buildBoard } from "@/lib/market/board";
import { SCOPES, type Scope } from "@/lib/types/view";
import type { AssetType } from "@/lib/types/asset";

interface BoardBody {
  assets: { symbol: string; name: string; type: AssetType; currency: string }[];
  scope: Scope;
  dividends: boolean;
  krw: boolean;
  align?: "common" | "independent";
}

// POST rather than GET: the watchlist lives in the client and can hold more
// symbols than belong in a query string.
export async function POST(request: Request) {
  let body: BoardBody;
  try {
    body = (await request.json()) as BoardBody;
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  if (!Array.isArray(body.assets) || body.assets.length === 0) {
    return NextResponse.json({ error: "종목이 없습니다." }, { status: 400 });
  }
  if (!SCOPES.includes(body.scope)) {
    return NextResponse.json({ error: "알 수 없는 구간입니다." }, { status: 400 });
  }

  try {
    const board = await buildBoard({
      assets: body.assets.slice(0, 40),
      scope: body.scope,
      dividends: Boolean(body.dividends),
      krw: Boolean(body.krw),
      align: body.align === "common" ? "common" : "independent",
    });
    return NextResponse.json(board);
  } catch {
    return NextResponse.json({ error: "시세를 불러오지 못했습니다." }, { status: 502 });
  }
}
