import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

// POST only: a GET would let any page log the user out with an image tag.
export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
