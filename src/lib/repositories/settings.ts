import "server-only";

import { createClient } from "@/lib/supabase/server";
import { DEFAULT_SETTINGS, type UserSettings } from "@/lib/types/settings";
import type { Scope, ViewMode } from "@/lib/types/view";
import type { UpColor } from "@/lib/chart-theme";

export async function loadSettings(): Promise<UserSettings> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_settings")
    .select("scope, view_mode, log, dividends, krw, inflation, up_color")
    .maybeSingle();

  // A missing row is not an error: the trigger creates one on signup, but a
  // user created before it existed should still get defaults.
  if (error || !data) return DEFAULT_SETTINGS;

  return {
    scope: data.scope as Scope,
    viewMode: data.view_mode as ViewMode,
    log: data.log,
    dividends: data.dividends,
    krw: data.krw,
    inflation: data.inflation,
    upColor: data.up_color as UpColor,
  };
}
