import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchFilters } from "./search-filters";

type SearchParams = Promise<{
  q?: string;
  style?: string;
  difficulty?: string;
  city?: string;
}>;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const query = sp.q ?? "";
  const styleFilter = sp.style ?? "";
  const difficultyFilter = sp.difficulty ?? "";
  const cityFilter = sp.city ?? "";

  const supabase = await createClient();

  // Get yoga styles for the filter dropdown
  const { data: styles } = await supabase
    .from("yoga_styles")
    .select("id, name")
    .order("name");

  // Build the search query
  let studioQuery = supabase.from("studios").select("*");

  if (query) {
    studioQuery = studioQuery.or(
      `name.ilike.%${query}%,city.ilike.%${query}%`
    );
  }
  if (cityFilter) {
    studioQuery = studioQuery.ilike("city", `%${cityFilter}%`);
  }

  const { data: studios } = await studioQuery.order("created_at", {
    ascending: false,
  });

  // Search classes (if no studios match, also search classes directly)
  let classQuery = supabase
    .from("classes")
    .select("*, studios(name, city), yoga_styles(name)");

  if (query) {
    classQuery = classQuery.or(
      `title.ilike.%${query}%,description.ilike.%${query}%`
    );
  }
  if (styleFilter) {
    classQuery = classQuery.eq("style_id", styleFilter);
  }
  if (difficultyFilter) {
    classQuery = classQuery.eq("difficulty", difficultyFilter);
  }

  const { data: classes } = await classQuery.order("created_at", {
    ascending: false,
  });

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[#2D2D2D] mb-2">
            {query ? `Results for "${query}"` : "Find Yoga Classes"}
          </h1>
          <p className="text-gray-500">
            {studios?.length ?? 0} studios · {classes?.length ?? 0} classes
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <SearchFilters
            currentQuery={query}
            currentStyle={styleFilter}
            currentDifficulty={difficultyFilter}
            currentCity={cityFilter}
            styles={styles ?? []}
          />

          {/* Results */}
          <div className="flex-1 space-y-6">
            {/* Studios */}
            {studios && studios.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-[#2D2D2D] mb-3">
                  Studios
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {studios.map((studio) => (
                    <Link key={studio.id} href={`/studios/${studio.id}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                        <CardHeader>
                          <CardTitle className="text-lg">
                            {studio.name}
                          </CardTitle>
                          <CardDescription>
                            📍 {studio.city || "Unknown location"}
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
              </div>
            )}

            {/* Classes */}
            {classes && classes.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-[#2D2D2D] mb-3">
                  Classes
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {classes.map((cls) => (
                    <Link key={cls.id} href={`/classes/${cls.id}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                        <CardHeader>
                          <CardTitle className="text-lg">
                            {cls.title}
                          </CardTitle>
                          <CardDescription>
                            {cls.studios?.name ?? ""} ·{" "}
                            {cls.yoga_styles?.name ?? "General"} ·{" "}
                            {cls.difficulty}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">
                              ⏱ {cls.duration_minutes} min · 👥 {cls.capacity}{" "}
                              spots
                            </span>
                            <span className="font-medium text-[#7C9082]">
                              {cls.price > 0 ? `$${cls.price}` : "Free"}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {(!studios || studios.length === 0) &&
              (!classes || classes.length === 0) && (
                <Card>
                  <CardContent className="py-16 text-center">
                    <p className="text-5xl mb-4">🔍</p>
                    <h3 className="text-lg font-semibold text-[#2D2D2D] mb-2">
                      No results found
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Try a different search term or browse all studios.
                    </p>
                    <Link href="/search">
                      <Button variant="outline">Show All Studios</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
