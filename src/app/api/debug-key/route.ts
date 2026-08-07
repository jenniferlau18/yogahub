import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "(not set)";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "(not set)";
  
  // Only show first/last 8 chars for security
  const maskedKey = key.length > 20 
    ? key.slice(0, 9) + "..." + key.slice(-8)
    : key;

  // Test auth signup via raw fetch (same call as signUp server action)
  let authCheck = "not tested";
  try {
    const res = await fetch(`${url}/auth/v1/signup`, {
      method: "POST",
      headers: {
        apikey: key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "debugcheck2@mailinator.com",
        password: "Test123456!",
        data: { full_name: "Debug", role: "student" },
      }),
    });
    authCheck = `HTTP ${res.status}: ${(await res.text()).slice(0, 150)}`;
  } catch (e: any) {
    authCheck = `Error: ${e.message}`;
  }

  return NextResponse.json({
    url,
    keyPreview: maskedKey,
    authCheck,
  });
}
