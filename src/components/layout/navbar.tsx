import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { NavbarUserMenu } from "./navbar-user-menu";
import { LanguageSwitcher } from "./language-switcher";

export async function Navbar() {
  const supabase = await createClient();
  const t = await getTranslations("common");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: { full_name?: string; role?: string } | null = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-lg font-semibold text-[#2D2D2D]">
          🧘 {t("appName")}
        </Link>

        {/* Nav links */}
        <nav className="hidden sm:flex items-center gap-1">
          <Link href="/search">
            <Button variant="ghost" size="sm">{t("nav.search")}</Button>
          </Link>
          <Link href="/calendar">
            <Button variant="ghost" size="sm">{t("nav.calendar")}</Button>
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          {user ? (
            <NavbarUserMenu
              userName={profile?.full_name ?? user.email ?? "User"}
              role={profile?.role ?? "student"}
            />
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  {t("signIn")}
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="bg-[#7C9082] hover:bg-[#6B7D71]">
                  {t("signUp")}
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
