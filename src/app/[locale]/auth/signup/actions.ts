"use server";

import { redirect } from "next/navigation";

const SUPABASE_URL = "https://dgjsyvgagwbzrsfwsxzj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnanN5dmdhZ3dienJzZndzeHpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMDEyNTcsImV4cCI6MjEwMTU3NzI1N30.SyUuNw0Br25qjfQfxTMlQXSqGAE4nTgP4Y9KfIErOsY";

export async function createAccount(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string;
  const role = formData.get("role") as string;
  const locale = (formData.get("locale") as string) || "";
  const localePath = locale === "en" ? "/en" : "";

  const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: "POST",
    headers: {
      "apikey": SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      data: { full_name: fullName, role },
    }),
  });

  const json = await res.json();

  if (!res.ok) {
    redirect(`${localePath}/auth/signup?error=${encodeURIComponent(json.msg || "Signup failed")}`);
  }

  redirect(`${localePath}/auth/login?signup=success`);
}
