"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { bookSession } from "@/lib/bookings/actions";
import { Button } from "@/components/ui/button";

export function SessionBookButton({
  sessionId,
  disabled,
}: {
  sessionId: number;
  disabled: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleBook() {
    setLoading(true);
    setError("");

    const result = await bookSession(sessionId);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/my-bookings");
    }
  }

  if (error) {
    return (
      <div className="text-right">
        <p className="text-xs text-red-500 mb-1">{error}</p>
        <Button size="sm" variant="outline" onClick={() => setError("")}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <Button
      size="sm"
      onClick={handleBook}
      disabled={disabled || loading}
      className="bg-[#7C9082] hover:bg-[#6B7D71]"
    >
      {loading ? "Booking..." : "Book"}
    </Button>
  );
}
