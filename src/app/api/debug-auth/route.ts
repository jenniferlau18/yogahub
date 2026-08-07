import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://dgjsyvgagwbzrsfwsxzj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnanN5dmdhZ3dienJzZndzeHpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMDEyNTcsImV4cCI6MjEwMTU3NzI1N30.SyUuNw0Br25qjfQfxTMlQXSqGAE4nTgP4Y9KfIErOsY";

export async function GET() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data, error } = await supabase.auth.signInWithPassword({
    email: "jenniferlau1811@gmail.com",
    password: "TestPass123!",
  });

  if (error) {
    return NextResponse.json({
      ok: false,
      error: error.message,
      code: error.code,
      status: error.status,
    });
  }

  return NextResponse.json({
    ok: true,
    hasSession: !!data.session,
    userId: data.user?.id?.slice(0, 8) + "...",
    email: data.user?.email,
  });
}
