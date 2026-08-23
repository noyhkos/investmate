"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { Board } from "@/lib/market/board";
import type { ViewOptions } from "@/lib/types/view";
import type { WatchedAsset } from "@/lib/watchlist-store";

interface BoardState {
  board: Board | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

interface Result {
  /** The request this result answers. Comparing it to the current request is
   *  what makes `loading` a derived value rather than a second state write. */
  key: string;
  board: Board | null;
  error: string | null;
}

/**
 * Fetches one dashboard's worth of data. Scope, dividends, KRW and the view
 * mode all change what the server must compute, so they belong in the
 * request; log scale is purely a way of drawing and never triggers a fetch.
 */
export function useBoard(assets: WatchedAsset[], options: ViewOptions): BoardState {
  const [result, setResult] = useState<Result | null>(null);
  const [nonce, setNonce] = useState(0);

  const symbols = assets.map((a) => a.symbol).join(",");

  // Callers may build the array inline, so the payload is memoised on the
  // symbol string rather than on array identity — otherwise every render
  // would look like a new list and loop fetch -> setState -> fetch.
  const payload = useMemo(
    () => assets.map(({ symbol, name, type, currency }) => ({ symbol, name, type, currency })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [symbols],
  );

  const align = options.mode === "overlay" ? "common" : "independent";
  const key = [symbols, options.scope, options.dividends, options.krw, align, nonce].join("|");

  useEffect(() => {
    if (payload.length === 0) return;

    const controller = new AbortController();

    fetch("/api/board", {
      method: "POST",
      headers: { "content-type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        assets: payload,
        scope: options.scope,
        dividends: options.dividends,
        krw: options.krw,
        align,
      }),
    })
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body?.error ?? "시세를 불러오지 못했습니다.");
        setResult({ key, board: body as Board, error: null });
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setResult({
          key,
          board: null,
          error: err instanceof Error ? err.message : "시세를 불러오지 못했습니다.",
        });
      });

    return () => controller.abort();
  }, [key, payload, align, options.scope, options.dividends, options.krw]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  if (payload.length === 0) {
    return { board: null, loading: false, error: null, reload };
  }

  const fresh = result?.key === key;
  return {
    // The previous board stays on screen while a new one loads, so changing
    // scope does not blank the grid.
    board: result?.board ?? null,
    loading: !fresh,
    error: fresh ? result.error : null,
    reload,
  };
}
