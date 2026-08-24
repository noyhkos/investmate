"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { saveSettings } from "@/lib/actions/settings";
import { DEFAULT_SETTINGS, type UserSettings } from "@/lib/types/settings";
import { SCOPES, type Scope, type ViewMode, type ViewOptions } from "@/lib/types/view";

/**
 * View state lives in the URL, not in React state.
 *
 * Almost everything the user changes here is a way of looking, not a piece of
 * data — so back works, a reload keeps the view, and a particular reading of
 * a chart can be handed to someone as a link.
 */
export function useViewOptions(
  saved: UserSettings = DEFAULT_SETTINGS,
  /** Persist changes. False for guests, who have nowhere to persist to. */
  persist = false,
): [ViewOptions, (patch: Partial<ViewOptions>) => void] {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const scope = params.get("scope");
  const mode = params.get("view");

  // The saved settings are the defaults; a URL parameter overrides them, so
  // a shared link shows what the sender saw rather than the reader's habits.
  const options: ViewOptions = useMemo(() => ({
    scope: SCOPES.includes(scope as Scope) ? (scope as Scope) : saved.scope,
    mode: mode === "overlay" ? ("overlay" as ViewMode) : mode === "grid" ? "grid" : saved.viewMode,
    log: readFlag(params.get("log"), saved.log),
    dividends: readFlag(params.get("div"), saved.dividends),
    krw: readFlag(params.get("krw"), saved.krw),
    inflation: readFlag(params.get("cpi"), saved.inflation),
  }), [params, scope, mode, saved]);

  const update = useCallback(
    (patch: Partial<ViewOptions>) => {
      const next = { ...options, ...patch };
      const query = new URLSearchParams();
      // Only values that differ from the saved defaults reach the URL, so the
      // common case stays clean and the link stays short.
      if (next.scope !== saved.scope) query.set("scope", next.scope);
      if (next.mode !== saved.viewMode) query.set("view", next.mode);
      if (next.log !== saved.log) query.set("log", next.log ? "1" : "0");
      if (next.dividends !== saved.dividends) query.set("div", next.dividends ? "1" : "0");
      if (next.krw !== saved.krw) query.set("krw", next.krw ? "1" : "0");
      if (next.inflation !== saved.inflation) query.set("cpi", next.inflation ? "1" : "0");

      const search = query.toString();
      router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });

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
    [options, pathname, router, saved, persist],
  );

  return [options, update];
}

function readFlag(raw: string | null, fallback: boolean): boolean {
  if (raw === "1") return true;
  if (raw === "0") return false;
  return fallback;
}
