import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReviewSection } from "./review-section";

type Params = { params: Promise<{ id: string }> };

export default async function StudioPage({ params }: Params) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: studio } = await supabase
    .from("studios")
    .select("*")
    .eq("id", id)
    .single();

  if (!studio) notFound();

  // Get current user (optional — not required to view)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get classes for this studio
  const { data: classes } = await supabase
    .from("classes")
    .select("*, yoga_styles(name)")
    .eq("studio_id", id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Studio Header */}
        <div className="mb-8">
          <Link
            href="/search"
            className="text-sm text-[#7C9082] hover:underline mb-4 inline-block"
          >
            ← Back to search
          </Link>
          <h1 className="text-3xl font-bold text-[#2D2D2D] mt-2">
            {studio.name}
          </h1>
          <div className="flex flex-wrap gap-2 mt-3 text-gray-500 text-sm">
            {studio.city && <span>📍 {studio.city}</span>}
            {studio.address && <span>· {studio.address}</span>}
            {studio.phone && <span>· 📞 {studio.phone}</span>}
          </div>
          {studio.website && (
            <a
              href={studio.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#7C9082] hover:underline mt-2 inline-block"
            >
              🌐 Visit website →
            </a>
          )}
        </div>

        {/* Description */}
        {studio.description && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {studio.description}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Amenities */}
        {studio.amenities && studio.amenities.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-[#2D2D2D] mb-3">
              Amenities
            </h2>
            <div className="flex flex-wrap gap-2">
              {studio.amenities.map((a: string) => (
                <Badge key={a} variant="secondary">
                  {a}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Classes */}
        <div>
          <h2 className="text-xl font-semibold text-[#2D2D2D] mb-4">
            Classes ({classes?.length ?? 0})
          </h2>

          {!classes || classes.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-gray-500">
                  No classes listed yet. Check back soon!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {classes.map((cls) => (
                <Link key={cls.id} href={`/classes/${cls.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{cls.title}</CardTitle>
                      </div>
                      <CardDescription>
                        {cls.yoga_styles?.name ?? "General"} ·{" "}
                        {cls.difficulty}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {cls.instructor_name && (
                        <p className="text-sm text-gray-500 mb-1">
                          🧘 {cls.instructor_name}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-gray-500">
                          ⏱ {cls.duration_minutes} min · 👥 {cls.capacity} spots
                        </span>
                        <span className="font-semibold text-[#7C9082]">
                          {cls.price > 0 ? `$${cls.price}` : "Free"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Reviews */}
        <div className="mt-12">
          <ReviewSection studioId={parseInt(id)} userId={user?.id} />
        </div>
      </div>
    </div>
  );
}
