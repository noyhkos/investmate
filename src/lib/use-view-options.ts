"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { saveSettings } from "@/lib/actions/settings";
import { DEFAULT_SETTINGS, type UserSettings } from "@/lib/types/settings";
import { SCOPES, type Scope, type ViewMode, type ViewOptions } from "@/lib/types/view";

/**
 * View state, held in React and mirrored into the URL.
 *
 * The URL used to be the only store, written with router.replace. That reads
 * as a navigation to Next, so every scope change and every toggle fetched the
 * page's server components again — measured at 136-307ms — to be told that
 * nothing had changed. Nothing could have: the server never looks at these
 * parameters. Only client code does.
 *
 * history.replaceState updates the address bar without going through the
 * router, so a reload, a shared link and the back button behave exactly as
 * before. The router's own state object is passed through untouched;
 * replacing it with {} would break Next's navigation.
 */
export function useViewOptions(
  saved: UserSettings = DEFAULT_SETTINGS,
  /** Persist changes. False for guests, who have nowhere to persist to. */
  persist = false,
): [ViewOptions, (patch: Partial<ViewOptions>) => void] {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Read once. From here the state leads and the URL follows.
  const [options, setOptions] = useState<ViewOptions>(() => fromQuery(searchParams, saved));

  // The address can still change underneath us — the back button, a restored
  // history entry — and the state has to follow when it does.
  useEffect(() => {
    const sync = () => setOptions(fromQuery(new URLSearchParams(window.location.search), saved));
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, [saved]);

  const update = useCallback(
    (patch: Partial<ViewOptions>) => {
      const next = { ...options, ...patch };
      setOptions(next);

      const search = toQuery(next, saved);
      window.history.replaceState(
        window.history.state,
        "",
        search ? `${pathname}?${search}` : pathname,
      );

      // Saving is a side effect of reading, never a gate on it: the view has
      // already changed on screen whether or not this succeeds.
      if (persist) {
        void saveSettings({
          scope: next.scope,
          viewMode: next.mode,
          log: next.log,
          dividends: next.dividends,
          krw: next.krw,
          inflation: next.inflation,
          upColor: saved.upColor,
        });
      }
    },
    [options, pathname, saved, persist],
  );

  return [options, update];
}

/**
 * Saved settings are the defaults and a parameter overrides them, so a shared
 * link shows what the sender saw rather than the reader's habits.
 */
function fromQuery(params: URLSearchParams, saved: UserSettings): ViewOptions {
  const scope = params.get("scope");
  const mode = params.get("view");

  return {
    scope: SCOPES.includes(scope as Scope) ? (scope as Scope) : saved.scope,
    mode:
      mode === "overlay"
        ? ("overlay" as ViewMode)
        : mode === "grid"
          ? ("grid" as ViewMode)
          : saved.viewMode,
    log: readFlag(params.get("log"), saved.log),
    dividends: readFlag(params.get("div"), saved.dividends),
    krw: readFlag(params.get("krw"), saved.krw),
    inflation: readFlag(params.get("cpi"), saved.inflation),
  };
}

/** Only values that differ from the saved defaults reach the URL. */
function toQuery(next: ViewOptions, saved: UserSettings): string {
  const query = new URLSearchParams();
  if (next.scope !== saved.scope) query.set("scope", next.scope);
  if (next.mode !== saved.viewMode) query.set("view", next.mode);
  if (next.log !== saved.log) query.set("log", next.log ? "1" : "0");
  if (next.dividends !== saved.dividends) query.set("div", next.dividends ? "1" : "0");
  if (next.krw !== saved.krw) query.set("krw", next.krw ? "1" : "0");
  if (next.inflation !== saved.inflation) query.set("cpi", next.inflation ? "1" : "0");
  return query.toString();
}

function readFlag(raw: string | null, fallback: boolean): boolean {
  if (raw === "1") return true;
  if (raw === "0") return false;
  return fallback;
}
