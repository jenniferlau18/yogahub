import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchFilters } from "./search-filters";
import { HK_DISTRICTS, getAllDistricts, type Region } from "@/lib/hk-districts";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

type SearchParams = Promise<{
  q?: string;
  style?: string;
  difficulty?: string;
  region?: string;
  district?: string;
  date?: string;
  lat?: string;
  lng?: string;
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
  const regionFilter = sp.region ?? "";
  const districtFilter = sp.district ?? "";
  const dateFilter = sp.date ?? "";

  const supabase = await createClient();

  // Get yoga styles for the filter dropdown
  const { data: styles } = await supabase
    .from("yoga_styles")
    .select("id, name")
    .order("name");

  // Determine which districts to filter by
  let cityFilter: string[] = [];
  if (districtFilter && districtFilter !== "all") {
    cityFilter = [districtFilter];
  } else if (regionFilter && regionFilter !== "all") {
    cityFilter = HK_DISTRICTS[regionFilter as Region] ?? [];
  }

  // Build studio query
  let studioQuery = supabase.from("studios").select("*");

  if (query) {
    studioQuery = studioQuery.or(
      `name.ilike.%${query}%,description.ilike.%${query}%`
    );
  }

  // Apply city/district filter
  if (cityFilter.length > 0) {
    // Build OR filter for multiple cities
    const cityConditions = cityFilter.map(
      (_c, i) => `city.ilike.%${cityFilter[i]}%`
    );
    studioQuery = studioQuery.or(cityConditions.join(","));
  }

  const { data: studios } = await studioQuery.order("created_at", {
    ascending: false,
  });

  // Studio IDs for filtering classes
  const studioIds = studios?.map((s) => s.id) ?? [];

  // Query classes
  let classQuery = supabase
    .from("classes")
    .select("*, studios!inner(name, city), yoga_styles(name)");

  if (query) {
    classQuery = classQuery.or(
      `title.ilike.%${query}%,description.ilike.%${query}%`
    );
  }
  if (styleFilter) {
    classQuery = classQuery.eq("style_id", parseInt(styleFilter));
  }
  if (difficultyFilter) {
    classQuery = classQuery.eq("difficulty", difficultyFilter);
  }
  if (studioIds.length > 0) {
    classQuery = classQuery.in("studio_id", studioIds);
  } else if (cityFilter.length > 0) {
    // If no studios matched but city filter is active, show nothing
    classQuery = classQuery.in("studio_id", [0]); // Empty set
  }

  const { data: classes } = await classQuery.order("created_at", {
    ascending: false,
  });

  // ── Session query (when date is selected) ──
  let sessions: any[] | null = null;

  if (dateFilter) {
    const startOfDay = `${dateFilter}T00:00:00+08:00`;
    const endOfDay = `${dateFilter}T23:59:59+08:00`;

    let sessionQuery = supabase
      .from("class_sessions")
      .select(
        "id, start_time, end_time, available_spots, class_id, classes!inner(title, difficulty, duration_minutes, price, studios!inner(name, city), yoga_styles(name))"
      )
      .gte("start_time", startOfDay)
      .lte("start_time", endOfDay)
      .eq("status", "scheduled");

    // Filter by studio if region/district is set
    if (cityFilter.length > 0) {
      // We need to filter sessions by studio city — do this via classes.studio_id
      const studioIdsForCity = studios?.map((s) => s.id) ?? [];
      if (studioIdsForCity.length > 0) {
        sessionQuery = sessionQuery.in(
          "class_id",
          classes?.map((c) => c.id) ?? []
        );
      }
    }

    if (styleFilter) {
      sessionQuery = sessionQuery.eq("classes.style_id", parseInt(styleFilter));
    }
    if (difficultyFilter) {
      sessionQuery = sessionQuery.eq("classes.difficulty", difficultyFilter);
    }

    const { data: sessionData } = await sessionQuery
      .order("start_time", { ascending: true })
      .limit(50);

    sessions = sessionData;
  }

  // Build a title for the results
  const filters: string[] = [];
  if (query) filters.push(`"${query}"`);
  if (districtFilter && districtFilter !== "all") filters.push(districtFilter);
  else if (regionFilter && regionFilter !== "all") filters.push(regionFilter);
  if (dateFilter) filters.push(dateFilter);

  const hasActiveFilters = filters.length > 0;
  const title = hasActiveFilters
    ? `Results for ${filters.join(" · ")}`
    : "Find Yoga Classes";

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[#2D2D2D] mb-2">
            {title}
          </h1>
          <p className="text-gray-500">
            {sessions
              ? `${sessions.length} sessions`
              : `${studios?.length ?? 0} studios · ${classes?.length ?? 0} classes`}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <SearchFilters
            currentQuery={query}
            currentStyle={styleFilter}
            currentDifficulty={difficultyFilter}
            currentRegion={regionFilter}
            currentDistrict={districtFilter}
            currentDate={dateFilter}
            styles={styles ?? []}
          />

          {/* Results */}
          <div className="flex-1 space-y-6">
            {/* Sessions (when date is selected) */}
            {sessions && sessions.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-[#2D2D2D] mb-3 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[#7C9082]" />
                  Sessions on {dateFilter}
                </h2>
                <div className="space-y-3">
                  {sessions.map((session: any) => {
                    const cls = session.classes;
                    const studio = cls?.studios;
                    const startTime = new Date(session.start_time);
                    const timeStr = startTime.toLocaleTimeString("en-HK", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    });
                    return (
                      <Link
                        key={session.id}
                        href={`/classes/${session.class_id}`}
                      >
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-lg">
                                  {cls.title}
                                </CardTitle>
                                <CardDescription>
                                  {studio?.name} · {cls.yoga_styles?.name ?? "General"} · {cls.difficulty}
                                </CardDescription>
                              </div>
                              <Badge
                                variant="outline"
                                className="text-[#7C9082] border-[#7C9082]/30 shrink-0"
                              >
                                {session.available_spots} spots
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {timeStr} · {cls.duration_minutes} min
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {studio?.city}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3.5 w-3.5" />
                                {cls.capacity} capacity
                              </span>
                              {cls.price > 0 && (
                                <span className="font-medium text-[#7C9082]">
                                  ${cls.price}
                                </span>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sessions empty state */}
            {sessions !== null && sessions.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="h-10 w-10 text-[#7C9082]/30 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-[#2D2D2D] mb-2">
                    No sessions on this date
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Try a different date, or check back later.
                  </p>
                  <Link href="/search">
                    <Button variant="outline">Clear Date</Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Studios (no date selected) */}
            {!dateFilter && studios && studios.length > 0 && (
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

            {/* Classes (no date selected) */}
            {!dateFilter && classes && classes.length > 0 && (
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
            {!dateFilter &&
              (!studios || studios.length === 0) &&
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
