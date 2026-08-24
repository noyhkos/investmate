import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/supabase/env";

/**
 * Refreshes the Supabase session on every request.
 *
 * Server Components cannot write cookies, so without this the access token
 * would expire mid-session and the user would be signed out on the next
 * navigation rather than at any moment they could understand.
 *
 * Named `proxy` and living in proxy.ts: Next 16 renamed the middleware
 * convention, and the old name still builds but warns.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Before the project is connected the app still has to run as a guest.
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) return response;

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (items) => {
        for (const { name, value } of items) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of items) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // Touching the user is what triggers the refresh; the result is unused here.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    // Everything except static assets, the image optimiser, and the uipin
    // queue route — the picker posts without a session, and answering it
    // with a redirect would make the write silently do nothing.
    "/((?!_next/static|_next/image|favicon.ico|api/uipin|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
