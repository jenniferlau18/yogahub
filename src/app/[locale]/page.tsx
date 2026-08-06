import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, CalendarCheck, Heart, ArrowRight, Sparkles } from "lucide-react";

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch featured studios (recent ones)
  const { data: studios } = await supabase
    .from("studios")
    .select("id, name, city, description")
    .limit(6)
    .order("created_at", { ascending: false });

  // Fetch yoga styles for quick links
  const { data: styles } = await supabase
    .from("yoga_styles")
    .select("id, name")
    .limit(8);

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Navbar />

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#E8EDE8] via-[#FAFAF8] to-[#F0EBE3]">
        {/* Subtle decorative blobs */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#7C9082]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-20 w-96 h-96 bg-[#7C9082]/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge
              variant="secondary"
              className="mb-4 bg-white/60 backdrop-blur border-[#7C9082]/20"
            >
              <Sparkles className="h-3 w-3 mr-1 text-[#7C9082]" />
              Find Your Flow
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-[#2D2D2D]">
              Find Your Yoga Rhythm
            </h1>

            <p className="text-lg md:text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
              Discover yoga studios near you, book classes instantly, and find
              your perfect practice — all in one place.
            </p>

            {/* Search Pill */}
            <form action="/search" method="GET" className="flex items-center gap-0 max-w-xl mx-auto bg-white rounded-full border shadow-lg p-1.5">
              <Search className="h-5 w-5 text-gray-400 ml-4 shrink-0" />
              <Input
                name="q"
                placeholder="Search studios, styles, or cities..."
                className="border-0 shadow-none focus-visible:ring-0 text-base h-10"
              />
              <Button
                type="submit"
                className="rounded-full bg-[#7C9082] hover:bg-[#6B7D71] px-6 h-10"
              >
                Search
              </Button>
            </form>

            {/* Quick Style Pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {styles?.map((style) => (
                <Link
                  key={style.id}
                  href={`/search?style=${style.id}`}
                >
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-[#7C9082]/10 border-[#7C9082]/20 text-[#2D2D2D] px-3 py-1.5 transition-colors"
                  >
                    {style.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#2D2D2D]">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Step 1 */}
          <Card className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-8 pb-6">
              <div className="w-14 h-14 rounded-full bg-[#7C9082]/10 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-7 w-7 text-[#7C9082]" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#2D2D2D]">
                Find a Studio
              </h3>
              <p className="text-gray-500">
                Browse yoga studios in your area. Filter by style, difficulty,
                and location.
              </p>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-8 pb-6">
              <div className="w-14 h-14 rounded-full bg-[#7C9082]/10 flex items-center justify-center mx-auto mb-4">
                <CalendarCheck className="h-7 w-7 text-[#7C9082]" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#2D2D2D]">
                Book a Class
              </h3>
              <p className="text-gray-500">
                Pick a session that fits your schedule. One click and you&apos;re
                in — no hassle.
              </p>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-8 pb-6">
              <div className="w-14 h-14 rounded-full bg-[#7C9082]/10 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-7 w-7 text-[#7C9082]" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#2D2D2D]">
                Practice & Enjoy
              </h3>
              <p className="text-gray-500">
                Show up, roll out your mat, and enjoy. Leave a review to help
                others discover great studios.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── For Studio Owners CTA ── */}
      <section className="bg-[#7C9082]">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Are You a Studio Owner?
          </h2>
          <p className="text-[#E8EDE8] mb-8 max-w-xl mx-auto text-lg">
            List your studio, manage class schedules, and reach more students —
            with fair pricing that respects small businesses.
          </p>
          <Link href="/auth/signup">
            <Button
              size="lg"
              variant="secondary"
              className="font-semibold"
            >
              List Your Studio
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Featured Studios ── */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-[#2D2D2D]">
            Featured Studios
          </h2>
          <Link href="/search">
            <Button variant="ghost" className="text-[#7C9082]">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {!studios || studios.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🧘</div>
            <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">
              No studios yet
            </h3>
            <p className="text-gray-500 mb-6">
              Be the first! Studio owners, sign up to get featured here.
            </p>
            <Link href="/auth/signup">
              <Button className="bg-[#7C9082] hover:bg-[#6B7D71]">
                List Your Studio <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {studios.map((studio) => (
              <Link key={studio.id} href={`/studios/${studio.id}`}>
                <Card className="hover:shadow-lg transition-shadow border-0 shadow-md h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-full bg-[#7C9082]/10 flex items-center justify-center mb-4">
                      <MapPin className="h-6 w-6 text-[#7C9082]" />
                    </div>
                    <h3 className="font-semibold text-lg text-[#2D2D2D] mb-1">
                      {studio.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-2">
                      📍 {studio.city}
                    </p>
                    {studio.description && (
                      <p className="text-sm text-gray-500 line-clamp-2">
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
      <footer className="border-t bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="font-bold text-lg mb-3 text-[#2D2D2D]">
                🧘 YogaHub
              </h3>
              <p className="text-sm text-gray-500">
                Connecting students with yoga studios. Fair, simple, local.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-[#2D2D2D]">
                For Students
              </h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <Link href="/search" className="hover:text-[#7C9082]">
                    Find Studios
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="hover:text-[#7C9082]">
                    Browse Classes
                  </Link>
                </li>
                <li>
                  <Link href="/auth/signup" className="hover:text-[#7C9082]">
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-[#2D2D2D]">
                For Owners
              </h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <Link href="/auth/signup" className="hover:text-[#7C9082]">
                    List Your Studio
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-[#7C9082]">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-10 pt-6 border-t text-sm text-gray-400">
            © {new Date().getFullYear()} YogaHub. Built with 💚 for the yoga community.
          </div>
        </div>
      </footer>
    </div>
  );
}
