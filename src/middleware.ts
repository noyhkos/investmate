import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Refreshes the Supabase session on every request.
 *
 * Server Components cannot write cookies, so without this the access token
 * would expire mid-session and the user would be signed out on the next
 * navigation rather than at any moment they could understand.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  // Before the project is connected the app still has to run as a guest.
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
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
    // queue route — the picker posts without a session and a middleware that
    // answers with a redirect would make the write silently do nothing.
    "/((?!_next/static|_next/image|favicon.ico|api/uipin|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
