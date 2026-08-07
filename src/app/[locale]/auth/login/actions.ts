"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const SUPABASE_URL = "https://dgjsyvgagwbzrsfwsxzj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnanN5dmdhZ3dienJzZndzeHpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMDEyNTcsImV4cCI6MjEwMTU3NzI1N30.SyUuNw0Br25qjfQfxTMlQXSqGAE4nTgP4Y9KfIErOsY";

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const locale = (formData.get("locale") as string) || "";
  const localePath = locale === "en" ? "/en" : "";

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
    redirect(`${localePath}/auth/login?error=${encodeURIComponent(json.msg || "Login failed")}`);
  }

  // Set session cookies
  const cookieStore = await cookies();
  if (json.access_token) {
    cookieStore.set("sb-access-token", json.access_token, {
      path: "/",
      maxAge: json.expires_in || 3600,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
  }
  if (json.refresh_token) {
    cookieStore.set("sb-refresh-token", json.refresh_token, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
  }

  revalidatePath("/", "layout");
  redirect(`${localePath}/`);
}
