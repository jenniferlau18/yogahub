import { createClient } from "@/lib/supabase/server";
import { ScheduleContent } from "./schedule-content";

export default async function SchedulePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get studios owned by this user
  const { data: studios } = await supabase
    .from("studios")
    .select("id, name")
    .eq("owner_id", user!.id)
    .order("name");

  if (!studios?.length) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-[#2D2D2D] mb-2">Schedule</h1>
        <p className="text-gray-500">You need to add a studio first.</p>
      </div>
    );
  }

  const studioIds = studios.map((s) => s.id);

  // Get classes for these studios
  const { data: classes } = await supabase
    .from("classes")
    .select("id, title, studio_id, duration_minutes, capacity, studios!inner(name)")
    .in("studio_id", studioIds)
    .order("title");

  // Get sessions for these classes
  const { data: rawSessions } = await supabase
    .from("class_sessions")
    .select(
      `id, start_time, end_time, available_spots, status, class_id, created_by,
       classes!inner(title, difficulty, duration_minutes, price, studio_id, studios!inner(name, city))`
    )
    .in("class_id", (classes ?? []).map((c) => c.id))
    .gte("start_time", "2026-08-01")
    .lte("start_time", "2026-09-30")
    .order("start_time", { ascending: true });

  // Get creator profiles for created_by display
  const creatorIds = [...new Set((rawSessions ?? []).map((s) => s.created_by).filter(Boolean))] as string[];
  const { data: creators } = creatorIds.length > 0
    ? await supabase.from("profiles").select("id, full_name").in("id", creatorIds)
    : { data: [] };
  const creatorMap: Record<string, string> = {};
  creators?.forEach((p) => { creatorMap[p.id] = p.full_name ?? "Unknown"; });

  const sessions = (rawSessions ?? []).map((s: any) => ({
    id: s.id,
    start_time: s.start_time,
    end_time: s.end_time,
    available_spots: s.available_spots,
    status: s.status,
    class_id: s.class_id,
    class_title: s.classes?.title ?? "",
    class_difficulty: s.classes?.difficulty ?? "beginner",
    class_duration: s.classes?.duration_minutes ?? 60,
    class_price: s.classes?.price ?? 0,
    studio_name: s.classes?.studios?.name ?? "",
    studio_city: s.classes?.studios?.city ?? "",
    created_by_name: creatorMap[s.created_by] ?? "",
  }));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#2D2D2D] mb-6">
        📅 Class Schedule
      </h1>
      <ScheduleContent
        sessions={sessions}
        classes={(classes ?? []).map((c) => ({
          id: c.id,
          title: c.title,
          studio_id: c.studio_id,
          studio_name: (c.studios as any)?.name ?? "",
          duration_minutes: c.duration_minutes,
          capacity: c.capacity,
        }))}
      />
    </div>
  );
}
