"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cancelBooking } from "@/lib/bookings/actions";
import { Button } from "@/components/ui/button";

export function CancelBookingButton({ bookingId }: { bookingId: number }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleCancel() {
    setLoading(true);
    await cancelBooking(bookingId);
    router.refresh();
    setLoading(false);
    setConfirming(false);
  }

  if (confirming) {
    return (
      <div className="flex gap-1">
        <Button
          size="sm"
          variant="outline"
          className="text-red-500 border-red-200"
          onClick={handleCancel}
          disabled={loading}
        >
          {loading ? "..." : "Yes, cancel"}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setConfirming(false)}
          disabled={loading}
        >
          Keep it
        </Button>
      </div>
    );
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      className="text-gray-400 hover:text-red-500"
      onClick={() => setConfirming(true)}
    >
      Cancel
    </Button>
  );
}
