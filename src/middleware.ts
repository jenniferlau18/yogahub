import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NextResponse, type NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

const SUPABASE_URL = "https://dgjsyvgagwbzrsfwsxzj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnanN5dmdhZ3dienJzZndzeHpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMDEyNTcsImV4cCI6MjEwMTU3NzI1N30.SyUuNw0Br25qjfQfxTMlQXSqGAE4nTgP4Y9KfIErOsY";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const code = request.nextUrl.searchParams.get("code");

  // Handle OAuth callback — exchange the code for a session
  if (pathname === "/auth/callback" && code) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=pkce`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ auth_code: code }),
    });

    if (res.ok) {
      const json = await res.json();
      const response = NextResponse.redirect(new URL("/", request.url));

      if (json.access_token) {
        response.cookies.set("sb-access-token", json.access_token, {
          path: "/",
          maxAge: json.expires_in || 3600,
          httpOnly: true,
          secure: true,
          sameSite: "lax",
        });
      }
      if (json.refresh_token) {
        response.cookies.set("sb-refresh-token", json.refresh_token, {
          path: "/",
          maxAge: 60 * 60 * 24 * 30,
          httpOnly: true,
          secure: true,
          sameSite: "lax",
        });
      }

      return response;
    }

    // OAuth failed — redirect to login
    return NextResponse.redirect(new URL("/en/auth/login?error=oauth_failed", request.url));
  }

  // Run i18n middleware for all other requests
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
