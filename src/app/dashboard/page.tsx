import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get owner's studios
  const { data: studios } = await supabase
    .from("studios")
    .select("*")
    .eq("owner_id", user!.id)
    .order("created_at", { ascending: false });

  // Get upcoming classes across all owner's studios
  const studioIds = studios?.map((s) => s.id) ?? [];
  const { data: upcomingClasses } =
    studioIds.length > 0
      ? await supabase
          .from("classes")
          .select("id, title, studio_id")
          .in("studio_id", studioIds)
      : { data: [] };

  // Get recent bookings
  const classIds = upcomingClasses?.map((c) => c.id) ?? [];
  const { data: recentBookings } =
    classIds.length > 0
      ? await supabase
          .from("bookings")
          .select("id, status, booked_at, session_id")
          .in(
            "session_id",
            (
              await supabase
                .from("class_sessions")
                .select("id")
                .in("class_id", classIds)
            ).data?.map((s) => s.id) ?? []
          )
          .order("booked_at", { ascending: false })
          .limit(5)
      : { data: [] };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-[#2D2D2D]">Dashboard</h1>
        <Link href="/dashboard/studios/new">
          <Button className="bg-[#7C9082] hover:bg-[#6B7D71]">
            ➕ Add Studio
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Studios</CardDescription>
            <CardTitle className="text-3xl">{studios?.length ?? 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Classes</CardDescription>
            <CardTitle className="text-3xl">
              {upcomingClasses?.length ?? 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Recent Bookings</CardDescription>
            <CardTitle className="text-3xl">
              {recentBookings?.length ?? 0}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Studios List */}
      <h2 className="text-lg font-semibold text-[#2D2D2D] mb-4">Your Studios</h2>
      {!studios || studios.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-4xl mb-3">🏠</p>
            <h3 className="font-semibold text-[#2D2D2D] mb-1">
              No studios yet
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              Create your first studio listing to start receiving bookings.
            </p>
            <Link href="/dashboard/studios/new">
              <Button className="bg-[#7C9082] hover:bg-[#6B7D71]">
                Create Your First Studio
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {studios.map((studio) => (
            <Card key={studio.id}>
              <CardHeader>
                <CardTitle>{studio.name}</CardTitle>
                <CardDescription>
                  {studio.city || "No city set"} · Created{" "}
                  {new Date(studio.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                  {studio.description || "No description yet"}
                </p>
                <div className="flex gap-2">
                  <Link href={`/dashboard/studios/${studio.id}`}>
                    <Button variant="outline" size="sm">
                      ✏️ Edit
                    </Button>
                  </Link>
                  <Link href={`/dashboard/studios/${studio.id}/classes`}>
                    <Button variant="outline" size="sm">
                      📅 Classes
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
