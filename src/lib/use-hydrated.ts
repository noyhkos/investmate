"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/**
 * False on the server and during the first client render, true afterwards.
 *
 * Anything derived from localStorage or the resolved theme is unknown until
 * the browser takes over; rendering the real value earlier would flag the
 * wrong option for a frame. useSyncExternalStore expresses that directly,
 * without a setState inside an effect.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
