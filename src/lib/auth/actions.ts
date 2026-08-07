"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const getSupabaseUrl = () => process.env.NEXT_PUBLIC_SUPABASE_URL!;
const getSupabaseKey = () => process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Create a supabase-js admin-style client for auth operations */
function authClient() {
  return createClient(getSupabaseUrl(), getSupabaseKey(), {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string;
  const role = formData.get("role") as string;
  const locale = (formData.get("locale") as string) || "";
  const localePath = locale === "en" ? "/en" : "";

  const siteUrl = "https://yogahub-chi.vercel.app";
  const supabase = authClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
      data: { full_name: fullName, role: role },
    },
  });

  if (error) {
    redirect(`${localePath}/auth/signup?error=${encodeURIComponent(error.message)}`);
  }

  redirect(`${localePath}/auth/login?signup=success`);
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const locale = (formData.get("locale") as string) || "";
  const localePath = locale === "en" ? "/en" : "";
  const supabase = authClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Manually set session cookies (authClient doesn't use @supabase/ssr)
  if (data.session) {
    const cookieStore = await cookies();
    cookieStore.set("sb-access-token", data.session.access_token, {
      path: "/",
      maxAge: data.session.expires_in,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
    cookieStore.set("sb-refresh-token", data.session.refresh_token, {
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

export async function signInWithGoogle() {
  const siteUrl = "https://yogahub-chi.vercel.app";
  const supabase = authClient();

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
  const supabase = authClient();
  const cookieStore = await cookies();

  // Clear session cookies
  cookieStore.set("sb-access-token", "", { path: "/", maxAge: 0 });
  cookieStore.set("sb-refresh-token", "", { path: "/", maxAge: 0 });

  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/"); // i18n middleware handles locale redirect
}
