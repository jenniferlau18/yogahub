import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "(not set)";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "(not set)";
  
  // Only show first/last 8 chars for security
  const maskedKey = key.length > 20 
    ? key.slice(0, 9) + "..." + key.slice(-8)
    : key;

  // Simple key check — just verify via a REST/health-style call
  let keyCheck = "not tested";
  try {
    const res = await fetch(`${url}/rest/v1/profiles?limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    keyCheck = `HTTP ${res.status}`;
  } catch (e: any) {
    keyCheck = `Error: ${e.message}`;
  }

  return NextResponse.json({
    url,
    keyPreview: maskedKey,
    keyCheck,
  });
}
