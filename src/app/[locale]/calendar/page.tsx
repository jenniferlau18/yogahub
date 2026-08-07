import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { CalendarGrid } from "./calendar-grid";

export type Session = {
  id: number;
  start_time: string;
  end_time: string;
  available_spots: number;
  class_id: number;
  class_title: string;
  class_difficulty: string;
  class_duration: number;
  class_price: number;
  studio_name: string;
  studio_city: string;
  style_name: string;
};

export default async function CalendarPage() {
  const supabase = await createClient();

  const { data: raw } = await supabase
    .from("class_sessions")
    .select(
      "id, start_time, end_time, available_spots, class_id, classes!inner(title, difficulty, duration_minutes, price, studios!inner(name, city), yoga_styles(name))"
    )
    .gte("start_time", "2026-08-01")
    .lte("start_time", "2026-09-30")
    .eq("status", "scheduled")
    .order("start_time", { ascending: true });

  const sessions: Session[] = (raw ?? []).map((s: any) => ({
    id: s.id,
    start_time: s.start_time,
    end_time: s.end_time,
    available_spots: s.available_spots,
    class_id: s.class_id,
    class_title: s.classes?.title ?? "",
    class_difficulty: s.classes?.difficulty ?? "beginner",
    class_duration: s.classes?.duration_minutes ?? 60,
    class_price: s.classes?.price ?? 0,
    studio_name: s.classes?.studios?.name ?? "",
    studio_city: s.classes?.studios?.city ?? "",
    style_name: s.classes?.yoga_styles?.name ?? "",
  }));

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-[#2D2D2D] mb-6">
          Class Calendar
        </h1>
        <CalendarGrid sessions={sessions} />
      </div>
    </div>
  );
}
