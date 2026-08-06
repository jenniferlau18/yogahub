import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, CalendarCheck, Heart, ArrowRight, Sparkles, Leaf, Users, Star } from "lucide-react";

export default async function HomePage() {
  const supabase = await createClient();
  const t = await getTranslations("home");
  const tc = await getTranslations("common");

  // Fetch featured studios
  const { data: studios } = await supabase
    .from("studios")
    .select("id, name, city, description")
    .limit(6)
    .order("created_at", { ascending: false });

  // Fetch community counts
  const { count: studioCount } = await supabase
    .from("studios")
    .select("*", { count: "exact", head: true });

  const { count: classCount } = await supabase
    .from("classes")
    .select("*", { count: "exact", head: true });

  const { data: styles } = await supabase
    .from("yoga_styles")
    .select("id, name")
    .limit(8);

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F5F0EB] via-[#EDEBE5] to-[#FAFAF8]">
        {/* Organic water ripples */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-[#7C9082]/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#7C9082]/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-[#7C9082]/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-[#7C9082]/10" />
          {/* Floating orbs */}
          <div className="absolute top-20 left-[15%] w-32 h-32 rounded-full bg-[#7C9082]/5 blur-2xl animate-pulse" />
          <div className="absolute top-40 right-[10%] w-48 h-48 rounded-full bg-[#C5B9A0]/10 blur-2xl" style={{ animationDelay: "2s" }} />
          <div className="absolute bottom-20 left-[20%] w-24 h-24 rounded-full bg-[#7C9082]/8 blur-2xl" style={{ animationDelay: "1s" }} />
        </div>

        <div className="container mx-auto px-4 pt-24 pb-20 md:pt-36 md:pb-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Zen badge */}
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/50 backdrop-blur border border-[#7C9082]/15 text-[#7C9082] text-sm font-medium">
              <Leaf className="h-3.5 w-3.5" />
              {t("badge")}
              <Leaf className="h-3.5 w-3.5" />
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight mb-6 text-[#2D2D2D] leading-tight">
              {t("heroTitle")}
            </h1>

            <p className="text-lg md:text-xl text-[#6B7280] mb-10 max-w-xl mx-auto leading-relaxed font-light">
              {t("heroSubtitle")}
            </p>

            {/* Search Pill */}
            <form action="/search" method="GET" className="flex items-center gap-0 max-w-lg mx-auto bg-white/80 backdrop-blur rounded-full border border-[#7C9082]/15 shadow-lg shadow-[#7C9082]/5 p-1.5 transition-shadow hover:shadow-xl">
              <Search className="h-5 w-5 text-[#7C9082]/60 ml-4 shrink-0" />
              <Input
                name="q"
                placeholder={tc("searchPlaceholder")}
                className="border-0 shadow-none focus-visible:ring-0 text-base h-11 bg-transparent placeholder:text-[#6B7280]/50"
              />
              <Button
                type="submit"
                className="rounded-full bg-[#7C9082] hover:bg-[#6B7D71] px-6 h-11 shadow-md shadow-[#7C9082]/20 transition-all hover:shadow-lg"
              >
                {tc("search")}
              </Button>
            </form>

            {/* Style Pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {styles?.map((style) => (
                <Link key={style.id} href={`/search?style=${style.id}`}>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-[#7C9082]/10 border-[#7C9082]/15 text-[#2D2D2D] px-4 py-2 transition-all hover:border-[#7C9082]/30"
                  >
                    {style.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#FAFAF8] to-transparent pointer-events-none" />
      </section>

      {/* ── Philosophy ── */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-[#7C9082]/5 flex items-center justify-center">
              <Sparkles className="h-7 w-7 text-[#7C9082]/60" />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-light tracking-wide text-[#7C9082] mb-6">
            {t("philosophyTitle")}
          </h2>
          <p className="text-lg text-[#6B7280] leading-relaxed font-light max-w-xl mx-auto">
            {t("philosophyText")}
          </p>
        </div>
      </section>

      {/* ── Community Stats ── */}
      <section className="py-16 bg-[#F5F0EB]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto text-center">
            <div>
              <div className="text-3xl md:text-4xl font-semibold text-[#7C9082] mb-1">
                {studioCount ?? 0}
              </div>
              <div className="text-sm text-[#6B7280] uppercase tracking-wider font-medium">
                {t("communityStudios")}
              </div>
            </div>
            <div className="border-l border-r border-[#7C9082]/15">
              <div className="text-3xl md:text-4xl font-semibold text-[#7C9082] mb-1">
                {classCount ?? 0}
              </div>
              <div className="text-sm text-[#6B7280] uppercase tracking-wider font-medium">
                {t("communityClasses")}
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-semibold text-[#7C9082] mb-1">
                <Users className="h-6 w-6 inline text-[#7C9082]/60" />
              </div>
              <div className="text-sm text-[#6B7280] uppercase tracking-wider font-medium">
                {t("communityStudents")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-light text-center mb-4 text-[#2D2D2D] tracking-wide">
            {t("howItWorks")}
          </h2>
          <p className="text-center text-[#6B7280] mb-16 font-light">
            {t("exploreDesc")}
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card className="text-center border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white relative group">
              <CardContent className="pt-10 pb-8">
                <div className="w-16 h-16 rounded-2xl bg-[#7C9082]/5 flex items-center justify-center mx-auto mb-6 group-hover:bg-[#7C9082]/10 transition-colors">
                  <MapPin className="h-8 w-8 text-[#7C9082]" />
                </div>
                <h3 className="text-xl font-medium mb-3 text-[#2D2D2D]">
                  {t("step1Title")}
                </h3>
                <p className="text-[#6B7280] leading-relaxed font-light">
                  {t("step1Desc")}
                </p>
                {/* Step number */}
                <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-[#7C9082] text-white text-xs flex items-center justify-center font-medium shadow-md">
                  1
                </div>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="text-center border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white relative group md:mt-8">
              <CardContent className="pt-10 pb-8">
                <div className="w-16 h-16 rounded-2xl bg-[#7C9082]/5 flex items-center justify-center mx-auto mb-6 group-hover:bg-[#7C9082]/10 transition-colors">
                  <CalendarCheck className="h-8 w-8 text-[#7C9082]" />
                </div>
                <h3 className="text-xl font-medium mb-3 text-[#2D2D2D]">
                  {t("step2Title")}
                </h3>
                <p className="text-[#6B7280] leading-relaxed font-light">
                  {t("step2Desc")}
                </p>
                <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-[#7C9082] text-white text-xs flex items-center justify-center font-medium shadow-md">
                  2
                </div>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="text-center border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white relative group">
              <CardContent className="pt-10 pb-8">
                <div className="w-16 h-16 rounded-2xl bg-[#7C9082]/5 flex items-center justify-center mx-auto mb-6 group-hover:bg-[#7C9082]/10 transition-colors">
                  <Heart className="h-8 w-8 text-[#7C9082]" />
                </div>
                <h3 className="text-xl font-medium mb-3 text-[#2D2D2D]">
                  {t("step3Title")}
                </h3>
                <p className="text-[#6B7280] leading-relaxed font-light">
                  {t("step3Desc")}
                </p>
                <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-[#7C9082] text-white text-xs flex items-center justify-center font-medium shadow-md">
                  3
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ── Studio Owners CTA ── */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#6B7D71] to-[#7C9082]">
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-white/5" />

        <div className="container mx-auto px-4 py-20 text-center relative z-10">
          <Star className="h-8 w-8 text-white/40 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4 tracking-wide">
            {t("forOwners")}
          </h2>
          <p className="text-[#E8EDE8]/80 mb-10 max-w-xl mx-auto text-lg font-light leading-relaxed">
            {t("forOwnersDesc")}
          </p>
          <Link href="/auth/signup">
            <Button
              size="lg"
              variant="secondary"
              className="font-medium rounded-full px-8 shadow-lg hover:shadow-xl transition-all"
            >
              {t("listYourStudio")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Featured Studios ── */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-light text-[#2D2D2D] tracking-wide">
              {t("featuredStudios")}
            </h2>
            <p className="text-[#6B7280] mt-2 font-light">
              {t("exploreDesc")}
            </p>
          </div>
          <Link href="/search">
            <Button variant="ghost" className="text-[#7C9082] hover:text-[#6B7D71] font-medium">
              {t("viewAll")} <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {!studios || studios.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-[#7C9082]/5 flex items-center justify-center mx-auto mb-6">
              <MapPin className="h-10 w-10 text-[#7C9082]/40" />
            </div>
            <h3 className="text-xl font-medium text-[#2D2D2D] mb-2">
              {t("noStudios")}
            </h3>
            <p className="text-[#6B7280] mb-8 font-light">
              Be the first! Studio owners, sign up to get featured here.
            </p>
            <Link href="/auth/signup">
              <Button className="bg-[#7C9082] hover:bg-[#6B7D71] rounded-full">
                {t("listYourStudio")} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {studios.map((studio) => (
              <Link key={studio.id} href={`/studios/${studio.id}`}>
                <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-md h-full group hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#7C9082]/5 flex items-center justify-center mb-5 group-hover:bg-[#7C9082]/10 transition-colors">
                      <MapPin className="h-7 w-7 text-[#7C9082]" />
                    </div>
                    <h3 className="font-semibold text-lg text-[#2D2D2D] mb-1 group-hover:text-[#7C9082] transition-colors">
                      {studio.name}
                    </h3>
                    <p className="text-sm text-[#6B7280] mb-3">
                      {studio.city}
                    </p>
                    {studio.description && (
                      <p className="text-sm text-[#6B7280]/80 line-clamp-2 font-light">
                        {studio.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── Footer ── */}
      <footer className="relative bg-white pt-20 pb-12 mt-12">
        {/* Wave divider */}
        <div className="absolute top-0 inset-x-0 h-8 bg-gradient-to-b from-[#FAFAF8] to-white" />

        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-10 max-w-4xl mx-auto">
            <div>
              <h3 className="font-semibold text-lg mb-3 text-[#2D2D2D] flex items-center gap-2">
                <Leaf className="h-5 w-5 text-[#7C9082]" />
                {tc("appName")}
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed font-light">
                {t("footerTagline")}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-sm uppercase tracking-wider text-[#6B7280] mb-4">
                {t("forStudents")}
              </h4>
              <ul className="space-y-3 text-sm text-[#2D2D2D]">
                <li>
                  <Link href="/search" className="hover:text-[#7C9082] transition-colors">
                    {t("findStudios")}
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="hover:text-[#7C9082] transition-colors">
                    {t("browseClasses")}
                  </Link>
                </li>
                <li>
                  <Link href="/auth/signup" className="hover:text-[#7C9082] transition-colors">
                    {tc("signUp")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm uppercase tracking-wider text-[#6B7280] mb-4">
                {t("forOwnersLink")}
              </h4>
              <ul className="space-y-3 text-sm text-[#2D2D2D]">
                <li>
                  <Link href="/auth/signup" className="hover:text-[#7C9082] transition-colors">
                    {t("listYourStudio")}
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-[#7C9082] transition-colors">
                    {t("dashboard")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-12 pt-8 border-t border-[#7C9082]/10 text-sm text-[#6B7280] font-light">
            © {new Date().getFullYear()} YogaHub. {t("copyright")}
          </div>
        </div>
      </footer>
    </div>
  );
}
