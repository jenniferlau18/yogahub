import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EditStudioForm } from "./edit-form";

type Params = { params: Promise<{ id: string }> };

export default async function EditStudioPage({ params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: studio } = await supabase
    .from("studios")
    .select("*")
    .eq("id", id)
    .eq("owner_id", user!.id)
    .single();

  if (!studio) notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-[#2D2D2D] mb-2">
        Edit Studio
      </h1>
      <p className="text-gray-500 mb-8">Update your studio details.</p>
      <EditStudioForm studio={studio} />
    </div>
  );
}
