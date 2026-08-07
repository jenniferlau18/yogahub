import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = "https://dgjsyvgagwbzrsfwsxzj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnanN5dmdhZ3dienJzZndzeHpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMDEyNTcsImV4cCI6MjEwMTU3NzI1N30.SyUuNw0Br25qjfQfxTMlQXSqGAE4nTgP4Y9KfIErOsY";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      "apikey": SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const json = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: json.msg || json.error_description || "Login failed" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });

  // Set session cookies
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
