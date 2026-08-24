"use client";

import { createContext, useCallback, useContext, useState } from "react";

import { saveSettings } from "@/lib/actions/settings";
import type { UpColor } from "@/lib/chart-theme";
import { useStoredState } from "@/lib/use-stored-state";
import { DEFAULT_SETTINGS, type UserSettings } from "@/lib/types/settings";

const STORAGE_KEY = "investmate:up-color:v1";

interface SettingsValue {
  upColor: UpColor;
  setUpColor: (next: UpColor) => void;
}

const SettingsContext = createContext<SettingsValue>({
  upColor: DEFAULT_SETTINGS.upColor,
  setUpColor: () => {},
});

/**
 * The rise/fall convention, shared by every value and every plot on screen.
 *
 * It goes through context rather than props because the components that need
 * it — a delta, a sparkline's last-value dot — sit at the leaves, and
 * threading one preference through the tree would touch everything in
 * between for no benefit.
 */
export function SettingsProvider({
  userId,
  settings,
  children,
}: {
  userId: string | null;
  settings: UserSettings;
  children: React.ReactNode;
}) {
  const [guest, writeGuest] = useStoredState<UpColor>(STORAGE_KEY, DEFAULT_SETTINGS.upColor);
  const [server, setServer] = useState<UpColor>(settings.upColor);

  const signedIn = userId !== null;
  const upColor = signedIn ? server : guest;

  const setUpColor = useCallback(
    (next: UpColor) => {
      if (signedIn) {
        setServer(next);
        void saveSettings({ ...settings, upColor: next });
      } else {
        writeGuest(next);
      }
    },
    [signedIn, settings, writeGuest],
  );

  return (
    <SettingsContext value={{ upColor, setUpColor }}>{children}</SettingsContext>
  );
}

export function useUpColor(): [UpColor, (next: UpColor) => void] {
  const { upColor, setUpColor } = useContext(SettingsContext);
  return [upColor, setUpColor];
}
