import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SessionBookButton } from "./session-book-button";

type Params = { params: Promise<{ id: string }> };

export default async function ClassPage({ params }: Params) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: cls } = await supabase
    .from("classes")
    .select("*, studios(*), yoga_styles(name)")
    .eq("id", id)
    .single();

  if (!cls) notFound();

  // Get upcoming sessions
  const now = new Date().toISOString();
  const { data: sessions } = await supabase
    .from("class_sessions")
    .select("*")
    .eq("class_id", id)
    .eq("status", "scheduled")
    .gte("start_time", now)
    .order("start_time", { ascending: true })
    .limit(10);

  // Get current user and their bookings
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userBookedSessionIds: number[] = [];
  if (user) {
    const { data: bookings } = await supabase
      .from("bookings")
      .select("session_id")
      .eq("student_id", user.id)
      .eq("status", "confirmed");
    userBookedSessionIds = bookings?.map((b) => b.session_id) ?? [];
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link
          href={`/studios/${cls.studio_id}`}
          className="text-sm text-[#7C9082] hover:underline mb-4 inline-block"
        >
          ← Back to {cls.studios?.name ?? "Studio"}
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{cls.title}</CardTitle>
                <CardDescription className="mt-1">
                  {cls.studios?.name ?? ""} ·{" "}
                  {cls.yoga_styles?.name ?? "General"}
                </CardDescription>
              </div>
              <Badge
                className={
                  cls.difficulty === "beginner"
                    ? "bg-green-100 text-green-700"
                    : cls.difficulty === "intermediate"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }
              >
                {cls.difficulty}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Key Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <InfoBox icon="⏱" label="Duration" value={`${cls.duration_minutes} min`} />
              <InfoBox icon="👥" label="Capacity" value={`${cls.capacity} spots`} />
              <InfoBox icon="💰" label="Price" value={cls.price > 0 ? `$${cls.price}` : "Free"} />
              <InfoBox icon="🧘" label="Instructor" value={cls.instructor_name || "TBA"} />
            </div>

            {/* Description */}
            {cls.description && (
              <div>
                <h3 className="font-semibold text-[#2D2D2D] mb-2">
                  About This Class
                </h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {cls.description}
                </p>
              </div>
            )}

            {/* Studio Info */}
            <div className="bg-[#F5F0EB] rounded-lg p-4">
              <h3 className="font-semibold text-[#2D2D2D] mb-1">
                {cls.studios?.name}
              </h3>
              <p className="text-sm text-gray-500">
                📍 {cls.studios?.city}{" "}
                {cls.studios?.address ? `· ${cls.studios.address}` : ""}
              </p>
            </div>

            {/* Upcoming Sessions */}
            <div className="pt-4 border-t">
              <h3 className="font-semibold text-[#2D2D2D] mb-4">
                Upcoming Sessions
              </h3>

              {!sessions || sessions.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">
                    No upcoming sessions scheduled yet.
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Check back soon or contact the studio.
                  </p>
                </div>
              ) : !user ? (
                <div>
                  {sessions.map((session) => (
                    <SessionRow
                      key={session.id}
                      session={session}
                      booked={false}
                      requiresAuth
                    />
                  ))}
                  <div className="text-center mt-4">
                    <Link href={`/auth/login`}>
                      <Button className="bg-[#7C9082] hover:bg-[#6B7D71]">
                        Sign In to Book
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {sessions.map((session) => (
                    <SessionRow
                      key={session.id}
                      session={session}
                      booked={userBookedSessionIds.includes(session.id)}
                      requiresAuth={false}
                    />
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SessionRow({
  session,
  booked,
  requiresAuth,
}: {
  session: {
    id: number;
    start_time: string;
    end_time: string;
    available_spots: number;
  };
  booked: boolean;
  requiresAuth: boolean;
}) {
  const spotsLeft = session.available_spots;
  const isFull = spotsLeft <= 0;

  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
      <div>
        <p className="font-medium text-[#2D2D2D]">
          {new Date(session.start_time).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </p>
        <p className="text-sm text-gray-500">
          {new Date(session.start_time).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          —{" "}
          {new Date(session.end_time).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
      <div className="flex items-center gap-3">
        {isFull ? (
          <span className="text-sm text-red-500 font-medium">Full</span>
        ) : (
          <span className="text-sm text-gray-400">
            {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left
          </span>
        )}
        {booked ? (
          <Badge className="bg-green-100 text-green-700">Booked</Badge>
        ) : (
          <SessionBookButton sessionId={session.id} disabled={isFull || requiresAuth} />
        )}
      </div>
    </div>
  );
}

function InfoBox({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="text-center p-3 bg-white rounded-lg border border-gray-100">
      <div className="text-xl mb-1">{icon}</div>
      <div className="text-xs text-gray-400">{label}</div>
      <div className="text-sm font-medium text-[#2D2D2D]">{value}</div>
    </div>
  );
}
