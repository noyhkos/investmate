"use client";

import { useCallback, useSyncExternalStore } from "react";

type Listener = () => void;

const listeners = new Map<string, Set<Listener>>();
const snapshots = new Map<string, string | null>();
// Parsed values are cached against the exact string they came from, so a
// stable snapshot yields a stable object identity across renders.
const parsed = new Map<string, { raw: string; value: unknown }>();

function read(key: string): string | null {
  if (!snapshots.has(key)) {
    try {
      snapshots.set(key, window.localStorage.getItem(key));
    } catch {
      snapshots.set(key, null);
    }
  }
  return snapshots.get(key) ?? null;
}

function emit(key: string) {
  for (const listener of listeners.get(key) ?? []) listener();
}

/**
 * localStorage as an external store.
 *
 * The cached snapshot is what makes this safe: useSyncExternalStore compares
 * snapshots by identity, and reading the string from storage on every call
 * would hand it a new value each time and loop. Writes update the cache
 * first, then notify — which also keeps two components on the same key in
 * step without a provider.
 */
export function useStoredState<T>(
  key: string,
  fallback: T,
): [T, (next: T) => void] {
  const raw = useSyncExternalStore(
    useCallback(
      (listener: Listener) => {
        const set = listeners.get(key) ?? new Set();
        set.add(listener);
        listeners.set(key, set);
        return () => set.delete(listener);
      },
      [key],
    ),
    () => read(key),
    () => null,
  );

  const value = parseCached(key, raw, fallback);

  const write = useCallback(
    (next: T) => {
      const encoded = JSON.stringify(next);
      snapshots.set(key, encoded);
      try {
        window.localStorage.setItem(key, encoded);
      } catch {
        // Private mode: the session works, it just will not survive a reload.
      }
      emit(key);
    },
    [key],
  );

  return [value, write];
}

function parseCached<T>(key: string, raw: string | null, fallback: T): T {
  if (raw === null) return fallback;
  const hit = parsed.get(key);
  if (hit && hit.raw === raw) return hit.value as T;
  try {
    const value = JSON.parse(raw) as T;
    parsed.set(key, { raw, value });
    return value;
  } catch {
    return fallback;
  }
}
