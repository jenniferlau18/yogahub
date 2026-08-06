"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ReviewForm({ studioId }: { studioId: number }) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) return;

    setSubmitting(true);
    setMessage("");

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Please sign in to leave a review.");
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.from("reviews").insert({
      studio_id: studioId,
      author_id: user.id,
      rating,
      comment: comment || null,
    });

    if (error) {
      if (error.code === "23505") {
        setMessage("You've already reviewed this studio.");
      } else {
        setMessage("Something went wrong. Try again.");
      }
    } else {
      setMessage("✅ Review submitted! Thank you.");
      setRating(0);
      setComment("");
      router.refresh();
    }
    setSubmitting(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Rating */}
          <div className="space-y-1">
            <Label>Rating</Label>
            <div className="flex gap-1 text-2xl">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`transition-colors ${
                    star <= (hovered || rating)
                      ? "text-yellow-400"
                      : "text-gray-200"
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Comment (optional)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              rows={3}
            />
          </div>

          {message && (
            <p
              className={`text-sm p-3 rounded-md ${
                message.startsWith("✅")
                  ? "text-green-600 bg-green-50"
                  : "text-red-500 bg-red-50"
              }`}
            >
              {message}
            </p>
          )}

          <Button
            type="submit"
            disabled={rating === 0 || submitting}
            className="bg-[#7C9082] hover:bg-[#6B7D71]"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
