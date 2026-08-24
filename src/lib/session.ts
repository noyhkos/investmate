import "server-only";

import { cache } from "react";

import { getUser } from "@/lib/auth";
import { listWatchlist } from "@/lib/repositories/watchlist";
import { loadSettings } from "@/lib/repositories/settings";
import { DEFAULT_SETTINGS, type UserSettings } from "@/lib/types/settings";
import type { WatchedAsset } from "@/lib/watchlist-types";

export interface SessionData {
  userId: string | null;
  assets: WatchedAsset[];
  settings: UserSettings;
}

/**
 * Everything a page needs to render for whoever is asking.
 *
 * A guest gets empty server state and the defaults; the browser store fills
 * both in on the client. One call keeps every page consistent about what
 * "signed out" looks like.
 *
 * Cached per request: the dashboard layout and the page inside it both ask
 * for this, and without deduplication that is two sets of Supabase queries
 * for one navigation.
 */
export const getSessionData = cache(async (): Promise<SessionData> => {
  const user = await getUser();
  if (!user) return { userId: null, assets: [], settings: DEFAULT_SETTINGS };

  const [assets, settings] = await Promise.all([listWatchlist(), loadSettings()]);
  return { userId: user.id, assets, settings };
});
