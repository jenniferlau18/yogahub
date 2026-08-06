import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // Run Supabase session refresh
  const { supabaseResponse } = await updateSession(request);

  // Don't redirect the auth callback — let it handle the OAuth code exchange
  // then redirect to the locale-aware home page itself
  const pathname = request.nextUrl.pathname;
  if (pathname === "/auth/callback") {
    return supabaseResponse;
  }

  // Run i18n middleware — use the supabase response so cookies carry through
  const intlResponse = intlMiddleware(request);

  // Merge cookies from Supabase into the i18n response
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value, {
      path: "/",
      ...cookie,
    });
  });

  return intlResponse;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
