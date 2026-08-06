import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NewClassForm } from "./new-class-form";

type Params = { params: Promise<{ id: string }> };

export default async function NewClassPage({ params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Verify studio ownership
  const { data: studio } = await supabase
    .from("studios")
    .select("name")
    .eq("id", id)
    .eq("owner_id", user!.id)
    .single();

  if (!studio) notFound();

  // Get yoga styles for dropdown
  const { data: styles } = await supabase
    .from("yoga_styles")
    .select("id, name")
    .order("name");

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-[#2D2D2D] mb-2">
        Add Class to {studio.name}
      </h1>
      <p className="text-gray-500 mb-8">
        Define a class that students can book. You'll create sessions (dates &
        times) later.
      </p>
      <NewClassForm studioId={parseInt(id)} styles={styles ?? []} />
    </div>
  );
}
