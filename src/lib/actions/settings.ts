"use server";

import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types/action-result";
import type { UserSettings } from "@/lib/types/settings";

/**
 * Writes the whole settings row. These are view preferences, saved as a
 * side effect of the user changing a control — so a failure is reported but
 * never blocks the change they already see on screen.
 */
export async function saveSettings(settings: UserSettings): Promise<ActionResult> {
  const user = await getUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };

  const supabase = await createClient();
  const { error } = await supabase.from("user_settings").upsert(
    {
      user_id: user.id,
      scope: settings.scope,
      view_mode: settings.viewMode,
      log: settings.log,
      dividends: settings.dividends,
      krw: settings.krw,
      inflation: settings.inflation,
      up_color: settings.upColor,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (error) return { ok: false, error: "설정을 저장하지 못했습니다." };
  return { ok: true };
}
