import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReviewForm } from "./review-form";

export async function ReviewSection({
  studioId,
  userId,
}: {
  studioId: number;
  userId?: string;
}) {
  const supabase = await createClient();

  // Get reviews with author names
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, profiles(full_name, avatar_url)")
    .eq("studio_id", studioId)
    .order("created_at", { ascending: false })
    .limit(20);

  // Check if current user already reviewed
  let hasReviewed = false;
  if (userId) {
    const { data: existing } = await supabase
      .from("reviews")
      .select("id")
      .eq("author_id", userId)
      .eq("studio_id", studioId)
      .limit(1);
    hasReviewed = !!(existing && existing.length > 0);
  }

  const avgRating =
    reviews && reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-[#2D2D2D]">
          Reviews{" "}
          {avgRating && (
            <span className="text-lg text-yellow-500 ml-2">
              ⭐ {avgRating} ({reviews?.length ?? 0})
            </span>
          )}
        </h2>
      </div>

      {/* Review Form */}
      {userId && !hasReviewed && (
        <div className="mb-6">
          <ReviewForm studioId={studioId} />
        </div>
      )}

      {/* Review List */}
      {!reviews || reviews.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500">
              No reviews yet. Be the first to share your experience!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {review.profiles?.full_name ?? "Anonymous"}
                  </CardTitle>
                  <span className="text-yellow-500 text-sm">
                    {"⭐".repeat(review.rating)}
                  </span>
                </div>
              </CardHeader>
              {review.comment && (
                <CardContent>
                  <p className="text-sm text-gray-600">{review.comment}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
