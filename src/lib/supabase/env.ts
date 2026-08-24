/**
 * The browser-safe key and the project URL.
 *
 * Supabase replaced `anon` with a publishable key (`sb_publishable_...`);
 * the legacy name is still accepted so an existing .env keeps working, but
 * the new one is what a fresh project should set. Either value goes in the
 * same slot — never a secret or service_role key, which bypass RLS and
 * would be shipped to the browser by anything prefixed NEXT_PUBLIC_.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);
}
