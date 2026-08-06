import { redirect } from "next/navigation";
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
import { CancelBookingButton } from "./cancel-button";

export default async function MyBookingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // Get bookings
  const { data: bookings } = await supabase
    .from("bookings")
    .select("id, status, booked_at, cancelled_at, session_id")
    .eq("student_id", user.id)
    .order("booked_at", { ascending: false });

  if (!bookings || bookings.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAFAF8]">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-semibold text-[#2D2D2D] mb-8">
            My Bookings
          </h1>
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-4xl mb-3">📅</p>
              <h3 className="font-semibold text-[#2D2D2D] mb-1">
                No bookings yet
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Find a class and book your spot!
              </p>
              <Link href="/search">
                <Button className="bg-[#7C9082] hover:bg-[#6B7D71]">
                  Find Classes
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Get session details for all bookings
  const sessionIds = bookings.map((b) => b.session_id).filter(Boolean);
  const { data: sessions } = await supabase
    .from("class_sessions")
    .select("id, start_time, end_time, class_id")
    .in("id", sessionIds);

  // Get class details for all sessions
  const classIds = sessions?.map((s) => s.class_id).filter(Boolean) ?? [];
  const { data: classes } = await supabase
    .from("classes")
    .select("id, title, instructor_name, duration_minutes, studio_id")
    .in("id", classIds);

  // Get studio names
  const studioIds = classes?.map((c) => c.studio_id).filter(Boolean) ?? [];
  const { data: studios } = await supabase
    .from("studios")
    .select("id, name, city")
    .in("id", studioIds);

  // Build lookup maps
  const sessionMap = new Map(sessions?.map((s) => [s.id, s]) ?? []);
  const classMap = new Map(classes?.map((c) => [c.id, c]) ?? []);
  const studioMap = new Map(studios?.map((s) => [s.id, s]) ?? []);

  // Build enriched booking data
  const enriched = bookings.map((b) => {
    const session = b.session_id ? sessionMap.get(b.session_id) : null;
    const cls = session ? classMap.get(session.class_id) : null;
    const studio = cls ? studioMap.get(cls.studio_id) : null;
    return { ...b, session, class: cls, studio };
  });

  const now = new Date();
  const upcoming = enriched.filter(
    (b) =>
      b.status === "confirmed" && b.session && new Date(b.session.start_time) > now
  );
  const past = enriched.filter(
    (b) =>
      b.status === "cancelled" ||
      !b.session ||
      new Date(b.session.start_time) <= now
  );

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-[#2D2D2D] mb-8">
          My Bookings
        </h1>

        {/* Upcoming */}
        <h2 className="text-lg font-semibold text-[#2D2D2D] mb-4">
          Upcoming ({upcoming.length})
        </h2>
        {upcoming.length === 0 ? (
          <Card className="mb-8">
            <CardContent className="py-8 text-center">
              <p className="text-4xl mb-3">📅</p>
              <p className="text-gray-500">No upcoming classes booked.</p>
              <Link href="/search">
                <Button className="mt-4 bg-[#7C9082] hover:bg-[#6B7D71]">
                  Find Classes
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3 mb-8">
            {upcoming.map((b) => (
              <Card key={b.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {b.class?.title ?? "Class"}
                      </CardTitle>
                      <CardDescription>
                        {b.studio?.name ?? ""} · {b.studio?.city ?? ""}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-500">
                      📅{" "}
                      {b.session
                        ? new Date(b.session.start_time).toLocaleString()
                        : "TBA"}
                      {b.class?.instructor_name &&
                        ` · 🧘 ${b.class.instructor_name}`}
                    </div>
                    <CancelBookingButton bookingId={b.id} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Past */}
        {past.length > 0 && (
          <>
            <h2 className="text-lg font-semibold text-[#2D2D2D] mb-4">
              Past ({past.length})
            </h2>
            <div className="space-y-3">
              {past.map((b) => (
                <Card key={b.id} className="opacity-60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      {b.class?.title ?? "Class"}
                    </CardTitle>
                    <CardDescription>
                      {b.studio?.name ?? ""}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">
                        {b.session
                          ? new Date(b.session.start_time).toLocaleString()
                          : "TBA"}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          b.status === "cancelled"
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
