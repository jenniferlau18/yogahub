import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Home() {
  const supabase = await createClient();

  // Get featured studios (most recent 3)
  const { data: studios } = await supabase
    .from("studios")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Navbar />

      {/* Hero Section */}
      <section className="px-4 pt-20 pb-12 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#2D2D2D] mb-4">
          Your yoga practice,{" "}
          <span className="text-[#7C9082]">simplified</span>
        </h1>
        <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto leading-relaxed">
          Find and book yoga classes near you. Studio owners — list your space
          and reach more students. All with fair pricing that supports small
          studios.
        </p>

        {/* Search Bar */}
        <form action="/search" className="max-w-md mx-auto mb-6">
          <div className="flex gap-2">
            <Input
              name="q"
              placeholder="Search by city or studio name..."
              className="flex-1"
            />
            <Button type="submit" className="bg-[#7C9082] hover:bg-[#6B7D71]">
              Search
            </Button>
          </div>
        </form>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/search">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-[#7C9082] hover:bg-[#6B7D71] text-white px-8"
            >
              🧘 Find Classes
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-[#7C9082] text-[#7C9082] hover:bg-[#7C9082]/10 px-8"
            >
              🏠 List Your Studio
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Studios */}
      {studios && studios.length > 0 && (
        <section className="px-4 pb-12 max-w-5xl mx-auto">
          <h2 className="text-xl font-semibold text-[#2D2D2D] mb-6 text-center">
            Featured Studios
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {studios.map((studio) => (
              <Link key={studio.id} href={`/studios/${studio.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">{studio.name}</CardTitle>
                    <CardDescription>
                      {studio.city || "Unknown location"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {studio.description || "No description yet."}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Features — 3 cards explaining the platform */}
      <section className="px-4 pb-24 max-w-5xl mx-auto">
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="font-semibold text-[#2D2D2D] mb-2">
              Discover Studios
            </h3>
            <p className="text-sm text-gray-500">
              Browse yoga studios near you. Filter by style, difficulty, price,
              and time — find the perfect class.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="text-3xl mb-3">📅</div>
            <h3 className="font-semibold text-[#2D2D2D] mb-2">
              Book Instantly
            </h3>
            <p className="text-sm text-gray-500">
              See real-time availability and reserve your spot in seconds. No
              phone calls, no hassle.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="text-3xl mb-3">🤝</div>
            <h3 className="font-semibold text-[#2D2D2D] mb-2">Fair for All</h3>
            <p className="text-sm text-gray-500">
              We keep fees low so small studios can thrive. More studios, more
              choices, better yoga for everyone.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
