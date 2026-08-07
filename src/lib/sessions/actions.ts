"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createSession(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not logged in" };

  const classId = parseInt(formData.get("classId") as string);
  const date = formData.get("date") as string;
  const time = formData.get("time") as string;
  const spotsStr = formData.get("spots") as string;

  if (!classId || !date || !time) return { error: "Missing fields" };

  // Verify this class belongs to one of the user's studios
  const { data: cls } = await supabase
    .from("classes")
    .select("id, capacity, duration_minutes, studios!inner(owner_id)")
    .eq("id", classId)
    .eq("studios.owner_id", user.id)
    .single();

  if (!cls) return { error: "Class not found or not yours" };

  const startTime = `${date}T${time}:00+08:00`;
  const spots = spotsStr ? parseInt(spotsStr) : cls.capacity;
  // Calculate end time from duration
  const endDate = new Date(`${date}T${time}:00+08:00`);
  endDate.setMinutes(endDate.getMinutes() + cls.duration_minutes);
  const endTime = endDate.toISOString().replace("Z", "+08:00");

  const { error } = await supabase.from("class_sessions").insert({
    class_id: classId,
    start_time: startTime,
    end_time: endTime,
    available_spots: spots,
    status: "scheduled",
    created_by: user.id,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/schedule");
  return { success: true };
}

export async function createSessionsBulk(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not logged in" };

  const csvText = formData.get("csv") as string;
  if (!csvText) return { error: "No CSV data" };

  const lines = csvText.trim().split("\n");
  if (lines.length < 2) return { error: "CSV must have header + at least one row" };

  // Parse header
  const header = lines[0].toLowerCase().split(",").map((h) => h.trim());

  // Get all classes for this owner
  const { data: classes } = await supabase
    .from("classes")
    .select("id, title, capacity, duration_minutes, studios!inner(owner_id)")
    .eq("studios.owner_id", user.id);

  if (!classes?.length) return { error: "No classes found for your studio" };

  const classByName: Record<string, typeof classes[0]> = {};
  classes.forEach((c) => {
    classByName[c.title.toLowerCase()] = c;
  });

  let created = 0;
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",").map((c) => c.trim());
    if (cols.length < 3) continue;

    const row: Record<string, string> = {};
    header.forEach((h, j) => { row[h] = cols[j] ?? ""; });

    const title = row["class"] || row["title"] || "";
    const date = row["date"] || "";
    const time = row["time"] || "";
    const spots = row["spots"] || row["capacity"] || "";

    const cls = classByName[title.toLowerCase()];
    if (!cls) {
      errors.push(`Row ${i}: Class "${title}" not found`);
      continue;
    }

    const startTime = `${date}T${time}:00+08:00`;
    const spotCount = spots ? parseInt(spots) : cls.capacity;
    const endDate = new Date(`${date}T${time}:00+08:00`);
    endDate.setMinutes(endDate.getMinutes() + cls.duration_minutes);
    const endTimeStr = endDate.toISOString().replace("Z", "+08:00");

    const { error } = await supabase.from("class_sessions").insert({
      class_id: cls.id,
      start_time: startTime,
      end_time: endTimeStr,
      available_spots: spotCount,
      status: "scheduled",
      created_by: user.id,
    });

    if (error) {
      errors.push(`Row ${i}: ${error.message}`);
    } else {
      created++;
    }
  }

  revalidatePath("/dashboard/schedule");
  return {
    success: created > 0,
    message: `Created ${created} sessions.${errors.length ? ` ${errors.length} errors: ${errors.slice(0, 3).join("; ")}` : ""}`,
  };
}

export async function deleteSession(sessionId: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not logged in" };

  // Verify ownership via class → studio → owner
  const { data: session } = await supabase
    .from("class_sessions")
    .select("id, classes!inner(studio_id, studios!inner(owner_id))")
    .eq("id", sessionId)
    .single();

  if (!session || (session.classes as any)?.studios?.owner_id !== user.id) {
    return { error: "Session not found or not yours" };
  }

  await supabase.from("class_sessions").delete().eq("id", sessionId);
  revalidatePath("/dashboard/schedule");
  return { success: true };
}
