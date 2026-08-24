import type { UpColor } from "@/lib/chart-theme";
import type { Scope, ViewMode } from "@/lib/types/view";

/** Everything the app remembers about how one person reads it. */
export interface UserSettings {
  scope: Scope;
  viewMode: ViewMode;
  log: boolean;
  dividends: boolean;
  krw: boolean;
  inflation: boolean;
  upColor: UpColor;
}

export const DEFAULT_SETTINGS: UserSettings = {
  scope: "10Y",
  viewMode: "grid",
  log: false,
  dividends: false,
  krw: false,
  inflation: false,
  upColor: "red",
};
