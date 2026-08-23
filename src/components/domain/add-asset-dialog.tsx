"use client";

import { useEffect, useState } from "react";
import { Loader2, Search } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { guessCurrency } from "@/lib/market/currency";
import type { AssetType } from "@/lib/types/asset";
import type { WatchedAsset } from "@/lib/watchlist-store";

interface Hit {
  symbol: string;
  name: string;
  exchange: string;
  type: AssetType;
}

interface AddAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groups: string[];
  onAdd: (asset: WatchedAsset) => void;
}

const TYPE_LABEL: Record<AssetType, string> = {
  stock: "주식",
  etf: "ETF",
  fx: "환율",
  metal: "귀금속",
  index: "지수",
  crypto: "코인",
};

export function AddAssetDialog({ open, onOpenChange, groups, onAdd }: AddAssetDialogProps) {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);
  const [group, setGroup] = useState(groups[0] ?? "관심종목");

  const term = query.trim();
  // Derived rather than stored: clearing the box should hide results without
  // a state write, and stale hits must never outlive the query that fetched them.
  const visibleHits = term ? hits : [];

  // Debounced so typing does not fire a request per keystroke.
  useEffect(() => {
    const term = query.trim();
    if (!term) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`, {
          signal: controller.signal,
        });
        const body = (await res.json()) as { results?: Hit[] };
        setHits(body.results ?? []);
      } catch {
        // Aborted or offline; the previous list stays on screen.
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        // Reset on close in the event handler, not in an effect.
        if (!next) setQuery("");
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>종목 추가</DialogTitle>
          <DialogDescription>
            종목명, 티커, 코인, 환율 모두 검색됩니다.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" aria-hidden />
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="삼성전자, AAPL, BTC-KRW…"
            className="pl-9"
            aria-label="종목 검색"
          />
          {loading ? (
            <Loader2 className="text-muted-foreground absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin" aria-hidden />
          ) : null}
        </div>

        <div className="max-h-72 overflow-y-auto">
          {visibleHits.length === 0 && term && !loading ? (
            <p className="text-muted-foreground py-6 text-center text-[0.8125rem]">
              결과가 없습니다.
            </p>
          ) : null}
          <ul>
            {visibleHits.map((hit) => (
              <li key={hit.symbol}>
                <button
                  type="button"
                  onClick={() => {
                    onAdd({
                      symbol: hit.symbol,
                      name: hit.name,
                      type: hit.type,
                      currency: guessCurrency(hit.symbol),
                      group,
                    });
                    onOpenChange(false);
                  }}
                  className="hover:bg-accent focus-visible:ring-ring flex w-full cursor-pointer items-center gap-3 rounded-[2px] px-2 py-2 text-left focus-visible:ring-2 focus-visible:outline-none"
                >
                  <span className="text-foreground min-w-0 flex-1 truncate text-[0.8125rem]">
                    {hit.name}
                  </span>
                  <span className="text-muted-foreground shrink-0 text-[0.6875rem] tabular-nums">
                    {hit.symbol}
                  </span>
                  <span className="text-muted-foreground w-12 shrink-0 text-right text-[0.6875rem]">
                    {TYPE_LABEL[hit.type]}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-rule flex items-center gap-2 border-t pt-3">
          <label htmlFor="add-group" className="text-muted-foreground text-[0.75rem]">
            그룹
          </label>
          <Input
            id="add-group"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            list="watchlist-groups"
            className="h-8 w-48 text-[0.8125rem]"
          />
          <datalist id="watchlist-groups">
            {groups.map((g) => (
              <option key={g} value={g} />
            ))}
          </datalist>
        </div>
      </DialogContent>
    </Dialog>
  );
}
