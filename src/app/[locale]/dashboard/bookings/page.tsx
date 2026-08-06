import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function BookingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get owner's studio IDs
  const { data: studios } = await supabase
    .from("studios")
    .select("id, name")
    .eq("owner_id", user!.id);

  const studioIds = studios?.map((s) => s.id) ?? [];

  if (studioIds.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-[#2D2D2D] mb-8">
          Bookings
        </h1>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-4xl mb-3">📋</p>
            <h3 className="font-semibold text-[#2D2D2D] mb-1">
              No studios yet
            </h3>
            <p className="text-gray-500 text-sm">
              Create a studio first, then you'll see bookings here.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get all class IDs for owner's studios
  const { data: classes } = await supabase
    .from("classes")
    .select("id, title, studio_id")
    .in("studio_id", studioIds);

  const classIds = classes?.map((c) => c.id) ?? [];

  // Get sessions for those classes
  const { data: sessions } =
    classIds.length > 0
      ? await supabase
          .from("class_sessions")
          .select("id, start_time, end_time, class_id")
          .in("class_id", classIds)
          .order("start_time", { ascending: false })
      : { data: [] };

  const sessionIds = sessions?.map((s) => s.id) ?? [];

  // Get bookings
  const { data: bookings } =
    sessionIds.length > 0
      ? await supabase
          .from("bookings")
          .select("*, profiles(full_name, email), session_id")
          .in("session_id", sessionIds)
          .order("booked_at", { ascending: false })
          .limit(50)
      : { data: [] };

  // Helper maps
  const studioMap = new Map(studios?.map((s) => [s.id, s.name]) ?? []);
  const classMap = new Map(classes?.map((c) => [c.id, c.title]) ?? []);
  const sessionMap = new Map(
    sessions?.map((s) => [s.id, { start: s.start_time, end: s.end_time, classId: s.class_id }]) ?? []
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#2D2D2D] mb-8">
        Bookings
      </h1>

      {!bookings || bookings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-4xl mb-3">📋</p>
            <h3 className="font-semibold text-[#2D2D2D]">No bookings yet</h3>
            <p className="text-gray-500 text-sm mt-1">
              Bookings will appear here when students start reserving spots.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => {
            const session = sessionMap.get(booking.session_id);
            const classId = session?.classId ?? 0;
            const className = classMap.get(classId) ?? "Unknown Class";

            return (
              <Card key={booking.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">
                        {className}
                      </CardTitle>
                      <CardDescription>
                        {booking.profiles?.full_name ?? "Unknown Student"} ·{" "}
                        {booking.profiles?.email ?? ""}
                      </CardDescription>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Booked: {new Date(booking.booked_at).toLocaleString()}
                    {session && (
                      <>
                        {" · "}Session:{" "}
                        {new Date(session.start).toLocaleString()} —{" "}
                        {new Date(session.end).toLocaleTimeString()}
                      </>
                    )}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
