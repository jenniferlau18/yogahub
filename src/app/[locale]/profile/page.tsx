import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage() {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Get their profile (with role info)
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-[#FAFAF8] py-12 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-semibold text-[#2D2D2D] mb-8">
          Your Profile
        </h1>
        <ProfileForm
          userId={user.id}
          initialData={{
            full_name: profile?.full_name ?? "",
            phone: profile?.phone ?? "",
            role: profile?.role ?? "student",
          }}
          userEmail={user.email ?? ""}
        />
      </div>
    </div>
  );
}
