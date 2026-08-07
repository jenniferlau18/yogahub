"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const AUTH_URL = "https://dgjsyvgagwbzrsfwsxzj.supabase.co/auth/v1";
const AUTH_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnanN5dmdhZ3dienJzZndzeHpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMDEyNTcsImV4cCI6MjEwMTU3NzI1N30.SyUuNw0Br25qjfQfxTMlQXSqGAE4nTgP4Y9KfIErOsY";

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string;
  const role = formData.get("role") as string;
  const locale = (formData.get("locale") as string) || "";
  const localePath = locale === "en" ? "/en" : "";

  const siteUrl = "https://yogahub-chi.vercel.app";

  // Use raw fetch to bypass @supabase/ssr env var issues
  const res = await fetch(`${AUTH_URL}/signup`, {
    method: "POST",
    headers: {
      apikey: AUTH_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      data: { full_name: fullName, role: role },
    }),
  });

  if (!res.ok) {
    const body = await res.json();
    redirect(`${localePath}/auth/signup?error=${encodeURIComponent(body.msg || body.message || "Signup failed")}`);
  }

  // Redirect to login with a success message
  redirect(`${localePath}/auth/login?signup=success`);
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signInWithGoogle() {
  const supabase = await createClient();

  const siteUrl = "https://yogahub-chi.vercel.app";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${siteUrl}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) return { error: error.message };
  if (data.url) redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
