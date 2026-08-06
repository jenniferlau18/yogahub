import { updateSession } from "@/lib/supabase/middleware";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Update the auth session (refreshes tokens, keeps user logged in)
  const { supabaseResponse } = await updateSession(request);
  return supabaseResponse;
}

// Only run middleware on these paths — NOT on static files or images
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
