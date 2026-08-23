"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  DEFAULT_VIEW_OPTIONS,
  SCOPES,
  type Scope,
  type ViewMode,
  type ViewOptions,
} from "@/lib/types/view";

/**
 * View state lives in the URL, not in React state.
 *
 * Almost everything the user changes here is a way of looking, not a piece of
 * data — so back works, a reload keeps the view, and a particular reading of
 * a chart can be handed to someone as a link.
 */
export function useViewOptions(): [ViewOptions, (patch: Partial<ViewOptions>) => void] {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const scope = params.get("scope");
  const mode = params.get("view");

  const options: ViewOptions = useMemo(() => ({
    scope: SCOPES.includes(scope as Scope) ? (scope as Scope) : DEFAULT_VIEW_OPTIONS.scope,
    mode: mode === "overlay" ? ("overlay" as ViewMode) : DEFAULT_VIEW_OPTIONS.mode,
    log: readFlag(params.get("log"), DEFAULT_VIEW_OPTIONS.log),
    dividends: readFlag(params.get("div"), DEFAULT_VIEW_OPTIONS.dividends),
    krw: readFlag(params.get("krw"), DEFAULT_VIEW_OPTIONS.krw),
    inflation: readFlag(params.get("cpi"), DEFAULT_VIEW_OPTIONS.inflation),
  }), [params, scope, mode]);

  const update = useCallback(
    (patch: Partial<ViewOptions>) => {
      const next = { ...options, ...patch };
      const query = new URLSearchParams();
      // Only non-default values reach the URL, so the common case stays clean.
      if (next.scope !== DEFAULT_VIEW_OPTIONS.scope) query.set("scope", next.scope);
      if (next.mode !== DEFAULT_VIEW_OPTIONS.mode) query.set("view", next.mode);
      if (next.log !== DEFAULT_VIEW_OPTIONS.log) query.set("log", next.log ? "1" : "0");
      if (next.dividends !== DEFAULT_VIEW_OPTIONS.dividends) query.set("div", next.dividends ? "1" : "0");
      if (next.krw !== DEFAULT_VIEW_OPTIONS.krw) query.set("krw", next.krw ? "1" : "0");
      if (next.inflation !== DEFAULT_VIEW_OPTIONS.inflation) query.set("cpi", next.inflation ? "1" : "0");

      const search = query.toString();
      router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
    },
    [options, pathname, router],
  );

  return [options, update];
}

function readFlag(raw: string | null, fallback: boolean): boolean {
  if (raw === "1") return true;
  if (raw === "0") return false;
  return fallback;
}
