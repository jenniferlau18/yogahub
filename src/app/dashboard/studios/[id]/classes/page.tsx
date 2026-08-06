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
import { ClassActions } from "./class-actions";

type Params = { params: Promise<{ id: string }> };

export default async function ClassesPage({ params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get the studio
  const { data: studio } = await supabase
    .from("studios")
    .select("*")
    .eq("id", id)
    .eq("owner_id", user!.id)
    .single();

  if (!studio) notFound();

  // Get classes
  const { data: classes } = await supabase
    .from("classes")
    .select("*, yoga_styles(name)")
    .eq("studio_id", id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#2D2D2D]">
            {studio.name} — Classes
          </h1>
          <p className="text-gray-500">
            Manage the classes offered at this studio.
          </p>
        </div>
        <Link href={`/dashboard/studios/${id}/classes/new`}>
          <Button className="bg-[#7C9082] hover:bg-[#6B7D71]">
            ➕ Add Class
          </Button>
        </Link>
      </div>

      {!classes || classes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-4xl mb-3">📅</p>
            <h3 className="font-semibold text-[#2D2D2D] mb-1">
              No classes yet
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              Add your first class to start accepting bookings.
            </p>
            <Link href={`/dashboard/studios/${id}/classes/new`}>
              <Button className="bg-[#7C9082] hover:bg-[#6B7D71]">
                Add Your First Class
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {classes.map((cls) => (
            <Card key={cls.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{cls.title}</CardTitle>
                    <CardDescription>
                      {cls.yoga_styles?.name ?? "Uncategorized"} ·{" "}
                      {cls.difficulty} · {cls.duration_minutes} min ·{" "}
                      {cls.price > 0 ? `$${cls.price}` : "Free"}
                    </CardDescription>
                  </div>
                  <ClassActions studioId={id} classId={cls.id} />
                </div>
              </CardHeader>
              {cls.description && (
                <CardContent>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {cls.description}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Back link */}
      <div className="mt-8">
        <Link href="/dashboard" className="text-sm text-[#7C9082] hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
