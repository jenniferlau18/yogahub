import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Redirect to home, stripping all query params
      const homeUrl = new URL("/", origin);
      return NextResponse.redirect(homeUrl);
    }
  }

  // If something went wrong, redirect to login (no code in URL)
  const loginUrl = new URL("/auth/login", origin);
  return NextResponse.redirect(loginUrl);
}
