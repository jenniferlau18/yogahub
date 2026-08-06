import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreateSessionForm } from "./create-form";
import { DeleteSessionButton } from "./delete-button";

type Params = { params: Promise<{ id: string; classId: string }> };

export default async function SessionsPage({ params }: Params) {
  const { id, classId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Verify ownership
  const { data: studio } = await supabase
    .from("studios")
    .select("name")
    .eq("id", id)
    .eq("owner_id", user!.id)
    .single();

  if (!studio) notFound();

  const { data: cls } = await supabase
    .from("classes")
    .select("title, capacity, duration_minutes")
    .eq("id", classId)
    .eq("studio_id", id)
    .single();

  if (!cls) notFound();

  // Get sessions
  const { data: sessions } = await supabase
    .from("class_sessions")
    .select("*")
    .eq("class_id", classId)
    .order("start_time", { ascending: true });

  // Count bookings per session
  const sessionIds = sessions?.map((s) => s.id) ?? [];
  const { data: bookingCounts } =
    sessionIds.length > 0
      ? await supabase
          .from("bookings")
          .select("session_id, status")
          .in("session_id", sessionIds)
          .eq("status", "confirmed")
      : { data: [] };

  const countMap = new Map<number, number>();
  bookingCounts?.forEach((b) => {
    countMap.set(b.session_id, (countMap.get(b.session_id) ?? 0) + 1);
  });

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#2D2D2D]">
            {cls.title} — Sessions
          </h1>
          <p className="text-gray-500">
            Schedule class times for students to book.
          </p>
        </div>
      </div>

      {/* Create Session Form */}
      <CreateSessionForm
        classId={parseInt(classId)}
        studioId={id}
        defaultCapacity={cls.capacity}
        defaultDuration={cls.duration_minutes}
      />

      {/* Session List */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-[#2D2D2D] mb-4">
          Scheduled Sessions ({sessions?.length ?? 0})
        </h2>

        {!sessions || sessions.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-gray-500">No sessions scheduled yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => {
              const isPast = new Date(session.start_time) < new Date();
              const booked = countMap.get(session.id) ?? 0;
              return (
                <Card
                  key={session.id}
                  className={isPast ? "opacity-50" : ""}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">
                          {new Date(session.start_time).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </CardTitle>
                        <CardDescription>
                          {new Date(session.start_time).toLocaleTimeString(
                            "en-US",
                            { hour: "2-digit", minute: "2-digit" }
                          )}{" "}
                          —{" "}
                          {new Date(session.end_time).toLocaleTimeString(
                            "en-US",
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            session.status === "scheduled"
                              ? "default"
                              : session.status === "cancelled"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {session.status}
                        </Badge>
                        {session.status === "scheduled" && !isPast && (
                          <DeleteSessionButton sessionId={session.id} />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      👥 {booked} / {session.available_spots + booked} spots
                      booked
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-8 space-x-2">
        <Link href={`/dashboard/studios/${id}/classes`}>
          <Button variant="outline" size="sm">
            ← Back to Classes
          </Button>
        </Link>
      </div>
    </div>
  );
}
