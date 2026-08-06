import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // Run Supabase session refresh
  const { supabaseResponse } = await updateSession(request);

  // Run i18n middleware
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
  matcher: [
    // Skip i18n redirect for the auth callback — it handles locale in its own redirect
    "/((?!api|_next|_vercel|auth/callback|.*\\..*).*)",
  ],
};
